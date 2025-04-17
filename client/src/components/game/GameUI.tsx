import React, { useEffect, useState } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export const GameUI: React.FC = () => {
  const { phase, score, startTime, player } = useGameState();
  const { isMuted, toggleMute } = useAudio();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Update the timer every second if game is active
  useEffect(() => {
    if (phase !== 'playing' || !startTime) return;
    
    const intervalId = setInterval(() => {
      const now = Date.now();
      setElapsedTime(now - startTime);
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [phase, startTime]);
  
  // Format time as MM:SS
  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (phase !== 'playing') {
    return null;
  }
  
  return (
    <div className="absolute top-0 left-0 w-full px-4 py-3 flex justify-between items-center text-white">
      <div className="backdrop-blur-sm bg-blue-500/30 px-4 py-2 rounded-xl shadow-lg">
        <span className="font-bold">Time:</span> {formatTime(elapsedTime)}
      </div>
      
      {player.isProtected && (
        <div className="backdrop-blur-sm bg-indigo-500/30 px-4 py-2 rounded-xl shadow-lg flex items-center space-x-1 animate-pulse">
          <span className="font-bold">Protected:</span> 
          <span>{Math.ceil(player.protectionTimeLeft / 1000)}s</span>
        </div>
      )}
      
      <button
        onClick={toggleMute}
        className="backdrop-blur-sm bg-gray-500/30 hover:bg-gray-500/50 transition-colors px-4 py-2 rounded-xl shadow-lg flex items-center"
      >
        {isMuted ? (
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            Muted
          </span>
        ) : (
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            Sound On
          </span>
        )}
      </button>
    </div>
  );
};
