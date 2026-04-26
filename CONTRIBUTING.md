# Guía de contribución

Gracias por ayudar a mejorar Codex QR. Este proyecto está pensado para eventos comunitarios, por eso las contribuciones deben mantener el flujo principal simple: pegar o subir códigos, revisar la vista previa y descargar un PDF listo para imprimir.

## Antes de cambiar código

- Revisa `AGENTS.md`; esta versión de Next.js requiere leer la documentación local en `node_modules/next/dist/docs/` antes de implementar cambios.
- Mantén el comportamiento por defecto: URL de canje de OpenAI y logo de Codex.
- Las personalizaciones deben ser opcionales y no deben bloquear la generación del PDF.

## Desarrollo local

```bash
npm install
npm run dev
```

Antes de enviar cambios ejecuta:

```bash
npm run lint
npm run build
```

## Pull requests

Incluye en el PR:

- Qué problema resuelve.
- Capturas si cambia la interfaz.
- Cómo verificaste el cambio.

Evita mezclar refactors grandes con cambios funcionales. Para mejoras visuales, revisa claro, oscuro y sistema.
