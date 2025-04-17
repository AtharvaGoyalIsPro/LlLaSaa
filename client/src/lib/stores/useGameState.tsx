import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { 
  PLAYER_WIDTH, PLAYER_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT,
  INITIAL_SPAWN_RATE, MIN_SPAWN_RATE, DIFFICULTY_INCREASE_RATE,
  POSITIVE_ELEMENTS, NEGATIVE_ELEMENTS, ELEMENT_SIZE, PLAYER_SPEED,
  PLAYER_JUMP_FORCE, GRAVITY, OVERLAP_PREVENTION_DISTANCE, 
  MAX_ELEMENT_VELOCITY, ELEMENT_HORIZONTAL_MOVE_CHANCE
} from "../constants";
import { GameState, PositiveElement, NegativeElement, FallingElement, GamePhase, BonusType } from "../types";
import { useAudio } from "./useAudio";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial game state
const initialGameState: GameState = {
  player: {
    position: {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10
    },
    velocity: { x: 0, y: 0 },
    dimensions: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
    isJumping: false,
    isProtected: false,
    protectionTimeLeft: 0
  },
  positiveElements: [],
  negativeElements: [],
  score: 0,
  startTime: null,
  lastSpawnTime: 0,
  spawnRate: INITIAL_SPAWN_RATE,
  isGameOver: false,
  gameOverReason: ""
};

interface GameStateStore extends GameState {
  phase: GamePhase;
  spawnElement: (timestamp: number) => void;
  updateElements: (deltaTime: number) => void;
  checkCollisions: () => void;
  movePlayer: (direction: "left" | "right" | "jump" | null) => void;
  updatePlayerPosition: (deltaTime: number) => void;
  updateProtection: (deltaTime: number) => void;
  updateSpawnRate: (elapsedTime: number) => void;
  start: () => void;
  restart: () => void;
  end: (reason: string) => void;
}

