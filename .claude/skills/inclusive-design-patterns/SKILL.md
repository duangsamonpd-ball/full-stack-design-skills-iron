---
name: inclusive-design-patterns
description: Design for the full range of users — motion sensitivity, cognitive load, internationalization, user preferences (reduced motion/data, dark mode, text scaling), and diverse inputs — beyond baseline WCAG. Use when the user says "inclusive design", "reduced motion", "internationalization", "cognitive accessibility", "rtl support", or "design for everyone".
---

# Inclusive Design Patterns

Design that works well for the widest range of people, contexts, and devices — the intent that WCAG conformance alone doesn't guarantee. `web-accessibility-a11y` checks pass/fail; this skill covers designing so people actually succeed.

## When to use this skill

- Designing for motion sensitivity, cognitive load, or low literacy
- Internationalization / RTL / long-string resilience
- Respecting user preferences (reduced motion/data, dark mode, larger text)
- Supporting diverse inputs (touch, keyboard, switch, voice)

## The five dimensions

### 1. Respect system preferences
Honor what the user has already told their OS/browser. Code snippets in
`references/inclusive-patterns.md`.
- `prefers-reduced-motion` — replace/parallax animations with instant or opacity-only.
- `prefers-color-scheme` — support dark mode as a first-class theme.
- `prefers-reduced-data` — avoid autoplay/large media on constrained connections.
- OS text scaling — size in `rem`; never lock font size.

### 2. Cognitive load
- Plain language; short sentences; front-load the point.
- **One primary action per screen**; secondary actions visually demoted.
- Progressive disclosure — reveal complexity only when needed.
- Forgiving forms — clear inline errors, no data loss on error, no time pressure.

### 3. Internationalization (i18n)
- Never hardcode strings or concatenate sentence fragments — use a message catalog with
  placeholders and plural rules.
- Design for **text expansion** (+30–40% vs. English); don't fix widths to English length.
- Support **RTL** — use logical CSS properties (`margin-inline-start`, not `margin-left`)
  and `dir="rtl"`.
- No text baked into images; format dates/numbers/currency per locale.

### 4. Input & interaction diversity
- Touch targets ≥ 44×44px; adequate spacing between them.
- Everything works by keyboard **and** pointer **and** (ideally) voice; no hover-only affordances.
- Don't rely on a single sense — pair color with text/icon, sound with a visual cue.

### 5. Robust to context
- Readable in bright sunlight (real contrast) and at a glance.
- Usable on slow/flaky networks (skeletons, graceful degradation, offline-tolerant where possible).
- Degrades gracefully when JS fails or is slow.

## Workflow

1. **Preferences** — wire `prefers-reduced-motion` / `prefers-color-scheme`; confirm `rem` sizing.
2. **Cognitive pass** — is there one clear primary action? Is the language plain? Are forms forgiving?
3. **i18n audit** — externalized strings, expansion room, logical properties for RTL.
4. **Input audit** — target sizes, keyboard + pointer parity, no hover-only, no sense-dependency.
5. **Context checks** — contrast in bright light, behavior on slow network / JS failure.

## Relationship to accessibility

- `web-accessibility-a11y` = does it **conform** to WCAG 2.1 AA? (measurable pass/fail)
- `inclusive-design-patterns` = is it actually **usable** for the full range of people and contexts? (design intent)

Use both — conformance is the floor, not the goal.

## Next steps

- Verify conformance with **web-accessibility-a11y**
- Handle viewport/device range and zoom/reflow in **responsive-universal-design**
- Bake reduced-motion/theme tokens into **design-tokens-system**
