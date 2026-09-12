---
title: Where Max runs and what each surface loads
updated: 2026-09-12
tags: [conventions, surfaces, cowork]
---

# Where Max runs and what each surface loads

The org structure and the tern-os skills are files. Each surface Max runs on reads a different set of files, so "it exists" is not the same as "Max can see it here". This is the map.

| Surface | Skills it loads | Sees the Tern OS folder? | How the org structure reaches it |
|---|---|---|---|
| **Claude Code on the Mac** (Tern OS folder open) | `tern-os/.claude/skills/*` (all 89), `tern-plugin` agents, `~/.claude/skills` | Yes | ORG-CHART.md, ROSTER.md, the command-centre workspace, the `command-centre` skill |
| **Cowork on the Mac** (Desktop app, Cowork tab) | **Only skills and plugins enabled for the claude.ai account** (Desktop sidebar → Customize, or claude.ai → Settings → Capabilities → Skills). It does **not** read `~/.claude/skills` or a project's `.claude/skills` | Only the folder picked for the session, as plain files | The `tern-group` skill (uploaded once), the Notion org page via the Notion connector, and the Tern OS folder if it is picked for the session |
| **claude.ai / iPhone** (project "Max — Tern Group") | Account skills; no plugin skills | No | Project instructions + `COMPANY-CONTEXT.md`, `ROSTER.md` in the MAX-PROJECT-PACK; the `tern-group` skill |
| **Cloud sessions and Routines** (claude.ai/code, Weekly Group Review) | Account skills **plus** `.claude/skills/` committed in the cloned repo | The repo only | `.claude/skills/tern-group` and `.claude/skills/command-centre` in `gopakumarpm/todoist-notion-sync`; Drive and Notion connectors |

## Why the new org structure was missing in Cowork

Cowork does not run the tern-plugin and does not load `tern-os/.claude/skills`. The only skills it had were the ones enabled on the claude.ai account (teacher, legal-advisor, bd-consultant, remotion, data-report-generator and the Anthropic examples), none of which carry the 11 Sep structure. The Notion org page is reachable, but only if Max is told to look there.

## The fix (two uploads, once)

1. Get the zips: `tern-command-centre/dist/skills/tern-group.zip` and `command-centre.zip` (regenerate with `node scripts/build-skills.js`; also copied to the MAX-PROJECT-PACK folder in Drive).
2. Claude desktop app → sidebar **Customize** → **Skills** → add / upload → pick `tern-group.zip`; repeat for `command-centre.zip`. The same page exists at claude.ai → Settings → Capabilities → Skills.
3. Start a new Cowork session. Both skills are synced at session start; ask Max "who owns X?" or "refresh the command centre" to confirm.
4. Optional: pick the Tern OS folder as the Cowork session folder so Max can also read `tern-command-centre/workspace/` and the full skill bodies as files.

## What the `tern-group` skill carries

`SKILL.md` (routing, companies, front doors, rules) and `references/`: `org-structure.md`, `roster.md` (100 rows), `skills-catalogue.md` (89 skills and carriers), `rules-and-cadence.md`, `where-things-live.md`. All generated from this workspace, so a roster change is: `seed.js` → `build-skills.js` → re-upload the zip. Until the zip is re-uploaded, Cowork keeps the previous version.

## Not fixed by this

The 89 tern-os skill **bodies** still run only in Claude Code with the Tern OS folder open. In Cowork Max works from the one-line summary and the carrier's mandate, or reads the SKILL.md as a file if the folder is picked. Uploading each of the 89 as an account skill is possible but is a separate decision (Ananya Iyer to propose the first five in the weekly review).
