---
name: design-systems-architecture
description: Architect a design system at scale — token-layer structure, component API contracts, theming, governance, and versioning — and grow it past 100+ components; author the tokens themselves in design-tokens-system and build the components in component-library-mastery. Use when the user says "design system architecture", "scale design system", "design system governance", "component API design", or "multi-brand theming".
---

# Design Systems Architecture

Architect a design system so it stays coherent as it grows: layered tokens as the single source of truth, consistent component API contracts, theming that swaps cleanly, and the governance/versioning that keeps quality flat past 100+ components.

## When to use this skill

- Designing the *architecture* of a design system (not just one component)
- Defining component API contracts that stay consistent across the library
- Setting up token layers, a generation pipeline, and theming
- Establishing governance, versioning, and contribution flow to scale

## The four architectural pillars

### 1. Token architecture (the foundation)
Three layers so themes swap without touching components:

```
primitive   --blue-600: #2563eb              raw palette / scale (never used directly)
semantic    --color-brand: var(--blue-600)   meaning, themeable
component    --button-bg: var(--color-brand)  consumed by components
```

Components reference **semantic** and **component** tokens only. A single generation
pipeline emits the `@theme` CSS (Tailwind v4) and native formats from one source —
see `references/token-pipeline.md` for a working Style Dictionary setup and the full
mapping table. This builds on **design-tokens-system**; this skill is that system
*at scale*, with a pipeline and governance around it.

### 2. Component API contracts (consistency at scale)
The thing that makes 100 components feel like *one* system is a shared API grammar, not
100 clever individual designs. Standardize, across every component:

- **Variant vocabulary** — the same prop names and values everywhere (`variant`, `size`,
  `tone`), not `type` here and `kind` there.
- **Anatomy & slots** — named parts and composition slots over prop explosion.
- **State coverage** — every component handles the full matrix (default/hover/focus/
  active/disabled/loading/error) and binds visuals to tokens.
- **Accessibility contract** — role, keyboard model, focus behavior, and required
  labels/ARIA are part of the API, decided up front.

The per-component design method (anatomy → variants → props → a11y contract → spec) lives
in `references/component-contract.md`.

### 3. Theming
Light/dark and multi-brand are **swaps at the semantic layer** — primitives stay fixed,
semantic tokens are overridden under `.dark` / `[data-brand="…"]`. Components never
branch on theme; they just consume semantic tokens. One override map = a new theme.

### 4. Governance & versioning
What keeps quality flat as contributors multiply:

- **Contribution flow** — an RFC/proposal for new components, clear ownership, a public roadmap.
- **Quality gates as definition-of-done** — a11y, visual regression, and bundle budget in CI; nothing merges that regresses them.
- **Versioning** — semantic versioning, a changelog, codemods + migration guides for breaking changes, a documented deprecation policy.
- **Adoption** — a living docs site (Storybook + usage guidelines) and usage metrics so you know what's actually consumed.

## Architecture workflow

1. **Token layers** — define primitive → semantic → component; wire the generation pipeline.
2. **API grammar** — lock the shared variant/size/state vocabulary and naming rules.
3. **Theming model** — implement themes as semantic-layer overrides.
4. **Primitives first** — build the base layer against the contract before composing upward.
5. **Governance** — stand up RFC flow, ownership, and CI quality gates.
6. **Versioning & docs** — semver, changelog, codemods, living docs, adoption metrics.
7. **Scale in phases** — primitives → composed → patterns/templates (see `component-library-mastery` for the phased build).

## Governance checklist

```
□ Token layers defined (primitive / semantic / component)
□ Generation pipeline → CSS vars + Tailwind + native (single source)
□ Shared component API grammar (variant/size/state naming) documented & enforced
□ Theming via semantic-layer swap (no per-component theme branching)
□ Accessibility contract is part of every component's API
□ CI gates: a11y + visual regression + bundle budget = definition of done
□ Semver + changelog + migration codemods + deprecation policy
□ Living docs (Storybook + guidelines) + adoption metrics
```

## Common architectural mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Components consume primitive tokens directly | Theming breaks; can't reskin | Route through semantic tokens |
| Inconsistent prop naming across components | Feels like many libraries, not one | Enforce a shared API grammar |
| Per-component theme conditionals | Unmaintainable; themes multiply code | Swap at the semantic layer only |
| No quality gates | Quality drifts as contributors grow | a11y + visual + bundle in CI |
| Breaking changes with no migration path | Consumers stuck / forked | Codemods + changelog + deprecation window |

## Next steps

- Foundational tokens: **design-tokens-system**
- Phased library build & component structure: **component-library-mastery**
- Enforce **web-accessibility-a11y** and **qa-testing-visual-regression** as CI gates
- Keep design ↔ code in sync at scale with **figma-expert-workflows**
