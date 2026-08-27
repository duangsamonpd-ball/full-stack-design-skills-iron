#!/usr/bin/env python3
"""SessionStart hook — surface the outstanding work for test-build-skills.

Three sources, because they answer different questions:

  0. the two clones' HEADs — ~/.claude/skills resolves through the second
     clone, so when they diverge the skills Claude actually loads are stale.
     Local, no network. This is the one failure that has actually recurred.

  1. memory/project-open-items.md — the dated things a checker cannot do for
     itself (bump the Node pin, move the skills to WCAG 3.0). Items carry
     "(due: YYYY-MM-DD)" and optionally "(lead: Nd)", and stay silent until
     they are inside the lead window. A reminder about 2028 must not appear
     every session; silence is what keeps the ones that do appear worth
     reading.
  2. an open GitHub issue labelled `drift` — the weekly radar
     (.github/workflows/drift.yml) opens one when something moved. That is
     the thing most likely to be missed, since nothing else surfaces it.

Everything else in this workspace is already automated, so this hook is
deliberately quiet: no due items and no drift issue means no output at all.

Emits the Claude Code hook JSON contract on stdout. Never fails a session —
every failure path (missing file, no network, no gh, bad date) returns 0
silently.
"""
import json
import os
import re
import subprocess
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

# The script now lives INSIDE the repo (scripts/hooks/), which is the only place
# it can be reviewed, diffed or restored — it spent its first months in
# ~/.claude/projects/, inside no repository at all. The items file it reads is
# still Claude's per-project memory, so the path is derived rather than typed:
# Claude slugs a project directory by replacing every "/" with "-".
REPO_ROOT = Path(__file__).resolve().parents[2]
_slug = str(REPO_ROOT).replace("/", "-")
ITEMS = Path.home() / ".claude" / "projects" / _slug / "memory" / "project-open-items.md"
# This script lives outside the repo, so `gh` has no repository to infer from
# its working directory — it must be named. Without this the issue lookup fails
# silently and the hook is permanently blind to the radar.
REPO = "duangsamonpd-ball/full-stack-design-skills-iron"

# ── What "the live skill" means here, and how it goes wrong ─────────────────
# This block used to compare two clones of this repo, because ~/.claude/skills
# symlinked into a SECOND clone and a skill edited here was not the skill Claude
# loaded. That clone was deleted on 2026-08-26 and ~/.claude/skills now symlinks
# straight into this working directory, so the check had nothing left to compare.
#
# It did not fail. `clone_drift()` returned [] whenever a clone was missing —
# "never guesses" — so from the day the clone was deleted, the check that was the
# whole reason for this script reported all-clear every session. A missing input
# read exactly like two clones in agreement.
#
# What can actually go wrong now is the wiring itself, so that is what is
# checked: every folder in ~/.claude/skills should be a symlink that resolves
# into this repo. Three ways it breaks, all silent today:
#   · a real directory instead of a symlink — an orphaned copy that no commit
#     covers and no edit here can reach (shadcn-ui-design is one, since 07-24)
#   · a symlink whose target is gone — the skill stops loading entirely
#   · a skill committed here with no link in ~/.claude/skills — written, but
#     never loaded by any session
LIVE = Path.home() / ".claude" / "skills"

# Anchor on the bold heading at the start of a line. The prose above it
# describes the same list, so a bare substring search would match the
# description and yield an empty section.
HEADING = re.compile(r"^\*\*Remind Ball at the start of the next session\*\*", re.M)
DUE = re.compile(r"\(due:\s*(\d{4}-\d{2}-\d{2})\)")
LEAD = re.compile(r"\(lead:\s*(\d+)d\)")
DEFAULT_LEAD_DAYS = 30


def due_items(today: date) -> list[dict]:
    try:
        text = ITEMS.read_text(encoding="utf-8")
    except OSError:
        return []

    m = HEADING.search(text)
    if not m:
        return []

    rest = text[m.end():]
    end = re.search(r"\n\n\*\*", rest)
    section = rest[: end.start()] if end else rest

    out = []
    for raw in re.split(r"\n(?=\d+\.\s)", section)[1:]:
        body = " ".join(raw.split())
        num = re.match(r"(\d+)\.\s*", body)
        body = body[num.end():] if num else body
        if body.lstrip().startswith("~~"):          # struck through = done
            continue

        d = DUE.search(body)
        if d:
            try:
                when = datetime.strptime(d.group(1), "%Y-%m-%d").date()
            except ValueError:
                continue
            lead = LEAD.search(body)
            days = int(lead.group(1)) if lead else DEFAULT_LEAD_DAYS
            if today < when - timedelta(days=days):  # not yet worth saying
                continue
            left = (when - today).days
            when_txt = f"เหลือ {left} วัน" if left > 0 else (
                "วันนี้" if left == 0 else f"เลยมา {-left} วัน")
        else:
            when, when_txt = None, None

        title = re.match(r"\*\*(.+?)\*\*", body)
        out.append({
            "title": title.group(1) if title else body[:70],
            "when": when.isoformat() if when else None,
            "when_txt": when_txt,
            "detail": body,
        })
    return out


