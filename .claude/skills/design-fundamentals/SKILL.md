---
name: design-fundamentals
description: Apply core visual-design fundamentals — hierarchy, layout/grid, color theory, typography, spacing, and contrast/balance — to critique or improve a UI. Use when the user says "improve this design", "design critique", "why does this look off", "visual hierarchy", or "design principles".
---

# Design Fundamentals

Diagnose and improve a UI from first principles — before reaching for components, libraries, or code. When something "looks off," this is how you name the cause and fix it.

## When to use this skill

- A layout looks off and you need to say *why* and fix it
- Establishing visual hierarchy, rhythm, and balance
- Design critique / first-principles review of a screen

## The three fastest diagnostics

1. **Squint test** — blur your eyes (or literally squint). What reads first? Is it the thing that *should* read first? If everything blurs into equal mush, hierarchy is broken.
2. **Grayscale test** — remove color. A good design still works in grayscale because hierarchy comes from size/weight/space, not color. If it collapses, you're leaning on color to do structure's job.
3. **Proximity test** — are related things closer to each other than to unrelated things? If spacing is uniform, grouping is ambiguous.

## The six fundamentals

Concise rules here; worked before/after examples in `references/principles-deep-dive.md`.

### 1. Hierarchy
The eye should land on the most important element first, then follow a deliberate path. Rank with **size → weight → color → position → space**. Exactly one primary focal point per screen.

### 2. Layout & grid
Align everything to a consistent grid; nothing floats arbitrarily. Whitespace is an *active* material, not leftover space. Prefer deliberate asymmetry with a focal point over mirror symmetry.

### 3. Color
One dominant color, neutrals carrying most surfaces, accents used sparingly for emphasis. Contrast should *reinforce* hierarchy (the important thing has the most contrast), not fight it.

### 4. Typography
A real type scale with decisive jumps (not 16/18/20). Tune leading and tracking per role — tight for display, relaxed for body. Keep body line length ~45–75 characters. Limit to 1–2 typefaces used on purpose.

### 5. Spacing & rhythm
Use one spacing scale (`xs sm md lg xl 2xl`) and stick to it. Apply **proximity**: group related content tighter, separate unrelated content more. Vary density intentionally — uniform padding everywhere is a non-decision.

### 6. Contrast & balance
Contrast creates emphasis (size, weight, color, space). Balance distributes visual weight — usually deliberate asymmetry beats symmetry. Alignment and consistency create the sense of "designed."

## Critique workflow

1. **Squint / grayscale / proximity** tests — capture what breaks.
2. **Hierarchy** — is the focal point right and clearly dominant?
3. **Grid & alignment** — is everything on a system, or floating?
4. **Type scale & spacing scale** — consistent, or ad hoc?
5. **Color** — one dominant + purposeful accents, contrast serving hierarchy?
6. **List fixes ranked by impact** — hierarchy and spacing usually give the biggest wins first.

## Common diagnoses

| Symptom | Usual cause | Fix |
|---------|-------------|-----|
| "Flat / nothing stands out" | No hierarchy | Enlarge/weight the primary element; demote the rest |
| "Cluttered / busy" | No grouping or rhythm | Apply proximity + a spacing scale; add whitespace |
| "Cheap / generic" | Default type & color | Real type scale, one dominant brand color |
| "Messy / unaligned" | No grid | Align to columns/baseline; consistent edges |
| "Boring / static" | Perfect symmetry, no focal point | Introduce asymmetry + one clear focal point |

## Next steps

- Encode the chosen scales/colors as tokens in **design-tokens-system**
- Avoid generic defaults with **anti-ai-design-patterns**
- Turn the improved design into UI with **design-to-code-workflow**
