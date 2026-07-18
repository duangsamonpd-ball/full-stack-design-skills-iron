# CI/CD — configs & recipes

Working pipeline pieces. Loaded on demand by the `deployment-devops-workflow` skill.

---

## GitHub Actions — build + gates + deploy

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push: { branches: [main] }
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci                       # reproducible install from lockfile
      - run: npm run typecheck            # tsc --noEmit
      - run: npm run lint
      - run: npm run test                 # vitest component/unit
      - run: npx playwright install --with-deps
      - run: npm run test:e2e             # playwright: e2e + visual (fails on diff)
      - run: npm run build                # production build
      - run: npx size-limit               # bundle budget (fails if over)

  # accessibility gate (example: axe over built pages / stories)
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci && npm run build
      - run: npm run test:a11y            # e.g. @axe-core/playwright assertions
```

Branch protection: require `build-and-test` + `a11y` to pass before merge.

---

## Preview deploys

Most static hosts do this automatically per PR — enable it and surface the URL as a PR
comment/check:

- **Vercel / Netlify / Cloudflare Pages** — connect the repo; every PR gets a unique
  preview URL; production deploys on merge to `main`.
- Prefer the host's Git integration over a custom deploy step unless you need control.

---

## Hosting configs

### Astro — static vs SSR
```js
// astro.config.mjs — SSR only if you need server rendering
import node from '@astrojs/node'   // or @astrojs/vercel, @astrojs/cloudflare
export default { output: 'server', adapter: node({ mode: 'standalone' }) }
// omit output/adapter for a fully static build
```

### SPA fallback (React/Vue static hosting)
```
# Netlify — public/_redirects
/*  /index.html  200
```
```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Caching headers
```
# hashed assets: cache forever
/assets/*   Cache-Control: public, max-age=31536000, immutable
# HTML: always revalidate
/*.html     Cache-Control: no-cache
```

---

## Bundle budget (size-limit)

```json
// package.json
{
  "size-limit": [
    { "path": "dist/assets/index-*.js", "limit": "200 KB" },
    { "path": "dist/assets/*.css", "limit": "50 KB" }
  ],
  "scripts": { "size": "size-limit" }
}
```

---

## Rollback

- On managed hosts (Vercel/Netlify/Cloudflare): promote the previous deployment — one
  click, instant. Keep it in the runbook.
- Self-hosted: keep the last N build artifacts and a symlink/alias switch so revert is a
  single command. Never hot-fix in production without a revert path.

---

## Secrets

- Store in the CI/host encrypted secret store (GitHub Actions secrets, host env vars).
- Reference as `${{ secrets.NAME }}` / `import.meta.env` — never commit `.env` with real values.
- Scope tokens minimally; rotate on exposure.
