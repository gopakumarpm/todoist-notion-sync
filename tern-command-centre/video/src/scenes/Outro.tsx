import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT } from '../lib/theme';
import { S } from '../lib/data';
import { fadeIn, fadeOut, slide } from '../lib/anim';

const LEN = 90;

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fadeOut(f, LEN, 16) }}>
      <div style={{ opacity: fadeIn(f, 0, 14), transform: `translateY(${slide(f, 0, 20)}px)`, fontFamily: FONT.disp, fontWeight: 700, fontSize: 40, textAlign: 'center', maxWidth: 1100, lineHeight: 1.25 }}>
        One folder the agents read and write.<br /><span style={{ color: C.gold }}>One page that shows it.</span>
      </div>
      <div style={{ opacity: fadeIn(f, 22, 14), fontFamily: FONT.mono, fontSize: 20, color: C.dim, marginTop: 36 }}>say “refresh the command centre” · {S.brand.name} · {S.generated.slice(0, 10)}</div>
      <div style={{ opacity: fadeIn(f, 36, 14), fontFamily: FONT.mono, fontSize: 16, color: C.faint, marginTop: 14 }}>claude.ai/code/artifact/932a6090-6c9f-4d1c-81fe-f4e0bfa8252c</div>
    </AbsoluteFill>
  );
};
