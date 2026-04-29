# Guía de contribución

Gracias por ayudar a mejorar Codex QR. El objetivo del proyecto es mantener una herramienta simple, confiable y lista para eventos comunitarios donde se imprimen QR para OpenAI API credits o ChatGPT Plus.

## Principios del proyecto

- Mantén el flujo principal directo: elegir tipo de QR, pegar o cargar CSV, revisar vista previa y descargar PDF.
- Conserva la experiencia bilingüe. Todo texto visible debe existir en español e inglés dentro de `src/lib/i18n.ts`.
- Respeta tema claro, oscuro y sistema usando los tokens de `src/app/globals.css`.
- No agregues backend si la necesidad puede resolverse en cliente. Los códigos no deben almacenarse en servidor.
- Evita refactors grandes mezclados con cambios funcionales.

## Antes de cambiar código

- Revisa `AGENTS.md`; este proyecto usa Next.js 16 y requiere consultar la documentación local en `node_modules/next/dist/docs/` antes de tocar rutas, layouts o APIs de Next.
- Mantén los defaults documentados:
  - Producción: `https://codexqr.vercel.app/`
  - API credits: `https://platform.openai.com/settings/organization/billing/promotions`
  - ChatGPT Plus: `https://chatgpt.com/p/`
- Si agregas un nuevo tipo de QR, modela el caso explícitamente en `QRType` y usa `switch` exhaustivo con `never`.
- No uses `any` ni `(variable as any)`. Define o extiende tipos específicos.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Validación obligatoria

Antes de abrir un PR o pedir un commit:

```bash
npm run lint
npm run typecheck
npm run build
```

También puedes usar:

```bash
npm run check
```

Si el usuario pide un commit, primero ejecuta build, corrige errores o warnings, y vuelve a ejecutar build hasta que esté limpio.

## Cambios de UI

- Verifica mobile y desktop.
- Revisa tema claro, oscuro y sistema.
- Evita textos que se salgan de botones, tarjetas o inputs.
- Reutiliza patrones existentes: paneles, botones, campos, selector segmentado y tokens CSS.
- No agregues imágenes decorativas innecesarias. El logo oficial vive en `public/logos/`.

## Cambios de QR y CSV

- API credits espera códigos; el QR apunta a la URL de promociones de OpenAI Platform.
- ChatGPT Plus acepta códigos, URLs completas y URLs sin esquema.
- Si modificas parsing CSV, conserva detección de columnas para ambos modos:
  - API: `codes_promotional`, `promotional_code`, `promo_code`, `code`, `codes`, `coupon`.
  - ChatGPT: `url`, `link`, `chatgpt_url`, `chatgpt_link`, `redeem_url`, `code`, `codes`.
- Mantén `QREntry` como contrato para preview y PDF.

## Pull requests

Incluye:

- Problema o mejora que resuelve.
- Cambios principales.
- Capturas si cambia la interfaz.
- Comandos de verificación ejecutados.
- Riesgos o casos manuales revisados.

## Deployment

Producción está en Vercel:

[https://codexqr.vercel.app/](https://codexqr.vercel.app/)

Deploy manual desde una sesión autenticada:

```bash
npx vercel@latest deploy --prod
```

Si se configura integración GitHub en Vercel, los deploys deben ejecutarse desde la rama definida como producción.

---

# Contributing Guide

Codex QR should remain simple, reliable, and ready for community events that print QR codes for OpenAI API credits or ChatGPT Plus.

## Project Rules

- Keep the main flow direct: choose QR type, paste or upload CSV, preview, download PDF.
- Keep the UI bilingual. Every visible string must exist in Spanish and English in `src/lib/i18n.ts`.
- Preserve light, dark, and system themes using the tokens in `src/app/globals.css`.
- Do not add a backend unless the product requirement truly needs one.
- Avoid mixing large refactors with functional changes.

## Required Checks

Run before opening a PR or requesting a commit:

```bash
npm run check
```

This runs linting, TypeScript validation, and the production build.

## Production

Production URL:

[https://codexqr.vercel.app/](https://codexqr.vercel.app/)
