# Token Pipeline — single source → every platform

A working setup for generating tokens from one source into CSS variables (consumed by
Tailwind v4's `@theme`) and native formats. Loaded on demand by the
`design-systems-architecture` skill.

## The three layers, mapped

| Layer | Example token | Value / reference | Consumed by |
|-------|---------------|-------------------|-------------|
| **primitive** | `blue.600` | `#2563eb` (raw hex / oklch) | semantic tokens only |
| **primitive** | `space.4` | `1rem` | semantic tokens only |
| **semantic** | `brand` | → `{blue.600}` | components, themeable |
| **semantic** | `content` | → `{gray.900}` | components |
| **semantic** | `space.inset.md` | → `{space.4}` | components |
| **component** | `button.bg` | → `{brand}` | Button only |
| **component** | `button.padding.x` | → `{space.inset.md}` | Button only |

Rule: a component never references a primitive. Reskinning = editing semantic tokens.

## Source of truth (tokens JSON, Style Dictionary format)

Keep the semantic names **out of** a `color.*` path so the generated vars (`--brand`)
don't collide with Tailwind v4's own `--color-*` theme namespace.

```json
// tokens/tokens.json
{
  "blue":  { "600": { "value": "#2563eb" } },
  "gray":  { "900": { "value": "#111827" }, "0": { "value": "#ffffff" } },
  "brand":   { "value": "{blue.600}" },
  "content": { "value": "{gray.900}" },
  "surface": { "value": "{gray.0}" },
  "space":   { "4": { "value": "1rem" }, "inset": { "md": { "value": "{space.4}" } } },
  "button":  { "bg": { "value": "{brand}" }, "padding": { "x": { "value": "{space.inset.md}" } } }
}
```

## Style Dictionary config → CSS variables

Tailwind v4 is CSS-first (no `tailwind.config.js`), so the pipeline only needs to emit CSS
custom properties — Tailwind consumes them via `@theme inline` (below). No JS/Tailwind-config target.

```js
// style-dictionary.config.js
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
    },
    // add native targets (iOS/Android) as more platforms off the same source
  },
}
```

`outputReferences: true` preserves the `var(--…)` chain so the semantic layer stays
themeable in the generated CSS instead of being flattened to raw values.

## Generated output + Tailwind v4 registration

```css
/* src/styles/tokens.css (generated — never hand-edit) */
:root {
  --blue-600: #2563eb;
  --gray-900: #111827;
  --gray-0: #ffffff;
  --brand: var(--blue-600);          /* reference preserved */
  --content: var(--gray-900);
  --surface: var(--gray-0);
  --space-4: 1rem;
  --space-inset-md: var(--space-4);
  --button-bg: var(--brand);
  --button-padding-x: var(--space-inset-md);
}
```

```css
/* src/styles/app.css — hand-authored entry point */
@import "tailwindcss";
@import "./tokens.css";
@custom-variant dark (&:where(.dark, .dark *));

/* Register semantic tokens into Tailwind's theme so utilities exist.
   `inline` means overriding --brand/--surface/--content below re-themes,
   and opacity modifiers (bg-brand/50) work automatically via color-mix. */
@theme inline {
  --color-brand:   var(--brand);
  --color-surface: var(--surface);
  --color-content: var(--content);
  --spacing-md:    var(--space-inset-md);
}
```

Now `bg-brand`, `bg-surface`, `text-content`, `p-md`, and `bg-brand/50` all resolve.

## Theming as a semantic-layer override

```css
/* tokens.css base = light; themes override only the semantic vars */
.dark                { --content: var(--gray-0);  --surface: var(--gray-900); }
[data-brand="acme"]  { --brand: var(--teal-600); }   /* --teal-600 = another primitive */
```

Primitives and component tokens are untouched — a new brand is one override block. Emit
these theme blocks from Style Dictionary too (one build target per theme) or hand-author them.

## Pipeline in CI

```
edit tokens.json → style-dictionary build → tokens.css
                 → commit generated file (or run as a build step)
                 → @theme inline registers it → consumed by Tailwind + components
```

Treat generated files as build artifacts: never hand-edit them; change the JSON source.
