# Theming recipes (light / dark / multi-brand)

On-demand depth for `design-tokens-system`. Every theme is a **swap at the semantic layer** —
primitives and components never change. The mechanism is Tailwind v4 `@theme inline` over a set
of plain `:root` assignment variables.

## The shape

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

/* 1 · primitives — raw palette, never consumed directly */
:root {
  --blue-600:#2563eb; --blue-500:#3b82f6;
  --gray-0:#ffffff; --gray-50:#f9fafb; --gray-900:#111827; --gray-950:#0b0f17;
}

/* 2 · semantic assignments — what themes override */
:root { --brand:var(--blue-600); --surface:var(--gray-0);  --content:var(--gray-900); --border:var(--gray-200,#e5e7eb); }
.dark { --brand:var(--blue-500); --surface:var(--gray-950); --content:var(--gray-50);  --border:#243041; }

/* 3 · register into Tailwind — inline so the overrides above re-theme, and /50 works via color-mix */
@theme inline {
  --color-brand:var(--brand); --color-surface:var(--surface);
  --color-content:var(--content); --color-border:var(--border);
}
```

Now `bg-surface`, `text-content`, `bg-brand/50` all resolve, and dark mode is one class on `<html>`.

## Multi-brand — another override block

Layer brand on top of light/dark by overriding only the semantic vars:

```css
[data-brand="acme"]      { --brand:var(--teal-600); }
[data-brand="acme"].dark { --brand:var(--teal-400); }
```
```html
<html data-brand="acme" class="dark"> … </html>
```
A new brand = one override block. Components are untouched because they only read `--color-brand`.

## Recommended semantic set

| Group | Tokens |
|-------|--------|
| Brand | `brand`, `brand-hover`, `brand-fg` |
| Surfaces | `bg`, `surface`, `surface-2` (elevation), `border` |
| Content | `content` (primary ink), `muted` (secondary ink) |
| Status | `success`, `warning`, `danger`, `info` (+ tint via `/10`–`/15`) |
| Focus | `ring` |

## Per-theme contrast (don't just flip)

A hue that passes contrast on white may fail on a dark surface. **Tune each theme's value
separately** — e.g. a darker brand on light for 4.5:1 button text, a lighter brand on dark.
Dark mode is *selected*, not an automatic inversion.

## Do / don't

- **Do** keep primitives out of components — route everything through semantic tokens.
- **Do** size type in `rem` so OS text-scaling works; theme is color, not layout.
- **Don't** branch components on theme (`if dark …`) — override the token instead.
- **Don't** reuse status colors as decorative/brand accents.

For a single-source **generation pipeline** (Style Dictionary → CSS/native) see
`design-systems-architecture` → `references/token-pipeline.md`. Gotchas around `@theme inline`
in raw SVG/`@apply` live in `css-styling-pixel-perfect` → `references/tailwind-v4-recipes.md`.
