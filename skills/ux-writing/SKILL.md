---
name: ux-writing
description: Write or review interface copy — button labels, error messages, empty states, confirmations, helper text, loading and status messages — so it says what happens, matches what the code actually does, and still reads right when heard through a screen reader or translated. Use when the user says "write the copy for", "what should this button say", "review this error message", "fix the microcopy", or "copy review". For copy that reads as machine-generated (filler value-props, emoji headings), use anti-ai-design-patterns instead.
---

# UX writing

Interface copy is read three ways, and only one of them is the screen:

1. **Seen** — the rendered text.
2. **Heard** — the accessible name and description a screen reader builds, which
   includes text you never see and drops text it hides.
3. **Translated** — the same meaning in a language with different word order and
   up to 30–40% more length.

A string that works seen and fails the other two is not finished.

Idea adapted from the `ux-writing` skill in
[plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills)
(MIT, read at `f823ace`). What is marked *measured* below happened in this
repository.

## 1. Copy must match the behaviour

The most expensive copy bug is a true-sounding sentence about something the code
does not do. Find them by using the page, not by reading the strings. Measured
2026-11-13 on this repository's registration pages:

- A password checklist listed **four** rules; the validator enforced **one**
  (`aaaaaaaa` submitted). Either enforce what the list promises or call it
  guidance ("For a stronger password").
- "Fields are required unless noted." — every field was required and nothing was
  noted. A sentence describing an exception that does not exist is noise.
- "Please fix the highlighted fields." stayed on screen after every field was
  fixed, with nothing highlighted. A message is a claim about the current state;
  re-evaluate it when the state changes.

## 2. Read it as it is heard

"Reads naturally aloud" is checkable: read the **accessible name and
description** out of the browser's accessibility tree, not the source. Measured:
icon-font ligatures were part of every name — buttons read "**login Google**",
an error read "**error Enter your name.**", the password field was described as
"**radio_button_unchecked 8+ characters…**". Nothing in the source text was
wrong; the copy as heard was. Hide decorative glyphs, and when a glyph carried
meaning (met / not met), give that meaning back as text.

## 3. The formulas

- **Buttons** — a verb, then the outcome: "Create account", not "Submit".
- **Confirmations** — the title asks, the button answers in the same words:
  "Delete project?" → **Delete project**. Never "OK" or "Yes". Cancel stays
  "Cancel". State the count and the consequence: "Remove 12 contacts? This can't
  be undone."
- **Errors** — what happened → why, if it is not obvious → how to fix it. A
  field error sits next to its field and is tied to it (`aria-describedby`); a
  **summary** names which fields, so a person who cannot see the red can still
  find them.
- **Empty states** — what goes here and why it is useful → the first action.
  First-use empty guides; cleared empty reassures. Never a bare "No data".
- **Loading** — say what is happening: "Creating account…", not "Please wait".
- **Status glyphs at rest** — a lone "—" next to an empty meter reads as a stray
  mark. Show nothing until there is something to say.

Higher stress, plainer words: no humour in errors, payments or destructive
actions.

## 4. Write for translation

- **Never build a sentence by concatenation.**
  `'We sent a verification link to ' + email + '.'` fixes the English word order
  into code, and a translator cannot move the email. Use one string with a
  placeholder: `"We sent a verification link to {email}."`
- One idea per sentence; no idioms; no stacked nouns.
- Length grows — **design-to-code-workflow** → `references/states-and-gaps.md`
  has the allowance; never size a container to English.

## 5. Mechanics

Sentence case everywhere; no ALL CAPS for emphasis. Numerals for numbers.
Contractions are fine. At most one exclamation mark per screen. "You" for the
person, "we" for the product when it is at fault — never blame the person.
A placeholder is not a label: the `a11y` gate in this repository fails a field
whose only name is its placeholder. No direction- or colour-only instructions
("the green button on the right").

## Output

A table, one row per string: **where** (file:line or element) · **now** ·
**proposed** · **why** (which rule above). Then, separately, every place where
the copy and the behaviour disagree — those are bugs to route to the code, not
wording to polish.

## Next steps

- Copy that reads as AI-generated: **anti-ai-design-patterns**
- Error identification and suggestion as conformance (WCAG 3.3.1, 3.3.3):
  **web-accessibility-a11y**
- A verdict on the whole screen, copy included: **fresh-eyes-critique**
