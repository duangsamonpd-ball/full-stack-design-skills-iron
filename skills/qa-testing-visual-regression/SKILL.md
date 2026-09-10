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

### Arm the instrument before you believe a reading

**Arm the harness before you believe a single reading from it.** Three things
have to be true, asserted in the page, before a sweep is allowed to report:

1. **A design-system token resolves to a real value.** An unresolved `var()`
   reads back as the browser's default rather than as an error, so an unstyled
   page answers every question confidently and wrongly.
2. **The real typeface is rendering, measured as a DIFFERENTIAL** — the same
   string laid out in the family you expect and in a family that cannot exist,
   required to come out different widths. Not asked of the Font Loading API:
   see "It could not have failed where it was written" below.
3. **The detector sees a planted fault and stops seeing it when removed.** Both
   halves. One row alone cannot tell a working detector from one that fires on
   everything.

**And plant it in the SUBJECT, not on the page.** A gate that measures an
element's height injects 10px of padding into that very element and requires the
height to move by exactly 10, then come back. A page-level arm cannot do this
work. The reason is a fix that appeared not to take: source corrected, every
generator re-run, probe re-run — and each band reported its old number, because
the docs page inlines its own copy of the component's CSS and the probe had been
reading a stale duplicate the whole time. **The tell was not a wrong number; it
was a number that refused to change.** Only an arm aimed at the box about to be
measured can catch that.

The cost of skipping this: a sweep that loaded nothing reports a clean sweep,
and so does one whose stylesheet never compiled. Wrong Tailwind `@source` globs
leave every shared component unstyled while the build stays green — the markup
still carries the classes, the rules simply are not in the file, and every
measurement is of a different page than the one that ships.

**Arm the INPUTS as well as the browser.** The rows above prove the page loaded;
they say nothing about where the files it read came from. A gate whose inputs are
stale answers confidently and wrongly in exactly the way an unstyled page does,
and nothing in the page can tell.

Nine gates across five pages reported green locally. The push went red
immediately, on the asset gate that same commit had just added:

```
✗ gallery — 4 broken (of 22 images, 0 masks)
    /assets/thumbs/iron-suite.webp
```

Those four thumbnails are **gitignored build artefacts**, produced by a script
that only runs from the local publish command. An earlier publish had left them
on disk, so every local run had been reading four files that exist on exactly one
machine. Three commits' worth of "all nine gates green" had been partly green on
stale files — only the newest gate could see it, and only from a checkout that
had never published.

- **Delete what a gate reads and did not itself produce, then run it.** Anything
  gitignored is a candidate: generated images, `dist/`, measured JSON, caches.
- **Green locally and red in CI is not flaky first — it is reading state CI does
  not have.** Reach for that before re-running the job.
- It bites the NEWEST gate in a suite hardest. The older ones were shaped,
  without anyone deciding to, around whatever happened to be on disk while they
  were being written.

**Establish the harness's noise floor before trusting a diff, and do not assume
it is zero.** Capture the SAME build twice and diff it. One homepage reports
~111 element differences unchanged, because two marquees animate — so a later
run showing "112 differences" is not evidence of anything. Pixel diffing has the
same rule and an easier floor: prove the harness reads 0.000% against an
unchanged capture first. The element-geometry case needs saying separately
precisely because its floor is a number nobody would guess.

**When two candidates agree, comparing them is not a test.** Fifteen skill
symlinks were repointed from one clone of a repository to another. The two
clones were `diff -r` identical, so every checksum matched before and after and
proved precisely nothing about which one was live — the comparison could not
have come out any other way. What proved it was a differential: a marker planted
in the new target was visible through the symlink, and a marker planted in the
old one was not. **Change one side and see which answer moves.** The same
instinct as arming, one level up: if an assertion cannot distinguish the two
states you care about, it is decoration.

### A known-findings list must fail in BOTH directions

