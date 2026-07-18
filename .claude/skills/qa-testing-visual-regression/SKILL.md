---
name: qa-testing-visual-regression
description: Set up frontend QA — unit/component tests, end-to-end flows, and visual-regression snapshots to catch UI drift — for React, Astro, and Vue. Use when the user says "visual regression", "component testing", "e2e tests", "snapshot testing", "chromatic", "playwright", or "test coverage".
---

# QA Testing & Visual Regression

Build a testing safety net for UI: behavior tests prove it *works*, visual snapshots prove it still *looks right*. Together they let you refactor and restyle without fear.

## When to use this skill

- Setting up component/unit/e2e testing for a frontend
- Adding visual-regression coverage to a design system
- Catching UI drift automatically in CI

## The frontend test pyramid

Most tests cheap and fast at the bottom; few expensive ones at the top. Visual regression is a cross-cutting layer that catches what assertions can't.

```
        ▲  e2e (few)        — real user flows across pages (Playwright/Cypress)
       ───
      ▲▲▲ integration       — several components working together
     ───────
    ▲▲▲▲▲ unit/component     — logic + a component's states (Testing Library)
   ─────────
   ◆ visual regression ◆    — pixel snapshots across all of the above
```

## What each layer is for

| Layer | Answers | Tool | Speed |
|-------|---------|------|-------|
| Unit / component | "Does this component behave and render its states?" | Vitest/Jest + Testing Library | ⚡ fast |
| Integration | "Do these pieces work together?" | Testing Library (multiple components) | fast |
| E2E | "Can a user complete the flow?" | Playwright / Cypress | 🐢 slow |
| Visual regression | "Did the pixels change unintentionally?" | Chromatic / Playwright screenshots / Percy | medium |

## Core principle: test behavior, not implementation

Query by what a **user perceives** — accessible role, label, visible text — not by CSS
classes or internal state. Tests that assert on `.btn-primary` break on every refactor;
tests that assert on `getByRole('button', { name: 'Save' })` survive them. This also means
your tests double as a light accessibility check (missing roles/names fail loudly).

Setup snippets for all three layers are in `references/testing-setup.md`.

## Visual regression — the part unit tests can't do

Assertions verify logic and content; they say nothing about spacing, color, font, or
layout. Visual regression fills that gap:

1. **Baselines** — capture a reference screenshot per component/story, across **themes
   (light/dark)** and **key breakpoints**.
2. **Diff on every PR** — re-shoot and pixel-diff against the baseline; changes surface as
   an image diff for review.
3. **Review, don't auto-accept** — an intended restyle *should* change pixels; a human
   approves the new baseline. An unintended change fails the build.

What it catches that nothing else does: spacing/color/font drift, broken layouts at a
breakpoint, theme regressions, and CSS changes with unexpected blast radius.

## Workflow

1. **Component tests** for logic and every state (variants, disabled, loading, error, empty).
2. **E2E** for the handful of critical flows (auth, checkout, primary form submit).
3. **Visual baselines** per component/story × themes × key breakpoints.
4. **CI gate** — unit + e2e + visual diffs block merge; intended visual changes are reviewed and re-baselined explicitly.

## What to test where (avoid over-testing)

- **Component test** — states, prop variations, user interactions, accessibility names.
- **Visual test** — appearance across variants/themes/breakpoints (don't assert pixel values in unit tests).
- **E2E** — only true end-to-end journeys; don't re-test unit-level logic through the browser (slow and flaky).

## CI gate (definition of done)

```
□ Component tests for logic + all states
□ E2E for each critical user flow
□ Visual baselines: per story × light/dark × key breakpoints
□ All three run in CI and block merge on regression
□ Intended visual changes reviewed + re-baselined by a human
□ Tests query by role/label/text, not CSS classes
```

## Next steps

- Pair with **web-accessibility-a11y** as a CI gate (role/label queries already help)
- Snapshot the library built via **component-library-mastery**
- Wire these gates into **deployment-devops-workflow**
