---
name: figma-astro-init
description: Establish the generator's memory in a target Astro repository — discover where its conventions are defined, write MAP.md, and capture the first fingerprint. Run once per repository, or again after a restructure. Use when the user says "set up figma-astro here", "initialise the generator memory", "write MAP.md", "fingerprint this repo", or is pointing the generator at a codebase for the first time.
---

# Initialising the generator's memory

What `/init` is to `CLAUDE.md`, this is to `docs/web-devs/figma-to-astro/`.

**What it produces**: a `MAP.md` whose rows say *how to derive* each convention and *which file in
this repository holds it*, plus a first `fingerprint.json`. **It does not record convention values**
— those are read fresh at generation time, because a written-down derivable fact is the one thing
nothing checks.

---

## 1 · The split this skill exists to maintain

| generic — ships with this plugin | repo-specific — discovered here |
|---|---|
| *the questions*: "where does page content go?", "is this read page-scoped or shared?" | *the pointers*: which file answers each question in **this** repository |

So `MAP.md` is not derived from nothing. It is the question list, resolved against a real tree.

---

## 2 · Procedure

### Step 1 — confirm the target

Establish you are in an Astro repository with a content layer, and **report what you find rather
than assuming the shape**:

- `astro.config.mjs` at the root; Astro's major version
- a component tree, a route tree, a layout
- a content tree, if there is one, and whether it is locale-partitioned

If the repository does not have a recognisable shape, **stop and say so.** A memory initialised
against a guess is worse than none.

### Step 2 — resolve each question to a file

Work the question list, and for each record **where the answer lives**, never the answer:

| question | look for |
|---|---|
| how a route reaches a page | route files under `pages/`; whether any declare their own path list, and whether locale twins exist |
| what the layout expects | the layout's `Astro.props` destructure |
| where page content lives | the content tree; the naming shape of sibling files |
| what is chrome vs page content | a shared-directory list, if the repo has an l10n policy module |
| where a localized list must not inherit | an overlay-guard list, if one exists |
| what structured-data types exist | the page-type union, if there is one |
| what can verify generated work | the `check:*` scripts in `package.json` |
| what the colour vocabulary is | a `@theme` block **and** any semantic class layer — search for both shapes; a search for one will miss the other |

**Record absences explicitly.** If the repository has no l10n policy module, that row says so. The
generator must know a thing is absent rather than assume it exists and silently derive nothing.

### Step 3 — write `MAP.md`

Two columns: *question* and *derive it from*. Every row points at a file or a measurement.

Refuse to write a row that states an answer. "Components are `snake_case`" is a value and will go
stale; "the modal filename shape among `.astro` siblings in that directory" is a method and will
not. If you cannot phrase a row as a method, leave it out and note why.

Close with the standing rule: **when a skill disagrees with the codebase, the codebase wins.**

### Step 4 — capture the fingerprint

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/fingerprint.mjs" --root=. \
  > docs/web-devs/figma-to-astro/fingerprint.json
```

Then **check it captured something**:

```sh
node "${CLAUDE_PLUGIN_ROOT}/scripts/fingerprint.mjs" --self-test
```

A surface that captured empty means its source moved or does not exist here. Fix the surface or
remove it — an empty surface reports a stable codebase forever, which is the same shape as good news.

### Step 5 — write `README.md`, and seed nothing

Copy the contract. **Do not invent notes.** An initialised memory has zero notes unless a person
supplied a decision, in which case write it as `kind: decision` with `by:` naming them.

Everything learned by *reading* the codebase during this run belongs in `MAP.md`, not in `notes/`.
That distinction is the whole design and this is where it is most tempting to break.

---

## 3 · Finishing

Report:

- what was found, and what was **absent**
- which fingerprint surfaces captured, and any that did not
- the `MAP.md` rows written, and any question you could not resolve to a file

Then stop. Do not generate a page in the same run — init is establishing what is true, and mixing it
with work that depends on what is true makes both harder to trust.

---

## 4 · Re-running

Safe to re-run after a restructure. It rewrites `MAP.md` and the fingerprint; **it never touches
`notes/`**. If a note has been made stale by the restructure, `check-notes.mjs` will say so on its
next run — that is its job, not this skill's.
