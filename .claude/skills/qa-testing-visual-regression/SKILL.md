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

## A green checker is not the same as a checked thing

The failure that costs the most is not a gate that fails — it is a gate that
**skips**, or that answers a narrower question than its output implies, and
prints a confident tick either way. Four shapes, all met in one real day:

- **It skipped its subject.** A generator decided "is this component converted?"
  with "does any line start with `<style`". A wrapped sentence in a closing
  comment read as markup, so that component was skipped entirely and its
  generated region went unwritten and unchecked, while the run reported
  `✔ 10 converted components`. **Nobody notices a count that is one too low** —
  so make the skip loud: if something is skipped but still carries the marker
  that says it should have been processed, that is an error, not silence.
- **It parsed nothing.** A checker that reads hand-written HTML fails by
  matching zero elements, which is indistinguishable from a clean page. Give
  every parser a **floor** and fail below it, and add a `--self-test` that
  plants one error per parser and requires every one to react.
- **It answered a neighbouring question.** An overflow sweep went green on a fix
  that still rendered a broken label — "nothing left its box" was true and
  irrelevant. Ask what the user would *see*, then look at it.
- **The pipe ate the verdict.** `node check.mjs | tail -5` then `echo $?`
  reports **tail's** exit code. It printed `exit=0` directly under its own
  `✖ 1 out of date`. Redirect to a file, echo `$?`, then read the file.
- **It could not have failed where it was written.** A layout sweep armed itself
  with `document.fonts.check('700 16px Montserrat')`. On the author's machine
  Montserrat is installed, so that is true for every page whatever it renders —
  unfalsifiable there, while underneath it ten of nineteen components were being
  measured in the browser's default serif, ~21% narrower than the real font, in
  the direction that hides overflow. The first run on a machine without the font
  said so immediately.

  This is the hardest shape to see, because everything is green and the check is
  *about* something the machine happens to have — a font, a locale, a timezone,
  a certificate, a binary on `$PATH`. Two defences. **Assert on the plumbing as
  well as the result:** a row checking the stylesheet link was actually injected
  fails anywhere, beside a row checking the font renders, which can only fail
  where the font is absent. And **run it somewhere else early** — a foreign
  machine is an instrument too, and it sees what yours is built not to.

**Repeating a measurement is not reproducing it.** Before keying allowlist
entries to a sampled colour, that sweep was run three times and returned
identical values — which showed stability on *one* machine. CI sampled the same
text one shade different, because glyph rectangles rasterise differently per
platform and a different rectangle takes a different slice of a gradient.
Anything **sampled** rather than declared is a property of the machine as much
as of the design: match it with a tolerance, and give the tolerance a refusal
case in the self-test, or it is only a wider hole.

**A harness that reaches the network is a coin toss, not a gate.** Three browser
harnesses fetched their webfont from a CDN mid-run; the morning the first became
a gate, that CDN failed four times, on a different page each time, every failure
a red build saying nothing about the code. Vendor the asset and serve it
locally — then *enforce* it: abort every request leaving the local origin and
fail on any that tries, or "it no longer needs the network" is a sentence in a
commit message that nothing checks.

**Gate whatever restates a fact.** Docs that write out token values by hand are
a second source of truth: two reference pages held ~150 colour values, nothing
compared them to the tokens, and sixteen were wrong — including two rows for a
token deleted in an earlier refactor. Either generate the page from the source,
or check it; the choice is whether the presentation is hand-tuned enough to be
worth keeping.

**Build the checker before the fix.** Facing an unknown number of defects, write
the checker first, let it produce the list, then fix until green — going green
is proof the fix is complete, whereas fixing from a hand-made list only proves
the list was followed. Doing it in that order turned seven found by eye into
sixteen real ones.

## Next steps

- Pair with **web-accessibility-a11y** as a CI gate (role/label queries already help)
- Snapshot the library built via **component-library-mastery**
- Wire these gates into **deployment-devops-workflow**
