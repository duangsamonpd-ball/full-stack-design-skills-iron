---
name: figma-astro-note
description: Record what generating a page into the target codebase cost, as a note in the generator's memory. Use after a generation hit a conflict, required rework, or was corrected by a person — and only then.
---

# Writing a generator note

The generator's memory lives in the **target repository**, not in this plugin:
`docs/web-devs/figma-to-astro/notes/`. Its `README.md` is the contract; read it before writing.

This skill is the **write path**. Without it the memory is a document that nothing updates, which is
the failure this whole design exists to avoid.

---

## 1 · The gate — most events are not notes

Write a note only when **all three** hold:

1. **It cost something.** A rework, a failed generation, a correction, a wrong assumption that
   shipped. Surprise alone is not cost.
2. **It is not derivable.** If a reader could have learned it by inspecting the codebase, it belongs
   in `MAP.md` as a derivation row, or it is already covered by the fingerprint. **This is the
   condition that fails most often** — check it hardest.
3. **It will recur.** A one-off slip is not a note. Ask: would the next generation into this
   repository hit this again?

If any fails, do not write a note. Say what you did instead — updated a `MAP.md` row, re-baselined
the fingerprint, or nothing.

> **The directory's value is inversely proportional to its size.** Two good notes beat twenty. The
> memory shipped with exactly two seeds on purpose, to set that bar.

### Worked rejections

| event | why it is not a note |
|---|---|
| "Components here are `snake_case`, not PascalCase" | derivable — a `MAP.md` derivation row |
| "The fingerprint moved: a new `check:*` script appeared" | derivable, and nothing broke — re-baseline |
| "I mistyped an import" | did not recur, cost nothing structural |
| "There are 620 components" | a count; derivable; and nothing checks a written-down count |

---

## 2 · Choosing the kind

| the note states | kind | must carry |
|---|---|---|
| what a person decided | `decision` | `by:` |
| a person correcting the generator | `correction` | `by:` |
| a condition in the codebase that blocked or forced rework | `conflict` | `verify:` |
| a surface moved underneath the generator and it cost something | `drift` | `verify:` |

A position is retired by another person; a fact is retired by a command. Getting this wrong is
caught — `check-notes.mjs` reports a `decision` with no `by`, or a `conflict` with no `verify`, as
**malformed**.

---

## 3 · Constructing `verify` — and proving it before you commit it

`verify` is a shell command whose **failure means the note still applies**.

```
exit non-zero  → the condition is still present  → note is ACTIVE
exit zero      → the condition is gone           → note is STALE, supersede it
```

**Run it before writing the note. It must fail.** A `verify` that already passes means you have
described the condition wrongly — you are recording something that is not true right now, and the
note will be reported stale the moment anyone checks.

This is the same discipline the target repositories already hold themselves to: *prove the
instrument is aimed correctly before you trust what it reports.*

Prefer a command that is cheap, has no build dependency, and reads source rather than output:

```sh
# good — fails while any render template still passes the superseded prop
! git grep -qE '<Layout[^>]*(meta=|structuredData=)' -- src/render

# bad — needs a full build, so nobody will run it
npm run build && node scripts/check-something.mjs
```

---

## 4 · Writing it

1. **Next id** — highest existing `notes/NNNN-*.md` plus one, zero-padded to four.
2. **Filename** — `NNNN-kebab-slug.md`, the slug naming the condition, not the page you were building.
3. **Frontmatter** — per the `README.md` schema. Include `supersedes:` if it replaces an earlier note.
4. **Body** — in the house style both target repositories already use:
   - what happened, in one or two sentences
   - **what it cost**, with a number where one exists — this is what makes a reader stop
   - what to do instead, when generating
   - why it could not have been derived
5. **Verify the checker accepts it**:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/check-notes.mjs"
```

Your new note must appear as **active** (for `conflict`/`drift`) or **exempt** (for
`decision`/`correction`). If it appears as **stale** or **malformed**, fix it rather than shipping it.

---

## 5 · Superseding rather than deleting

When a `verify` starts passing, the condition is gone — but the *lesson* may outlive it. Prefer:

- set `status: superseded` on the old note, leaving it in place
- write a shorter successor carrying `supersedes: NNNN`, if the guidance still matters

Delete only a note that was **wrong**, and say so in the commit message. A note that was right and
is now finished is part of the record of how this codebase behaved.

---

## 6 · What this skill does not do

It does not re-baseline the fingerprint. That is deliberate and manual: a change announced once and
then auto-accepted is a change nobody saw. Re-baselining happens after a person has looked.

It does not write to `MAP.md`. If the lesson is a derivation, edit `MAP.md` — and then you are not
writing a note at all.
