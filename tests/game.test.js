import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Status,
  canBuild,
  createGame,
  drainEvents,
  occupiedTiles,
  placeTower,
  sellTower,
  startWave,
  step,
  tileAt,
  towerAt,
  upgradeTower,
} from '../src/game/game.js';
import { ECONOMY, TOWERS, towerStats, upgradeCost } from '../src/game/config.js';
import { TILE } from '../src/game/constants.js';
import { buildFlowField } from '../src/game/pathfinding.js';

const freeTile = (game, x, y) => y * game.grid.width + x;

/** Laesst die Simulation laufen, bis die Welle vorbei ist oder die Zeit reisst. */
function runWave(game, maxSeconds = 400) {
  const steps = maxSeconds * 60;
  for (let i = 0; i < steps && game.status === Status.WAVE; i++) step(game, 1 / 60);
  return game.status;
}

test('eine neue Partie startet mit Gold, Leben und ohne Tuerme', () => {
  const game = createGame();
  assert.equal(game.gold, ECONOMY.startGold);
  assert.equal(game.lives, ECONOMY.startLives);
  assert.equal(game.wave, 0);
  assert.equal(game.status, Status.BUILDING);
  assert.equal(game.towers.length, 0);
});

test('Turm bauen kostet Gold und sperrt das Feld', () => {
  const game = createGame();
  const idx = freeTile(game, 5, 5);
  const tower = placeTower(game, idx, 'archer');
  assert.ok(tower);
  assert.equal(game.gold, ECONOMY.startGold - TOWERS.archer.cost);
  assert.equal(game.grid.blocked[idx], 1);
  assert.equal(towerAt(game, idx).id, tower.id);
});

test('ohne Gold wird nicht gebaut', () => {
  const game = createGame({ gold: 10 });
  assert.equal(canBuild(game, freeTile(game, 5, 5), 'archer'), false);
  assert.equal(placeTower(game, freeTile(game, 5, 5), 'archer'), null);
  assert.equal(game.towers.length, 0);
});

test('auf demselben Feld steht nur ein Turm', () => {
  const game = createGame();
  const idx = freeTile(game, 5, 5);
  placeTower(game, idx, 'archer');
  assert.equal(placeTower(game, idx, 'cannon'), null);
  assert.equal(game.towers.length, 1);
});

test('Ausbauen kostet Gold und steigert die Werte', () => {
  const game = createGame();
  const tower = placeTower(game, freeTile(game, 5, 5), 'archer');
  const before = towerStats('archer', 1).damage;
  const cost = upgradeCost('archer', 1);
  const gold = game.gold;

  assert.equal(upgradeTower(game, tower.id), true);
  assert.equal(tower.level, 2);
  assert.equal(game.gold, gold - cost);
  assert.ok(towerStats('archer', 2).damage > before);
});

test('die Endstufe laesst sich nicht weiter ausbauen', () => {
  const game = createGame({ gold: 5000 });
  const tower = placeTower(game, freeTile(game, 5, 5), 'archer');
  assert.equal(upgradeTower(game, tower.id), true);
  assert.equal(upgradeTower(game, tower.id), true);
  assert.equal(tower.level, 3);
  assert.equal(upgradeTower(game, tower.id), false);
  assert.equal(upgradeCost('archer', 3), null);
});

test('Verkaufen gibt anteilig Gold zurueck und gibt das Feld frei', () => {
  const game = createGame({ gold: 1000 });
  const idx = freeTile(game, 5, 5);
  const tower = placeTower(game, idx, 'cannon');
  upgradeTower(game, tower.id);
  const invested = tower.invested;
  const gold = game.gold;

  const refund = sellTower(game, tower.id);
  assert.equal(refund, Math.floor(invested * ECONOMY.sellRatio));
  assert.equal(game.gold, gold + refund);
  assert.equal(game.grid.blocked[idx], 0);
  assert.equal(game.towers.length, 0);
});

test('eine Welle startet, spawnt Gegner und endet wieder', () => {
  const game = createGame();
  assert.equal(startWave(game), true);
  assert.equal(game.wave, 1);
  assert.equal(game.status, Status.WAVE);
  assert.equal(startWave(game), false, 'waehrend einer Welle startet keine zweite');

  step(game, 1 / 60);
  assert.ok(game.enemies.length > 0, 'der erste Gegner erscheint sofort');

  assert.equal(runWave(game), Status.BUILDING);
  assert.equal(game.enemies.length, 0);
  assert.equal(game.spawnQueue.length, 0);
});

test('ungeschuetzt erreichen die Gegner den Bergfried und kosten Leben', () => {
  const game = createGame();
  startWave(game);
  runWave(game);
  assert.ok(game.lives < ECONOMY.startLives);
  assert.ok(game.stats.leaked > 0);
});

test('Gegner starten an einem Tor und laufen Richtung Bergfried', () => {
  const game = createGame();
  startWave(game);
  step(game, 1 / 60);
  const enemy = game.enemies[0];
  assert.ok(game.grid.spawns.includes(tileAt(game.grid, enemy.x, enemy.y)));

  const flow = buildFlowField(game.grid);
  const startDist = flow.dist[enemy.tile];
  for (let i = 0; i < 120; i++) step(game, 1 / 60);
  assert.ok(flow.dist[enemy.tile] < startDist, 'der Abstand zum Ziel schrumpft');
});

