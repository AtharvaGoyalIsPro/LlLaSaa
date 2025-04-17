
import React from "react";
import { FallingElement as FallingElementType } from "@/lib/types";

interface FallingElementProps {
  ctx: CanvasRenderingContext2D;
  element: FallingElementType;
}

export const FallingElement: React.FC<FallingElementProps> = ({
  ctx,
  element,
}) => {
  const { position, dimensions, text, velocity, color } = element;
  const isPositive = "bonus" in element;

  // Calculate rotation based on horizontal movement
  const rotation = velocity.x !== 0 ? velocity.x * 0.05 : 0;

  ctx.save();

  // Move to element's center for rotation
  ctx.translate(
    position.x + dimensions.width / 2,
    position.y + dimensions.height / 2,
  );
  ctx.rotate(rotation);
  ctx.translate(
    -(position.x + dimensions.width / 2),
    -(position.y + dimensions.height / 2),
  );

  // Enhanced shadow for better depth
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  // Draw element background with rounded corners
  const cornerRadius = 12;
  ctx.beginPath();
  ctx.moveTo(position.x + cornerRadius, position.y);
  ctx.lineTo(position.x + dimensions.width - cornerRadius, position.y);
  ctx.quadraticCurveTo(
    position.x + dimensions.width,
    position.y,
    position.x + dimensions.width,
    position.y + cornerRadius,
  );
  ctx.lineTo(
    position.x + dimensions.width,
    position.y + dimensions.height - cornerRadius,
  );
  ctx.quadraticCurveTo(
    position.x + dimensions.width,
    position.y + dimensions.height,
    position.x + dimensions.width - cornerRadius,
    position.y + dimensions.height,
  );
  ctx.lineTo(position.x + cornerRadius, position.y + dimensions.height);
  ctx.quadraticCurveTo(
    position.x,
    position.y + dimensions.height,
    position.x,
    position.y + dimensions.height - cornerRadius,
  );
  ctx.lineTo(position.x, position.y + cornerRadius);
  ctx.quadraticCurveTo(
    position.x,
    position.y,
    position.x + cornerRadius,
    position.y,
  );
  ctx.closePath();

  // Create gradient based on element type
  const gradient = ctx.createLinearGradient(
    position.x,
    position.y,
    position.x,
    position.y + dimensions.height,
  );
  
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, isPositive ? 
    shadeColor(color, -20) : // Darker shade for positive
    shadeColor(color, -30)   // Even darker for negative
  );

  ctx.fillStyle = gradient;
  ctx.fill();

  // Add subtle inner border
  ctx.strokeStyle = isPositive ? 
    shadeColor(color, 20) :  // Lighter for positive
    shadeColor(color, -40);  // Darker for negative
  ctx.lineWidth = 2;
  ctx.stroke();

  // Reset shadow for text
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Enhanced text rendering
  const textPadding = 10;
  const availableWidth = dimensions.width - textPadding * 2;

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Word wrapping
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const width = ctx.measureText(currentLine + " " + words[i]).width;
    if (width < availableWidth) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  // Limit to 2 lines
  if (lines.length > 2) {
    lines = lines.slice(0, 2);
    if (lines[1].length > 10) {
      lines[1] = lines[1].substring(0, 9) + "...";
    }
  }

  // Draw text with enhanced shadow for better readability
  const lineHeight = 20; // Increased line height
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = position.y + (dimensions.height - totalTextHeight) / 2 + lineHeight / 2;

  // Enhanced text shadow for better contrast
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Use larger, bolder font
  ctx.font = "bold 16px Inter";
  
  lines.forEach((line, index) => {
    // Draw text outline for better visibility
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.lineWidth = 3;
    ctx.strokeText(
      line,
      position.x + dimensions.width / 2,
      textStartY + index * lineHeight
    );
    
    // Draw text
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(
      line,
      position.x + dimensions.width / 2,
      textStartY + index * lineHeight
    );
  });

  ctx.restore();
  return null;
};

// Helper function to shade colors
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(Math.min((num >> 16) + amt, 255), 0);
  const G = Math.max(Math.min(((num >> 8) & 0x00FF) + amt, 255), 0);
  const B = Math.max(Math.min((num & 0x0000FF) + amt, 255), 0);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}
