import React from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, BACKGROUND_SPEED } from "@/lib/constants";

// Track background position
let backgroundY = 0;

// Track stars for twinkling effect
const stars = Array.from({ length: 50 }, () => ({
  x: Math.random() * CANVAS_WIDTH,
  y: Math.random() * CANVAS_HEIGHT,
  size: 0.5 + Math.random() * 1.5,
  opacity: 0.3 + Math.random() * 0.7,
  twinkleSpeed: 0.01 + Math.random() * 0.03,
}));

interface ScrollingBackgroundProps {
  ctx: CanvasRenderingContext2D;
}

export const ScrollingBackground: React.FC<ScrollingBackgroundProps> = ({
  ctx,
}) => {
  // Create smooth gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#1a1a2e");
  gradient.addColorStop(1, "#16213e");

  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Update background position
  backgroundY = (backgroundY + BACKGROUND_SPEED) % 100;

  // Draw subtle grid lines
  ctx.strokeStyle = "rgba(80, 100, 140, 0.15)";
  ctx.lineWidth = 1;

  // Draw horizontal lines with scrolling effect - more spaced out
  const gridSize = 80;
  for (let y = backgroundY - gridSize; y < CANVAS_HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }

  // Add twinkling stars in the background
  stars.forEach((star) => {
    // Update star twinkle
    star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
    star.opacity = Math.max(0.3, Math.min(0.9, star.opacity));

    // Calculate scrolling position
    const y = (star.y + backgroundY * 0.2) % CANVAS_HEIGHT;

    // Draw star with glow
    ctx.globalAlpha = star.opacity;
    ctx.fillStyle = "#FFFFFF";

    // Star glow
    ctx.shadowColor = "#8AB4F8";
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.arc(star.x, y, star.size, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow and opacity
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  });

  return null; // This is a rendering function, not a React component
};
