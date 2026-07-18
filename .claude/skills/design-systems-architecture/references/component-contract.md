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

## 6. Accessibility contract (part of the API)
Decide these here, not after the build:
- **Role** — e.g. `role="alert"` for an assertive alert; `status` for polite.
- **Keyboard model** — what keys do what; focus order; focus-visible styling.
- **Names/labels** — required `aria-label`/`aria-labelledby`; icon-only controls need a name.
- **Live behavior** — does it announce? `aria-live` politeness.

## 7. Spec output
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
□ Accessibility contract implemented (role, keyboard, labels)
□ Story per variant/state + unit test
□ Exported from the barrel; follows naming conventions
```

## Next steps
- Build & organize the library: `component-library-mastery`
- Implement from a design: `design-to-code-workflow`
- Verify: `web-accessibility-a11y`, `qa-testing-visual-regression`, `css-styling-pixel-perfect`
