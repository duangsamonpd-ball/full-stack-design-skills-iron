/**
 * Runs every generator note's `verify` command and reports the ones that have
 * gone stale.
 *
 * The direction is the point, and it is borrowed from
 * `page-experiments/scripts/layout-known.json`: **a note whose condition has
 * quietly disappeared is reported**, because that means either the thing it
 * described was fixed or the check went blind, and only one is good news.
 *
 * `verify` is a shell command whose FAILURE means the note still applies.
 *   exit != 0  → condition still present → note is ACTIVE, nothing to say
 *   exit == 0  → condition gone          → note is STALE, report it
 *
 * `kind: decision` notes carry no `verify` and are never reported — a decision
 * is superseded by another decision, not by a command.
 *
 * --self-test plants a note that must be reported and one that must not, and
 * checks that a missing notes directory is told apart from an empty one.
 */
import { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Kinds that state a PERSON'S POSITION rather than a fact about the codebase.
 * These are superseded by another person, never by a command — requiring a
 * `verify` would only invite a fake one. They must name who decided, so the
 * position is attributable and can be revisited.
 */
const POSITION_KINDS = new Set(['decision', 'correction']);

function parse(file, src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].trim().replace(/^["'](.*)["']$/, '$1');
    }
  }
  return { file, ...fm };
}

function collect(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => parse(f, readFileSync(join(dir, f), 'utf8')));
}

/**
 * A missing notes directory and an empty one are different answers, and this
 * script used to give both the same one — "no notes", exit 0. Pointed at a
 * repository that has never run figma-astro-init, or at no repository at all,
 * it reported success for a check it had not performed. Keep them apart here so
 * the caller can refuse the first and accept the second.
 */
function notesDirState(dir) {
  if (!existsSync(dir)) return 'missing';
  return collect(dir).length ? 'present' : 'empty';
}

function run(notes, cwd) {
  const stale = [], active = [], skipped = [], broken = [];
  for (const n of notes) {
    if (n.status === 'superseded') { skipped.push([n, 'superseded']); continue; }
    // Two families. A note stating a PERSON'S POSITION (decision, correction) is superseded by
    // another person, never by a command — requiring a `verify` would only invite a fake one.
    // A note stating a FACT ABOUT THE CODEBASE (conflict, drift) must be falsifiable.
    if (POSITION_KINDS.has(n.kind)) {
      if (!n.by) broken.push([n, `kind: ${n.kind} must name who decided it — add a \`by:\` field`]);
      else skipped.push([n, `${n.kind} — superseded by a person, not a command`]);
      continue;
    }
    if (!n.verify) {
      broken.push([n, `kind: ${n.kind ?? '(none)'} states a fact about the codebase and must carry a verify command`]);
      continue;
    }
    let code = 0;
    try { execSync(n.verify, { cwd, stdio: 'pipe', shell: true }); }
    catch (e) { code = e.status ?? 1; }
    (code === 0 ? stale : active).push(n);
  }
  return { stale, active, skipped, broken };
}

