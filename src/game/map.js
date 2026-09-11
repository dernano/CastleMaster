import { Tile, GRID_W, GRID_H } from './constants.js';

// '#' Fels, '.' freies Feld, 'S' Gegner-Tor, 'K' Bergfried
export const MAP_ROWS = [
  '########################',
  '#......................#',
  '#......................#',
  '#.....##...........##..#',
  'S.....##...........##..#',
  '#......................#',
  '#..................###.#',
  '#......................K',
  '#..................###.#',
  '#......................#',
  'S.....##...........##..#',
  '#.....##...........##..#',
  '#......................#',
  '#......................#',
  '########################',
];

const CHARS = { '#': Tile.ROCK, '.': Tile.EMPTY, S: Tile.SPAWN, K: Tile.KEEP };

/**
 * Wandelt die ASCII-Karte in ein Gitter um.
 * Das Gitter ist die einzige Quelle der Wahrheit fuer Wegfindung und Bau.
 */
export function parseMap(rows = MAP_ROWS) {
  const height = rows.length;
  const width = rows[0].length;
  if (width !== GRID_W || height !== GRID_H) {
    throw new Error(`Karte muss ${GRID_W}x${GRID_H} sein, ist ${width}x${height}`);
  }
  const tiles = new Int8Array(width * height);
  const spawns = [];
  let keep = -1;

  for (let y = 0; y < height; y++) {
    const row = rows[y];
    if (row.length !== width) throw new Error(`Zeile ${y} hat ${row.length} statt ${width} Zeichen`);
    for (let x = 0; x < width; x++) {
      const type = CHARS[row[x]];
      if (type === undefined) throw new Error(`Unbekanntes Kartenzeichen "${row[x]}" bei ${x},${y}`);
      const idx = y * width + x;
      tiles[idx] = type;
      if (type === Tile.SPAWN) spawns.push(idx);
      if (type === Tile.KEEP) keep = idx;
    }
  }

  if (keep < 0) throw new Error('Karte hat keinen Bergfried (K)');
  if (spawns.length === 0) throw new Error('Karte hat kein Gegner-Tor (S)');

  return {
    width,
    height,
    tiles,
    spawns,
    keep,
    blocked: new Uint8Array(width * height), // 1 = durch einen Turm belegt
  };
}