**A known-findings list is a fault on a list, not a licence — and it must fail
when an entry STOPS firing.** Findings you have seen and not fixed go in a file,
each naming the item that tracks it. The enforcement direction is the whole
point: a known fault that quietly disappears means either the fix landed or the
detector went blind, and only one of those is good news.

That is the floor, not the ceiling. `why` is prose, and prose is checked by
nothing: one entry named the wrong cause AND claimed "at every width" when the
truth was "below 1024 only", firing on exactly the right element the whole time.
So make each entry declare things a run can refuse — **the widths it fires at,
checked in BOTH directions** (silent where it says it fires is a finding; firing
where it does not say is a finding too, and that half is the one an ordinary
allowlist gets wrong), and **what makes it not a fault, in a form the run can
check** — "this escape IS the child's negative margin" is checkable against
`getComputedStyle`; "overlaps by design" is not, and an exemption in those words
has hidden a live bug.

**A narrowed run may not judge that list.** CI ran a layout gate's self-test at
one width to stay fast. None of the known entries lived at that width, so the
"stopped firing" rule failed the build for findings that were exactly where they
had been left. Only a full run — every page, every width — may decide that an
entry has gone silent, because "nobody looked there" and "it is no longer
happening" are different sentences.

### The shapes a skipping gate takes

The failure that costs the most is not a gate that fails — it is a gate that
**skips**, or that answers a narrower question than its output implies, and
prints a confident tick either way. The shapes, each one met in a real run:

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

- **It read the INPUT and reported it as the output.** A script computed a
  panel's arrow offset and wrote it to a CSS custom property; the probe read that
  property back and reported `notch centre 223, trigger centre 223, aligned yes`
  at four widths in a row. The arrow was 380px away the whole time — the
  property's default had been declared *inside the `::before` rule that consumes
  it*, and a pseudo-element's own declaration beats the value it would inherit,
  so the script's write never arrived. The probe was reading the value going in,
  not the pixel coming out. **When a probe reports on something a script
  computes, read the thing that paints** — `getComputedStyle(el, '::before')`, or
  better, scan the render for the mark's own colour and report the run. A human
  found this in a screenshot after the instrument had said "aligned" all
  afternoon.

- **It was assembled from today's output, so it could only re-find today's
  faults.** A check meant to stop docs pages from declaring a class that collides
  with a utility compared page classes against the names already in the compiled
  stylesheet. It found **nothing** — because the collision had just been worked
  around by renaming the component's class, so the name was no longer emitted and
  the fault that had cost a day was invisible. A gate built from the current
  output is a gate against the current output. The durable question was not "is
  this name in the file" but **"would the tool emit this name at all"**, and the
  only thing that can answer it is the tool: compile once with an empty source,
  once with a file wearing every candidate, and take the difference. It has to be
  a differential — the theme layer contributes names of its own, and some of them
  a page is *supposed* to declare.

### Arming the arming — the self-test is an instrument too

**Repeating a measurement is not reproducing it.** Before keying allowlist
entries to a sampled colour, that sweep was run three times and returned
identical values — which showed stability on *one* machine. CI sampled the same
text one shade different, because glyph rectangles rasterise differently per
platform and a different rectangle takes a different slice of a gradient.
Anything **sampled** rather than declared is a property of the machine as much
as of the design: match it with a tolerance, and give the tolerance a refusal
case in the self-test, or it is only a wider hole.

**The self-test is an instrument too, and it needs its own refusal case.** The
discipline of proving a checker can fail gets applied to the checker and then
skipped for the thing that proves it. A self-test written as a closing formality
planted a rule it *believed* would escape, reported `0 findings`, and was
committed as passing — on a tree where the real fault was live. It had borrowed a
scope marker that every element on that page already carried, so there was
nothing for it to find. **A plant that cannot be seen proves nothing.** Give the
self-test two rows, not one: the fault shape must be REPORTED, and the same
check must go SILENT on a control that differs only in the one property that
makes it safe. One row alone is a coin that always lands heads.

