// Reads the file-based workspace into one state object.
// Zero dependencies. Shared by server.js (live) and build-static.js (export).
'use strict';
const fs = require('fs');
const path = require('path');

function parseValue(v) {
  v = v.trim();
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    return inner ? inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')) : [];
  }
  return v.replace(/^["']|["']$/g, '');
}

// Minimal YAML subset: `key: value`, `key: [a, b]`, and `key:` followed by `- item` lines.
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  let lastKey = null;
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && lastKey) { if (!Array.isArray(meta[lastKey])) meta[lastKey] = []; meta[lastKey].push(parseValue(li[1])); continue; }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) { lastKey = kv[1]; meta[kv[1]] = parseValue(kv[2]); }
  }
  return { meta, body: text.slice(m[0].length) };
}

function readDir(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(ext) && !f.startsWith('_')).sort()
    .map(f => ({ file: f, id: f.replace(ext, ''), text: fs.readFileSync(path.join(dir, f), 'utf8'), mtime: fs.statSync(path.join(dir, f)).mtime.toISOString().slice(0, 10) }));
}
function readJson(p, fallback) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; } }
function titleOf(body, id) { const h = body.match(/^#\s+(.+)$/m); return h ? h[1].trim() : id; }

function loadState(root) {
  const ws = path.join(root, 'workspace');
  const company = readJson(path.join(ws, 'company.json'), { companies: [] });

  const agents = readDir(path.join(ws, 'agents'), '.md').map(({ id, text, mtime }) => {
    const { meta, body } = parseFrontmatter(text);
    return { id, name: meta.name || id, role: meta.role || '', company: meta.company || '', arm: meta.arm || '',
      reports_to: meta.reports_to || '', lead: !!meta.lead, status: meta.status || 'active', skills: meta.skills || [],
      model: meta.model || '', hired: meta.hired || '', updated: mtime, body: body.trim() };
  });
  const byId = Object.fromEntries(agents.map(a => [a.id, a]));
  agents.forEach(a => { a.reports = agents.filter(b => b.reports_to === a.id).map(b => b.id); });

  const skills = readDir(path.join(ws, 'skills'), '.md').map(({ id, text, mtime }) => {
    const { meta, body } = parseFrontmatter(text);
    return { id, name: meta.name || id, summary: meta.summary || body.trim().split('\n')[0], tags: meta.tags || [], updated: mtime,
      body: body.trim(), used_by: agents.filter(a => a.skills.includes(id)).map(a => a.id) };
  });

  const flows = readDir(path.join(ws, 'flows'), '.json').map(({ id, text }) => Object.assign({ id, steps: [], runs: [] }, JSON.parse(text)));
  const crons = readJson(path.join(ws, 'crons.json'), []);
  const generations = readDir(path.join(ws, 'generations'), '.md').map(({ id, text, mtime }) => {
    const { meta, body } = parseFrontmatter(text);
    return { id, title: meta.title || titleOf(body, id), type: meta.type || 'doc', agent: meta.agent || '', flow: meta.flow || '',
      date: meta.date || mtime, path: meta.path || '', url: meta.url || '', summary: meta.summary || '', body: body.trim() };
  }).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const docs = readDir(path.join(ws, 'docs'), '.md').map(({ id, text, mtime }) => {
    const { meta, body } = parseFrontmatter(text);
    return { id, title: meta.title || titleOf(body, id), updated: meta.updated || mtime, tags: meta.tags || [], body: body.trim() };
  });
  const sprints = readDir(path.join(ws, 'sprints'), '.json').map(({ id, text }) => Object.assign({ id, tasks: [] }, JSON.parse(text)))
    .sort((a, b) => String(b.start || '').localeCompare(String(a.start || '')));
  const links = readJson(path.join(ws, 'links.json'), []);

  return {
    generated: new Date().toISOString(), chairman: company.chairman || '', brand: company.brand || {}, companies: company.companies || [],
    agents, skills, flows, crons, generations, docs, sprints, links,
    counts: { agents: agents.length, skills: skills.length, flows: flows.length, crons: crons.length, generations: generations.length, docs: docs.length, sprints: sprints.length, links: links.length },
    _agentIndex: Object.keys(byId).length
  };
}

module.exports = { loadState, parseFrontmatter };
