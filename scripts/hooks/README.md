# SessionStart hooks

Two commands run when a session opens in this room, wired in
`.claude/settings.local.json` and addressed through `$CLAUDE_PROJECT_DIR` rather
than an absolute path.

| | what it answers |
|---|---|
| `scripts/check-drift.mjs --hook` | are the three gates green right now (local, no network) |
| `scripts/hooks/pending-reminder.py` | what is still waiting on a human |

## Why the reminder lives here

It spent its first months in `~/.claude/projects/…/pending-reminder.py` — inside
no repository, so it could not be reviewed, diffed, restored, or noticed when it
went wrong. It went wrong.

Until 2026-08-27 its main check compared two clones of this repo, because
`~/.claude/skills` symlinked into a second one and a skill edited here was not
the skill Claude loaded. **That clone was deleted on 2026-08-26.** The check did
not fail: it returned "nothing to report" whenever a clone was missing, so from
that day it printed all-clear every session. A missing input read exactly like
two clones in agreement.

What replaced it checks the wiring that actually exists — every folder in
`~/.claude/skills` should be a symlink resolving into this repo — and reports
three ways it breaks: an **orphan** (a real directory, in no commit, that editing
this repo cannot reach), a **dangling** link (the skill does not load at all),
and an **unlinked** skill (committed here, never loaded).

It found one immediately, dating from 2026-07-24: `shadcn-ui-design` is a real
directory in `~/.claude/skills` and is in no commit anywhere. It is the only
skill on this machine with no version control and no backup.

## Also fixed that day

`gh issue list` asked for `--label drift`, which made sense while the weekly
radar was the only thing filing issues. It is not — work reaches this room as a
hand-filed issue with a checklist per skill, and #1, #2 and #3 all carry no
label, so **none of them had ever appeared in the banner**.

## Checking it

```sh
python3 scripts/hooks/pending-reminder.py | python3 -m json.tool
REMINDER_TODAY=2026-10-01 python3 scripts/hooks/pending-reminder.py   # test a due window
```

To prove the wiring half can still fail, plant a fault and watch it appear:

```sh
ln -s /nonexistent ~/.claude/skills/zzz-test && python3 scripts/hooks/pending-reminder.py
rm ~/.claude/skills/zzz-test
```

A check that cannot fail is not a check — which is the whole reason the old one
needed replacing rather than fixing.
