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

### 5. Design-token integration
Components consume tokens from the **design-tokens-system** system (`bg-brand`, `px-md`) — never hardcoded values. A component that reaches for `bg-[#2563eb]` breaks theming.

### 6. Documentation & stories
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

### 7. Contribution guidelines
Define how a new component gets in: the checklist below must pass, it must use tokens, ship a story + test, and follow naming conventions. This is what keeps quality flat as contributors multiply.

### 8. Scale & maintain
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
□ Exported from the barrel (index.ts)
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
