/**
 * Fingerprint of the surfaces a page generator depends on.
 *
 * NOT a snapshot of conventions — those are derived at generation time and
 * storing them would make this a staleness generator. This stores only enough
 * to answer one question cheaply: *has something load-bearing moved since the
 * generator last looked?*
 *
 * When a surface changes, the generator re-derives against it and, if the change
 * cost it anything, writes a note. That is the whole trigger mechanism.
 *
 * Modelled on `page-experiments/scripts/layout-known.json`, where "an entry that
 * STOPS firing fails the run" — a known state that quietly disappears means
 * either the fix landed or the detector went blind, and only one is good news.
 *
 * --self-test plants a change in each surface and requires the hash to move.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const ROOT = process.argv.find((a) => a.startsWith('--root='))?.slice(7)
  ?? process.cwd();

/**
 * Fail early and legibly on a wrong --root. Every surface reads through git, so
 * a non-repository yields nine empty surfaces and a fingerprint that reports a
 * stable codebase forever — the same shape as good news. Say what is wrong
 * instead, because the raw git error ("not a git repository") sends a reader
 * looking for the wrong problem.
 */
try {
  execSync('git rev-parse --show-toplevel', { cwd: ROOT, stdio: 'pipe' });
} catch {
  console.error(
    `Not a git repository: ${ROOT}\n\n`
    + `This reads the target Astro repository through git. Point --root at it:\n`
    + `  node fingerprint.mjs --root=/path/to/iron-websites\n`
    + `or run from inside that repository with --root=.`,
  );
  process.exit(2);
}

const read = (p) => (existsSync(`${ROOT}/${p}`) ? readFileSync(`${ROOT}/${p}`, 'utf8') : '');
const ls = (spec) => {
  try {
    return execSync(`git ls-files -- ${spec}`, { cwd: ROOT, maxBuffer: 1 << 28 })
      .toString().trim().split('\n').filter(Boolean);
  } catch { return []; }
};
const h = (v) => createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 12);

// ── the surfaces ────────────────────────────────────────────────────────────
// Each returns a small, order-stable value. Keep them cheap: this runs often.

