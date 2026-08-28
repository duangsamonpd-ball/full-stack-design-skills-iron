#!/usr/bin/env node
/**
 * Maintenance radar for this workspace — see the maintenance-cadence note.
 *
 * Three independent halves, because they belong on different clocks:
 *
 *   --gates     Local, instant, no network. Are the three gates green right now?
 *               Wired to SessionStart so a session opens already knowing.
 *   --versions  Network. Are the pinned deps behind what npm publishes, and the
 *               pinned GitHub Actions behind their latest release?
 *               Run on demand (`npm run drift`) or from a scheduled agent —
 *               releases land on the world's clock, not when you open the repo.
 *   --audit     Network. Is what we already have vulnerable? Separate from
 *               --versions because an advisory is not a release: it can land
 *               against a version that is current, and did (see below).
 *
 * No argument runs all three (the full `npm run drift`).
 *
 * Always exits 0: this reports, it doesn't gate. CI is where red fails a build.
 * Zero dependencies.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const hook = args.includes('--hook'); // emit a SessionStart JSON envelope instead of a report
const want = {
  gates: args.includes('--gates') || hook,
  versions: args.includes('--versions'),
  audit: args.includes('--audit'),
};
if (!want.gates && !want.versions && !want.audit) { want.gates = want.versions = want.audit = true; }

// Escape codes are noise in a CI log or a pasted issue body, and a terminal is
// the only place they help. NO_COLOR is the honoured convention for opting out.
const colour = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const paint = (code) => (s) => (colour ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const g = paint(32);
const y = paint(33);
const r = paint(31);
const dim = paint(2);

/* ── gates: run the existing checks, report pass/fail, never throw ─────────── */
function runGate(label, file, gateArgs = []) {
  try {
    execFileSync('node', [join(ROOT, 'scripts', file), ...gateArgs], { stdio: 'pipe' });
    return { label, ok: true };
  } catch (e) {
    const out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
    // "could not run" vs "ran and refused" is decided by exit code 2 and by module
    // resolution failing — NEVER by the words in the output. a11y prints its own
    // remedy ("cd astro-registration-m3 && npm ci && npm run build") when it refuses
    // a missing or stale build, and a substring test for `npm ci` read that remedy as
    // proof the gate could not run: the loudest refusal in the repo came out as a
    // yellow "not installed" with a hint pointing at the wrong directory.
    const missing = e.status === 2 || /Cannot find (package|module)|ERR_MODULE_NOT_FOUND/i.test(out);
    // when it really did fail, quote its own first verdict line rather than a generic nudge
    const verdict = out.split('\n').map((l) => l.replace(/\x1b\[[0-9;]*m/g, '').trim())
      .find((l) => l.startsWith('✖') || l.startsWith('✗'));
    return { label, ok: false, missing, hint: missing ? 'run `npm ci` in scripts/' : verdict ?? null };
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
    return `  ${r('✗')} ${res.label} ${dim('— ' + (res.hint ?? 'run it directly to see why'))}`;
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

/* ── actions: compare pinned GitHub Action majors to their latest release ───
 *
 * npm can't see these, so they drifted two majors unnoticed (checkout/setup-node
 * v5 → v7, found by hand 2026-08-03). The pins inside the skills matter more than
 * our own: they get copied into other people's repos.
 *
 * Scanned: `uses:` lines (workflows + yaml in skill docs) and backticked pins in
 * prose. Unauthenticated API — a handful of calls, well under the 60/hr limit.
 */
const ACTION_SOURCES = ['.github/workflows', '.claude/skills'];
const PIN = /(?:uses:\s*|`)([\w.-]+\/[\w.-]+)@v(\d+)/g;

function* walk(dir, exts = ['.yml', '.yaml', '.md']) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path, exts);
    else if (exts.includes(extname(entry.name))) yield path;
  }
}

function pinnedActions() {
  const found = new Map(); // repo → { major, uses }
  for (const src of ACTION_SOURCES) {
    const dir = join(ROOT, src);
    if (!existsSync(dir)) continue;
    for (const file of walk(dir)) {
      for (const [, repo, maj] of readFileSync(file, 'utf8').matchAll(PIN)) {
        const prev = found.get(repo);
        // report the oldest pin in the repo — that's the one that needs the bump
        found.set(repo, { major: Math.min(prev?.major ?? Infinity, +maj), uses: (prev?.uses ?? 0) + 1 });
      }
    }
  }
  return [...found].sort(([a], [b]) => a.localeCompare(b));
}

async function latestActionMajor(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: { accept: 'application/vnd.github+json', 'user-agent': 'iron-skills-check-drift' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  return major((await res.json()).tag_name);
}

async function actions() {
  const pins = pinnedActions();
  if (!pins.length) return { text: dim('actions: none pinned'), behind: 0 };

  const rows = await Promise.all(pins.map(async ([repo, pin]) => {
    try {
      return { repo, ...pin, latest: await latestActionMajor(repo) };
    } catch {
      return { repo, ...pin, latest: null };
    }
  }));

  const reachable = rows.filter((row) => row.latest);
  const behind = reachable.filter((row) => row.latest > row.major);
  const width = Math.max(...rows.map((row) => row.repo.length));
  const lines = rows.map((row) => {
    const name = row.repo.padEnd(width);
    const where = dim(`· ${row.uses} call site${row.uses > 1 ? 's' : ''}`);
    if (!row.latest) return `  ${dim('?')} ${name}  ${dim('(github unreachable)')}`;
    if (row.latest > row.major) return `  ${y('⚠')} ${name}  pinned v${row.major}  →  ${y('latest v' + row.latest)}  ${where}`;
    return `  ${g('✓')} ${name}  ${dim('v' + row.major)} ${where}`;
  });

  let head;
  if (!reachable.length) head = dim('actions: github unreachable — skipped');
  else if (behind.length) head = y(`actions: ${behind.length} major upgrade${behind.length > 1 ? 's' : ''} available`);
  else head = g('actions: all current');

  return { text: `${head}\n${lines.join('\n')}`, behind: behind.length };
}

/* ── node: is the pinned major still the LTS we think it is? ────────────────
 *
 * This was the last "eyeball it each pass" item, and eyeballing it means the
 * bump happens whenever someone remembers, not when the calendar says. The
 * release schedule is published as JSON, so ask it.
 *
 * Phases come from dates, not from a hand-kept note: a major is Current, then
 * Active LTS (even majors only), then Maintenance, then EOL. The pins in
 * .claude/skills matter more than our own workflows — they get copied into
 * other people's CI, where a maintenance-phase Node quietly becomes their
 * problem too.
 */
const NODE_SCHEDULE = 'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json';
const NODE_PIN = /node-version:\s*['"]?(\d+)/g;
// ISO dates compare correctly as strings. DRIFT_TODAY=YYYY-MM-DD overrides "now"
// so the phase transitions can be tested on demand instead of waited for.
const today = process.env.DRIFT_TODAY ?? new Date().toISOString().slice(0, 10);

function pinnedNode() {
  const found = new Map(); // major → call sites
  for (const src of ACTION_SOURCES) {
    const dir = join(ROOT, src);
    if (!existsSync(dir)) continue;
    for (const file of walk(dir)) {
      for (const [, maj] of readFileSync(file, 'utf8').matchAll(NODE_PIN)) {
        found.set(+maj, (found.get(+maj) ?? 0) + 1);
      }
    }
  }
  return [...found].sort(([a], [b]) => a - b);
}

function phaseOf(entry) {
  if (today >= entry.end) return { label: `EOL since ${entry.end}`, bad: true };
  if (entry.maintenance && today >= entry.maintenance) {
    return { label: `maintenance until ${entry.end}`, stale: true };
  }
  if (entry.lts && today >= entry.lts) return { label: `Active LTS until ${entry.maintenance ?? entry.end}` };
  if (today >= entry.start) {
    // odd majors never become LTS; even ones are just early
    return entry.lts
      ? { label: `Current — LTS from ${entry.lts}`, stale: true }
      : { label: `Current — an odd major, never becomes LTS`, stale: true };
  }
  return { label: `unreleased until ${entry.start}`, stale: true };
}

async function node() {
  const pins = pinnedNode();
  if (!pins.length) return { text: dim('node: no version pinned'), behind: 0 };

  let schedule;
  try {
    const res = await fetch(NODE_SCHEDULE, {
      headers: { 'user-agent': 'iron-skills-check-drift' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(String(res.status));
    schedule = await res.json();
  } catch {
    return { text: dim('node: schedule unreachable — skipped'), behind: 0 };
  }

  // what the calendar says the right pin is, today
  const active = Object.entries(schedule)
    .filter(([, entry]) => entry.lts && today >= entry.lts && today < entry.maintenance)
    .map(([key]) => major(key));
  const upcoming = Object.entries(schedule)
    .filter(([, entry]) => entry.lts && entry.lts > today)
    .sort((a, b) => a[1].lts.localeCompare(b[1].lts))[0];

  const width = Math.max(...pins.map(([maj]) => String(maj).length));
  const rows = pins.map(([maj, uses]) => {
    const entry = schedule[`v${maj}`];
    const where = dim(`· ${uses} call site${uses > 1 ? 's' : ''}`);
    const name = String(maj).padEnd(width);
    if (!entry) return { line: `  ${dim('?')} ${name}  ${dim('(not in the schedule)')} ${where}`, stale: 0, bad: 0 };
    const { label, bad, stale } = phaseOf(entry);
    const mark = bad ? r('✗') : stale ? y('⚠') : g('✓');
    const paint = bad ? r : stale ? y : dim;
    return { line: `  ${mark} ${name}  ${paint(label)} ${where}`, stale: bad || stale ? 1 : 0, bad: bad ? 1 : 0 };
  });

  const behind = rows.reduce((n, row) => n + row.stale, 0);
  const dead = rows.reduce((n, row) => n + row.bad, 0);
  const lines = rows.map((row) => row.line);

  // A stale pin is only actionable with a target, so always name one. Note the
  // gap: an LTS goes to maintenance ~8 days before its successor becomes LTS,
  // so "today's Active LTS" can legitimately be nobody.
  const nextLts = upcoming ? `${major(upcoming[0])} becomes Active LTS ${upcoming[1].lts}` : null;
  if (behind) {
    const target = active.length ? active.join(' or ')
      : nextLts ? `nothing yet — ${nextLts}`
      : 'nothing — the published schedule names no Active LTS for today';
    lines.push(dim(`      → move to ${target}`));
  } else if (nextLts) {
    lines.push(dim(`      next: ${nextLts}`));
  }

  let head;
  if (dead) head = r(`node: ${dead} pin${dead > 1 ? 's' : ''} EOL`);
  else if (behind) head = y(`node: ${behind} pin${behind > 1 ? 's' : ''} off the LTS line`);
  else head = g(`node: pinned ${pins.map(([maj]) => maj).join(', ')} · Active LTS today ${active.join(', ') || '—'}`);

  return { text: `${head}\n${lines.join('\n')}`, behind };
}

/* ── wcag: is the standard we cite still the current Recommendation? ────────
 *
 * The skills teach against a named version, so this citation is a claim with a
 * shelf life in a way "use good contrast" is not. W3C publishes which spec in
 * the series is current, so the claim can be checked instead of remembered.
 *
 * Both directions are drift: citing an older REC leaves the guidance behind,
 * and citing a *newer* draft (3.0 has been a Working Draft for years, REC not
 * expected before 2028) teaches something nobody is required to meet yet.
 *
 * The lookahead is what makes this usable: "WCAG 1.4.10" and "WCAG 2.1.1" are
 * success criteria, not versions, and the repo is full of them.
 */
const WCAG_SERIES = 'https://api.w3.org/specification-series/wcag';
const WCAG_CITE = /WCAG ?(\d\.\d)(?!\.\d)/g;
const vnum = (v) => Number(String(v).replace('.', ''));

function wcagCitations() {
  const files = [
    ...walk(join(ROOT, '.claude', 'skills'), ['.md']),
    // the example pages make the same claim in marketing copy, and drifted
    ...readdirSync(ROOT).filter((f) => extname(f) === '.html').map((f) => join(ROOT, f)),
  ];
  const found = new Map(); // version → Set of files
  for (const file of files) {
    for (const [, version] of readFileSync(file, 'utf8').matchAll(WCAG_CITE)) {
      if (!found.has(version)) found.set(version, new Set());
      found.get(version).add(file.slice(ROOT.length + 1));
    }
  }
  return [...found].sort(([a], [b]) => vnum(a) - vnum(b));
}

async function wcag() {
  const cited = wcagCitations();
  if (!cited.length) return { text: dim('wcag: no version cited'), behind: 0 };

  let current;
  try {
    const res = await fetch(WCAG_SERIES, {
      headers: { accept: 'application/json', 'user-agent': 'iron-skills-check-drift' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const href = (await res.json())._links?.['current-specification']?.href ?? '';
    // .../specifications/WCAG22 → 2.2
    const digits = href.match(/WCAG(\d)(\d)$/);
    if (!digits) throw new Error('unrecognised shape');
    current = `${digits[1]}.${digits[2]}`;
  } catch {
    return { text: dim('wcag: w3.org unreachable — skipped'), behind: 0 };
  }

  const width = Math.max(...cited.map(([v]) => v.length));
  let behind = 0;
  const lines = [];
  for (const [version, files] of cited) {
    const name = version.padEnd(width);
    const where = dim(`· ${files.size} file${files.size > 1 ? 's' : ''}`);
    if (version === current) { lines.push(`  ${g('✓')} ${name}  ${dim('the current REC')} ${where}`); continue; }
    behind++;
    const why = vnum(version) < vnum(current)
      ? `behind — the current REC is ${current}`
      : `ahead of the REC (${current}) — not required of anyone yet`;
    lines.push(`  ${y('⚠')} ${name}  ${y(why)} ${where}`);
    lines.push(dim(`      ${[...files].sort().join(', ')}`));
  }

  const head = behind
    ? y(`wcag: ${behind} version${behind > 1 ? 's' : ''} cited that is not the current REC (${current})`)
    : g(`wcag: cites ${current} · the current REC`);

  return { text: `${head}\n${lines.join('\n')}`, behind };
}

/* ── audit: ask npm whether what we already have is vulnerable ──────────────
 *
 * The version half asks "has something newer shipped?". It never asks "is what
 * is installed vulnerable?" — and those are different questions. On 2026-08-12
 * that gap hid a high (nanoid GHSA-2v37-7h3g-55p8) and a moderate (postcss
 * GHSA-fxqj-rqcc-2cmp) advisory in astro-registration-m3 behind three green
 * gates and a green version row: both pins sat inside their caret ranges, so
 * nothing anywhere looked stale.
 *
 * Workspaces are derived from TRACKED, so pinning a package in a new workspace
 * can't quietly create one the audit never visits.
 *
 * Not wired to the hook: it needs the network, and SessionStart must stay instant.
 */
const WORKSPACES = [...new Set(TRACKED.map(({ from }) => dirname(from)))].sort();
const SEVERITIES = ['critical', 'high', 'moderate', 'low', 'info'];
const rank = (s) => SEVERITIES.length - SEVERITIES.indexOf(s);

// npm exits non-zero both when it finds advisories and when it can't audit at
// all; the JSON report lands on stdout either way, so read stdout, not status.
function auditWorkspace(dir) {
  let raw;
  try {
    raw = execFileSync('npm', ['audit', '--json'], {
      cwd: join(ROOT, dir), stdio: 'pipe', timeout: 60000,
    }).toString();
  } catch (e) {
    raw = `${e.stdout ?? ''}`;
  }
  let report;
  try { report = JSON.parse(raw); } catch { return { dir, blocked: 'npm unreachable' }; }
  if (report.error) {
    return { dir, blocked: report.error.code === 'ENOLOCK' ? 'no lockfile' : report.error.code };
  }

  const counts = report.metadata?.vulnerabilities ?? {};
  const found = Object.values(report.vulnerabilities ?? {}).map((v) => {
    // `via` holds advisory objects for a direct hit, and package names when the
    // vulnerability arrives through a dependency.
    const advisories = v.via.filter((x) => typeof x === 'object');
    const top = advisories.sort((a, b) => rank(b.severity) - rank(a.severity))[0];
    const chain = v.via.filter((x) => typeof x === 'string');
    return {
      name: v.name,
      severity: v.severity,
      title: top?.title ?? `reached through ${chain.join(', ')}`,
      fix: v.fixAvailable,
    };
  }).sort((a, b) => rank(b.severity) - rank(a.severity) || a.name.localeCompare(b.name));

  return { dir, counts, found, severe: (counts.critical ?? 0) + (counts.high ?? 0) };
}

function audit() {
  const rows = WORKSPACES.map(auditWorkspace);
  const width = Math.max(...rows.map((row) => row.dir.length));
  const lines = [];

  for (const row of rows) {
    const name = row.dir.padEnd(width);
    if (row.blocked) { lines.push(`  ${dim('?')} ${name}  ${dim('(' + row.blocked + ')')}`); continue; }
    if (!row.found.length) { lines.push(`  ${g('✓')} ${name}  ${dim('no advisories')}`); continue; }

    const tally = SEVERITIES.filter((s) => row.counts[s]).map((s) => `${row.counts[s]} ${s}`).join(' · ');
    lines.push(`  ${row.severe ? r('✗') : y('⚠')} ${name}  ${row.severe ? r(tally) : y(tally)}`);

    for (const v of row.found.slice(0, 6)) {
      lines.push(`      ${v.name} ${dim(v.severity)} — ${v.title}`);
    }
    if (row.found.length > 6) lines.push(dim(`      … and ${row.found.length - 6} more`));

    const unfixable = row.found.filter((v) => v.fix === false);
    const major = row.found.filter((v) => v.fix?.isSemVerMajor);
    let hint = `npm audit fix in ${row.dir}/`;
    if (major.length) hint += ` (${major.map((v) => v.name).join(', ')} need --force — semver-major)`;
    if (unfixable.length) hint += ` · no fix published for ${unfixable.map((v) => v.name).join(', ')}`;
    lines.push(dim(`      → ${hint}`));
  }

  const audited = rows.filter((row) => !row.blocked);
  const blocked = rows.length - audited.length;
  const flagged = audited.filter((row) => row.found.length);
  const severe = audited.reduce((n, row) => n + row.severe, 0);
  const total = audited.reduce((n, row) => n + row.found.length, 0);
  // "no advisories" from a workspace that was never audited is not a clean bill
  // of health, and must never read as one.
  const unchecked = blocked ? ` · ${blocked} workspace${blocked > 1 ? 's' : ''} not audited` : '';

  let head;
  if (!audited.length) head = dim('audit: npm unreachable — skipped');
  else if (severe) head = r(`audit: ${total} advisor${total > 1 ? 'ies' : 'y'}, ${severe} high or critical${unchecked}`);
  else if (total) head = y(`audit: ${total} advisor${total > 1 ? 'ies' : 'y'}${unchecked}`);
  else if (blocked) head = y(`audit: no advisories where it could look${unchecked}`);
  else head = g('audit: no advisories');

  return { text: `${head}\n${lines.join('\n')}`, flagged: flagged.length };
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
let drift = 0;
let gateFail = 0;
if (want.gates) { const res = gates(); blocks.push(res.text); drift += res.bad; gateFail = res.bad; }
if (want.versions) {
  for (const res of [versions(), await actions(), await node(), await wcag()]) {
    blocks.push(res.text);
    drift += res.behind;
  }
}
if (want.audit) { const res = audit(); blocks.push(res.text); drift += res.flagged; }

console.log(`\n${blocks.join('\n\n')}\n`);
if (want.versions || want.audit) {
  console.log(dim('  upgrade path & the drift-audit method: memory maintenance-cadence\n'));
}

// A RED GATE IS ALWAYS FATAL. The version and audit rows stay advisory — they are
// about the world moving, and --fail-on-drift is for the scheduled run that needs a
// signal rather than a log. But `--gates` is the command CLAUDE.md tells a reader to
// verify with, and it printed "gates: 1 failing" over exit 0 until 2026-08-28, so
// every exit code quoted from it was worth nothing. The SessionStart hook returns
// from its own branch above and is not affected.
process.exit(gateFail || (args.includes('--fail-on-drift') && drift) ? 1 : 0);
