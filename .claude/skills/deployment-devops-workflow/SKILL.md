---
name: deployment-devops-workflow
description: Set up build, CI/CD, preview deploys, quality gates, and hosting for frontend apps (React, Astro, Vue). Use when the user says "set up ci/cd", "deploy this", "github actions", "preview deploys", "build pipeline", "hosting setup", or "release process".
---

# Deployment & DevOps Workflow

Get a frontend from commit to production reliably: a reproducible build, quality gates that block regressions, preview deploys for review, and one-action rollback.

## When to use this skill

- Setting up CI/CD for a React/Astro/Vue app
- Configuring preview/PR deployments and production releases
- Adding quality gates to the pipeline

## Pipeline stages

```
commit → install → build → quality gates → preview deploy (PR) → merge → production → post-deploy
```

1. **Install** — reproducible from the lockfile (`npm ci`), dependencies cached.
2. **Build** — typecheck + production build; fail on type errors.
3. **Quality gates** — lint, unit/component tests, `qa-testing-visual-regression`,
   `web-accessibility-a11y`, and a bundle-size budget from `web-performance-optimization`.
   Any regression **fails the build**.
4. **Preview deploy** — every PR gets a unique URL (Netlify/Vercel/Cloudflare Pages) for review.
5. **Production release** — deploy on merge to main.
6. **Post-deploy** — smoke check, monitor Core Web Vitals + errors; rollback is one action away.

A sample GitHub Actions workflow, hosting configs, and a rollback note are in
`references/ci-cd.md`.

### Keep the runner current

A pipeline rots quietly: it keeps passing green on a runtime that stopped getting security
patches. Two things to re-check when you touch CI — nothing warns you about either:

