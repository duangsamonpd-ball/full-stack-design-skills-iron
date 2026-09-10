# Role specifications

Empty on purpose. This directory holds the pattern, not yet its contents.

## The pattern, and why it is worth adopting

`ore-foundry` puts each role's **complete specification** in `agents/<role>.md` — inputs, procedure,
output contract — and makes the corresponding skill a thin pointer:

```markdown
---
name: repo-navigator
description: 'Forked-context repository navigation — resolve article paths and canonical URLs…'
context: fork
---

1. Read `${CLAUDE_PLUGIN_ROOT}/agents/repo-navigator.md`. That file is the complete
   specification for this role — inputs, procedure, and output contract.
2. Collect the inputs it names. If any required input is missing, say so and stop
   rather than guessing at it.
3. Follow the specification exactly and return only the output shape it defines.
```

Its own note on why:

> Claude Code discovers `agents/` and runs these roles as subagents. Codex does not read that
> directory; it takes context isolation from `context: fork` on a skill. Both routes execute the
> same specification, which lives in `agents/repo-navigator.md` and nowhere else — do not restate
> its contents here.

So: **one specification, two runtimes, and no second copy to drift.**

## Why nothing is here yet

The pattern pays off when a role's research and intermediate reasoning would otherwise flood the
calling workflow's context — a Figma frame read, a component-catalogue search, a pixel audit. Those
are exactly the roles a generation pipeline wants, and none of them exist in this plugin yet.

The two skills that do ship (`figma-astro-init`, `figma-astro-note`) are short, run in the main
context, and produce something the caller needs to see. Forking them would cost context and hide
the part a person should read.

## When to add one

When a skill's *procedure* grows past what belongs in a `SKILL.md`, or when its intermediate work
does not need to reach the caller. Then: specification into `agents/`, pointer into `skills/`,
`context: fork` on the skill — and never a second copy of the procedure.

Candidates, once the generation skills land here: reading a frame's geometry, searching the target
repository's component catalogue, and the pixel audit.