export const useGameState = create<GameStateStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialGameState,
    phase: "ready",
    
    start: () => {
      set({
        ...initialGameState,
        phase: "playing",
        startTime: Date.now()
      });
    },
    
    restart: () => {
      set({
        ...initialGameState,
        phase: "ready"
      });
    },
    
    end: (reason: string) => {
      set((state) => ({
        phase: "ended",
        isGameOver: true,
        gameOverReason: reason
      }));
      
      // Play hit sound effect
      const hitSound = useAudio.getState().hitSound;
      if (hitSound && !useAudio.getState().isMuted) {
        hitSound.currentTime = 0;
        hitSound.play().catch(error => {
          console.log("Hit sound play prevented:", error);
        });
      }
    },
    
    spawnElement: (timestamp: number) => {
      set(state => {
        const { lastSpawnTime, spawnRate, positiveElements, negativeElements } = state;
        
        // Check if it's time to spawn a new element
        if (timestamp - lastSpawnTime < spawnRate) {
          return {};
        }
        
        // Define a function to check if a position is too close to existing elements
        const isTooCloseToOtherElements = (x: number): boolean => {
          const allElements = [...positiveElements, ...negativeElements];
          return allElements.some(element => 
            Math.abs(element.position.x - x) < OVERLAP_PREVENTION_DISTANCE
          );
        };
        
        // Find a position that doesn't overlap with existing elements
        let positionX: number;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loops
        
        do {
          positionX = Math.random() * (CANVAS_WIDTH - ELEMENT_SIZE);
          attempts++;
        } while (isTooCloseToOtherElements(positionX) && attempts < maxAttempts);
        
        // Determine if this should be a positive or negative element (30% chance for positive)
        const isPositive = Math.random() < 0.3;
        
        // Determine if element should move horizontally
        const shouldMoveHorizontally = Math.random() < ELEMENT_HORIZONTAL_MOVE_CHANCE;
        
        // Create the new element with more challenging movement
        const baseElement = {
          id: generateId(),
          position: {
            x: positionX,
            y: -ELEMENT_SIZE  // Start above the visible area
          },
          velocity: { 
            // Add horizontal movement for more challenge
            x: shouldMoveHorizontally ? (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()) : 0,
            // Faster falling velocity for more challenge
            y: 2 + Math.random() * (MAX_ELEMENT_VELOCITY - 2)
          },
          dimensions: { width: ELEMENT_SIZE, height: ELEMENT_SIZE }
        };
        
        if (isPositive) {
          // Choose a random positive element
          const template = POSITIVE_ELEMENTS[Math.floor(Math.random() * POSITIVE_ELEMENTS.length)];
          const positiveElement: PositiveElement = {
            ...baseElement,
            text: template.text,
            color: template.color,
            bonus: template.bonus as BonusType, // Fix type issue
            value: template.value
          };
          
          return {
            positiveElements: [...state.positiveElements, positiveElement],
            lastSpawnTime: timestamp
          };
        } else {
          // Choose a random negative element
          const template = NEGATIVE_ELEMENTS[Math.floor(Math.random() * NEGATIVE_ELEMENTS.length)];
          const negativeElement: NegativeElement = {
            ...baseElement,
            text: template.text,
            color: template.color
          };
          
          return {
            negativeElements: [...state.negativeElements, negativeElement],
            lastSpawnTime: timestamp
          };
        }
      });
    },
    
    updateElements: (deltaTime: number) => {
      set(state => {
        // Update position of positive elements and handle element movement
        const updatedPositiveElements = state.positiveElements
          .map(element => {
            // Update element positions with both x and y velocities
            let newX = element.position.x + element.velocity.x * deltaTime;
            const newY = element.position.y + element.velocity.y * deltaTime;
            
            // Bounce off walls for horizontal movement
            if (newX <= 0 || newX >= CANVAS_WIDTH - element.dimensions.width) {
              // Reverse horizontal direction
              element.velocity.x *= -1;
              // Adjust position to stay within bounds
              newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - element.dimensions.width));
            }
            
            return {
              ...element,
              position: { x: newX, y: newY },
              // Gradually increase fall speed for added difficulty
              velocity: { 
                x: element.velocity.x,
                y: Math.min(element.velocity.y + 0.01 * deltaTime, MAX_ELEMENT_VELOCITY)
              }
            };
          })
          .filter(element => element.position.y < CANVAS_HEIGHT);
        
        // Update position of negative elements with the same logic
        const updatedNegativeElements = state.negativeElements
          .map(element => {
            // Update element positions with both x and y velocities
            let newX = element.position.x + element.velocity.x * deltaTime;
            const newY = element.position.y + element.velocity.y * deltaTime;
            
            // Bounce off walls for horizontal movement
            if (newX <= 0 || newX >= CANVAS_WIDTH - element.dimensions.width) {
              // Reverse horizontal direction
              element.velocity.x *= -1;
              // Adjust position to stay within bounds
              newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - element.dimensions.width));
            }
            
            return {
              ...element,
              position: { x: newX, y: newY },
              // Gradually increase fall speed for added difficulty
              velocity: { 
                x: element.velocity.x,
                y: Math.min(element.velocity.y + 0.02 * deltaTime, MAX_ELEMENT_VELOCITY) // negative elements accelerate faster
              }
            };
          })
          .filter(element => element.position.y < CANVAS_HEIGHT);
        
        return {
          positiveElements: updatedPositiveElements,
          negativeElements: updatedNegativeElements
        };
      });
    },
    
    checkCollisions: () => {
      const state = get();
      const { player, positiveElements, negativeElements, isGameOver } = state;
      
      if (isGameOver) return;
      
      // Helper function to detect collision
      const checkCollision = (element: FallingElement) => {
        return (
          player.position.x < element.position.x + element.dimensions.width &&
          player.position.x + player.dimensions.width > element.position.x &&
          player.position.y < element.position.y + element.dimensions.height &&
          player.position.y + player.dimensions.height > element.position.y
        );
      };
      
      // Check collision with positive elements
      const collidedPositiveIndex = positiveElements.findIndex(checkCollision);
      if (collidedPositiveIndex !== -1) {
        const collidedElement = positiveElements[collidedPositiveIndex];
        const updatedPositiveElements = [...positiveElements];
        updatedPositiveElements.splice(collidedPositiveIndex, 1);
        
        // Play success sound
        const successSound = useAudio.getState().successSound;
        if (successSound && !useAudio.getState().isMuted) {
          successSound.currentTime = 0;
          successSound.play().catch(error => {
            console.log("Success sound play prevented:", error);
          });
        }
        
        // Apply positive element effects
        if (collidedElement.bonus === "protection") {
          set({
            positiveElements: updatedPositiveElements,
            player: {
              ...state.player,
              isProtected: true,
              protectionTimeLeft: collidedElement.value * 1000 // Convert to ms
            }
          });
        } else if (collidedElement.bonus === "time") {
          // Add bonus time by adjusting the startTime
          const bonusTimeMs = collidedElement.value * 1000;
          set({
            positiveElements: updatedPositiveElements,
            startTime: state.startTime ? state.startTime - bonusTimeMs : null
          });
        }
      }
      
      // Check collision with negative elements (only if not protected)
      if (!player.isProtected) {
        const collidedNegativeIndex = negativeElements.findIndex(checkCollision);
        if (collidedNegativeIndex !== -1) {
          const collidedElement = negativeElements[collidedNegativeIndex];
          set({
            isGameOver: true,
            phase: "ended",
            gameOverReason: collidedElement.text
          });
          
          // Play hit sound effect
          const hitSound = useAudio.getState().hitSound;
          if (hitSound && !useAudio.getState().isMuted) {
            hitSound.currentTime = 0;
            hitSound.play().catch(error => {
              console.log("Hit sound play prevented:", error);
            });
          }
        }
      }
    },
    
    movePlayer: (direction: "left" | "right" | "jump" | null) => {
      set(state => {
        const { player } = state;
        let newVelocityX = player.velocity.x;
        let newVelocityY = player.velocity.y;
        let isJumping = player.isJumping;
        
        // Handle horizontal movement - maintain momentum while jumping
        if (direction === "left") {
          newVelocityX = -PLAYER_SPEED;
        } else if (direction === "right") {
          newVelocityX = PLAYER_SPEED;
        } else if (!player.isJumping) {
          // Only reset horizontal velocity when not jumping
          newVelocityX = 0;
        } else {
          // Keep current horizontal velocity while jumping
          newVelocityX = player.velocity.x;
        }
        
        // Handle jumping (only if not already jumping)
        if (direction === "jump" && !player.isJumping) {
          newVelocityY = -PLAYER_JUMP_FORCE;
          isJumping = true;
        }
        
        return {
          player: {
            ...player,
            velocity: { x: newVelocityX, y: newVelocityY },
            isJumping
          }
        };
      });
    },
    
    updatePlayerPosition: (deltaTime: number) => {
      set(state => {
        const { player } = state;
        let { position, velocity, isJumping } = player;
        
        // Apply gravity to y velocity if jumping
        if (isJumping) {
          velocity.y += GRAVITY * deltaTime;
        }
        
        // Calculate new position
        const newX = position.x + velocity.x * deltaTime;
        const newY = position.y + velocity.y * deltaTime;
        
        // Ensure player stays within canvas boundaries horizontally
        const boundedX = Math.max(0, Math.min(newX, CANVAS_WIDTH - player.dimensions.width));
        
        // Check if player has landed on the ground
        const groundY = CANVAS_HEIGHT - player.dimensions.height - 10;
        let boundedY = newY;
        let newIsJumping = isJumping;
        
        if (newY >= groundY) {
          boundedY = groundY;
          velocity.y = 0;
          newIsJumping = false;
        }
        
        return {
          player: {
            ...player,
            position: { x: boundedX, y: boundedY },
            velocity: { ...velocity },
            isJumping: newIsJumping
          }
        };
      });
    },
    
    updateProtection: (deltaTime: number) => {
      set(state => {
        const { player } = state;
        
        if (!player.isProtected) return {};
        
        const newProtectionTimeLeft = player.protectionTimeLeft - deltaTime * 1000;
        
        if (newProtectionTimeLeft <= 0) {
          return {
            player: {
              ...player,
              isProtected: false,
              protectionTimeLeft: 0
            }
          };
        }
        
        return {
          player: {
            ...player,
            protectionTimeLeft: newProtectionTimeLeft
          }
        };
      });
    },
    
    updateSpawnRate: (elapsedTime: number) => {
      set(state => {
        // Calculate new spawn rate based on elapsed time
        // The longer the game runs, the faster elements will spawn
        const secondsElapsed = elapsedTime / 1000;
        const newSpawnRate = Math.max(
          MIN_SPAWN_RATE,
          INITIAL_SPAWN_RATE - (secondsElapsed * DIFFICULTY_INCREASE_RATE * 1000)
        );
        
        return { spawnRate: newSpawnRate };
      });
    }
  }))
);
