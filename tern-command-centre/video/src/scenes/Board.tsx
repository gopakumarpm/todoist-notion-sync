import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT } from '../lib/theme';
import { S, agent, nameOf, colorOf } from '../lib/data';
import { Avatar } from '../components/Avatar';
import { fadeIn, fadeOut, pop, slide, countUp } from '../lib/anim';

const LEN = 360;
const CARD_START = 70, CARD_STAGGER = 12, FACE_START = 130;

export const Board: React.FC = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, LEN, 14);
  const max = agent('max');
  return (
    <AbsoluteFill style={{ padding: '120px 96px 80px', opacity: out }}>
      <div style={{ opacity: fadeIn(f, 0, 12), fontFamily: FONT.disp, fontSize: 14, fontWeight: 700, letterSpacing: '.3em', color: C.dim }}>GROUP BOARD</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 18 }}>
        <div style={{ opacity: fadeIn(f, 6), transform: `translateX(${-slide(f, 6, 30)}px)`, background: C.panel, border: `1px solid ${C.lineSoft}`, borderRadius: 12, padding: '14px 22px' }}>
          <div style={{ fontFamily: FONT.disp, fontWeight: 700, fontSize: 24 }}>{S.chairman}</div><div style={{ color: C.dim, fontSize: 16 }}>Founder, Owner &amp; Chairman</div>
        </div>
        <div style={{ opacity: fadeIn(f, 22), color: C.faint, fontFamily: FONT.mono, fontSize: 28 }}>→</div>
        <div style={{ opacity: fadeIn(f, 30), transform: `scale(${0.85 + 0.15 * pop(f, 30)})`, background: C.panel, border: `1.5px solid ${C.gold}`, boxShadow: `0 0 0 6px ${C.gold}22`, borderRadius: 12, padding: '14px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
          {max && <Avatar id="max" color={C.goldSoft} size={56} />}
          <div><div style={{ fontFamily: FONT.disp, fontWeight: 700, fontSize: 24 }}>Max</div><div style={{ color: C.dim, fontSize: 16 }}>Group Managing Director · tern:max</div></div>
        </div>
        <div style={{ opacity: fadeIn(f, 50), color: C.faint, fontFamily: FONT.mono, fontSize: 16, marginLeft: 8 }}>four CEOs and seven Corporate Centre heads report to Max</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, marginTop: 40 }}>
        {S.companies.map((c, i) => {
          const start = CARD_START + i * CARD_STAGGER;
          const ppl = S.agents.filter((a) => a.company === c.key);
          const head = agent(c.head);
          const p = pop(f, start);
          return (
            <div key={c.key} style={{ opacity: fadeIn(f, start, 10), transform: `translateY(${(1 - p) * 40}px)`, background: C.panel, border: `1px solid ${C.lineSoft}`, borderTop: `5px solid ${c.color}`, borderRadius: 12, padding: '18px 18px 16px', minHeight: 520, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {head && <Avatar id={head.id} color={c.color} size={48} />}
                <div><div style={{ fontFamily: FONT.disp, fontWeight: 700, fontSize: 19, lineHeight: 1.2 }}>{c.name}</div><div style={{ color: C.dim, fontSize: 14 }}>{nameOf(c.head)} · {c.title}</div></div>
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 600, color: c.color, lineHeight: 1 }}>
                {countUp(f, start + 6, 40, ppl.length)}<span style={{ fontSize: 12, color: C.faint, fontFamily: FONT.disp, letterSpacing: '.18em', marginLeft: 8 }}>PEOPLE</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'auto' }}>
                {ppl.filter((a) => a.id !== c.head).map((a, k) => {
                  const s = pop(f, FACE_START + i * 6 + k * 2.2);
                  return <div key={a.id} style={{ transform: `scale(${s})`, opacity: a.status === 'paper' ? 0.6 : 1 }}><Avatar id={a.id} color={colorOf(a)} size={ppl.length > 30 ? 30 : 40} /></div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: fadeIn(f, 250, 16), marginTop: 26, fontFamily: FONT.mono, fontSize: 16, color: C.faint }}>
        {S.counts.agents} people · {S.agents.filter((a) => a.status === 'paper').length} on paper (hired, agent files pending) · {S.counts.skills} skills · 8 practices
      </div>
    </AbsoluteFill>
  );
};
