# Skill tests

Lightweight, single-file test cases for the 15 skills. Two things get checked:

1. **Trigger** — a representative prompt selects the intended skill.
2. **Disambiguation** — where two skills sit next to each other, the *right* one wins
   (this is what the tuned `description`s exist to guarantee).

**How to run (manual):** in this repo, send the prompt to Claude Code and confirm the
skill it loads matches the "Expected" column. Disambiguation rows must pick the **winner**,
never the **confusable** neighbor. Re-run after editing any `description`.

---

## 1 · Trigger matrix

| Prompt | Expected skill |
|--------|----------------|
| "why does this screen look off? improve the visual hierarchy" | `design-fundamentals` |
| "this looks AI-generated / generic — make it feel handcrafted" | `anti-ai-design-patterns` |
| "set up design tokens / a tailwind theme with css variables" | `design-tokens-system` |
| "design system governance and versioning across 100+ components" | `design-systems-architecture` |
| "implement this figma design as react components" | `design-to-code-workflow` |
| "react vs astro vs vue for this page? where's the hydration boundary?" | `frontend-framework-guide` |
| "organize my tailwind css / match the mockup pixel-perfect" | `css-styling-pixel-perfect` |
| "make it responsive across breakpoints / add container queries" | `responsive-universal-design` |
| "build and scale a component library with typed variants" | `component-library-mastery` |
| "set up figma code connect / keep dev mode in sync with code" | `figma-expert-workflows` |
| "audit this component for WCAG 2.2 AA compliance" | `web-accessibility-a11y` |
| "support reduced motion, RTL, and larger text" | `inclusive-design-patterns` |
| "add visual-regression + e2e tests to catch UI drift" | `qa-testing-visual-regression` |
| "improve Core Web Vitals / reduce the bundle size" | `web-performance-optimization` |
| "set up CI/CD with preview deploys and quality gates" | `deployment-devops-workflow` |

## 2 · Disambiguation (the tuned pairs)

Each row is a prompt that could plausibly hit either skill; the description makes one own it.

| Prompt | Winner | Not | Why |
|--------|--------|-----|-----|
| "make it responsive on mobile" | `responsive-universal-design` | `css-styling-pixel-perfect` | viewport/breakpoint layout is responsive's; styling owns architecture + pixel gaps |
| "organize my tailwind css architecture" | `css-styling-pixel-perfect` | `responsive-universal-design` | CSS structure ≠ layout responsiveness |
| "define the token system / set up the theme" | `design-tokens-system` | `design-systems-architecture` | authoring tokens is tokens-system; architecture consumes them at scale |
| "governance + versioning for a 100-component system" | `design-systems-architecture` | `design-tokens-system` | system-scale concerns, not token authoring |
| "turn this figma into working components" | `design-to-code-workflow` | `figma-expert-workflows` | one-shot implement is design-to-code |
| "keep figma and code in sync with code connect" | `figma-expert-workflows` | `design-to-code-workflow` | ongoing sync / Dev Mode / Code Connect |
| "build a component library" | `component-library-mastery` | `design-systems-architecture` | hands-on library build vs system-wide API contracts/governance |
| "define shared component API contracts across the system" | `design-systems-architecture` | `component-library-mastery` | cross-library contracts are architecture's |
| "check WCAG conformance (pass/fail)" | `web-accessibility-a11y` | `inclusive-design-patterns` | measurable conformance audit |
| "design for reduced motion, i18n, cognitive load" | `inclusive-design-patterns` | `web-accessibility-a11y` | beyond-baseline usability, not pass/fail |

## 3 · Behavior expectations

What a correct application should produce (not just which skill fires).

| Skill | A correct run yields |
|-------|----------------------|
| `design-fundamentals` | Named diagnosis (hierarchy/grid/color/type/spacing) + ranked fixes |
| `anti-ai-design-patterns` | Six-category audit with specific offending elements + targeted fixes |
| `design-tokens-system` | 3-layer tokens (primitive→semantic→component) wired via v4 `@theme` / `@theme inline` |
| `design-systems-architecture` | API grammar + theming-by-semantic-swap + governance/versioning + CI gates |
| `design-to-code-workflow` | Structure-first component, tokens not hex, states + a11y pass |
| `frontend-framework-guide` | Framework choice + the cheapest hydration directive that works |
| `css-styling-pixel-perfect` | Utility-first styling mapped to tokens + a gap log against the design |
| `responsive-universal-design` | Mobile-first reflow (stack→grid), no horizontal scroll, survives 200% zoom |
| `component-library-mastery` | Typed variants (cva), co-located story/test, tokens, definition-of-done checklist |
| `figma-expert-workflows` | Variables→tokens mapping + Code Connect snippet + clean-handoff checklist |
| `web-accessibility-a11y` | Severity-ranked findings, each with a concrete code fix (WCAG ref) |
| `inclusive-design-patterns` | Preferences honored (reduced-motion/color-scheme), i18n/RTL, forgiving forms |
| `qa-testing-visual-regression` | Behavior tests by role/label + visual baselines across theme × breakpoint |
| `web-performance-optimization` | Measured before/after on the worst vital; highest-leverage fix applied |
| `deployment-devops-workflow` | Pipeline with quality gates as definition-of-done + one-action rollback |

---

*Single source of truth — one file for all 15 skills, kept in sync with each `description`.
When a description changes, update the matching Trigger / Disambiguation rows here.*