if (process.argv.includes('--self-test')) {
  const d = mkdtempSync(join(tmpdir(), 'notes-'));
  writeFileSync(join(d, '0001-x.md'), '---\nid: 0001\nkind: conflict\nstatus: active\nverify: "exit 1"\n---\nstill applies');
  writeFileSync(join(d, '0002-y.md'), '---\nid: 0002\nkind: conflict\nstatus: active\nverify: "exit 0"\n---\ngone');
  writeFileSync(join(d, '0003-z.md'), '---\nid: 0003\nkind: decision\nstatus: active\nby: Darrius\n---\na decision');
  writeFileSync(join(d, '0004-w.md'), '---\nid: 0004\nkind: conflict\nstatus: active\n---\nno verify — malformed');
  writeFileSync(join(d, '0005-v.md'), '---\nid: 0005\nkind: correction\nstatus: active\nby: Darrius\n---\nan attributed correction');
  writeFileSync(join(d, '0006-u.md'), '---\nid: 0006\nkind: correction\nstatus: active\n---\nunattributed — malformed');
  const r = run(collect(d), d);
  const stateWithNotes = notesDirState(d);
  rmSync(d, { recursive: true, force: true });

  // The three directory states, including the one whose collapse into "no notes"
  // let this script exit 0 without checking anything.
  const emptyDir = mkdtempSync(join(tmpdir(), 'notes-empty-'));
  const stateEmpty = notesDirState(emptyDir);
  rmSync(emptyDir, { recursive: true, force: true });
  const stateMissing = notesDirState(join(tmpdir(), `notes-gone-${process.pid}`));

  const checks = [
    ['a note whose condition persists is ACTIVE', r.active.length === 1 && r.active[0].id === '0001'],
    ['a note whose condition is gone is STALE', r.stale.length === 1 && r.stale[0].id === '0002'],
    ['a decision is exempt, not reported', r.skipped.some(([n]) => n.id === '0003')],
    ['a conflict with no verify is BROKEN', r.broken.some(([n]) => n.id === '0004')],
    ['an attributed correction is exempt', r.skipped.some(([n]) => n.id === '0005')],
    ['an unattributed correction is BROKEN', r.broken.some(([n]) => n.id === '0006')],
    ['a directory holding notes reads as present', stateWithNotes === 'present'],
    ['an existing but empty directory reads as empty', stateEmpty === 'empty'],
    ['a directory that does not exist reads as missing, not empty', stateMissing === 'missing'],
  ];
  let bad = 0;
  for (const [name, ok] of checks) if (!ok) { console.log('FAIL ' + name); bad++; }
  console.log(bad ? `SELF-TEST FAILED (${bad})`
    : `SELF-TEST PASSED — ${checks.length} cases: stale detected, active kept, decisions exempt, missing verify caught, absent notes dir told from empty`);
  process.exit(bad ? 1 : 0);
}

const REPO = process.argv.find((a) => a.startsWith('--repo='))?.slice(7)
  ?? process.cwd();

/**
 * Fail early and legibly on a wrong --repo, the same way fingerprint.mjs does.
 * The notes live inside the target repository; if this is not a repository at
 * all, nothing below can be true.
 */
try {
  execSync('git rev-parse --show-toplevel', { cwd: REPO, stdio: 'pipe' });
} catch {
  console.error(
    `Not a git repository: ${REPO}\n\n`
    + `This reads the generator's notes out of the target Astro repository. Point --repo at it:\n`
    + `  node check-notes.mjs --repo=/path/to/iron-websites\n`
    + `or run from inside that repository.`,
  );
  process.exit(2);
}

const DIR = join(REPO, 'docs/web-devs/figma-to-astro/notes');
const state = notesDirState(DIR);
if (state === 'missing') {
  console.error(
    `No notes directory: ${DIR}\n\n`
    + `Either --repo points at the wrong repository, or figma-astro-init has not run\n`
    + `here yet. Refusing to report "no notes" for a directory that does not exist —\n`
    + `that reads as a clean check rather than one that never ran.`,
  );
  process.exit(2);
}
if (state === 'empty') { console.log(`no notes yet in ${DIR}`); process.exit(0); }

const notes = collect(DIR);
const { stale, active, skipped, broken } = run(notes, REPO);
console.log(`${notes.length} note(s): ${active.length} active · ${stale.length} stale · ${skipped.length} exempt · ${broken.length} malformed\n`);
for (const n of active) console.log(`  active     ${n.id}  ${n.file}`);
for (const [n, why] of skipped) console.log(`  exempt     ${n.id}  ${n.file}  (${why})`);
for (const n of stale) {
  console.log(`\n  STALE      ${n.id}  ${n.file}`);
  console.log(`             its verify now passes: ${n.verify}`);
  console.log(`             the condition it describes is gone — mark it superseded, or say why it should stay.`);
}
for (const [n, why] of broken) console.log(`\n  MALFORMED  ${n.id}  ${n.file}\n             ${why}`);
process.exit(stale.length || broken.length ? 1 : 0);
