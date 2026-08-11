---
name: responsive-universal-design
description: Design layouts that work across all viewports and devices with fluid grids, container queries, adaptive typography, and mobile-first breakpoints. Use when the user says "make it responsive", "mobile layout", "breakpoints", "container queries", "fluid typography", or "works on all screens".
---

# Responsive & Universal Design

Build layouts that hold up from a small phone to a wide desktop — adapting to the *container* as well as the viewport, and to the user's zoom and text-size settings.

## When to use this skill

- Making a layout responsive across devices
- Choosing breakpoints and a fluid vs. fixed strategy
- Component-level responsiveness with container queries

## Principles

1. **Mobile-first** — style the smallest case as the base, layer complexity upward with `min-width` breakpoints. Adding is easier to reason about than overriding down.
2. **Fluid over fixed** — prefer `%`, `fr`, `minmax()`, and `clamp()` over magic pixel widths. Let layouts breathe between breakpoints instead of jumping.
3. **Container queries for components** — a card should respond to *its container*, not the viewport, so the same component works in a sidebar, a grid, or full-width.
4. **Adaptive typography** — `clamp()` for fluid type; keep body line length ~45–75ch.
5. **Reflow, don't shrink** — change the layout at breakpoints (stack → grid), don't just scale everything down until it's unreadable.
6. **Respect the user** — layouts must survive 200% browser zoom and OS text scaling without clipping or horizontal scroll (a WCAG 1.4.10 Reflow requirement).
7. **Query the input, not the screen size** — width has never told you how someone is pointing at the page. A touchscreen laptop is desktop-width and finger-driven; a phone paired with a mouse is the reverse. Size hit targets off `pointer-coarse` (`@media (pointer: coarse)`), not off a breakpoint.

## Breakpoints (Tailwind defaults)

```
sm 640  ·  md 768  ·  lg 1024  ·  xl 1280  ·  2xl 1536
```

Add breakpoints where the *content* breaks, not at device sizes — the goal is layouts that look intentional at every width, not just on named devices. "Where it breaks" is a number you can measure. A design file showing frames at 1440/768/375 tells you what each layout looks like, not which widths to switch at.

**Measure where the content stops FITTING, not where it starts overflowing — they are different numbers.** Shrinking until something leaves its box finds the width where the layout becomes *broken*, and switching there leaves a band above it where the layout is merely *bad*: nothing overflows, and a label is stacked three lines deep with its icon stranded beside it. A real case — a file-upload row spilled 8.7px at 320, a breakpoint at 329.98 silenced every overflow check across nineteen components, and a screenshot at 360 showed the fix had not worked. Re-measured for the width where the title and its link each sit on ONE line, the answer was 438.

So sweep for the layout you intend, not for the absence of a symptom:

```
for w in 300…600 step 4:
    render at w
    ok = title.height <= oneLine && link.height <= oneLine && nothing overflows
```

The first `w` where `ok` holds is the breakpoint, minus `.02`. **An overflow checker answers a narrower question than its green output suggests** — pair it with a screenshot at a width just above the one you picked, and look at it.

**A custom property cannot be a media query condition.** In a project with a `--breakpoint-*` scale this is the first thing you will reach for, and it fails silently:

```css
@media (max-width: var(--breakpoint-lg)) { … }   /* never matches — no error, no styles */
@media (max-width: 1023.98px)            { … }   /* write the number, cite the token in a comment */
```

Media features are resolved before the cascade, so there is no variable to substitute yet. The token is still reachable through a framework *variant* — Tailwind's `--breakpoint-lg` in `@theme` is what generates `lg:`, which compiles to a real media query — so `lg:` works and `var()` does not. Hand-authored `@media` in a component `<style>` gets the literal.

Pick `.98` (or `min-width` and mobile-first) deliberately: `max-width: 768px` and `min-width: 768px` both match at exactly 768.

## Core recipes

