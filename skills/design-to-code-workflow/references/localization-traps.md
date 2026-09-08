# Localization traps — what a translated page does that an English one never shows

Four properties of an overlay-based localization layer that are invisible until somebody reads
the page in another language. Each one has already cost a real codebase real time. Loaded on
demand by the `design-to-code-workflow` skill, alongside the content-slice rule in its main body.

An **overlay layer** is the common shape: a base document in the source language, and per-locale
documents that override it key by key, with anything absent falling back. Everything below is a
consequence of that shape, so it holds wherever the shape does — the function names are one
codebase's, the properties are not.

---

## 1 · Page scope and shared scope are not interchangeable

A page-scoped read is allowed to make a judgement about the page: that it is being served in the
source language, or that a locale should be suppressed. A read of **shared** content — a footer, a
nav, a banner used everywhere — is not, because its content root is not this page's.

Use the shared reader for shared content. Get it wrong and the failure is not local: **one missing
footer string strips a locale from every page that renders the footer.** The page you were working
on looks fine, which is why this is found late and by somebody else.

```
content root is this page's        → the page-scoped reader
content root is anywhere else      → the shared reader (readSharedJson() and its equivalents)
```

The test is not "is this component shared" — it is "whose content root does it read from".

## 2 · A localized listing must not inherit the entries it does not have

Key-by-key overlay means a list of six in the source language and four in a locale merges to
**six**, with two of them in the wrong language, looking entirely deliberate. Codebases that have
met this carry a guard: the localized list replaces rather than merges.

**If a generated page introduces a new listing, say so rather than adding a guard quietly.**
Whether that listing needs the guard is a decision about the content, and the person who owns the
translation pipeline is the one who should take it. A guard added in silence is indistinguishable
from a guard nobody thought about.

## 3 · A localized scalar always wins — including the falsy ones

`""`, `0`, `false` and `null` are values, not absences. An overlay carrying an empty string does
not fall back to the source language; it renders empty, permanently, in that locale only.

**So never emit an empty string as a placeholder.** Not in the content slice, not as a
"fill this in later", not to keep a shape symmetrical. Leave the key out entirely — an absent key
falls back and is visible to every count; an empty string is a permanent blank that no tool reports
and no reviewer of the source language will ever see.

```jsonc
// wrong — a permanent blank in this locale
{ "subheading": "" }

// right — falls back, and shows up as missing
{ }
```

## 4 · Prose gets fallback, not overlay

Markdown and long-form prose fall back whole, per document. They are not merged key by key,
because merging two prose documents by key is not a meaningful operation — half-translated prose
is worse than untranslated prose, and there is no key structure to merge along in the first place.

Practical consequence: a page whose body is prose is translated as a unit or not at all. Do not
design a content shape that assumes a paragraph can be overridden while its neighbours are not.

---

## What is deliberately not here

**The translator's exclusion rules.** Which keys a translation pass skips, and the shapes it
matches to decide, belong to whatever script is doing the pass — and those scripts get replaced.
Writing today's quirks down here would bake in behaviour that is already being fixed elsewhere,
and a reference that encodes a bug outlives the bug.
