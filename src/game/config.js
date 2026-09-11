// Zentrale Balance-Werte. Alles Spielgefuehl laesst sich hier justieren,
// ohne Logik anzufassen.

export const ECONOMY = {
  startGold: 260,
  startLives: 20,
  sellRatio: 0.6,
  buildTimeout: 0, // 0 = Welle startet nur per Klick
};

/** Goldbonus nach einer ueberstandenen Welle. */
export function waveBounty(wave) {
  return 20 + 5 * wave;
}

export const TOWERS = {
  archer: {
    key: 'archer',
    name: 'Bogenturm',
    hotkey: '1',
    color: '#8ab861',
    accent: '#e8efd8',
    cost: 50,
    damageType: 'physical',
    desc: 'Schnelle Einzelschuesse. Guenstig, zuverlaessig, schwach gegen Ruestung.',
    levels: [
      { damage: 9, rate: 1.25, range: 3.0, projectileSpeed: 460, upgradeCost: 70 },
      { damage: 15, rate: 1.45, range: 3.2, projectileSpeed: 490, upgradeCost: 120 },
      { damage: 24, rate: 1.7, range: 3.5, projectileSpeed: 520, upgradeCost: null },
    ],
  },
  cannon: {
    key: 'cannon',
    name: 'Kanone',
    hotkey: '2',
    color: '#c2703d',
    accent: '#ffd9a8',
    cost: 110,
    damageType: 'physical',
    desc: 'Langsame Salven mit Flaechenschaden. Bricht Ruestung und Gruppen.',
    levels: [
      { damage: 26, rate: 0.55, range: 2.8, projectileSpeed: 260, splash: 0.9, upgradeCost: 140 },
      { damage: 40, rate: 0.6, range: 3.0, projectileSpeed: 280, splash: 1.05, upgradeCost: 220 },
      { damage: 62, rate: 0.65, range: 3.2, projectileSpeed: 300, splash: 1.2, upgradeCost: null },
    ],
  },
  frost: {
    key: 'frost',
    name: 'Frostturm',
    hotkey: '3',
    color: '#5aa9d6',
    accent: '#d7f2ff',
    cost: 80,
    damageType: 'magic',
    desc: 'Wenig Schaden, verlangsamt Gegner aber deutlich. Trifft auch Flieger.',
    levels: [
      { damage: 3, rate: 1.0, range: 2.6, projectileSpeed: 420, slow: 0.35, slowTime: 1.6, upgradeCost: 90 },
      { damage: 5, rate: 1.1, range: 2.8, projectileSpeed: 440, slow: 0.45, slowTime: 2.0, upgradeCost: 150 },
      { damage: 8, rate: 1.2, range: 3.0, projectileSpeed: 460, slow: 0.55, slowTime: 2.4, upgradeCost: null },
    ],
  },
  mage: {
    key: 'mage',
    name: 'Magierturm',
    hotkey: '4',
    color: '#9b6ede',
    accent: '#e9dcff',
    cost: 140,
    damageType: 'magic',
    desc: 'Blitze springen auf weitere Gegner ueber und ignorieren Ruestung.',
    levels: [
      { damage: 18, rate: 0.8, range: 3.2, projectileSpeed: 560, chain: 2, chainRange: 2.2, upgradeCost: 180 },
      { damage: 28, rate: 0.9, range: 3.4, projectileSpeed: 580, chain: 3, chainRange: 2.4, upgradeCost: 260 },
      { damage: 42, rate: 1.0, range: 3.6, projectileSpeed: 600, chain: 4, chainRange: 2.6, upgradeCost: null },
    ],
  },
};

export const TOWER_ORDER = ['archer', 'cannon', 'frost', 'mage'];

export const ENEMIES = {
  scout: { key: 'scout', name: 'Spaeher', hp: 45, speed: 2.5, armor: 0, bounty: 6, damage: 1, radius: 9, color: '#d9a441' },
  soldier: { key: 'soldier', name: 'Soldat', hp: 95, speed: 1.7, armor: 2, bounty: 9, damage: 1, radius: 10, color: '#b8503f' },
  knight: { key: 'knight', name: 'Ritter', hp: 210, speed: 1.35, armor: 7, bounty: 17, damage: 2, radius: 11, color: '#9aa2ad' },
  ram: { key: 'ram', name: 'Ramme', hp: 560, speed: 0.9, armor: 5, bounty: 32, damage: 5, radius: 14, color: '#7d5533' },
  dragon: { key: 'dragon', name: 'Drache', hp: 320, speed: 2.0, armor: 3, bounty: 36, damage: 3, radius: 12, color: '#c14fa0', flying: true },
  warlord: { key: 'warlord', name: 'Kriegsfuerst', hp: 2400, speed: 0.85, armor: 10, bounty: 180, damage: 12, radius: 17, color: '#5a3f86', boss: true },
};

/** Statistik eines Turms auf einer bestimmten Stufe (1-basiert). */
export function towerStats(type, level) {
  const def = TOWERS[type];
  if (!def) throw new Error(`Unbekannter Turmtyp: ${type}`);
  const idx = Math.min(Math.max(level, 1), def.levels.length) - 1;
  return { ...def.levels[idx], damageType: def.damageType, maxLevel: def.levels.length };
}

/** Kosten fuer den naechsten Ausbau, oder null wenn die Endstufe erreicht ist. */
export function upgradeCost(type, level) {
  const def = TOWERS[type];
  if (!def || level >= def.levels.length) return null;
  return def.levels[level - 1].upgradeCost;
}

/** Gesamtwert eines Turms - Basis plus alle bezahlten Ausbaustufen. */
export function towerInvestment(type, level) {
  const def = TOWERS[type];
  let total = def.cost;
  for (let l = 1; l < level; l++) total += def.levels[l - 1].upgradeCost;
  return total;
}
