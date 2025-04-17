import React, { useEffect } from 'react';
import { Canvas } from '@/components/game/Canvas';
import { StartScreen } from '@/components/game/StartScreen';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { GameUI } from '@/components/game/GameUI';
import { useGameState } from '@/lib/stores/useGameState';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import "@fontsource/inter";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="relative mx-auto" style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}>
        <Canvas />
        <StartScreen />
        <GameUI />
        <GameOverScreen />
      </div>
      
      <div className="mt-4 text-gray-300 text-sm text-center max-w-md">
        <p>Use arrow keys or WASD to move. Jump with Space or W or Up Arrow.</p>
        <p>Avoid negative influences and collect positive values!</p>
      </div>
    </div>
  );
}

export default App;
