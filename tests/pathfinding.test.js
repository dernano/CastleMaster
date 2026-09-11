import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMap } from '../src/game/map.js';
import { buildFlowField, canPlaceTower, isBuildable, isWalkable, routeFrom } from '../src/game/pathfinding.js';
import { Tile } from '../src/game/constants.js';

test('Karte hat zwei Tore und genau einen Bergfried', () => {
  const grid = parseMap();
  assert.equal(grid.spawns.length, 2);
  assert.equal(grid.tiles[grid.keep], Tile.KEEP);
});

test('jedes Tor erreicht den Bergfried', () => {
  const grid = parseMap();
  const flow = buildFlowField(grid);
  for (const spawn of grid.spawns) {
    assert.ok(flow.dist[spawn] > 0, 'Tor muss einen Weg haben');
    const route = routeFrom(grid, flow, spawn);
    assert.equal(route.at(-1), grid.keep);
    assert.equal(route.length, flow.dist[spawn] + 1);
  }
});

test('Fels ist weder begehbar noch bebaubar', () => {
  const grid = parseMap();
  const rock = grid.tiles.indexOf(Tile.ROCK);
  assert.equal(isWalkable(grid, rock), false);
  assert.equal(isBuildable(grid, rock), false);
});

test('Tore und Bergfried sind nicht bebaubar', () => {
  const grid = parseMap();
  assert.equal(isBuildable(grid, grid.keep), false);
  assert.equal(isBuildable(grid, grid.spawns[0]), false);
});

test('ein Turm darf den letzten Weg zum Bergfried nicht zumauern', () => {
  const grid = parseMap();
  // Der Bergfried liegt am rechten Rand, erreichbar nur ueber das Feld links davon.
  const gate = grid.keep - 1;
  assert.equal(canPlaceTower(grid, gate, []), false);
  assert.equal(grid.blocked[gate], 0, 'Pruefung darf das Gitter nicht veraendern');
});

test('ein normales Feld darf bebaut werden', () => {
  const grid = parseMap();
  const free = 5 * grid.width + 5;
  assert.equal(canPlaceTower(grid, free, []), true);
});

test('auf besetzten Feldern wird nicht gebaut', () => {
  const grid = parseMap();
  const free = 5 * grid.width + 5;
  assert.equal(canPlaceTower(grid, free, [free]), false);
});

test('das einzige Zugangsfeld eines Tors bleibt frei', () => {
  const grid = parseMap();
  // Das Tor liegt am linken Rand, oben und unten ist Fels - es gibt nur einen Ausgang.
  assert.equal(canPlaceTower(grid, grid.spawns[0] + 1, []), false);
});

test('ein Turm auf der Route zwingt die Gegner auf einen anderen Weg', () => {
  const grid = parseMap();
  const spawn = grid.spawns[0];
  const routeBefore = routeFrom(grid, buildFlowField(grid), spawn);

  // Ein Feld mitten auf der Route, das gebaut werden darf.
  const target = routeBefore.slice(3, -3).find((idx) => canPlaceTower(grid, idx, []));
  assert.ok(target !== undefined, 'es muss ein bebaubares Feld auf der Route geben');

  grid.blocked[target] = 1;
  const flow = buildFlowField(grid);
  const routeAfter = routeFrom(grid, flow, spawn);

  assert.ok(flow.dist[spawn] > 0, 'es muss weiterhin einen Weg geben');
  assert.equal(routeAfter.at(-1), grid.keep);
  assert.equal(routeAfter.includes(target), false, 'die neue Route meidet den Turm');
});

test('eine Mauer quer ueber die Karte verlaengert den Weg', () => {
  const grid = parseMap();
  const before = buildFlowField(grid).dist[grid.spawns[0]];
  // Spalte 12 bis auf eine Luecke ganz unten zumauern.
  for (let y = 1; y < grid.height - 2; y++) {
    const idx = y * grid.width + 12;
    if (canPlaceTower(grid, idx, [])) grid.blocked[idx] = 1;
  }
  const after = buildFlowField(grid).dist[grid.spawns[0]];
  assert.ok(after > before, `Umweg erwartet: ${before} -> ${after}`);
});