```html
<!-- Reflow grid: stack on mobile, columns as space allows -->
<div class="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">…</div>

<!-- Fluid type: never smaller than 1.5rem, never larger than 3rem -->
<h1 class="text-[clamp(1.5rem,4vw,3rem)] leading-tight">…</h1>

<!-- Auto-fit grid: as many columns as fit, no breakpoints needed -->
<div class="grid gap-md [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]">…</div>

<!-- Comfortable target for fingers, compact for a mouse — decided by input, not width -->
<button class="p-2 pointer-coarse:p-4">…</button>

<!-- Centred, but degrades to start instead of overflowing when space runs out -->
<div class="flex justify-center-safe items-center-safe">…</div>
```

`pointer-*` reflects the *primary* input; `any-pointer-*` asks whether an input of that kind
exists at all. Grow targets on `pointer-coarse`; only hide something outright on
`any-pointer-none`.

**The auto-fit floor and the gap spend the same pixels.** A track count is
`n × floor + (n−1) × gap ≤ width`, so the two numbers are one decision, and raising
the floor "to be safe" can silently cost a column:

| width | floor | gap | fits |
|---|---|---|---|
| 720 | 150 | 32 | **4** (696) |
| 720 | 160 | 32 | **3** — 4 needs 736 |
| 720 | 160 | 16 | **4** (688) |
| 343 | 150 | 32 | **2** (332) |
| 343 | 160 | 32 | **1** — 2 needs 352 |
| 343 | 160 | 16 | **2** (336) |

Set the floor from the widest thing that must fit — measure it, don't estimate — then
spend what is left on the gap. This matters most when the items are `nowrap`: a track
narrower than its own text overflows instead of wrapping, and inside an
`overflow: hidden` parent it is *clipped rather than scrolled*, so a page-level
"no horizontal scroll" check reports clean. Assert per item
(`scrollWidth > clientWidth`, or a `Range` around the text), not per document.

Container-query and more patterns (nav, sidebar, responsive tables) are in
`references/responsive-recipes.md`.

## Test matrix

Small phone (360px) · large phone · tablet portrait/landscape · laptop · wide desktop —
**plus** 200% browser zoom and OS text-scaling. The body must never scroll horizontally.

Widths alone won't catch input bugs: check one **touch-capable wide screen** too, where
`pointer-coarse` applies at a desktop breakpoint. Centred flex/grid rows are worth a second
look at 200% zoom — plain `justify-center` overflows in *both* directions, so the start of
the content becomes unreachable.

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Fixed pixel widths | Use `%`/`fr`/`clamp()`/`minmax()` |
| Breakpoints at device sizes | Break where the content breaks |
| Component keyed to viewport | Use container queries so it works anywhere |
| Font size in `px` | Use `rem` so OS text scaling works |
| Horizontal scroll at zoom | Reflow content; wide items scroll inside their own container |
| Desktop-first with overrides | Mobile-first base, add upward |
| Touch targets sized by breakpoint | `pointer-coarse:` — a touchscreen laptop is not a phone width |
| Centred content clipped when it overflows | `justify-center-safe` / `items-center-safe` — falls back to start instead of cutting off both ends |
| `var(--breakpoint-*)` inside `@media` | Literal number in the condition; reach the token through the framework variant (`lg:`) instead |
| `auto-fit` floor raised "to be safe" | Recount `n × floor + (n−1) × gap`; buy the headroom out of the gap, not the column count |
| Overflow checked per document | `overflow: hidden` clips instead of scrolling — assert per item, not on `document.scrollWidth` |
| Layout only proven at the design's frame widths | Also test between them, and one width below the smallest frame |

## Next steps

- Verify visual fidelity per breakpoint with **css-styling-pixel-perfect**
- Cover user contexts/preferences (motion, i18n, cognition) in **inclusive-design-patterns**
- Confirm reflow/zoom compliance in **web-accessibility-a11y**
