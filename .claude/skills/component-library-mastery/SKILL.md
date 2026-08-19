---
name: component-library-mastery
description: Create and scale component libraries with organization, variants, documentation, and design-token integration for React, Astro, and Vue; for system-wide API contracts, governance, and versioning use design-systems-architecture. Use when the user says "build component library", "create component system", "scale component system", "component library structure", or "component organization".
---

# Component Library Mastery

Create and scale a component library with clear organization, typed variants, documentation, and design-token integration — so it stays maintainable as it grows from a handful of components to 50+.

## When to use this skill

- Building a component library from scratch
- Scaling scattered components into a real system
- Deciding folder structure, variants, naming, and governance

## Workflow

### 1. Inventory
Catalog what exists. List every current component, note duplicates ("three button variants in three files"), and group by purpose. This reveals the primitives worth extracting first.

### 2. Folder structure
Pick an organizing principle and document it. For a shared design system, organize **by type**:

```
src/components/
├── primitives/        base building blocks
│   ├── Button/
│   ├── Input/
│   └── Label/
├── forms/             composed form controls
├── layout/            Stack, Grid, Container
├── cards/             container/surface components
├── utilities/         shared helpers (cn, hooks)
└── index.ts           public barrel export
```

One folder per component, with co-located parts:

```
Button/
├── Button.tsx        (or .astro / .vue)
├── Button.types.ts
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```

### 3. Component architecture
Set the rules every component follows:
- **Naming** — components `PascalCase`, props/handlers `camelCase`, boolean props read as flags (`isLoading`, `disabled`)
- **Props over configuration** — expose variants as props, don't fork files
- **Composition** — small primitives compose into larger components; avoid mega-components with 20 props
- **Forward refs & spread rest props** so consumers can extend

### 4. Variants
Use a typed variant map so every combination is intentional. Example with `cva`:

```tsx
// Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utilities/cn'

const button = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-fg hover:opacity-90',
        secondary: 'bg-surface text-content ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        ghost: 'text-content hover:bg-gray-100',
      },
      size: { sm: 'h-8 px-sm text-sm', md: 'h-10 px-md text-base', lg: 'h-12 px-lg text-lg' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  isLoading?: boolean
}

export function Button({ variant, size, isLoading, className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ variant, size }), className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Spinner aria-hidden="true" /> : children}
    </button>
  )
}
```

More variant recipes — compound variants, slots/anatomy, polymorphic `as`, `tailwind-merge` override safety, plus Input/Card examples and Vue/Astro equivalents — are in `references/variant-recipes.md`.

### 5. Design-token integration
Components consume tokens from the **design-tokens-system** system (`bg-brand`, `px-md`) — never hardcoded values. A component that reaches for `bg-[#2563eb]` breaks theming.

### 6. The public surface — barrel + exports map

A component nobody can import isn't in the library. Two hand-kept things decide that: the
barrel (`index.ts`) and the package's `exports` map — and both fail *late*. A missing barrel
line surfaces as `[MISSING_EXPORT]` inside whatever app consumes the library, long after the
commit that caused it; a stale `exports` target breaks only the one import path that uses it,
so it can sit wrong for months.

```jsonc
// package.json
{
  "exports": {
    ".": "./index.ts",
    "./tokens.css": "./styles/tokens.css",
    "./package.json": "./package.json"
  }
}
```

Export `./package.json` on purpose — tooling reads it, and once an `exports` map exists,
anything not listed in it is unreachable.

**The trap worth knowing before you debug it: an `exports` map is consulted only for
_name-based_ resolution.** A relative import (`from '../../components'`) walks the filesystem
and never sees the map, so the barrel is simply not found. The package has to resolve as
`node_modules/<name>` — a workspace member, `npm link`, or a symlink. And when testing that
with a throwaway consumer, symlink to a path **inside** the test project rather than to an
absolute path elsewhere on disk: Vite mangles the resolved path and fails with "No cached
compile metadata", which reads like a bug in the component and is nothing of the sort.

Gate it. The check is a short zero-dependency script asserting four things:

```
□ every components/*.<ext> is re-exported from the barrel
□ every barrel export resolves to a file that exists
□ barrel exports stay alphabetical — if the file claims to be, keep diffs small
□ every exports target in every package.json exists on disk
   (for a wildcard subpath like "./styles/*", assert the directory)
```

Add one **warning**, not an error: a component with no docs page. Parity and docs checks
skip what they can't find, so that gap is silent precisely where it matters most.

### 6b. The ownership boundary — a component may not style what it does not render

The moment a component gains a `<slot />` or starts composing another, its own
selectors can reach markup that belongs to someone else. This is the failure that
recurs, because each instance looks local and correct when it is written.

- **A descendant combinator crosses the boundary; a child combinator usually
  does not.** `.menu li { display: flex }` was a nav's own rule and right for
  years. Then a nav item gained a flyout, so a panel — and everything a consumer
  slots into it — came to live inside one of those `<li>`s, and every row in that
  panel became a flex ITEM and shrank to its content. `.menu > li` bounds it to
  the one level the component demonstrably owns.
- **`>` is not automatic safety either.** `.right > a` still escaped, because
  what sits there is a *composed child component*, not the component's own markup.
  The question is never the combinator; it is whether the subtree can hold
  another component's elements.
- **To style a child you compose, do it deliberately.** Publish a `[data-part]`
  hook from the child and target that from a global block, so the crossing is
  written down. Reaching for the child's internal classes is the version that
  breaks silently when the child is refactored.

