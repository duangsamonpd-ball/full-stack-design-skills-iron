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
├── design-fundamentals/           SKILL.md
├── design-tokens-system/          SKILL.md
├── design-systems-architecture/   SKILL.md   (migrated from design-system-mastery + component design)
├── design-to-code-workflow/       SKILL.md   (migrated from design-to-code — full content)
├── css-styling-pixel-perfect/     SKILL.md   (merged styling + pixel-perfect)
├── responsive-universal-design/   SKILL.md
├── component-library-mastery/     SKILL.md   (migrated from component-system-building — full content)
├── frontend-framework-guide/      SKILL.md
├── figma-expert-workflows/        SKILL.md   (migrated from figma-code-connect)
├── web-accessibility-a11y/        SKILL.md   (migrated from accessibility-audit — full content)
├── inclusive-design-patterns/     SKILL.md
├── qa-testing-visual-regression/  SKILL.md
├── web-performance-optimization/  SKILL.md   (migrated from performance-optimization)
└── deployment-devops-workflow/    SKILL.md
```

## Content status

**All 15 skills are full content** — each has real workflows plus code / before-after
examples, and 14 carry a `references/` folder for on-demand depth:

- `anti-ai-design-patterns` (+3 refs) · `design-systems-architecture` (+2) ·
  `design-fundamentals` (+1) · `frontend-framework-guide` (+1) · `qa-testing-visual-regression` (+1) ·
  `responsive-universal-design` (+1) · `inclusive-design-patterns` (+3) ·
  `web-performance-optimization` (+1) · `deployment-devops-workflow` (+1) · `figma-expert-workflows` (+1) ·
  `css-styling-pixel-perfect` (+1) · `web-accessibility-a11y` (+1) · `design-tokens-system` (+1) ·
  `component-library-mastery` (+1)
- Full but single-file: `design-to-code-workflow`

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
