---
name: frontend-framework-guide
description: Choose and apply the right patterns across React, Astro, and Vue — component model, state, data fetching, and the interactivity/hydration boundary. Use when the user says "react vs astro vs vue", "which framework", "astro islands", "component patterns", or "framework best practices".
---

# Frontend Framework Guide

Pick the right framework/pattern for the job, then apply idiomatic patterns in React, Astro, and Vue. The recurring mistake is shipping more client JavaScript than the interaction actually needs — most of this skill exists to prevent that.

## When to use this skill

- Deciding React vs Astro vs Vue for a page or feature
- Getting the interactivity/hydration boundary right
- Applying idiomatic component, state, and data-fetching patterns

## Choosing a framework

| Situation | Lean toward |
|-----------|-------------|
| Content-heavy, mostly static, SEO-critical (marketing, docs, blog) | **Astro** — ships ~zero JS, islands only where needed |
| Highly interactive app, rich client state (dashboards, editors) | **React** or **Vue** |
| Mixed: static shell with interactive pockets | **Astro** + React/Vue islands |
| Existing team expertise / ecosystem lock-in | The one the team already knows well |

Default heuristic: **start static (Astro), add interactivity as islands.** Reach for a full SPA only when the whole surface is genuinely interactive.

## The interactivity boundary (the key decision)

Ship the least JavaScript that meets the need. Draw a clear line between static markup and interactive code:

- **Astro** — everything is static HTML until you opt a component in with a `client:*` directive. Pick the *cheapest* directive that works:
  - `client:idle` — non-urgent widgets (defer to idle time)
  - `client:visible` — below-the-fold interactivity (hydrate when scrolled into view)
  - `client:load` — needed immediately on load (use sparingly)
- **React / Vue SPA** — the whole tree is client JS. Keep leaf components dumb/presentational; concentrate state where it's actually used; code-split by route so the *initial* bundle stays small.

Rule: if a component has no state and no event handlers, it should not ship JavaScript. In Astro that's automatic; in React/Vue it means not turning static content into client components.

## Idiomatic patterns (summary)

Full side-by-side code — a Button and a data-fetch — is in `references/framework-patterns.md`.

- **React** — function components + hooks; lift state minimally; `React.lazy`/`Suspense` for splitting; memoize only proven hot paths; server-fetch (RSC/loader) or fetch-in-effect with proper cleanup.
- **Astro** — `.astro` components are server-rendered and static; frontmatter (the `---` block) runs at build/request time — do data fetching there with top-level `await`; hydrate islands only where interactive.
- **Vue** — SFC `<script setup>` + Composition API; `computed`/`watch` deliberately; `defineProps`/`defineEmits` for the contract; async components for route-level chunks.

## State & data — where it should live

1. **Server / build time first** — fetch data where the component renders (Astro frontmatter, React server component/loader, Vue server setup) so the client ships less.
2. **Local component state** — for UI-only concerns (open/closed, input value).
3. **Shared client state** — lift to the nearest common ancestor; reach for a store (Nano Stores for Astro islands, Context/Zustand for React, Pinia for Vue) only when prop-drilling genuinely hurts.

Don't put on the client what the server already knows.

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Whole Astro page marked `client:load` | Hydrate only the interactive island; pick `visible`/`idle` |
| Every React leaf is a client/stateful component | Keep leaves presentational; lift state up |
| Data fetched in the browser that could be server-rendered | Fetch at build/request time; hydrate with the result |
| Global store for everything | Use local state; store only truly shared state |
| Prematurely memoizing everything | Measure first; memoize proven hot paths |

## Next steps

- Implement designs with **design-to-code-workflow**
- Keep the initial bundle lean with **web-performance-optimization**
- Structure reusable components via **component-library-mastery**
