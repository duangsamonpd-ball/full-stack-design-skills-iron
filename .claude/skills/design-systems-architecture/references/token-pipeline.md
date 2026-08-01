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

> **Prefer the W3C DTCG format for the source** (`$value` / `$type`) — it's the
> vendor-neutral interchange standard that Tokens Studio and Style Dictionary v4 read
> natively, so the source outlives any one generator:
>
> ```json
> { "brand": { "$type": "color", "$value": "{blue.600}" },
>   "space": { "inset": { "md": { "$type": "dimension", "$value": "{space.4}" } } } }
> ```
>
> The generator is swappable; a proven zero-dependency setup is a small Node script that
> reads this JSON and writes the CSS layer, paired with the drift gate below — no build
> framework required.

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

> **`inline` only works if components consume tokens as utility classes.** `@theme inline`
> does **not** emit `--color-brand` onto `:root`, so a raw `var(--color-brand)` inside a
> component's own CSS (an Astro/Vue `<style>` block) resolves to nothing. When components
> read tokens as raw custom properties, register with **`@theme static`** instead — it
> emits the variables to `:root` and never tree-shakes a token no utility references. Same
> trade-off spelled out in the `design-tokens-system` skill.

## Theming as a semantic-layer override

```css
/* tokens.css base = light; themes override only the semantic vars */
.dark                { --content: var(--gray-0);  --surface: var(--gray-900); }
[data-brand="acme"]  { --brand: var(--teal-600); }   /* --teal-600 = another primitive */
```

Primitives and component tokens are untouched — a new brand is one override block. Emit
these theme blocks from Style Dictionary too (one build target per theme) or hand-author them.

## Enforce it — drift is a CI gate, not a convention

```
edit tokens.json → build → tokens.css → @theme layer → Tailwind + components
```

"Never hand-edit the generated file" only holds if something checks. Four gates make a
token pipeline trustworthy in practice:

**1 · Stale-output check.** Give the generator a `--check` mode that regenerates in memory
and diffs the committed file — fail if they differ. A generated layer that drifted from
its source never merges.

```bash
token-build            # writes tokens.css / the @theme layer
token-build --check    # exits non-zero if either is stale — run in CI
```

**2 · Cross-layer drift check.** A tiny zero-dep script parses the source JSON and every
consumable layer, **normalizes each value before comparing** — px vs rem, `0` vs `0px`,
hex case, shadow whitespace — then asserts they still agree. This catches a value edited
in one layer but not the others, and a token a layer invented that the source never
declared.

```
tokens.json ──┬──▶ tokens.css     (plain CSS vars — any project)
(source)      └──▶ @theme layer    (Tailwind registration)
                   drift-check: all three carry the same normalized value
```

**3 · No hardcoded values in components.** grep component styles for raw colors and fail
the build — a hardcoded color is drift from the token layer by definition. Three forms have
to be matched, and it is the second one that gets missed:

- **hex** — `#fff` slips a 6-only regex, and the 8-digit `#aabbccdd` an alpha ramp uses
  slips a pattern that ends in `\b` after six digits: the two alpha digits that follow are
  word characters, so there is no boundary there to match.
- **`rgb()` / `rgba()` / `hsl()` / `hsla()`** — the real blind spot. A hex-only gate reports
  a clean build while twelve of these sit across four components, which is how one tint was
  free to drift to 4% against the design's 5% with every check still green.
- **nothing else** — `transparent`, `currentColor` and `color-mix()` over a token carry no
  literal channel values and are fine.

```js
const RAW_COLOR = /#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{2})?)?\b|\b(?:rgba?|hsla?)\([^)]*\)/g;
```

Steer the fix to the semantic token — and for a tint, to `color-mix(in srgb, var(--token)
8%, transparent)` rather than a literal `rgba()`. The `color-mix` form follows the token
into dark mode; a hardcoded rgba cannot, so it is drift waiting to happen even when its
light-mode value is correct today.

**4 · Every variable a component reads is actually defined.** This gate only applies when
components consume tokens as raw custom properties (`var(--brand)` inside an Astro/Vue
`<style>` block) rather than utility classes — but that is exactly the case `@theme static`
exists for, and this is what proves `static` is still doing its job. Tailwind's scanner
cannot see a `var()` inside a component's own style block, so a token it decides to drop is
invisible until something renders wrong. The failure is silent by design: `var(--x)` with no
declaration and no fallback makes the whole property invalid, and the browser discards the
rule — which is how pages end up with no border at all and a hover color that never applies.

Assert against the **compiled** stylesheet, not the source — the source is what the scanner
is about to prune:

```bash
tailwindcss -i styles/app.css -o .tmp/app.compiled.css
node scripts/check-component-vars.mjs .tmp/app.compiled.css
```

```js
const defined = new Set([...compiled.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

// A component may declare its own custom properties; those resolve locally and
// never need to come from the theme, so they are not usages the theme must satisfy.
const localDefs = new Set([...src.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
for (const [, name] of src.matchAll(/var\((--[\w-]+)/g)) {
  if (!localDefs.has(name) && !defined.has(name)) report(file, name);
}
```

Two refinements worth building in from the start: treat `var(--x, fallback)` as safe, since
only the bare form is a hard dependency; and run the same check over any standalone docs or
demo page that carries its own hand-kept `:root`, because the compiled theme proves nothing
about those — a component can start reading a new token, the page can copy the rule across,
and the variable behind it is simply never declared.

Wire all four into a push/PR workflow. Plain Node keeps them dependency-free, so CI runs
them with no install. The payoff: the generated files are provably in sync with the source
on every commit, and the "single source of truth" claim is actually true.
