import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, STATUS } from '../lib/theme';
import { S, agent, nameOf, colorOf } from '../lib/data';
import { Avatar } from '../components/Avatar';
import { fadeIn, fadeOut, pop } from '../lib/anim';

const LEN = 240;

export const Attention: React.FC = () => {
  const f = useCurrentFrame();
  const sp = S.sprints[0];
  const paper = S.agents.filter((a) => a.status === 'paper').length;
  const items: { text: string; sub: string; color: string }[] = [
    ...S.crons.filter((c) => !c.enabled || !['ok', 'new'].includes(c.status)).map((c) => ({ text: c.name, sub: `${c.status} · ${nameOf(c.agent)}`, color: C.warn })),
    ...sp.tasks.filter((t) => t.priority === 'P0' && t.status !== 'done').map((t) => ({ text: t.title, sub: `${nameOf(t.owner)} · due ${t.due || '—'}`, color: C.warn })),
    ...(paper ? [{ text: `${paper} agents on paper`, sub: 'hired, not yet runnable in tern-plugin', color: C.wait }] : []),
  ];
  return (
    <AbsoluteFill style={{ padding: '120px 96px 80px', opacity: fadeOut(f, LEN, 14) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48 }}>
        <div>
          <div style={{ opacity: fadeIn(f, 0, 12), fontFamily: FONT.disp, fontSize: 14, fontWeight: 700, letterSpacing: '.3em', color: C.dim }}>NEEDS ATTENTION</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
            {items.map((it, i) => {
              const start = 10 + i * 14; const p = pop(f, start);
              return (
                <div key={i} style={{ opacity: fadeIn(f, start, 10), transform: `translateX(${(1 - p) * -30}px)`, display: 'flex', gap: 16, alignItems: 'flex-start', background: C.panel, border: `1px solid ${C.lineSoft}`, borderRadius: 10, padding: '14px 18px' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 6, background: it.color, marginTop: 7, flex: 'none' }} />
                  <div><div style={{ fontWeight: 600, fontSize: 19, lineHeight: 1.3 }}>{it.text}</div><div style={{ color: C.dim, fontSize: 15, marginTop: 4 }}>{it.sub}</div></div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ opacity: fadeIn(f, 30, 12), fontFamily: FONT.disp, fontSize: 14, fontWeight: 700, letterSpacing: '.3em', color: C.dim }}>CRONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {S.crons.map((c, i) => {
              const start = 40 + i * 10; const a = agent(c.agent); const col = c.enabled ? (STATUS[c.status] ?? C.dim) : C.off;
              return (
                <div key={c.id} style={{ opacity: fadeIn(f, start, 10), display: 'grid', gridTemplateColumns: '30px 1fr auto', gap: 12, alignItems: 'center', padding: '8px 12px', background: C.panel, border: `1px solid ${C.lineSoft}`, borderRadius: 8 }}>
                  {a ? <Avatar id={a.id} color={colorOf(a)} size={26} /> : <span />}
                  <div><div style={{ fontWeight: 600, fontSize: 16 }}>{c.name}</div><div style={{ color: C.dim, fontSize: 13 }}>{c.human} · next {c.next_run || '—'}</div></div>
                  <span style={{ fontFamily: FONT.disp, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: col, border: `1px solid ${col}`, borderRadius: 999, padding: '3px 10px' }}>{c.enabled ? c.status : 'disabled'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
