import { TILE, Tile } from './constants.js';
import { parseMap } from './map.js';
import { buildFlowField, canPlaceTower, isBuildable, routeFrom } from './pathfinding.js';
import { ECONOMY, ENEMIES, TOWERS, towerStats, upgradeCost, waveBounty } from './config.js';
import { getWave } from './waves.js';
import { effectiveDamage, splashFalloff } from './combat.js';

export const Status = {
  BUILDING: 'building', // zwischen den Wellen, Bauphase
  WAVE: 'wave',         // Welle laeuft
  GAMEOVER: 'gameover',
};

const MAX_EVENTS = 400;

export function tileCenter(grid, idx) {
  return {
    x: ((idx % grid.width) + 0.5) * TILE,
    y: (Math.floor(idx / grid.width) + 0.5) * TILE,
  };
}

export function tileAt(grid, x, y) {
  const cx = Math.floor(x / TILE);
  const cy = Math.floor(y / TILE);
  if (cx < 0 || cy < 0 || cx >= grid.width || cy >= grid.height) return -1;
  return cy * grid.width + cx;
}

export function createGame(options = {}) {
  const grid = parseMap(options.rows);
  const game = {
    grid,
    flow: buildFlowField(grid),
    keepPos: tileCenter(grid, grid.keep),
    gold: options.gold ?? ECONOMY.startGold,
    lives: options.lives ?? ECONOMY.startLives,
    wave: 0,
    status: Status.BUILDING,
    time: 0,
    towers: [],
    enemies: [],
    projectiles: [],
    spawnQueue: [],
    events: [],
    nextId: 1,
    currentWave: null,
    stats: { killed: 0, leaked: 0, goldEarned: 0, damageDealt: 0 },
  };
  game.routes = grid.spawns.map((s) => routeFrom(grid, game.flow, s));
  return game;
}

function emit(game, event) {
  game.events.push(event);
  if (game.events.length > MAX_EVENTS) game.events.splice(0, game.events.length - MAX_EVENTS);
}

function refreshPaths(game) {
  game.flow = buildFlowField(game.grid);
  game.routes = game.grid.spawns.map((s) => routeFrom(game.grid, game.flow, s));
}

/** Felder, auf denen gerade Gegner stehen oder auf die sie unmittelbar zulaufen. */
export function occupiedTiles(game) {
  const tiles = [];
  for (const e of game.enemies) {
    if (e.flying) continue;
    if (e.tile >= 0) tiles.push(e.tile);
    if (e.targetTile >= 0) tiles.push(e.targetTile);
  }
  return tiles;
}

export function canBuild(game, idx, type) {
  const def = TOWERS[type];
  if (!def) return false;
  if (game.status === Status.GAMEOVER) return false;
  if (game.gold < def.cost) return false;
  return canPlaceTower(game.grid, idx, occupiedTiles(game));
}

/** Warum ein Bau nicht geht - fuer die Rueckmeldung in der Oberflaeche. */
export function buildBlockReason(game, idx, type) {
  const def = TOWERS[type];
  if (!def) return 'Unbekannter Turm';
  if (!isBuildable(game.grid, idx)) return 'Hier kann nicht gebaut werden';
  if (game.gold < def.cost) return 'Nicht genug Gold';
  if (!canPlaceTower(game.grid, idx, occupiedTiles(game))) return 'Der Weg zum Bergfried darf nicht zugebaut werden';
  return null;
}

export function placeTower(game, idx, type) {
  if (!canBuild(game, idx, type)) return null;
  const def = TOWERS[type];
  const pos = tileCenter(game.grid, idx);
  const tower = {
    id: game.nextId++,
    type,
    tile: idx,
    level: 1,
    x: pos.x,
    y: pos.y,
    cooldown: 0,
    angle: -Math.PI / 2,
    invested: def.cost,
    kills: 0,
    damageDealt: 0,
    flash: 0,
  };
  game.gold -= def.cost;
  game.grid.blocked[idx] = 1;
  game.towers.push(tower);
  refreshPaths(game);
  emit(game, { type: 'build', x: pos.x, y: pos.y, tower: type });
  return tower;
}

