# Anti-AI Review Checklist

Run before shipping. Any "no" is a tell — fix it via `ai-tells-catalog.md`.
Loaded on demand by the `anti-ai-design-patterns` skill.

## Gut check (do this first)
- [ ] I can name the single most important element, and it is clearly the most prominent
- [ ] I could identify the brand from this screen alone
- [ ] Every notable value looks *chosen*, not defaulted

## Color
- [ ] No default indigo→violet gradient (`#6366f1`→`#8b5cf6`) on hero/buttons
- [ ] One clear dominant/brand color; neutrals carry most surfaces
- [ ] Accents used sparingly for emphasis, not spread evenly
- [ ] Semantic colors (success/warning/danger) appear only on real states
- [ ] Text is tinted near-black on a real neutral ramp (not pure `#000`/flat gray)

## Layout
- [ ] The page has one obvious focal point
- [ ] Not everything is centered; text-heavy content is left-aligned
- [ ] Cards vary in weight/size where it matters (no endless equal 3-col grid)
- [ ] Deliberate asymmetry / active whitespace, not mirror symmetry
- [ ] Hero has a real idea (not centered headline + two pills + gradient blob)

## Typography
- [ ] Clear size hierarchy; the primary element is unmistakably largest
- [ ] Line-height and tracking tuned per role (tight display, relaxed body)
- [ ] Body line length ~45–75ch
- [ ] Typeface/scale has intent (not unstyled system default with flat sizes)

## Icons
- [ ] Icons used only where they aid scanning — not on every heading
- [ ] One coherent, non-generic icon set at a consistent weight
- [ ] Primary actions use icon **+ label**, not icon-only
- [ ] Decorative icons are `aria-hidden`; icon-only controls have a label

## Copy
- [ ] No emoji-prefixed headings
- [ ] No "elevate / unlock / seamless / supercharge" filler — value is concrete
- [ ] Exclamation marks near zero
- [ ] Claims are specific and definite (no vague hedging)

## Spacing
- [ ] Intentional density variation (related content grouped tighter)
- [ ] Consistent spacing scale / vertical rhythm (not `p-4` on everything)

## Overall
- [ ] A designer would recognize deliberate choices, not defaults
- [ ] Chosen values (brand color, type scale, spacing) are promoted to `design-tokens-system`
- [ ] Still passes contrast / `web-accessibility-a11y` after the opinionated changes
