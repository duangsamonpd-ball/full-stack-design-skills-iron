---
name: anti-ai-design-patterns
description: Avoid the visual and structural "tells" that make a UI look AI-generated, and review designs for them. Use when the user says "make it not look AI", "avoid AI look", "review for AI tells", "make this feel handcrafted", or "why does this look generic".
---

# Anti-AI Design Patterns

Catch and fix the patterns that make an interface read as machine-generated, so the result looks intentional and handcrafted instead of default.

## When to use this skill

- A design "looks AI" / generic and you can't articulate why
- Reviewing UI for tells before shipping
- Establishing house rules that keep output distinctive

## Core principle

AI-looking UI is almost always **default-looking UI**: no point of view, no hierarchy of emphasis, no brand. Every value looks like it was accepted rather than chosen. The fix is never *more decoration* — it's fewer, more deliberate, more specific choices. One confident decision beats ten safe ones.

Three questions that expose most tells:
1. **What is the single most important thing on this screen — and is it unmistakably the most prominent?** (If everything is equal weight, it reads as generated.)
2. **Could I name the brand from this screen alone?** (If it's interchangeable with any SaaS landing page, that's the tell.)
3. **Did a human decide this value, or is it a default?** (`#6366f1`, centered, `gap-4` everywhere → default.)

## The six categories

Fast audit. Depth for each — with concrete before/after fixes — is in `references/ai-tells-catalog.md`.

1. **Color** — generic indigo/violet (`#6366f1`→`#8b5cf6`) gradients, evenly-saturated palettes, no dominant brand color, semantic colors used for decoration.
2. **Layout** — everything centered, equal-weight cards in endless 3-column grids, perfect symmetry, no focal point.
3. **Typography** — one effective size, no hierarchy, default leading/tracking, an unopinionated system font.
4. **Icons** — one ubiquitous library used literally everywhere, an icon on every heading, decorative-only icons. See `references/icon-library-guide.md`.
5. **Copy** — emoji-prefixed headings (🚀 ✨), "Elevate / Unlock / Seamless" filler, exclamation marks, vague hedged claims.
6. **Spacing** — uniform padding on every block, no rhythm, no intentional density changes.

## Workflow

1. **Capture** — screenshot the current UI at a real viewport.
2. **Audit** — walk the six categories; log each tell against the specific offending element (not "colors feel off" but "hero CTA uses the default indigo→violet gradient").
3. **Fix** — apply the targeted remedy from `references/ai-tells-catalog.md`; make each fix a *decision* (a chosen value, tied to a token where possible).
4. **Re-check** — run `references/review-checklist.md`; every "no" is a remaining tell.
5. **Lock it in** — promote the chosen values (brand color, type scale, spacing rhythm) into `design-tokens-system` so the whole product inherits the intent.

## What "fixed" looks like

Not "more designed" — more *decided*. A reviewer should be able to point at choices: this dominant color, this asymmetric hero, this one large headline, this deliberately dense table. Distinctiveness, not decoration.

## Next steps

- Encode the chosen values as tokens in **design-tokens-system**
- Confirm the opinionated result still passes **web-accessibility-a11y** (contrast especially)
- Apply underlying principles via **design-fundamentals**
