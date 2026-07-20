# The 7 Principles of Universal Design — mapped to the web

On-demand depth for `inclusive-design-patterns`. The canonical **Universal Design** framework
(NC State Center for Universal Design, 1997) is 7 principles for designing for the widest range
of people *without* separate "accessible" versions. This maps each to concrete frontend practice
and to the skill that delivers it.

## Three terms, kept distinct

- **Universal Design** — the *philosophy*: one design that works for everyone (the 7 principles below).
- **Inclusive Design** — the *process*: design with and for excluded users, "solve for one, extend to many" (this skill).
- **Accessibility (WCAG 2.2 AA)** — the *measurable floor*: pass/fail conformance (`web-accessibility-a11y`).

Universal Design is the goal; inclusive design is how you get there; WCAG is the minimum you must clear on the way.

## The 7 principles → frontend

| # | Principle | What it means on the web | Delivered by |
|---|-----------|--------------------------|--------------|
| 1 | **Equitable use** | Same experience for all — no separate "accessible mode"; keyboard, pointer, touch, SR all reach the same features | `web-accessibility-a11y`, this skill |
| 2 | **Flexibility in use** | Honor user choice: `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`/`forced-colors`, `rem` text scaling, LTR/RTL | this skill (system prefs) |
| 3 | **Simple & intuitive** | Clear hierarchy, plain language, one primary action per screen, progressive disclosure — usable regardless of experience or focus | `design-fundamentals`, cognitive-load section here |
| 4 | **Perceptible information** | Never one sense only: pair color with text/icon, captions for audio, visible + programmatic labels, contrast ≥ 4.5:1 | `web-accessibility-a11y`, `design-tokens-system` (status = color **+** icon) |
| 5 | **Tolerance for error** | Forgiving forms: prevent errors, allow undo, no data loss, clear recovery, no time pressure; confirm destructive actions | this skill (forgiving forms), `web-accessibility-a11y` |
| 6 | **Low physical effort** | Minimize precise/ repeated motion: large hit areas, no drag-only, autofill, sensible tab order, no `hover`-only affordances | `responsive-universal-design`, WCAG 2.2 targets/drag |
| 7 | **Size & space for approach** | Targets ≥ 24×24 (44×44 touch) with spacing; layouts reflow to any viewport and survive 200% zoom | `responsive-universal-design` |

## Quick self-check (one question per principle)

1. Does everyone reach the *same* feature the same way — or is there a lesser path?
2. Have I honored what the user's OS/browser already told me (motion, theme, contrast, text size)?
3. Could a first-time, distracted, or stressed user complete the primary task without instructions?
4. Is every piece of information available through **at least two** senses/channels?
5. If the user makes a mistake, can they recover without losing work or starting over?
6. Can the whole flow be done with low precision — big targets, few steps, no drag, no hover?
7. Does every target have room, and does the layout hold from a 320px phone to 200% zoom?

A "no" is a Universal Design gap. Map it to the skill in the table and fix it there.

## Relationship to the rest

- WCAG conformance (`web-accessibility-a11y`) is the *floor* for principles 1, 4, 5, 6, 7 — clear it, then go further here.
- `responsive-universal-design` carries principles 6–7 (effort, size & space) at the layout level.
- `design-fundamentals` carries principle 3 (simple & intuitive) at the visual level.
