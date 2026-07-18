---
name: web-performance-optimization
description: Profile and optimize frontend rendering, bundle size, and Core Web Vitals (LCP, INP, CLS) for React, Astro, and Vue apps. Use when the user says "optimize performance", "improve core web vitals", "reduce bundle size", "slow page", "lighthouse score", or "web vitals".
---

# Web Performance Optimization

Profile a frontend and improve rendering, bundle size, and Core Web Vitals with **measured, before/after results** — never guesswork.

## When to use this skill

- Slow page load, janky interaction, or poor Lighthouse score
- Reducing JavaScript bundle size
- Improving Core Web Vitals (LCP, INP, CLS)

## The rule: measure, fix the biggest cost, re-measure

Optimizing without a profile wastes effort on things that don't matter. Always baseline first, then attack the single worst metric.

## Core Web Vitals targets

| Metric | Good | Measures | Usual culprit |
|--------|------|----------|---------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | load speed of the main content | slow/late hero image, render-blocking JS/CSS |
| **INP** (Interaction to Next Paint) | < 200ms | responsiveness to input | long main-thread tasks, too much JS |
| **CLS** (Cumulative Layout Shift) | < 0.1 | visual stability | unsized images/ads, late fonts, injected content |

## Workflow

1. **Measure** — baseline with Lighthouse + a real profile (DevTools Performance panel, `web-vitals` in the field). Record the numbers.
2. **Set targets & find the gap** — which vital fails, and by how much?
3. **Locate the biggest cost** — bundle analyzer for JS weight, network waterfall for requests, flame chart for render/hydration cost.
4. **Apply the highest-leverage fix** for the worst metric (tactics below; deeper code in `references/perf-tactics.md`).
5. **Re-measure** — confirm the number moved; keep a before/after table.
6. **Guard it** — a bundle-size and/or Lighthouse budget in CI so wins don't regress (wire via **deployment-devops-workflow**).

## Highest-leverage fixes by metric

- **LCP** — optimize + `preload` the hero image (modern format, right size), serve above-the-fold from the server, remove render-blocking resources, use `font-display: swap`.
- **INP** — ship less JS, break long tasks (`scheduler.yield`/chunking), debounce handlers, move heavy work to a Web Worker, avoid hydrating what isn't interactive.
- **CLS** — set `width`/`height` or `aspect-ratio` on media, reserve space for dynamic content, preload fonts and match fallback metrics, never insert content above existing content.
- **Bundle size** — code-split by route, lazy-load below-the-fold, tree-shake, replace heavy dependencies (audit with the analyzer), defer third-party scripts.

## Framework tactics

- **Astro** — the biggest lever: ship ~zero JS by default; hydrate islands with `client:visible`/`client:idle`, not `client:load`. Static/SSR HTML gives fast LCP for free.
- **React** — `React.lazy` + `Suspense` for route splitting; `memo`/`useMemo`/`useCallback` on **proven** hot paths only; virtualize long lists; prefer server components to cut client JS.
- **Vue** — `defineAsyncComponent` for route chunks; `v-once`/`v-memo` for static/expensive subtrees; async components to split.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Optimizing without a profile | Measure first; fix the worst metric |
| Memoizing everything in React | Measure; memoize only proven hot paths |
| Hydrating a whole Astro page | Islands + `visible`/`idle` |
| Lazy-loading the LCP image | Never lazy-load above-the-fold; preload it |
| Chasing Lighthouse lab score only | Also watch field data (real INP/LCP) |

## Next steps

- Feed component-level wins back into **component-library-mastery**
- Re-run **css-styling-pixel-perfect** if optimizations shifted layout
- Add perf budgets as a CI gate via **deployment-devops-workflow**