export function upgradeTower(game, towerId) {
  const tower = game.towers.find((t) => t.id === towerId);
  if (!tower) return false;
  const cost = upgradeCost(tower.type, tower.level);
  if (cost === null || game.gold < cost) return false;
  game.gold -= cost;
  tower.invested += cost;
  tower.level += 1;
  emit(game, { type: 'upgrade', x: tower.x, y: tower.y, level: tower.level });
  return true;
}

export function sellTower(game, towerId) {
  const index = game.towers.findIndex((t) => t.id === towerId);
  if (index < 0) return 0;
  const tower = game.towers[index];
  const refund = Math.floor(tower.invested * ECONOMY.sellRatio);
  game.gold += refund;
  game.towers.splice(index, 1);
  game.grid.blocked[tower.tile] = 0;
  refreshPaths(game);
  emit(game, { type: 'sell', x: tower.x, y: tower.y, refund });
  return refund;
}

export function towerAt(game, idx) {
  return game.towers.find((t) => t.tile === idx) || null;
}

export function startWave(game) {
  if (game.status !== Status.BUILDING) return false;
  game.wave += 1;
  const wave = getWave(game.wave);
  game.currentWave = wave;
  game.status = Status.WAVE;
  game.spawnQueue = [];

  // Gegner wechseln sich zwischen den Toren ab, damit beide Seiten Druck bekommen.
  const gates = game.grid.spawns;
  let gateCursor = 0;
  for (const group of wave.groups) {
    for (let i = 0; i < group.count; i++) {
      game.spawnQueue.push({
        type: group.type,
        at: game.time + group.delay + i * group.interval,
        gate: gates[gateCursor % gates.length],
      });
      gateCursor += 1;
    }
  }
  game.spawnQueue.sort((a, b) => a.at - b.at);
  emit(game, { type: 'waveStart', wave: game.wave, boss: wave.isBoss });
  return true;
}

function spawnEnemy(game, type, gate) {
  const def = ENEMIES[type];
  const wave = game.currentWave;
  const pos = tileCenter(game.grid, gate);
  const hp = Math.round(def.hp * (wave ? wave.hpMultiplier : 1));
  const enemy = {
    id: game.nextId++,
    type,
    def,
    x: pos.x,
    y: pos.y,
    hp,
    maxHp: hp,
    speed: def.speed,
    armor: def.armor + (wave ? wave.armorBonus : 0),
    bounty: def.bounty,
    damage: def.damage,
    radius: def.radius,
    flying: Boolean(def.flying),
    boss: Boolean(def.boss),
    slowTimer: 0,
    slowFactor: 0,
    tile: gate,
    targetTile: -1,
    progress: Infinity,
    phase: Math.random() * Math.PI * 2,
  };
  game.enemies.push(enemy);
  return enemy;
}

function enemyProgress(game, enemy) {
  if (enemy.flying) return Math.hypot(enemy.x - game.keepPos.x, enemy.y - game.keepPos.y);
  const next = game.flow.next[enemy.tile];
  if (next < 0) return game.flow.dist[enemy.tile] === 0 ? 0 : Infinity;
  const c = tileCenter(game.grid, next);
  return game.flow.dist[next] * TILE + Math.hypot(enemy.x - c.x, enemy.y - c.y);
}

function leak(game, enemy) {
  enemy.dead = true;
  game.lives -= enemy.damage;
  game.stats.leaked += 1;
  emit(game, { type: 'leak', x: game.keepPos.x, y: game.keepPos.y, damage: enemy.damage });
  if (game.lives <= 0) {
    game.lives = 0;
    game.status = Status.GAMEOVER;
    emit(game, { type: 'gameover', wave: game.wave });
  }
}

