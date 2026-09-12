import React from 'react';
import { Composition } from 'remotion';
import { TernGroupState, TOTAL_FRAMES } from './compositions/TernGroupState';
import { FPS, WIDTH, HEIGHT } from './lib/theme';

export const Root: React.FC = () => (
  <>
    <Composition
      id="TernGroupState"
      component={TernGroupState}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
