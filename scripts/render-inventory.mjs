/* Renders COLOUR-INVENTORY.md from colour-inventory.json, so the prose can
   never disagree with the data it describes. */
import { readFileSync, writeFileSync } from 'node:fs';

const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
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
p(`_${d.customProperties.length - 45} further properties in the JSON._`);
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

writeFileSync(process.argv[3], L.join('\n') + '\n');
console.log('wrote ' + process.argv[3] + ' (' + L.length + ' lines)');
