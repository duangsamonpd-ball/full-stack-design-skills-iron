---
name: design-to-code-workflow
description: Convert Figma designs and mockups into production-ready React, Astro, or Vue components with Tailwind CSS; for ongoing Figma ↔ code sync and Code Connect use figma-expert-workflows. Use when the user says "implement this figma design", "design to code", "figma to code", "build this design in react/astro/vue", or "turn this mockup into code".
---

# Design to Code

Convert a Figma design (or mockup/spec) into production-ready component code for **React, Astro, or Vue** using **Tailwind CSS**, with correct structure, styling, responsive behavior, and accessibility.

## When to use this skill

- Implementing a Figma design in code
- Converting a mockup or design spec into working components
- Porting a design across frameworks (React ↔ Astro ↔ Vue)

## The target repository carries the conventions

This skill carries **method**. The repository you are generating into carries **convention**, and
it is the authority on it. **When this skill disagrees with the codebase, the codebase wins.**

Never state a target repository's naming, structure or idiom from memory. A convention written
down here is right on the day it is written and silently wrong afterwards — and the generated code
goes on looking confident while it drifts into a dialect the codebase has left behind. Read it at
generation time instead:

| convention | derive it from |
|---|---|
| file naming | the modal filename shape among sibling components in the target directory |
| props idiom | whether siblings declare a typed props interface and destructure it |
| styling idiom | the ratio of utility classes to `<style>` blocks among siblings |
| content path | the loader call in the template that will consume what you write |
| the reuse catalogue | the target repository's own generated component manifest |
| colour vocabulary | a `@theme` block **and** any semantic class layer — searching for one shape misses the other |

The last one is the one that bites. A repository can carry both, and a search shaped for one
returns nothing for the other — which reads exactly like "this codebase has no colour system"
and is a confident, reasonable, wrong conclusion.

Where a convention cannot be derived — no siblings to read, no consuming template — say so and
ask. A choice made in silence is indistinguishable from a convention that was there all along.

## The output is a pair

A generated section is **two files, not one**: a component that takes every string from a `data`
prop, and the content slice that feeds it. Copy written into the template is invisible to
translation forever, and invisible to every count until somebody goes looking for it.

The props shape and the content shape are the same shape, which is what lets one structure emit
both.

```astro
---
// Purpose.astro — structure only, no string literals
interface Props {
  data: {
    heading: string
    body: string
    image: { src: string; alt: string }
  }
}
const { data } = Astro.props
---
<section>
  <h2>{data.heading}</h2>
  <p>{data.body}</p>
  <img src={data.image.src} alt={data.image.alt} />
</section>
```

```json
{
  "heading": "Why teams standardise on one renderer",
  "body": "One engine, one licence, eleven languages.",
  "image": { "src": "/assets/purpose.svg", "alt": "A document being converted to PDF" }
}
```

**An asset's `alt` belongs in the JSON, beside its `src`.** `src` is structure and `alt` is copy,
but they are one decision — split them and the alt text stays in the component, where it can never
be translated. This is the commonest way a generated page quietly loses a language.

The same split holds in React and Vue: a props interface and a content object, with only the syntax
moving.

Where the content is translated, the slice has four properties that only show up once somebody
reads the page in another language — scope, listings, falsy scalars and prose. They are in
`references/localization-traps.md`, and the third one is worth knowing before you write a single
slice: **an empty string is a value, not an absence**, so a placeholder `""` becomes a permanent
blank in that locale.

**Where the slice goes and what it is called is the target repository's business.** Derive it the
way the table above says — from the loader call in the template that will consume it — and never
invent a path. Where the repository ships a contract document for its content layer, that document
governs placement, naming and which fields are copy rather than structure.

## The `<head>` is usually not yours to write

Before emitting a `<title>`, a meta tag or a schema.org node, find out whether the target
repository already emits them. A mature codebase derives the whole `<head>` — title, description,
canonical, `hreflang`, Open Graph, and a cross-referenced JSON-LD graph — from live sources for
every page it builds. A generated page that writes its own gets a second, competing copy that
drifts from the first, and nothing goes red when it does.

**Where the repository emits them generically**, the page's entire contribution is a declaration:
say what kind of page it is, hand the layout its page data, write no `<head>`.

