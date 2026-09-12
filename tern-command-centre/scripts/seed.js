#!/usr/bin/env node
// Seeds workspace/agents and workspace/skills from scripts/roster-data.json (Tern Group roster of 11 Sep 2026).
// Re-runnable: overwrites agent/skill files it generates, leaves everything else alone.
'use strict';
const fs = require('fs');
const path = require('path');
const data = require('./roster-data.json');
const WS = path.join(__dirname, '..', 'workspace');
const slug = s => s.toLowerCase().replace(/^dr\.\s*/, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Skills each agent starts with (tern-os skill ids). Everyone else starts empty — the weekly review fills gaps.
const SKILLS = {
  'max': ['chief-of-staff', 'company-os', 'agent-protocol', 'context-engine', 'board-meeting', 'decision-logger', 'today', 'productivity'],
  'hannah-brooks': ['chief-of-staff', 'team-communications', 'productivity', 'meeting-analyzer'],
  'priya-nair': ['cfo-advisor', 'finance', 'data-report'],
  'vikram-desai': ['general-counsel-advisor', 'legal-advisor', 'Legal'],
  'ananya-iyer': ['chro-advisor', 'culture-architect', 'org-health-diagnostic'],
  'kavya-reddy': ['market-opportunities', 'competitive-intel', 'ma-playbook', 'intl-expansion', 'scenario-war-room'],
  'sofia-rossi': ['cmo-advisor', 'marketing', 'internal-narrative'],
  'maya-lindqvist': ['content-repurposer', 'youtube', 'doc-generator'],
  'amara-okonkwo': ['chief-ai-officer-advisor', 'ciso-advisor'],
  'riya-malhotra': ['social-media-manager', 'social-media-analytics', 'instagram-creator', 'linkedin-creator', 'twitter-creator'],
  'noah-bennett': ['remotion', 'youtube-content-engine', 'get-video-highlights'],
  'diego-santos': ['ceo-advisor', 'company-os', 'strategic-alignment', 'board-deck-builder'],
  'aarav-mehta': ['cto-advisor', 'app-builder', 'api-builder', 'devops-builder', 'database-designer', 'test-builder', 'vpe-advisor'],
  'sneha-pillai': ['coo-advisor', 'senior-pm', 'scrum-master', 'pm-skills', 'change-management'],
  'rohan-kapoor': ['sales', 'cro-advisor', 'bd-consultant', 'email-writer'],
  'ethan-cole': ['cpo-advisor', 'frontend-design', 'mobile-app-builder', 'website-builder', 'brainstorming'],
  'liam-obrien': ['data-analyst', 'dashboard-builder', 'automation-designer', 'streamlit-builder', 'chief-data-officer-advisor'],
  'arjun-khanna': ['ciso-advisor'],
  'grace-liu': ['app-builder', 'api-builder', 'agent-protocol'],
  'lucas-meyer': ['mobile-app-builder'],
  'karthik-subramanian': ['org-health-diagnostic', 'jira-expert', 'confluence-expert', 'atlassian-admin', 'atlassian-templates'],
  'chloe-martin': ['chief-customer-officer-advisor'],
  'rajeev-bhatia': ['sales', 'bd-consultant'],
  'neha-joshi': ['data-report', 'data-report-generator', 'dashboard-builder'],
  'sunita-raghavan': ['teacher', 'presentation-maker'],
  'vinod-kulkarni': ['teacher'], 'elena-petrova': ['teacher'], 'farah-siddiqui': ['teacher'], 'oliver-hughes': ['teacher'],
  'manoj-deshpande': ['teacher'], 'isabel-moreno': ['teacher'], 'rohit-saxena': ['teacher', 'chrome-extension-builder'],
  'jonas-weber': ['app-builder', 'frontend-design', 'infographic'],
  'carlos-rivera': ['nutrition', 'fitness'], 'vikas-thakur': ['fitness'],
  'sophie-laurent': ['doc-generator', 'pdf'], 'felix-andersson': ['data-analyst', 'dashboard-builder'],
  'sameer-rathi': ['app-builder', 'api-builder'], 'ines-fischer': ['test-builder'], 'vivek-anand': ['cpo-advisor', 'market-opportunities']
};
const PAPER = new Set(['Tern Health & Research']); // hired 11 Sep, agent files not yet in tern-plugin
const HIRED = { 'Tern Academy': '2026-09-11', 'Tern Animal Health': '2026-09-11', 'Tern Health & Research': '2026-09-11' };

fs.mkdirSync(path.join(WS, 'agents'), { recursive: true });
fs.mkdirSync(path.join(WS, 'skills'), { recursive: true });
let n = 0;
for (const [name, role, company, arm, mgr, lead] of data.team) {
  const id = slug(name);
  const mid = mgr === 'Gopakumar' ? 'gopakumar' : slug(mgr);
  const skills = SKILLS[id] || [];
  const fm = ['---', `name: ${name}`, `role: ${role.replace(/:/g, ' -')}`, `company: ${company}`, arm ? `arm: ${arm}` : null, `reports_to: ${mid}`,
    `lead: ${lead ? 'true' : 'false'}`, `status: ${PAPER.has(company) ? 'paper' : 'active'}`, HIRED[company] ? `hired: ${HIRED[company]}` : null,
    `skills: [${skills.join(', ')}]`, 'model: fable', '---'].filter(Boolean).join('\n');
  const body = `\n# ${name}\n\n**${role}** — ${company}${arm ? ' · ' + arm : ''}. Reports to ${mgr === 'Gopakumar' ? 'Gopakumar (Chairman)' : mgr}.\n\n` +
    (id === 'max' ? 'Group Managing Director. Reads the roster, routes every request to the right company, delegates, and reports back to Gopakumar as one voice. Chairs the Weekly Group Review every Monday 08:00 IST.\n'
      : `## Mandate\n- Own the work of this role for ${company}; escalate to ${mgr === 'Gopakumar' ? 'Gopakumar' : mgr} when a decision is above the role.\n- Reuse before hire; every deliverable lands in generations/ with the flow that produced it.\n${PAPER.has(company) ? '- Agent file pending in tern-plugin/agents — this profile is the spec for it.\n' : ''}`) +
    (company === 'Tern Health & Research' && arm === 'Healthcare' ? '\n## Rule\nSupports care and prepares the family for the doctor; never diagnoses or prescribes. Emergencies → 112 / 108 first.\n' : '') +
    (company === 'Tern Animal Health' ? '\n## Rule\nAdvises and prepares; any acute sign in Pluto or Bannu → same-day licensed avian vet in Pune.\n' : '') +
    (company === 'Tern Health & Research' && arm === 'Research' ? '\n## Rule\nAdvisory only; ethics approval before any human-subject study; every claim cited.\n' : '') +
    (company === 'Tern Health & Research' && arm === 'MedTech' ? '\n## Rule\nConcepts stay research-grade until a regulatory pathway (CDSCO / FDA / CE) and a risk file exist.\n' : '');
  fs.writeFileSync(path.join(WS, 'agents', id + '.md'), fm + '\n' + body); n++;
}
let s = 0;
for (const [id, desc] of data.skills) {
  fs.writeFileSync(path.join(WS, 'skills', id + '.md'), `---\nname: ${id}\nsummary: ${desc.replace(/:/g, ' -')}\ntags: [tern-os]\n---\n\n# ${id}\n\n${desc}\n\nSource: \`tern-os/.claude/skills/${id}\`. Reviewed every Monday in the Weekly Group Review (Fit / Stretch / Gap → Keep / Update / Upgrade / Absorb / Hire).\n`); s++;
}
console.log(`seeded ${n} agents, ${s} skills → ${WS}`);
