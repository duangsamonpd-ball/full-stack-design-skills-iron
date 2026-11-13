---
name: fresh-eyes-critique
description: Adversarial design critique from a fresh context that never saw the work being made — render it, use it, and argue for sending it back, ending in a reject / rework / ship verdict. Use when a UI is close to done and its gates are green, when the user asks for a second opinion, an independent review, or "fresh eyes", or says "critique this before it ships". For diagnosing and improving a design while working on it, use design-fundamentals instead.
context: fork
background: false
---

# Fresh-eyes critique

You are running in a forked context. The conversation that produced this work is
not visible to you, and that is the point: a critic who has read the maker's
reasoning reviews the argument instead of the artifact, and agrees too easily.
You cannot ask the user anything. Everything you need is on disk.

Idea adapted from the `critique` skill and `design-critic` agent in
[plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills)
(MIT, read at `f823ace`). The lenses below are this repository's own.

## 1. Resolve the target

Target: `$ARGUMENTS` — a file, a directory, or a URL. If it is empty or names
nothing that exists, say exactly what you were given and stop. A critique of a
guessed target reads like a verdict on the real work, which is worse than none.

## 2. Look before you speak

A critique written from source alone is worthless; if you cannot render, say so
and stop. Use any browser you can drive (`playwright-cli`, Playwright, the
built-in browser). `playwright-cli` refuses `file:` URLs outright, so serve a
local file first (`python3 -m http.server 8765 --bind 127.0.0.1 --directory <its folder>`) and stop the
server when you are done.

Write screenshots and scripts to a temporary directory, never into the
repository being critiqued: the critique must leave the work exactly as it
found it.

- **Screenshot at 360, and on both sides of every breakpoint the page actually
  uses, light and dark**, pointer parked off the UI. 360 is the small phone in
  **responsive-universal-design**'s test matrix, where things crowd first. Read
  the breakpoints from the page's own CSS: just below one is the old layout at
  its most stretched, just above it the new one at its most squeezed, and those
  are where a layout looks worst. No fixed desktop width — a breakpoint is put
  where the content breaks, so that is where to look.
- **Do not judge fit from those screenshots.** A few widths are a sample, and a
  sample is how a page audited repeatedly at seven hand-picked widths kept a
  sideways scroll across **901–909px**. Overflow is decided by the 8px sweep in
  **responsive-universal-design**; run it or report that you did not.
- **Use it: click every control, submit every form, and write down what
  changed.** A control that changes nothing is a finding, whatever the
  accessibility gate said about it. Measured 2026-11-13 on this repository's
  `registration-form-m3.html`: a correctly filled form threw on submit and never
  reached its success view — a missing `#password-err` — while every gate
  passed and all four screenshots looked finished. Only submitting it showed it.
- **Stress it**: the longest real string, an empty list, one item, forty, a
  nine-digit number, a missing image. Push each into every state it can reach,
  not only the first one: on that same page a 93-character email widened the
  360px success view to **757px**, a state no screenshot of the form shows.

## 3. Judge with the lenses this repository already has

Read them; do not re-derive them. Both are siblings of this skill, at
`${CLAUDE_SKILL_DIR}/../<skill>/references/<file>`:

- **design-fundamentals** → `references/principles-deep-dive.md` — hierarchy,
  grid, colour, type, spacing, balance
- **anti-ai-design-patterns** → `references/review-checklist.md` — every "no" is
  a finding

Every finding names its evidence: a file and line, a measured number, or a
specific thing in a specific screenshot. "Feels generic" is not a finding.
"The card's 12px inner gap equals the 12px gap between cards, so the group
reads as one block" is.

A green gate is never evidence of taste. Contrast passing says the text is
readable, not that the page has a focal point.

## 4. The verdict

```
VERDICT: reject | rework | ship

Up to three reasons a senior designer would send this back
1. …   (fewer is fine; none is fine — never fill the slots)

| # | Severity | Finding | Evidence | Fix |

What is actually good (at most two)
What I could not judge (and why — not rendered, no data, no dark theme…)
```

**Critical** blocks the ship · **Major** this sprint · **Minor** when convenient
· **Enhancement** backlog. If everything is Minor, say so and let it ship — a
critic that manufactures Criticals to look rigorous is as useless as one that
praises everything. Do not pad the "good" list to soften the tone.

This is judgement, not measurement. Say so in the output.

## After it comes back

For the session that invoked this, not the fork: fix every Critical and Major,
re-run the gates, and critique again what changed. The loop ends when what is
left is Minor or Enhancement.

**A finding is evidence; the cause it names is a hypothesis.** Confirm the
cause before fixing it, and judge the fix by re-running the observation that
showed the bug, not by reading the diff. Measured 2026-11-13: the fork traced
a spinner visible at rest to this repo's unlayered `.material-symbols-outlined`
beating the `hidden` utility. Moving that rule into a layer changed nothing:
Google's Material Symbols stylesheet ships the same unlayered
`display:inline-block`, and a cross-origin sheet cannot be read from the page,
so a walk of `document.styleSheets` lists it as unreadable, not as a match.
Count an unreadable sheet as a possible cause, not as an absent one.

**A bug in one page is a question about its siblings.** The same crash the fork
found in `registration-form-m3.html` was in two more pages that were never
critiqued; checking them took one grep.
