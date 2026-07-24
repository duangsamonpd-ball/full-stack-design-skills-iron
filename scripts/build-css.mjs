#!/usr/bin/env node
/**
 * Build the example pages' Tailwind CSS.
 *
 * Each root `<page>.html` has its tokens, `@theme` layer and component classes in
 * `styles/<page>.css`; this compiles them to `assets/<page>.css`, which the page loads
 * with a plain <link>. No CDN, no in-browser compile.
 *
 * The generated CSS is committed so the examples still open with zero setup — which is
 * only safe if something checks it hasn't drifted from its source:
 *
 *   node scripts/build-css.mjs           # write assets/*.css
 *   node scripts/build-css.mjs --check   # exit 1 if any committed file is stale (CI)
 *
 * Same stale-output gate the design-systems-architecture skill prescribes for a token
 * pipeline — see its references/token-pipeline.md.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync, existsSync, symlinkSync, lstatSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

/**
 * Tailwind resolves `@import "tailwindcss"` from the *stylesheet's* directory upward, and
 * our only node_modules lives in scripts/. Rather than write a brittle relative path into
 * styles/*.css — those files are examples people copy, and the canonical form is the bare
 * `@import "tailwindcss"` the design-tokens-system skill teaches — give styles/ a
 * gitignored symlink to the installed packages.
 */
function linkModules() {
  const link = join(ROOT, 'styles', 'node_modules');
  try {
    if (lstatSync(link)) return;            // already there (symlink or real dir)
  } catch {
    symlinkSync(join(ROOT, 'scripts', 'node_modules'), link, 'dir');
  }
}

const PAGES = [
  'accessibility-showcase',
  'component-showcase',
  'dashboard-prototype',
  'registration-form-m3',
  'registration-form',
];

const cli = join(ROOT, 'scripts', 'node_modules', '.bin', 'tailwindcss');
if (!existsSync(cli)) {
  console.error('\n\x1b[31m✖  Tailwind CLI not installed — run `npm ci` in scripts/\x1b[0m\n');
  process.exit(2);
}

linkModules();

const tmp = check ? mkdtempSync(join(tmpdir(), 'css-check-')) : null;
const stale = [];
let built = 0;

for (const page of PAGES) {
  const input = join(ROOT, 'styles', `${page}.css`);
  const committed = join(ROOT, 'assets', `${page}.css`);
  const output = check ? join(tmp, `${page}.css`) : committed;

  execFileSync(cli, ['-i', input, '-o', output, '--minify'], { stdio: ['ignore', 'ignore', 'pipe'] });

  if (check) {
    const fresh = readFileSync(output, 'utf8');
    const onDisk = existsSync(committed) ? readFileSync(committed, 'utf8') : null;
    if (onDisk === null) stale.push(`${page} — assets/${page}.css is missing`);
    else if (onDisk !== fresh) stale.push(`${page} — assets/${page}.css differs from styles/${page}.css`);
  } else {
    const bytes = readFileSync(committed).length;
    console.log(`  assets/${page}.css`.padEnd(44) + `${(bytes / 1024).toFixed(1)} KB`);
  }
  built++;
}

if (tmp) rmSync(tmp, { recursive: true, force: true });

if (check) {
  if (stale.length) {
    console.error(`\n\x1b[31m✖  ${stale.length} generated stylesheet(s) out of date\x1b[0m`);
    for (const s of stale) console.error(`    ${s}`);
    console.error('\n    Rebuild with:  node scripts/build-css.mjs\n');
    process.exit(1);
  }
  console.log(`\n\x1b[32m✔  ${built} stylesheets match their source\x1b[0m\n`);
} else {
  console.log(`\n\x1b[32m✔  built ${built} stylesheets\x1b[0m\n`);
}
