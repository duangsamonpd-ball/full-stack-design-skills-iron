# Cognitive accessibility (COGA)

On-demand depth for `inclusive-design-patterns`. Cognitive, learning, and neurological
differences (memory, attention, language, executive function) affect **more users than any
other disability group**, yet WCAG covers them the least. This condenses the W3C guidance
*Making Content Usable for People with Cognitive and Learning Disabilities* into buildable
patterns. It complements WCAG conformance (`web-accessibility-a11y`) — most of this is *design*,
not a pass/fail criterion.

## The 8 objectives → what to build

### 1. Help users understand what things are and how to use them
- Familiar, conventional controls and icons; don't reinvent a date picker or a menu.
- Buttons look clickable; links look like links; state (selected/expanded) is obvious.
- Label icon-only controls with text (or a visible tooltip), not icon alone.

### 2. Help users find what they need
- Clear, stable navigation in the same place on every page; a visible "you are here".
- Descriptive page titles and headings; a search option for longer sites.

### 3. Use clear content
- **Plain language**: short sentences, common words, active voice, one idea per sentence.
- Front-load the point; break walls of text with headings and lists.
- Explain or avoid jargon, acronyms, and idioms; support literal readers.

### 4. Help users avoid and correct mistakes
- **Prevent** errors: constrain inputs, show format inline (`MM/YYYY`), confirm destructive actions.
- Clear, specific, kind error messages next to the field — say how to fix, not just "invalid".
- Never lose entered data on error; allow undo; let users check before submitting.

### 5. Help users focus
- **One primary action per screen**; defer secondary paths (progressive disclosure).
- No unexpected motion, autoplay, or content that shifts; minimise distractions near the task.
- Respect `prefers-reduced-motion`.

### 6. Don't rely on memory
- Don't make users remember info across steps — carry it forward, show a summary.
- Allow copy/paste and password managers (WCAG 2.2 **3.3.8 Accessible Authentication**); offer
  "email me a link" over codes to transcribe.
- Keep instructions visible while they're needed, not shown once then gone.

### 7. Provide help and support
- Human-reachable help in a consistent place (WCAG 2.2 **3.2.6 Consistent Help**).
- Contextual hints; examples of correct input; a way to recover a stuck flow.

### 8. Support personalization & adaptation
- Don't fight the user's settings — honor zoom, text scaling, `rem` sizing, dark mode, reduced motion.
- Don't disable browser features (zoom, translate, autofill) or block paste.

## Long-task rules

- **Manageable steps** — break long forms into short, labelled steps with progress shown.
- **No time pressure** — no timeouts on cognitive tasks, or make them easily extendable (WCAG 2.2.1).
- **Redundant Entry** (WCAG 2.2 **3.3.7**) — never re-ask what was already given in the flow.

## Fast wins checklist

```
□ One clear primary action per screen
□ Plain language; headings + lists, not walls of text
□ Inline format hints + specific, kind error messages
□ No data loss on error; undo available; review-before-submit
□ Paste allowed, password managers work, no un-pasteable codes
□ Info carried across steps (no memorising); instructions stay visible
□ Consistent nav + help placement; honor zoom / reduced-motion / text scaling
```

Where these become measurable, they map to WCAG 2.2 (3.3.7, 3.3.8, 3.2.6, 2.2.1, 3.3.1–3.3.3) —
verify those in `web-accessibility-a11y`. The 7-principle framing is in `references/universal-design-principles.md`.
