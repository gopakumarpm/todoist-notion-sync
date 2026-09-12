---
name: command-centre
description: Read and write the Tern Command Centre workspace (agents, skills, flows, crons, generations, docs, sprints, links). Use whenever a task changes who does what, starts or finishes a flow, produces a deliverable, or needs a sprint task; and when asked to "refresh the command centre".
---

# Tern Command Centre — how Max uses it

The workspace lives at `tern-command-centre/workspace/` (in the Tern OS folder on the desktop; mirrored in this repo). The dashboard at `http://localhost:4777` only renders it. **Write files; the page follows.**

## When to write what

| Event | Write |
|---|---|
| A hire, promotion or transfer is approved | `agents/<id>.md` (frontmatter per `docs/how-agents-use-this.md`); status `paper` until the tern-plugin agent file exists |
| A workflow starts | append a run to `flows/<flow>.json` with every step `pending`; update step `status` and `note` as you go |
| A deliverable exists (deck, report, record, app, vault change, film) | `generations/<date>-<slug>.md` with `agent`, `flow`, `path` or `url`, one-paragraph body |
| A schedule is created, disabled or fired | `crons.json` entry: `enabled`, `status`, `last_run`, `next_run`, `note` |
| Something needs doing this week | task in `sprints/<current>.json` with `owner` (agent id), `company`, `status`, `priority` |
| A reference the group needs | `docs/<slug>.md` |
| A new place to go | `links.json` |

## Refresh the command centre

1. `node scripts/seed.js` if the roster changed (export ROSTER.md → `scripts/roster-data.json` first).
2. Bring `docs/`, `sprints/`, `generations/`, `crons.json` up to date from the records.
3. `node build-static.js` → `dist/index.html`.
3b. `node scripts/build-skills.js` → `skill/tern-group/references/`, `.claude/skills/` at the repo root, `dist/skills/*.zip`. If the roster or skills changed, ask Gopakumar to re-upload `dist/skills/tern-group.zip` in the desktop app (Customize → Skills); Cowork only sees account skills (`docs/surfaces.md`).
4. Publish `dist/artifact.html` to the artifact `https://claude.ai/code/artifact/932a6090-6c9f-4d1c-81fe-f4e0bfa8252c` (same URL) and update the vault note `Projects/Tern OS Command Centre`.
5. `cd video && npm run render` → `video/out/tern-group-state.mp4` (the state-of-the-group film; add `--browser-executable=<chrome> --chrome-mode=chrome-for-testing` if Chrome will not launch).
6. Append a run to `flows/command-centre-refresh.json`.

## Rules
- Ids are slugs; never rename an id that a flow, sprint or generation already references.
- Never delete a run or a generation; mark it `skipped` or `superseded` instead.
- Safety rules in agent files stay.
