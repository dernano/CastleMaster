import { CANVAS_H, CANVAS_W, TILE, Tile } from '../game/constants.js';
import { TOWERS, towerStats } from '../game/config.js';
import { tileCenter } from '../game/game.js';

const PALETTE = {
  grassA: '#3f5f3a',
  grassB: '#476a41',
  grassC: '#395636',
  rock: '#4a4741',
  rockTop: '#5d5951',
  buildable: 'rgba(255,255,255,0.05)',
  route: 'rgba(255, 228, 160, 0.16)',
};

/** Stabiler Pseudo-Zufall pro Feld, damit der Hintergrund nicht flimmert. */
function tileNoise(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    this.background = document.createElement('canvas');
    this.background.width = CANVAS_W;
    this.background.height = CANVAS_H;
    this.particles = [];
    this.floaters = [];
    this.beams = [];
    this.shake = 0;
    this.backgroundDrawn = false;
  }

  drawBackground(game) {
    const ctx = this.background.getContext('2d');
    const { grid } = game;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const idx = y * grid.width + x;
        const type = grid.tiles[idx];
        const n = tileNoise(x, y);
        const px = x * TILE;
        const py = y * TILE;

        if (type === Tile.ROCK) {
          ctx.fillStyle = PALETTE.rock;
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = PALETTE.rockTop;
          ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 8);
          ctx.fillStyle = 'rgba(0,0,0,0.18)';
          ctx.fillRect(px + 4 + n * 10, py + 8 + n * 8, 6, 5);
        } else {
          ctx.fillStyle = n < 0.33 ? PALETTE.grassA : n < 0.72 ? PALETTE.grassB : PALETTE.grassC;
          ctx.fillRect(px, py, TILE, TILE);
          if (n > 0.9) {
            ctx.fillStyle = 'rgba(140, 180, 120, 0.35)';
            ctx.fillRect(px + 12, py + 22, 3, 6);
            ctx.fillRect(px + 22, py + 16, 3, 7);
          }
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      }
    }
    this.backgroundDrawn = true;
  }

  addEffect(event) {
    switch (event.type) {
      case 'hit':
        this.spawnParticles(event.x, event.y, 4, event.damageType === 'magic' ? '#cfa8ff' : '#ffe6b0', 60);
        break;
      case 'kill':
        this.spawnParticles(event.x, event.y, 12, event.color || '#ffd580', 110);
        this.floaters.push({ x: event.x, y: event.y, text: `+${event.bounty}`, color: '#ffd166', life: 0.9, max: 0.9 });
        if (event.boss) this.shake = Math.max(this.shake, 8);
        break;
      case 'explosion':
        this.spawnParticles(event.x, event.y, 18, '#ffb057', 150);
        this.beams.push({ kind: 'ring', x: event.x, y: event.y, radius: event.radius, life: 0.3, max: 0.3 });
        this.shake = Math.max(this.shake, 3);
        break;
      case 'chain':
        this.beams.push({ kind: 'line', x1: event.x1, y1: event.y1, x2: event.x2, y2: event.y2, life: 0.18, max: 0.18 });
        break;
      case 'leak':
        this.floaters.push({ x: event.x - 20, y: event.y, text: `-${event.damage}`, color: '#ff6b6b', life: 1.1, max: 1.1 });
        this.shake = Math.max(this.shake, 6);
        break;
      case 'build':
        this.spawnParticles(event.x, event.y, 10, '#cfe3ff', 70);
        break;
      case 'sell':
        this.floaters.push({ x: event.x, y: event.y, text: `+${event.refund}`, color: '#9ae6b4', life: 0.9, max: 0.9 });
        break;
      default:
        break;
    }
  }

  spawnParticles(x, y, count, color, speed) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random() * 0.7);
      this.particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0.25 + Math.random() * 0.4,
        max: 0.65,
        color,
        size: 1 + Math.random() * 2.5,
      });
    }
    if (this.particles.length > 600) this.particles.splice(0, this.particles.length - 600);
  }

  updateEffects(dt) {
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 140 * dt;
      p.vx *= 0.96;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    for (const f of this.floaters) {
      f.life -= dt;
      f.y -= 26 * dt;
    }
    this.floaters = this.floaters.filter((f) => f.life > 0);

    for (const b of this.beams) b.life -= dt;
    this.beams = this.beams.filter((b) => b.life > 0);

    this.shake = Math.max(0, this.shake - dt * 24);
  }

  render(game, view) {
    const ctx = this.ctx;
    if (!this.backgroundDrawn) this.drawBackground(game);

    ctx.save();
    if (this.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }
    ctx.clearRect(-20, -20, CANVAS_W + 40, CANVAS_H + 40);
    ctx.drawImage(this.background, 0, 0);

    this.drawRoutes(ctx, game);
    this.drawKeep(ctx, game);
    this.drawGates(ctx, game);
    this.drawPlacementHint(ctx, game, view);
    this.drawTowers(ctx, game, view);
    this.drawEnemies(ctx, game);
    this.drawProjectiles(ctx, game);
    this.drawBeams(ctx);
    this.drawParticles(ctx);
    this.drawFloaters(ctx);
    ctx.restore();
  }

  drawRoutes(ctx, game) {
    ctx.save();
    ctx.strokeStyle = PALETTE.route;
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash([10, 12]);
    for (const route of game.routes) {
      if (route.length < 2) continue;
      ctx.beginPath();
      route.forEach((idx, i) => {
        const c = tileCenter(game.grid, idx);
        if (i === 0) ctx.moveTo(c.x, c.y);
        else ctx.lineTo(c.x, c.y);
      });
      ctx.stroke();
    }
    ctx.restore();
  }

  drawGates(ctx, game) {
    for (const spawn of game.grid.spawns) {
      const c = tileCenter(game.grid, spawn);
      ctx.fillStyle = '#2a2119';
      ctx.fillRect(c.x - TILE / 2, c.y - TILE / 2, TILE, TILE);
      ctx.fillStyle = '#1a1410';
      ctx.beginPath();
      ctx.arc(c.x, c.y + 4, TILE * 0.34, Math.PI, 0);
      ctx.rect(c.x - TILE * 0.34, c.y + 4, TILE * 0.68, TILE * 0.3);
      ctx.fill();
      ctx.strokeStyle = '#6b5844';
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x - TILE / 2 + 2, c.y - TILE / 2 + 2, TILE - 4, TILE - 4);
    }
  }

  drawKeep(ctx, game) {
    const c = game.keepPos;
    const s = TILE * 0.46;
    ctx.save();
    ctx.fillStyle = '#6f6a60';
    ctx.fillRect(c.x - s, c.y - s, s * 2, s * 2);
    ctx.fillStyle = '#847d71';
    ctx.fillRect(c.x - s, c.y - s, s * 2, s * 0.5);
    ctx.fillStyle = '#4c4841';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(c.x - s + i * (s * 0.72) + 2, c.y - s - 5, s * 0.42, 6);
    }
    ctx.fillStyle = '#2b2722';
    ctx.fillRect(c.x - 5, c.y - 2, 10, s);

    // Lebensanzeige des Bergfrieds als Banner
    const ratio = Math.max(0, game.lives) / 20;
    ctx.fillStyle = '#20242c';
    ctx.fillRect(c.x - s, c.y + s + 3, s * 2, 4);
    ctx.fillStyle = ratio > 0.5 ? '#63d17a' : ratio > 0.25 ? '#e8c15a' : '#e4635a';
    ctx.fillRect(c.x - s, c.y + s + 3, s * 2 * Math.min(1, ratio), 4);
    ctx.restore();
  }

  drawPlacementHint(ctx, game, view) {
    if (!view.buildType || view.hoverTile < 0) return;
    const c = tileCenter(game.grid, view.hoverTile);
    const stats = towerStats(view.buildType, 1);
    const ok = view.canBuildHere;

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = ok ? 'rgba(120, 220, 140, 0.25)' : 'rgba(230, 90, 90, 0.25)';
    ctx.fillRect(c.x - TILE / 2, c.y - TILE / 2, TILE, TILE);
    ctx.strokeStyle = ok ? '#7de39a' : '#e46b6b';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x - TILE / 2 + 1, c.y - TILE / 2 + 1, TILE - 2, TILE - 2);

    ctx.beginPath();
    ctx.arc(c.x, c.y, stats.range * TILE, 0, Math.PI * 2);
    ctx.fillStyle = ok ? 'rgba(125, 227, 154, 0.08)' : 'rgba(228, 107, 107, 0.08)';
    ctx.fill();
    ctx.strokeStyle = ok ? 'rgba(125, 227, 154, 0.5)' : 'rgba(228, 107, 107, 0.5)';
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.restore();
  }

  drawTowers(ctx, game, view) {
    for (const t of game.towers) {
      const def = TOWERS[t.type];
      const stats = towerStats(t.type, t.level);
      const selected = view.selectedTowerId === t.id;

      if (selected) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(t.x, t.y, stats.range * TILE, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(-TILE * 0.4, -TILE * 0.28, TILE * 0.8, TILE * 0.78);
      ctx.fillStyle = '#3b3a36';
      ctx.fillRect(-TILE * 0.38, -TILE * 0.3, TILE * 0.76, TILE * 0.72);
      ctx.fillStyle = def.color;
      ctx.fillRect(-TILE * 0.3, -TILE * 0.34, TILE * 0.6, TILE * 0.56);
      ctx.fillStyle = def.accent;
      ctx.fillRect(-TILE * 0.3, -TILE * 0.34, TILE * 0.6, 4);

      ctx.rotate(t.angle);
      ctx.fillStyle = '#242220';
      ctx.fillRect(0, -3, TILE * 0.44, 6);
      ctx.fillStyle = t.flash > 0 ? '#fff3c4' : def.accent;
      ctx.fillRect(TILE * 0.3, -4, 8, 8);
      ctx.restore();

      for (let i = 0; i < t.level; i++) {
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(t.x - 9 + i * 7, t.y + TILE * 0.32, 5, 4);
      }
    }
  }

  drawEnemies(ctx, game) {
    for (const e of game.enemies) {
      const r = e.radius;
      if (e.flying) {
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(e.x, e.y + 14, r * 0.8, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      const bob = e.flying ? Math.sin(game.time * 6 + e.phase) * 3 : 0;
      const y = e.y + bob - (e.flying ? 8 : 0);

      if (e.flying) {
        ctx.fillStyle = 'rgba(200,120,190,0.55)';
        const wing = Math.sin(game.time * 14 + e.phase) * r * 0.6;
        ctx.beginPath();
        ctx.moveTo(e.x, y);
        ctx.lineTo(e.x - r * 1.6, y - wing);
        ctx.lineTo(e.x - r * 0.4, y + r * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.x, y);
        ctx.lineTo(e.x + r * 1.6, y - wing);
        ctx.lineTo(e.x + r * 0.4, y + r * 0.4);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = e.def.color;
      ctx.beginPath();
      ctx.arc(e.x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (e.armor >= 5) {
        ctx.strokeStyle = 'rgba(225,232,245,0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(e.x, y, r - 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (e.slowTimer > 0) {
        ctx.fillStyle = 'rgba(130, 200, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(e.x, y, r + 2, 0, Math.PI * 2);
        ctx.fill();
      }

      const w = Math.max(18, r * 2);
      const ratio = e.hp / e.maxHp;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(e.x - w / 2, y - r - 9, w, 4);
      ctx.fillStyle = ratio > 0.5 ? '#6fdc8c' : ratio > 0.25 ? '#ecc94b' : '#f56565';
      ctx.fillRect(e.x - w / 2, y - r - 9, w * ratio, 4);
    }
  }

  drawProjectiles(ctx, game) {
    for (const p of game.projectiles) {
      const def = TOWERS[p.towerType];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle || 0);
      if (p.towerType === 'cannon') {
        ctx.fillStyle = '#2f2a26';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.towerType === 'mage') {
        ctx.fillStyle = def.accent;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(180,140,255,0.4)';
        ctx.fillRect(-10, -2, 10, 4);
      } else if (p.towerType === 'frost') {
        ctx.fillStyle = def.accent;
        ctx.fillRect(-4, -2, 8, 4);
      } else {
        ctx.fillStyle = '#f0e2bd';
        ctx.fillRect(-7, -1.5, 12, 3);
      }
      ctx.restore();
    }
  }

  drawBeams(ctx) {
    for (const b of this.beams) {
      const a = b.life / b.max;
      ctx.save();
      if (b.kind === 'line') {
        ctx.strokeStyle = `rgba(200, 170, 255, ${a})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        ctx.lineTo(b.x2, b.y2);
        ctx.stroke();
      } else {
        ctx.strokeStyle = `rgba(255, 180, 100, ${a * 0.8})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * (1.2 - a * 0.5), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  drawFloaters(ctx) {
    ctx.save();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (const f of this.floaters) {
      ctx.globalAlpha = Math.min(1, f.life / f.max);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText(f.text, f.x + 1, f.y + 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.restore();
  }
}
