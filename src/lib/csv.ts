import Papa from "papaparse";
import type { QRType } from "@/lib/qr";

const CODE_COLUMN_HINTS = [
  "codes_promotional",
  "codes_promotinal",
  "promotional_codes",
  "promo_codes",
  "promo_code",
  "promotional_code",
  "code",
  "codes",
  "coupon",
  "coupons",
];

const CUSTOM_LINK_COLUMN_HINTS = [
  "url",
  "link",
  "redeem_url",
  "redemption_url",
  "target_url",
  "event_url",
  "code",
  "codes",
  "coupon",
  "token",
];

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function parseCSV(file: File, type: QRType): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const rows = result.data;
          if (!rows.length) {
            resolve([]);
            return;
          }
          const fields = result.meta.fields ?? [];
          const targetField = findTargetField(fields, type);

          const values = rows
            .map((r) => (r[targetField] ?? "").toString().trim())
            .filter((s) => s.length > 0);
          resolve(values);
        } catch (e) {
          reject(e);
        }
      },
      error: reject,
    });
  });
}

function findTargetField(fields: string[], type: QRType): string {
  switch (type) {
    case "api_credits":
      return findField(fields, CODE_COLUMN_HINTS, "code");
    case "custom_link":
      return findField(fields, CUSTOM_LINK_COLUMN_HINTS, "url");
    default: {
      const exhaustiveType: never = type;
      return exhaustiveType;
    }
  }
}

function findField(fields: string[], hints: string[], fallbackIncludes: string): string {
  return (
    fields.find((field) =>
      hints.some((hint) => normalize(field) === normalize(hint))
    ) ??
    fields.find((field) => normalize(field).includes(fallbackIncludes)) ??
    fields.find((field) => field.trim().length > 0) ??
    ""
  );
}
