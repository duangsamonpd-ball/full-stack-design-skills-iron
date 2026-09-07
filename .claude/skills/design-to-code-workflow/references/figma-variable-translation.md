# Figma variable names are not token names

A design tool's Dev Mode emits **its own** variable vocabulary. A design system defines a
different one. Nothing translates between them automatically, and the gap does not announce
itself. Loaded on demand by the `design-to-code-workflow` skill.

---

## Why this is silent rather than loud

```css
font-size: var(--size-3xl, 30px);
```

If `--size-3xl` is defined nowhere, this is not an error. CSS takes the fallback, the text renders
at 30px, the page looks exactly right, and every gate stays green. What it has lost is the
connection: **the page can no longer follow the design system.** When the token moves upstream,
this page stays where it is, silently, forever.

A `var()` with no fallback fails visibly and gets fixed the same day. A `var()` *with* a fallback
is the one that survives review, which is why it is the case worth guarding against.

Measured on one production template — a product landing page assembled by pasting from Dev Mode:
**60 `var()` declarations carrying fallbacks, and not one of those names is defined anywhere in
the repository.** Fifteen of its sixteen fallback colours are exact design-system values. The
values were right. Only the wiring was missing, and the page has been unable to track the system
since the day it was pasted.

Nobody was careless. Pasting is the easiest path until a translation exists.

---

## The rule

**Never paste a `var()` you have not resolved.** For every custom property that arrives from a
design tool, do one of three things:

1. **Translate it** to the design system's name for the same role.
2. **Propose a token** if the role is real and the system has no name for it — that belongs to
   `design-tokens-system`, not to an inline guess.
3. **Say it does not map**, and use a literal with a comment explaining why, so the next reader
   knows it was a decision.

Resolving a name means confirming it is *defined*, not that it looks plausible. Grep the theme.

## Building the mapping

Do it once per design system, not once per page, and map **by role** rather than by value. Two
tokens can carry the same hex and mean different things — a heading colour and a body colour that
happen to agree today will diverge the moment somebody adjusts one.

The shape of the gap is usually one of four:

| shape | example | what to do |
|---|---|---|
| same concept, different prefix | `--size-3xl` → `--text-3xl` | mechanical rename |
| same concept, expanded name | `--weight-extrabold` → `--font-weight-extrabold` | mechanical rename |
| tool's semantic name, system's semantic name | `--text-default-heading` → `--color-text-dark-heading` | map by role, and check the role |
| raw design-file name | `--Orange`, `--surface-Card`, `--Soft-Purple` | never valid — these are layer and style names that escaped into code |

The fourth row is the one to refuse outright. A capitalised or space-derived name is a sign the
value came out of the design file's own naming rather than out of a variable that was ever meant
to be consumed.

## Families that agree by construction

Where a design system deliberately mirrors the tool's scales, some families need no translation at
all — commonly leading, tracking and radius (`--leading-*`, `--tracking-*`, `--rounded-*`).

**Those are the exception, and knowing which ones agree is a property of your system, not a
general fact.** Check before assuming; an untranslated name that happens to be correct and an
untranslated name that is silently wrong look identical in the source.

## Translation is necessary, not sufficient

The name also has to resolve in the *target*. A correctly translated `var(--iron-violet-900)`
still falls back to nothing if the target repository never imports the theme that defines it — so
a page can be perfectly translated and still untracked. Confirm the theme is actually imported
where the page will render, not merely that the name is spelled the way the system spells it.
