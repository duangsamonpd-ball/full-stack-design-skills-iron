---
name: web-accessibility-a11y
description: Audit a component or page for WCAG 2.1 AA accessibility compliance with findings and concrete fixes. Use when the user says "audit accessibility", "check wcag compliance", "is this accessible", "a11y testing", or "accessibility audit".
---

# Web Accessibility Audit

Audit a component or page against **WCAG 2.1 AA** and return prioritized findings, each with a concrete code fix. Works for React, Astro, and Vue output.

## When to use this skill

- Auditing a component or page for accessibility
- Verifying WCAG 2.1 AA compliance before shipping
- Getting specific, code-level fixes for a11y issues

## Workflow

### 1. Scope
Confirm what's being audited (single component vs. full page/flow), the target level (default WCAG 2.1 AA), and whether automated tooling is available in the repo.

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
- Body text ≥ **4.5:1**, large text (≥24px or 19px bold) ≥ **3:1**
- UI components & focus indicators ≥ **3:1**
- Information never conveyed by color alone (add icon/text/pattern)

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

## WCAG 2.1 AA quick checklist

```
Perceivable   — contrast ≥ 4.5:1, alt text, no color-only meaning, captions
Operable      — full keyboard access, visible focus, no traps, skip link
Understandable— labels, lang attribute, predictable & consistent, clear errors
Robust        — valid HTML, correct ARIA roles/states, works with assistive tech
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

## Tools & resources

- axe DevTools · WAVE · Lighthouse · VoiceOver (macOS) / NVDA (Windows)
- WebAIM contrast checker · WCAG 2.1 Quick Reference

## Next steps to recommend

- Feed fixes back through **design-to-code-workflow** for the corrected components
- Bake a11y requirements into **component-library-mastery** so new components ship compliant
