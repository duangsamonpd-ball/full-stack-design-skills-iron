---
name: brief-before-build
description: Interrogate a request before building a new page, screen or component that has no design yet — read what the repository already answers, ask only the questions whose answers change the work, in one round, and write every unasked decision down as an assumption in a BRIEF.md that a later review can argue against. Use when the user asks to create, design or build something new from a request alone, with no Figma frame, mockup or spec, or says "grill me" or "what do you need to know first". When a Figma frame or mockup exists, use build-page-from-frame or design-to-code-workflow instead.
---

# Brief before build

The gates catch a page built wrongly. Nothing catches a page built correctly
from the wrong brief, and with no design to read, the brief is all there is.
This spends a few minutes up front so that the decisions are made by the person
who owns them, and the ones nobody made are written down where they can be
checked.

Idea adapted from the `grill-me` skill in
[plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills)
(MIT, read at `f823ace`). The question lists and the brief format are this
repository's own.

Target: `$ARGUMENTS` — the thing about to be built. If even that is unclear, it
is the first question.

## 1. Read before you ask

A question the repository already answers is noise, and it teaches the person
that answering you is a waste of their time. Before writing one:

- An existing brief, `CLAUDE.md`, `MAP.md` (see **figma-astro-init**), or notes
  about the product.
- The theme: tokens, `@theme`, a semantic class layer. If one exists, "which
  colours?" is answered.
- The neighbouring pages and components: framework, conventions and the
  component inventory are read, not asked — **design-to-code-workflow** carries
  the table of what to derive and where from.

Every question that survives this pass is one the code cannot answer.

## 2. What to ask about

Only what no file and no gate can tell you:

**Purpose and lead**
- Who is this for, and what is the one task they came to finish?
- What should the eye land on first? Four equal cards means "nothing", and that
  is a composition decision before it is a styling one.
- What has the person done when they leave — what does success look like?

**Irreversible actions**
- Which actions destroy something or cannot be undone, and what confirms them?
  Destructive styling goes on the trigger *and* the confirmation, never one.
- When the action fails, what does the person read, and what can they do next?

**Scope and done**
- Exactly which pages or components, and what is deliberately out of scope?
- What has to be true before this is done — which gates, and is
  **fresh-eyes-critique** part of the bar?

**Content, states and platform** are the same questions a design leaves open,
and they are already written down in
**design-to-code-workflow** → `references/states-and-gaps.md` — longest real string, empty / one / many,
loading and error, dark mode, RTL, the narrowest width. Use its "default if
nobody answers" column for the ones you do not ask.

## 3. How to ask

- **One round.** Every question at once. A drip of single questions costs more
  of the person's attention than a wrong assumption costs to fix.
- **Each question must change the work.** If both answers produce the same
  build, it is a default: take it and write it down. Long lists are mostly
  defaults in disguise.
- **Do not ask what you can decide well.** Spacing, type scale, the exact shade
  — that is the job. Ask about intent, content and constraint.

## 4. Everything unasked is an assumption, in writing

A decision held silently cannot be told apart from a guess. One line each:
what was assumed, the default taken, and what it costs if it is wrong.

```
Assumption: no dark mode asked for -> shipping both (the tokens are already dual;
including it costs nothing now, retrofitting it is a rewrite).
```

## 5. Output: a brief that can be argued against

Write `BRIEF.md` next to the work:

```
# <what is being built>

Goal            one sentence, from the user's side
User and task   who, and the task they came to finish
Deliverables    exact list
Lead            the one thing the eye lands on first
Irreversible    which actions, what confirms them, what failure reads like
Content         longest real string, empty / one / many, real vs placeholder
Theme           source of truth, dark mode, brand direction
Platform        narrowest width, framework, RTL, AA or AAA
Out of scope    what this deliberately is not
Intentional     choices a reviewer would otherwise flag — and why they stand
Assumptions     each with its default and its cost if wrong
Done when       the gates, and whether fresh-eyes-critique is part of the bar
```

**Intentional is the line that pays for the file.** Measured 2026-11-13:
**fresh-eyes-critique** runs in a fork that cannot see the conversation, and on
this repository's Material 3 demo page it raised the M3 baseline purple and the
"same skills, swapped design system" note as findings. Both were deliberate,
and the only place that said so was a chat it could not read. A brief on disk
is how intent reaches a reviewer that was never in the room.

## 6. Then build, then look

Brief → build → gates → **fresh-eyes-critique**. This removes ambiguity. It
does not make anything good, it scores nothing, and it is not a substitute for
rendering the work and using it.
