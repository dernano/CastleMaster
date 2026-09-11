// Globale Masse des Spielfelds.
export const TILE = 40;
export const GRID_W = 24;
export const GRID_H = 15;
export const CANVAS_W = TILE * GRID_W; // 960
export const CANVAS_H = TILE * GRID_H; // 600

// Feldtypen der Karte.
export const Tile = {
  EMPTY: 0, // begehbar und bebaubar
  ROCK: 1,  // weder begehbar noch bebaubar
  SPAWN: 2, // begehbar, nicht bebaubar
  KEEP: 3,  // Ziel der Gegner, nicht bebaubar
};
