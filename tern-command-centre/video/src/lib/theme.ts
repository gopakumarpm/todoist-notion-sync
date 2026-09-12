// Tern brand — Navy #0C1B2E · Electric Blue #2878CC · Gold #C9A43E
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const C = {
  ground: '#0A1523', panel: '#0F1F33', raise: '#16304C', line: '#1F3A57', lineSoft: '#172C45',
  blue: '#2878CC', blueSoft: '#5FA0E0', gold: '#C9A43E', goldSoft: '#E3C878',
  ink: '#E8EDF4', dim: '#8FA3BC', faint: '#5B7089',
  ok: '#5FA86A', run: '#4A8FD6', warn: '#D07A8E', wait: '#C9A43E', off: '#5B6C82',
};
export const FONT = {
  disp: "'Montserrat', 'Inter', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
};
export const STATUS: Record<string, string> = { done: C.ok, running: C.run, pending: C.wait, scheduled: C.wait, failed: C.warn, skipped: C.off, ok: C.ok, new: C.wait, 'needs-connectors': C.warn };
export const PRI: Record<string, string> = { P0: C.warn, P1: C.gold, P2: C.blueSoft, P3: C.off };
