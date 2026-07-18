# Responsive Recipes

Copy-ready patterns. Loaded on demand by the `responsive-universal-design` skill.
Tailwind + modern CSS; ideas are framework-agnostic.

---

## Container queries (component responds to its container)

```css
/* mark the parent as a query container */
.card-host { container-type: inline-size; }

/* the card adapts to the host width, not the viewport */
.card { display: grid; gap: 1rem; }
@container (min-width: 28rem) {
  .card { grid-template-columns: auto 1fr; }   /* media beside text when there's room */
}
```

Tailwind (with the container-queries plugin):
```html
<div class="@container">
  <article class="grid gap-md @md:grid-cols-[auto_1fr]">…</article>
</div>
```

Why: the same `.card` now works full-width, in a 3-col grid, or in a narrow sidebar with
no viewport-specific overrides.

---

## Auto-fit / auto-fill grid (responsive without breakpoints)

```html
<!-- as many columns as fit at ≥16rem each; wraps automatically -->
<div class="grid gap-md [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">…</div>
```
- `auto-fit` collapses empty tracks (items stretch to fill).
- `auto-fill` keeps empty tracks (items keep their size).

---

## Fluid type & space with clamp()

```css
:root {
  --step-0: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);   /* body */
  --step-2: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);  /* h2 */
  --step-4: clamp(2.5rem, 1.8rem + 3vw, 4rem);       /* display */
}
h1 { font-size: var(--step-4); line-height: 1.05; }
```
`clamp(MIN, PREFERRED, MAX)` scales smoothly between viewports with hard floors/ceilings —
no breakpoint jumps. Use `rem` in MIN/MAX so OS text scaling still applies.

---

## Responsive navigation (reflow, not shrink)

```html
<!-- inline links on wide screens; disclosure menu on small -->
<nav class="flex items-center justify-between">
  <a href="/" class="font-semibold">Brand</a>
  <button class="md:hidden" aria-expanded="false" aria-controls="menu" aria-label="Menu">☰</button>
  <ul id="menu" class="hidden gap-lg md:flex">…links…</ul>
</nav>
```
On small screens the links become a toggled menu — a layout change, not just smaller text.
Wire the button to toggle `hidden` + `aria-expanded` (see `inclusive-design-patterns` for
focus handling).

---

## Sidebar + content (stack → split)

```html
<div class="grid grid-cols-1 gap-lg lg:grid-cols-[16rem_1fr]">
  <aside>…nav…</aside>
  <main>…content…</main>
</div>
```

---

## Wide content that must not break the page

Tables, code blocks, and diagrams scroll inside their own container so the page body never
scrolls horizontally (protects the zoom/reflow requirement):

```html
<div class="overflow-x-auto">
  <table class="min-w-[40rem]">…</table>
</div>
```

---

## Responsive images

```html
<img src="hero-800.jpg"
     srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
     sizes="(min-width: 1024px) 50vw, 100vw"
     alt="…" class="max-w-full h-auto" loading="lazy" width="800" height="450" />
```
`width`/`height` reserve space to prevent layout shift (CLS); `sizes` tells the browser
which source to pick per layout.

---

## Zoom / reflow checklist (WCAG 1.4.10)

- [ ] No horizontal page scroll at 320px width / 400% zoom
- [ ] Font sizes in `rem`, not `px`
- [ ] Wide elements scroll within their own `overflow-x-auto` container
- [ ] Nothing clipped or overlapping at 200% OS text scaling
