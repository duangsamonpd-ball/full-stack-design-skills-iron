#!/usr/bin/env node
/**
 * Iron Software Skills — structural lint for .claude/skills/*
 *
 * A skill only works if its plumbing is intact: the folder name Claude loads
 * must equal the `name:` it selects on, the `description:` is what triggers it,
 * and any `references/…md` the SKILL.md promises for on-demand depth must exist —
 * including the cross-skill pointers ("<other-skill> → `references/x.md`") this
 * package uses to keep neighbouring skills disambiguated. A skill named in PROSE
 * has to resolve too: a rename keeps the folder and `name:` in step and leaves
 * every **bold** mention of the old name in the other fifteen files pointing at
 * nothing, because a bold word is not a path.
 *
 * This asserts all of that, so a renamed folder, a dropped reference, a stale
 * pointer, or a typo'd description can't ship silently.
 *
 * Run:  node scripts/skills-lint.mjs [skills-dir]
 *       …with no argument it lints this repo's .claude/skills; pass a path to
 *       check an installed set instead, e.g. ~/.claude/skills (symlinks are followed).
 * Exit: 0 = clean (warnings allowed) · 1 = a real problem
 *
 * Zero dependencies — plain Node, runs in CI with no install.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const SKILLS = ARGS[0]
  ? resolve(ARGS[0].replace(/^~(?=$|\/)/, process.env.HOME ?? '~'))
  : join(ROOT, '.claude/skills');

const errors = [];
const warnings = [];
const err = (skill, msg) => errors.push({ skill, msg });
const warn = (skill, msg) => warnings.push({ skill, msg });

/* every skill folder (a directory holding a SKILL.md) */
const skillNames = readdirSync(SKILLS).filter((n) => {
  const p = join(SKILLS, n);
  return statSync(p).isDirectory() && existsSync(join(p, 'SKILL.md'));
});
const known = new Set(skillNames);

/** pull `name` / `description` out of the leading --- frontmatter --- block */
function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

/**
 * Which skill owns the `references/<file>` at `idx` on `line`. The convention is
 * "<other-skill> → `references/file.md`", so if a known skill name appears before
 * the ref with a `→` between them, the file lives in that neighbour; otherwise
 * it's the skill's own reference.
 */
function targetSkill(ownName, line, idx) {
  const before = line.slice(0, idx);
  let best = null;
  for (const name of known) {
    let from = 0, at;
    while ((at = before.indexOf(name, from)) !== -1) {
      if (before.slice(at + name.length).includes('→')) best = { name, at };
      from = at + name.length;
    }
  }
  return best ? best.name : ownName;
}


/* ── a skill named in PROSE must resolve, the same as one named in a link ──
 *
 * Check 1 keeps `name:` and the folder in step through a rename. It says
 * nothing about the fifteen other files that name that skill in prose — a
 * "Next steps" pointer, a disambiguating aside — and those go stale silently,
 * because a bold word is not a path and nothing was ever going to open it.
 *
 * So: kebab-case tokens written as **bold** or `code` are compared with the
 * known skill names. An exact match is the normal case and is fine. A NEAR
 * match — within 3 edits, or sharing two whole segments — is the tell that a
 * pointer was left behind by a rename, a typo, or a shortened name. Ordinary
 * kebab-case (`prefers-color-scheme`, `data-theme`, **mobile-first**) is near
 * nothing and stays silent, which is what makes the check usable at all.
 */
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 4) return 99; // can't come within 3
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** the known skill a kebab token was probably meant to be, or null */
function nearestSkill(token, names) {
  if (names.has(token)) return null; // resolves — nothing to report
  const segs = new Set(token.split('-'));
  for (const n of names) {
    const shared = n.split('-').filter((s) => segs.has(s)).length;
    if (levenshtein(token, n) <= 3 || shared >= 2) return n;
  }
  return null;
}

/** every near-miss in `src`, as [token, meant] pairs */
function staleSkillNames(src, names) {
  const out = [];
  for (const m of src.matchAll(/\*\*([a-z0-9]+(?:-[a-z0-9]+)+)\*\*|`([a-z0-9]+(?:-[a-z0-9]+)+)`/g)) {
    const token = m[1] ?? m[2];
    const meant = nearestSkill(token, names);
    if (meant) out.push([token, meant]);
  }
  return out;
}

/* The self-test runs on every invocation — it is pure string work, it costs
 * about a millisecond, and a refusal case that only runs when someone passes a
 * flag is a refusal case nobody runs. Both halves, as always: each PLANT must
 * be reported, and each CONTROL must stay silent. One half alone cannot tell a
 * working check from one that fires on everything. */
