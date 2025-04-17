import { useEffect, useState } from 'react';

type Direction = "left" | "right" | "jump" | null;

/**
 * A hook to handle keyboard input for game controls
 * Supports both arrow keys and WASD
 */
export function useKeyboard() {
  const [direction, setDirection] = useState<Direction>(null);
  
  useEffect(() => {
    const keysPressed = new Set<string>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.code);
      updateDirection(keysPressed);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
      updateDirection(keysPressed);
    };
    
    const updateDirection = (keys: Set<string>) => {
      // Check for left movement (Left Arrow or A)
      const isLeftPressed = keys.has('ArrowLeft') || keys.has('KeyA');
      
      // Check for right movement (Right Arrow or D)
      const isRightPressed = keys.has('ArrowRight') || keys.has('KeyD');
      
      // Check for jump (Up Arrow, W, or Space)
      const isJumpPressed = keys.has('ArrowUp') || keys.has('KeyW') || keys.has('Space');
      
      // Determine overall direction
      if (isJumpPressed) {
        setDirection('jump');
      } else if (isLeftPressed && !isRightPressed) {
        setDirection('left');
      } else if (isRightPressed && !isLeftPressed) {
        setDirection('right');
      } else {
        setDirection(null);
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return direction;
}
