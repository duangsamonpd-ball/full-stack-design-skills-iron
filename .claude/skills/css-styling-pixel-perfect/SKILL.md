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
5. **One stylesheet, linked — never a copy per page.** Standalone pages (docs, demos, prototypes) are where this rots: each one gets its own hand-kept `:root` and shared chrome "just for this page", and from then on they diverge in silence. A fix made on one page never reaches the others, and nothing is visible from any single page — which is what makes it late-stage expensive. One such set had grown **four** versions of `.hamburger`, three of `.sidebar`, and 14 resolved token values that no longer matched the real tokens.

   Link the shared stylesheet everywhere, then gate the ownership — because the copies come back exactly the way they arrived, one honest "just this page" at a time:

   ```
   □ no page re-declares a selector the shared stylesheet already owns
   □ a page that genuinely must differ gets a selector of its own, not a copy
   ```

## Part B — Pixel perfect

1. **Get both references** — design (Figma node/screenshot) and the running build at the same viewport.
2. **Compare systematically**, in order: layout & alignment → spacing → typography (size/weight/line-height/tracking) → color → border/radius/shadow → states.
3. **Log each gap** — element · expected (token) · actual · fix.
4. **Fix against tokens**, re-render, diff again; record intentional deviations and why.

## Common drift sources

- A per-page copy of the tokens (`:root` re-declared in a standalone page) drifting from the real ones
- Line-height / letter-spacing left at browser defaults
- `rem` vs `px` rounding at breakpoints
- Sub-pixel border/shadow differences
- Web font not loaded → fallback metrics shift layout

### Boxes that are taller than their content

Two of these are near-invisible until a layout stacks, because a row's height is set by
its tallest item — so a few stray pixels on a short child cost nothing, then land
directly on the section height the moment the same child becomes a row of its own.
**After any change that turns a row into a column, re-measure every band**; a gap that
was absorbed for months starts showing.

- **An inline-level child inside a block wrapper sits on a baseline** and the line box
  adds descender space under it. A 24px `inline-flex` logo in a plain `<span>` measures
  28. `line-height: 0` on the wrapper hides it; `display: flex` removes it. Being a
  flex *item* does not help — flex blockifies the item, not what is inside it.
- **Two font sizes on one line make the line box the union of both inline boxes**, which
  is taller than either `line-height`. 14px and 12px both at `line-height: 20px` give
  20.74, because the smaller run's half-leading puts its baseline lower. Cap the smaller
  run (`line-height: 1`) — glyphs sit on the baseline either way, so nothing moves.

Both are why a card specified 124×48 renders 49. Measure with
`getBoundingClientRect()` on the real element rather than trusting the declared
`line-height`.

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