test('Tuerme toeten Gegner und bringen Gold ein', () => {
  const game = createGame({ gold: 2000 });
  // Dichter Ring aus Bogentuermen um den Weg vor dem Bergfried.
  let built = 0;
  for (const route of game.routes) {
    for (let i = 4; i < route.length - 2 && built < 8; i += 2) {
      const x = route[i] % game.grid.width;
      const y = Math.floor(route[i] / game.grid.width);
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        if (placeTower(game, freeTile(game, x + dx, y + dy), 'archer')) {
          built += 1;
          break;
        }
      }
    }
  }
  assert.ok(built >= 5, `es sollten mehrere Tuerme stehen, waren ${built}`);

  startWave(game);
  const goldBefore = game.gold;
  runWave(game);

  assert.ok(game.stats.killed > 0, 'mindestens ein Abschuss');
  assert.ok(game.gold > goldBefore, 'Abschuesse und Wellenbonus bringen Gold');
  assert.equal(game.lives, ECONOMY.startLives, 'Welle 1 sollte sauber halten');
});

test('waehrend eine Welle laeuft wird nicht unter Gegnern gebaut', () => {
  const game = createGame({ gold: 2000 });
  startWave(game);
  for (let i = 0; i < 60; i++) step(game, 1 / 60);
  const occupied = occupiedTiles(game);
  assert.ok(occupied.length > 0);
  for (const idx of occupied) {
    assert.equal(canBuild(game, idx, 'archer'), false);
  }
});

test('Flieger ignorieren das Labyrinth und fliegen direkt zum Bergfried', () => {
  const game = createGame({ gold: 4000 });
  // Welle 9 bringt Drachen.
  game.wave = 8;
  startWave(game);
  for (let i = 0; i < 60 * 30 && game.enemies.every((e) => !e.flying); i++) step(game, 1 / 60);
  const dragon = game.enemies.find((e) => e.flying);
  assert.ok(dragon, 'in Welle 9 muss ein Drache erscheinen');

  const distBefore = Math.hypot(dragon.x - game.keepPos.x, dragon.y - game.keepPos.y);
  for (let i = 0; i < 60; i++) step(game, 1 / 60);
  const distAfter = Math.hypot(dragon.x - game.keepPos.x, dragon.y - game.keepPos.y);
  assert.ok(distAfter < distBefore, 'der Drache naehert sich auf direktem Weg');
});

test('bei null Leben ist die Partie vorbei und die Simulation steht', () => {
  const game = createGame({ lives: 1 });
  startWave(game);
  for (let i = 0; i < 60 * 300 && game.status !== Status.GAMEOVER; i++) step(game, 1 / 60);
  assert.equal(game.status, Status.GAMEOVER);
  assert.equal(game.lives, 0);

  const snapshot = { time: game.time, enemies: game.enemies.length };
  step(game, 1 / 60);
  assert.equal(game.time, snapshot.time, 'nach dem Ende laeuft nichts weiter');
  assert.equal(startWave(game), false);
});

test('Ereignisse werden gemeldet und beim Abholen geleert', () => {
  const game = createGame();
  placeTower(game, freeTile(game, 5, 5), 'archer');
  startWave(game);
  const events = drainEvents(game);
  assert.ok(events.some((e) => e.type === 'build'));
  assert.ok(events.some((e) => e.type === 'waveStart'));
  assert.equal(drainEvents(game).length, 0);
});

test('Kanonen treffen mehrere Gegner gleichzeitig', () => {
  const game = createGame({ gold: 3000 });
  placeTower(game, freeTile(game, 5, 5), 'cannon');
  game.wave = 1;
  startWave(game);
  for (let i = 0; i < 60 * 120 && game.status === Status.WAVE; i++) step(game, 1 / 60);
  assert.ok(game.stats.damageDealt > 0, 'die Kanone muss Schaden anrichten');
});

test('Frosttuerme verlangsamen statt zu toeten', () => {
  const game = createGame({ gold: 3000 });
  const route = game.routes[0];
  const onRoute = route[Math.floor(route.length / 2)];
  const x = onRoute % game.grid.width;
  const y = Math.floor(onRoute / game.grid.width);
  let placed = null;
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    placed = placeTower(game, freeTile(game, x + dx, y + dy), 'frost');
    if (placed) break;
  }
  assert.ok(placed, 'ein Frostturm muss neben der Route Platz finden');

  startWave(game);
  let slowedSeen = false;
  for (let i = 0; i < 60 * 120 && game.status === Status.WAVE; i++) {
    step(game, 1 / 60);
    if (game.enemies.some((e) => e.slowTimer > 0)) slowedSeen = true;
  }
  assert.equal(slowedSeen, true, 'mindestens ein Gegner war verlangsamt');
});

test('Reichweite ist begrenzt - abseits der Route faellt kein Schuss', () => {
  const game = createGame({ gold: 3000 });
  const stats = towerStats('archer', 1);
  const rangePx = stats.range * TILE;

  // Ein bebaubares Feld suchen, das weit genug von jeder Route entfernt liegt.
  const routeTiles = game.routes.flat();
  let spot = -1;
  for (let idx = 0; idx < game.grid.tiles.length && spot < 0; idx++) {
    if (!canBuild(game, idx, 'archer')) continue;
    const cx = ((idx % game.grid.width) + 0.5) * TILE;
    const cy = (Math.floor(idx / game.grid.width) + 0.5) * TILE;
    const nearest = Math.min(
      ...routeTiles.map((r) => {
        const rx = ((r % game.grid.width) + 0.5) * TILE;
        const ry = (Math.floor(r / game.grid.width) + 0.5) * TILE;
        return Math.hypot(cx - rx, cy - ry);
      }),
    );
    if (nearest > rangePx + TILE) spot = idx;
  }
  assert.ok(spot >= 0, 'es muss ein Feld abseits der Routen geben');

  const tower = placeTower(game, spot, 'archer');
  startWave(game);
  for (let i = 0; i < 60 * 120 && game.status === Status.WAVE; i++) step(game, 1 / 60);
  assert.equal(tower.damageDealt, 0, 'ausserhalb der Reichweite passiert nichts');
});
