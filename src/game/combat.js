/**
 * Schadensformel.
 * Physischer Schaden wird durch Ruestung reduziert, magischer ignoriert sie.
 * Es bleibt immer mindestens 1 Schaden uebrig, damit nichts unverwundbar ist.
 */
export function effectiveDamage(amount, armor, damageType = 'physical') {
  if (damageType === 'magic') return Math.max(1, Math.round(amount));
  return Math.max(1, Math.round(amount - armor));
}

/** Splash-Schaden faellt zum Rand des Explosionsradius hin auf 40 % ab. */
export function splashFalloff(distance, radius) {
  if (distance >= radius) return 0;
  const t = distance / radius;
  return 1 - 0.6 * t;
}

/** Deterministischer Zufallsgenerator, damit Wellen reproduzierbar sind. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
