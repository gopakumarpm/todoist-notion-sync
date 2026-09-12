---
title: tern-group and command-centre skills packaged for Cowork
type: app
agent: aarav-mehta
flow: command-centre-refresh
date: 2026-09-12
path: tern-command-centre/dist/skills/tern-group.zip · command-centre.zip · .claude/skills/
summary: Two uploadable skills so Max carries the 11 Sep org structure, the 100-person roster, the 89-skill catalogue and the command-centre conventions on Cowork, claude.ai, mobile and cloud sessions. Built by scripts/build-skills.js from this workspace; mirrored into the repo's .claude/skills for cloud sessions; copies placed in the MAX-PROJECT-PACK folder in Drive.
---

# tern-group and command-centre skills packaged for Cowork

Gopakumar reported on 12 Sep that the new org structure and related skills were not available in Cowork on the Mac. Cause: Cowork loads only the skills enabled on the claude.ai account, never `tern-os/.claude/skills` or `~/.claude/skills` (see `docs/surfaces`). Fix: package the structure as an account skill.

- `skill/tern-group/` — SKILL.md plus generated references (org tree, roster, skills catalogue, rules and cadence, where things live).
- `skill/command-centre/` — unchanged conventions, now also zipped.
- `scripts/build-skills.js` — regenerates the references, mirrors both into `.claude/skills/` at the repo root, writes `dist/skills/*.zip`.

Remaining step for Gopakumar: upload the two zips once in the desktop app (Customize → Skills); tracked as sprint task `cowork-skills`.
