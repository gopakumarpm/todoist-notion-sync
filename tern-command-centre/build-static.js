#!/usr/bin/env node
// Exports a single self-contained HTML snapshot of the workspace (read-only) to dist/index.html.
// That file is what gets published as the Claude artifact "Tern OS Command Centre".
'use strict';
const fs = require('fs');
const path = require('path');
const { loadState } = require('./lib/workspace');

const ROOT = __dirname;
const state = Object.assign(loadState(ROOT), { mode: 'static' });
const html = fs.readFileSync(path.join(ROOT, 'app', 'index.html'), 'utf8');
const inject = `<script>window.__STATE__=${JSON.stringify(state).replace(/<\/script/gi, '<\\/script')};</script>`;
const fragment = html.replace('<!--STATE-->', inject);
const HEAD = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>\n';
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist', 'index.html'), HEAD + fragment + '\n</body></html>\n');   // open locally
fs.writeFileSync(path.join(ROOT, 'dist', 'artifact.html'), fragment);                              // publish as Claude artifact (it adds the shell)
fs.writeFileSync(path.join(ROOT, 'dist', 'state.json'), JSON.stringify(state, null, 1));           // read by video/ (Remotion)
console.log(`dist/index.html + dist/artifact.html  ${(fragment.length / 1024).toFixed(0)} KB · ${state.counts.agents} agents · ${state.counts.skills} skills · ${state.counts.flows} flows · ${state.counts.docs} docs`);
