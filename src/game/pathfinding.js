import { Tile } from './constants.js';

/** Ein Feld ist begehbar, wenn es kein Fels ist und kein Turm darauf steht. */
export function isWalkable(grid, idx) {
  if (idx < 0 || idx >= grid.tiles.length) return false;
  return grid.tiles[idx] !== Tile.ROCK && grid.blocked[idx] === 0;
}

/** Ein Feld ist bebaubar, wenn es leer ist und noch kein Turm darauf steht. */
export function isBuildable(grid, idx) {
  if (idx < 0 || idx >= grid.tiles.length) return false;
  return grid.tiles[idx] === Tile.EMPTY && grid.blocked[idx] === 0;
}

/**
 * Breitensuche vom Bergfried aus ueber alle begehbaren Felder.
 * Ergebnis ist ein Flow-Field: jedes Feld kennt seinen Abstand zum Ziel
 * und das naechste Feld auf dem kuerzesten Weg dorthin.
 */
export function buildFlowField(grid) {
  const size = grid.tiles.length;
  const dist = new Int32Array(size).fill(-1);
  const next = new Int32Array(size).fill(-1);
  const queue = new Int32Array(size);
  let head = 0;
  let tail = 0;

  dist[grid.keep] = 0;
  queue[tail++] = grid.keep;

  while (head < tail) {
    const cur = queue[head++];
    const cx = cur % grid.width;
    const cy = (cur / grid.width) | 0;
    const d = dist[cur];

    for (let k = 0; k < 4; k++) {
      const nx = cx + (k === 0 ? 1 : k === 1 ? -1 : 0);
      const ny = cy + (k === 2 ? 1 : k === 3 ? -1 : 0);
      if (nx < 0 || ny < 0 || nx >= grid.width || ny >= grid.height) continue;
      const nb = ny * grid.width + nx;
      if (dist[nb] !== -1 || !isWalkable(grid, nb)) continue;
      dist[nb] = d + 1;
      next[nb] = cur;
      queue[tail++] = nb;
    }
  }

  return { dist, next };
}

/** Liefert den Weg von einem Startfeld zum Bergfried als Liste von Feld-Indizes. */
export function routeFrom(grid, flow, startIdx) {
  const route = [];
  let cur = startIdx;
  let guard = grid.tiles.length + 1;
  while (cur >= 0 && guard-- > 0) {
    route.push(cur);
    if (cur === grid.keep) break;
    cur = flow.next[cur];
  }
  return route;
}

/**
 * Prueft, ob ein Turm auf idx gebaut werden darf.
 * `occupied` sind Felder, auf denen gerade Gegner stehen oder hinlaufen -
 * dort darf nicht gebaut werden, sonst stecken sie fest.
 * Ausserdem muss jedes Tor danach immer noch einen Weg zum Bergfried haben.
 */
export function canPlaceTower(grid, idx, occupied = []) {
  if (!isBuildable(grid, idx)) return false;
  for (const tile of occupied) {
    if (tile === idx) return false;
  }

  grid.blocked[idx] = 1;
  const flow = buildFlowField(grid);
  grid.blocked[idx] = 0;

  for (const spawn of grid.spawns) {
    if (flow.dist[spawn] < 0) return false;
  }
  for (const tile of occupied) {
    if (tile >= 0 && flow.dist[tile] < 0) return false;
  }
  return true;
}
