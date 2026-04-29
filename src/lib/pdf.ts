import jsPDF from "jspdf";
import {
  DEFAULT_LOGO_SRC,
  generateQRDataURL,
  type QREntry,
} from "./qr";
import { logoNeedsDarkBadge } from "./theme";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function logoDataURL(img: HTMLImageElement, needsDarkBadge: boolean): string {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No ctx");

  const inset = needsDarkBadge ? size * 0.12 : 0;
  if (needsDarkBadge) {
    const r = size * 0.24;
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
  }

  ctx.drawImage(img, inset, inset, size - inset * 2, size - inset * 2);
  return canvas.toDataURL("image/png");
}

function truncateMiddleToWidth(
  pdf: jsPDF,
  text: string,
  maxWidth: number
): string {
  if (pdf.getTextWidth(text) <= maxWidth) return text;

  const separator = "...";
  let start = Math.ceil((text.length - separator.length) / 2);
  let end = Math.floor((text.length - separator.length) / 2);

  while (start > 4 && end > 4) {
    const candidate = `${text.slice(0, start)}${separator}${text.slice(text.length - end)}`;
    if (pdf.getTextWidth(candidate) <= maxWidth) return candidate;
    if (start >= end) {
      start -= 1;
    } else {
      end -= 1;
    }
  }

  return text.slice(0, Math.max(4, start)) + separator;
}

export interface PDFProgress {
  current: number;
  total: number;
}

export interface PDFOptions {
  footer?: string;
  logoSrc?: string;
  onProgress?: (p: PDFProgress) => void;
}

export async function generatePDF(
  entries: QREntry[],
  options: PDFOptions = {}
): Promise<Blob> {
  const {
    footer,
    logoSrc = DEFAULT_LOGO_SRC,
    onProgress,
  } = options;
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = 210;
  const pageH = 297;
  const marginX = 8;
  const marginY = 10;
  const cols = 3;
  const rows = 3;
  const cellW = (pageW - marginX * 2) / cols;
  const cellH = (pageH - marginY * 2) / rows;

  const logoImg = await loadImage(logoSrc);
  const logoData = logoDataURL(logoImg, logoNeedsDarkBadge(logoSrc));

  const total = entries.length;
  for (let i = 0; i < total; i++) {
    const entry = entries[i];
    const idx = i % 9;
    if (i > 0 && idx === 0) pdf.addPage();

    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = marginX + col * cellW;
    const y = marginY + row * cellH;

    // Dashed cut border
    pdf.setDrawColor(170, 170, 170);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.setLineWidth(0.2);
    pdf.rect(x, y, cellW, cellH);
    pdf.setLineDashPattern([], 0);

    // Label "#N"
    pdf.setTextColor(90, 90, 90);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`#${i + 1}`, x + 3, y + 5);

    // Codex logo top-right
    const logoSize = 7;
    pdf.addImage(
      logoData,
      "PNG",
      x + cellW - logoSize - 3,
      y + 2,
      logoSize,
      logoSize
    );

    // QR code — vertically centered inside the cell, reserving space
    // for the top header (label + logo) and the bottom text block.
    const footerText = (footer ?? "").trim();
    const topReserved = 10;
    const bottomReserved = footerText ? 20 : 14;
    const qrSize = Math.min(
      cellW - 10,
      cellH - topReserved - bottomReserved
    );
    const qrX = x + (cellW - qrSize) / 2;
    const qrY = y + topReserved + (cellH - topReserved - bottomReserved - qrSize) / 2;

    const qrData = await generateQRDataURL(entry.targetUrl, { size: 800, logoSrc });
    pdf.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);

    // URL
    pdf.setTextColor(40, 40, 40);
    pdf.setFontSize(5.4);
    pdf.setFont("helvetica", "normal");
    const visibleUrl = truncateMiddleToWidth(pdf, entry.displayUrl, cellW - 10);
    pdf.text(visibleUrl, x + cellW / 2, qrY + qrSize + 4, { align: "center" });

    // Promo code (prominent)
    pdf.setFont("courier", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const visibleCode = truncateMiddleToWidth(pdf, entry.codeLabel, cellW - 8);
    pdf.text(visibleCode, x + cellW / 2, qrY + qrSize + 10, {
      align: "center",
    });

    // Optional footer (e.g. "Créditos provistos por XXXX")
    if (footerText) {
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(6.5);
      pdf.setTextColor(110, 110, 110);
      const maxWidth = cellW - 6;
      const lines = pdf.splitTextToSize(footerText, maxWidth).slice(0, 2);
      let fy = y + cellH - 4 - (lines.length - 1) * 3;
      for (const line of lines) {
        pdf.text(line, x + cellW / 2, fy, { align: "center" });
        fy += 3;
      }
    }

    onProgress?.({ current: i + 1, total });
  }

  return pdf.output("blob");
}
