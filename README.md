<div align="center">

# Full-Stack Design Skills · Iron Software

**A set of 15 authored Claude skills for UX/UI + frontend engineering** — from first-principles design through tokens, components, accessibility, and shipping — tuned for **React · Astro · Vue** on **Tailwind CSS v4**.

<p>
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-61dafb?logo=react&logoColor=black" />
  <img alt="Astro" src="https://img.shields.io/badge/Astro-ff5d01?logo=astro&logoColor=white" />
  <img alt="Vue" src="https://img.shields.io/badge/Vue-42b883?logo=vuedotjs&logoColor=white" />
  <img alt="Skills" src="https://img.shields.io/badge/skills-15-0d9488" />
  <img alt="Author" src="https://img.shields.io/badge/author-Ball_%40_Iron_Software-334155" />
</p>

</div>

---

## What this is

Claude *skills* are packaged instructions Claude loads on demand for a specific kind of task. This repo holds a coherent UX/UI + frontend skill set: each is a folder under [`.claude/skills/`](.claude/skills) with a `SKILL.md` (and, where depth helps, a `references/` folder loaded progressively).

They share one spine — **layered design tokens → consistent component APIs → accessibility & inclusion as defaults → measured quality gates → reliable shipping** — and cross-link so following one naturally hands off to the next.

## The 15 skills

### Design
| Skill | What it does |
|-------|--------------|
| **design-fundamentals** | Diagnose & fix a UI from first principles — hierarchy, grid, color, type, spacing, balance. |
| **anti-ai-design-patterns** | Catch the "tells" that make a UI look machine-generated; make it read as handcrafted. |
| **design-tokens-system** | A layered token system (primitive → semantic → component) wired into Tailwind v4 `@theme`. |
| **design-systems-architecture** | Scale a system past 100+ components — API contracts, theming, governance, versioning. |

### Build
| Skill | What it does |
|-------|--------------|
| **design-to-code-workflow** | Turn Figma/mockups into production React, Astro, or Vue components. |
| **frontend-framework-guide** | Choose & apply React vs Astro vs Vue; get the interactivity/hydration boundary right. |
| **css-styling-pixel-perfect** | Maintainable Tailwind architecture + closing pixel gaps to the design. |
| **responsive-universal-design** | Fluid grids, container queries, adaptive type, mobile-first breakpoints. |
| **component-library-mastery** | Build & scale a component library — organization, typed variants, docs, tokens. |
| **figma-expert-workflows** | Work fluently Figma ↔ code — Dev Mode, Code Connect, keeping the two in sync. |

### Quality
| Skill | What it does |
|-------|--------------|
| **web-accessibility-a11y** | Audit against WCAG 2.1 AA with prioritized findings + concrete fixes. |
| **inclusive-design-patterns** | Beyond conformance — reduced motion, i18n/RTL, cognitive load, diverse inputs. |
| **qa-testing-visual-regression** | Unit/component + e2e + visual snapshots to catch UI drift. |
| **web-performance-optimization** | Profile & fix rendering, bundle size, and Core Web Vitals (LCP/INP/CLS). |

### Ship
| Skill | What it does |
|-------|--------------|
| **deployment-devops-workflow** | Build, CI/CD, preview deploys, quality gates, hosting, one-action rollback. |

## Live demo — `component-showcase.html`

A single self-contained page that **exercises all 15 skills at once**: base components (buttons, forms, badges, alerts, cards, table) built on Tailwind v4 tokens, with class-based dark mode, full keyboard accessibility, responsive reflow, and reduced-motion support.

```bash
open component-showcase.html      # macOS — opens in your default browser
```

Try it: toggle the theme switch (top-right), `Tab` through to see focus rings + the skip link, resize the window to watch the grid reflow.

> [!NOTE]
> The demo uses the **Tailwind Play CDN** (compiles in the browser) for zero-setup viewing — it's dev/testing only. For production, move the `@theme` / `@layer` block into a real `app.css` with `@import "tailwindcss";` and build in CI.

## Tailwind CSS v4 conventions

Every styling skill follows v4's CSS-first model:

- **`@import "tailwindcss";`** — no `tailwind.config.js`
- **`@theme` / `@theme inline`** — tokens registered in CSS; `inline` lets semantic swaps re-theme
- **`@custom-variant dark (&:where(.dark, .dark *))`** — class-based dark mode
- **Opacity via `color-mix`** — `bg-brand/50` works automatically; the old `rgb(var(--…) / <alpha-value>)` trick is gone

## Repo structure

```
.
├── .claude/
│   └── skills/                    15 skill folders (SKILL.md + optional references/)
│       └── README.md              skill-authoring notes & trigger rules
├── component-showcase.html        live demo exercising all 15 skills
└── README.md                      you are here
```

## How the skills trigger

There's no separate "triggers" field — Claude selects a skill from the **`description`** in each `SKILL.md`'s YAML frontmatter. Adjacent skills (styling ↔ responsive, tokens ↔ architecture, design-to-code ↔ figma) each own their own trigger phrases and point to their neighbor, so selection stays unambiguous. Details in [`.claude/skills/README.md`](.claude/skills/README.md).

---

<div align="center">
<sub>Authored by <b>Ball @ Iron Software</b> · UX/UI + Frontend</sub>
</div>
