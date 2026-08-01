# Reading a design — structure and token decisions

What to do between "here is the Figma link" and the first line of markup. Loaded on demand by
the `design-to-code-workflow` skill.

---

## Structure first — what the design *means*, not what it looks like

A design tool describes position; code describes intent. Translate the intent, or you inherit
a layout that only holds at one width.

| In the design | What it usually means in code | Trap |
|---|---|---|
| Auto layout, horizontal | `flex` + `gap` | Don't reach for `space-x-*`; `gap` survives wrapping |
| Auto layout, vertical, fill container | `flex flex-col` + `flex-1` on the filler | "Fill" is `flex-1`/`grow`, not a fixed height |
| Spacing between items | `gap-*` | Not margins on children — margins collapse and fight reordering |
| Padding on the frame | `p-*` on the container | Not a spacer element |
| Fixed width on a card | Usually `max-w-*`, not `w-*` | A design canvas has one width; the browser has all of them |
| Absolute position | Flow layout in code, 9 times out of 10 | Genuine overlays (badges, close buttons) are the exception — `relative` parent + `absolute` child |
| Constraints: left+right | `w-full` / stretches | This is the designer telling you it's fluid — honour it |
| Constraints: centre | `mx-auto` or grid centring | |
| A grid of cards | `grid` + `repeat(auto-fit, minmax(…))` | Column counts in the design are one viewport's answer, not the rule |
| Text at a fixed size | `rem`-based scale step | Never `px` — it breaks OS text scaling |

If the design has one artboard, you are being shown a single frame of a responsive system.
Ask which parts are fluid before assuming; see `responsive-universal-design`.

---

## Values → tokens: the decision

Every literal value in a design is one of three things. Decide which *before* typing it.

```
design value ──▶ within tolerance of an existing token?  ──▶ use the token
              ──▶ a real, repeated new decision?          ──▶ propose a token, then use it
              ──▶ genuinely one-off?                      ──▶ arbitrary value, with a comment
```

**Snap to the token.** Designs drift — `#0F766D` next to your `#0F766E`, `23px` where the
scale says `24px`. Sub-perceptual differences are noise from hand-nudging, not intent. Snap
and move on.

**Propose a token** when the value is new, deliberate, and will repeat (a second brand
accent, a new elevation). Adding it belongs to `design-tokens-system` — don't invent it
inline and leave the system to catch up later.

**Arbitrary value** only for the genuinely singular — a hero illustration's offset, one
optical alignment nudge. Write it as `top-[3px]` *with a comment saying why*, so the next
reader knows it was a decision and not a leftover.

```html
<!-- optical centring: the glyph sits 1px high in this font -->
<span class="relative top-px">…</span>
```

**Do not** carry a raw hex or px into the markup because "it's what the design said." That is
how a token system dies — one honest exception at a time.

### Values that don't fit the scale

Round to the nearest scale step first and look at it. If it's wrong, the *scale* may be
missing a step — that's a token conversation, not a licence to use `p-[13px]`. A spacing
scale with a hole in it will keep producing this same friction.

---

## Extraction traps — when the number you read isn't the number you want

Everything above assumes the value you pulled out of the file is the value the design means.
Five times it isn't, and none of them announce themselves: the import looks clean, every gate
stays green, and the UI is quietly wrong.

**1 · A blur radius is not a CSS blur.** A Figma background blur of radius R renders like CSS
`blur(R/2)`. The file's own export is the proof — an effect bound to `blur/xs = 4` converts to
`blur(2px)`. Import the raw radii and every stop in the family is twice as strong as designed.
Store the **halved, CSS-px** value in the token source, the way every other family stores what
the CSS should be, and record the Figma radius in the token's description — otherwise the next
person to compare the source against the Figma variable panel will "fix" them all back.

**2 · Alpha hex rounds half UP.** Transparency ramps export as 8-digit hex whose alpha byte is
`floor(pct / 100 * 255 + 0.5)`. Any generator using banker's rounding (Python's `round()`,
`Math.round` on negatives, most "round to even" helpers) disagrees on exactly the stops that
land on `.5` above an **even** number — and only those, which is why the bug hides so well. On
a 1/5/10/20/30/40/50 ramp that is a single stop: 30% is `#FFFFFF4D` in Figma and `#FFFFFF4C`
from banker's, while the other six agree. One wrong alpha in a border colour is invisible in
review and permanent. Generate the ramp, then
**assert it against the values the file actually returned** before writing it into the source.

