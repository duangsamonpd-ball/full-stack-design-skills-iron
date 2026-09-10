---
name: build-page-from-frame
description: Build a complete page in an existing repository from a Figma frame — read the frame's real geometry, decompose it into sections, reuse the components the repository already has, and emit each section as a component plus its content slice. Use when the user says "build this page from this frame", "build a page from this Figma frame", "turn this frame into a page", "implement this frame as a page", or gives a Figma frame URL and names a repository to build it into. For a single component or a design with no target repository, use design-to-code-workflow instead.
---

# Build a page from a frame

The task, end to end: a Figma frame URL and a target repository go in; a page made of sections
the repository can maintain comes out. This skill **composes** the discipline skills rather than
replacing them — it is the order of operations and the stopping points.

## What makes this different from converting a design

Two things, and both come from the target having a history:

- **The repository already has components.** The first question is *what do we already have*, not
  *what should I build*. A near-duplicate section is worse than a slightly awkward reuse, because
  it doubles the surface every future change has to reach.
- **The repository has conventions, and they move.** Read them at generation time. `design-to-code-workflow`
  carries the table of what to derive and where from; that table governs here too.

## The order

### 1. Establish the target
Before reading the frame. The repository, the route the page will live at, and the render template
that will consume what you write. If any of the three is unknown, ask — a page built into the wrong
place is a rewrite, not a fix.

### 2. Read the frame's real geometry
Load `figma:figma-design-to-code` and pull the node tree. **Measure, do not eyeball.** The node
tree reports what the instance on the screen actually is; reference code describes a component in
itself and disagrees more often than expected. The traps that make a read wrong — halved blur radii,
alpha rounding, one-mode variable reads, hidden children carrying stale coordinates — are in
**design-to-code-workflow** → `references/design-extraction.md`. Read them before trusting a number.

### 3. Decompose into sections
One band of the frame, one component. Name each from what it *is* for the page, not from what it
looks like. Report the decomposition before building it — a wrong split is cheapest to fix here.

### 4. Consult the catalogue before writing anything
For every section, search the repository's own components first. Say what you found:

```
reuse    7  from the repository's section components
tokens   2  new sections, built from design-system tokens only
local    1  segmented control — nothing equivalent exists
```

**Where something close already exists, stop and say so** rather than adding a near-duplicate.
Extending the existing one is usually right, and it is the user's call either way.

### 5. Emit each section as a pair
A component that takes every string from a `data` prop, plus the content slice that feeds it —
including every asset's `alt` beside its `src`. The rule and its worked example are in
**design-to-code-workflow**; where the content is translated,
**design-to-code-workflow** → `references/localization-traps.md` applies, and an empty-string
placeholder is a permanent blank.

### 6. Do not write a `<head>` the repository already derives
Declare the page type and hand the layout its page data. Where the repository has no such layer,
the page owns its head and every node in it reads from the same source as the visible page.

### 7. Say what the frame did not specify
Behaviour, analytics and CRM wiring appear in no frame. Implement none of them silently, and put
the absence in the code where the next reader meets it.

### 8. Verify against the frame, not against memory
Measure the built page against the frame's real numbers — band heights, gaps, type sizes — and
report the gaps as numbers. "Looks right" is not a result.

## Stopping points

Stop and report at **3** (the decomposition), at **4** when something close already exists, and at
**8** with the measured differences. Building all eight steps and reporting once means a wrong
decision at step 3 is paid for seven times.

## What this calls

`design-to-code-workflow` for the method and its references · `figma:figma-design-to-code` for the
frame · `design-tokens-system` when a value has no token · `css-styling-pixel-perfect` for the
measured comparison at step 8 · `web-accessibility-a11y` before the page is called done.