function updateEnemies(game, dt) {
  for (const e of game.enemies) {
    if (e.dead) continue;

    if (e.slowTimer > 0) e.slowTimer = Math.max(0, e.slowTimer - dt);
    const factor = e.slowTimer > 0 ? 1 - e.slowFactor : 1;
    const step = e.speed * factor * TILE * dt;

    let tx;
    let ty;
    if (e.flying) {
      tx = game.keepPos.x;
      ty = game.keepPos.y;
      e.targetTile = -1;
    } else {
      e.tile = tileAt(game.grid, e.x, e.y);
      if (e.tile === game.grid.keep) {
        leak(game, e);
        continue;
      }
      const next = game.flow.next[e.tile];
      if (next >= 0) {
        e.targetTile = next;
        const c = tileCenter(game.grid, next);
        tx = c.x;
        ty = c.y;
      } else {
        // Sollte nicht vorkommen, weil Bauen den Weg nie kappen darf.
        // Als Notfallverhalten laeuft der Gegner direkt auf den Bergfried zu.
        e.targetTile = -1;
        tx = game.keepPos.x;
        ty = game.keepPos.y;
      }
    }

    const dx = tx - e.x;
    const dy = ty - e.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= step || dist === 0) {
      e.x = tx;
      e.y = ty;
    } else {
      e.x += (dx / dist) * step;
      e.y += (dy / dist) * step;
    }
    e.facing = Math.atan2(dy, dx);

    if (e.flying && Math.hypot(e.x - game.keepPos.x, e.y - game.keepPos.y) < TILE * 0.45) {
      leak(game, e);
      continue;
    }
    if (!e.flying) e.tile = tileAt(game.grid, e.x, e.y);
    e.progress = enemyProgress(game, e);
  }
}

function damageEnemy(game, enemy, amount, damageType, source) {
  if (enemy.dead) return 0;
  const dealt = Math.min(enemy.hp, effectiveDamage(amount, enemy.armor, damageType));
  enemy.hp -= dealt;
  game.stats.damageDealt += dealt;
  if (source) source.damageDealt += dealt;

  if (enemy.hp <= 0) {
    enemy.dead = true;
    game.gold += enemy.bounty;
    game.stats.goldEarned += enemy.bounty;
    game.stats.killed += 1;
    if (source) source.kills += 1;
    emit(game, { type: 'kill', x: enemy.x, y: enemy.y, bounty: enemy.bounty, color: enemy.def.color, boss: enemy.boss });
  } else {
    emit(game, { type: 'hit', x: enemy.x, y: enemy.y, damageType });
  }
  return dealt;
}

function findTarget(game, tower, stats) {
  const rangePx = stats.range * TILE;
  let best = null;
  let bestProgress = Infinity;
  for (const e of game.enemies) {
    if (e.dead) continue;
    if (Math.hypot(e.x - tower.x, e.y - tower.y) > rangePx + e.radius * 0.5) continue;
    if (e.progress < bestProgress) {
      bestProgress = e.progress;
      best = e;
    }
  }
  return best;
}

function updateTowers(game, dt) {
  for (const t of game.towers) {
    if (t.flash > 0) t.flash = Math.max(0, t.flash - dt);
    t.cooldown -= dt;
    const stats = towerStats(t.type, t.level);
    const target = findTarget(game, t, stats);
    if (!target) continue;
    t.angle = Math.atan2(target.y - t.y, target.x - t.x);
    if (t.cooldown > 0) continue;

    t.cooldown = 1 / stats.rate;
    t.flash = 0.09;
    game.projectiles.push({
      id: game.nextId++,
      x: t.x,
      y: t.y,
      targetId: target.id,
      lastX: target.x,
      lastY: target.y,
      speed: stats.projectileSpeed,
      damage: stats.damage,
      damageType: stats.damageType,
      splash: stats.splash || 0,
      slow: stats.slow || 0,
      slowTime: stats.slowTime || 0,
      chain: stats.chain || 0,
      chainRange: stats.chainRange || 0,
      towerType: t.type,
      sourceId: t.id,
      life: 3,
    });
    emit(game, { type: 'shoot', x: t.x, y: t.y, tower: t.type, angle: t.angle });
  }
}

function applySlow(enemy, slow, slowTime) {
  if (slow <= 0) return;
  enemy.slowFactor = Math.max(enemy.slowFactor, slow);
  enemy.slowTimer = Math.max(enemy.slowTimer, slowTime);
}

