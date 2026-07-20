# ARIA & keyboard patterns for common widgets

On-demand depth for `web-accessibility-a11y`. Native elements first — reach for ARIA only when
no native element does the job. Every custom widget needs **role + keyboard model + focus
management**, not just ARIA attributes.

## Golden rules

- **No ARIA is better than bad ARIA.** A wrong `role` hides the real semantics.
- ARIA changes semantics, **never behavior** — you still wire the keyboard yourself.
- Manage **focus** deliberately: move it on open, trap it in modals, restore it on close.
- State attributes (`aria-expanded`, `aria-selected`, `aria-checked`) must track the UI live.

## Dialog / modal

- Container `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (title id).
- On open: move focus into the dialog (first field or the dialog). **Trap** focus inside.
- `Esc` closes; on close **restore focus** to the trigger.
- Mark background inert (`inert` attr or `aria-hidden` on the rest).

## Disclosure / accordion

- Trigger is a `<button>` with `aria-expanded="true|false"` and `aria-controls="panel-id"`.
- `Enter`/`Space` toggle. Panel is a plain region; no special role needed.

## Tabs

- `role="tablist"` › `role="tab"` (each) › `role="tabpanel"`.
- Active tab `aria-selected="true"`, controls its panel via `aria-controls`; panel `aria-labelledby` the tab.
- **Roving tabindex**: only the active tab is `tabindex="0"`, the rest `-1`.
- `←/→` move between tabs; `Home/End` jump to first/last. Activation may follow focus or require `Enter`.

## Menu button

- Trigger `<button aria-haspopup="menu" aria-expanded>`; menu `role="menu"`, items `role="menuitem"`.
- `↓` opens + focuses first item; `↑/↓` move; `Esc` closes and restores focus; `Enter` activates.
- Focus moves *into* the menu (roving tabindex), not tabbing through the page.

## Combobox (autocomplete)

- Input `role="combobox"` + `aria-expanded` + `aria-controls="listbox-id"` + `aria-autocomplete="list"`.
- Popup `role="listbox"`, options `role="option"` with `aria-selected`.
- `aria-activedescendant` points at the visually-highlighted option (focus stays in the input).
- `↑/↓` move the active option; `Enter` selects; `Esc` closes.

## Tooltip

- Tooltip `role="tooltip"` with an id; trigger references it via `aria-describedby`.
- Show on **hover AND focus** (never hover-only); `Esc` dismisses. Never put essential-only info in a tooltip.

## Live regions (dynamic updates)

- `aria-live="polite"` for status (form errors, "saved"), `assertive` for urgent alerts; `role="alert"` = assertive live region.
- The live element must exist in the DOM **before** you write to it, or the update won't announce.

## Forms (quick reference)

- Every control has a programmatic name: `<label for>`, `aria-label`, or `aria-labelledby`.
- Errors: set `aria-invalid="true"` and point `aria-describedby` at the message; convey the error with **icon + text**, not color alone.
- Group related controls with `<fieldset>` + `<legend>` (e.g. radio groups).

See also the `inclusive-design-patterns` skill for reduced-motion, i18n/RTL, and forgiving-form behavior beyond conformance.
