# Claude Skills — Iron Software (UX/UI + Frontend)

Frameworks: React · Astro · Vue + **Tailwind CSS v4** (CSS-first: `@theme` / `@theme inline`,
`@custom-variant` dark mode, opacity via `color-mix` — no `tailwind.config.js`).
Author: Ball @ Iron Software.

## Layout

Each skill is a **folder** with a `SKILL.md`. Longer material lives in a sibling
`references/` folder that the skill loads on demand (progressive disclosure).

```
.claude/skills/
├── anti-ai-design-patterns/       SKILL.md + references/{ai-tells-catalog, icon-library-guide, review-checklist}.md
├── design-fundamentals/           SKILL.md + references/principles-deep-dive.md
├── design-tokens-system/          SKILL.md + references/theming-recipes.md
├── design-systems-architecture/   SKILL.md + references/{component-contract, token-pipeline}.md   (migrated from design-system-mastery + component design)
├── design-to-code-workflow/       SKILL.md + references/{design-extraction, states-and-gaps}.md   (migrated from design-to-code — full content)
├── css-styling-pixel-perfect/     SKILL.md + references/tailwind-v4-recipes.md   (merged styling + pixel-perfect)
├── responsive-universal-design/   SKILL.md + references/responsive-recipes.md
├── component-library-mastery/     SKILL.md + references/variant-recipes.md   (migrated from component-system-building — full content)
├── frontend-framework-guide/      SKILL.md + references/framework-patterns.md
├── figma-expert-workflows/        SKILL.md + references/code-connect.md   (migrated from figma-code-connect)
├── web-accessibility-a11y/        SKILL.md + references/aria-patterns.md   (migrated from accessibility-audit — full content)
├── inclusive-design-patterns/     SKILL.md + references/{cognitive-accessibility, inclusive-patterns, universal-design-principles}.md
├── qa-testing-visual-regression/  SKILL.md + references/testing-setup.md
├── web-performance-optimization/  SKILL.md + references/perf-tactics.md   (migrated from performance-optimization)
└── deployment-devops-workflow/    SKILL.md + references/ci-cd.md
```

## Content status

**All 15 skills are full content** — each has real workflows plus code / before-after
examples, and **all 15** now carry a `references/` folder for on-demand depth (21 files):

- `anti-ai-design-patterns` (+3 refs) · `inclusive-design-patterns` (+3) ·
  `design-systems-architecture` (+2) · `design-to-code-workflow` (+2) ·
  `design-fundamentals` (+1) · `design-tokens-system` (+1) · `css-styling-pixel-perfect` (+1) ·
  `responsive-universal-design` (+1) · `component-library-mastery` (+1) ·
  `frontend-framework-guide` (+1) · `figma-expert-workflows` (+1) · `web-accessibility-a11y` (+1) ·
  `qa-testing-visual-regression` (+1) · `web-performance-optimization` (+1) ·
  `deployment-devops-workflow` (+1)

`skills-lint` asserts every `references/…md` a SKILL.md promises actually resolves, including
the cross-skill pointers — so this list can't quietly go stale.

## How triggering works

There is no separate "triggers" field — Claude selects a skill from the **`description`**
in the YAML frontmatter. Rules:
- `name` — lowercase letters, numbers, hyphens; **must match the folder name**.
- `description` — one line saying *what it does* **and** *when to use it* (with the
  phrases a user would type). This is what auto-selects the skill.
- **Disambiguation** — where two skills sit next to each other (styling ↔ responsive,
  tokens ↔ architecture, design-to-code ↔ figma-workflows, library ↔ architecture),
  each `description` owns its own trigger phrases and points to its neighbor
  ("for X use `<other-skill>`") so auto-selection stays unambiguous.

## Suggested flow

Design → `design-fundamentals`, `anti-ai-design-patterns`, `design-tokens-system`,
`design-systems-architecture`
Build → `design-to-code-workflow`, `frontend-framework-guide`, `css-styling-pixel-perfect`,
`responsive-universal-design`, `component-library-mastery`, `figma-expert-workflows`
Quality → `web-accessibility-a11y`, `inclusive-design-patterns`,
`qa-testing-visual-regression`, `web-performance-optimization`
Ship → `deployment-devops-workflow`

## Tests

[`TESTS.md`](TESTS.md) — a single-file trigger + disambiguation matrix (plus behavior
expectations) for all 15 skills. Re-run the rows for any skill whose `description` you edit.
