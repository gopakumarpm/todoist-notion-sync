import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT, STATUS } from '../lib/theme';
import { S, agent, nameOf, colorOf } from '../lib/data';
import { Avatar } from '../components/Avatar';
import { fadeIn, fadeOut, pop } from '../lib/anim';

const LEN = 330;
const FLOW_ID = 'weekly-group-review';
const STEP_START = 40, STEP_EVERY = 22; // each step lights 22 frames after the previous

export const FlowScene: React.FC = () => {
  const f = useCurrentFrame();
  const flow = S.flows.find((x) => x.id === FLOW_ID) ?? S.flows[0];
  const run = flow.runs.find((r) => r.steps.length) ?? flow.runs[0];
  const n = flow.steps.length;
  const cols = Math.min(5, n), rows = Math.ceil(n / cols);
  const lit = (i: number) => f >= STEP_START + i * STEP_EVERY;
  // packet position: continuous progress along the step sequence
  const prog = interpolate(f, [STEP_START, STEP_START + (n - 1) * STEP_EVERY], [0, n - 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ padding: '120px 96px 80px', opacity: fadeOut(f, LEN, 14) }}>
      <div style={{ opacity: fadeIn(f, 0, 12), fontFamily: FONT.disp, fontSize: 14, fontWeight: 700, letterSpacing: '.3em', color: C.dim }}>FLOW · {flow.name.toUpperCase()}</div>
      <div style={{ opacity: fadeIn(f, 8, 12), color: C.dim, fontSize: 18, marginTop: 8, maxWidth: 1100 }}>{flow.description}</div>
      <div style={{ opacity: fadeIn(f, 16, 12), fontFamily: FONT.mono, fontSize: 15, color: C.faint, marginTop: 6 }}>run {run?.name ?? run?.id} · {run?.status}</div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 18, marginTop: 36 }}>
        {flow.steps.map((s, i) => {
          const st = run?.steps.find((x) => x.id === s.id)?.status ?? 'pending';
          const on = lit(i); const p = pop(f, STEP_START + i * STEP_EVERY);
          const a = agent(s.agent);
          const col = on ? (STATUS[st] ?? C.line) : C.lineSoft;
          return (
            <div key={s.id} style={{ background: C.panel, border: `1px solid ${on ? C.line : C.lineSoft}`, borderTop: `5px solid ${col}`, borderRadius: 12, padding: '14px 16px', minHeight: 150, opacity: 0.35 + 0.65 * (on ? 1 : 0), transform: `scale(${on ? 0.96 + 0.04 * p : 0.96})`, boxShadow: on && p < 0.95 ? `0 0 0 ${8 * (1 - p)}px ${col}33` : 'none' }}>
              <div style={{ fontFamily: FONT.disp, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{i + 1}. {s.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, color: C.dim, fontSize: 15 }}>{a && <Avatar id={a.id} color={colorOf(a)} size={24} />}{nameOf(s.agent)}</div>
              <div style={{ color: C.dim, fontSize: 13.5, marginTop: 8, lineHeight: 1.35 }}>{s.detail}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 12, marginTop: 8, color: on ? col : C.faint }}>{on ? st : 'waiting'}</div>
            </div>
          );
        })}
        {/* packet: a glowing dot that sits on the card currently lighting */}
        {(() => {
          const i = Math.min(n - 1, Math.floor(prog)); const t = prog - i;
          const cw = (1920 - 192 - (cols - 1) * 18) / cols;
          const x = (i % cols) * (cw + 18) + cw / 2 + (t < 1 ? 0 : 0);
          const y = Math.floor(i / cols) * (150 + 18 + 40) - 9; // sits on the card's top border
          const glow = STATUS[run?.steps.find((s) => s.id === flow.steps[i].id)?.status ?? 'pending'] ?? C.gold;
          return <div style={{ position: 'absolute', left: x - 9, top: y, width: 18, height: 18, borderRadius: 9, background: glow, boxShadow: `0 0 24px 6px ${glow}88`, opacity: fadeIn(f, STEP_START, 10) }} />;
        })()}
      </div>
      <div style={{ opacity: fadeIn(f, STEP_START + n * STEP_EVERY, 16), marginTop: 30, fontFamily: FONT.mono, fontSize: 16, color: C.faint }}>
        {S.flows.length} flows in the workspace · {S.flows.reduce((k, x) => k + x.runs.length, 0)} runs recorded · every run is appended, never rewritten
      </div>
    </AbsoluteFill>
  );
};
