---
name: web-accessibility-a11y
description: Audit a component or page for WCAG 2.2 AA accessibility compliance with findings and concrete fixes. Use when the user says "audit accessibility", "check wcag compliance", "is this accessible", "a11y testing", "wcag 2.2", or "accessibility audit".
---

# Web Accessibility Audit

Audit a component or page against **WCAG 2.2 AA** and return prioritized findings, each with a concrete code fix. Works for React, Astro, and Vue output.

## When to use this skill

- Auditing a component or page for accessibility
- Verifying WCAG 2.2 AA compliance before shipping
- Getting specific, code-level fixes for a11y issues

## Workflow

### 1. Scope
Confirm what's being audited (single component vs. full page/flow), the target level (default WCAG 2.2 AA), and whether automated tooling is available in the repo.

### 2. Automated pass
Catch the obvious issues first with tooling, then do the manual work machines can't:
- **axe-core** / `@axe-core/react` — runtime violations
- **WAVE** browser extension — visual overlay
- **Lighthouse** — accessibility score + hints

Automated tools catch ~30–40% of issues. The steps below cover the rest.

### 3. Semantic HTML audit
Structure carries meaning to assistive tech:
- Real elements: `<button>` for actions, `<a href>` for navigation — never a clickable `<div>`
- One `<h1>`; heading levels don't skip (`h2 → h3`, not `h2 → h4`)
- Landmarks: `<header> <nav> <main> <footer>`
- Lists as `<ul>/<ol>`, tabular data as `<table>` with `<th scope>`

```html
<!-- ❌ -->
<div class="btn" onclick="save()">Save</div>
<!-- ✅ -->
<button type="button" onclick="save()">Save</button>
```

### 4. Keyboard navigation
Unplug the mouse and tab through:
- Every interactive element is reachable and operable by keyboard
- Focus order follows visual/reading order
- Focus is **always visible** (never `outline: none` without a replacement)
- No keyboard traps; modals trap focus *intentionally* and restore it on close
- `Esc` closes overlays; `Enter`/`Space` activate controls

### 5. Color & contrast
- Body text ≥ **4.5:1**, large text (≥24px, or ≥18.66px bold) ≥ **3:1**
- UI components & focus indicators ≥ **3:1**
- Information never conveyed by color alone (add icon/text/pattern)

Bold does **not** lower the bar until 18.66px — a 12px/700 badge label is ordinary text and
owes the full 4.5:1. This is the threshold people get wrong most often.

#### Make contrast a computed gate, not a review item

A manual check passes once and proves nothing about tomorrow. Any component that paints text
onto a token-driven fill has a finite, enumerable set of pairs — so compute the real ratios in
CI. In one design system, three solid badges sat below AA while every other gate stayed green:
the parity check only asked whether the docs matched the CSS, and the drift check only asked
whether the token layers agreed with each other. Neither has an opinion about readability.

```js
const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
```

The arithmetic is the easy part. Four things decide whether the gate stays honest:

- **Derive the pairs from the component itself**, then resolve each `var()` chain through the
  token layer. Parse the component's own style block for the background/color it declares per
  variant — a hand-copied list of pairs stops moving the moment the component does.
- **Resolve once per theme.** Run each chain against `:root`, then again against the `.dark`
  overrides merged on top. A pair that clears AA in light mode routinely fails in dark.
- **Assert the count.** If the component changes shape and the script derives 8 pairs where 12
  were expected, it reports green on a subset — worse than no gate. Fail on the mismatch and
  say the script needs updating.
- **Make exceptions expire.** For a pair that is a deliberate design decision, allow a warn-only
  entry — but report an entry that *starts passing* as an error. Otherwise the allowlist quietly
  becomes the place failures go to be forgotten.

#### The composed colour is not always the painted one

