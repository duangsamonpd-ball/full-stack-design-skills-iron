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

## Quality gates = definition of done

The gate list is what keeps `main` shippable. Nothing merges that:
- fails typecheck, lint, or tests,
- introduces a visual regression (unreviewed),
- drops accessibility conformance,
- or blows the bundle budget.

Run these in CI, not just locally — local runs get skipped under deadline pressure.

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
