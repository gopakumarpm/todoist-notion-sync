import React from 'react';
// Same deterministic 8x8 pixel face as app/index.html (FNV-1a hash of the agent id), so faces match the dashboard.
function hash(s: string) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }
export function cells(id: string): [number, number][] {
  let h = hash(id || '?'); const bits: number[] = []; for (let i = 0; i < 32; i++) { bits.push(h & 1); h >>>= 1; }
  const out: [number, number][] = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) {
    let on = bits[(y * 4 + x) % 32]; if (y === 2 && (x === 1 || x === 2)) on = 1; if (y === 3 && x === 1) on = 0; if (y === 0 || y === 7) on = on && (x > 0 ? 1 : 0);
    if (on) { out.push([x, y]); out.push([7 - x, y]); }
  }
  return out;
}
export const Avatar: React.FC<{ id: string; color: string; size: number; style?: React.CSSProperties }> = ({ id, color, size, style }) => (
  <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', borderRadius: size / 8, background: '#0A1523', ...style }}>
    {cells(id).map(([x, y], i) => <rect key={i} x={x} y={y} width={1} height={1} fill={color} />)}
    <rect x={2} y={3} width={1} height={1} fill="#0A1523" /><rect x={5} y={3} width={1} height={1} fill="#0A1523" />
  </svg>
);