function impact(game, p, target) {
  const source = game.towers.find((t) => t.id === p.sourceId) || null;

  if (p.splash > 0) {
    const radiusPx = p.splash * TILE;
    for (const e of game.enemies) {
      if (e.dead) continue;
      const d = Math.hypot(e.x - p.x, e.y - p.y) - e.radius * 0.5;
      const factor = splashFalloff(Math.max(0, d), radiusPx);
      if (factor <= 0) continue;
      damageEnemy(game, e, p.damage * factor, p.damageType, source);
      applySlow(e, p.slow, p.slowTime);
    }
    emit(game, { type: 'explosion', x: p.x, y: p.y, radius: radiusPx });
    return;
  }

  if (!target || target.dead) return;
  damageEnemy(game, target, p.damage, p.damageType, source);
  applySlow(target, p.slow, p.slowTime);

  if (p.chain > 0) {
    const hit = new Set([target.id]);
    let from = target;
    let damage = p.damage;
    for (let i = 0; i < p.chain; i++) {
      damage *= 0.6;
      let nearest = null;
      let nearestDist = Infinity;
      for (const e of game.enemies) {
        if (e.dead || hit.has(e.id)) continue;
        const d = Math.hypot(e.x - from.x, e.y - from.y);
        if (d < nearestDist && d <= p.chainRange * TILE) {
          nearestDist = d;
          nearest = e;
        }
      }
      if (!nearest) break;
      emit(game, { type: 'chain', x1: from.x, y1: from.y, x2: nearest.x, y2: nearest.y });
      damageEnemy(game, nearest, damage, p.damageType, source);
      hit.add(nearest.id);
      from = nearest;
    }
  }
}

function updateProjectiles(game, dt) {
  for (const p of game.projectiles) {
    if (p.done) continue;
    p.life -= dt;
    if (p.life <= 0) {
      p.done = true;
      continue;
    }

    const target = game.enemies.find((e) => e.id === p.targetId && !e.dead);
    let tx = p.lastX;
    let ty = p.lastY;
    if (target) {
      tx = target.x;
      ty = target.y;
      p.lastX = tx;
      p.lastY = ty;
    } else if (!p.splash) {
      // Zielsuchende Geschosse verpuffen, wenn ihr Ziel schon tot ist.
      p.done = true;
      continue;
    }

    const dx = tx - p.x;
    const dy = ty - p.y;
    const dist = Math.hypot(dx, dy);
    const step = p.speed * dt;
    p.angle = Math.atan2(dy, dx);

    if (dist <= step + (target ? target.radius * 0.6 : 2)) {
      p.x = tx;
      p.y = ty;
      p.done = true;
      impact(game, p, target);
    } else {
      p.x += (dx / dist) * step;
      p.y += (dy / dist) * step;
    }
  }
}

function finishWave(game) {
  const bounty = waveBounty(game.wave);
  game.gold += bounty;
  game.stats.goldEarned += bounty;
  game.status = Status.BUILDING;
  game.currentWave = null;
  emit(game, { type: 'waveEnd', wave: game.wave, bounty });
}

/** Ein Simulationsschritt mit fester Schrittweite (dt in Sekunden). */
export function step(game, dt) {
  if (game.status === Status.GAMEOVER) return;
  game.time += dt;

  while (game.spawnQueue.length && game.spawnQueue[0].at <= game.time) {
    const entry = game.spawnQueue.shift();
    spawnEnemy(game, entry.type, entry.gate);
  }

  updateEnemies(game, dt);
  updateTowers(game, dt);
  updateProjectiles(game, dt);

  if (game.enemies.some((e) => e.dead)) game.enemies = game.enemies.filter((e) => !e.dead);
  if (game.projectiles.some((p) => p.done)) game.projectiles = game.projectiles.filter((p) => !p.done);

  if (game.status === Status.WAVE && game.spawnQueue.length === 0 && game.enemies.length === 0) {
    finishWave(game);
  }
}

/** Ereignisse abholen und den Puffer leeren (fuer Effekte und Oberflaeche). */
export function drainEvents(game) {
  const events = game.events;
  game.events = [];
  return events;
}

export { Tile };
