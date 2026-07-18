---
name: design-tokens-system
description: Define and generate a layered design-token system (color, spacing, typography, sizing) wired into Tailwind and CSS variables for theming. Use when the user says "design tokens", "token system", "set up tailwind theme", "css variables for design", or "theming tokens".
---

# Design Tokens System

Establish a single source of truth for every design decision as tokens, then wire it into Tailwind and CSS variables so components never hardcode values and theming is a variable swap.

## When to use this skill

- Creating or restructuring a design-token system
- Wiring tokens into `@theme` (Tailwind v4) + CSS custom properties
- Setting up light/dark or multi-brand theming at the token layer

## Token layers

Keep three layers so themes swap without touching components:

```
primitive  --blue-600: #2563eb             (raw palette / scale — plain CSS var)
semantic   --color-brand: var(--brand)      (themeable meaning — via @theme inline)
component  --button-bg: var(--color-brand)  (consumed by components)
```

Components reference **semantic/component** tokens only — never a primitive or a raw hex.

## Token families

| Family | Tokens |
|--------|--------|
| Color | brand, semantic (`success`/`warning`/`danger`/`info`), neutral scale, surface/content |
| Spacing | `xs sm md lg xl 2xl` on a 4px base |
| Typography | font families, size scale, weights, line-heights |
| Sizing | radius, shadow, border width, z-index layers |

## Wiring into Tailwind (v4, CSS-first)

Tailwind v4 has no `tailwind.config.js` by default — the theme lives in CSS via `@theme`, and opacity modifiers (`bg-brand/50`) work automatically through `color-mix()`, so the old `rgb(var(--…) / <alpha-value>)` channel trick is gone. Register **semantic** tokens with `@theme inline` so they emit utilities *and* re-theme when the underlying variable changes:

```css
/* app.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

/* primitives — raw palette, plain CSS vars, never consumed directly */
:root {
  --blue-600: #2563eb;
  --gray-50:  #f9fafb;
  --gray-900: #111827;
  --white:    #ffffff;
}

/* semantic — themeable meaning; `inline` so overriding the var below re-themes */
@theme inline {
  --color-brand:   var(--brand);
  --color-surface: var(--surface);
  --color-content: var(--content);
}

/* theme assignments — swap these, components never change */
:root { --brand: var(--blue-600); --surface: var(--white);    --content: var(--gray-900); }
.dark { --surface: var(--gray-900); --content: var(--gray-50); }
```

Now `bg-surface`, `text-content`, and `bg-brand/50` all resolve, and dark mode is a variable swap.

## Workflow

1. **Audit** raw values in the codebase that should be tokens.
2. **Name** every decision into the three layers.
3. **Author** `app.css`: primitives as plain `:root` vars, then register semantic tokens with `@theme inline` (v4 needs no `tailwind.config`).
4. **Theme** by overriding the underlying vars under `.dark` / `[data-brand]` — components don't change.
5. **Document** each token and its usage rule.
6. *(At scale)* **Generate** from a single JSON source via Style Dictionary → CSS + Tailwind + native. For a working Style Dictionary config, a token JSON sample, and the full mapping table, see **design-systems-architecture** → `references/token-pipeline.md`.

## Next steps

- Consume these tokens in **css-styling-pixel-perfect** and **component-library-mastery**
- Govern them at scale with **design-systems-architecture**
