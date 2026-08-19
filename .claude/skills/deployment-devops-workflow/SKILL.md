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

## Hosting notes

- **Astro** — static output (any static/edge host) or an SSR adapter (Node/edge) when you need server rendering; both deploy cleanly to Vercel/Netlify/Cloudflare.
- **React/Vue SPA** — static host **with SPA fallback routing** (rewrite all paths to `index.html`); or SSR/edge if the app needs server rendering.
- **Set caching right** — long-cache hashed assets (`immutable`), short/no-cache HTML.

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
