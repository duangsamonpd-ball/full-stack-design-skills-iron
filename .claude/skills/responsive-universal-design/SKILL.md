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

Add breakpoints where the *content* breaks, not at device sizes — the goal is layouts that look intentional at every width, not just on named devices.

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

## Next steps

- Verify visual fidelity per breakpoint with **css-styling-pixel-perfect**
- Cover user contexts/preferences (motion, i18n, cognition) in **inclusive-design-patterns**
- Confirm reflow/zoom compliance in **web-accessibility-a11y**
