#!/usr/bin/env node
/**
 * Maintenance radar for this workspace — see the maintenance-cadence note.
 *
 * Two independent halves, because they belong on different clocks:
 *
 *   --gates     Local, instant, no network. Are the three gates green right now?
 *               Wired to SessionStart so a session opens already knowing.
 *   --versions  Network. Are the pinned deps behind what npm publishes?
 *               Run on demand (`npm run drift`) or from a scheduled agent —
 *               releases land on the world's clock, not when you open the repo.
 *
 * No argument runs both (the full `npm run drift`).
 *
 * Always exits 0: this reports, it doesn't gate. CI is where red fails a build.
 * Zero dependencies.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const hook = args.includes('--hook'); // emit a SessionStart JSON envelope instead of a report
const want = { gates: args.includes('--gates') || hook, versions: args.includes('--versions') };
if (!want.gates && !want.versions) { want.gates = want.versions = true; }

const g = (s) => `\x1b[32m${s}\x1b[0m`;
const y = (s) => `\x1b[33m${s}\x1b[0m`;
const r = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

/* ── gates: run the existing checks, report pass/fail, never throw ─────────── */
function runGate(label, file, gateArgs = []) {
  try {
    execFileSync('node', [join(ROOT, 'scripts', file), ...gateArgs], { stdio: 'pipe' });
    return { label, ok: true };
  } catch (e) {
    const out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
    // exit 2 from build-css/a11y means "deps not installed", not "gate failed"
    const missing = e.status === 2 || /Cannot find|not installed|npm ci/i.test(out);
    return { label, ok: false, missing, hint: missing ? 'run `npm ci` in scripts/' : null };
  }
}

function gates() {
  const results = [
    runGate('skills-lint', 'skills-lint.mjs'),
    runGate('build-css', 'build-css.mjs', ['--check']),
    runGate('a11y-audit', 'a11y-audit.mjs'),
  ];
  const lines = results.map((res) => {
    if (res.ok) return `  ${g('✓')} ${res.label}`;
    if (res.missing) return `  ${y('•')} ${res.label} ${dim('(' + res.hint + ')')}`;
    return `  ${r('✗')} ${res.label} ${dim('— run it directly to see why')}`;
  });
  const bad = results.filter((res) => !res.ok && !res.missing).length;
  const skipped = results.filter((res) => res.missing).length;
  const head = bad ? r(`gates: ${bad} failing`) : skipped ? y('gates: not installed') : g('gates: all green');
  return { text: `${head}\n${lines.join('\n')}`, bad };
}

/* ── versions: compare pinned deps to npm's latest ────────────────────────── */
const TRACKED = [
  { pkg: 'tailwindcss', from: 'scripts/package.json' },
  { pkg: '@tailwindcss/cli', from: 'scripts/package.json' },
  { pkg: '@tailwindcss/vite', from: 'astro-registration-m3/package.json' },
  { pkg: 'astro', from: 'astro-registration-m3/package.json' },
  { pkg: 'jsdom', from: 'scripts/package.json' },
];

function pinnedRange(pkgJsonPath, name) {
  const j = JSON.parse(readFileSync(join(ROOT, pkgJsonPath), 'utf8'));
  return (j.dependencies?.[name]) ?? (j.devDependencies?.[name]) ?? null;
}
const major = (v) => parseInt(String(v).replace(/^[^\d]*/, ''), 10);

function versions() {
  const rows = [];
  for (const { pkg, from } of TRACKED) {
    const range = pinnedRange(from, pkg);
    if (!range) continue;
    let latest;
    try {
      latest = execFileSync('npm', ['view', pkg, 'version'], { stdio: 'pipe', timeout: 15000 }).toString().trim();
    } catch {
      rows.push({ pkg, range, latest: null });
      continue;
    }
    rows.push({ pkg, range, latest, behindMajor: major(latest) > major(range) });
  }

  const reachable = rows.filter((row) => row.latest);
  const behind = reachable.filter((row) => row.behindMajor);
  const offline = rows.length - reachable.length;

  const width = Math.max(...rows.map((row) => row.pkg.length));
  const lines = rows.map((row) => {
    const name = row.pkg.padEnd(width);
    if (!row.latest) return `  ${dim('?')} ${name}  ${dim('(npm unreachable)')}`;
    if (row.behindMajor) return `  ${y('⚠')} ${name}  pinned ${row.range}  →  ${y('latest ' + row.latest)}  ${dim('(major)')}`;
    return `  ${g('✓')} ${name}  ${dim(row.range + ' · latest ' + row.latest)}`;
  });

  let head;
  if (offline === rows.length) head = dim('versions: npm unreachable — skipped');
  else if (behind.length) head = y(`versions: ${behind.length} major upgrade${behind.length > 1 ? 's' : ''} available`);
  else head = g('versions: all current');

  return { text: `${head}\n${lines.join('\n')}`, behind: behind.length };
}

/* ── SessionStart hook: gates only, emit JSON for additionalContext ────────── */
if (hook) {
  const res = gates();
  const clean = res.text.replace(/\x1b\[[0-9;]*m/g, '').trim();
  const prefix = res.bad
    ? 'Maintained skills workspace — a quality gate is RED (see memory maintenance-cadence):\n'
    : 'Maintained skills workspace — gate status at session start:\n';
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: prefix + clean },
  }));
  process.exit(0);
}

/* ── report ───────────────────────────────────────────────────────────────── */
const blocks = [];
let flagged = 0;
if (want.gates) { const res = gates(); blocks.push(res.text); flagged += res.bad; }
if (want.versions) { const res = versions(); blocks.push(res.text); flagged += res.behind; }

console.log(`\n${blocks.join('\n\n')}\n`);
if (want.versions) {
  console.log(dim('  upgrade path & the drift-audit method: memory maintenance-cadence\n'));
}
process.exit(0);