export const SURFACES = {
  /** What Layout destructures. A page that passes the wrong prop renders anonymous. */
  'layout.props': () => {
    const m = read('src/layouts/Layout.astro').match(/const\s*\{([^}]*)\}\s*=\s*Astro\.props/);
    return m ? m[1].split(',').map((s) => s.trim().split(':')[0].trim()).filter(Boolean).sort() : [];
  },

  /** Route files declaring their own paths array, and whether every locale twin agrees. */
  'routes.paths': () => {
    const all = ls('"src/apps/*/pages/**"').filter((f) => /\.(astro|ts)$/.test(f))
      .filter((f) => read(f).includes('export const paths'));
    const base = all.filter((f) => !f.includes('[locale]'));
    let agree = 0, pairs = 0;
    for (const f of base) {
      const twin = f.replace('/pages/', '/pages/[locale]/');
      if (!all.includes(twin)) continue;
      pairs++;
      const keys = (s) => [...s.matchAll(/\["([^"]+)"/g)].map((m) => m[1]).sort().join('|');
      if (keys(read(f)) === keys(read(twin))) agree++;
    }
    return { files: all.length, pairs, agree };
  },

  /** Directories whose content is chrome rather than page content. */
  'l10n.sharedDirs': () => {
    const m = read('src/utils/l10n/policy.ts').match(/SHARED_DIRS[^=]*=\s*\[([^\]]*)\]/s);
    return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).sort() : [];
  },

  /** Files where a localized list must not inherit an English tail. */
  'l10n.overlayGuarded': () => {
    const m = read('src/utils/l10n/policy.ts').match(/OVERLAY_GUARDED_TAILS[^=]*=\s*\[([^\]]*)\]/s);
    return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).sort() : [];
  },

  /** The structured-data page types a generated page may declare. */
  'jsonld.pageTypes': () => {
    const m = read('src/utils/json-ld/types.ts').match(/export type PageType\s*=([^;]*);/s);
    return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).sort() : [];
  },

  /** The quality gates available to verify generated work. */
  'gates': () => {
    try {
      return Object.keys(JSON.parse(read('package.json')).scripts ?? {})
        .filter((k) => k.startsWith('check:')).sort();
    } catch { return []; }
  },

  /** Content trees. A new one means content moved. */
  'content.trees': () => [...new Set(ls('"src/content/json/*/en/**/*.json"')
    .map((f) => f.split('/')[3]))].sort(),

  /** Section-component idiom, coarse — buckets, not exact counts, so noise does not fire. */
  'sections.idiom': () => {
    const files = ls('"src/components/sections/**/*.astro"');
    if (!files.length) return {};
    let props = 0, snake = 0;
    for (const f of files) {
      if (/\binterface\s+Props\b/.test(read(f))) props++;
      if (/^[a-z0-9]+(_[a-z0-9]+)*\.astro$/.test(f.split('/').pop())) snake++;
    }
    const bucket = (n) => Math.round((n / files.length) * 10) * 10;
    return { count: Math.round(files.length / 25) * 25, propsPct: bucket(props), snakePct: bucket(snake) };
  },

  /** The semantic colour class layer. Repointing these re-themes the site. */
  'tokens.ironClasses': () => {
    const css = read('src/assets/styles/iron.css');
    return [...css.matchAll(/\.(iron_[a-z_]+--[a-z_0-9]+)\s*\{([^}]*)\}/g)]
      .filter((m) => /#[0-9a-fA-F]{3,6}\b/.test(m[2])).map((m) => m[1]).sort();
  },
};

/**
 * A surface that captured nothing reports a stable codebase forever, which is the
 * same shape as good news. Shared by --self-test and the emit path so both agree
 * on what "captured nothing" means.
 */
const isEmptyValue = (v) => {
  if (v == null || v === '') return true;
  if (Array.isArray(v)) return !v.length;
  if (typeof v === 'object') {
    if (v.error) return true;
    const vals = Object.values(v);
    // An all-zero tally counted nothing, the same as an absent one. routes.paths
    // returns {files, pairs, agree}, so a bare key check would call it populated.
    return !vals.length || vals.every((x) => x === 0 || isEmptyValue(x));
  }
  return false;
};

const emptySurfaces = (snap) => Object.entries(snap).filter(([, v]) => isEmptyValue(v.value));

/**
 * Being IN a git repository is not the same as being in the TARGET one. Every
 * surface empty means this is some other repository. Both the self-test and the
 * emit path refuse here, with the same words and the same exit code (2, misaimed),
 * so a bare `--self-test` run in the wrong directory says "point --root at the
 * target" instead of reporting nine failures in a tool that is not broken.
 */
function refuseIfNotTarget(snap) {
  if (emptySurfaces(snap).length !== Object.keys(snap).length) return;
  console.error(
    `No load-bearing surface found in: ${ROOT}\n\n`
    + `This is a git repository, but not the target Astro one — all `
    + `${Object.keys(snap).length} surfaces captured empty. Point --root at it:\n`
    + `  node fingerprint.mjs --root=/path/to/iron-websites\n`
    + `or run from inside that repository.`,
  );
  process.exit(2);
}

function capture() {
  const out = {};
  for (const [k, fn] of Object.entries(SURFACES)) {
    let v; try { v = fn(); } catch (e) { v = { error: String(e.message).slice(0, 80) }; }
    out[k] = { hash: h(v), value: v };
  }
  return out;
}

