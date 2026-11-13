#!/usr/bin/env node
// Behaviour smoke test for the registration examples: run each page's own script,
// fill the form, submit it, and require that it does what its copy says.
//
// Why this gate exists. registration-form-m3.html shipped from its first commit
// (439e4e5, 2026-07-18) to 8f1b8aa (2026-11-13) with no #password-err, so a
// correctly filled form threw on submit and never reached its success view. Two
// sibling pages had the same bug. For those four months the a11y gate passed every
// page on every push, because it reads the accessibility tree and never presses
// anything. A gate that never exercises behaviour cannot see a page that does not
// work. This one presses Submit.
//
// It runs in jsdom, so it needs nothing the a11y gate does not already install.
// Rendering, focus visibility and overflow are out of scope: jsdom lays nothing out.
//
// The refusal case runs on EVERY invocation: the M3 page with its #password-err
// removed — the exact bug above — must fail. If it ever passes, the test has stopped
// testing, and the gate fails instead of turning into a tick.
//
// Exit: 0 all pages behave · 1 a page misbehaves, or the self-test did not catch the plant

import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const rel = (f) => path.relative(root, f);

const PAGES = [
  'registration-form.html',
  'registration-form-m3.html',
  'registration-form-bootstrap.html',
  'astro-registration-m3/dist/index.html',
].map((f) => path.join(root, f));

// The Astro page only exists once built. A missing one is a hole in the gate, not a
// page to drop — the same rule, and the same remedy, as the a11y gate.
const ASTRO_BUILD = 'cd astro-registration-m3 && npm ci && npm run build';

const VALID = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'Str0ng!pass', confirm: 'Str0ng!pass' };
// The pages fake a 1.1s request with setTimeout before showing success. --gates runs at
// every SessionStart, and waiting that out took the whole gate run to 4.8s, so timers run
// at once here: the code path is the same, only the wait is gone.
const SETTLE_MS = 50;

const shown = (el) => !!el && !el.hidden && !el.classList.contains('hidden') && !el.classList.contains('d-none');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Build a live page from HTML: inline scripts run, a bundled module script is run after parse. */
function load(html, file) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(e.message.split('\n')[0]));
  // jsdom cannot run module scripts. Astro emits one, with no imports, so it is read
  // from dist and evaluated after the document is parsed, as a deferred module would be.
  const modules = [];
  html = html.replace(/<script type="module" src="([^"]+)"><\/script>/g, (_, src) => {
    modules.push(path.join(path.dirname(file), src.replace(/^\//, '')));
    return '';
  });
  const dom = new JSDOM(html, {
    url: 'http://localhost/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true,
    beforeParse(w) {
      w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      const later = w.setTimeout.bind(w);
      w.setTimeout = (fn, _ms, ...args) => later(fn, 0, ...args);
    },
  });
  const w = dom.window;
  w.addEventListener('error', (e) => errors.push(e.message));
  for (const m of modules) {
    if (!fs.existsSync(m)) { errors.push(`module script missing: ${rel(m)}`); continue; }
    try { w.eval(fs.readFileSync(m, 'utf8')); } catch (e) { errors.push(String(e.message)); }
  }
  return { w, errors };
}

function fill(w, values) {
  const d = w.document;
  for (const [id, v] of Object.entries(values)) {
    const el = d.getElementById(id);
    el.value = v;
    el.dispatchEvent(new w.Event('input', { bubbles: true }));
  }
}

async function check(html, file) {
  const fails = [];

  // 1 — an empty submit is refused, field by field, without crashing
  {
    const { w, errors } = load(html, file);
    w.document.getElementById('signup').requestSubmit();
    await sleep(SETTLE_MS);
    // behaviour only: an error is shown beside a field. Whether that error is also
    // exposed to assistive tech (aria-invalid, describedby) is the a11y gate's job.
    const fieldErrors = [...w.document.querySelectorAll('[id$="-err"]')].filter(shown).length;
    if (errors.length) fails.push(`empty submit threw: ${errors[0]}`);
    if (!fieldErrors) fails.push('empty submit showed no error beside any field');
    if (!shown(w.document.getElementById('summary'))) fails.push('empty submit showed no error summary');
    if (shown(w.document.getElementById('success-view'))) fails.push('empty submit reached the success view');
    w.close();
  }

  // 2 — a correctly filled form reaches its success view, without errors
  {
    const { w, errors } = load(html, file);
    fill(w, VALID);
    w.document.getElementById('terms').checked = true;
    w.document.getElementById('signup').requestSubmit();
    await sleep(SETTLE_MS);
    if (errors.length) fails.push(`valid submit threw: ${errors[0]}`);
    if (!shown(w.document.getElementById('success-view'))) fails.push('valid submit never reached the success view');
    if (shown(w.document.getElementById('summary'))) fails.push('valid submit left the error summary on screen');
    w.close();
  }
  return fails;
}

// ── the refusal case: the bug this gate exists for must be caught ──────────────
async function selfTest() {
  const m3 = path.join(root, 'registration-form-m3.html');
  const html = fs.readFileSync(m3, 'utf8');
  const planted = html.replace(/<p id="password-err"[^>]*><\/p>/, '');
  if (planted === html) return 'self-test: could not plant the bug — #password-err markup changed shape; update the plant';
  const fails = await check(planted, m3);
  return fails.length ? null : 'self-test: the planted missing #password-err PASSED — this gate is no longer testing';
}

const missing = PAGES.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error(`\n\x1b[31m✖  ${missing.length} page(s) expected but not built — the smoke test would be incomplete\x1b[0m`);
  for (const f of missing) console.error(`    ${rel(f)}\n      build it with:  ${ASTRO_BUILD}`);
  process.exit(1);
}

const results = await Promise.all(PAGES.map(async (f) => [f, await check(fs.readFileSync(f, 'utf8'), f)]));
const selfFail = await selfTest();

let bad = 0;
for (const [f, fails] of results) {
  if (fails.length) { bad++; console.log(`\x1b[31m✗\x1b[0m ${rel(f)}`); fails.forEach((x) => console.log(`    ${x}`)); }
  else console.log(`\x1b[32m✓\x1b[0m ${rel(f)} — empty submit refused, valid submit reaches success`);
}
if (selfFail) console.log(`\x1b[31m✗\x1b[0m ${selfFail}`);
else console.log(`\x1b[32m✓\x1b[0m self-test — the planted missing #password-err is caught`);

if (bad || selfFail) {
  console.log(`\n\x1b[31m✖  form smoke: ${bad} page(s) misbehave${selfFail ? ', self-test failed' : ''}\x1b[0m`);
  process.exit(1);
}
console.log(`\n\x1b[32m✔  form smoke: ${results.length} page(s) submit correctly\x1b[0m`);
