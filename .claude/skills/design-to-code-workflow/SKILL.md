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

## Workflow

Follow these steps in order. Don't skip step 1 — the most common failure is coding before requirements are clear.

### 1. Gather context & clarify requirements
Confirm before writing code:
- Target framework (React / Astro / Vue) and TypeScript or not
- Where the design lives (Figma URL/node, image, or written spec)
- Existing design tokens / Tailwind config to reuse
- Component scope: single component vs. full page

### 2. Extract design context
If a Figma URL is provided, load the `figma:figma-design-to-code` skill and use the Figma MCP tools to pull layout, spacing, colors, and typography. Otherwise extract from the image/spec: layout structure, spacing scale, color values, font sizes/weights, and interactive states.

### 3. Decide the implementation approach
- Reuse existing design-system components where they exist — don't rebuild
- Map raw design values to existing Tailwind tokens (see the `design-tokens-system` skill)
- Identify variants (e.g. primary/secondary) and props up front

### 4. Build structure first, then style
Write semantic HTML/markup for the whole component before touching styling. Get the DOM/element tree right, then apply Tailwind classes.

### 5. Apply styling
Use Tailwind utilities mapped to design tokens rather than hardcoded values. Extract repeated utility clusters into `@apply` or a component only when they actually repeat.

### 6. Handle responsive & interactive states
Cover breakpoints (`sm/md/lg`), plus `hover`, `focus`, `active`, `disabled`, and loading states shown in the design.

### 7. Accessibility pass
Semantic elements, labels/`aria-*`, visible focus, and color contrast. For anything non-trivial, hand off to the `web-accessibility-a11y` skill.

### 8. Verify against the design
Compare the rendered output to the source — spacing, colors, typography, and states. Note any intentional deviations.

## Framework notes

- **React** — function components + props for variants; `clsx`/`cn` for conditional classes.
- **Astro** — `.astro` components; keep interactivity in islands (React/Vue) only where needed.
- **Vue** — SFCs with `<script setup>`; bind variant classes via computed/`:class`.

## Common pitfalls

- Hardcoding hex/px instead of using tokens → colors drift from the system
- Styling before structure → messy nesting and rework
- Skipping interactive states → design looks done but feels broken
- Rebuilding components that already exist in the library

## Next steps to recommend

- Run the **web-accessibility-a11y** skill on the result
- Use **design-tokens-system** if tokens/config need setup
- Use **component-library-mastery** when this becomes a reusable library component
