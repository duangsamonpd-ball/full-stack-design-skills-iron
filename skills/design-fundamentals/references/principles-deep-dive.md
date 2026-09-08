# Design Fundamentals — Deep Dive

Worked before/after examples for each principle. Loaded on demand by the
`design-fundamentals` skill. Tailwind classes used for concreteness; the ideas are
framework-agnostic.

---

## 1. Hierarchy

Rank elements with the cheapest tool that works, in this order: **size → weight → color
→ position → space**. Reach for color last; it's the least reliable (fails in grayscale
and for many color-blind users).

```html
<!-- ❌ flat: title, price, and note all similar weight -->
<div>
  <p class="text-base font-normal">Pro plan</p>
  <p class="text-base font-normal">$29/mo</p>
  <p class="text-base font-normal">Billed annually</p>
</div>

<!-- ✅ ranked: price dominates, plan is secondary, note recedes -->
<div>
  <p class="text-sm font-medium uppercase tracking-wide text-content/60">Pro plan</p>
  <p class="text-4xl font-bold text-content">$29<span class="text-lg font-normal text-content/60">/mo</span></p>
  <p class="text-sm text-content/60">Billed annually</p>
</div>
```

Rule of thumb: **one primary focal point per screen.** If two things shout, neither wins.

---

## 2. Layout & grid

Everything sits on a grid; edges align; whitespace is deliberate.

```html
<!-- ❌ everything centered, no focal point, equal weight -->
<section class="text-center">
  <h2 class="mx-auto">Features</h2>
  <div class="grid grid-cols-3 gap-4"> …3 equal cards… </div>
</section>

<!-- ✅ left-aligned scanning + an asymmetric focal layout -->
<section>
  <h2 class="text-left">Features</h2>
  <div class="grid grid-cols-1 gap-md md:grid-cols-3 md:auto-rows-fr">
    <article class="md:col-span-2 md:row-span-2">…primary, larger…</article>
    <article>…</article>
    <article>…</article>
  </div>
</section>
```

Whitespace note: crowding signals "cheap"; generous, *intentional* spacing signals
"considered." But space must be grouped (see proximity), not uniform.

---

## 3. Color

One dominant, neutrals for structure, accents for emphasis.

```
❌ palette-generator look: 6 colors, all ~80% saturation, none dominant
✅ decided: 1 brand hue + a 9-step neutral ramp + 1 accent used <5% of the surface
```

- Text: tinted near-black (`#111827`) on a real neutral ramp — never flat `#808080`.
- Contrast should **track importance**: the primary action has the strongest contrast; muted
  text (`text-content/60`) recedes on purpose.
- Verify against WCAG once colors are chosen (hand off to `web-accessibility-a11y`).

---

## 4. Typography

### Scale — decisive jumps beat timid increments
```
❌ 14 / 16 / 18 / 20            (everything feels the same)
✅ 13 / 16 / 20 / 28 / 40 / 56   (clear roles: caption→body→h3→h2→h1→display)
```

### Leading & tracking per role
```css
.display { line-height: 1.05; letter-spacing: -0.02em; }  /* tight, large */
.body    { line-height: 1.6;  letter-spacing: 0; }        /* relaxed, readable */
```

### Measure (line length)
Keep body text ~45–75 characters per line. In Tailwind: `max-w-prose` or `max-w-[65ch]`.

### Pairing
1–2 typefaces, chosen on purpose (e.g. a characterful display + a clean text face). More
than two, or a random pairing, reads as noise.

---

## 5. Spacing & rhythm

Proximity is the highest-leverage spacing tool: grouping communicates relationship.

```html
<!-- ❌ uniform gaps: label, input, and the NEXT field all equidistant -->
<div class="space-y-4">
  <label>Email</label>
  <input>
  <label>Password</label>   <!-- looks equally related to the email input above -->
  <input>
</div>

<!-- ✅ grouped: tight within a field, looser between fields -->
<div class="space-y-lg">
  <div class="space-y-xs"><label>Email</label><input></div>
  <div class="space-y-xs"><label>Password</label><input></div>
</div>
```

Use one scale (`xs sm md lg xl 2xl`) and vary density with intent — dense tables, airy
marketing sections — rather than one padding value everywhere.

---

## 6. Contrast & balance

- **Contrast = emphasis.** Big vs small, bold vs regular, dark vs light, full vs empty.
  The more an element should matter, the more contrast it earns.
- **Balance = weight distribution.** A large visual on one side balanced by a cluster of
  text on the other (asymmetric) usually reads more alive than a mirrored layout.
- **Alignment + consistency = "designed."** Shared edges, a repeating grid, and consistent
  component treatment do most of the work of looking intentional.

---

## Applying it: a 5-minute critique pass

1. Squint → is the focal point right? Fix hierarchy first (biggest payoff).
2. Grayscale → does structure survive without color? If not, rebuild with size/weight/space.
3. Proximity → regroup with a spacing scale.
4. Align everything to the grid.
5. Tighten the type scale and set one dominant color.
6. Re-squint. Repeat until the intended element leads.
