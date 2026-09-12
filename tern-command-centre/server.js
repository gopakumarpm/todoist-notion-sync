#!/usr/bin/env node
// Tern Command Centre — local server. Zero dependencies; Node 18+.
//   node server.js            → http://localhost:4777
//   PORT=5000 node server.js  → custom port
// Reads ./workspace on every request, so anything an agent writes to disk shows up on the next poll.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadState } = require('./lib/workspace');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4777;
const APP = path.join(ROOT, 'app', 'index.html');

function send(res, code, body, type = 'application/json') {
  res.writeHead(code, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
function readBody(req) { return new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch { r({}); } }); }); }
function sprintPath(id) { const safe = String(id).replace(/[^A-Za-z0-9_-]/g, ''); return path.join(ROOT, 'workspace', 'sprints', safe + '.json'); }
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40); }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && (p === '/' || p === '/index.html'))
      return send(res, 200, '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>\n' + fs.readFileSync(APP, 'utf8') + '\n</body></html>', 'text/html');
    if (req.method === 'GET' && p === '/api/state') return send(res, 200, Object.assign(loadState(ROOT), { mode: 'live' }));

    // Sprint writes — the only thing the UI edits; agents edit files directly.
    let m;
    if ((m = p.match(/^\/api\/sprints\/([^/]+)\/tasks\/([^/]+)$/)) && req.method === 'PATCH') {
      const file = sprintPath(m[1]); const sprint = JSON.parse(fs.readFileSync(file, 'utf8'));
      const t = (sprint.tasks || []).find(t => t.id === m[2]); if (!t) return send(res, 404, { error: 'task not found' });
      const patch = await readBody(req);
      for (const k of ['status', 'title', 'owner', 'priority', 'due', 'notes', 'company']) if (k in patch) t[k] = patch[k];
      t.updated = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(file, JSON.stringify(sprint, null, 2) + '\n'); return send(res, 200, t);
    }
    if ((m = p.match(/^\/api\/sprints\/([^/]+)\/tasks$/)) && req.method === 'POST') {
      const file = sprintPath(m[1]); const sprint = JSON.parse(fs.readFileSync(file, 'utf8'));
      const b = await readBody(req); if (!b.title) return send(res, 400, { error: 'title required' });
      const t = { id: slug(b.title) + '-' + Date.now().toString(36).slice(-4), title: b.title, owner: b.owner || 'max', company: b.company || 'Group',
        status: b.status || 'backlog', priority: b.priority || 'P2', due: b.due || '', notes: b.notes || '', created: new Date().toISOString().slice(0, 10) };
      sprint.tasks = sprint.tasks || []; sprint.tasks.push(t);
      fs.writeFileSync(file, JSON.stringify(sprint, null, 2) + '\n'); return send(res, 201, t);
    }
    send(res, 404, { error: 'not found' });
  } catch (e) { send(res, 500, { error: String(e.message || e) }); }
});

server.listen(PORT, () => {
  console.log(`Tern Command Centre  →  http://localhost:${PORT}`);
  console.log(`workspace: ${path.join(ROOT, 'workspace')}  (edit files there; the page re-reads every few seconds)`);
});