**3 · A variable read returns ONE mode — whichever the queried node resolves in.** There is no
mode parameter. To read the dark theme you must query a node that physically sits on a dark
surface. The consequence people miss: **if a component has no dark-mode sample on the canvas,
its dark values cannot be audited from the design file at all.** Say that plainly instead of
reporting the light values and letting the silence imply the dark ones passed. The fix is a
request to the designer — a band with both variants on it, placed once, readable forever.

**4 · Variable bindings come in two shapes.** Text properties and `fills` are **arrays**
(text can vary per segment); padding, radius, item spacing and everything else on a frame are a
**single alias object**. Index `[0]` into the second kind and you get `undefined`, which reads
exactly like "not bound to a variable" — a false drift finding that looks completely credible.

```js
const raw = node.boundVariables?.[prop];
const alias = Array.isArray(raw) ? raw[0] : raw;
// paint fills are different again: node.fills[0].boundVariables.color.id
```

**5 · A component's own size is not the size it was placed at.** The tool that returns
reference code describes each component **in itself** — its own frame, its internal padding,
its default dimensions. The tool that returns the node tree reports what the **instance** on
that screen actually is. They disagree more often than you would expect, and the reference
code is the one you are reading, so its number is the one you copy. In one footer, an icon
component whose own frame is 24px was placed at 16px; the code shipped 50% too large and
looked deliberate. **Read the layout numbers off the node tree, and treat the reference code
as a description of structure, not of size.**

Two corollaries worth having before you need them:

- **A hidden auto-layout child keeps stale coordinates.** It was laid out once, then taken
  out of the flow and never recomputed — so its x/y/size describe a layout that no longer
  exists. If a component has variants, measure the element in the variant where it is
  *visible*, never in the one where it is switched off. Sanity-check by adding up: padding +
  content + gap should equal the reported container width. If it doesn't, you are reading a
  ghost.
- **Variants of the same component disagree with each other.** Two variants of one footer
  specified the same row as a 16px icon in a 20px row and as a 24px icon in a 24px row.
  Neither is a spec; one is a mistake. Implement the variant you were asked for, and say
  which one you followed — silently averaging them helps nobody.

**The rule underneath all five: a search that returns nothing is not evidence of absence.**
Local, unpublished variables are invisible to design-system search, so "the tool finds no blur
collection" supports the confident, reasonable, wrong conclusion that only the one stop you can
see is real. Ask the designer to look at the variable panel. A question costs a message; a
wrong import costs a family of tokens and the trust in the ones next to them.

---

## Inventory before you build

Pull these out of the design in one pass. Missing one means rework after the structure exists,
which is when it's expensive.

- **Variants** — every visual variation of the same thing (primary/secondary/ghost; sm/md/lg).
  Name them now; they become the component's API. Building them as separate components is the
  standard mistake — see `component-library-mastery` → `references/variant-recipes.md`.
- **States** — hover, focus-visible, active, disabled, loading, selected, error. Designs
  usually show one. The rest are listed in `states-and-gaps.md`.
- **Breakpoints** — which elements move, stack, hide, or change size, and at what content
  width they break.
- **Content limits** — the longest realistic string, the smallest, and zero. Design copy is
  always the flattering length.
- **Interactive semantics** — is this a `button`, a link, a tab, a disclosure? Decide from
  behaviour, never from appearance. A styled `div` costs you the whole accessibility layer.

---

## Order of work

Structure → tokens → states → responsive. Styling before the DOM is settled produces classes
you then have to move, and moved classes are where mistakes hide.

```
semantic markup (no classes)
  └─▶ layout utilities (flex/grid/gap)
        └─▶ token-mapped colour + type
              └─▶ states and variants
                    └─▶ breakpoints
```

Verify the result against the design with `css-styling-pixel-perfect`; it owns spacing/colour
parity and the drift-source checklist.
