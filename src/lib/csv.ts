import Papa from "papaparse";

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

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function parseCSV(file: File): Promise<string[]> {
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
          const targetField =
            fields.find((f) =>
              CODE_COLUMN_HINTS.some((h) => normalize(f) === normalize(h))
            ) ??
            fields.find((f) => normalize(f).includes("code")) ??
            fields[0];

          const codes = rows
            .map((r) => (r[targetField] ?? "").toString().trim())
            .filter((s) => s.length > 0);
          resolve(codes);
        } catch (e) {
          reject(e);
        }
      },
      error: reject,
    });
  });
}
