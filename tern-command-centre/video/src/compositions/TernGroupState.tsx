import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../lib/theme';
import { S } from '../lib/data';
import { Intro } from '../scenes/Intro';
import { Board } from '../scenes/Board';
import { FlowScene } from '../scenes/FlowScene';
import { SprintScene } from '../scenes/SprintScene';
import { Attention } from '../scenes/Attention';
import { Outro } from '../scenes/Outro';

/* Storyboard (30 fps)
   Scene 1  Intro       0–90      wordmark, "Command Centre", snapshot date
   Scene 2  Board       90–450    chairman → Max chain, five company cards spring in, counts count up, avatars pop
   Scene 3  Flow        450–780   Weekly Group Review pipeline lights step by step, packet travels
   Scene 4  Sprint      780–1050  progress bar to N%, four columns, P0 tasks slide in
   Scene 5  Attention   1050–1290 needs-attention list + crons health
   Scene 6  Outro       1290–1380 "say refresh the command centre", link
*/
export const SCENES = { intro: [0, 90], board: [90, 450], flow: [450, 780], sprint: [780, 1050], attention: [1050, 1290], outro: [1290, 1380] } as const;
export const TOTAL_FRAMES = 1380;

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const t = Math.floor(frame / FPS);
  return (
    <>
      <div style={{ position: 'absolute', top: 36, left: 56, fontFamily: FONT.disp, fontWeight: 800, fontSize: 26, letterSpacing: '.14em', color: C.ink }}>
        TERN<span style={{ color: C.gold }}>OS</span>
        <div style={{ fontSize: 11, letterSpacing: '.32em', color: C.dim, fontWeight: 600, marginTop: -2 }}>COMMAND CENTRE</div>
      </div>
      <div style={{ position: 'absolute', top: 44, right: 56, fontFamily: FONT.mono, fontSize: 16, color: C.faint }}>
        snapshot <span style={{ color: C.blueSoft }}>{S.generated.slice(0, 10)}</span> · {String(Math.floor(t / 60)).padStart(2, '0')}:{String(t % 60).padStart(2, '0')}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: C.lineSoft }}>
        <div style={{ width: `${(frame / TOTAL_FRAMES) * 100}%`, height: '100%', background: C.gold }} />
      </div>
    </>
  );
};

export const TernGroupState: React.FC = () => (
  <AbsoluteFill style={{ background: C.ground, color: C.ink, fontFamily: FONT.body }}>
    <Sequence from={SCENES.intro[0]} durationInFrames={SCENES.intro[1] - SCENES.intro[0]}><Intro /></Sequence>
    <Sequence from={SCENES.board[0]} durationInFrames={SCENES.board[1] - SCENES.board[0]}><Board /></Sequence>
    <Sequence from={SCENES.flow[0]} durationInFrames={SCENES.flow[1] - SCENES.flow[0]}><FlowScene /></Sequence>
    <Sequence from={SCENES.sprint[0]} durationInFrames={SCENES.sprint[1] - SCENES.sprint[0]}><SprintScene /></Sequence>
    <Sequence from={SCENES.attention[0]} durationInFrames={SCENES.attention[1] - SCENES.attention[0]}><Attention /></Sequence>
    <Sequence from={SCENES.outro[0]} durationInFrames={SCENES.outro[1] - SCENES.outro[0]}><Outro /></Sequence>
    <Chrome />
  </AbsoluteFill>
);
