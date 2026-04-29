# AGENTS.md

Project instructions for coding agents working on Codex QR.

Instrucciones del proyecto para agentes que trabajen en Codex QR.

## Español

### Antes de cambiar código

- Este proyecto usa Next.js 16. Antes de tocar rutas, layouts, Server Components, Client Components o configuración de Next, revisa la documentación local en `node_modules/next/dist/docs/`.
- Mantén la aplicación bilingüe. Todo texto visible debe existir en español e inglés en `src/lib/i18n.ts`.
- Mantén compatibilidad con tema claro, oscuro y sistema usando los tokens de `src/app/globals.css`.
- La URL de producción documentada es `https://codexqr.vercel.app/`.

### Validación y commits

- Antes de hacer un commit solicitado por el usuario, ejecuta build.
- Si hay errores o warnings, corrígelos y vuelve a ejecutar build.
- Usa mensajes de commit en español, sin caracteres especiales que puedan romper PowerShell.
- PowerShell no soporta heredoc estilo Unix; usa comandos compatibles con PowerShell.

Comandos esperados:

```powershell
npm run lint
npm run typecheck
npm run build
```

O:

```powershell
npm run check
```

### TypeScript

No uses `any` ni `(variable as any)`.

Correcto:

```typescript
const data: RecepcionMateriaPrima[] = []
setValue: (field: string, value: string) => void
```

Incorrecto:

```typescript
const data: any[] = []
(recepcion as any).proveedor
```

Si una propiedad falta en el tipo, actualiza la interfaz correspondiente o usa un tipo más específico.

### Supabase

Este proyecto no usa Supabase actualmente. Si se agrega en el futuro, toda query que retorne `data` debe tiparse explícitamente con `Tables<>` desde `@/types/database`. No uses `any` para escapar errores de inferencia.

### Switch exhaustivo

En switches sobre unions o enums de TypeScript, usa verificación `never` en el caso por defecto para detectar variantes nuevas en compile-time.

## English

### Before Changing Code

- This project uses Next.js 16. Before changing routes, layouts, Server Components, Client Components, or Next configuration, read the local docs in `node_modules/next/dist/docs/`.
- Keep the app bilingual. Every visible string must exist in Spanish and English in `src/lib/i18n.ts`.
- Preserve light, dark, and system theme support using the tokens in `src/app/globals.css`.
- The documented production URL is `https://codexqr.vercel.app/`.

### Validation and Commits

- Before creating a user-requested commit, run the production build.
- If there are errors or warnings, fix them and run the build again.
- Commit messages must be in Spanish and PowerShell-safe.
- PowerShell does not support Unix-style heredocs; use PowerShell-compatible commands.

Expected commands:

```powershell
npm run lint
npm run typecheck
npm run build
```

Or:

```powershell
npm run check
```

### TypeScript

Do not use `any` or `(variable as any)`. Define explicit interfaces, extend existing types, or use narrower typed destructuring.

### Supabase

This project does not currently use Supabase. If it is added later, every query returning `data` must use explicit `Tables<>` types from `@/types/database`.

### Exhaustive Switches

For TypeScript union or enum switches, use a `never` check in the default case so new variants fail at compile time until handled.
