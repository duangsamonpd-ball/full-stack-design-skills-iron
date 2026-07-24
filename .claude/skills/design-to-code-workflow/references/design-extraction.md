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
