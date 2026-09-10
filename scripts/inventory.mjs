/**
 * Colour inventory of the iron-websites Astro codebase.
 *
 * For every colour literal and every CSS custom property: the value, how many
 * times, WHERE (file) and HOW (the role — text / background / border / fill /
 * gradient stop / shadow / token definition).
 *
 * Role is what makes this useful: the design system's semantic tokens are
 * role-based, so "#181818 is `color:` 400 times and `background` twice" is the
 * evidence that maps it to --color-text-*, not --color-bg-*.
 *
 * --self-test plants a fixture with known answers and fails if any role is
 * mis-detected. A scanner that classified everything as "other" would otherwise
 * look like a complete inventory.
 *
 * Usage: node inventory.mjs --root=<astro site> --ds=<design system> <out.json>
 * Neither root has a default. This reads two unrelated repositories and can
 * derive neither from the other, so any default would only be one machine's
 * layout — which is what this carried until 10 Sep 2026.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

// role of a colour written in CSS, decided by the declaration it sits in
const CSS_ROLE = [
  [/(?:^|[;{])\s*--[a-zA-Z0-9_-]+\s*:[^;{]*$/, 'token-def'],
  [/\b(?:box-shadow|text-shadow|drop-shadow)\s*:?[^;{]*$/, 'shadow'],
  [/\b(?:linear|radial|conic)-gradient\s*\([^;{]*$/, 'gradient'],
  [/\b(?:background|background-color|background-image)\s*:[^;{]*$/, 'background'],
  [/\b(?:border[a-z-]*|outline[a-z-]*)\s*:[^;{]*$/, 'border'],
  [/\bfill\s*:[^;{]*$/, 'fill'],
  [/\bstroke\s*:[^;{]*$/, 'stroke'],
  [/\b(?:color|caret-color|text-decoration-color|accent-color)\s*:[^;{]*$/, 'text'],
  [/\bfont\s*:[^;{]*$/, 'text'],
];

// role of a colour written as a Tailwind arbitrary value, by utility family
const UTIL_ROLE = {
  text: 'text', bg: 'background', border: 'border', ring: 'border',
  outline: 'border', divide: 'border', fill: 'fill', stroke: 'stroke',
  shadow: 'shadow', caret: 'text', decoration: 'text', accent: 'text',
  placeholder: 'text', from: 'gradient', via: 'gradient', to: 'gradient',
};

function cssRole(decl) {
  for (const [re, role] of CSS_ROLE) if (re.test(decl)) return role;
  return 'other';
}

const lineOf = (text, i) => text.slice(0, i).split('\n').length;

const norm = (h) => (h.length === 4
  ? '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  : h.slice(0, 7)).toLowerCase();

function push(out, hex, role, surface, file, line) {
  const h = norm(hex);
  const r = out.get(h) ?? { hex: h, total: 0, roles: {}, surfaces: {}, files: {}, at: [] };
  r.total++;
  r.roles[role] = (r.roles[role] ?? 0) + 1;
  r.surfaces[surface] = (r.surfaces[surface] ?? 0) + 1;
  r.files[file] = (r.files[file] ?? 0) + 1;
  if (r.at.length < 400) r.at.push(file + ':' + line + ':' + role);
  out.set(h, r);
}

function scanText(text, surface, file, out) {
  const claimed = new Set();

  // Tailwind arbitrary values carry their own role in the utility prefix
  for (const m of text.matchAll(/(?:^|[\s"'`:])(-?[a-z][a-z0-9-]*)-\[(#[0-9a-fA-F]{3,8})\]/g)) {
    const fam = m[1].replace(/^-/, '').split('-')[0];
    push(out, m[2], UTIL_ROLE[fam] ?? 'other', surface, file, lineOf(text, m.index));
    claimed.add(m.index + m[0].indexOf(m[2]));
  }
  // SVG presentation attributes
  for (const m of text.matchAll(/\b(fill|stroke|stop-color|flood-color)\s*=\s*["'](#[0-9a-fA-F]{3,8})["']/g)) {
    const role = m[1] === 'fill' ? 'fill' : m[1] === 'stroke' ? 'stroke' : 'other';
    push(out, m[2], role, surface, file, lineOf(text, m.index));
    claimed.add(m.index + m[0].indexOf(m[2]));
  }
  // everything else: look back to the start of the declaration
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
    if (claimed.has(m.index)) continue;
    const chunk = text.slice(Math.max(0, m.index - 400), m.index);
    const cut = Math.max(chunk.lastIndexOf(';'), chunk.lastIndexOf('{'), chunk.lastIndexOf('}'));
    push(out, m[0], cssRole(chunk.slice(cut + 1)), surface, file, lineOf(text, m.index));
  }
}

// ── self-test ───────────────────────────────────────────────────────────────
if (process.argv.includes('--self-test')) {
  const cssFix = [
    ':root { --brand: #111111; }',
    '.a { color: #222222; background: #333333; border: 1px solid #444444; }',
    '.b { background: linear-gradient(0deg, #555555 0%, #666666 100%); }',
    '.c { box-shadow: 0 0 4px #777777; fill: #888888; stroke: #999999; }',
  ].join('\n');
  const mkFix = '<div class="text-[#aaaaaa] bg-[#bbbbbb] border-[#cccccc] from-[#dddddd]">'
    + '<svg><path fill="#eeeeee" stroke="#0f0f0f"/></svg>';
  const out = new Map();
  scanText(cssFix, 'css', 'fix.css', out);
  scanText(mkFix, 'markup', 'fix.astro', out);
  const want = {
    '#111111': 'token-def', '#222222': 'text', '#333333': 'background',
    '#444444': 'border', '#555555': 'gradient', '#666666': 'gradient',
    '#777777': 'shadow', '#888888': 'fill', '#999999': 'stroke',
    '#aaaaaa': 'text', '#bbbbbb': 'background', '#cccccc': 'border',
    '#dddddd': 'gradient', '#eeeeee': 'fill', '#0f0f0f': 'stroke',
  };
  let bad = 0;
  for (const [hex, role] of Object.entries(want)) {
    const got = Object.keys(out.get(hex)?.roles ?? {})[0];
    if (got !== role) { console.log('FAIL ' + hex + ': got ' + (got ?? 'MISSING') + ', want ' + role); bad++; }
  }
  if (out.size !== Object.keys(want).length) {
    console.log('FAIL: found ' + out.size + ' colours, want ' + Object.keys(want).length); bad++;
  }
  console.log(bad ? 'SELF-TEST FAILED (' + bad + ')'
    : 'SELF-TEST PASSED — all ' + Object.keys(want).length + ' roles detected correctly');
  process.exit(bad ? 1 : 0);
}

// ── roots ───────────────────────────────────────────────────────────────────
// Resolved below the self-test on purpose: --self-test runs on a planted
// fixture and needs neither repository, so requiring them would make the one
// check that can run without a checkout the one that refuses to.
const flag = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const ROOT = flag('root');
const DS = flag('ds');
const OUT = process.argv.slice(2).find((a) => !a.startsWith('--'));

if (!ROOT || !DS || !OUT) {
  console.error(
    'Usage: node inventory.mjs --root=<astro site> --ds=<design system> <out.json>\n\n'
    + '  --root  the Astro repository to inventory\n'
    + '  --ds    the design system to cross-reference its colours against\n'
    + '  out     where to write the JSON\n\n'
    + 'Neither root has a default: this reads two unrelated repositories and can\n'
    + 'derive neither from the other.',
  );
  process.exit(2);
}

try {
  execSync('git rev-parse --show-toplevel', { cwd: ROOT, stdio: 'pipe' });
} catch {
  console.error(`Not a git repository: ${ROOT}\n\n--root must be the Astro repository this inventories.`);
  process.exit(2);
}

const DS_TOKENS = ['tailwind/tokens.css', 'tailwind/colors.css', 'tailwind/theme.css'];
for (const f of DS_TOKENS) {
  if (!existsSync(`${DS}/${f}`)) {
    console.error(
      `Not the design system: ${DS}\n\n`
      + `--ds must be a checkout of my-guide-irondesign; ${f} is missing.\n`
      + `Without it every colour would cross-reference against nothing and the\n`
      + `inventory would report the codebase as using no design-system token.`,
    );
    process.exit(2);
  }
}

// ── corpus ──────────────────────────────────────────────────────────────────
const files = execSync(
  'git ls-files -- src/components src/render src/layouts src/assets/styles src/apps/ironsoftware/pages src/apps/ironpdf/pages',
  { cwd: ROOT, maxBuffer: 1 << 28 }
).toString().trim().split('\n').filter((f) => /\.(astro|css)$/.test(f));

const colours = new Map();
const varDef = new Map(), varRead = new Map();

for (const f of files) {
  const src = readFileSync(ROOT + '/' + f, 'utf8');
  if (f.endsWith('.css')) {
    scanText(src, 'external-css', f, colours);
  } else {
    let css = '', rest = '', i = 0;
    const re = /<style[^>]*>([\s\S]*?)<\/style>/g;
    let m;
    while ((m = re.exec(src))) { rest += src.slice(i, m.index); css += m[1]; i = re.lastIndex; }
    rest += src.slice(i);
    scanText(css, 'inline-style', f, colours);
    scanText(rest, 'markup', f, colours);
  }
  for (const m of src.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;{}\n]+)/g)) {
    const r = varDef.get(m[1]) ?? { name: m[1], values: {}, files: {} };
    const v = m[2].trim().slice(0, 90);
    r.values[v] = (r.values[v] ?? 0) + 1;
    r.files[f] = (r.files[f] ?? 0) + 1;
    varDef.set(m[1], r);
  }
  for (const m of src.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(,)?/g)) {
    const r = varRead.get(m[1]) ?? { name: m[1], reads: 0, withFallback: 0, files: {} };
    r.reads++;
    if (m[2]) r.withFallback++;
    r.files[f] = (r.files[f] ?? 0) + 1;
    varRead.set(m[1], r);
  }
}

// ── design-system cross-reference ───────────────────────────────────────────
const dsSrc = DS_TOKENS.map((f) => readFileSync(DS + '/' + f, 'utf8')).join('\n');
const dsPrim = new Map(), dsAll = new Map();
for (const m of dsSrc.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*(#[0-9A-Fa-f]{6})\b/g)) {
  const h = m[2].toLowerCase();
  if (!dsAll.has(h)) dsAll.set(h, []);
  if (!dsAll.get(h).includes(m[1])) dsAll.get(h).push(m[1]);
  if (/^--(iron|slate|neutral)-/.test(m[1]) && !dsPrim.has(m[1])) dsPrim.set(m[1], h);
}
const dsNames = new Set([...dsSrc.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map((m) => m[1]));

const sr = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
function lab(h) {
  const r = sr(parseInt(h.slice(1, 3), 16)), g = sr(parseInt(h.slice(3, 5), 16)), b = sr(parseInt(h.slice(5, 7), 16));
  let X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  [X, Y, Z] = [f(X), f(Y), f(Z)];
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
}
const dE = (a, b) => { const A = lab(a), B = lab(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };

const colourRows = [...colours.values()].sort((a, b) => b.total - a.total).map((r) => {
  let bn = null, bd = 1e9;
  for (const [n, h] of dsPrim) { const d = dE(r.hex, h); if (d < bd) { bd = d; bn = n; } }
  return {
    hex: r.hex,
    total: r.total,
    roles: r.roles,
    surfaces: r.surfaces,
    dsExact: dsAll.get(r.hex) ?? null,
    nearest: bn,
    nearestHex: dsPrim.get(bn),
    deltaE: +bd.toFixed(2),
    fileCount: Object.keys(r.files).length,
    topFiles: Object.entries(r.files).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([file, n]) => ({ file, n })),
    at: r.at,
  };
});

const varRows = [...varRead.values()].map((v) => {
  const d = varDef.get(v.name);
  return {
    name: v.name,
    reads: v.reads,
    withFallback: v.withFallback,
    definedHere: Boolean(d),
    definedIn: d ? Object.keys(d.files).slice(0, 8) : [],
    values: d ? Object.keys(d.values).slice(0, 6) : [],
    inDesignSystem: dsNames.has(v.name),
    fileCount: Object.keys(v.files).length,
    topFiles: Object.entries(v.files).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([file, n]) => ({ file, n })),
  };
}).sort((a, b) => b.reads - a.reads);

// custom properties defined but never read — dead weight worth reporting
const defOnly = [...varDef.values()].filter((d) => !varRead.has(d.name))
  .map((d) => ({ name: d.name, values: Object.keys(d.values).slice(0, 4), definedIn: Object.keys(d.files).slice(0, 6) }));

writeFileSync(OUT, JSON.stringify({
  generated: '2026-09-04',
  purpose: 'Complete colour and custom-property inventory of the iron-websites Astro codebase, '
    + 'cross-referenced against the Iron Software design system, for the Figma to Astro handover.',
  corpus: {
    paths: ['src/components', 'src/render', 'src/layouts', 'src/assets/styles', 'src/apps/*/pages'],
    excluded: ['src/content/**', 'src/public/**', 'src/apps/*/public/**'],
    files: files.length,
  },
  roleLegend: {
    text: 'color / caret-color / font shorthand / text-[#] utility',
    background: 'background / background-color / background-image / bg-[#]',
    gradient: 'a stop inside linear|radial|conic-gradient, or from|via|to-[#]',
    border: 'border* / outline* / ring-[#] / divide-[#]',
    fill: 'CSS fill: or SVG fill= or fill-[#]',
    stroke: 'CSS stroke: or SVG stroke= or stroke-[#]',
    shadow: 'box-shadow / text-shadow / drop-shadow',
    'token-def': 'the value of a CSS custom property declaration',
    other: 'unclassified — inspect the `at` entries',
  },
  totals: {
    distinctColours: colourRows.length,
    colourOccurrences: colourRows.reduce((s, r) => s + r.total, 0),
    customPropertiesRead: varRows.length,
    customPropertiesDefined: varDef.size,
    definedNeverRead: defOnly.length,
  },
  colours: colourRows,
  customProperties: varRows,
  definedNeverRead: defOnly,
}, null, 1));

console.log(colourRows.length + ' colours, '
  + colourRows.reduce((s, r) => s + r.total, 0) + ' occurrences, '
  + varRows.length + ' custom properties read, '
  + defOnly.length + ' defined-never-read');