**Scoped CSS stops being scoped the moment you flatten it.** Frameworks like
Astro rewrite each selector with a scope attribute — and on more compounds than
you expect, so `.menu > li` compiles to `.menu[cid] > li[cid]`. Inside the app
that makes the rule unable to leave the component. But a static docs page has no
build step, so the styles get concatenated **unscoped** and the scope attributes
get stripped from the markup — and every selector the framework had bounded is
suddenly unbounded. Two consequences, both real:

- a rule that is safe in the app misfires on the docs pages (the flyout case above
  was *only* ever a docs-page fault), and
- a rule the author intended can be a **no-op in the app** while appearing to work
  in the docs — a `position: relative` meant to make a composed button a
  containing block had never once applied outside the docs pages.

Gate it against the RENDERED TREE rather than by reading selectors, because the
selector's shape does not decide it: `.brand-text b` has the same shape and is
safe, since nothing but that component can put a `<b>` there. Take each scoped
rule, strip the scope attributes to get what the flat file will use, ask the page
what that matches, and flag any hit not carrying the rule's own scope.

```
□ no component rule matches an element from another component once flattened
□ a rule that must reach a composed child is global and says so
□ children are targeted by published [data-part], never by their classes
```

### 6c. Taking a component OFF the public surface

Demoting a component — it turned out to be one component's internal machinery,
not a library primitive — is a bigger edit than moving the file, and the gates
only catch some of it:

```
□ barrel export removed; every consumer switched to the internal path
□ the "N components" heading AND every other sentence stating a count
□ its demo/story keeps rendering, from wherever it now lives
□ the docs page's inline copy of its CSS — DELETE it
```

That last one is the quiet one. If parity requires a component's stylesheet to be
copied onto its docs page, moving the component stops parity asking — and nobody
deletes the copy. An inline `<style>` outranks every linked sheet, so the page
goes on serving the version from before the move. Three consecutive fixes to that
component were correct and appeared to do nothing.

### 7. Documentation & stories
Each component ships a Storybook story showing every variant/state, plus a short usage note (when to use it, props, do/don't):

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = { title: 'Primitives/Button', component: Button }
export default meta

export const Primary: StoryObj<typeof Button> = { args: { children: 'Save' } }
export const Secondary: StoryObj<typeof Button> = { args: { variant: 'secondary', children: 'Cancel' } }
export const Loading: StoryObj<typeof Button> = { args: { isLoading: true, children: 'Saving' } }
```

**Never hand-type demo markup into a docs page.** A story renders the real component, so it
can't lie; a docs page with hand-written example markup drifts the moment the component's DOM
changes — a new wrapper element, a renamed class, an added `aria-*` — and every gate stays
green while the page shows structure that no longer exists. The worst version is a docs page
advertising a feature the component never had, because nothing ever forced the two together.

Generate that markup from a real render instead:

1. A small app renders the real components inside marked regions — `<div data-demo="region">`.
2. A build script builds it, extracts each region from the **rendered HTML output**, and writes
   it into matching sentinels in the docs page:
   ```html
   <!-- demo:preview -->
   …generated, do not edit by hand…
   <!-- /demo:preview -->
   ```
3. Give the script a `--check` mode that fails when the docs are not already current — same
   relationship a token generator has to its drift gate — and wire it into CI.

Two traps worth knowing before you build it. **Strip framework scope markers before diffing**
— Astro's `data-astro-cid-*` is emitted in both a bare and a value-carrying form, and missing
the second means the output churns on every build and the gate cries wolf. And **never fake a
demo with a script that imitates the component's markup**: it will look right and drift exactly
like the hand-typed version it replaced. Render the real thing or don't generate it.

### 8. Contribution guidelines
Define how a new component gets in: the checklist below must pass, it must use tokens, ship a story + test, and follow naming conventions. This is what keeps quality flat as contributors multiply.

### 9. Scale & maintain
Roll out in phases and manage change deliberately:
- **Phase 1** — primitives (Button, Input, Label, Text)
- **Phase 2** — composed (Form fields, Card, Modal, Dropdown)
- **Phase 3** — patterns/templates (page layouts, data tables)
- **Deprecation** — mark old APIs, provide a codemod or migration note, remove on a schedule

## Component checklist (definition of done)

```
□ Uses design tokens (no hardcoded colors/spacing)
□ Typed props + sensible defaults
□ All variants & states covered (hover/focus/active/disabled/loading)
□ Keyboard accessible + visible focus + accessible name
□ Storybook story for every variant
□ Unit test for behavior/props
□ Exported from the barrel (index.ts) + reachable through the exports map
□ Follows naming conventions
```

## Framework notes

- **React** — `cva` + `cn` for variants; forward refs; co-locate stories/tests.
- **Astro** — primitives can be `.astro` for static output; hydrate islands only where interactivity is needed.
- **Vue** — SFC `<script setup>` with typed `defineProps`; compute variant classes; expose via `defineExpose` when refs are needed.

## Common pitfalls

- **God components** — 20 props doing everything → split into composable primitives
- **Copy-paste variants** — new file per style → use a variant map instead
- **Hardcoded values** → breaks theming; consume tokens
- **No docs** → nobody discovers or trusts the component; it gets re-invented
- **Inconsistent naming** → friction and bugs; enforce conventions in review

## Tools

Storybook · class-variance-authority (`cva`) · TypeScript · Testing Library · tsup/Vite for building.

## Next steps to recommend

- Set up tokens first with **design-tokens-system**
- Run **web-accessibility-a11y** on each primitive before promoting it
- Use **design-to-code-workflow** to implement new components against the system
