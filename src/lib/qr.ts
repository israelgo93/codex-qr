import QRCode from "qrcode";
import { DARK_LOGO_SRC, logoNeedsDarkBadge } from "@/lib/theme";

export type QRType = "api_credits" | "custom_link";

export interface QREntry {
  rawValue: string;
  codeLabel: string;
  targetUrl: string;
  displayUrl: string;
}

export const API_CREDITS_REDEEM_URL =
  "https://platform.openai.com/settings/organization/billing/promotions";
export const CUSTOM_LINK_REDEEM_URL = "https://example.com/redeem?code=";
export const REDEEM_URL = API_CREDITS_REDEEM_URL;

export const DEFAULT_REDEEM_URLS: Record<QRType, string> = {
  api_credits: API_CREDITS_REDEEM_URL,
  custom_link: CUSTOM_LINK_REDEEM_URL,
};

export const DEFAULT_LOGO_SRC = DARK_LOGO_SRC;

const cachedLogos = new Map<string, HTMLImageElement>();
const cachedLogoBounds = new Map<string, ImageCropBounds>();

interface ImageCropBounds {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

function loadLogo(src: string): Promise<HTMLImageElement> {
  const cachedLogo = cachedLogos.get(src);
  if (cachedLogo) return Promise.resolve(cachedLogo);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cachedLogos.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function fullImageBounds(img: HTMLImageElement): ImageCropBounds {
  return {
    sx: 0,
    sy: 0,
    sw: img.naturalWidth || img.width,
    sh: img.naturalHeight || img.height,
  };
}

function getVisibleImageBounds(
  img: HTMLImageElement,
  src: string
): ImageCropBounds {
  const cachedBounds = cachedLogoBounds.get(src);
  if (cachedBounds) return cachedBounds;

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height) return fullImageBounds(img);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fullImageBounds(img);

  ctx.drawImage(img, 0, 0, width, height);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch {
    return fullImageBounds(img);
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const bounds =
    maxX >= minX && maxY >= minY
      ? {
          sx: minX,
          sy: minY,
          sw: maxX - minX + 1,
          sh: maxY - minY + 1,
        }
      : fullImageBounds(img);

  cachedLogoBounds.set(src, bounds);
  return bounds;
}

export interface QRRenderOptions {
  size?: number;
  margin?: number;
  logoRatio?: number;
  logoSrc?: string;
}

export async function generateQRDataURL(
  data: string = REDEEM_URL,
  opts: QRRenderOptions = {}
): Promise<string> {
  const size = opts.size ?? 1024;
  const margin = opts.margin ?? 2;
  const logoRatio = opts.logoRatio ?? 0.22;
  const logoSrc = opts.logoSrc ?? DEFAULT_LOGO_SRC;
  const needsDarkBadge = logoNeedsDarkBadge(logoSrc);

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

  const logo = await loadLogo(logoSrc);
  const resolvedLogoRatio = opts.logoRatio ?? (needsDarkBadge ? logoRatio : 0.18);
  const logoSize = Math.round(size * resolvedLogoRatio);
  const logoX = Math.round((size - logoSize) / 2);
  const logoY = Math.round((size - logoSize) / 2);

  const pad = Math.round(logoSize * (needsDarkBadge ? 0.14 : 0.12));
  const bgSize = logoSize + pad * 2;
  const radius = Math.round(bgSize * 0.24);
  const bgX = logoX - pad;
  const bgY = logoY - pad;

  const haloPad = Math.round(needsDarkBadge ? pad * 0.55 : pad * 0.35);
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

  if (needsDarkBadge) {
    ctx.save();
    ctx.fillStyle = "#0a0a0a";
    roundRect(ctx, bgX, bgY, bgSize, bgSize, radius);
    ctx.fill();
    ctx.restore();
  }

  const bounds = needsDarkBadge
    ? fullImageBounds(logo)
    : getVisibleImageBounds(logo, logoSrc);
  ctx.drawImage(
    logo,
    bounds.sx,
    bounds.sy,
    bounds.sw,
    bounds.sh,
    logoX,
    logoY,
    logoSize,
    logoSize
  );

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

export function displayURL(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

export function compactDisplayURL(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length <= 2) return displayURL(url);

    const tail = segments.slice(-2).join("/");
    return `${parsed.hostname}/.../${tail}`;
  } catch {
    return displayURL(url);
  }
}

export function parseCodesFromText(input: string): string[] {
  return input
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function buildQREntries(
  values: string[],
  type: QRType,
  redeemUrl: string
): QREntry[] {
  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => buildQREntry(value, type, redeemUrl));
}

export function buildQREntry(
  value: string,
  type: QRType,
  redeemUrl: string
): QREntry {
  switch (type) {
    case "api_credits":
      return buildApiCreditsEntry(value, redeemUrl);
    case "custom_link":
      return buildCustomLinkEntry(value, redeemUrl);
    default: {
      const exhaustiveType: never = type;
      return exhaustiveType;
    }
  }
}

function buildApiCreditsEntry(value: string, redeemUrl: string): QREntry {
  const targetUrl = normalizeBaseUrl(redeemUrl, API_CREDITS_REDEEM_URL);
  return {
    rawValue: value,
    codeLabel: value,
    targetUrl,
    displayUrl: compactDisplayURL(targetUrl),
  };
}

function buildCustomLinkEntry(value: string, redeemUrl: string): QREntry {
  const parsedInput = parsePossibleUrl(value);
  const targetUrl = parsedInput?.href ?? appendCodeToBaseUrl(redeemUrl, value);
  const codeLabel = parsedInput
    ? extractCodeFromUrl(parsedInput) ?? compactDisplayURL(parsedInput.href)
    : value;

  return {
    rawValue: value,
    codeLabel,
    targetUrl,
    displayUrl: compactDisplayURL(targetUrl),
  };
}

function normalizeBaseUrl(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return parsePossibleUrl(trimmed)?.href ?? trimmed;
}

function appendCodeToBaseUrl(baseUrl: string, code: string): string {
  const normalizedBase = normalizeBaseUrl(baseUrl, CUSTOM_LINK_REDEEM_URL);
  const encodedCode = encodeURIComponent(code);
  if (normalizedBase.includes("{code}")) {
    return normalizedBase.replaceAll("{code}", encodedCode);
  }

  if (/[?&][^=&#]+=$/.test(normalizedBase)) {
    return `${normalizedBase}${encodedCode}`;
  }

  const parsedBase = parsePossibleUrl(normalizedBase);
  if (parsedBase) {
    const codeParamKey = findCodeQueryParam(parsedBase);
    if (codeParamKey) {
      parsedBase.searchParams.set(codeParamKey, code);
      return parsedBase.href;
    }

    const emptyParamKey = findEmptyQueryParam(parsedBase);
    if (emptyParamKey) {
      parsedBase.searchParams.set(emptyParamKey, code);
      return parsedBase.href;
    }

    if (parsedBase.search) {
      parsedBase.searchParams.set("code", code);
      return parsedBase.href;
    }
  }

  const separator = normalizedBase.endsWith("/") ? "" : "/";
  return `${normalizedBase}${separator}${encodedCode}`;
}

function parsePossibleUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : /^([\w-]+\.)+[\w-]+(\/|$)/i.test(trimmed)
      ? `https://${trimmed}`
      : null;

  if (!candidate) return null;

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function findCodeQueryParam(url: URL): string | null {
  for (const [key] of url.searchParams.entries()) {
    if (CODE_QUERY_KEYS.has(normalizeCodeKey(key))) return key;
  }

  return null;
}

function findEmptyQueryParam(url: URL): string | null {
  for (const [key, value] of url.searchParams.entries()) {
    if (value.trim().length === 0) return key;
  }

  return null;
}

function extractCodeFromUrl(url: URL): string | null {
  const queryCode = extractCodeFromQuery(url);
  if (queryCode) return queryCode;

  const segments = url.pathname.split("/").filter(Boolean);
  const markerIndex = segments.findIndex((segment) =>
    CODE_PATH_MARKERS.has(segment.toLowerCase())
  );
  const codeSegment =
    markerIndex >= 0 && segments[markerIndex + 1]
      ? segments[markerIndex + 1]
      : segments[segments.length - 1];

  if (!codeSegment || GENERIC_ACTION_SEGMENTS.has(codeSegment.toLowerCase())) {
    return null;
  }

  return decodeValue(codeSegment);
}

function extractCodeFromQuery(url: URL): string | null {
  for (const [key, value] of url.searchParams.entries()) {
    const normalizedKey = normalizeCodeKey(key);
    const trimmedValue = value.trim();
    if (CODE_QUERY_KEYS.has(normalizedKey) && trimmedValue.length > 0) {
      return decodeValue(trimmedValue);
    }
  }

  return null;
}

function decodeValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeCodeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const CODE_QUERY_KEYS = new Set([
  "code",
  "codigo",
  "coupon",
  "couponcode",
  "promo",
  "promocode",
  "ref",
  "referral",
  "token",
]);

const CODE_PATH_MARKERS = new Set([
  "p",
  "code",
  "codigo",
  "coupon",
  "promo",
  "redeem",
  "referral",
]);

const GENERIC_ACTION_SEGMENTS = new Set([
  "activate",
  "claim",
  "code",
  "codigo",
  "coupon",
  "promo",
  "redeem",
  "referral",
]);