def drift_issues() -> list[dict]:
    """Open issues on the skills repo. Silent on any failure — no gh, no
    network, not authenticated, wrong repo: none of that may break a session.

    This asked for `--label drift` only, which made sense while the weekly radar
    was the only thing that filed issues. It is not: work reaches this room by
    hand-filed issue, one per day's failures, with a checklist per skill — #1
    (2026-08-25), #2 (2026-08-26), #3 (2026-08-27). None carries the label, so
    none of them has ever appeared in this banner. The radar's own issues are
    still marked, they are just no longer the only ones that count."""
    try:
        proc = subprocess.run(
            ["gh", "issue", "list", "--repo", REPO, "--state", "open",
             "--limit", "6",
             "--json", "number,title,updatedAt,labels"],
            capture_output=True, text=True, timeout=6,
        )
        if proc.returncode != 0:
            return []
        return json.loads(proc.stdout or "[]")
    except Exception:
        return []


def wiring_drift() -> list[dict]:
    """Where ~/.claude/skills and this repo disagree. Empty when they agree, or
    when it cannot tell (no LIVE dir, no repo skills) — never guesses. Unlike
    the clone check this replaced, an absent input is REPORTED, not silently
    treated as agreement."""
    src = REPO_ROOT / ".claude" / "skills"
    if not src.is_dir():
        return []
    if not LIVE.is_dir():
        return [{"kind": "no-live", "name": str(LIVE)}]

    out = []
    live_names = set()
    for entry in sorted(LIVE.iterdir()):
        if entry.name.startswith(".") or not (entry.is_dir() or entry.is_symlink()):
            continue
        live_names.add(entry.name)
        if entry.is_symlink():
            target = Path(os.path.realpath(entry))
            if not target.exists():
                out.append({"kind": "dangling", "name": entry.name})
            elif src.resolve() not in target.parents:
                out.append({"kind": "elsewhere", "name": entry.name, "to": str(target)})
        else:
            out.append({"kind": "orphan", "name": entry.name})

    for entry in sorted(src.iterdir()):
        if entry.is_dir() and not entry.name.startswith(".") and entry.name not in live_names:
            out.append({"kind": "unlinked", "name": entry.name})
    return out


def main() -> int:
    # REMINDER_TODAY=YYYY-MM-DD overrides "now" so the due-window logic can be
    # tested on demand rather than waited for. Date-dependent code that cannot
    # be run at another date is code nobody has actually checked.
    override = os.environ.get("REMINDER_TODAY")
    try:
        today = datetime.strptime(override, "%Y-%m-%d").date() if override else date.today()
    except ValueError:
        today = date.today()
    items = due_items(today)
    issues = drift_issues()
    wiring = wiring_drift()
    if not items and not issues and not wiring:
        return 0

    lines = ["📌 test-build-skills — มีเรื่องที่รอ Ball อยู่:"]
    if wiring:
        lines.append("  • ~/.claude/skills กับ repo ไม่ตรงกัน:")
        for w in wiring:
            k = w["kind"]
            if k == "orphan":
                lines.append(f"      {w['name']} — เป็นโฟลเดอร์จริง ไม่ใช่ symlink: ไม่มีใน commit ไหนเลย และแก้จาก repo ไม่ถึง")
            elif k == "dangling":
                lines.append(f"      {w['name']} — symlink ชี้ไปที่ที่ไม่มีแล้ว: skill นี้ไม่ถูกโหลด")
            elif k == "unlinked":
                lines.append(f"      {w['name']} — มีใน repo แต่ไม่มีใน ~/.claude/skills: ไม่เคยถูกโหลด")
            elif k == "elsewhere":
                lines.append(f"      {w['name']} — symlink ออกไปนอก repo นี้ → {w['to']}")
            else:
                lines.append(f"      ไม่มี {w['name']} — ตรวจ wiring ไม่ได้")
    for it in issues:
        labels = ", ".join(l["name"] for l in it.get("labels", []))
        tag = "เรดาร์เจอ drift → " if "drift" in labels else ""
        lines.append(f"  • {tag}issue #{it['number']}: {it['title']}")
    for it in items:
        suffix = f" ({it['when_txt']})" if it["when_txt"] else ""
        lines.append(f"  • {it['title']}{suffix}")
    lines.append("  พิมพ์ 'ค้างอะไรบ้าง' ให้ก๊อตตี้กางรายละเอียดได้เลยครับ")

    parts = []
    if wiring:
        parts.append(
            "~/.claude/skills and this repo disagree, so what a session LOADS is "
            "not what is committed here: "
            + "; ".join(f"{w['name']} ({w['kind']})" for w in wiring)
            + ". `orphan` means a real directory rather than a symlink — it is in "
            "no commit and editing the repo copy cannot reach it. `dangling` "
            "means the skill does not load at all. `unlinked` means it is "
            "committed but never loaded. Say so before editing that skill; do "
            "not silently fix the wiring."
        )
    if issues:
        parts.append(
            "Open issue(s) on the skills repo: "
            + "; ".join(f"#{i['number']} {i['title']}" for i in issues)
            + ". Work reaches this room as an issue with a checklist per skill — "
            "read the body before starting."
        )
    if items:
        parts.append(
            "Dated items now inside their reminder window, from "
            "memory/project-open-items.md (the file is the source of truth — "
            "strike an item through when it lands):\n\n"
            + "\n\n".join(
                f"{n}. {i['detail']}" for n, i in enumerate(items, 1)
            )
        )
    context = (
        "Outstanding work for test-build-skills, gathered at session start. "
        "Ball asked to be reminded automatically. Raise these when useful — do "
        "not dump them verbatim unless asked:\n\n" + "\n\n".join(parts)
    )

    json.dump(
        {
            "systemMessage": "\n".join(lines),
            "hookSpecificOutput": {
                "hookEventName": "SessionStart",
                "additionalContext": context,
            },
        },
        sys.stdout,
        ensure_ascii=False,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
