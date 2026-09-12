# Tern Command Centre

A local, file-based command centre for Tern Group's agents, in the spirit of RUBRIC: **one folder the agents read and write, one page that shows it.** No database, no accounts, no dependencies beyond Node 18+.

```
tern-command-centre/
├── server.js          # node server.js → http://localhost:4777 (live; re-reads workspace every few seconds)
├── build-static.js    # node build-static.js → dist/index.html (read-only snapshot for the Claude artifact)
├── app/index.html     # the dashboard (single file, Tern brand)
├── lib/workspace.js   # reads the workspace into one state object
├── scripts/seed.js    # regenerates agents/ and skills/ from roster-data.json (export of ROSTER.md)
├── skill/command-centre/SKILL.md   # copy into tern-os/.claude/skills/ so Max keeps the workspace current
└── workspace/         # THE DATA — agents, skills, flows, crons.json, generations, docs, sprints, links.json, company.json
```

## Run it

```bash
cd tern-command-centre
node scripts/seed.js      # once, or whenever the roster changes
node server.js            # open http://localhost:4777
```

Edit anything under `workspace/` in your editor or let Max do it; the page updates on its own. Sprint tasks can also be moved and added from the page.

## Panels

| Panel | Shows | Source |
|---|---|---|
| Overview | headline numbers, company board with pixel avatars, what needs attention, latest generations, running flows | everything |
| Agents | all 100 people as pixel avatars; filter by company; reports-to and direct reports; skills; status (active · paper) | `agents/*.md` |
| Skills | the 89 tern-os skills and who carries each | `skills/*.md` |
| Flows | each workflow as a pipeline; pick a run and press Play to step through it | `flows/*.json` |
| Crons | every schedule, whether it is enabled and healthy, next run | `crons.json` |
| Generations | deliverables with the agent and flow that produced them | `generations/*.md` |
| Docs | the markdown reference the agents read (org, cadence, rules, decisions, conventions) | `docs/*.md` |
| Sprints | goal, progress, four-column board; move and add tasks in live mode | `sprints/*.json` |
| Links | grouped bookmarks | `links.json` |

## Export and publish

```bash
node build-static.js      # writes dist/index.html with the state inlined
```

Max publishes `dist/index.html` to the existing artifact link so the same snapshot is on the phone. Full conventions for agents: `workspace/docs/how-agents-use-this.md`.

## Install into Tern OS

Copy this folder next to `tern-plugin/` in the Tern OS folder, copy `skill/command-centre/` into `.claude/skills/`, and add one line to Max's system instructions: *"Keep `tern-command-centre/workspace/` current per the command-centre skill."*
