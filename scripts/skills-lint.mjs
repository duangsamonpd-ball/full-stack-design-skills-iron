#!/usr/bin/env node
/**
 * Iron Software Skills — structural lint for .claude/skills/*
 *
 * A skill only works if its plumbing is intact: the folder name Claude loads
 * must equal the `name:` it selects on, the `description:` is what triggers it,
 * and any `references/…md` the SKILL.md promises for on-demand depth must exist —
 * including the cross-skill pointers ("<other-skill> → `references/x.md`") this
 * package uses to keep neighbouring skills disambiguated.
 *
 * This asserts all of that, so a renamed folder, a dropped reference, or a typo'd
 * description can't ship silently.
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
const SKILLS = process.argv[2]
  ? resolve(process.argv[2].replace(/^~(?=$|\/)/, process.env.HOME ?? '~'))
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

let refChecks = 0;
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
}

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

console.log(`\n\x1b[32m✔  ${skillNames.length} skills lint clean — names match folders, descriptions present, ${refChecks} references resolve\x1b[0m\n`);
