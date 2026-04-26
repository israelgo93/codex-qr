# Codex QR

Generador comunitario bilingüe para crear códigos QR imprimibles y reclamar créditos de API.

Bilingual community tool for generating printable QR codes to claim API credits.

---

## Español

### Descripción

Codex QR permite pegar códigos promocionales o subir un CSV y generar un PDF A4 listo para imprimir. Cada tarjeta incluye un QR con la URL de canje, el código visible, el logo central y un pie de página opcional.

El proyecto está pensado para actividades comunitarias, talleres y eventos de OpenAI Developers y Ambassadors de Codex, manteniendo una experiencia sencilla, profesional y fácil de adaptar.

### Características principales

- Generación de múltiples QR desde texto pegado o archivo CSV.
- Exportación a PDF A4 con 9 tarjetas por página.
- URL de canje configurada por defecto para OpenAI.
- Personalización opcional de URL y logo central.
- Logo automático según tema:
  - `public/logos/codex.png` para tema claro.
  - `public/logos/Codex 256 x 256.png` para tema oscuro.
- Tema claro, oscuro y sistema.
- Interfaz bilingüe: español e inglés.
- Diseño minimalista en blanco, negro y grises neutros.

### Tecnologías usadas

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- jsPDF
- qrcode
- Papa Parse

### Instalación

```bash
npm install
```

### Ejecución local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Para validar tipos:

```bash
npx tsc --noEmit
```

### Estructura básica

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    CodeInput.tsx
    IconButton.tsx
    Icons.tsx
    QRCard.tsx
    SettingsModal.tsx
  lib/
    csv.ts
    i18n.ts
    pdf.ts
    qr.ts
    theme.ts
public/
  logos/
```

### Configuración de temas

El botón de tema alterna de forma cíclica:

```text
Claro -> Oscuro -> Sistema -> Claro
```

Cuando el modo está en `Sistema`, la aplicación respeta `prefers-color-scheme` del navegador. El logo por defecto cambia automáticamente según el tema resuelto. Si el usuario sube un logo personalizado, ese logo se usa como override para la vista previa y el PDF.

### Soporte bilingüe

Los textos visibles están centralizados en `src/lib/i18n.ts`. Para agregar o modificar copy, actualiza las entradas `es` y `en` en el mismo archivo.

### Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md). Antes de abrir un pull request, ejecuta:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Licencia

Este proyecto usa la licencia Apache 2.0. Consulta [LICENSE](./LICENSE).

### Créditos

Creado por [Israel Julio Gomez](https://github.com/israelgo93) para la comunidad de OpenAI Developers.

---

## English

### Description

Codex QR lets you paste promotional codes or upload a CSV file and generate a print-ready A4 PDF. Each card includes a QR code with the redemption URL, the visible code, a centered logo, and an optional footer.

The project is designed for community activities, workshops, and OpenAI Developers / Codex Ambassador events while keeping the experience simple, professional, and easy to adapt.

### Main Features

- Generate multiple QR codes from pasted text or a CSV file.
- Export an A4 PDF with 9 cards per page.
- Default OpenAI redemption URL.
- Optional customization for URL and centered logo.
- Automatic logo based on theme:
  - `public/logos/codex.png` for light theme.
  - `public/logos/Codex 256 x 256.png` for dark theme.
- Light, dark, and system theme modes.
- Bilingual interface: Spanish and English.
- Minimal black, white, and neutral gray visual design.

### Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- jsPDF
- qrcode
- Papa Parse

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

For type checking:

```bash
npx tsc --noEmit
```

### Basic Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    CodeInput.tsx
    IconButton.tsx
    Icons.tsx
    QRCard.tsx
    SettingsModal.tsx
  lib/
    csv.ts
    i18n.ts
    pdf.ts
    qr.ts
    theme.ts
public/
  logos/
```

### Theme Configuration

The theme button cycles through:

```text
Light -> Dark -> System -> Light
```

When the mode is `System`, the app respects the browser `prefers-color-scheme` setting. The default logo changes automatically based on the resolved theme. If a user uploads a custom logo, that logo overrides the default in both the preview and the PDF.

### Bilingual Support

Visible UI strings are centralized in `src/lib/i18n.ts`. To add or edit copy, update both the `es` and `en` entries in that file.

### Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md). Before opening a pull request, run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### License

This project is licensed under Apache 2.0. See [LICENSE](./LICENSE).

### Credits

Created by [Israel Julio Gomez](https://github.com/israelgo93) for the OpenAI Developers community.
