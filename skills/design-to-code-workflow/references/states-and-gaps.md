# What the design didn't show you

A static design shows the happy path at one width with flattering copy. Everything below is
real behaviour someone has to decide — and if you don't ask, you are deciding it silently.
Loaded on demand by the `design-to-code-workflow` skill.

Use this as an intake checklist: anything unanswered is a question for the designer, not a
guess to make at 5pm.

---

## Interaction states

Designs typically show *default*. Each of these is visible behaviour a user will hit:

| State | Ask | Default if nobody answers |
|---|---|---|
| `hover` | Does it change, and does that read on touch? | Subtle; never the only affordance |
| `focus-visible` | **Never** omit — keyboard users navigate by it | A visible ring on the token colour, 2px offset |
| `active` / pressed | Immediate feedback on press | Slight darken/scale |
| `disabled` | Why is it disabled, and does the user find out? | Reduced opacity **plus** an explanation nearby |
| `loading` | Does the layout jump when content arrives? | Reserve the space; keep the label |
| Selected / current | Tab, nav item, toggle | Not colour alone — pair with weight, underline, or icon |
| Error | Where does the message go, and does it move layout? | Inline, adjacent, space reserved |

Two rules that survive every design:

- **Focus is not optional.** If the design has no focus treatment, that's an omission to fix,
  not a decision to honour.
- **Style errors with `user-invalid:`, not `invalid:`.** `:invalid` matches a blank required
  field the moment the page loads, so an untouched form arrives pre-reddened — see
  `inclusive-design-patterns`.

---

## Content the mockup flatters

| Case | What breaks | What to build |
|---|---|---|
| Long string / no spaces | Card blows out, layout scrolls sideways | `min-w-0`, `truncate` or `break-words`, decide which |
| Empty / zero items | A blank rectangle | An empty state with a next action |
| One item vs many | Grid with a single lonely card | Check the 1-item and 50-item cases |
| Missing avatar/image | Broken-image icon | Initials or a placeholder, sized identically |
| Very long number | Column widths shift | `tabular-nums`, reserve width |
| Translated copy | +30–40% length vs English | Never fix a width to English text |

Ask for the longest realistic value of every dynamic field. "Design copy length" is not a
constraint the product will respect.

---

## Behaviour nobody drew

- **Focus order** — does it follow the visual order? Two-column layouts often read wrong to a
  screen reader. Source order is the real order.
- **What gets focus after an action** — dialog opens, row deletes, form submits. Focus left
  on a removed element sends the user back to `<body>`.
- **Scroll and sticky** — does a sticky header cover the focused field? That's WCAG 2.2 ·
  2.4.11 (focus not obscured), and it's invisible in a flat mockup.
- **Motion** — every transition needs a `prefers-reduced-motion` answer.
- **Dark mode** — if the design has one theme, ask. Retrofitting themes after hardcoding
  colours is a rewrite.
- **RTL** — logical properties (`ms-*`/`me-*`) cost nothing now and everything later.
- **Touch targets** — 24×24 minimum (2.5.8), 44×44 comfortable. Grow them on
  `pointer-coarse:`, not at a breakpoint — see `responsive-universal-design`.

---

## Questions worth asking up front

Cheap to ask, expensive to discover:

1. Which parts are fluid and which are fixed?
2. What's the longest realistic content in each dynamic field?
3. Is there a dark theme, now or planned?
4. What are the loading, empty, and error states?
5. Is this element a button, a link, or something else — behaviourally?
6. Does this component appear anywhere else, in any other size?

Question 6 is the one that decides whether you're writing a one-off or a library component.
If the answer is yes, stop and read `component-library-mastery` before you write the props.

---

Conformance for the result belongs to `web-accessibility-a11y`; the design intent behind
these gaps is `inclusive-design-patterns`. This file only covers *noticing they're missing*
while the design is still in front of you.
