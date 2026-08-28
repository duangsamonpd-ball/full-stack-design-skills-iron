#!/usr/bin/env bash
# Build distributable Skill packages into dist/ (a build artifact — gitignored).
#   1. iron-master-skills-architecture.zip  — browsable bundle (README + skills/)
#   2. iron-skills-claude-code.zip           — drop-in: unzip at a project root → .claude/skills/
#   3. per-skill/<name>.zip                  — one per skill folder, for the Claude app upload
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/.claude/skills"
DIST="$ROOT/dist"
TMP="$(mktemp -d)"
# Counted, never typed: this file ships the folder, so it is the one place that can
# SEE how many skills there are. It said 15 while zipping 16 until 2026-08-28.
COUNT="$(find "$ROOT/.claude/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d " ")"
trap 'rm -rf "$TMP"' EXIT

rm -rf "$DIST"; mkdir -p "$DIST/per-skill"

# 1 · browsable bundle (visible skills/ folder + install README)
B="$TMP/iron-master-skills-architecture"
mkdir -p "$B"; cp -R "$SRC" "$B/skills"
cat > "$B/README.md" <<'MD'
# Iron Master Skills Architecture

__COUNT__ authored Claude skills for UX/UI + frontend engineering — Tailwind CSS v4,
React · Astro · Vue. They are in the **`skills/`** folder. One of them,
`shadcn-ui-design`, is scoped to the Next.js + shadcn/ui stack; the rest are
stack-independent.

## Install — Claude Code
    mkdir -p /path/to/your/project/.claude
    cp -R skills /path/to/your/project/.claude/skills
Claude Code auto-discovers each `SKILL.md`. (`.claude` is hidden — reveal with Cmd+Shift+. )

## Install — Claude app (claude.ai)
Upload one skill at a time (see the `per-skill/` zips): Settings → Capabilities → Skills.

MIT · Ball @ Iron Software
MD
sed "s/__COUNT__/$COUNT/g" "$B/README.md" > "$B/README.tmp" && mv "$B/README.tmp" "$B/README.md"

# 2 · drop-in for Claude Code (.claude/skills at the zip root)
D="$TMP/dropin"; mkdir -p "$D/.claude"; cp -R "$SRC" "$D/.claude/skills"

# 3 · per-skill zips (one folder each: <name>/SKILL.md + references/)
find "$TMP" -name '.DS_Store' -delete 2>/dev/null || true

( cd "$TMP" && zip -rq "$DIST/iron-master-skills-architecture.zip" iron-master-skills-architecture -x '*.DS_Store' )
( cd "$D"   && zip -rq "$DIST/iron-skills-claude-code.zip" .claude -x '*.DS_Store' )
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  ( cd "$SRC" && zip -rq "$DIST/per-skill/$name.zip" "$name" -x '*.DS_Store' )
done

cat > "$DIST/README.md" <<'MD'
# dist — distributable Skill packages (generated)

Rebuild with `scripts/build-packages.sh`. Not committed (build artifacts).

- `iron-master-skills-architecture.zip` — browsable bundle (README + `skills/`). Best for reading / sharing.
- `iron-skills-claude-code.zip` — **drop-in**: unzip at a project root and `.claude/skills/` appears, ready for Claude Code (0 steps).
- `per-skill/<name>.zip` — one skill each (`<name>/SKILL.md` + `references/`); upload individually to the Claude app.
MD

echo "Built into $DIST:"
( cd "$DIST" && ls -1 *.zip && echo "per-skill/ ($(ls -1 per-skill | wc -l | tr -d ' ') zips)" )
