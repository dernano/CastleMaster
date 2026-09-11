import { CANVAS_H, CANVAS_W } from './game/constants.js';
import { TOWERS, TOWER_ORDER } from './game/config.js';
import {
  Status,
  buildBlockReason,
  canBuild,
  createGame,
  drainEvents,
  placeTower,
  sellTower,
  startWave,
  step,
  tileAt,
  towerAt,
  upgradeTower,
} from './game/game.js';
import { Renderer } from './render/renderer.js';
import { Hud, renderLegend } from './ui/hud.js';

const FIXED_DT = 1 / 60;
const MAX_STEPS_PER_FRAME = 6;
const BEST_KEY = 'castle-master:best-wave';

const canvas = document.getElementById('game');
const renderer = new Renderer(canvas);

const view = {
  buildType: null,
  hoverTile: -1,
  canBuildHere: false,
  selectedTowerId: null,
  speed: 1,
  paused: false,
  best: loadBest(),
};

let game = createGame();
let hud;

function loadBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY) || 0);
  } catch {
    return 0;
  }
}

function saveBest(waves) {
  view.best = Math.max(view.best, waves);
  try {
    localStorage.setItem(BEST_KEY, String(view.best));
  } catch {
    /* Privater Modus - dann eben ohne Bestwert. */
  }
}

function selectBuild(type) {
  view.buildType = view.buildType === type ? null : type;
  view.selectedTowerId = null;
  hud.setMessage(view.buildType ? `${TOWERS[view.buildType].name} platzieren - Rechtsklick bricht ab.` : '');
}

function tryPlace(idx) {
  const type = view.buildType;
  if (!type) return;
  if (canBuild(game, idx, type)) {
    placeTower(game, idx, type);
    renderer.drawBackground(game);
    hud.setMessage('');
    if (game.gold < TOWERS[type].cost) {
      view.buildType = null;
      hud.setMessage('Nicht genug Gold fuer einen weiteren Turm.', 'warn');
    }
  } else {
    hud.setMessage(buildBlockReason(game, idx, type) || 'Hier kann nicht gebaut werden', 'warn');
  }
}

function pointerTile(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_W;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_H;
  return tileAt(game.grid, x, y);
}

canvas.addEventListener('mousemove', (event) => {
  view.hoverTile = pointerTile(event);
  view.canBuildHere = view.buildType ? canBuild(game, view.hoverTile, view.buildType) : false;
});

canvas.addEventListener('mouseleave', () => {
  view.hoverTile = -1;
});

canvas.addEventListener('click', (event) => {
  const idx = pointerTile(event);
  if (idx < 0) return;
  if (view.buildType) {
    tryPlace(idx);
    view.canBuildHere = canBuild(game, idx, view.buildType);
    return;
  }
  const tower = towerAt(game, idx);
  view.selectedTowerId = tower ? tower.id : null;
});

canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  view.buildType = null;
  view.selectedTowerId = null;
  hud.setMessage('');
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const towerIndex = TOWER_ORDER.findIndex((t) => TOWERS[t].hotkey === key);
  if (towerIndex >= 0) {
    selectBuild(TOWER_ORDER[towerIndex]);
    return;
  }
  switch (key) {
    case 'escape':
      view.buildType = null;
      view.selectedTowerId = null;
      hud.setMessage('');
      break;
    case ' ':
      event.preventDefault();
      if (game.status === Status.BUILDING) handlers.onStartWave();
      else handlers.onTogglePause();
      break;
    case 'f':
      handlers.onToggleSpeed();
      break;
    case 'p':
      handlers.onTogglePause();
      break;
    case 'u':
      handlers.onUpgrade();
      break;
    case 'x':
      handlers.onSell();
      break;
    case 'r':
      if (game.status === Status.GAMEOVER) handlers.onRestart();
      break;
    default:
      break;
  }
});

const handlers = {
  onSelectBuild: selectBuild,
  onStartWave() {
    if (startWave(game)) {
      view.paused = false;
      hud.setMessage('');
    }
  },
  onToggleSpeed() {
    view.speed = view.speed === 1 ? 2 : view.speed === 2 ? 3 : 1;
  },
  onTogglePause() {
    view.paused = !view.paused;
  },
  onUpgrade() {
    if (view.selectedTowerId && !upgradeTower(game, view.selectedTowerId)) {
      hud.setMessage('Ausbau nicht moeglich - Gold pruefen oder Endstufe erreicht.', 'warn');
    }
  },
  onSell() {
    if (view.selectedTowerId) {
      sellTower(game, view.selectedTowerId);
      view.selectedTowerId = null;
      renderer.drawBackground(game);
    }
  },
  onRestart() {
    game = createGame();
    view.buildType = null;
    view.selectedTowerId = null;
    view.paused = false;
    view.speed = 1;
    renderer.drawBackground(game);
    hud.setMessage('Neue Burg, neues Glueck.');
  },
};

hud = new Hud(handlers);
renderLegend();
renderer.drawBackground(game);
hud.setMessage('Baue Tuerme entlang des Weges und starte dann die erste Welle.');

let accumulator = 0;
let last = performance.now();

function frame(now) {
  const elapsed = Math.min(0.25, (now - last) / 1000);
  last = now;

  const running = !view.paused && game.status !== Status.GAMEOVER;
  if (running) {
    accumulator += elapsed * view.speed;
    let steps = 0;
    while (accumulator >= FIXED_DT && steps < MAX_STEPS_PER_FRAME * view.speed) {
      step(game, FIXED_DT);
      accumulator -= FIXED_DT;
      steps += 1;
    }
    if (accumulator > FIXED_DT * 10) accumulator = 0;
  }

  for (const event of drainEvents(game)) {
    renderer.addEffect(event);
    if (event.type === 'waveEnd') {
      saveBest(event.wave);
      hud.setMessage(`Welle ${event.wave} ueberstanden. +${event.bounty} Gold.`, 'good');
    }
    if (event.type === 'waveStart' && event.boss) {
      hud.setMessage('Ein Kriegsfuerst ruecht an!', 'warn');
    }
    if (event.type === 'gameover') {
      saveBest(Math.max(0, event.wave - 1));
    }
  }

  renderer.updateEffects(elapsed);
  if (view.buildType && view.hoverTile >= 0) {
    view.canBuildHere = canBuild(game, view.hoverTile, view.buildType);
  }
  renderer.render(game, view);
  hud.update(game, view);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
