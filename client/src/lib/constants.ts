// Game configuration constants

// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Player settings
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 60;
export const PLAYER_SPEED = 5;
export const PLAYER_JUMP_FORCE = 15;
export const GRAVITY = 0.8;

// Game elements
export const ELEMENT_SIZE = 40;
export const INITIAL_SPAWN_RATE = 1200; // ms between spawns (start faster)
export const MIN_SPAWN_RATE = 250; // Faster spawn rate for harder gameplay
export const DIFFICULTY_INCREASE_RATE = 0.15; // More aggressive difficulty increase
export const OVERLAP_PREVENTION_DISTANCE = ELEMENT_SIZE * 1.5; // Minimum distance between elements
export const MAX_ELEMENT_VELOCITY = 6; // Maximum fall speed
export const ELEMENT_HORIZONTAL_MOVE_CHANCE = 0.4; // Chance of an element moving horizontally

// Scrolling background
export const BACKGROUND_SPEED = 1;

// Positive elements - provide one of: extra time, protection
// Positive elements - help the player when collected
export const POSITIVE_ELEMENTS = [
  { text: "Kindness", color: "#22C55E", bonus: "time", value: 5 },
  { text: "दयालुता", color: "#22C55E", bonus: "time", value: 5 },

  { text: "Respect", color: "#10B981", bonus: "time", value: 8 },
  { text: "सम्मान", color: "#10B981", bonus: "time", value: 8 },

  { text: "Honesty", color: "#059669", bonus: "protection", value: 5 },
  { text: "ईमानदारी", color: "#059669", bonus: "protection", value: 5 },

  { text: "Courage", color: "#047857", bonus: "time", value: 10 },
  { text: "साहस", color: "#047857", bonus: "time", value: 10 },

  { text: "Integrity", color: "#065F46", bonus: "protection", value: 5 },
  { text: "नैतिकता", color: "#065F46", bonus: "protection", value: 5 },

  { text: "Patience", color: "#047857", bonus: "time", value: 7 },
  { text: "धैर्य", color: "#047857", bonus: "time", value: 7 },

  { text: "Empathy", color: "#059669", bonus: "protection", value: 5 },
  { text: "सहानुभूति", color: "#059669", bonus: "protection", value: 5 },

  { text: "Wisdom", color: "#10B981", bonus: "time", value: 12 },
  { text: "बुद्धिमत्ता", color: "#10B981", bonus: "time", value: 12 }
];

// Negative elements - cause game over when collided
export const NEGATIVE_ELEMENTS = [
  { text: "Bullying", color: "#DC2626" },
  { text: "धमकाना", color: "#DC2626" },

  { text: "Lying", color: "#B91C1C" },
  { text: "झूठ बोलना", color: "#B91C1C" },

  { text: "Cheating", color: "#991B1B" },
  { text: "धोखा", color: "#991B1B" },

  { text: "Peer Pressure", color: "#7F1D1D" },
  { text: "साथियों का दबाव", color: "#7F1D1D" },

  { text: "Plagiarism", color: "#EF4444" },
  { text: "नकल", color: "#EF4444" },

  { text: "Betrayal", color: "#4A90E2" },
  { text: "विश्वासघात", color: "#4A90E2" },

  { text: "Corruption", color: "#4A90E2" },
  { text: "भ्रष्टाचार", color: "#4A90E2" },

  { text: "Selfishness", color: "#4A90E2" },
  { text: "स्वार्थ", color: "#4A90E2" }
];