- **Node** — build on a version in **Active LTS**. Even-numbered releases get ~3 years;
  check the [release schedule](https://nodejs.org/en/about/eol) rather than trusting the
  number already in the file. Node 20 went EOL 2026-04-30.
- **Actions** — pin the **major** (`actions/checkout@v7`), which still takes security
  patches within that major. An unmaintained major eventually loses runner support.

Apply the same version to *every* workflow in the repo. Pipelines added at different times
drift apart, and the oldest one is the one nobody re-reads.

## Quality gates = definition of done

The gate list is what keeps `main` shippable. Nothing merges that:
- fails typecheck, lint, or tests,
- introduces a visual regression (unreviewed),
- drops accessibility conformance,
- or blows the bundle budget.

Run these in CI, not just locally — local runs get skipped under deadline pressure.

## CI jobs are deliberately unequal — put a check where its cost is already paid

A pipeline usually has jobs with very different equipment: one that runs plain
Node with no install, one that installs a single tool, one that runs the full
`npm ci` and a browser. That is a feature — the cheap jobs stay fast. It is also
a trap, because a check added to the wrong job fails for a reason that has
nothing to do with the code it checks.

Two red builds on `main` in one day, same shape both times:

- **A check that needed a compiler was added to the no-install job.** It created a
  temp directory inside `node_modules` — which does not exist on a bare checkout —
  and threw `ENOENT` before reading a single file. The workflow already carried a
  comment saying which job owned compiler-dependent checks, right beside that job.
- **A harness was shipped failing because it was not in the aggregate script.**
  "Not in `npm run check`" was read as "not gated". It was a CI step of its own.

Two habits that would have caught both:

```
□ before adding work to a check, read the WORKFLOW STEP that runs it —
  not the npm script name, and not the script's own header
□ prove it on a bare checkout: copy only what that job gets into an empty
  directory and run it there. It takes a minute and separates "it works"
  from "it works anywhere"
```

The aggregate script is not the list of what must be green. Grep the workflow for
every checker it invokes, and keep the aggregate honest about what it does NOT
cover — a script named `check` that is only part of the gate is a name that
misleads on exactly the day it matters.

## A script CI never runs has never been tested

Fixing a gate that had been reading stale generated images meant moving thumbnail
generation into the gallery's own build — which made CI execute
`scripts/build-thumbs.mjs` **for the first time ever**. It died on line 35:

```
ERR_MODULE_NOT_FOUND
file:///Users/<user>/.nvm/versions/node/v24.15.0/lib/node_modules/
  @playwright/cli/node_modules/playwright/index.mjs
```

An absolute path into one laptop's nvm directory, committed, in a script that
produces a user-facing asset. It could never have worked on a second machine, on
a runner, or for anyone else. Nothing noticed because that script only ran from a
local publish command that CI does not run.

The same 200-line file had a second one waiting behind it:

```js
execFileSync('python3', ['-c', 'from PIL import Image ...'])
```

Pillow declared in no manifest anywhere, and present on that machine. Two
undeclared dependencies — one npm, one system — invisible for the same reason.

The repo already had the answer, too: `scripts/lib/harness.mjs` exports
`launch()`, which tries the chrome channel, then the two usual install paths,
then chromium, and reports everything it tried. **Nine gates already used it.**
This script imported a string instead.

```
□ every committed script is in the CI path, or is marked unverified in the file
  itself — "it works locally" about a script CI cannot reach is a statement
  about one filesystem
□ grep committed scripts for `/Users/`, `/home/` and `C:\` — one line in a lint
  step, and it would have caught this the day it was written
□ an undeclared SYSTEM dependency (`python3 -c "import ..."`, `convert`,
  `ffmpeg`) is the same class of fault as a hard-coded path, and hides better
```

**If a tool is already running in-process, prefer it over adding either** — here
a browser was open two lines above, with its own image encoder. Then **verify
what a fallback-capable API actually produced**: `canvas.toDataURL('image/webp')`
silently falls back to PNG when it will not encode the requested type, and a PNG
sitting in a `.webp` renders perfectly while tripling the page weight. Assert the
prefix.

## Build order is a dependency — encode it, never sort into it

The root cause of that same red build:

```js
const pages = readdirSync(ROOT, ...)
  .filter(...)
  .sort();          // ← alphabetical
```

`gallery` is not a peer of the other pages, it is **derived** from them: every
card carries a screenshot and the measured height of another page. Alphabetically
it sorted **first** — ahead of all four pages it consumes.

The publish command happened to spell the correct order out by hand
(`verify && thumbs && build gallery && …`) while the check command did not. So
the two disagreed for as long as the gallery had existed, and the one that was
right was the one CI never ran.

- **When one build output is another build's input, encode it** — sort the
  dependent last, or give it a `prebuild` that produces what it consumes. Never
  leave it to alphabetical order, folder order, or `readdir` order.
- **Two commands that build the same thing in different orders is the bug**, even
  while both appear to work. Collapse them so there is one order.
- The fix here was both: `verify.mjs` sorts `gallery` last, and the gallery's own
  `prebuild` generates the thumbnails. Cost: **47s added to every check run**,
  which is the honest price of that page being gated at all.

## Hosting notes

- **Astro** — static output (any static/edge host) or an SSR adapter (Node/edge) when you need server rendering; both deploy cleanly to Vercel/Netlify/Cloudflare.
- **React/Vue SPA** — static host **with SPA fallback routing** (rewrite all paths to `index.html`); or SSR/edge if the app needs server rendering.
- **Set caching right** — long-cache hashed assets (`immutable`), short/no-cache HTML.

## Green on `main` is not published

A direct-upload host deploys nothing on a push. Nothing is broken, nothing is
red, and the pipeline is doing exactly what it was configured to do — which is
gate, not publish.

Measured: a live site ran **four days and seventeen commits behind** while every
commit on `main` was green. It was still serving 11.5MB of unoptimised images
that had been replaced, and still scrolling sideways in a band nobody had
measured, because none of the work that fixed those had ever left the repo.

Two things to settle explicitly, and to write down where a reader will find
them:

- **What publishes, and when.** If the answer is "a person runs a command",
  that is a legitimate answer — but it has to be an answer, not an assumption.
- **How staleness becomes visible.** Print the build date and the commit of any
  sibling dependency into the page itself, in a footer or a meta tag. Then the
  live site can be asked how old it is instead of being trusted.

**Order the deploy command so the gates cannot be skipped:**

```sh
npm run check && npm run build && npm run upload   # one command, one order
```

Three separate commands invite the day someone runs the third alone.

## CI for a repo that depends on a sibling by path needs BOTH repos installed

Two checkouts, laid out at the depth the path dependency expects, is the obvious
half. The half that fails on the first run is the other one: **the sibling needs
its own `npm ci` too.**

Its `tsconfig.json` extends a config from ITS `node_modules`, and its stylesheet
does `@import "tailwindcss"` resolved from ITS folder. Without the install, the
build dies with `Failed to load tsconfig` naming a file the repo you are
building does not contain — an error that points at the wrong repo entirely.

It is invisible on a developer's machine, where the sibling is a working copy
with its dependencies already there. That is precisely the class of fault worth
simulating locally before pushing: two directories at the runner's layout,
`npm ci` in each, run the gate.

## Principles

- **Reproducible builds** — commit the lockfile; pin tool versions.
- **Fast feedback** — cache dependencies, parallelize jobs, keep PR checks quick.
- **Gate what matters in CI** — the pipeline is the enforcement point.
- **Rollback is one action** — keep the previous deploy instantly restorable.
- **Secrets in the platform**, never in the repo.

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| `npm install` in CI | Use `npm ci` for reproducible installs from the lockfile |
| Gates only run locally | Move them into CI; block merge on failure |
| SPA 404s on deep links | Configure SPA fallback rewrite to `index.html` |
| Secrets committed to repo | Use the host's encrypted env/secret store |
| No rollback plan | Use a host with instant rollback; keep prior build |

## Next steps

- Wire **qa-testing-visual-regression** and **web-accessibility-a11y** as gates
- Enforce budgets from **web-performance-optimization**
- Track production vitals continuously (feeds back into performance work)
