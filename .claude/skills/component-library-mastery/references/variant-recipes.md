# Variant & composition recipes

On-demand depth for `component-library-mastery`. Deeper `cva` patterns plus composition and
override-safety, with two more worked components. React shown; Vue/Astro equivalents at the end.

## Compound variants + defaults

A compound variant applies only when *several* props combine — the tool for "this variant needs
a tweak at this size" without forking files.

```tsx
const button = cva('inline-flex items-center justify-center rounded-md font-medium transition', {
  variants: {
    variant: { primary: 'bg-brand text-brand-fg', ghost: 'text-content hover:bg-surface-2' },
    size:    { sm: 'h-8 px-sm text-sm', md: 'h-10 px-md', lg: 'h-12 px-lg text-lg' },
  },
  compoundVariants: [
    { variant: 'ghost', size: 'lg', class: 'px-md' },   // large ghost gets tighter padding
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})
```

## Override safety — always merge with `cn`

Consumers must be able to pass `className`. Use `tailwind-merge` so their class *wins* instead
of producing two conflicting utilities.

```tsx
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'
export const cn = (...a: any[]) => twMerge(clsx(a))
// <button className={cn(button({ variant, size }), className)} />
// cn('px-md', 'px-lg') -> 'px-lg'  (last wins; no specificity war)
```

## Anatomy & slots (compound components)

Prefer named parts over a prop explosion. Expose sub-components so consumers compose:

```tsx
<Card>
  <Card.Header>…</Card.Header>
  <Card.Body>…</Card.Body>
</Card>
// Card.Header = (p) => <div className={cn('px-6 pt-6', p.className)} {...p} />
```
Rule: if a component crosses ~8 props, it probably wants slots instead.

## Polymorphic `as` + forwarded ref

Let a component render as a different element while keeping styles and ref forwarding:

```tsx
const Text = forwardRef<HTMLElement, { as?: any; className?: string }>(
  ({ as: As = 'p', className, ...rest }, ref) =>
    <As ref={ref} className={cn('text-content', className)} {...rest} />
)
```

## Worked: Input (with error state)

```tsx
const input = cva('h-10 w-full rounded-md border bg-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring', {
  variants: { invalid: { true: 'border-danger focus-visible:ring-danger', false: 'border-border' } },
  defaultVariants: { invalid: false },
})
// <input aria-invalid={invalid} className={cn(input({ invalid }), className)} />
```
Pair every field with a `<label htmlFor>` and, on error, `aria-describedby` → the message
(see `web-accessibility-a11y`).

## Worked: Card (surface + elevation via tokens)

```tsx
const card = cva('rounded-xl border border-border bg-surface', {
  variants: { elevation: { flat: '', raised: 'shadow-md', outlined: 'ring-1 ring-border' } },
  defaultVariants: { elevation: 'flat' },
})
```

## Vue / Astro equivalents

- **Vue** — `cva` works unchanged; bind `:class="cn(button({ variant, size }), $attrs.class)"`,
  type props with `defineProps<VariantProps<typeof button>>()`, expose refs via `defineExpose`.
- **Astro** — for static components compute the class in the frontmatter
  (`const cls = cn(button({ variant, size }), className)`) and spread `{...rest}`; hydrate as an
  island only if the component is interactive.

Every variant/state still ships tokens (no hardcoded hex), a Storybook story, a test, and the
full state matrix — see the definition-of-done checklist in the skill.
