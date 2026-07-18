---
name: figma-expert-workflows
description: Work fluently between Figma and code — extract design context, use Dev Mode, keep design ↔ code in sync with Code Connect, and organize files/variables; for a one-shot implement of a design as components use design-to-code-workflow. Use when the user says "figma workflow", "figma dev mode", "figma code connect", "map figma components", or "design sync".
---

# Figma Expert Workflows

Operate the whole Figma ↔ code loop: pull accurate context *from* Figma, push structure back, and keep the two in sync so design and code don't drift.

## When to use this skill

- Extracting design context/specs from Figma to implement in code
- Using Dev Mode effectively for handoff
- Connecting design-system components to code with Code Connect
- Organizing Figma files, variables, and components for a clean handoff

## Use the bundled Figma tooling first

This environment ships dedicated Figma skills and MCP tools — prefer them for the actual
work; this skill is the process/checklist wrapper that decides *which* to use when:

- **`figma:figma-design-to-code`** + `get_design_context` — implement a Figma design as code.
- **`figma:figma-code-connect`** + `get_code_connect_map` — author/maintain Code Connect mappings.
- **`figma:figma-generate-design` / `figma:figma-use`** — push code/structure into Figma.
- MCP: `get_metadata`, `get_screenshot`, `get_variable_defs` — inspect a file programmatically.

## The three workflows

### A. Figma → code (implementation)
1. Get the node URL; pull context with `get_design_context` (layout, type, color, spacing, variables).
2. Map Figma **variables** → your design tokens (`design-tokens-system`) instead of raw values.
3. Reuse existing components; implement via `design-to-code-workflow`.
4. Verify against the frame (`css-styling-pixel-perfect`).

### B. Code → Figma (authoring/sync)
Use `figma:figma-generate-design` / `figma:figma-use` to build or update frames from code
or a description — assembling with design-system components and variables, not hardcoded values.

### C. Design ↔ code sync (Code Connect)
Wire Figma components to real code so Dev Mode shows the true snippet + prop mapping instead
of generic CSS. Full `Button.figma.tsx` example and setup in `references/code-connect.md`.

## Code Connect mapping cheatsheet

| Figma prop | Code Connect helper |
|------------|---------------------|
| Variant (enum) | `figma.enum('Variant', { Primary: 'primary', … })` |
| Boolean toggle | `figma.boolean('Disabled')` |
| Text | `figma.string('Label')` |
| Slot / instance | `figma.children('*')` |

## Clean-handoff checklist

```
□ Components (not detached frames) with named, consistent variants
□ Figma variables used for color/space/type — mapped to code tokens
□ Auto-layout so intent (padding/gap/direction) is explicit
□ Dev Mode enabled; Code Connect published for key components
□ One naming grammar shared between Figma and code (variant/size/state)
```

## Next steps

- Implement pulled designs with **design-to-code-workflow**
- Map Figma variables to **design-tokens-system**; govern the pairing in **design-systems-architecture**
- Ensure mapped components come from **component-library-mastery**
