# Using these skills

A practical manual for people who have downloaded the package: how to install it, how to get
the right skill to fire, and what to do when one doesn't.

For what each skill *contains*, see [`README.md`](README.md). For the full trigger and
disambiguation matrix, see [`.claude/skills/TESTS.md`](.claude/skills/TESTS.md).

---

## 1 · Install

Pick the surface you actually work in.

### Claude Code — one project

The skills apply only inside this project. Best when the package is relevant to one codebase.

```bash
unzip iron-skills-claude-code.zip -d /path/to/your/project
```

The zip contains `.claude/skills/` at its root, so this lands the folder in the right place
in one step. `.claude` is hidden in Finder — reveal it with <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>

### Claude Code — every project

Same folder, in your home directory instead:

```bash
mkdir -p ~/.claude/skills
unzip iron-master-skills-architecture.zip -d /tmp/iron
cp -R /tmp/iron/iron-master-skills-architecture/skills/* ~/.claude/skills/
```

Installed here they're available in every project. You can still drop a project-level copy in
a specific repo when you want that codebase pinned to its own version.

### Claude app (claude.ai)

Upload one at a time — **Settings → Capabilities → Skills** — from `per-skill/<name>.zip`.
Each of those contains a single skill folder with its `SKILL.md` and `references/`.

### Confirm it worked

Start a new session and ask Claude to list its available skills. You should see all 15 with a
real one-line description each. If a description reads like a filename or a heading, that
skill's frontmatter didn't parse — see [Troubleshooting](#5--troubleshooting).

---

## 2 · How a skill actually gets used

There is no "triggers" field and no registration step. Claude reads the **`description`** line
in each `SKILL.md` and picks the one that matches your intent. Two ways in:

**Automatic** — you describe the task in your own words and Claude loads the matching skill.
This is the normal path and needs nothing from you:

> "this signup form looks generic, can you make it feel less templated"
> → `anti-ai-design-patterns`

**Explicit** — name the skill to force it, when you know which one you want or the automatic
pick was wrong:

> "use design-tokens-system to set up theming for this project"

In Claude Code you can also type `/` and pick from the list.

### Progressive disclosure

Each `SKILL.md` is deliberately short. The depth lives in `references/*.md`, which Claude
loads **only when the task needs it** — recipes, worked examples, checklists. You don't
manage this; it's why the package stays fast on simple questions and still has real detail on
hard ones. If you want the depth up front, ask for it: *"read the token-pipeline reference
before you start."*

---

## 3 · Saying it so the right skill fires

Descriptions are written around what people actually type. Some worked examples:

| What you want | Say something like | Fires |
|---|---|---|
| Implement a Figma design | "build this Figma design as a Vue component" | `design-to-code-workflow` |
| Keep Figma and code in sync | "set up Code Connect for our button" | `figma-expert-workflows` |
| A theme / token system | "set up design tokens and a dark theme" | `design-tokens-system` |
| Governance at scale | "we're past 100 components, how do we version this" | `design-systems-architecture` |
| Build a component library | "build a component library with variants" | `component-library-mastery` |
| Tidy the CSS | "our Tailwind classes are a mess, organize this" | `css-styling-pixel-perfect` |
| Match a mockup exactly | "this is 4px off from the design" | `css-styling-pixel-perfect` |
| Works on phones | "make this responsive" | `responsive-universal-design` |
| Pass an audit | "check this page against WCAG 2.2 AA" | `web-accessibility-a11y` |
| Beyond pass/fail | "support reduced motion and RTL" | `inclusive-design-patterns` |
| It looks AI-made | "why does this look generic" | `anti-ai-design-patterns` |
| Critique the visuals | "the hierarchy feels off" | `design-fundamentals` |
| Pick a framework | "React or Astro for this?" | `frontend-framework-guide` |
| Catch UI regressions | "set up visual regression tests" | `qa-testing-visual-regression` |
| It's slow | "improve our Core Web Vitals" | `web-performance-optimization` |
| Ship it | "set up CI/CD with quality gates" | `deployment-devops-workflow` |

### Neighbouring pairs

Four pairs sit close enough that phrasing decides. Each description claims its own ground and
points at its neighbour, so this resolves cleanly — but it helps to know the seam:

| | Owns | Its neighbour owns |
|---|---|---|
| `css-styling-pixel-perfect` | CSS architecture, pixel gaps | viewport/breakpoint layout → `responsive-universal-design` |
| `design-tokens-system` | authoring the tokens | scale, governance, versioning → `design-systems-architecture` |
| `design-to-code-workflow` | one-shot implement | ongoing sync, Dev Mode → `figma-expert-workflows` |
| `component-library-mastery` | building the library | cross-library API contracts → `design-systems-architecture` |
| `web-accessibility-a11y` | conformance, pass/fail | usability beyond WCAG → `inclusive-design-patterns` |

---

## 4 · Using several together

The skills are designed to compose, and most real work crosses two or three. You don't have
to sequence them by hand — say the whole goal and Claude will pull what it needs:

> "take this Figma frame, build it as an Astro component with our tokens, and make sure it
> passes WCAG 2.2 AA"

That one sentence reasonably pulls `design-to-code-workflow` → `design-tokens-system` →
`web-accessibility-a11y`.

A natural order for a full feature:

```
design-fundamentals ─▶ design-tokens-system ─▶ design-to-code-workflow
      ▼                                              ▼
anti-ai-design-patterns                    css-styling-pixel-perfect
                                            responsive-universal-design
                                                     ▼
                              web-accessibility-a11y · inclusive-design-patterns
                                                     ▼
                          qa-testing-visual-regression · web-performance-optimization
                                                     ▼
                                        deployment-devops-workflow
```

`README.md` has learning paths through this for different roles.

---

## 5 · Troubleshooting

**Nothing fired.** Name the skill directly (`"use responsive-universal-design to …"`). If the
explicit call works but automatic selection didn't, your phrasing sat between two skills —
the table above shows which words each one owns.

**The wrong skill fired.** Say which one you meant; Claude will switch. If it keeps happening
for a phrase you use often, that phrase belongs in a `description` — edit the `SKILL.md` and
re-run the lint below.

**A skill's description looks like a filename or a heading.** Its `SKILL.md` has no YAML
frontmatter, so there's nothing to auto-select on and only an exact name will reach it. Every
`SKILL.md` must start with:

```yaml
---
name: skill-name-matching-the-folder
description: What it does. Use when the user says "…", "…".
---
```

**Claude doesn't see the skills at all.** Check the folder is `.claude/skills/<name>/SKILL.md`
— one folder per skill, the file named exactly `SKILL.md`, and `name:` matching the folder
name. Then restart the session.

**Check the whole install at once** (needs Node, no install step):

```bash
node scripts/skills-lint.mjs ~/.claude/skills
```

It verifies every folder/`name` match, that each description exists, and that every
`references/…md` a skill promises actually resolves.

---

## 6 · Editing them

They're plain Markdown — change anything. Two things to keep intact:

- `name:` must equal the folder name.
- `description:` is the only thing auto-selection reads. Say *what it does* **and** *when to
  use it*, including phrases someone would actually type. If you add a skill that sits near
  an existing one, mention the neighbour ("for X use `<other>`") in both descriptions.

Re-run `node scripts/skills-lint.mjs` after any edit. If you're maintaining a fork, the same
check runs in CI via `.github/workflows/skills-lint.yml`.

---

MIT · Ball @ Iron Software
