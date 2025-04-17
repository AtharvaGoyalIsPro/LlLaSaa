import React from 'react';
import { PlayerState } from '@/lib/types';

interface PlayerProps {
  ctx: CanvasRenderingContext2D;
  player: PlayerState;
}

export const Player: React.FC<PlayerProps> = ({ ctx, player }) => {
  const { position, dimensions, isProtected } = player;
  
  // Save context for transformations
  ctx.save();
  
  // Add shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  // Draw player body with rounded corners
  const bodyColor = '#4A90E2'; // Match our color scheme
  const cornerRadius = 8;
  
  ctx.fillStyle = bodyColor;
  
  // Draw rounded rectangle for body
  ctx.beginPath();
  ctx.moveTo(position.x + cornerRadius, position.y);
  ctx.lineTo(position.x + dimensions.width - cornerRadius, position.y);
  ctx.quadraticCurveTo(position.x + dimensions.width, position.y, position.x + dimensions.width, position.y + cornerRadius);
  ctx.lineTo(position.x + dimensions.width, position.y + dimensions.height - cornerRadius);
  ctx.quadraticCurveTo(position.x + dimensions.width, position.y + dimensions.height, position.x + dimensions.width - cornerRadius, position.y + dimensions.height);
  ctx.lineTo(position.x + cornerRadius, position.y + dimensions.height);
  ctx.quadraticCurveTo(position.x, position.y + dimensions.height, position.x, position.y + dimensions.height - cornerRadius);
  ctx.lineTo(position.x, position.y + cornerRadius);
  ctx.quadraticCurveTo(position.x, position.y, position.x + cornerRadius, position.y);
  ctx.closePath();
  ctx.fill();
  
  // Add gradient to the body
  const gradient = ctx.createLinearGradient(
    position.x, position.y, 
    position.x, position.y + dimensions.height
  );
  gradient.addColorStop(0, '#4A90E2');
  gradient.addColorStop(1, '#3A7BC8');
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Reset shadow for face details
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Draw helmet/head area
  ctx.fillStyle = '#2C5282';
  ctx.beginPath();
  ctx.roundRect(
    position.x + dimensions.width * 0.15,
    position.y,
    dimensions.width * 0.7,
    dimensions.height * 0.35,
    8
  );
  ctx.fill();
  
  // Draw visor area (face)
  ctx.fillStyle = '#7BB8FF';
  ctx.beginPath();
  ctx.roundRect(
    position.x + dimensions.width * 0.22,
    position.y + dimensions.height * 0.1,
    dimensions.width * 0.56,
    dimensions.height * 0.2,
    5
  );
  ctx.fill();
  
  // Add visor shine
  const visorGradient = ctx.createLinearGradient(
    position.x + dimensions.width * 0.22, 
    position.y + dimensions.height * 0.1,
    position.x + dimensions.width * 0.22, 
    position.y + dimensions.height * 0.3
  );
  visorGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  visorGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.fillStyle = visorGradient;
  ctx.beginPath();
  ctx.roundRect(
    position.x + dimensions.width * 0.22,
    position.y + dimensions.height * 0.1,
    dimensions.width * 0.56,
    dimensions.height * 0.08,
    5
  );
  ctx.fill();
  
  // Draw highlights on the body
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.roundRect(
    position.x + dimensions.width * 0.3,
    position.y + dimensions.height * 0.45,
    dimensions.width * 0.4,
    dimensions.height * 0.1,
    3
  );
  ctx.fill();
  
  // Draw protection shield if player is protected
  if (isProtected) {
    ctx.strokeStyle = '#7BB8FF';
    ctx.lineWidth = 3;
    
    // Glow effect for shield
    ctx.shadowColor = '#7BB8FF';
    ctx.shadowBlur = 15;
    
    // Draw shield with animation effect
    const time = Date.now() / 1000;
    const pulseSize = Math.sin(time * 3) * 5; // Pulsing effect
    
    ctx.beginPath();
    ctx.arc(
      position.x + dimensions.width / 2,
      position.y + dimensions.height / 2,
      dimensions.width / 1.2 + pulseSize,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    
    // Add inner shield
    ctx.beginPath();
    ctx.arc(
      position.x + dimensions.width / 2,
      position.y + dimensions.height / 2,
      dimensions.width / 1.5,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    
    // Reset effects
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
  }
  
  // Restore original context
  ctx.restore();
  
  return null; // This is a rendering function, not a React component
};
