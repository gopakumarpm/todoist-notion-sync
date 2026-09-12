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
| Live | the group as a living map: every agent in its company district, flow packets travelling between the agents of each run, cron rings ticking on their owners, tasks in flight above their owners; pause, speed, focus a company, hover and click | everything |
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

## Video (Remotion)

`video/` renders a 46-second state-of-the-group film from the same export (`dist/state.json`): intro → group board → Weekly Group Review pipeline lighting step by step → sprint board → needs attention & crons → outro. Storyboard is at the top of `video/src/compositions/TernGroupState.tsx`.

```bash
node build-static.js                 # refresh dist/state.json first
cd video && npm install
npm run studio                       # preview in the browser
npm run render                       # → video/out/tern-group-state.mp4 (1920×1080, 30 fps)
```

If Remotion cannot launch your Chrome, add `--browser-executable=<path> --chrome-mode=chrome-for-testing` to the render command.

## Install into Tern OS (Claude Code on the Mac)

Copy this folder next to `tern-plugin/` in the Tern OS folder, copy `skill/command-centre/` and `skill/tern-group/` into `.claude/skills/`, and add one line to Max's system instructions: *"Keep `tern-command-centre/workspace/` current per the command-centre skill."*

## Make it available in Cowork, claude.ai and cloud sessions

Cowork loads **only the skills enabled on the claude.ai account** (Desktop app → Customize → Skills); it never reads `tern-os/.claude/skills` or `~/.claude/skills`. So the org structure travels as a skill:

```bash
node scripts/build-skills.js   # → skill/tern-group/references/*.md, .claude/skills/{tern-group,command-centre} at the repo root, dist/skills/*.zip
```

Upload `dist/skills/tern-group.zip` and `dist/skills/command-centre.zip` once in the desktop app (sidebar **Customize → Skills**, same page as claude.ai → Settings → Capabilities → Skills), then start a new Cowork session. Re-run the script and re-upload after any roster change. Cloud sessions and Routines on this repo pick the skills up from `.claude/skills/` without an upload. Full map of surfaces: `workspace/docs/surfaces.md`.
