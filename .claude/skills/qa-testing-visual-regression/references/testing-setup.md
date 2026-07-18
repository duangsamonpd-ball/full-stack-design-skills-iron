# Testing Setup — component · e2e · visual regression

Working setups for each layer. Loaded on demand by the `qa-testing-visual-regression`
skill. Examples use Vitest + Testing Library, Playwright, and Chromatic/Playwright
screenshots — the ideas port to Jest/Cypress/Percy.

---

## 1. Component tests (Vitest + Testing Library)

```bash
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
# Vue: @testing-library/vue instead of /react
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: { environment: 'jsdom', globals: true, setupFiles: './vitest.setup.ts' },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

```tsx
// Button.test.tsx — query by role/name, assert behavior + states
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

test('calls onClick when pressed', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Save</Button>)
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(onClick).toHaveBeenCalledOnce()
})

test('is inert while loading', () => {
  render(<Button isLoading>Save</Button>)
  expect(screen.getByRole('button')).toBeDisabled()   // not: expect .btn--loading class
})
```

> Query priority: `getByRole` > `getByLabelText` > `getByText` > (last resort) `getByTestId`.
> Never assert on CSS class names — that couples tests to implementation.

### Vue variant
```ts
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Button from './Button.vue'

test('emits click', async () => {
  const { emitted } = render(Button, { slots: { default: 'Save' } })
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(emitted().click).toBeTruthy()
})
```

---

## 2. End-to-end (Playwright)

```bash
npm i -D @playwright/test && npx playwright install
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4321' },   // Astro dev default; adjust per app
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'mobile',   use: devices['iPhone 13'] },
  ],
  webServer: { command: 'npm run dev', url: 'http://localhost:4321', reuseExistingServer: true },
})
```

```ts
// e2e/auth.spec.ts — a real user flow, queried by role
import { test, expect } from '@playwright/test'

test('user can sign in', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('correct horse')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
```

Keep e2e to critical journeys only (auth, checkout, primary submit). They're the slowest
and flakiest layer — don't re-test unit logic through the browser.

---

## 3. Visual regression

### Option A — Playwright screenshots (self-hosted, free)

```ts
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

for (const theme of ['light', 'dark']) {
  test(`button variants — ${theme}`, async ({ page }) => {
    await page.goto(`/kitchen-sink?theme=${theme}`)      // a page rendering all variants
    await expect(page.getByTestId('button-gallery'))
      .toHaveScreenshot(`buttons-${theme}.png`, { maxDiffPixelRatio: 0.01 })
  })
}
```
- First run writes baselines; later runs diff against them.
- `npx playwright test --update-snapshots` re-baselines **after** you've reviewed the change.
- Commit baseline PNGs; pin the Playwright version so rendering is stable across machines.

### Option B — Chromatic (hosted, Storybook-native)

```bash
npm i -D chromatic
npx chromatic --project-token=<token>
```
- Snapshots every Storybook story automatically, across viewports/themes you configure.
- Surfaces image diffs in a review UI; changes are approved or rejected per PR.

---

## 4. CI wiring (GitHub Actions sketch)

```yaml
# .github/workflows/qa.yml
- run: npm ci
- run: npm run test        # vitest component/unit
- run: npx playwright install --with-deps
- run: npx playwright test # e2e + visual (fails on diff)
# or: - run: npx chromatic --exit-zero-on-changes=false
```

Gate merges on all three. An intended restyle updates baselines in the same PR, reviewed
by a human — never auto-accept visual diffs.

---

## Anti-flake checklist

- [ ] Pin browser/tool versions (rendering must be deterministic)
- [ ] Disable animations in the test/screenshot environment
- [ ] Wait on state (`toBeVisible`), never fixed `sleep`
- [ ] Stub network/time for non-deterministic data
- [ ] Small `maxDiffPixelRatio` tolerance for anti-aliasing, not to hide real diffs
