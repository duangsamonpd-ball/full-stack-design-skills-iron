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

# or point it at an installed set (symlinks are followed)
node skills-lint.mjs ~/.claude/skills
```

With no argument it lints this repo's `.claude/skills`. Passing a directory checks a
set as Claude actually loads it — useful when skills are symlinked into `~/.claude/skills`
from a clone, or when a hand-installed skill lands there without frontmatter.

Exit code is non-zero on any real problem, so it gates CI — see
`.github/workflows/skills-lint.yml`. Re-run after renaming a skill folder, editing a
`description`, or adding/moving a `references/` file.

## Maintenance drift check

`check-drift.mjs` is the radar for keeping this package current (see the `maintenance-cadence`
memory). Two halves, on different clocks:

```bash
cd scripts
npm run drift            # both halves
npm run drift:gates      # local, instant — are the three gates green?
npm run drift:versions   # network — are pinned deps behind npm's latest?
```

`--gates` runs `skills-lint`, `build-css --check` and `a11y-audit` and reports pass/fail
without a network call; `--versions` compares the tracked deps (tailwindcss, astro, jsdom, …)
to what npm publishes and flags majors. It always exits 0 — it reports, CI is where red fails.

`--hook` emits a SessionStart JSON envelope (gates only) for a Claude Code hook. Wire it up
per machine in `.claude/settings.local.json` (gitignored) so a session opens already knowing
the gate status:

```json
{ "hooks": { "SessionStart": [ { "hooks": [
  { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/scripts/check-drift.mjs\" --hook", "timeout": 15 }
] } ] } }
```

Version drift benefits from running on the world's clock, not yours — a scheduled agent or a
periodic `npm run drift:versions` catches a release the day it lands.

## Example-page stylesheets

`build-css.mjs` compiles each root example page's Tailwind source — `styles/<page>.css`,
holding that page's primitives, `@theme` layer and component classes — into
`assets/<page>.css`, which the page loads with a plain `<link>`. No CDN, nothing compiled
in the browser.

```bash
cd scripts
npm run build-css         # write assets/*.css
npm run build-css:check   # exit 1 if any committed file is stale (CI gate)
```

The generated CSS is **committed** so the examples still open with zero setup; the `--check`
gate is what makes that safe, and is the same stale-output pattern
`design-systems-architecture` → `references/token-pipeline.md` prescribes. Edit
`styles/<page>.css` and rebuild — never hand-edit `assets/`.

Note the input files use the canonical `@import "tailwindcss"`, so the script links
`styles/node_modules` → `scripts/node_modules` (gitignored) to make that resolve.

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

**7 pages, not 6.** Six are `.html` files at the repo root; the seventh is the Astro
example, which only exists once it's built. It used to be skipped silently when absent —
so CI, which never built it, quietly audited one page fewer than a local run and left the
Astro output ungated. The audit now **fails** with the build command instead of dropping
the page. Build it first:

```bash
cd astro-registration-m3 && npm ci && npm run build
```

Exit code is non-zero if any real **FAIL** is found, so it works as a CI gate — see
`.github/workflows/a11y.yml`. It supports the `web-accessibility-a11y`,
`qa-testing-visual-regression`, and `deployment-devops-workflow` skills (a11y as a
definition-of-done gate).

> Note: multiple `<h1>` is reported as a **WARN**, not a fail — the registration examples
> hold two views (form + success) in one document, and the inactive one is `display:none`,
> so a screen reader only ever encounters one `<h1>`.
