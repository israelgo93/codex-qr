export type Language = "es" | "en";

export const LANGUAGE_STORAGE_KEY = "codexqr-language";

export function isLanguage(value: string | null): value is Language {
  return value === "es" || value === "en";
}

export const translations = {
  es: {
    appName: "Codex QR",
    navLogoAlt: "Logo de Codex QR",
    qrTypeLabel: "Tipo de QR",
    qrTypeApiCredits: "OpenAI API credits",
    qrTypeChatGpt: "Enlace personalizado",
    headlineApiCredits: "Generador de QR para reclamar créditos de la API de OpenAI",
    headlineChatGpt: "Generador de QR para enlaces personalizados",
    descriptionApiCredits:
      "Pega códigos promocionales o sube un CSV y exporta un PDF A4 limpio, listo para imprimir.",
    descriptionChatGpt:
      "Pega códigos o enlaces completos, o sube un CSV mixto, y genera QR listos para imprimir.",
    pasteCodes: "Pegar códigos",
    uploadCsv: "Subir CSV",
    pastePlaceholderApiCredits: "GG3LJ5LCWEWWQWER\nSLECDHH0YC6X\nEFN0PJ1AQ4R\n...",
    pastePlaceholderChatGpt:
      "CODIGO-EJEMPLO\nhttps://example.com/redeem?code=CODIGO-EJEMPLO\nexample.com/redeem/CODIGO-OTRO\n...",
    detectedApiCredits_one: "1 código detectado",
    detectedApiCredits_other: "{count} códigos detectados",
    detectedChatGpt_one: "1 enlace o código detectado",
    detectedChatGpt_other: "{count} enlaces o códigos detectados",
    separatorHintApiCredits: "Separa por comas, espacios o saltos de línea",
    separatorHintChatGpt:
      "Puedes pegar códigos, enlaces completos o una mezcla de ambos",
    generateQr: "Generar QR",
    pasteErrorApiCredits: "Pega al menos un código promocional.",
    pasteErrorChatGpt: "Pega al menos un código o enlace.",
    csvEmptyErrorApiCredits: "No se encontraron códigos en el CSV.",
    csvEmptyErrorChatGpt: "No se encontraron códigos o enlaces en el CSV.",
    csvReadError: "No se pudo leer el CSV.",
    dropCsv: "Arrastra un CSV o haz clic para seleccionar",
    csvColumnHintApiCredits: "Se detectará automáticamente una columna como",
    csvColumnHintChatGpt: "Se detectará automáticamente una columna como",
    settingsTitle: "Personalización",
    settingsDescriptionApiCredits:
      "Cambia la URL de canje y el logo solo si tu evento lo necesita.",
    settingsDescriptionChatGpt:
      "Cambia la base del enlace y el logo solo si tu evento lo necesita.",
    redeemUrlApiCredits: "URL de canje",
    redeemUrlChatGpt: "URL base del enlace",
    redeemUrlPlaceholderApiCredits:
      "https://platform.openai.com/settings/organization/billing/promotions",
    redeemUrlPlaceholderChatGpt:
      "https://chatgpt.com/p/ o https://example.com/redeem?code=",
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
    previewMetaApiCredits:
      "{items} código{itemsPlural} · {pages} página{pagesPlural} · 9 por página",
    previewMetaChatGpt:
      "{items} enlace{itemsPlural} · {pages} página{pagesPlural} · 9 por página",
    footerLabel: "Pie de página opcional",
    footerPlaceholder: "Ej: Créditos provistos por Codex",
    generating: "Generando... {progress}%",
    downloadPdf: "Descargar PDF",
    qrAlt: "Código QR para {code}",
    creditsPrefix: "Creado por",
    creatorName: "Israel Gómez",
    creditsSuffix: "Codex Community Program",
    githubProfile: "Repositorio de codigo de Codex QR",
  },
  en: {
    appName: "Codex QR",
    navLogoAlt: "Codex QR logo",
    qrTypeLabel: "QR type",
    qrTypeApiCredits: "OpenAI API credits",
    qrTypeChatGpt: "Custom link",
    headlineApiCredits: "QR generator for claiming OpenAI API credits",
    headlineChatGpt: "QR generator for custom links",
    descriptionApiCredits:
      "Paste promotional codes or upload a CSV and export a clean, print-ready A4 PDF.",
    descriptionChatGpt:
      "Paste codes or full links, or upload a mixed CSV, and generate print-ready QR codes.",
    pasteCodes: "Paste codes",
    uploadCsv: "Upload CSV",
    pastePlaceholderApiCredits: "GG3LJ5LCWEWWQWER\nSLECDHH0YC6X\nEFN0PJ1AQ4R\n...",
    pastePlaceholderChatGpt:
      "SAMPLE-CODE\nhttps://example.com/redeem?code=SAMPLE-CODE\nexample.com/redeem/ANOTHER-CODE\n...",
    detectedApiCredits_one: "1 code detected",
    detectedApiCredits_other: "{count} codes detected",
    detectedChatGpt_one: "1 link or code detected",
    detectedChatGpt_other: "{count} links or codes detected",
    separatorHintApiCredits: "Separate with commas, spaces, or line breaks",
    separatorHintChatGpt:
      "You can paste codes, full links, or a mix of both",
    generateQr: "Generate QR",
    pasteErrorApiCredits: "Paste at least one promotional code.",
    pasteErrorChatGpt: "Paste at least one code or link.",
    csvEmptyErrorApiCredits: "No codes were found in the CSV.",
    csvEmptyErrorChatGpt: "No codes or links were found in the CSV.",
    csvReadError: "The CSV could not be read.",
    dropCsv: "Drag a CSV or click to select one",
    csvColumnHintApiCredits: "A column like this will be detected automatically",
    csvColumnHintChatGpt: "A column like this will be detected automatically",
    settingsTitle: "Customization",
    settingsDescriptionApiCredits:
      "Change the redemption URL and logo only when your event needs it.",
    settingsDescriptionChatGpt:
      "Change the link base and logo only when your event needs it.",
    redeemUrlApiCredits: "Redemption URL",
    redeemUrlChatGpt: "Link base URL",
    redeemUrlPlaceholderApiCredits:
      "https://platform.openai.com/settings/organization/billing/promotions",
    redeemUrlPlaceholderChatGpt:
      "https://chatgpt.com/p/ or https://example.com/redeem?code=",
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
    previewMetaApiCredits:
      "{items} code{itemsPlural} · {pages} page{pagesPlural} · 9 per page",
    previewMetaChatGpt:
      "{items} link{itemsPlural} · {pages} page{pagesPlural} · 9 per page",
    footerLabel: "Optional footer",
    footerPlaceholder: "Example: Credits provided by Codex",
    generating: "Generating... {progress}%",
    downloadPdf: "Download PDF",
    qrAlt: "QR code for {code}",
    creditsPrefix: "Created by",
    creatorName: "Israel Gomez",
    creditsSuffix: "Codex Community Program",
    githubProfile: "Codex QR source code repository",
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
