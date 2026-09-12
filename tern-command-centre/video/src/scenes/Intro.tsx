import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT } from '../lib/theme';
import { S } from '../lib/data';
import { fadeIn, fadeOut, pop, slide } from '../lib/anim';

const LEN = 90;
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, LEN, 14);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: out }}>
      <div style={{ transform: `scale(${0.9 + 0.1 * pop(f, 0)})`, opacity: fadeIn(f, 0, 12), fontFamily: FONT.disp, fontWeight: 800, fontSize: 96, letterSpacing: '.16em', color: C.ink }}>
        TERN<span style={{ color: C.gold }}>OS</span>
      </div>
      <div style={{ opacity: fadeIn(f, 14, 14), transform: `translateY(${slide(f, 14, 24)}px)`, fontFamily: FONT.disp, fontWeight: 600, fontSize: 22, letterSpacing: '.42em', color: C.dim, marginTop: 8 }}>
        COMMAND CENTRE
      </div>
      <div style={{ opacity: fadeIn(f, 34, 14), transform: `translateY(${slide(f, 34, 18)}px)`, fontFamily: FONT.mono, fontSize: 20, color: C.faint, marginTop: 40 }}>
        {S.brand.name} · {S.counts.agents} agents · {S.counts.flows} flows · snapshot {S.generated.slice(0, 10)}
      </div>
      <div style={{ opacity: fadeIn(f, 48, 14), fontFamily: FONT.body, fontSize: 18, color: C.gold, marginTop: 14, letterSpacing: '.08em' }}>
        {S.brand.essence}
      </div>
    </AbsoluteFill>
  );
};
