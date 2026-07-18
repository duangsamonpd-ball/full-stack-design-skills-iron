# Astro · Material 3 registration form

The Material 3 registration form ported to **Astro** — same design system and the same
validation *method*, expressed in Astro's model.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## What this demonstrates (`frontend-framework-guide`)

- **Ships ~zero JS by default** — the page is static HTML; the only client JavaScript is
  the single `<script>` in `src/pages/index.astro` (the interactivity boundary).
- **`is:inline` theme init** in `src/layouts/Base.astro` runs before first paint (no flash),
  deliberately kept out of the bundle.
- **Components + props** — `src/components/TextField.astro` is reused for the standard
  fields; the password field (extra UI) stays inline.
- **Tailwind v4 via `@tailwindcss/vite`** — no `tailwind.config.js`; theme lives in
  `src/styles/global.css` (`@theme` / `@theme inline` / `@custom-variant`).

## Structure

```
src/
├── layouts/Base.astro        html shell, fonts, global.css, is:inline theme init
├── components/TextField.astro reusable M3 filled field (build-time, no JS)
├── pages/index.astro          the page + the one client script
└── styles/global.css          @import "tailwindcss" + M3 tokens/@theme/@layer
```
