import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT, PRI } from '../lib/theme';
import { S, agent, nameOf, colorOf } from '../lib/data';
import { Avatar } from '../components/Avatar';
import { fadeIn, fadeOut, pop, countUp } from '../lib/anim';

const LEN = 270;
const COLS = ['backlog', 'todo', 'doing', 'done'];
const COLC: Record<string, string> = { backlog: C.off, todo: C.wait, doing: C.run, done: C.ok };

export const SprintScene: React.FC = () => {
  const f = useCurrentFrame();
  const sp = S.sprints[0];
  const done = sp.tasks.filter((t) => t.status === 'done').length;
  const pct = sp.tasks.length ? Math.round((done / sp.tasks.length) * 100) : 0;
  const bar = interpolate(f, [20, 80], [0, pct], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill style={{ padding: '120px 96px 80px', opacity: fadeOut(f, LEN, 14) }}>
      <div style={{ opacity: fadeIn(f, 0, 12), fontFamily: FONT.disp, fontSize: 14, fontWeight: 700, letterSpacing: '.3em', color: C.dim }}>SPRINT · {sp.id} · {sp.start} → {sp.end}</div>
      <div style={{ opacity: fadeIn(f, 6, 12), fontFamily: FONT.disp, fontWeight: 700, fontSize: 30, marginTop: 8 }}>{sp.name}</div>
      <div style={{ opacity: fadeIn(f, 12, 12), color: C.dim, fontSize: 18, marginTop: 4, maxWidth: 1100 }}>{sp.goal}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 24, opacity: fadeIn(f, 18, 10) }}>
        <div style={{ width: 560, height: 12, background: C.lineSoft, borderRadius: 6, overflow: 'hidden' }}><div style={{ width: `${bar}%`, height: '100%', background: C.ok }} /></div>
        <div style={{ fontFamily: FONT.mono, fontSize: 20, color: C.goldSoft }}>{countUp(f, 20, 60, done)} of {sp.tasks.length} done · {Math.round(bar)}%</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 30 }}>
        {COLS.map((c, ci) => {
          const tasks = sp.tasks.filter((t) => t.status === c);
          return (
            <div key={c} style={{ opacity: fadeIn(f, 40 + ci * 10, 12) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT.disp, fontSize: 13, fontWeight: 700, letterSpacing: '.22em', color: C.dim, marginBottom: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: COLC[c] }} />{c.toUpperCase()}<span style={{ marginLeft: 'auto', fontFamily: FONT.mono, color: C.faint, fontWeight: 500 }}>{tasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.slice(0, 5).map((t, k) => {
                  const start = 60 + ci * 10 + k * 8; const p = pop(f, start); const a = agent(t.owner);
                  return (
                    <div key={t.id} style={{ opacity: fadeIn(f, start, 8), transform: `translateX(${(1 - p) * 30}px)`, background: C.panel, border: `1px solid ${C.lineSoft}`, borderLeft: `5px solid ${PRI[t.priority] ?? C.off}`, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{t.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.dim, fontSize: 13, marginTop: 8 }}>
                        {a ? <Avatar id={a.id} color={colorOf(a)} size={18} /> : null}{nameOf(t.owner)} · <span style={{ fontFamily: FONT.mono }}>{t.priority}</span>{t.due ? ` · due ${t.due}` : ''}
                      </div>
                    </div>
                  );
                })}
                {tasks.length > 5 && <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.faint }}>+{tasks.length - 5} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
