import QRCode from "qrcode";

export const REDEEM_URL =
  "https://platform.openai.com/settings/organization/billing/promotions";

const LOGO_SRC = "/logos/Codex 256 x 256.png";

let cachedLogo: HTMLImageElement | null = null;

function loadLogo(): Promise<HTMLImageElement> {
  if (cachedLogo) return Promise.resolve(cachedLogo);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cachedLogo = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = LOGO_SRC;
  });
}

export interface QRRenderOptions {
  size?: number;
  margin?: number;
  logoRatio?: number;
}

export async function generateQRDataURL(
  data: string = REDEEM_URL,
  opts: QRRenderOptions = {}
): Promise<string> {
  const size = opts.size ?? 1024;
  const margin = opts.margin ?? 2;
  const logoRatio = opts.logoRatio ?? 0.22;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, data, {
    width: size,
    margin,
    errorCorrectionLevel: "H",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas 2D context");

  const logo = await loadLogo();
  const logoSize = Math.round(size * logoRatio);
  const logoX = Math.round((size - logoSize) / 2);
  const logoY = Math.round((size - logoSize) / 2);

  const pad = Math.round(logoSize * 0.14);
  const bgSize = logoSize + pad * 2;
  const radius = Math.round(bgSize * 0.24);
  const bgX = logoX - pad;
  const bgY = logoY - pad;

  // White outer halo to punch the badge cleanly out of the QR pattern
  const haloPad = Math.round(pad * 0.55);
  ctx.save();
  ctx.fillStyle = "#ffffff";
  roundRect(
    ctx,
    bgX - haloPad,
    bgY - haloPad,
    bgSize + haloPad * 2,
    bgSize + haloPad * 2,
    radius + haloPad
  );
  ctx.fill();
  ctx.restore();

  // Dark badge so the white Codex icon stays visible
  ctx.save();
  ctx.fillStyle = "#0a0a0a";
  roundRect(ctx, bgX, bgY, bgSize, bgSize, radius);
  ctx.fill();
  ctx.restore();

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

  return canvas.toDataURL("image/png");
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function buildRedeemURL(code: string): string {
  return REDEEM_URL;
}

export function parseCodesFromText(input: string): string[] {
  return input
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
