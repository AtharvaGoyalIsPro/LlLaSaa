// Game types

export type GamePhase = "ready" | "playing" | "ended";

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface PlayerState {
  position: Position;
  velocity: Velocity;
  dimensions: Dimensions;
  isJumping: boolean;
  isProtected: boolean;
  protectionTimeLeft: number;
}

export type BonusType = "time" | "protection";

export interface ElementBase {
  id: string;
  position: Position;
  velocity: Velocity;
  dimensions: Dimensions;
  text: string;
  color: string;
}

export interface PositiveElement extends ElementBase {
  bonus: BonusType;
  value: number;
}

export interface NegativeElement extends ElementBase {
  // No additional properties for negative elements
}

export type FallingElement = PositiveElement | NegativeElement;

export interface GameState {
  player: PlayerState;
  positiveElements: PositiveElement[];
  negativeElements: NegativeElement[];
  score: number;
  startTime: number | null;
  lastSpawnTime: number;
  spawnRate: number;
  isGameOver: boolean;
  gameOverReason: string;
}
