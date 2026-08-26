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

Tailwind v4 has no `tailwind.config.js` by default — the theme lives in CSS via `@theme`, and opacity modifiers (`bg-brand/50`) work automatically through `color-mix()`, so the old `rgb(var(--…) / <alpha-value>)` channel trick is gone. Register **semantic** tokens so they emit utilities *and* re-theme when the underlying variable changes. Use `@theme inline` when components consume tokens **as utility classes** (`bg-brand`); see the inline-vs-static trade-off below if they read raw `var(--color-*)` instead:

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

### Not every surface follows the theme, and text on those needs its own pair

Some surfaces are a fixed colour in both modes: a footer that is always dark, a
solid status badge whose fill is a brand colour the theme never remaps, a
section band painted a specific light tint. Paint `text-content` on one of those
and it flips underneath you — a `#F5F5F5` heading on a `#F8FAFC` band is
**1.04:1**, which is invisible, and no gate that only compares token layers to
each other will say a word.

Give those surfaces their own text pair, and name it for **what decides the
value — how light the background is** — not for the mode:

```css
--color-text-on-dark-heading:  #FFFFFF;   --color-text-on-light-heading: var(--neutral-900);
--color-text-on-dark-body:     var(--neutral-200);  --color-text-on-light-body: var(--neutral-800);
```

None of them is remapped under `.dark`, and that is the point. Beware the
tempting name **`on-color`**: it promises to work on any fill and cannot. White
clears AA on a deep violet (15:1) but not on the same system's warning yellow
(1.99:1) or success green (2.17:1) — measured across ten in-scale backgrounds,
seven failed. If one value cannot serve every case, the name must not claim it
does.

### Dark surfaces step the opposite way from light ones

In light, bands recede by getting **darker** than a white page. The reflex is to
carry that direction into dark — a band darker than an already-dark page — and
it contradicts the rest of the system, because elevation in dark almost always
reads as **lighter** (a card on a dark page is lighter than it). Mirror instead:

```
light   page #FFFFFF → band #F8FAFC → band-alt #F2F9FE → shade #F1F5F9   stepping down
dark    page #260F27 → band #391C39 → band-alt #372647 → shade #462244   stepping up
card    #522950 sits above every band in dark, as white does in light
```

Two things this exposes. **Check the rung you land on is not already spoken
for** — putting the dark shade band on the same rung as `card` *and* `border`
made a card on that band disappear at 1.000 contrast, fill and outline together;
the fix was one new rung between two existing ones. And **a derived value has to
be recomputed when what it derives from moves**: a tinted band defined as
"brand at 8% over rung 950" silently inverted its own relationship once its
neighbour moved to rung 900.

### `@theme inline` vs plain `@theme` — pick by how components read tokens

`@theme inline` inlines the value into the generated utilities but does **not** expose `--color-*` on `:root`. So utility classes (`bg-brand`) re-theme correctly, while a raw `var(--color-brand)` in your own CSS resolves to nothing.

If components read tokens as **raw custom properties** — e.g. inside an Astro/Vue/`.astro` component `<style>` block, not as utility classes — register them with **plain `@theme`** (not `inline`) so the variables actually land on `:root`, and add **`static`** so a token no utility references isn't tree-shaken out:

```css
/* components read var(--color-brand) directly, so emit it to :root and keep it */
@theme static {
  --color-brand:   var(--brand);
  --color-surface: var(--surface);
  --color-content: var(--content);
}
```

Rule of thumb: **utility-class consumers → `@theme inline`; raw-`var()` consumers → `@theme static`.** Mixing is fine — the deciding factor is whether a given token is ever read outside a Tailwind utility.

Worked light / dark / multi-brand theming recipes (with per-theme contrast tuning and a full semantic-token set) are in `references/theming-recipes.md`.

### Tokens that aren't a colour or a length

`@theme` generates utilities for token *families* Tailwind knows (`--color-*`, `--spacing-*`,
`--font-*`…). A decision that doesn't fit one of those — a target size, an elevation recipe,
a focus-ring treatment — is still a token; it just needs `@utility` to become a class:

```css
@utility focus-ring {           /* one decision, composable, gets variants for free */
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

This is the v4 replacement for the JS plugin API. Reach for it before `@layer components` +
`@apply` — see `css-styling-pixel-perfect` → `references/tailwind-v4-recipes.md`.

### A colour baked into exported artwork is a token nothing can reach

A hex inside an SVG is a **copy** of a token, living outside the system, that no
gate on the consuming side reads. It does not participate in dark mode, it does
not follow a rename, and it does not move when the decision moves.

Measured: a ruling moved a set of review stars onto `brand/accent-1`. The design
system was already correct and the design file followed the same day — and two
exported artwork files kept the previous partner's red for **four days**,
shipping the whole time. It surfaced when the designer opened the frame and
asked whether the change had been seen. Nothing in the pipeline could have said
so, because a fill inside a file is not a token usage anything scans.

**The pattern: mask the artwork, paint it from the token.**

```css
.mark {
  background-color: var(--color-brand-accent-1);
  mask-image: url("mark.svg");
  mask-size: contain;
  mask-repeat: no-repeat;
}
```

Then set the file's own fill to `currentColor`. That second half is the part
people skip, and it is the half that decides how the NEXT mistake fails: if
anyone points a plain `<img>` at that file again it renders **black** — a fault
someone sees in the first screenshot — instead of a plausible wrong brand
colour, which is a fault that waits four days for a designer to notice.

**Gate the painted colour, not the source.** A grep over the stylesheet says
what was written; only the render says what won. Three states look identical to
a source scan and different on screen: a rule that is present and LOSES to
another, a mask that fails and leaves a filled box, and `var(--gone)` which
computes to nothing at all. Read the painted pixel — or at minimum the computed
value on the element — and assert the token's own colour is what came out.

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
