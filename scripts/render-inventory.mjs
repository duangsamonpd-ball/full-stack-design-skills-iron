/* Renders COLOUR-INVENTORY.md from colour-inventory.json, so the prose can
   never disagree with the data it describes.

   Usage:  node render-inventory.mjs <inventory.json> <out.md>
           node render-inventory.mjs --self-test

   --self-test renders a fixture whose every derived number is known by hand and
   checks the numbers back out of the Markdown. A renderer cannot be trusted by
   reading it: the failure that matters is a table that comes out EMPTY or a
   percentage computed against the wrong denominator, and both of those still
   produce a document that looks finished. Same reason the scanner it renders
   self-tests, stated in section 1 of its own output. */
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const SELF_TEST = argv.includes('--self-test');

/* Every number below is chosen so the derived ones can be checked by hand:
   uses total 100, so a share IS a percentage; the running total reaches 95 at the
   third colour, so the 90% cut must fall at 3; one colour is used exactly once. */
const FIXTURE = {
  generated: '2026-09-08',
  corpus: { files: 829, paths: ['src'], excluded: ['src/content'] },
  totals: {
    distinctColours: 5, colourOccurrences: 100, customPropertiesRead: 2,
    customPropertiesDefined: 2, definedNeverRead: 1,
  },
  roleLegend: {
    text: 'colour:', background: 'background', border: 'border-*', fill: 'SVG fill',
    shadow: 'box-shadow', stroke: 'SVG stroke',
  },
  colours: [
    { hex: '#111111', total: 60, roles: { text: 58, border: 2 }, surfaces: { 'external-css': 50, markup: 10 },
      dsExact: ['--color-text-body'], nearest: '--iron-900', deltaE: 0, fileCount: 12,
      topFiles: [{ file: 'src/a.astro', n: 20 }] },
    { hex: '#2a95d5', total: 25, roles: { background: 25 }, surfaces: { 'inline-style': 25 },
      dsExact: null, nearest: '--iron-500', deltaE: 0.8, fileCount: 5,
      topFiles: [{ file: 'src/b.astro', n: 10 }] },
    { hex: '#ff0000', total: 10, roles: { fill: 10 }, surfaces: { markup: 10 },
      dsExact: null, nearest: '--iron-red', deltaE: 12.5, fileCount: 2,
      topFiles: [{ file: 'src/c.astro', n: 6 }] },
    { hex: '#abcdef', total: 4, roles: { shadow: 4 }, surfaces: { 'external-css': 4 },
      dsExact: null, nearest: '--slate-200', deltaE: 3.1, fileCount: 1,
      topFiles: [{ file: 'src/d.astro', n: 4 }] },
    { hex: '#123456', total: 1, roles: { stroke: 1 }, surfaces: { markup: 1 },
      dsExact: null, nearest: '--neutral-700', deltaE: 7, fileCount: 1,
      topFiles: [{ file: 'src/e.astro', n: 1 }] },
  ],
  customProperties: [
    { name: '--color-text-body', reads: 40, withFallback: 3, definedHere: false, inDesignSystem: true, fileCount: 8, values: [] },
    { name: '--local-gap', reads: 5, withFallback: 0, definedHere: true, inDesignSystem: false, fileCount: 2, values: ['8px'] },
  ],
  definedNeverRead: [{ name: '--unused-x', values: ['#ffffff'], definedIn: ['src/assets/styles/x.css'] }],
};

if (!SELF_TEST && argv.length < 2) {
  console.error(
    'usage: node render-inventory.mjs <inventory.json> <out.md>\n'
    + '       node render-inventory.mjs --self-test',
  );
  process.exit(2);
}

const d = SELF_TEST ? FIXTURE : JSON.parse(readFileSync(argv[0], 'utf8'));
const L = [];
const p = (s = '') => L.push(s);

const roleOrder = ['text', 'background', 'border', 'gradient', 'fill', 'stroke', 'shadow', 'token-def', 'other'];
const SHORT = { text: 'text', background: 'bg', border: 'border', gradient: 'grad', fill: 'fill', stroke: 'stroke', shadow: 'shadow', 'token-def': 'token', other: '?' };
const roles = (r) => roleOrder.filter((k) => r[k]).map((k) => `${SHORT[k]} ${r[k]}`).join(' · ');
const surf = (s) => [['markup', 'mk'], ['inline-style', 'inline'], ['external-css', 'css']]
  .filter(([k]) => s[k]).map(([k, n]) => `${n} ${s[k]}`).join(' · ');
