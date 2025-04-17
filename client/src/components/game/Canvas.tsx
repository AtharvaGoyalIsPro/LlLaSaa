import React, { useRef, useEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { useGameState } from '@/lib/stores/useGameState';
import { useKeyboard } from '@/lib/hooks/useKeyboard';
import { useGameLoop } from '@/lib/hooks/useGameLoop';
import { Player } from './Player';
import { FallingElement } from './FallingElement';
import { ScrollingBackground } from './ScrollingBackground';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const direction = useKeyboard();
  
  // Get game state and functions
  const {
    phase,
    player,
    positiveElements, 
    negativeElements,
    spawnElement,
    updateElements,
    checkCollisions,
    movePlayer,
    updatePlayerPosition,
    updateProtection,
    updateSpawnRate,
    startTime
  } = useGameState();
  
  // Apply keyboard input to move the player
  useEffect(() => {
    if (phase === 'playing') {
      movePlayer(direction);
    }
  }, [direction, movePlayer, phase]);
  
  // Main game loop
  const updateGame = (deltaTime: number) => {
    // Update player position
    updatePlayerPosition(deltaTime);
    
    // Update protection status
    updateProtection(deltaTime);
    
    // Update falling elements
    updateElements(deltaTime);
    
    // Check for collisions
    checkCollisions();
    
    // Spawn new elements
    const now = Date.now();
    spawnElement(now);
    
    // Update difficulty based on elapsed time
    if (startTime) {
      const elapsedTime = now - startTime;
      updateSpawnRate(elapsedTime);
    }
    
    // Render the game if the canvas is available
    const canvas = canvasRef.current;
    if (canvas) {
      renderGame(canvas);
    }
  };
  
  // Start the game loop when in playing phase
  useGameLoop(updateGame, phase === 'playing');
  
  // Render the game
  const renderGame = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render background
    renderBackground(ctx);
    
    // Render player
    Player({ ctx, player });
    
    // Render elements
    [...positiveElements, ...negativeElements].forEach(element => {
      FallingElement({ ctx, element });
    });
  };
  
  // Render scrolling background
  const renderBackground = (ctx: CanvasRenderingContext2D) => {
    ScrollingBackground({ ctx });
  };
  
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="mx-auto border border-gray-700 bg-gray-900 shadow-lg"
    />
  );
};
