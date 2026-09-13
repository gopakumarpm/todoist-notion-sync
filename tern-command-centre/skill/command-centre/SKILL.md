---
name: command-centre
description: Read and write the Tern Command Centre workspace (agents, skills, flows, crons, generations, docs, sprints, links) and keep every org record in step — Drive (ROSTER, HIRING-LOG, ORG-CHART), the Notion org page and roster database, the published command-centre and org-chart artifacts, and the tern-group skill zip. Use whenever a task changes who does what, starts or finishes a flow, produces a deliverable, needs a sprint task, or when asked to "refresh the command centre" or "refresh the org chart".
---

# Tern Command Centre — how Max uses it

The workspace lives at `tern-command-centre/workspace/` (in the Tern OS folder on the Mac; mirrored in GitHub `gopakumarpm/todoist-notion-sync`, branch `claude/company-org-structure-gusxlh`). The dashboard at `http://localhost:4777` only renders it. **Write files; the page follows.**

On surfaces that cannot see the folder (Cowork without the folder picked, claude.ai, iPhone), Max still applies the rules below to the records it *can* reach — the Notion org page and roster database — and leaves a note for the next Mac session to sync the files.

## When to write what

| Event | Write |
|---|---|
| A hire, promotion or transfer is approved | `agents/<id>.md` (frontmatter per `docs/how-agents-use-this.md`); status `paper` until the tern-plugin agent file exists. New company → also `company.json` (key, head, title, colour, blurb) |
| A workflow starts | append a run to `flows/<flow>.json` with every step `pending`; update step `status` and `note` as you go. Hires use `flows/hire-or-reuse.json` |
| A deliverable exists (deck, report, record, app, vault change, film, diagram) | `generations/<date>-<slug>.md` with `agent`, `flow`, `path` or `url`, one-paragraph body |
| A schedule is created, disabled or fired | `crons.json` entry: `enabled`, `status`, `last_run`, `next_run`, `note` |
| Something needs doing this week | task in `sprints/<current>.json` with `owner` (agent id), `company`, `status`, `priority` |
| Gopakumar decides something | `docs/open-decisions.md`: move it from the open table to the **Decided** table with the outcome |
| A reference the group needs | `docs/<slug>.md` |
| A new place to go | `links.json` |

## A hire, promotion or transfer — the full same-day checklist

Done on 12 Sep 2026 for the EdTech team (4) and eSource (8); repeat in this order.

1. **Workspace**: `agents/<id>.md` for each person (hand-written mandate, `status: paper`, `hired: <date>`); `scripts/roster-data.json` rows and `scripts/seed.js` skills so a re-seed does not lose them; `docs/org-structure.md` counts and lines; `docs/open-decisions.md`; `flows/hire-or-reuse.json` run; sprint task for Aarav to create the tern-plugin agent files; a generation record.
2. **tern-group skill**: `skill/tern-group/SKILL.md` company table, counts and front doors; then `node scripts/build-skills.js` (regenerates `references/`, mirrors to `.claude/skills/`, rebuilds `dist/skills/*.zip`).
3. **Drive** (records of truth): `employees/ROSTER.md` (both copies — `employees/` and `MAX-PROJECT-PACK/`), `logs/HIRING-LOG.md` (append-only), `charter/ORG-CHART.md`. The Drive connector cannot edit a file in place: **rename the current file with a date suffix** (e.g. `ROSTER.2026-09-12-edtech.md`), then **create** a new file with the original title in the same folder, `text/markdown`, no Google-type conversion. Keep byte sizes to confirm.
4. **Notion**: the page **Tern Group — Org Structure** (counts, company table, company section, practices table, decided notes, links) and the **Tern Group Roster** database (one row per person: Name, Role, Company, Reports to, Skills, Lead, Status, Agent ID, Hired). A new company needs its option added to the `Company` select first (update the data source), or row creation fails.
5. **Artifacts**: rebuild and republish the command centre (step 4 below) and the org chart (step 5 below).
6. **Commit and push** the repo branch.
7. Tell Gopakumar what needs him: re-upload `dist/skills/tern-group.zip` (Cowork and iPhone only see account skills), and Aarav's agent files.

## Refresh the command centre

1. `node scripts/seed.js` only when the roster export changed. It now **skips agent files that already exist** (hand-written mandates survive); pass `--force` to overwrite.
2. Bring `docs/`, `sprints/`, `generations/`, `crons.json`, `links.json` up to date from the records.
3. `node build-static.js` → `dist/index.html` and `dist/artifact.html` (+ `dist/state.json`).
3b. `node scripts/build-skills.js` → `skill/tern-group/references/`, `.claude/skills/` at the repo root, `dist/skills/*.zip`. If the roster or skills changed, ask Gopakumar to re-upload `dist/skills/tern-group.zip` and `command-centre.zip` (desktop app → Customize → Skills; the same page is claude.ai → Settings → Capabilities → Skills, which is what the iPhone uses).
4. Publish `dist/artifact.html` to the artifact **Tern Command Centre** `https://claude.ai/code/artifact/932a6090-6c9f-4d1c-81fe-f4e0bfa8252c` (same URL; it is pinned in Gopakumar's sidebar) and update the vault note `Projects/Tern OS Command Centre`.
5. **Org chart**: edit `app/org-chart.html` (six company columns; gold outline = added or elevated recently; counts in the header), publish it to the artifact **Tern Group Org Chart** `https://claude.ai/code/artifact/8edbbcd9-c9d4-47e6-b6d5-f4be21866c08` (also pinned), render `dist/org-chart.png` with headless Chrome (`--window-size=1500,1700 --screenshot`), commit it, and replace the image on the Notion org page. Direct upload to Notion is blocked from cloud sessions; host the PNG from the public repo (`raw.githubusercontent.com/...@<commit>/tern-command-centre/dist/org-chart.png`) and let Notion fetch it. From the Mac, upload the file directly.
6. `cd video && npm run render` → `video/out/tern-group-state.mp4` (the state-of-the-group film; add `--browser-executable=<chrome> --chrome-mode=chrome-for-testing` if Chrome will not launch).
7. Append a run to `flows/command-centre-refresh.json`.

## Rules
- Ids are slugs; never rename an id that a flow, sprint or generation already references.
- Never delete a run or a generation; mark it `skipped` or `superseded` instead.
- Safety rules in agent files stay.
- Reuse before hire: every hire record names what was reused and why a hire was still needed (Ananya Iyer's check).
- Gender balance stays 50 / 50 and names rotate Indian / global; say so in the hiring-log row that closes a cohort.