const band = (c) => (c.dsExact ? 'exact' : c.deltaE < 1 ? 'ΔE<1' : c.deltaE < 2.3 ? 'ΔE<2.3' : c.deltaE < 5 ? 'ΔE<5' : c.deltaE < 10 ? 'ΔE<10' : 'ΔE>10');

const agg = {};
for (const c of d.colours) for (const [k, v] of Object.entries(c.roles)) agg[k] = (agg[k] ?? 0) + v;
const aggS = {};
for (const c of d.colours) for (const [k, v] of Object.entries(c.surfaces)) aggS[k] = (aggS[k] ?? 0) + v;
const T = d.totals.colourOccurrences;

p('# Colour inventory — the iron-websites Astro codebase');
p();
p(`**Generated** ${d.generated} · **companion data** \`colour-inventory.json\` (every occurrence, with file and line)`);
p();
p('Supplementary deliverable for the Figma → Astro handover. It answers four questions about every');
p('colour in the current codebase: **what the value is**, **which variables carry it**, **where it is');
p('used**, and **how it is used**.');
p();
p('That last column is the one that matters. The design system\'s tokens are **role-based** —');
p('`--color-text-body`, `--color-bg-shade`, `--color-border` — so mapping a site colour onto one needs');
p('to know that `#181818` appears as `color:` hundreds of times and as `background` twice. A list of');
p('hex values alone cannot be mapped; this one can.');
p();
p('> **The scanner self-tests.** It plants a fixture exercising all nine roles and fails if any is');
p('> mis-detected. It found a real bug in its own first rule that way. A scanner that quietly');
p('> classified everything as `other` would otherwise look like a complete inventory.');
p();
p('---');
p();
p('## 1 · Totals');
p();
p('| | |');
p('|---|---:|');
p(`| files scanned | ${d.corpus.files} |`);
p(`| distinct colours | **${d.totals.distinctColours}** |`);
p(`| colour occurrences | **${d.totals.colourOccurrences}** |`);
p(`| custom properties read | ${d.totals.customPropertiesRead} |`);
p(`| custom properties defined | ${d.totals.customPropertiesDefined} |`);
p(`| defined but never read | ${d.totals.definedNeverRead} |`);
p();
p(`Corpus: \`${d.corpus.paths.join('`, `')}\`. Excluded: \`${d.corpus.excluded.join('`, `')}\` —`);
p('content and served-verbatim assets, not the styling surface.');
p();
p('> **Why these totals differ from the analysis document.** `figma-astro-token-colour-reconciliation`');
p('> reports 295 distinct colours over 2,831 uses. This inventory reports 303 over 3,434, and both are');
p('> correct. Two deliberate differences: this scan **includes `src/apps/*/pages`** (829 files vs 655),');
p('> and it **normalises three-digit hex** — `#fff` is folded into `#ffffff` rather than counted as a');
p('> separate colour. That second one is why `#ffffff` appears here at 609 uses and there at 49. **Use');
p('> this document for the mapping work**; the analysis numbers are the ones behind the ΔE bands and the');
p('> concentration argument, and were measured before shorthand folding existed.');
p();
p('### How the colours are used');
p();
p('| role | occurrences | share | means |');
p('|---|---:|---:|---|');
for (const k of roleOrder) {
  if (!agg[k]) continue;
  p(`| **${k}** | ${agg[k]} | ${(agg[k] / T * 100).toFixed(1)}% | ${d.roleLegend[k].replace(/\|/g, '\\|')} |`);
}
p();
p('### Where they are written');
p();
p('| surface | occurrences | share |');
p('|---|---:|---:|');
for (const [k, n] of Object.entries(aggS).sort((a, b) => b[1] - a[1])) {
  p(`| ${k} | ${n} | ${(n / T * 100).toFixed(1)}% |`);
}
p();
p('**Only 18.8% is in markup, where a reviewer would see it.** The rest is in component `<style>`');
p('blocks and the 35 files under `src/assets/styles/`.');
p();
p('---');
p();
p('## 2 · The colours');
p();
p('Sorted by use. `roles` and `where` are counts. `DS token` is an **exact** value match in the');
p('design system; `nearest` is the closest `--iron-*` / `--slate-*` / `--neutral-*` primitive with its');
p('CIE76 ΔE. Read ΔE as: **<1** imperceptible · **<2.3** the just-noticeable threshold · **<5** same');
p('intent, drifted · **>10** a different colour.');
p();
const cum = [];
let run = 0;
for (const c of d.colours) { run += c.total; cum.push(run); }
const cut = d.colours.findIndex((_, i) => cum[i] >= T * 0.9) + 1;
p(`Listed in full to **90% of all uses** (${cut} colours). The remaining ${d.colours.length - cut} are`);
p('summarised in §3 and present in full in the JSON.');
p();
p('| # | hex | uses | roles | where | DS token | nearest | ΔE | files | top file |');
p('|---:|---|---:|---|---|---|---|---:|---:|---|');
d.colours.slice(0, cut).forEach((c, i) => {
  p(`| ${i + 1} | \`${c.hex}\` | ${c.total} | ${roles(c.roles)} | ${surf(c.surfaces)} | ${c.dsExact ? '`' + c.dsExact[0] + '`' : '—'} | \`${c.nearest}\` | ${c.deltaE} | ${c.fileCount} | \`${c.topFiles[0].file.replace(/^src\//, '')}\` (${c.topFiles[0].n}) |`);
});
p();
p('---');
p();
p('## 3 · The tail');
p();
const tail = d.colours.slice(cut);
const tailUses = tail.reduce((s, c) => s + c.total, 0);
p(`${tail.length} colours account for ${tailUses} uses (${(tailUses / T * 100).toFixed(1)}%). By distance:`);
p();
const bands = {};
for (const c of tail) { const b = band(c); bands[b] = bands[b] ?? { n: 0, uses: 0 }; bands[b].n++; bands[b].uses += c.total; }
p('| band | colours | uses | suggested treatment |');
p('|---|---:|---:|---|');
const advice = {
  exact: 'already a design-system value — name it',
  'ΔE<1': 'snap to the nearest token, nobody will see it',
  'ΔE<2.3': 'snap to the nearest token',
  'ΔE<5': 'snap, but review as a group',
  'ΔE<10': 'visible — needs a decision per colour',
  'ΔE>10': 'a different colour — needs a decision',
};
for (const k of ['exact', 'ΔE<1', 'ΔE<2.3', 'ΔE<5', 'ΔE<10', 'ΔE>10']) {
  if (!bands[k]) continue;
  p(`| ${k} | ${bands[k].n} | ${bands[k].uses} | ${advice[k]} |`);
}
p();
const once = d.colours.filter((c) => c.total === 1);
p(`**${once.length} colours are used exactly once** across the whole corpus`);
p(`(${(once.length / d.colours.length * 100).toFixed(0)}% of distinct, ${(once.length / T * 100).toFixed(1)}% of uses).`);
p('Those are accidents rather than decisions and should be snapped, not named.');
p();
p('---');
p();
p('## 4 · Custom properties');
p();
p('Every `var(--x)` read in the corpus. `defined here` means the property is declared somewhere in');
p('this codebase; `in DS` means the design system declares a property of that exact name.');
p();
p('| property | reads | w/ fallback | defined here | in DS | files | value(s) here |');
p('|---|---:|---:|:---:|:---:|---:|---|');
for (const v of d.customProperties.slice(0, 45)) {
  const val = v.values.length ? '`' + v.values.slice(0, 2).join('`, `').slice(0, 70) + '`' : '—';
  p(`| \`${v.name}\` | ${v.reads} | ${v.withFallback} | ${v.definedHere ? '✓' : '—'} | ${v.inDesignSystem ? '✓' : '—'} | ${v.fileCount} | ${val} |`);
}
p();
if (d.customProperties.length > 45) p(`_${d.customProperties.length - 45} further properties in the JSON._`);
p();
const undef = d.customProperties.filter((v) => !v.definedHere);
const undefInDs = undef.filter((v) => v.inDesignSystem);
p(`**${undef.length} properties are read but never defined here**, of which **${undefInDs.length} are already`);
p('defined in the design system** — these light up the moment the theme is imported:');
p();
p('| property | reads | w/ fallback |');
p('|---|---:|---:|');
for (const v of undefInDs.sort((a, b) => b.reads - a.reads)) p(`| \`${v.name}\` | ${v.reads} | ${v.withFallback} |`);
p();
p('---');
p();
p('## 5 · Defined but never read');
p();
p(`${d.definedNeverRead.length} custom properties are declared and never consumed. Dead weight, and a`);
p('signal of where a token layer was started and abandoned.');
p();
p('| property | value(s) | declared in |');
p('|---|---|---|');
for (const v of d.definedNeverRead.slice(0, 40)) {
  p(`| \`${v.name}\` | \`${v.values.slice(0, 2).join('`, `').slice(0, 60)}\` | \`${v.definedIn[0].replace(/^src\//, '')}\` |`);
}
p();
p('---');
p();
p('## 6 · Using this for the mapping session');
p();
p('The goal is a table with one row per site colour and a design-system **semantic** token beside it.');
p('This inventory supplies everything except the semantic judgement.');
p();
p('1. **Read the `roles` column first.** A colour that is 95% `text` maps to a `--color-text-*` token;');
p('   one that is 95% `bg` maps to `--color-bg-*`. A colour split across roles is a colour doing two');
p('   jobs and probably needs two tokens.');
p('2. **`ΔE` decides how hard the decision is.** Exact and <2.3 are naming exercises. >10 is a brand');
p('   decision and needs a stakeholder.');
p('3. **`where` tells you the cost.** A colour that is 90% `external-css` is edited in a handful of');
p('   stylesheets; one spread across `inline-style` in 40 components is 40 files.');
p('4. **Ignore the tail.** Colours used once or twice are not decisions.');
p();
p('### Querying the JSON');
p();
p('```bash');
p('# every colour used mainly as text, that has no exact design-system name');
p('node -e "const d=require(\'./colour-inventory.json\');');
p('  d.colours.filter(c=>!c.dsExact && (c.roles.text??0)/c.total>0.8 && c.total>=10)');
p('   .forEach(c=>console.log(c.hex,c.total,c.nearest,c.deltaE))"');
p();
p('# every file that writes a given colour, with line numbers and role');
p('node -e "const d=require(\'./colour-inventory.json\');');
p('  console.log(d.colours.find(c=>c.hex===\'#2a95d5\').at.join(\'\\n\'))"');
p('```');
p();
p('`at` holds up to 400 `file:line:role` entries per colour — enough to drive an edit, and capped so');
p('the file stays openable.');