**And there is an earlier failure than a plant that cannot be seen: a plant that
was never MADE.** Twice in one day an injection matched nothing and the run
returned a confident `exit=0` — which reads exactly like "this gate cannot
fail". Once because the replacement was written as `&#39;` against an HTML table
whose cells carry real apostrophes; once because it targeted `</style>` in a
component that has no `<style>` block at all. Both gates were fine. Both arming
steps were no-ops.

**Count the replacements, or assert the file changed, before believing the exit
code.** One line — `print('replacements available:', src.count(needle))` — turns
a silent no-op into a stop. An injection is a measurement like any other, and an
unarmed measurement of your arming is exactly the recursion this section is
about.

**When a fix does not move the number, stop fixing.** Six measurement rounds went
into one component across two separate causes: a docs page declaring its own
`.grid`, which outranked the component's utility because an inline `<style>`
beats every linked sheet; and a stale inline copy of that component's CSS left
behind when the component moved folders. Each time the edit was correct, the
measurement was unchanged, and the conclusion was "the fix did not take" — so
another edit followed. **The second identical reading is the signal**: stop
editing and ask what *else* is acting on that element. Walking
`document.styleSheets` and testing `el.matches(rule.selectorText)` found both in
one pass, after reasoning had failed on each.

### What to gate, and what a gate must not depend on

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

**A COUNT is a restatement, and it rots the same way.** In one day: the sentence
"two scripts must know this folder exists" was wrong in five files at once, the
answer having become four; a room's workflow document credited a sibling repo
with sixteen skills when it ships fifteen; and a count carried from a stale
session banner reached a commit message that had already been pushed. None of
them broke anything, and no gate could have failed.

The rule that survives all three is sharper than "do not write numbers":

> **A count is safe when the file stating it can SEE what it counts.**

`19 components` written beside the manifest that lists them is checkable, and a
parser can be pointed at it in an afternoon. The identical sentence written in
another repository is checkable by nobody — that repo cannot see the other's
contents — and that is the one that was wrong. So: count what this repo owns,
and check it; **never write a count of what another repo owns.** Link to it
instead.

**A checkbox is a claim, and the channel that reads it aloud is the one that
must not lie.** A `- [ ]` in a room's TODO said six skills were waiting to be
updated, hours after that work had landed and its issue had been closed. A
`SessionStart` hook reads those boxes out at the beginning of every session, so
the one channel built to be believed was reporting work that did not exist —
which is worse than having no channel, because nobody discounts it.

Reconcile them: **for every still-open box naming an `owner/repo#N`, ask whether
that issue is closed.** Put it in the ADVISORY channel and not in the gate,
because answering needs the network and a gate that reaches the network is a
coin toss — the same reason the webfont had to be vendored above. An advisory
line that is missing costs a line; a red build costs the morning. Make every
path fail open: no CLI, no section; no answer, no line.

**Build the checker before the fix.** Facing an unknown number of defects, write
the checker first, let it produce the list, then fix until green — going green
is proof the fix is complete, whereas fixing from a hand-made list only proves
the list was followed. Doing it in that order turned seven found by eye into
sixteen real ones.

## Simulate CI locally instead of pushing and watching it go red

Two directories laid out the way the runner lays them out, `npm ci` in each, then
run the gate. It is cheaper than a push-and-wait cycle and it catches the class
of fault that only exists on a clean checkout — the ones a developer's machine
hides because the sibling repo is a working copy with its dependencies already
installed.

It caught two blocking faults before the first push. It did NOT catch a third,
and the reason is worth saying out loud: **run the individual steps the workflow
runs, not the composite command you use locally.** The workflow's self-test step
narrowed the sweep in a way the composite never did, and the difference is
exactly where the fault lived.

## Next steps

- Pair with **web-accessibility-a11y** as a CI gate (role/label queries already help)
- Snapshot the library built via **component-library-mastery**
- Wire these gates into **deployment-devops-workflow**
