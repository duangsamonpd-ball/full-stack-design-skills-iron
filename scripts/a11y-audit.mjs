#!/usr/bin/env node
// Accessibility-tree audit for the repo's HTML examples.
// Checks the semantics a screen reader consumes — accessible names, labels,
// landmarks, heading structure, aria-* idref integrity, duplicate ids.
// (Colour-contrast and actual speech need a real browser / VoiceOver — out of scope.)
//
// Usage:  node a11y-audit.mjs [file.html ...]   (no args = audit all repo HTML)
// Exit:   non-zero if any real FAIL is found (suitable as a CI gate).

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const rel = (f) => path.relative(repoRoot, f) || f;

/**
 * Pages that only exist once something is built. A missing one is a hole in the gate,
 * not a page to quietly drop — skipping it silently is how the Astro output went
 * unaudited in CI while passing locally.
 */
const BUILT_PAGES = [
  {
    file: path.join(repoRoot, 'astro-registration-m3', 'dist', 'index.html'),
    build: 'cd astro-registration-m3 && npm ci && npm run build',
  },
];

function discover() {
  const list = fs.readdirSync(repoRoot).filter((f) => f.endsWith('.html')).map((f) => path.join(repoRoot, f));
  const missing = [];
  for (const { file, build } of BUILT_PAGES) {
    if (fs.existsSync(file)) list.push(file);
    else missing.push({ file, build });
  }
  if (missing.length) {
    console.error(`\n\x1b[31m✖  ${missing.length} page(s) expected but not built — the audit would be incomplete\x1b[0m`);
    for (const { file, build } of missing) console.error(`    ${rel(file)}\n      build it with:  ${build}`);
    console.error('');
    process.exit(1);
  }
  return list.sort();
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : discover();
if (!files.length) { console.error('No HTML files found to audit.'); process.exit(2); }

const nameOf = (doc, el) => {
  const lb = el.getAttribute('aria-labelledby');
  if (lb) { const t = lb.split(/\s+/).map((id) => doc.getElementById(id)?.textContent || '').join(' ').trim(); if (t) return t; }
  const al = el.getAttribute('aria-label'); if (al && al.trim()) return al.trim();
  if (el.id) { const lab = [...doc.querySelectorAll('label[for]')].find((l) => l.getAttribute('for') === el.id); if (lab && lab.textContent.trim()) return lab.textContent.trim(); }
  const wrap = el.closest('label'); if (wrap && wrap.textContent.trim()) return wrap.textContent.trim();
  if (el.textContent && el.textContent.trim()) return el.textContent.trim();
  const title = el.getAttribute('title'); if (title && title.trim()) return title.trim();
  const ph = el.getAttribute('placeholder'); if (ph && ph.trim()) return `(placeholder only: "${ph.trim()}")`;
  return '';
};

let grandFail = 0, grandWarn = 0;

for (const file of files) {
  let html;
  try { html = fs.readFileSync(file, 'utf8'); } catch { console.log(`\n=== ${rel(file)} === (unreadable, skipped)`); continue; }
  const doc = new JSDOM(html).window.document;
  const fail = [], warn = [], pass = [];

  const lang = doc.documentElement.getAttribute('lang');
  lang ? pass.push(`<html lang="${lang}">`) : fail.push('<html> missing lang attribute');

  doc.querySelector('main') ? pass.push('has <main> landmark') : warn.push('no <main> landmark');

  const heads = [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const h1 = heads.filter((h) => h.tagName === 'H1');
  if (h1.length === 0) fail.push('no <h1> on the page');
  else if (h1.length === 1) pass.push('exactly one <h1>');
  else warn.push(`${h1.length} <h1> in source — fine if inactive views are display:none (a screen reader sees one at a time)`);
  let prev = 0;
  for (const h of heads) { const l = +h.tagName[1]; if (prev && l > prev + 1) warn.push(`heading jump h${prev}->h${l} at "${h.textContent.trim().slice(0, 32)}"`); prev = l; }

  const idc = {};
  for (const el of doc.querySelectorAll('[id]')) idc[el.id] = (idc[el.id] || 0) + 1;
  const dups = Object.entries(idc).filter(([, n]) => n > 1).map(([i]) => i);
  dups.length ? fail.push(`duplicate id(s): ${dups.join(', ')}`) : pass.push('no duplicate ids');

  let brokenRef = 0;
  for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
    for (const el of doc.querySelectorAll(`[${attr}]`)) {
      for (const ref of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) {
        if (!doc.getElementById(ref)) { fail.push(`${attr}="${ref}" points to a missing id`); brokenRef++; }
      }
    }
  }
  if (!brokenRef) pass.push('all aria-* idrefs resolve');

  const interactive = [...doc.querySelectorAll('button, a[href], [role=tab], [role=switch]')];
  let unnamed = 0;
  for (const el of interactive) if (!nameOf(doc, el)) { fail.push(`no accessible name: <${el.tagName.toLowerCase()}${el.id ? ` #${el.id}` : ''}>`); unnamed++; }
  if (!unnamed) pass.push(`all ${interactive.length} buttons/links/tabs are named`);

  let unlabeled = 0;
  for (const inp of doc.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]), select, textarea')) {
    const n = nameOf(doc, inp);
    if (!n || n.startsWith('(placeholder')) { fail.push(`form field lacks a real label: <input${inp.id ? ` #${inp.id}` : ''} type="${inp.getAttribute('type') || 'text'}"> ${n}`); unlabeled++; }
  }
  if (!unlabeled) pass.push('all form fields have a programmatic label');

  for (const t of doc.querySelectorAll('[role=tab]')) {
    if (!t.hasAttribute('aria-selected')) warn.push('role=tab missing aria-selected');
    if (!t.getAttribute('aria-controls')) warn.push('role=tab missing aria-controls');
  }
  for (const img of doc.querySelectorAll('img')) if (!img.hasAttribute('alt')) warn.push('<img> missing alt attribute');

  const out = [`\n=== ${rel(file)} ===`, `  ${fail.length} FAIL · ${warn.length} WARN · ${pass.length} checks passed`];
  pass.forEach((p) => out.push(`   ✓ ${p}`));
  warn.forEach((w) => out.push(`   ⚠ ${w}`));
  fail.forEach((f) => out.push(`   ✗ ${f}`));
  console.log(out.join('\n'));
  grandFail += fail.length; grandWarn += warn.length;
}

console.log(`\n──────────\n${files.length} page(s) · ${grandFail} FAIL · ${grandWarn} WARN`);
console.log('Audits the accessibility tree (names/roles/states/refs/structure). Colour-contrast + speech need a browser / VoiceOver.');
process.exit(grandFail ? 1 : 0);
