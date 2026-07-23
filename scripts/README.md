# Repo checks

## Skills lint

`skills-lint.mjs` statically checks that every skill under `.claude/skills/*` is
wired correctly — the plumbing a skill needs to load and trigger at all:

- the `name:` in the frontmatter **equals the folder name** (and is a valid slug)
- a `--- … ---` frontmatter block with a non-empty `description:` (what auto-selects it)
- every `references/…md` the SKILL.md points at **exists** — including the
  cross-skill pointers (`<other-skill> → references/x.md`) this package uses

Reference files on disk that no SKILL.md links, and over-long / trigger-phrase-less
descriptions, are reported as **warnings** (not failures).

```bash
cd scripts
npm run skills-lint   # no install needed — zero dependencies
```

Exit code is non-zero on any real problem, so it gates CI — see
`.github/workflows/skills-lint.yml`. Re-run after renaming a skill folder, editing a
`description`, or adding/moving a `references/` file.

## Accessibility-tree audit

`a11y-audit.mjs` statically audits the **accessibility tree** of every HTML example — the
semantics a screen reader actually consumes:

- `<html lang>`, a `<main>` landmark, sane heading structure
- **accessible name** on every button / link / tab / switch
- a real **programmatic label** on every form field (not a placeholder)
- `aria-labelledby` / `aria-describedby` / `aria-controls` all resolve to a real id
- no duplicate ids

It does **not** check colour-contrast or produce speech — those need a real browser and
VoiceOver / NVDA. This is the automatable slice that catches the most common regressions.

```bash
cd scripts
npm ci            # or: npm install
npm run a11y      # audits all repo HTML; add paths to audit specific files
```

Exit code is non-zero if any real **FAIL** is found, so it works as a CI gate — see
`.github/workflows/a11y.yml`. It supports the `web-accessibility-a11y`,
`qa-testing-visual-regression`, and `deployment-devops-workflow` skills (a11y as a
definition-of-done gate).

> Note: multiple `<h1>` is reported as a **WARN**, not a fail — the registration examples
> hold two views (form + success) in one document, and the inactive one is `display:none`,
> so a screen reader only ever encounters one `<h1>`.