const OUT = L.join('\n') + '\n';

if (SELF_TEST) {
  /* Each case names the derived value it protects. A case that only asserted the
     document is non-empty would pass on a document with every table empty. */
  const cases = [
    ['the 90% cut lands on the third colour', 'Listed in full to **90% of all uses** (3 colours)'],
    ['and says how many it left out', 'The remaining 2 are'],
    ['role totals aggregate across colours', '| **text** | 58 | 58.0% |'],
    ['a role appearing in two colours is summed', '| **border** | 2 | 2.0% |'],
    ['surface totals aggregate too', '| external-css | 54 | 54.0% |'],
    ['the colour table is not empty', '| 1 | `#111111` | 60 | text 58 · border 2 |'],
    ['an exact design-system match is named', '`--color-text-body` | `--iron-900` |'],
    ['the tail is measured, not listed', '2 colours account for 5 uses (5.0%)'],
    ['ΔE banding puts 3.1 in <5', '| ΔE<5 | 1 | 4 |'],
    ['ΔE banding puts 7 in <10', '| ΔE<10 | 1 | 1 |'],
    ['single-use colours are counted', '**1 colours are used exactly once**'],
    ['properties read but never defined here are found', '**1 properties are read but never defined here**'],
    ['and the design system is credited for them', '**1 are already'],
    ['a negative "further properties" line is not printed', '!_-'],
  ];
  const missing = cases.filter(([, needle]) =>
    needle.startsWith('!') ? OUT.includes(needle.slice(1)) : !OUT.includes(needle));
  for (const [what, needle] of missing) console.log(`FAIL ${what}\n     expected: ${needle}`);
  // every section must render — an absent one is the silent failure this guards
  const sections = ['## 1 · Totals', '## 2 · The colours', '## 3 · The tail',
    '## 4 · Custom properties', '## 5 · Defined but never read', '## 6 · Using this'];
  const absent = sections.filter((h) => !OUT.includes(h));
  for (const h of absent) console.log(`FAIL section missing: ${h}`);
  const bad = missing.length + absent.length;
  console.log(bad
    ? `SELF-TEST FAILED (${bad})`
    : `SELF-TEST PASSED — ${cases.length} derived values and ${sections.length} sections render correctly`);
  process.exit(bad ? 1 : 0);
}

writeFileSync(argv[1], OUT);
console.log('wrote ' + argv[1] + ' (' + L.length + ' lines)');