Everything above composes a pair out of `background-color` values. That is exact until something
is painted **over** them, and then it is fiction. A `background-image` — a photo, a gradient, an
SVG band — paints *above* `background-color`, so an opaque colour underneath tells you nothing
about what the reader sees. One harness excused this case explicitly ("an image over an opaque
colour uses the colour"), which held for a faint canvas grid and failed completely for a
full-bleed illustration: every ratio it reported for that section was measured against a colour
nobody could see. Three runs came back 2.36, 3.91 and 4.06 where it had claimed 2.84, 4.11 and
2.84 — two worse, one better, none right.

When an image is anywhere on the ancestor chain, stop composing and **measure what was
painted**: hide the glyphs, screenshot the rectangle they occupied, and read the pixels back.
Three details decide whether that number is worth anything:

- **Sample the glyph rectangles, not the element's box.** `Range.getClientRects()` over the
  element's own text nodes is the only region a glyph can occupy. A box also contains whatever
  else sits in it — a `justify-end` paragraph holding both a caption and a white logo reported
  1.00:1 white-on-white for text that was plainly legible on dark beside it.
- **Judge on the worst colour covering a real share of the area**, not the single worst pixel;
  photos have antialiased edges no glyph sits on. Report the absolute worst alongside it.
- **Report how much of the run fails.** "26% of the glyph area is below the bar" is a different
  problem from "100% is", and points at a different fix — the first is text crossing a bright
  patch, the second is the wrong colour.

#### Check the colour's ceiling before hunting for a fix

Before redesigning anything, ask what the foreground can do *at best*. A colour's maximum
possible contrast is its ratio against black or against white, and both fall straight out of its
luminance — `(L + 0.05) / 0.05` against black, `1.05 / (L + 0.05)` against white.

This turns an open-ended design argument into a one-line answer. A brand pink at `#E01A59` has
luminance 0.173, so it reaches **4.46:1 against pure black** — under the 4.5 bar. No scrim, no
darker backdrop, no treatment of the image behind it can make that colour pass as body text on
*any* dark surface; it only clears 4.5 on white, at 4.71. Knowing that before proposing fixes
saves measuring a scrim at every opacity to discover it never arrives, and it reframes the
decision honestly: the choice is to change the colour, change the size to reach the large-text
bar, or record the exemption — not to keep hunting for a backdrop that does not exist.

### 6. Screen reader check
Verify name, role, and state are announced:
- Every input has a programmatic label (`<label for>`, `aria-label`, or `aria-labelledby`)
- Icon-only buttons have an accessible name
- Images: meaningful `alt`, or `alt=""` if decorative
- Dynamic updates use `aria-live` regions
- Custom widgets carry correct `role` + `aria-*` state (`aria-expanded`, `aria-selected`, …)

Keyboard + ARIA patterns for common widgets (dialog, tabs, menu, combobox, disclosure, tooltip, live regions) are in `references/aria-patterns.md`.

```html
<!-- ❌ icon-only button, no name -->
<button><svg>…</svg></button>
<!-- ✅ -->
<button aria-label="Close dialog"><svg aria-hidden="true">…</svg></button>
```

### 7. Report
Deliver findings ranked by severity. For each:

> **[Critical] Form input missing label** — WCAG 1.3.1 / 4.1.2
> The email field has no programmatic label, so screen readers announce only "edit text".
> **Fix:**
> ```html
> <label for="email">Email</label>
> <input id="email" type="email" name="email" />
> ```

Severity order: **Critical** (blocks a user) → **Serious** → **Moderate** → **Minor**.

### 8. Remediate & verify
Apply fixes, then re-run the automated pass **and** re-test keyboard + screen reader on the changed elements. Don't mark resolved on the automated score alone.

## New in WCAG 2.2 (also check)

WCAG 2.2 (W3C Recommendation, Oct 2023) is the current bar: 2.2 AA = all of 2.1 AA **plus** the below. (2.2 also *removed* 4.1.1 Parsing — malformed markup is no longer its own failure.)

- **3.3.8 Accessible Authentication (AA)** — no step that forces memorizing or transcribing (image puzzles, un-pasteable codes). Let password managers work (`autocomplete="new-password"` / `"current-password"`) and **never block paste** on password or one-time-code fields.
- **3.3.7 Redundant Entry (A)** — don't re-ask information already given in the same process; auto-fill it or offer "same as…".
- **2.5.8 Target Size Minimum (AA)** — pointer targets ≥ **24×24 CSS px**, or spaced so a 24px circle doesn't overlap a neighbor. (44×44 stays the stronger AAA / touch target — see `inclusive-design-patterns`.)
- **2.4.11 Focus Not Obscured (AA)** — the focused element isn't fully hidden behind a sticky header/footer or overlay.
- **2.5.7 Dragging Movements (AA)** — every drag has a single-pointer alternative (a reorder list also offers up/down buttons).
- **3.2.6 Consistent Help (A)** — help / contact links stay in the same relative place across pages.
- **2.4.13 Focus Appearance (AAA — worth adopting)** — focus indicator big and contrasty enough to find at a glance.

## WCAG 2.2 AA quick checklist

```
Perceivable   — contrast ≥ 4.5:1, alt text, no color-only meaning, captions
Operable      — full keyboard, visible + unobscured focus, no traps, skip link,
                targets ≥ 24×24, drag has a click alternative
Understandable— labels, lang attribute, predictable, clear errors, no redundant entry,
                accessible auth (paste allowed, password managers work), consistent help
Robust        — correct ARIA roles/states, works with assistive tech
```

## Common issues & fixes

| Issue | Fix |
|-------|-----|
| `<div onclick>` | Use `<button>` |
| `outline: none` | Provide a visible `:focus-visible` style |
| Placeholder used as label | Add a real `<label>` |
| Low-contrast gray text | Meet 4.5:1 against its background |
| Icon-only control | Add `aria-label`; `aria-hidden` on the icon |
| Modal doesn't trap focus | Trap focus, close on `Esc`, restore focus on close |
| Paste blocked on password field | Remove the block; `autocomplete="new-password"` (WCAG 2.2 · 3.3.8) |
| Tap target under 24px | Grow to ≥ 24×24 CSS px or add spacing (WCAG 2.2 · 2.5.8); grow on `pointer-coarse:`, not at a breakpoint |
| Error styling on an untouched form | `user-invalid:` not `invalid:` — `:invalid` fires on load and reds-out a blank required field |

## Tools & resources

- **Automated** — axe DevTools · WAVE · Lighthouse · WebAIM contrast checker · WCAG 2.2 Quick Reference
- **Screen readers** — VoiceOver (macOS/iOS) · NVDA + JAWS (Windows) · TalkBack (Android); test at least one per platform you ship
- **Other AT** — keyboard-only · switch access · voice control (macOS/iOS Voice Control, Dragon) · 200% zoom · `forced-colors` / Windows High Contrast

### Manual test matrix (what tools miss)

```
Keyboard-only   — reach + operate everything; focus visible and never obscured
Screen reader   — name / role / state announced; headings + landmarks navigable
Zoom / reflow   — 200% zoom (+400% reflow, 1.4.10) with no horizontal scroll or clipping
Forced colors   — Windows High Contrast: meaning survives; focus + borders stay visible
Voice / switch  — every control has a real accessible name so it can be targeted
```

## Next steps to recommend

- Feed fixes back through **design-to-code-workflow** for the corrected components
- Bake a11y requirements into **component-library-mastery** so new components ship compliant
