<p align="center">
  <a href="https://codexqr.vercel.app/">
    <img src="./public/logos/Codex%20256%20x%20256.png" alt="Codex QR logo" width="88" height="88" />
  </a>
</p>

# Codex QR

Generador bilingüe para crear códigos QR imprimibles para **OpenAI API credits** y **ChatGPT Plus**.

Bilingual generator for printable QR codes for **OpenAI API credits** and **ChatGPT Plus**.

**Producción / Production:** [https://codexqr.vercel.app/](https://codexqr.vercel.app/)

---

## Español

### Descripción

Codex QR permite pegar códigos, cargar archivos CSV y exportar un PDF A4 listo para imprimir. La aplicación soporta dos tipos de QR:

- **OpenAI API credits:** el QR apunta a la página de promociones de OpenAI Platform y la tarjeta muestra el código promocional.
- **ChatGPT Plus:** el QR apunta al enlace individual de ChatGPT Plus. La entrada puede ser solo el código, una URL completa o una URL sin esquema como `chatgpt.com/p/CODIGO`.

La experiencia es completamente local en el navegador: no hay backend, base de datos ni almacenamiento de códigos en servidor.

### Funcionalidades

- Selector de tipo de QR: `OpenAI API credits` o `ChatGPT Plus`.
- Entrada manual por texto con separación por espacios, comas, punto y coma o saltos de línea.
- Carga CSV con detección automática de columnas relevantes.
- Normalización de enlaces de ChatGPT Plus:
  - `CODIGO` -> `https://chatgpt.com/p/CODIGO`
  - `chatgpt.com/p/CODIGO` -> `https://chatgpt.com/p/CODIGO`
  - `https://chatgpt.com/p/CODIGO` -> se usa tal cual.
- Exportación PDF A4 con 9 tarjetas por página.
- Logo central configurable y logo automático según tema.
- Tema claro, oscuro y sistema.
- Interfaz bilingüe: español e inglés.
- Diseño responsivo con tokens de tema compartidos.

### URLs por defecto

| Tipo | URL por defecto |
| --- | --- |
| OpenAI API credits | `https://platform.openai.com/settings/organization/billing/promotions` |
| ChatGPT Plus | `https://chatgpt.com/p/` |
| Producción | `https://codexqr.vercel.app/` |

### CSV soportado

Para **OpenAI API credits**, se priorizan columnas como:

```text
codes_promotional, promotional_code, promo_code, code, codes, coupon
```

Para **ChatGPT Plus**, se priorizan columnas como:

```text
url, link, chatgpt_url, chatgpt_link, redeem_url, code, codes
```

Si no hay coincidencias claras, la app usa la primera columna con contenido.

### Instalación

```bash
npm install
```

### Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Validación

```bash
npm run lint
npm run typecheck
npm run build
```

También puedes ejecutar todo con:

```bash
npm run check
```

### Estructura

```text
src/
  app/
    globals.css      # tokens de tema y estilos globales
    layout.tsx       # metadata y layout raíz
    page.tsx         # flujo principal de generación
  components/
    CodeInput.tsx
    IconButton.tsx
    Icons.tsx
    QRCard.tsx
    SettingsModal.tsx
  lib/
    csv.ts           # lectura y selección de columnas CSV
    i18n.ts          # textos bilingües
    pdf.ts           # exportación PDF
    qr.ts            # tipos, normalización y render QR
    theme.ts         # tema y logos
public/
  logos/
```

### Temas y logos

El botón de tema alterna:

```text
Claro -> Oscuro -> Sistema -> Claro
```

El logo por defecto cambia según el tema resuelto:

- `public/logos/codex.png` para tema claro.
- `public/logos/Codex 256 x 256.png` para tema oscuro.

Si se carga un logo personalizado, ese logo se usa en la vista previa y en el PDF.

### Despliegue

El sitio de producción está publicado en Vercel:

[https://codexqr.vercel.app/](https://codexqr.vercel.app/)

Para desplegar manualmente desde una sesión autenticada:

```bash
npx vercel@latest deploy --prod
```

### Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md). Antes de abrir un PR o pedir un commit, ejecuta:

```bash
npm run check
```

### Licencia

Apache 2.0. Consulta [LICENSE](./LICENSE).

### Créditos

Creado por [Israel Julio Gomez](https://github.com/israelgo93) para la comunidad de OpenAI Developers.

---

## English

### Description

Codex QR lets you paste codes, upload CSV files, and export a print-ready A4 PDF. The app supports two QR types:

- **OpenAI API credits:** the QR points to the OpenAI Platform promotions page and the card shows the promotional code.
- **ChatGPT Plus:** the QR points to the attendee-specific ChatGPT Plus link. Input may be only the code, a full URL, or a scheme-less URL such as `chatgpt.com/p/CODE`.

All processing happens in the browser. There is no backend, database, or server-side code storage.

### Features

- QR type selector: `OpenAI API credits` or `ChatGPT Plus`.
- Manual text input split by spaces, commas, semicolons, or line breaks.
- CSV upload with automatic relevant-column detection.
- ChatGPT Plus link normalization:
  - `CODE` -> `https://chatgpt.com/p/CODE`
  - `chatgpt.com/p/CODE` -> `https://chatgpt.com/p/CODE`
  - `https://chatgpt.com/p/CODE` -> used as provided.
- A4 PDF export with 9 cards per page.
- Configurable center logo and automatic logo by theme.
- Light, dark, and system theme modes.
- Bilingual UI: Spanish and English.
- Responsive design using shared theme tokens.

### Default URLs

| Type | Default URL |
| --- | --- |
| OpenAI API credits | `https://platform.openai.com/settings/organization/billing/promotions` |
| ChatGPT Plus | `https://chatgpt.com/p/` |
| Production | `https://codexqr.vercel.app/` |

### Supported CSV

For **OpenAI API credits**, the app prioritizes columns like:

```text
codes_promotional, promotional_code, promo_code, code, codes, coupon
```

For **ChatGPT Plus**, the app prioritizes columns like:

```text
url, link, chatgpt_url, chatgpt_link, redeem_url, code, codes
```

If no clear match is found, the app uses the first non-empty column.

### Install

```bash
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Validation

```bash
npm run lint
npm run typecheck
npm run build
```

Or run the full check:

```bash
npm run check
```

### Deployment

Production is hosted on Vercel:

[https://codexqr.vercel.app/](https://codexqr.vercel.app/)

Manual deployment from an authenticated session:

```bash
npx vercel@latest deploy --prod
```

### Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md). Before opening a PR or requesting a commit, run:

```bash
npm run check
```

### License

Apache 2.0. See [LICENSE](./LICENSE).
