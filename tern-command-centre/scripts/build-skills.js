#!/usr/bin/env node
// Builds the uploadable skills for surfaces that cannot see the Tern OS folder (Cowork on the Mac, claude.ai, mobile, cloud sessions).
//   1. Regenerates skill/tern-group/references/*.md from the workspace (agents, skills, docs, company.json, links.json).
//   2. Mirrors skill/<name>/ into <repo>/.claude/skills/<name>/ so cloud sessions on this repo load them automatically.
//   3. Zips each skill into dist/skills/<name>.zip — upload that in the Claude desktop app (Customize → Skills) or claude.ai → Settings → Capabilities → Skills.
// Re-runnable; zero dependencies beyond Node 18+ and the `zip` CLI.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadState } = require('../lib/workspace');

const ROOT = path.join(__dirname, '..');
const REPO = path.join(ROOT, '..');
const SKILL_DIR = path.join(ROOT, 'skill');
const REF_DIR = path.join(SKILL_DIR, 'tern-group', 'references');
const DIST = path.join(ROOT, 'dist', 'skills');
const state = loadState(ROOT);
const today = new Date().toISOString().slice(0, 10);
const byId = Object.fromEntries(state.agents.map(a => [a.id, a]));
const nameOf = id => id === 'gopakumar' ? 'Gopakumar (Chairman)' : (byId[id] ? byId[id].name : id);
const docBody = id => { const d = state.docs.find(d => d.id === id); return d ? d.body : ''; };
const stripTitle = body => body.replace(/^#\s+.+\n+/, '');

fs.mkdirSync(REF_DIR, { recursive: true });

// 1a. org-structure.md — the tree, company blurbs, practices.
{
  const blurbs = state.companies.map(c => `- **${c.name}** — ${c.title}: ${nameOf(c.head)}. ${c.blurb}`).join('\n');
  fs.writeFileSync(path.join(REF_DIR, 'org-structure.md'),
`# Tern Group — org structure (generated ${today})

${stripTitle(docBody('org-structure'))}

## Company charters
${blurbs}

Generated from \`tern-command-centre/workspace/\` by \`scripts/build-skills.js\`. Do not edit by hand.
`);
}

// 1b. roster.md — every person, grouped by company then arm, with line manager, status and skills.
{
  const order = state.companies.map(c => c.key);
  const groups = {};
  for (const a of state.agents) {
    const key = `${a.company}${a.arm ? ' · ' + a.arm : ''}`;
    (groups[key] = groups[key] || []).push(a);
  }
  const sortKey = k => { const i = order.indexOf(k.split(' · ')[0]); return (i < 0 ? 99 : i) + k; };
  let out = `# Tern Group — roster (${state.agents.length} people, generated ${today})\n\nStatus: \`active\` = agent file exists in tern-plugin; \`paper\` = hired, spec only (agent file pending). Ids are the slugs used in flows, sprints and generations.\n`;
  for (const key of Object.keys(groups).sort((a, b) => sortKey(a).localeCompare(sortKey(b)))) {
    const rows = groups[key].sort((a, b) => (b.lead - a.lead) || a.name.localeCompare(b.name));
    out += `\n## ${key} (${rows.length})\n\n| Id | Name | Role | Reports to | Status | Skills |\n|---|---|---|---|---|---|\n`;
    for (const a of rows) out += `| ${a.id} | ${a.name}${a.lead ? ' ★' : ''} | ${a.role} | ${nameOf(a.reports_to)} | ${a.status} | ${a.skills.join(', ')} |\n`;
  }
  out += `\n★ = leads a team. Generated from \`workspace/agents/*.md\`; ROSTER.md in Drive is the record of truth.\n`;
  fs.writeFileSync(path.join(REF_DIR, 'roster.md'), out);
}

// 1c. skills-catalogue.md — the tern-os skills and who carries each.
{
  let out = `# tern-os skills catalogue (${state.skills.length} skills, generated ${today})\n\nEach skill's full body is \`tern-os/.claude/skills/<id>/SKILL.md\` on the Mac (Claude Code loads it there). On other surfaces Max works from this summary and the carrier's mandate. Reviewed every Monday in the Weekly Group Review (Fit / Stretch / Gap → Keep / Update / Upgrade / Absorb / Hire).\n\n| Skill | What it does | Carried by |\n|---|---|---|\n`;
  for (const s of state.skills) out += `| ${s.id} | ${s.summary} | ${s.used_by.map(nameOf).join(', ') || '—'} |\n`;
  const unassigned = state.skills.filter(s => !s.used_by.length).length;
  out += `\n${unassigned} skills have no carrier yet; the weekly review assigns them.\n`;
  fs.writeFileSync(path.join(REF_DIR, 'skills-catalogue.md'), out);
}

// 1d. rules-and-cadence.md — safety rules, review cadence, open decisions.
fs.writeFileSync(path.join(REF_DIR, 'rules-and-cadence.md'),
`# Rules, cadence and open decisions (generated ${today})

## Rules every agent carries
${stripTitle(docBody('rules'))}

## Review cadence
${stripTitle(docBody('review-cadence'))}

## Open decisions for Gopakumar
${stripTitle(docBody('open-decisions'))}
`);

// 1e. where-things-live.md — records, surfaces, links.
{
  const groups = {};
  for (const l of state.links) (groups[l.group] = groups[l.group] || []).push(l);
  let links = '';
  for (const g of Object.keys(groups)) {
    links += `\n### ${g}\n`;
    for (const l of groups[g]) links += `- [${l.title}](${l.url})${l.note ? ' — ' + l.note : ''}\n`;
  }
  fs.writeFileSync(path.join(REF_DIR, 'where-things-live.md'),
`# Where things live (generated ${today})

## Records of truth
- **ORG-CHART.md, ROSTER.md, HIRING-LOG.md** — Google Drive, \`Tern Intelligence/charter\`, \`employees\`, \`logs\` (links below). Updated the same day as any hire, promotion or transfer.
- **Notion · Tern Group — Org Structure** page and the **Tern Group Roster** database (100 rows) — readable through the Notion connector on every surface.
- **Command-centre workspace** — \`tern-command-centre/workspace/\` in the Tern OS folder on the Mac, mirrored in GitHub \`gopakumarpm/todoist-notion-sync\` (branch \`claude/company-org-structure-gusxlh\`). The dashboard and the published artifact render it.
- **Obsidian** — \`02 Areas/Tern Group\`, \`Projects/Tern OS Command Centre\`; Obsidian Sync carries the vault to Surface, Mac and iPhone.

## Surfaces and what each one loads
${stripTitle(docBody('surfaces'))}

## Links
${links}`);
}

// 2. Mirror skill/<name>/ → <repo>/.claude/skills/<name>/ (cloud sessions on this repo load project skills from there).
const skills = fs.readdirSync(SKILL_DIR).filter(n => fs.existsSync(path.join(SKILL_DIR, n, 'SKILL.md')));
const PROJECT_SKILLS = path.join(REPO, '.claude', 'skills');
fs.mkdirSync(PROJECT_SKILLS, { recursive: true });
for (const name of skills) {
  const dest = path.join(PROJECT_SKILLS, name);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(path.join(SKILL_DIR, name), dest, { recursive: true });
}

// 3. Zip each skill as <name>/SKILL.md (+ references) → dist/skills/<name>.zip
fs.mkdirSync(DIST, { recursive: true });
for (const name of skills) {
  const zip = path.join(DIST, `${name}.zip`);
  fs.rmSync(zip, { force: true });
  execFileSync('zip', ['-qr', '-X', zip, name], { cwd: SKILL_DIR });
  console.log(`${path.relative(ROOT, zip)}  ${(fs.statSync(zip).size / 1024).toFixed(0)} KB`);
}
console.log(`references: ${fs.readdirSync(REF_DIR).join(', ')} · mirrored to ${path.relative(REPO, PROJECT_SKILLS)}/{${skills.join(',')}}`);