```astro
---
// the page declares what it IS; the layout derives the rest
const page = { json, breadcrumbs, pageType: 'webApplication' }
---
<Layout page={page}>…</Layout>
```

**Where it does not** — a small repository, a new one, a prototype room — the page owns its
`<head>`, and every node in it is built from the same source as the visible page rather than
restated beside it. Structured data that disagrees with the page it describes is a manual-action
risk with Google, and the only reliable way to keep the two in step is to make disagreement
impossible: the FAQ markup and the rendered FAQ read one list, or one of them is eventually wrong.

Which case you are in is derivable — look for a head, SEO or JSON-LD utility the layout already
calls, the way the table above says. Assume neither.

### Never invent a field to fill a schema

A slot with no honest answer is left out, not filled. A generated page is tempted by `author`,
`datePublished` and `aggregateRating` precisely because the schema has somewhere to put them, and
a fabricated value is indistinguishable from a real one at review. No subsystem can catch this —
it is a content rule, and it holds in both cases above.

## Workflow

Follow these steps in order. Don't skip step 1 — the most common failure is coding before requirements are clear.

### 1. Gather context & clarify requirements
Confirm before writing code:
- Target framework (React / Astro / Vue) and TypeScript or not
- Where the design lives (Figma URL/node, image, or written spec)
- Existing design tokens / Tailwind config to reuse
- Component scope: single component vs. full page
- The target repository, if generating into one — its conventions govern, and they are read at generation time rather than assumed

### 2. Extract design context
If a Figma URL is provided, load the `figma:figma-design-to-code` skill and use the Figma MCP tools to pull layout, spacing, colors, and typography. Otherwise extract from the image/spec: layout structure, spacing scale, color values, font sizes/weights, and interactive states.

### 3. Decide the implementation approach
- Reuse existing design-system components where they exist — don't rebuild
- Map raw design values to existing Tailwind tokens (see the `design-tokens-system` skill)
- Identify variants (e.g. primary/secondary) and props up front

Translating what the design *shows* into what the code should *mean* — auto-layout and
constraints into flex/grid, and every literal value into snap-to-token / propose-a-token /
justified one-off — is in `references/design-extraction.md`, along with the inventory to pull
in a single pass.

### 4. Build structure first, then style
Write semantic HTML/markup for the whole component before touching styling. Get the DOM/element tree right, then apply Tailwind classes.

### 5. Apply styling
Use Tailwind utilities mapped to design tokens rather than hardcoded values. Extract repeated utility clusters into `@apply` or a component only when they actually repeat.

### 6. Handle responsive & interactive states
Cover breakpoints (`sm/md/lg`), plus `hover`, `focus`, `active`, `disabled`, and loading states shown in the design.

Most of these aren't *in* the design. `references/states-and-gaps.md` is the intake checklist
for what a static mockup never shows — the full state matrix, content the copy flatters (long
strings, empty, translated), and behaviour nobody draws (focus order, focus after an action,
sticky headers obscuring focus, dark mode, RTL). Anything unanswered there is a question for
the designer, not a silent decision.

### 7. Accessibility pass
Semantic elements, labels/`aria-*`, visible focus, and color contrast. For anything non-trivial, hand off to the `web-accessibility-a11y` skill.

### 8. Verify against the design
Compare the rendered output to the source — spacing, colors, typography, and states. Note any intentional deviations.

## Framework notes

- **React** — function components + props for variants; `clsx`/`cn` for conditional classes.
- **Astro** — `.astro` components; keep interactivity in islands (React/Vue) only where needed.
- **Vue** — SFCs with `<script setup>`; bind variant classes via computed/`:class`.

The same component written out in all three — including where they genuinely diverge — is in
**frontend-framework-guide** → `references/framework-patterns.md`. One catch when porting: if
you `@apply` inside a Vue or Astro scoped `<style>` block, it needs `@reference` first or it
silently emits nothing (**css-styling-pixel-perfect** → `references/tailwind-v4-recipes.md`).

## Common pitfalls

- Hardcoding hex/px instead of using tokens → colors drift from the system
- Styling before structure → messy nesting and rework
- Skipping interactive states → design looks done but feels broken
- Rebuilding components that already exist in the library

## Next steps to recommend

- Run the **web-accessibility-a11y** skill on the result
- Use **design-tokens-system** if tokens/config need setup
- Use **component-library-mastery** when this becomes a reusable library component