// ── self-test ───────────────────────────────────────────────────────────────
if (process.argv.includes('--self-test')) {
  const base = capture();
  refuseIfNotTarget(base);              // wrong directory is exit 2, not nine FAILs
  const empty = emptySurfaces(base);   // some empty inside the target IS a failure
  let bad = 0;
  if (empty.length) {
    for (const [k, v] of empty) console.log(`FAIL ${k} captured nothing: ${JSON.stringify(v.value).slice(0, 60)}`);
    bad += empty.length;
  }
  // a hash must move when its input moves
  for (const [k, fn] of Object.entries(SURFACES)) {
    const v = fn();
    const mutated = Array.isArray(v) ? [...v, '__planted__'] : { ...v, __planted__: 1 };
    if (h(mutated) === h(v)) { console.log(`FAIL ${k} hash did not move on a planted change`); bad++; }
  }
  console.log(bad
    ? `SELF-TEST FAILED (${bad})`
    : `SELF-TEST PASSED — all ${Object.keys(SURFACES).length} surfaces captured non-empty and every hash moves on a planted change`);
  process.exit(bad ? 1 : 0);
}

// ── hook mode ───────────────────────────────────────────────────────────────
// Wired to SessionStart. Must be silent and exit 0 anywhere that is not a target
// repository — a hook that shouts in every unrelated project gets disabled, and
// a disabled hook checks nothing.
if (process.argv.includes('--hook')) {
  const stored = `${ROOT}/docs/web-devs/figma-to-astro/fingerprint.json`;
  if (!existsSync(stored)) process.exit(0);          // not a target repo — say nothing
  let was;
  try { was = JSON.parse(readFileSync(stored, 'utf8')).surfaces ?? {}; } catch { process.exit(0); }
  let now2;
  try { now2 = capture(); } catch { process.exit(0); }  // never break a session start
  const moved = Object.keys(now2).filter((k) => was[k]?.hash !== now2[k].hash);
  if (moved.length) {
    console.log(`figma-astro: ${moved.length} load-bearing surface(s) moved since the generator last looked — ${moved.join(', ')}`);
    console.log('  re-derive against them before generating; write a note only if the change cost something');
  }
  process.exit(0);
}

// ── compare / emit ──────────────────────────────────────────────────────────
const now = capture();

// Emit nothing from the wrong repository — a fingerprint of nine empty surfaces
// would compare clean against anything forever.
refuseIfNotTarget(now);

const prior = process.argv.find((a) => a.startsWith('--against='))?.slice(10);

if (prior && existsSync(prior)) {
  const was = JSON.parse(readFileSync(prior, 'utf8')).surfaces ?? {};
  const moved = [];
  for (const k of Object.keys(now)) if (was[k]?.hash !== now[k].hash) moved.push(k);
  for (const k of Object.keys(was)) if (!(k in now)) moved.push(`${k} (surface removed)`);
  if (!moved.length) { console.log('unchanged — no load-bearing surface has moved'); process.exit(0); }
  console.log(`${moved.length} surface(s) moved since the last capture:\n`);
  for (const k of moved) {
    console.log(`  ${k}`);
    const a = was[k]?.value, b = now[k]?.value;
    if (Array.isArray(a) && Array.isArray(b)) {
      const add = b.filter((x) => !a.includes(x)), rm = a.filter((x) => !b.includes(x));
      if (add.length) console.log(`    + ${add.join(', ')}`);
      if (rm.length) console.log(`    - ${rm.join(', ')}`);
    } else {
      console.log(`    was ${JSON.stringify(a)}`);
      console.log(`    now ${JSON.stringify(b)}`);
    }
  }
  console.log('\nRe-derive against these before generating, and write a note if the change cost anything.');
  process.exit(1);
}

console.log(JSON.stringify({
  $comment: 'GENERATED. Fingerprint of the surfaces a page generator depends on. '
    + 'Not a convention snapshot — conventions are derived at generation time. '
    + 'Regenerate: node fingerprint.mjs > fingerprint.json',
  captured: new Date().toISOString().slice(0, 10),
  surfaces: now,
}, null, 1));
