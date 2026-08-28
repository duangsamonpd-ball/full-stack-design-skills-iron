# Working in this repo

Rules that cost real time when they were not known. What the skills ARE, how
they compose, how they trigger and how a consumer installs them is in
[`README.md`](README.md) and [`USAGE.md`](USAGE.md), and this file does not
repeat any of it.

**Deliberately not written here:** how many skills there are, their names, or
anything else a `ls` answers. A number written down is the one thing nothing
checks — this repo learned that from the other side, where three files carried
"two scripts must know about this folder" long after the answer had become four.

## Verify with the exit code

```sh
cd scripts && npm ci          # once
node scripts/check-drift.mjs --gates
```

`--gates` runs all three local gates and is wired to `SessionStart`, so a
session opens already knowing whether the tree is green. The three underneath
it, if you need one alone:

```sh
node scripts/skills-lint.mjs            # zero setup, no network, instant
node scripts/build-css.mjs --check      # stylesheets match their source
cd scripts && npm run a11y              # accessibility tree of every example
```

**`--versions` and `--audit` are a different clock and they touch the network.**
A release lands when the world publishes it, not when you open the repo, and an
advisory can land against a version that is current. They run on a weekly cron
and open an issue; do not read a green `--gates` as an answer about either.

## The gate that REFUSES rather than skips

`a11y` audits the built Astro example as well as the checked-in HTML, and if
that build is missing it **exits 1 naming the build command** instead of
auditing what it can find. That is deliberate and it is written in the script:
silently dropping a page it could not load is how the Astro output went
unaudited in CI while passing locally.

```sh
cd astro-registration-m3 && npm ci && npm run build
```

So `a11y` green means every page was read. A gate that quietly narrows its own
scope reports the narrowed scope as a pass.

## Editing a skill here is LIVE, everywhere, immediately

`~/.claude/skills/*` are per-skill symlinks pointing into this repo's
`.claude/skills/`. Save a `SKILL.md` and the next session on this machine — in
any project — loads it. There is no install step and no reinstall step.

That is the point, and it is also the blast radius: a half-finished edit is a
half-finished skill for every room. Verified 2026-08-26 by planting a marker in
a `SKILL.md` here and reading it back through `~/.claude/skills`.

Until that day the symlinks pointed into a SECOND clone of this repo that lived
inside the `test-build-page` room and was documented there as view-only. It was
not: every skill on the machine ran from it, and it had been pushed from, while
this room sat a commit behind with nothing pointing at it. That clone is
deleted. If a symlink ever points anywhere but here again, something has gone
backwards.

## `USAGE.md` is written for a consumer, not for this machine

It says to unzip a bundle and `cp -R` the skills into `~/.claude/skills/`. That
is correct for someone installing them, and **wrong to run here** — it would
replace the symlinks above with copies, and the copies would start drifting from
the repo the moment either changed, with nothing red anywhere.

## Feeding a session's lessons back

The habit is real and the shape of it matters. From the commit that did it last:

> what the skills already covered is left alone, and only what they did not is
> added. Every item below has a number and a cost attached because it actually
> happened.

So, in order:

1. **Read what the skill already says.** Half of what a session wants to add is
   already there in different words, and a second telling makes the skill worse.
2. **Only add what was MEASURED.** A number, a width, a byte count, a wrong
   value that shipped. A generality with no number attached is advice, and this
   repo has enough advice.
3. **Say what it cost.** "Four days on the live site", "6.3MB shipped in the
   commit whose purpose was removing it". The cost is what makes a reader stop.

Open work of this kind is tracked as GitHub issues with a checkbox per item, so
a partial pass is legible.

## What `skills-lint` actually holds you to

A skill's folder name and its frontmatter `name` must agree, a `description`
must be present, and **every `references/*.md` a skill points at must resolve** —
including a cross-skill pointer. So a renamed folder needs its frontmatter
renamed with it, and a new reference file that nothing links is not "added yet",
it is invisible. The lint is instant; run it after any rename.

Since 2026-08-28 it also holds you to **a skill named in prose**. A rename keeps
the folder and the frontmatter in step and quietly leaves every `**old-name**`
in the other files pointing at nothing, because a bold word is not a path and
nothing was ever going to open it. Kebab-case tokens in `**bold**` or `` `code` ``
are matched against the known skills: exact resolves, and a NEAR match — within
3 edits, or two shared segments — is reported with the name it probably meant.
Ordinary kebab-case (`prefers-color-scheme`, `data-theme`) is near nothing and
stays silent. The refusal case runs on **every invocation**, not behind a flag:
three planted stale names must be reported and seven controls must stay silent,
so sabotaging the matcher fails the lint instead of turning it into a tick.

That scan reads **bold and backticks only**, which is the whole reason the
convention matters: **write a skill pointer as `**name**` or `` `name` `` and the
gate can see it; write it bare and it is invisible.** Measured 2026-08-28 — of 57
plain-text skill mentions in the set, 55 were the frontmatter `name:` and
`description:`, and the last 2 were reference-file titles, now backticked. Body
prose was already following the convention everywhere.

The frontmatter half is checked separately, because a description is plain prose
and is the one surface loaded into **every** session: a kebab token after "use",
"in" or "via" must name a real skill. That grammar finds the 12 delegation
pointers and nothing else — "into production-ready React" is not matched, since
"into" is not "in". A rename that leaves `use old-name` in a description breaks
the boundary that stops two skills stealing each other's triggers, and nothing
else was looking at it.

## Git

This repo and `my-guide-irondesign` both work **direct to `main`**. Commit, push
and similar steps happen **on an explicit request each time** — one step per
request, not chained ahead.
