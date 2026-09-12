---
title: How agents use this workspace
updated: 2026-09-12
tags: [conventions]
---

# How agents use this workspace

This folder is the shared memory of Tern Group. **Max and every agent read it and write to it; the dashboard only renders it.** Anything an agent needs to tell Gopakumar, or another agent, goes into a file here, in the format below. No file is ever edited by the dashboard except sprint tasks.

## Folders

| Folder | One file per | Format |
|---|---|---|
| `agents/` | person on the roster | Markdown with frontmatter: `name, role, company, arm, reports_to, lead, status (active · paper · idle), hired, skills: [ids], model` |
| `skills/` | tern-os skill | Markdown with `name, summary, tags` |
| `flows/` | repeatable workflow | JSON: `steps[]` (id, name, agent, kind, detail) and `runs[]` (id, status, steps[] with status · ms · note) |
| `crons.json` | — | Array of schedules: `id, name, schedule (cron), human, tz, flow, agent, enabled, status, last_run, next_run, note` |
| `generations/` | deliverable | Markdown with `title, type (deck · report · record · doc · app · vault), agent, flow, date, path, url, summary`; file name starts with the date |
| `docs/` | reference page | Markdown; first heading is the title |
| `sprints/` | sprint | JSON: `name, goal, start, end, tasks[]` with `id, title, owner (agent id), company, status (backlog · todo · doing · done), priority, due, notes` |
| `links.json` | — | Array of `group, title, url, note` |

## Rules for writing

1. **Ids are slugs** of names: `dr.` dropped, lower-case, hyphens (`Dr. Rekha Iyengar` → `rekha-iyengar`). `Gopakumar` is `gopakumar`.
2. **A flow run is appended, never rewritten.** Update a step's `status` (pending · running · done · failed · skipped) and `note` as you go.
3. **Every deliverable gets a generation** the moment it exists, with the `flow` and `agent` that produced it.
4. **A new hire is not done until** `agents/<id>.md` exists with `status: paper`, and turns `active` only when the tern-plugin agent file exists.
5. **Sprint tasks are the only thing the dashboard writes.** Agents may also edit the sprint JSON directly; keep ids stable.
6. **Safety rules travel with the agent file** (Healthcare, Animal Health, Research, MedTech). Do not remove them.

## Refresh cycle

`node scripts/seed.js` regenerates agents and skills from `scripts/roster-data.json` (export of ROSTER.md). `node build-static.js` exports `dist/index.html`; Max publishes that to the artifact link.
