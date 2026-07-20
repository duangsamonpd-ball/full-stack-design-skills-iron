---
name: css-styling-pixel-perfect
description: Build maintainable Tailwind/CSS component styling and close pixel gaps between implementation and design (spacing, color, type, alignment); for viewport/breakpoint layout use responsive-universal-design. Use when the user says "organize css", "tailwind styling", "pixel perfect", "match the mockup", or "css architecture".
---

# CSS Styling & Pixel Perfect

Two jobs, one skill: write component styling with Tailwind that stays maintainable, then drive the rendered result to a faithful match of the design.

## When to use this skill

- Structuring component styles / CSS architecture with Tailwind
- Building responsive layouts
- Verifying a build matches its design mockup and closing visual gaps

## Part A — Styling architecture

Deeper v4 recipes — `@theme` vs `@theme inline`, the component boundary in frameworks, and the two build-breaking gotchas (`@apply peer`, `var(--color-*)` in raw SVG) — are in `references/tailwind-v4-recipes.md`.

1. **Utilities first** — Tailwind utilities mapped to tokens (from `design-tokens-system`), never raw hex/px.
2. **`@apply` only for real repetition** — extract shared clusters into `@layer components`; premature extraction recreates CSS sprawl.
   ```css
   @layer components {
     .btn { @apply inline-flex items-center justify-center rounded-md px-md py-sm font-medium transition; }
     .btn-primary { @apply btn bg-brand text-brand-fg hover:opacity-90; }
   }
   ```
3. **Responsive, mobile-first** — style the base case, layer `sm/md/lg` upward; never desktop-first with overrides.
4. **Organize files** — `tokens.css` (source of truth) · `global.css` (`@import "tailwindcss"` + base + `@layer components`) · rare page overrides only.

## Part B — Pixel perfect

1. **Get both references** — design (Figma node/screenshot) and the running build at the same viewport.
2. **Compare systematically**, in order: layout & alignment → spacing → typography (size/weight/line-height/tracking) → color → border/radius/shadow → states.
3. **Log each gap** — element · expected (token) · actual · fix.
4. **Fix against tokens**, re-render, diff again; record intentional deviations and why.

## Common drift sources

- Line-height / letter-spacing left at browser defaults
- `rem` vs `px` rounding at breakpoints
- Sub-pixel border/shadow differences
- Web font not loaded → fallback metrics shift layout

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Utility no-ops | v4 auto-detects sources; add `@source "…"` for templates it can't find (outside the repo / git-ignored) |
| Opacity utility broken (`bg-brand/50`) | Register the color in `@theme` — v4 handles `/50` via `color-mix`; a plain `:root`-only var won't get the modifier |
| Dark mode not switching | Declare `@custom-variant dark (&:where(.dark,.dark *))`, put `.dark` on `<html>`, register semantic tokens with `@theme inline` |
| Not responsive | Add breakpoint prefix (`md:`, `lg:`) |

## Next steps

- Tokens live in **design-tokens-system**
- Verify accessibility with **web-accessibility-a11y**; layout across devices with **responsive-universal-design**