function selfTestNameCheck(names) {
  const plants = [
    '- Pair with **web-accessibility-wcag** as a CI gate',   // renamed skill
    'see **design-token-system** for the layers',            // typo'd skill
    'use `figma-expert` for sync',                           // shortened skill
  ];
  const controls = [
    '`prefers-color-scheme`', '`aria-live`', '**mobile-first**',
    '`data-theme`', '`build-thumbs.mjs`', '`min-content`', '`sr-only`',
  ];
  const missed = plants.filter((p) => staleSkillNames(p, names).length === 0);
  const fired = controls.filter((c) => staleSkillNames(c, names).length > 0);
  return { missed, fired };
}

let refChecks = 0;
let nameChecks = 0;
for (const name of skillNames) {
  const dir = join(SKILLS, name);
  const src = readFileSync(join(dir, 'SKILL.md'), 'utf8');

  // 1 — frontmatter + name + description
  const fm = frontmatter(src);
  if (!fm) { err(name, 'SKILL.md has no `--- … ---` frontmatter block'); continue; }
  if (!fm.name) err(name, 'frontmatter is missing `name:`');
  else if (fm.name !== name) err(name, `\`name: ${fm.name}\` must match the folder name \`${name}\``);
  if (fm.name && !/^[a-z0-9-]+$/.test(fm.name)) err(name, `\`name: ${fm.name}\` must be lowercase letters, numbers and hyphens only`);
  if (!fm.description) err(name, 'frontmatter is missing `description:` — this is what auto-selects the skill');
  else {
    if (fm.description.length > 1024) warn(name, `description is ${fm.description.length} chars — keep it tight (< 1024)`);
    if (!/use when|use this/i.test(fm.description)) warn(name, 'description has no "Use when …" trigger phrases — auto-selection may be unreliable');
  }

  // 2 — every references/… the SKILL.md points at must resolve (own or cross-skill)
  const linked = new Set();
  for (const line of src.split('\n')) {
    for (const m of line.matchAll(/references\/([A-Za-z0-9._-]+\.md)/g)) {
      refChecks++;
      const file = m[1];
      const owner = targetSkill(name, line, m.index);
      if (owner === name) linked.add(file);
      const path = join(SKILLS, owner, 'references', file);
      if (!existsSync(path)) {
        const where = owner === name ? `references/${file}` : `${owner} → references/${file}`;
        err(name, `broken reference: \`${where}\` does not exist`);
      }
    }
  }

  // 3 — reference files on disk that nothing in this SKILL.md links (warn only)
  const refDir = join(dir, 'references');
  if (existsSync(refDir)) {
    for (const f of readdirSync(refDir)) {
      if (!linked.has(f)) warn(name, `references/${f} is on disk but not linked from SKILL.md`);
    }
  }

  // 4 — a skill named in prose must resolve (SKILL.md and its references)
  const prose = [['SKILL.md', src]];
  if (existsSync(refDir)) {
    for (const f of readdirSync(refDir).filter((f) => f.endsWith('.md'))) {
      prose.push([`references/${f}`, readFileSync(join(refDir, f), 'utf8')]);
    }
  }
  for (const [where, text] of prose) {
    nameChecks++;
    for (const [token, meant] of staleSkillNames(text, known)) {
      err(name, `${where} names \`${token}\`, which is not a skill — did it mean \`${meant}\`?`);
    }
  }
}

/* ── the name check is an instrument too — prove it can fail, every run ──── */

const st = selfTestNameCheck(known);
for (const p of st.missed) err('skills-lint', `self-test: name check did NOT report a planted stale name — ${p}`);
for (const c of st.fired) err('skills-lint', `self-test: name check fired on an ordinary kebab-case control — ${c}`);

/* ── report ──────────────────────────────────────────────────────────────── */

const group = (list) => {
  const by = new Map();
  for (const it of list) (by.get(it.skill) ?? by.set(it.skill, []).get(it.skill)).push(it.msg);
  return by;
};

if (warnings.length) {
  console.log(`\n\x1b[33m⚠  ${warnings.length} warning${warnings.length > 1 ? 's' : ''}\x1b[0m`);
  for (const [skill, msgs] of group(warnings)) {
    console.log(`\n  ${skill}`);
    for (const m of msgs) console.log(`    · ${m}`);
  }
}

if (errors.length) {
  console.log(`\n\x1b[31m✖  ${errors.length} problem${errors.length > 1 ? 's' : ''} found\x1b[0m`);
  for (const [skill, msgs] of group(errors)) {
    console.log(`\n  \x1b[1m${skill}\x1b[0m`);
    for (const m of msgs) console.log(`    \x1b[31m✖\x1b[0m ${m}`);
  }
  console.log('');
  process.exit(1);
}

console.log(`\n\x1b[32m✔  ${skillNames.length} skills lint clean — names match folders, descriptions present, ${refChecks} references resolve, ${nameChecks} files carry no stale skill name\x1b[0m\n`);
