import React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { useGameState } from '@/lib/stores/useGameState';

export const GameOverScreen: React.FC = () => {
  const { phase, score, gameOverReason, startTime, restart } = useGameState();
  
  if (phase !== 'ended') {
    return null;
  }
  
  // Calculate final score (time survived in seconds)
  const calculateScore = (): number => {
    if (!startTime) return 0;
    const endTime = Date.now();
    return Math.floor((endTime - startTime) / 1000);
  };
  
  const finalScore = calculateScore();
  
  // Get message based on score
  const getMessage = (): string => {
    if (finalScore < 30) {
      return "Keep practicing your integrity skills!";
    } else if (finalScore < 60) {
      return "Good job! Your moral compass is developing!";
    } else if (finalScore < 120) {
      return "Excellent! You've got strong values!";
    } else {
      return "Amazing! You're a true moral leader!";
    }
  };
  
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ 
        width: `${CANVAS_WIDTH}px`, 
        height: `${CANVAS_HEIGHT}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.85)'
      }}
    >
      <div className="w-full max-w-md p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Journey Complete</h1>
        
        <div className="backdrop-blur-md bg-indigo-900/30 p-8 rounded-xl shadow-lg border border-indigo-500/20 w-full mb-8">
          <p className="text-center mb-6 bg-indigo-700/30 py-3 px-4 rounded-lg">
            <span className="text-blue-300 block mb-1 font-medium">Challenge Encountered</span>
            <span className="text-2xl font-bold text-white">{gameOverReason}</span>
          </p>
          
          <div className="text-center">
            <h2 className="text-xl text-blue-300 font-semibold mb-2">Your Integrity Score</h2>
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 mx-auto flex items-center justify-center">
                <p className="text-5xl font-bold text-white">{finalScore}</p>
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                seconds
              </div>
            </div>
            <p className="text-lg text-blue-100 font-medium">{getMessage()}</p>
          </div>
        </div>
        
        <button
          onClick={restart}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
};
