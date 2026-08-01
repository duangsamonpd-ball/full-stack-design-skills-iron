# Component API Contract

How to design a single component so it fits the system's shared grammar. Loaded on demand
by the `design-systems-architecture` skill. (This is the per-component method; the
architecture skill covers the library-wide rules.)

Design the contract *before* implementation — anatomy, variants, states, props, and the
accessibility contract — so the build is unambiguous and consistent with every other component.

## 1. Purpose & scope
State what the component is for and, explicitly, what it is *not* — to avoid overlap with
existing components. One clear responsibility per component.

## 2. Anatomy
Name every part and mark which are optional.

```
Alert
├── container   (role, tone)
├── icon        (optional, tone-driven)
├── title       (optional)
├── body        (required)
└── actions     (optional slot)
```

## 3. Variant & state matrix
Enumerate the full matrix using the **system-wide vocabulary** (same names everywhere):

```
variant:  primary | secondary | ghost
size:     sm | md | lg
tone:     neutral | success | warning | danger      (where meaningful)
state:    default | hover | focus | active | disabled | loading | error
```

Every listed state must be designed and bound to tokens — not just the happy path.

## 4. Prop API
Typed props with sensible defaults; compose over configure.

```tsx
interface AlertProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger'   // shared vocabulary
  title?: string
  onDismiss?: () => void
  children: React.ReactNode                              // body via slot, not a prop
}
```

Rules that keep the library coherent:
- Reuse the shared prop names (`variant`, `size`, `tone`) — never invent `type`/`kind`/`mode`.
- Booleans read as flags (`isLoading`, `disabled`).
- Prefer slots/children over a growing pile of content props.
- Forward refs and spread rest props so consumers can extend.

## 5. Token binding
Every visual value maps to a semantic/component token, never a raw value.

```
container.bg   → color.surface
container.ring → color.{tone}.border
icon.color     → color.{tone}.fg
padding        → space.inset.md
```

**States bind to their own tokens — an opacity shortcut is not a state.** When the
palette ships a pair (`text.link-menu` / `text.link-menu-hover`, `button.bg` /
`button.bg-hover`), the hover rule must read the paired token. Dimming the resting
colour with `opacity` looks close enough in a dark mock-up and is wrong three ways: it
discards whatever hue the pair exists to introduce — a brand accent on hover is a
decision, not a change in brightness; it drifts silently the moment the pair is retuned;
and it cannot be themed, because opacity has no mode. **Before reaching for `opacity` on
a state, grep the token layer for a `-hover` / `-active` / `-selected` sibling.** If one
exists, the shortcut is drift with a plausible excuse.

```css
/* ✗ same shape, loses the accent  */   .link:hover { opacity: 0.8; }
/* ✓ */                                 .link:hover { color: var(--color-text-link-menu-hover); }
```

## 6. Layout ownership — what the component does *not* decide

Half a contract is what the component refuses to control. The recurring violation is a
component sizing or spacing **itself**, in its parent's coordinate space:

- **Outer width / height** — no `width`, `max-width` or fixed height on the root. A control
  fills what it is given; how much that is belongs to the parent.
- **Outer margin** — never. Margin on a root element leaks into every layout that uses the
  component, and the consumer can only remove it by overriding, which starts a specificity
  war. Space *between* siblings is the parent's `gap`.
- **The gap between a field, its label and its message** — that is form-layout spacing, on
  the spacing scale, defined once. Four components hand-typing the same `6px` is how a value
  becomes house style by repetition while sitting off the scale entirely — in one system the
  scale went 4 → 8 and nothing was ever 6, but four components had agreed it was.

What the component **does** own: its internal padding, the gap between its own parts, and the
intrinsic min-height implied by its size variant.

The test: drop the component into three different layouts. If any of them needs a wrapper
whose only job is to undo the component's own margin or width, the contract is wrong — fix
the component, not the third layout.

## 7. Accessibility contract (part of the API)
Decide these here, not after the build:
- **Role** — e.g. `role="alert"` for an assertive alert; `status` for polite.
- **Keyboard model** — what keys do what; focus order; focus-visible styling.
- **Names/labels** — required `aria-label`/`aria-labelledby`; icon-only controls need a name.
- **Live behavior** — does it announce? `aria-live` politeness.

## 8. Spec output
A short doc the implementer builds against:
- anatomy (list/diagram)
- variant × state matrix
- prop table (name · type · default · notes)
- token bindings
- accessibility contract
- do / don't

## Definition of done (per component)

```
□ Uses shared API grammar (variant/size/tone names)
□ Full state matrix designed & token-bound
□ Typed props + sensible defaults; slots over prop bloat
□ Declares no outer width/height/margin — the parent owns placement
□ Accessibility contract implemented (role, keyboard, labels)
□ Story per variant/state + unit test
□ Exported from the barrel; follows naming conventions
```

## Next steps
- Build & organize the library: `component-library-mastery`
- Implement from a design: `design-to-code-workflow`
- Verify: `web-accessibility-a11y`, `qa-testing-visual-regression`, `css-styling-pixel-perfect`
