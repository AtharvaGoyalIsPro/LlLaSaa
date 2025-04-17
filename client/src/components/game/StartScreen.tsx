import React, { useEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export const StartScreen: React.FC = () => {
  const { start, phase } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  
  // Preload audio files
  useEffect(() => {
    // Create audio elements
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    // Set up in store
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    
    // Start background music (will be muted by default)
    backgroundMusic.play().catch(error => {
      console.log("Background music play prevented:", error);
    });
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);
  
  if (phase !== 'ready') {
    return null;
  }
  
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ 
        width: `${CANVAS_WIDTH}px`, 
        height: `${CANVAS_HEIGHT}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Rise with Integrity</span>
      </h1>
      
      <div className="backdrop-blur-md bg-indigo-900/30 text-white p-6 rounded-xl max-w-md mb-8 shadow-lg border border-indigo-500/20">
        <h2 className="text-xl font-bold mb-3">How to Play:</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Move with Arrow Keys or A/D
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
            Jump with Up Arrow, W, or Space
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Avoid negative influences
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Collect positive values
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Gain protection from negative influences
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Game gets more challenging over time
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Survive as long as possible!
          </li>
        </ul>
      </div>
      
      <button
        onClick={start}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 shadow-lg transform hover:scale-105"
      >
        Begin Journey
      </button>
    </div>
  );
};
