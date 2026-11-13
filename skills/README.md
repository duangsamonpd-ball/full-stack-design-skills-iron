# Claude Skills — Iron Software (UX/UI + Frontend)

Frameworks: React · Astro · Vue + **Tailwind CSS v4** (CSS-first: `@theme` / `@theme inline`,
`@custom-variant` dark mode, opacity via `color-mix` — no `tailwind.config.js`).
Author: Ball @ Iron Software.

## Layout

Each skill is a **folder** with a `SKILL.md`. Longer material lives in a sibling
`references/` folder that the skill loads on demand (progressive disclosure).

```
skills/
└── <skill-name>/
    ├── SKILL.md          frontmatter (name = folder name, description) + the workflow
    └── references/       optional, loaded on demand — linked from SKILL.md or flagged by the lint
```

`ls skills/` is the list. It is deliberately not repeated here: this file used to carry
a tree and a count ("all 16 … 25 files") that stayed true for one release and then
described a folder that no longer existed. What *is* checked:

- `skills-lint` — every `references/…md` a SKILL.md promises resolves (cross-skill pointers
  too), and every skill has a row in the root README tables and in [`TESTS.md`](TESTS.md).
- The root [`README.md`](../README.md) carries the one-line summary of each skill.

## How triggering works

There is no separate "triggers" field — Claude selects a skill from the **`description`**
in the YAML frontmatter. Rules:
- `name` — lowercase letters, numbers, hyphens; **must match the folder name**.
- `description` — one line saying *what it does* **and** *when to use it* (with the
  phrases a user would type). This is what auto-selects the skill.
- **Disambiguation** — where two skills sit next to each other (styling ↔ responsive,
  tokens ↔ architecture, design-to-code ↔ figma-workflows, library ↔ architecture,
  critique ↔ fundamentals, brief ↔ design-to-code, ux-writing ↔ anti-ai, page ↔ component),
  each `description` owns its own trigger phrases and points to its neighbor
  ("for X use `<other-skill>`") so auto-selection stays unambiguous.

## Suggested flow

Brief → `brief-before-build` (only when there is no design to read)
Design → `design-fundamentals`, `anti-ai-design-patterns`, `ux-writing`, `design-tokens-system`,
`design-systems-architecture`
Build → `design-to-code-workflow`, `build-page-from-frame`, `frontend-framework-guide`,
`css-styling-pixel-perfect`, `responsive-universal-design`, `component-library-mastery`,
`figma-expert-workflows`
Quality → `web-accessibility-a11y`, `inclusive-design-patterns`,
`qa-testing-visual-regression`, `web-performance-optimization`, `fresh-eyes-critique`
Ship → `deployment-devops-workflow`

Stack-specific: `shadcn-ui-design`. The generator's memory: `figma-astro-init`, `figma-astro-note`.

## Tests

[`TESTS.md`](TESTS.md) — a single-file trigger + disambiguation matrix (plus behavior
expectations) for every skill. Re-run the rows for any skill whose `description` you edit.
