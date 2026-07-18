# Code Connect — setup & example

Wiring Figma components to real code so Dev Mode shows the true snippet. Loaded on demand
by the `figma-expert-workflows` skill.

> Prefer the bundled **`figma:figma-code-connect`** skill + Figma MCP tools to author these
> in this environment; the below is the reference for what the mapping file looks like.

---

## Prerequisites

```bash
npm i -D @figma/code-connect
export FIGMA_ACCESS_TOKEN=…   # a token with file read + Code Connect scope
```
You also need the **node URL** of the Figma component (right-click → Copy link to selection).

---

## Example: Button.figma.tsx

Maps a Figma Button's properties to the real React component's props.

```tsx
import figma from '@figma/code-connect'
import { Button } from './Button'

figma.connect(
  Button,
  'https://www.figma.com/design/<FILE_KEY>?node-id=<NODE_ID>',
  {
    props: {
      // Figma variant "Variant" -> code `variant` prop
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
        Ghost: 'ghost',
      }),
      // Figma "Size" -> code `size`
      size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
      // Figma boolean property -> code `disabled`
      disabled: figma.boolean('Disabled'),
      // Figma text layer -> children
      label: figma.string('Label'),
    },
    // what Dev Mode shows: the real component usage
    example: ({ variant, size, disabled, label }) => (
      <Button variant={variant} size={size} disabled={disabled}>
        {label}
      </Button>
    ),
  },
)
```

---

## Publish & verify

```bash
npx figma connect publish
```
- Open the component in Figma **Dev Mode** → the Code section now shows the real `<Button …>`
  snippet with props reflecting the selected variant.
- Re-run `publish` whenever the component's props change.

---

## Helper reference

| Helper | Use for |
|--------|---------|
| `figma.enum('Prop', { FigmaValue: codeValue })` | variant sets / sizes / tones |
| `figma.boolean('Prop')` | on/off Figma properties |
| `figma.string('Layer')` | text content from a layer |
| `figma.instance('Prop')` | a nested component instance |
| `figma.children('*')` | slotted content / composition |

---

## Keep it in sync

- Add "Code Connect published" to each component's **definition of done**
  (see `design-systems-architecture` → component contract).
- Use **one naming grammar** across Figma variants and code props (`variant`/`size`/`state`)
  so the mapping is 1:1 and obvious.
- When a code prop is renamed or a Figma variant changes, update the `.figma.tsx` and
  re-publish in the same PR.
