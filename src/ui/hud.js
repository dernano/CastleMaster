import { ECONOMY, ENEMIES, TOWERS, TOWER_ORDER, towerStats, upgradeCost } from '../game/config.js';
import { Status } from '../game/game.js';
import { describeWave } from '../game/waves.js';

const $ = (id) => document.getElementById(id);

/**
 * Die Oberflaeche liest nur den Spielzustand und meldet Absichten
 * ueber Rueckrufe zurueck. Sie veraendert den Zustand nie selbst.
 */
export class Hud {
  constructor(handlers) {
    this.handlers = handlers;
    this.lastSignature = '';
    this.buildButtons = new Map();
    this.buildMenu = $('build-menu');
    this.renderBuildMenu();
    this.bindStaticControls();
  }

  renderBuildMenu() {
    this.buildMenu.innerHTML = '';
    for (const key of TOWER_ORDER) {
      const def = TOWERS[key];
      const stats = towerStats(key, 1);
      const button = document.createElement('button');
      button.className = 'build-card';
      button.type = 'button';
      button.dataset.tower = key;
      button.innerHTML = `
        <span class="swatch" style="--swatch:${def.color}"></span>
        <span class="build-body">
          <span class="build-title"><strong>${def.name}</strong><em>${def.hotkey}</em></span>
          <span class="build-stats">${stats.damage} Schaden · ${stats.range.toFixed(1)} Reichweite</span>
          <span class="build-desc">${def.desc}</span>
        </span>
        <span class="price">${def.cost}</span>`;
      button.addEventListener('click', () => this.handlers.onSelectBuild(key));
      this.buildMenu.appendChild(button);
      this.buildButtons.set(key, button);
    }
  }

  bindStaticControls() {
    $('wave-button').addEventListener('click', () => this.handlers.onStartWave());
    $('speed-button').addEventListener('click', () => this.handlers.onToggleSpeed());
    $('pause-button').addEventListener('click', () => this.handlers.onTogglePause());
    $('upgrade-button').addEventListener('click', () => this.handlers.onUpgrade());
    $('sell-button').addEventListener('click', () => this.handlers.onSell());
    $('restart-button').addEventListener('click', () => this.handlers.onRestart());
  }

  setMessage(text, tone = 'info') {
    const el = $('message');
    el.textContent = text || '';
    el.dataset.tone = tone;
  }

  update(game, view) {
    $('stat-gold').textContent = game.gold;
    $('stat-lives').textContent = game.lives;
    $('stat-wave').textContent = game.wave;
    $('stat-kills').textContent = game.stats.killed;
    $('stat-best').textContent = view.best;

    const remaining = game.spawnQueue.length + game.enemies.length;
    $('stat-remaining').textContent = game.status === Status.WAVE ? remaining : '-';

    const running = game.status === Status.WAVE;
    const nextWave = game.wave + 1;
    $('wave-heading').textContent = running ? `Welle ${game.wave} laeuft` : 'Naechste Welle';
    $('wave-preview').textContent = running
      ? describeWave(game.wave)
      : `Welle ${nextWave}: ${describeWave(nextWave)}`;

    const waveButton = $('wave-button');
    waveButton.disabled = game.status !== Status.BUILDING;
    waveButton.textContent =
      game.status === Status.GAMEOVER
        ? 'Partie beendet'
        : running
          ? `Welle ${game.wave} laeuft`
          : `Welle ${nextWave} starten`;

    $('speed-button').textContent = `${view.speed}x`;
    $('pause-button').textContent = view.paused ? 'Weiter' : 'Pause';
    $('pause-button').classList.toggle('active', view.paused);

    for (const [key, button] of this.buildButtons) {
      const def = TOWERS[key];
      button.classList.toggle('selected', view.buildType === key);
      button.classList.toggle('unaffordable', game.gold < def.cost);
    }

    this.updateSelection(game, view);
    this.updateOverlay(game, view);
  }

  updateSelection(game, view) {
    const panel = $('selection');
    const tower = game.towers.find((t) => t.id === view.selectedTowerId);
    if (!tower) {
      panel.classList.add('hidden');
      return;
    }
    panel.classList.remove('hidden');

    const def = TOWERS[tower.type];
    const stats = towerStats(tower.type, tower.level);
    const cost = upgradeCost(tower.type, tower.level);
    const next = cost === null ? null : towerStats(tower.type, tower.level + 1);

    $('selection-title').textContent = `${def.name} · Stufe ${tower.level}`;
    $('selection-stats').innerHTML = [
      row('Schaden', stats.damage, next && next.damage),
      row('Schuss/s', stats.rate.toFixed(2), next && next.rate.toFixed(2)),
      row('Reichweite', stats.range.toFixed(1), next && next.range.toFixed(1)),
      stats.splash ? row('Radius', stats.splash.toFixed(2), next && next.splash.toFixed(2)) : '',
      stats.slow ? row('Verlangsamung', `${Math.round(stats.slow * 100)} %`, next && `${Math.round(next.slow * 100)} %`) : '',
      stats.chain ? row('Spruenge', stats.chain, next && next.chain) : '',
      row('Abschuesse', tower.kills, null),
      row('Schaden gesamt', Math.round(tower.damageDealt), null),
    ].join('');

    const upgradeButton = $('upgrade-button');
    if (cost === null) {
      upgradeButton.disabled = true;
      upgradeButton.textContent = 'Endstufe erreicht';
    } else {
      upgradeButton.disabled = game.gold < cost;
      upgradeButton.textContent = `Ausbauen (${cost})`;
    }
    $('sell-button').textContent = `Verkaufen (+${Math.floor(tower.invested * ECONOMY.sellRatio)})`;
  }

  updateOverlay(game, view) {
    const overlay = $('overlay');
    if (game.status !== Status.GAMEOVER) {
      overlay.classList.add('hidden');
      return;
    }
    overlay.classList.remove('hidden');
    $('overlay-title').textContent = 'Die Burg ist gefallen';
    $('overlay-text').innerHTML = `
      Du hast <strong>${game.wave - 1}</strong> Wellen ueberstanden.<br>
      ${game.stats.killed} Gegner besiegt · ${game.stats.leaked} durchgelassen<br>
      Bester Lauf: <strong>${view.best}</strong> Wellen`;
  }
}

function row(label, value, nextValue) {
  const arrow = nextValue !== null && nextValue !== undefined && String(nextValue) !== String(value)
    ? ` <span class="next">&rarr; ${nextValue}</span>`
    : '';
  return `<div class="stat-row"><span>${label}</span><span>${value}${arrow}</span></div>`;
}

/** Kurzuebersicht der Gegnertypen fuer die Legende. */
export function renderLegend() {
  const el = document.getElementById('legend');
  el.innerHTML = Object.values(ENEMIES)
    .map(
      (e) => `<span class="legend-item"><i style="--c:${e.color}"></i>${e.name}${e.flying ? ' (Flieger)' : ''}</span>`,
    )
    .join('');
}
