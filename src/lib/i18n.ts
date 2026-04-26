export type Language = "es" | "en";

export const LANGUAGE_STORAGE_KEY = "codexqr-language";

export function isLanguage(value: string | null): value is Language {
  return value === "es" || value === "en";
}

export const translations = {
  es: {
    appName: "Codex QR",
    navLogoAlt: "Logo de Codex QR",
    headline: "Generador de QR para reclamar créditos de la API de OpenAI",
    description:
      "Pega códigos promocionales o sube un CSV y exporta un PDF A4 limpio, listo para imprimir.",
    pasteCodes: "Pegar códigos",
    uploadCsv: "Subir CSV",
    pastePlaceholder: "GG3LJ5LCWEWWQWER\nSLECDHH0YC6X\nEFN0PJ1AQ4R\n...",
    detected_one: "1 código detectado",
    detected_other: "{count} códigos detectados",
    separatorHint: "Separa por comas, espacios o saltos de línea",
    generateQr: "Generar QR",
    pasteError: "Pega al menos un código promocional.",
    csvEmptyError: "No se encontraron códigos en el CSV.",
    csvReadError: "No se pudo leer el CSV.",
    dropCsv: "Arrastra un CSV o haz clic para seleccionar",
    csvColumnHint: "Se detectará automáticamente una columna tipo",
    settingsTitle: "Personalización",
    settingsDescription:
      "Cambia la URL de canje y el logo solo si tu evento lo necesita.",
    redeemUrl: "URL de canje",
    centerLogo: "Logo central",
    selectedLogo: "Logo seleccionado",
    defaultLogoName: "Logo automático según el tema",
    restoreDefaults: "Restaurar valores por defecto",
    close: "Cerrar",
    openSettings: "Abrir configuración",
    changeTheme: "Cambiar tema",
    themeLight: "Tema claro",
    themeDark: "Tema oscuro",
    themeSystem: "Tema del sistema",
    changeLanguage: "Cambiar idioma",
    preview: "Vista previa",
    previewMeta: "{codes} código{codesPlural} · {pages} página{pagesPlural} · 9 por página",
    footerLabel: "Pie de página opcional",
    footerPlaceholder: "Ej: Créditos provistos por Codex",
    generating: "Generando... {progress}%",
    downloadPdf: "Descargar PDF",
    qrAlt: "Código QR para {code}",
    creditsPrefix: "Creado por",
    creatorName: "Israel Gómez",
    creditsSuffix: "Codex Community Program",
    githubProfile: "Perfil de GitHub de Israel Gómez",
  },
  en: {
    appName: "Codex QR",
    navLogoAlt: "Codex QR logo",
    headline: "QR generator for claiming OpenAI API credits",
    description:
      "Paste promotional codes or upload a CSV and export a clean, print-ready A4 PDF.",
    pasteCodes: "Paste codes",
    uploadCsv: "Upload CSV",
    pastePlaceholder: "GG3LJ5LCWEWWQWER\nSLECDHH0YC6X\nEFN0PJ1AQ4R\n...",
    detected_one: "1 code detected",
    detected_other: "{count} codes detected",
    separatorHint: "Separate with commas, spaces, or line breaks",
    generateQr: "Generate QR",
    pasteError: "Paste at least one promotional code.",
    csvEmptyError: "No codes were found in the CSV.",
    csvReadError: "The CSV could not be read.",
    dropCsv: "Drag a CSV or click to select one",
    csvColumnHint: "A column like this will be detected automatically",
    settingsTitle: "Customization",
    settingsDescription:
      "Change the redemption URL and logo only when your event needs it.",
    redeemUrl: "Redemption URL",
    centerLogo: "Center logo",
    selectedLogo: "Selected logo",
    defaultLogoName: "Automatic logo based on theme",
    restoreDefaults: "Restore defaults",
    close: "Close",
    openSettings: "Open settings",
    changeTheme: "Change theme",
    themeLight: "Light theme",
    themeDark: "Dark theme",
    themeSystem: "System theme",
    changeLanguage: "Change language",
    preview: "Preview",
    previewMeta: "{codes} code{codesPlural} · {pages} page{pagesPlural} · 9 per page",
    footerLabel: "Optional footer",
    footerPlaceholder: "Example: Credits provided by Codex",
    generating: "Generating... {progress}%",
    downloadPdf: "Download PDF",
    qrAlt: "QR code for {code}",
    creditsPrefix: "Created by",
    creatorName: "Israel Gomez",
    creditsSuffix: "Codex Community Program",
    githubProfile: "Israel Gomez GitHub profile",
  },
} as const;

export type Dictionary = (typeof translations)[Language];

export function formatMessage(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? "")
  );
}
