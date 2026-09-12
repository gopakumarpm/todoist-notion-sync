# Where things live (generated 2026-09-12)

## Records of truth
- **ORG-CHART.md, ROSTER.md, HIRING-LOG.md** — Google Drive, `Tern Intelligence/charter`, `employees`, `logs` (links below). Updated the same day as any hire, promotion or transfer.
- **Notion · Tern Group — Org Structure** page and the **Tern Group Roster** database (100 rows) — readable through the Notion connector on every surface.
- **Command-centre workspace** — `tern-command-centre/workspace/` in the Tern OS folder on the Mac, mirrored in GitHub `gopakumarpm/todoist-notion-sync` (branch `claude/company-org-structure-gusxlh`). The dashboard and the published artifact render it.
- **Obsidian** — `02 Areas/Tern Group`, `Projects/Tern OS Command Centre`; Obsidian Sync carries the vault to Surface, Mac and iPhone.

## Surfaces and what each one loads
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

## Links

### Command centre
- [Tern OS Command Centre (published snapshot)](https://claude.ai/code/artifact/932a6090-6c9f-4d1c-81fe-f4e0bfa8252c) — Static export of this workspace; republish with build-static.js
- [Tern Group Org Chart (diagram)](https://claude.ai/code/artifact/8edbbcd9-c9d4-47e6-b6d5-f4be21866c08) — Owner, Group MD, four companies, the EdTech team and the eight practices, as of 12 Sep 2026; also linked from the Notion org page
- [Skills for Cowork (tern-group.zip · command-centre.zip)](https://github.com/gopakumarpm/todoist-notion-sync/tree/claude/company-org-structure-gusxlh/tern-command-centre/dist/skills) — Upload once in the desktop app: Customize → Skills. Also in Drive MAX-PROJECT-PACK. Rebuild with scripts/build-skills.js
- [claude.ai Skills settings (Customize)](https://claude.ai/settings/capabilities) — The only skills Cowork loads are the ones enabled here
- [claude.ai Routines](https://claude.ai/code/routines) — Recreate the Weekly Group Review Routine here with Drive, Notion and Todoist attached

### Records
- [Notion · Tern Group — Org Structure](https://app.notion.com/p/3d9cac843da681d4a123d42df11dd423) — Full structure + Tern Group Roster database (112 rows); readable by Max on every surface via the Notion connector
- [Notion · eSource (company page)](https://app.notion.com/p/3cbcac843da6815da8b3e89856562d7f) — Fifth company, talent & workforce; team rows in the Tern Group Roster database (Company = eSource); seed backlog in the TalentNova page and Todoist project
- [Tern Intelligence / charter (Drive)](https://drive.google.com/drive/folders/12uI1Wv1s0yljYONea_HPxCdZ1JNAfldD) — ORG-CHART.md · REVIEW-CADENCE.md · reviews/
- [Tern Intelligence / employees (Drive)](https://drive.google.com/drive/folders/1hdaC7MAvSbTwFGPuh2gYHIAYtmW03GL0) — ROSTER.md — 100 rows
- [Tern Intelligence / logs (Drive)](https://drive.google.com/drive/folders/1m2yQMs2RYG2p_OtwtPDvBOH6Fh4UpLux) — HIRING-LOG.md
- [Gopa Vault (Drive mirror of Obsidian)](https://drive.google.com/drive/folders/1mJinYEVGFjkB5sY_0v6UgpJOpegl5ura) — PARA vault; Obsidian Sync carries it to Surface, Mac, iPhone
- [Tern OS / MAX-PROJECT-PACK (Drive)](https://drive.google.com/drive/folders/1GKmUfFouH1rCkT2fjJIMFFaqZCmQAinB) — Max system instructions v2, company context, roster

### Live products
- [Taurus Ops Dashboard (HDFC Ergo MIS)](https://insurance-taurus-dashboard.netlify.app)
- [FeatherQuest](https://featherquest.netlify.app) — Aarshi's study-rewards app — Tern Academy

### Family
- [Notion · Pluto & Bannu](https://www.notion.so) — Diet, weights, moults, vet visits — Tern Animal Health's working record
- [Notion · Family Tasks](https://www.notion.so)
