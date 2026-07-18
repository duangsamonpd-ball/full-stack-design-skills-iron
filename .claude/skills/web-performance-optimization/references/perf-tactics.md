# Performance Tactics — code recipes

Concrete fixes per metric plus measurement setup. Loaded on demand by the
`web-performance-optimization` skill.

---

## Measure first

### Field vitals (real users)
```js
import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(console.log); onINP(console.log); onCLS(console.log)
// send to your analytics endpoint instead of console in production
```

### Bundle analyzer
```bash
# Vite / Astro
npm i -D rollup-plugin-visualizer
```
```js
// vite.config.ts / astro.config.mjs (vite: { plugins: [...] })
import { visualizer } from 'rollup-plugin-visualizer'
export default { plugins: [visualizer({ open: true, gzipSize: true })] }
```
Look for: large single deps, duplicated packages, moment/lodash-style heavyweights.

---

## LCP — largest contentful paint

```html
<!-- preload + prioritize the hero image; never lazy-load it -->
<link rel="preload" as="image" href="/hero-800.avif" fetchpriority="high" />
<img src="/hero-800.avif" width="800" height="450" fetchpriority="high" alt="…" />
```
```css
/* avoid invisible text blocking paint; swap in fallback immediately */
@font-face { font-family: Inter; src: url(/inter.woff2) format('woff2'); font-display: swap; }
```
- Serve modern formats (AVIF/WebP) at the displayed size.
- Remove/inline render-blocking CSS for above-the-fold; defer non-critical CSS/JS.

---

## INP — interaction responsiveness

### Break up long tasks
```js
// yield to the browser between chunks so input stays responsive
async function processAll(items) {
  for (let i = 0; i < items.length; i++) {
    doWork(items[i])
    if (i % 50 === 0) await new Promise(r => setTimeout(r)) // or scheduler.yield()
  }
}
```

### Debounce expensive handlers
```js
function debounce(fn, ms = 150) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
}
input.addEventListener('input', debounce(search))
```

### Move heavy work off the main thread
```js
const worker = new Worker(new URL('./heavy.worker.ts', import.meta.url), { type: 'module' })
worker.postMessage(payload)
worker.onmessage = e => render(e.data)
```

---

## CLS — layout stability

```html
<!-- reserve space so images don't shove content when they load -->
<img src="…" width="1200" height="630" style="aspect-ratio:1200/630; width:100%; height:auto" alt="…" />
```
```css
/* reserve space for async/injected UI instead of popping it in */
.ad-slot { min-height: 250px; }
```
- Preload fonts and tune fallback metrics (`size-adjust`) so the swap doesn't reflow.
- Never insert banners/content above existing content after load.

---

## Bundle size

### Route-level code splitting
```tsx
// React
import { lazy, Suspense } from 'react'
const Settings = lazy(() => import('./routes/Settings'))
<Suspense fallback={<Spinner />}><Settings /></Suspense>
```
```ts
// Vue
import { defineAsyncComponent } from 'vue'
const Settings = defineAsyncComponent(() => import('./routes/Settings.vue'))
```
```astro
---
// Astro: islands are split automatically; hydrate lazily
import Chart from '../components/Chart.tsx'
---
<Chart client:visible />   <!-- JS loads only when scrolled into view -->
```

### Defer third-party scripts
```html
<script src="https://analytics.example.com/a.js" defer></script>
<!-- or load on interaction / idle, not on initial render -->
```

### Replace heavy deps
- date: `date-fns` (tree-shakeable) or `Intl` over `moment`.
- utils: native methods / small helpers over full `lodash`; if needed, import per-function.

---

## Before/after table (keep one per effort)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| LCP | 4.1s | 2.2s | ✅ |
| INP | 320ms | 140ms | ✅ |
| CLS | 0.24 | 0.02 | ✅ |
| JS (gzip) | 380 KB | 190 KB | ✅ |

---

## CI budget (guard the wins)

```js
// bundlesize / size-limit config
[{ "path": "dist/assets/index-*.js", "limit": "200 KB" }]
```
Fail the build when a bundle exceeds budget or a Lighthouse CI assertion drops below
target — see `deployment-devops-workflow`.
