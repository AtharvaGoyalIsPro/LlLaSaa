import { useEffect, useRef } from 'react';

/**
 * A custom hook for managing the game loop using requestAnimationFrame
 * @param callback The function to call on each frame
 * @param isActive Whether the game loop should be running
 */
export function useGameLoop(callback: (deltaTime: number) => void, isActive: boolean) {
  // Keep track of the last frame timestamp
  const lastFrameTimeRef = useRef<number | null>(null);
  // Store the callback in a ref to avoid triggering effects when it changes
  const callbackRef = useRef(callback);
  // Store animation frame ID for cleanup
  const requestRef = useRef<number | null>(null);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Set up and clean up the animation frame
  useEffect(() => {
    // Skip if game is not active
    if (!isActive) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      lastFrameTimeRef.current = null;
      return;
    }
    
    // Define the animation loop
    const animate = (timestamp: number) => {
      // Calculate delta time (time since last frame)
      if (lastFrameTimeRef.current === null) {
        // First frame - initialize timestamp without running update
        lastFrameTimeRef.current = timestamp;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = (timestamp - lastFrameTimeRef.current) / 16.667; // Normalize to ~60fps
      lastFrameTimeRef.current = timestamp;
      
      // Call the game update function
      callbackRef.current(deltaTime);
      
      // Schedule the next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up function to cancel animation frame when component unmounts or isActive changes
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isActive]);
}
