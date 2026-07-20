# Tailwind v4 recipes + the build-breaking gotchas

On-demand depth for `css-styling-pixel-perfect`. Tailwind **v4** is CSS-first — theme lives
in CSS, there is no `tailwind.config.js` by default.

## Setup (the whole config is CSS)

```css
/* app.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));   /* class-based dark mode */

@theme {
  --color-brand: oklch(0.60 0.11 198);            /* generates bg-brand, text-brand, … */
  --spacing-gutter: 1.5rem;                        /* generates px-gutter, gap-gutter, … */
}
```

Browser build (prototyping only): `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
plus `<style type="text/tailwindcss">…</style>`. Production: the `@tailwindcss/vite` plugin (or CLI).

## `@theme` vs `@theme inline` (theming hinges on this)

- **`@theme`** emits the variable to `:root` *and* generates utilities. Use for fixed values.
- **`@theme inline`** inlines the value into utilities and does **not** emit a stable
  `--color-*` variable. Use when the token points at another variable that a theme overrides,
  so the swap actually re-themes:

```css
:root { --brand: var(--teal-700); }            /* primitive/assignment (plain var) */
.dark { --brand: var(--teal-500); }
@theme inline { --color-brand: var(--brand); }  /* bg-brand re-themes on .dark */
```

## GOTCHA 1 — raw `var(--color-*)` in SVG / inline-style / canvas resolves to nothing

Because `@theme inline` does **not** emit `--color-brand` to `:root`, this renders black/empty:

```html
<rect fill="var(--color-brand)" />   <!-- ✗ undefined; SVG falls back to black -->
```

Utility classes still work (`class="fill-brand"`) — they got the inlined value. For raw
SVG/inline-style/canvas, reference the **plain `:root` token** you defined yourself:

```html
<rect fill="var(--brand)" />         <!-- ✓ real CSS variable, always resolves -->
```

## GOTCHA 2 — `@apply` of a marker class or arbitrary variant drops the WHOLE stylesheet

`@apply` throws (and the compiler discards *all* CSS → the page renders unstyled, and even
`hidden` stops working) when you apply:

- **Marker classes** — `@apply peer` / `@apply group` (they're relationship markers, not utilities).
- **Arbitrary / combinator variants** — `@apply peer-[:not(:placeholder-shown)]:top-1.5`, group-sibling variants, etc.

```css
/* ✗ crashes everything */
.field { @apply peer h-14 peer-focus:border-primary; }
```
```html
<!-- ✓ marker + peer/group variants live in markup -->
<input class="peer h-14 ..." />
<label class="peer-focus:text-primary ..."></label>
```
Component classes may `@apply` **plain utilities and same-element pseudo variants** only
(`hover:`, `focus:`, `disabled:`, `placeholder:`). **Symptom to recognize:** entire page
unstyled + supposedly-`hidden` elements visible.

## Opacity — no more `<alpha-value>`

`bg-brand/50` works automatically via `color-mix()` for any color registered in `@theme`.
The v3 `rgb(var(--…) / <alpha-value>)` channel trick is gone.

## The component boundary (frameworks)

In React/Astro/Vue, **reuse the component, not an `@apply` class** — put utilities inline in
the component markup. Reserve `@apply`/`@layer components` for genuinely repeated clusters in
plain HTML. This keeps styling co-located and sidesteps both gotchas above.

## Forced colors / Windows High Contrast

When a forced-colors mode is on (Windows High Contrast, `forced-colors: active`), the OS
**replaces your palette** with its own. Design so meaning survives the swap:

- **Lean on semantic elements + system colors.** Native `<button>`/`<a>`/`<input>` map
  automatically; custom widgets can opt into system color keywords (`Canvas`, `CanvasText`,
  `ButtonText`, `Highlight`, `LinkText`).
- **Never carry meaning in a background image, gradient, or box-shadow alone** — those are
  flattened or removed. Pair them with a border or text.
- **Keep focus/selection visible with `outline`**, not only `box-shadow` (shadows vanish;
  outlines are preserved and honor `Highlight`).
- Use the Tailwind v4 **`forced-colors:`** variant for targeted fallbacks
  (`forced-colors:outline forced-colors:border`).

```css
@media (forced-colors: active) {
  .card { border: 1px solid CanvasText; }          /* restore meaning a shadow was carrying */
  .btn:focus-visible { outline: 2px solid Highlight; }
}
```

Test: Windows High Contrast, or DevTools → Rendering → *Emulate CSS forced-colors: active*.

## Verify before shipping

Compile the CSS once — a clean run means no `@apply` errors:

```bash
npm i tailwindcss@4 @tailwindcss/cli@4
npx @tailwindcss/cli -i app.css -o out.css   # "Done" = good; an error prints the bad @apply
```
