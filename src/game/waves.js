import { ENEMIES } from './config.js';

// Handgebaute Wellen fuer den Einstieg. Danach uebernimmt der Generator.
const SCRIPTED = [
  [{ type: 'scout', count: 6, interval: 0.9 }],
  [{ type: 'scout', count: 10, interval: 0.7 }],
  [{ type: 'soldier', count: 8, interval: 0.9 }],
  [
    { type: 'scout', count: 10, interval: 0.5 },
    { type: 'soldier', count: 6, interval: 0.9, delay: 5 },
  ],
  [{ type: 'soldier', count: 12, interval: 0.7 }],
  [
    { type: 'knight', count: 5, interval: 1.4 },
    { type: 'scout', count: 8, interval: 0.5, delay: 3 },
  ],
  [
    { type: 'scout', count: 16, interval: 0.35 },
    { type: 'knight', count: 4, interval: 1.6, delay: 6 },
  ],
  [
    { type: 'ram', count: 2, interval: 3 },
    { type: 'soldier', count: 10, interval: 0.8, delay: 2 },
  ],
  [
    { type: 'dragon', count: 4, interval: 1.6 },
    { type: 'soldier', count: 8, interval: 0.7, delay: 4 },
  ],
  [
    { type: 'warlord', count: 1, interval: 1 },
    { type: 'knight', count: 6, interval: 1.2, delay: 3 },
  ],
];

/** Lebenspunkte wachsen mit der Wellennummer, jenseits von Welle 25 steiler. */
export function waveHpMultiplier(wave) {
  let mul = 1 + 0.05 * (wave - 1);
  if (wave > 25) mul *= Math.pow(1.06, wave - 25);
  return mul;
}

/** Ab Welle 20 tragen Gegner zusaetzliche Ruestung. */
export function waveArmorBonus(wave) {
  return wave <= 20 ? 0 : Math.floor((wave - 20) / 5) + 1;
}

/** Wellen jenseits der Skriptliste werden nach festen Regeln erzeugt. */
function generateWave(wave) {
  const step = wave - SCRIPTED.length;
  const groups = [];

  if (wave % 10 === 0) {
    groups.push({ type: 'warlord', count: 1 + Math.floor(wave / 20), interval: 4 });
  }
  groups.push({ type: 'soldier', count: 8 + step * 2, interval: 0.55 });
  groups.push({ type: 'knight', count: 3 + Math.floor(step * 0.8), interval: 1.1, delay: 3 });
  if (wave % 3 === 0) {
    groups.push({ type: 'dragon', count: 2 + Math.floor(step / 3), interval: 1.4, delay: 6 });
  }
  if (wave % 4 === 0) {
    groups.push({ type: 'ram', count: 1 + Math.floor(step / 4), interval: 2.6, delay: 8 });
  }
  if (wave % 2 === 1) {
    groups.push({ type: 'scout', count: 12 + step * 2, interval: 0.3, delay: 1.5 });
  }
  return groups;
}

/**
 * Beschreibt eine komplette Welle: welche Gruppen wann und in welchem
 * Takt aus den Toren kommen, plus die Skalierung fuer diese Runde.
 */
export function getWave(wave) {
  if (wave < 1) throw new Error('Wellennummer beginnt bei 1');
  const groups = (wave <= SCRIPTED.length ? SCRIPTED[wave - 1] : generateWave(wave)).map((g) => ({
    delay: 0,
    ...g,
  }));

  for (const g of groups) {
    if (!ENEMIES[g.type]) throw new Error(`Unbekannter Gegnertyp in Welle ${wave}: ${g.type}`);
  }

  return {
    number: wave,
    groups,
    hpMultiplier: waveHpMultiplier(wave),
    armorBonus: waveArmorBonus(wave),
    isBoss: groups.some((g) => ENEMIES[g.type].boss),
    total: groups.reduce((sum, g) => sum + g.count, 0),
  };
}

/** Kurzbeschreibung der Welle fuer die Anzeige, z. B. "12x Soldat, 4x Drache". */
export function describeWave(wave) {
  const counts = new Map();
  for (const g of getWave(wave).groups) {
    counts.set(g.type, (counts.get(g.type) || 0) + g.count);
  }
  return [...counts.entries()].map(([type, n]) => `${n}x ${ENEMIES[type].name}`).join(', ');
}

export const SCRIPTED_WAVES = SCRIPTED.length;
