# Icon Library Guide

How to use icons so they don't read as "default AI UI." Loaded on demand by the
`anti-ai-design-patterns` skill.

## Why icons become a tell

The giveaway isn't *which* library — it's using the single most ubiquitous set, at its
default weight, unmodified, on every surface, with an icon decorating every heading.
That combination signals "template," not "product."

## Principles

- **Fewer icons, placed with intent.** An icon on every heading is a tell; an icon that
  genuinely speeds scanning (nav, status, actions) is not.
- **One coherent style per surface.** Consistent stroke weight, corner radius, and optical
  size. Mixing two icon styles side by side looks accidental.
- **Fit the brand, not the default.** A rounded, playful set and a sharp, technical set send
  opposite messages — choose the one that matches the product's voice.
- **Match the type.** Icon optical size and stroke should sit comfortably next to adjacent
  text (roughly cap-height, similar visual weight).
- **Accessibility:** decorative icons get `aria-hidden="true"`; functional icon-only
  controls get an accessible name (`aria-label`).

## Choosing a set

| Context | Direction |
|---------|-----------|
| Distinctive brand feel | A less-ubiquitous set, or lightly customized icons (adjust weight/radius) |
| Dense product UI | A cohesive set that stays legible at 16px; consistent grid |
| Marketing / hero | Custom marks, illustrations, or spot art over stock line icons |
| Technical / developer | A sharper, more geometric set reads as precise |

> Popular general-purpose sets are fine — the fix is *how* you use them (restraint,
> consistency, and fitting them to the brand), not avoiding a particular library.

## Making a common set feel intentional

- Standardize one stroke weight across the app and stick to it.
- Adjust corner radius / weight slightly to match your brand shape language.
- Pair icons with text labels for primary actions instead of icon-only mystery buttons.
- Give icons real spacing and alignment against text — not cramped, not floating.

## Do / Don't

- ✅ Consistent size, weight, and metaphor across a surface
- ✅ Icon **+ text label** for primary actions
- ✅ Icons where they aid scanning (nav, status, list affordances)
- ❌ An icon decorating every card and heading
- ❌ Two icon styles / stroke weights mixed on one screen
- ❌ Icon-only buttons with no accessible name
- ❌ Decorative icons announced to screen readers

> Team note: record the specific icon set(s) you standardize on here, with license + usage notes.
