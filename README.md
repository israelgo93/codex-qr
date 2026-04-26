# Codex QR

Generador comunitario de códigos QR imprimibles para compartir créditos promocionales de OpenAI en eventos, talleres y actividades del programa de Ambassadors de Codex.

La app genera un PDF A4 con 9 tarjetas por página. Cada tarjeta incluye:

- Código QR con la URL de canje.
- Logo central dentro del QR.
- URL visible debajo del QR.
- Código promocional en texto.
- Pie de página opcional para créditos del evento o institución.

## Uso

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Puedes pegar códigos separados por espacios, comas o saltos de línea, o subir un CSV. El lector de CSV busca columnas como `codes_promotional`, `promo_code`, `code` o `codes`; si no encuentra una coincidencia usa la primera columna.

## Personalización

Por defecto, el QR apunta a:

```text
https://platform.openai.com/settings/organization/billing/promotions
```

El logo central por defecto es el de Codex incluido en `public/logos`. La sección "Personalización opcional" permite cambiar la URL de canje y subir otro logo sin afectar el flujo base.

También incluye selector de tema:

- Sistema
- Claro
- Oscuro

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Créditos

Creado por [Israel Julio Gomez](https://github.com/israelgo93) para la comunidad de OpenAI Developers.

## Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir issues o pull requests.
