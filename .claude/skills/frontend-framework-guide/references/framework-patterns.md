# Framework Patterns — React · Astro · Vue side by side

Concrete, idiomatic implementations of the same two things — a **Button** with variants
and a **data fetch + render** — in each framework. Loaded on demand by the
`frontend-framework-guide` skill. Styling uses Tailwind tokens from `design-tokens-system`.

---

## 1. Button with variants

### React
```tsx
// Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utilities/cn'

const button = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: { primary: 'bg-brand text-brand-fg hover:opacity-90', secondary: 'bg-surface text-content ring-1 ring-inset ring-gray-300' },
      size: { sm: 'h-8 px-sm text-sm', md: 'h-10 px-md text-base' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export function Button({ variant, size, className, ...props }: Props) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}
```

### Astro
```astro
---
// Button.astro — static, ships zero JS
interface Props { variant?: 'primary' | 'secondary'; size?: 'sm' | 'md'; }
const { variant = 'primary', size = 'md' } = Astro.props
const base = 'inline-flex items-center justify-center rounded-md font-medium transition'
const variants = { primary: 'bg-brand text-brand-fg hover:opacity-90', secondary: 'bg-surface text-content ring-1 ring-inset ring-gray-300' }
const sizes = { sm: 'h-8 px-sm text-sm', md: 'h-10 px-md text-base' }
---
<button class={`${base} ${variants[variant]} ${sizes[size]}`}><slot /></button>
```

### Vue
```vue
<!-- Button.vue -->
<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ variant?: 'primary' | 'secondary'; size?: 'sm' | 'md' }>(), {
  variant: 'primary', size: 'md',
})
const base = 'inline-flex items-center justify-center rounded-md font-medium transition'
const variants = { primary: 'bg-brand text-brand-fg hover:opacity-90', secondary: 'bg-surface text-content ring-1 ring-inset ring-gray-300' }
const sizes = { sm: 'h-8 px-sm text-sm', md: 'h-10 px-md text-base' }
const cls = computed(() => `${base} ${variants[props.variant]} ${sizes[props.size]}`)
</script>

<template>
  <button :class="cls"><slot /></button>
</template>
```

**Takeaway:** the Astro version is the only one that ships no JavaScript — for a
non-interactive button, that's the right default.

---

## 2. Fetch data and render a list

### React — server-first, then client fallback

```tsx
// Server Component (preferred) — fetch runs on the server, no client JS for data
async function Users() {
  const res = await fetch('https://api.example.com/users', { next: { revalidate: 60 } })
  const users: User[] = await res.json()
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```
```tsx
// Client fallback (only when it must be client-side) — with cleanup
'use client'
import { useEffect, useState } from 'react'
function Users() {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/users', { signal: ctrl.signal }).then(r => r.json()).then(setUsers).catch(() => {})
    return () => ctrl.abort()   // cleanup avoids setState-after-unmount
  }, [])
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### Astro — fetch in frontmatter (build/request time)

```astro
---
// runs on the server; the browser receives finished HTML, zero data-fetch JS
const users: User[] = await fetch('https://api.example.com/users').then(r => r.json())
---
<ul>{users.map(u => <li>{u.name}</li>)}</ul>
```

### Vue — Composition API with async setup or onMounted

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const users = ref<User[]>([])
onMounted(async () => {
  users.value = await fetch('/api/users').then(r => r.json())
})
</script>

<template>
  <ul><li v-for="u in users" :key="u.id">{{ u.name }}</li></ul>
</template>
```

**Takeaway:** prefer fetching where the component renders on the server (Astro frontmatter,
React server component). Client-side fetch (`useEffect` / `onMounted`) is the fallback for
data that genuinely depends on client state — and always clean up in-flight requests.

---

## 3. The hydration boundary in Astro (putting it together)

```astro
---
import Header from '../components/Header.astro'        // static
import SearchBox from '../components/SearchBox.tsx'    // interactive island
import Newsletter from '../components/Newsletter.vue'  // interactive island
---
<Header />                                <!-- 0 KB JS -->
<SearchBox client:idle />                 <!-- hydrates when the browser is idle -->
<Newsletter client:visible />             <!-- hydrates when scrolled into view -->
```

Everything not marked `client:*` stays static HTML. Choose the cheapest directive that
still feels responsive: `idle` for background widgets, `visible` for below-the-fold,
`load` only for immediately-needed interactivity.

---

## Quick reference

| Concern | React | Astro | Vue |
|---------|-------|-------|-----|
| Component unit | function component | `.astro` (+ islands) | SFC `<script setup>` |
| Props/contract | props + TS interface | `Astro.props` + interface | `defineProps` |
| Local state | `useState` | (island only) | `ref` / `reactive` |
| Derived state | `useMemo` | — (server-computed) | `computed` |
| Side effects | `useEffect` (+ cleanup) | frontmatter (server) | `onMounted` / `watch` |
| Data fetch | server comp / loader / effect | frontmatter `await` | async setup / `onMounted` |
| Code splitting | `React.lazy` + `Suspense` | islands are split by default | async components |
| Ship zero JS? | no (client) | yes (default) | no (client) |
