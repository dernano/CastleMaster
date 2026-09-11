import test from 'node:test';
import assert from 'node:assert/strict';
import { ENEMIES } from '../src/game/config.js';
import { describeWave, getWave, waveArmorBonus, waveHpMultiplier } from '../src/game/waves.js';

test('die ersten 60 Wellen sind gueltig und nicht leer', () => {
  for (let w = 1; w <= 60; w++) {
    const wave = getWave(w);
    assert.ok(wave.total > 0, `Welle ${w} hat keine Gegner`);
    for (const group of wave.groups) {
      assert.ok(ENEMIES[group.type], `Welle ${w}: unbekannter Typ`);
      assert.ok(group.count > 0 && group.interval > 0);
      assert.ok(group.delay >= 0);
    }
  }
});

test('Wellen werden mit der Zeit groesser', () => {
  assert.ok(getWave(20).total > getWave(5).total);
  assert.ok(waveHpMultiplier(20) > waveHpMultiplier(5));
});

test('Welle 10 ist eine Bosswelle', () => {
  assert.equal(getWave(10).isBoss, true);
  assert.equal(getWave(9).isBoss, false);
  assert.equal(getWave(20).isBoss, true);
});

test('Ruestungsbonus greift erst spaet', () => {
  assert.equal(waveArmorBonus(10), 0);
  assert.equal(waveArmorBonus(20), 0);
  assert.ok(waveArmorBonus(30) > 0);
});

test('Wellenbeschreibung nennt Gegnernamen', () => {
  assert.match(describeWave(1), /Spaeher/);
});

test('Wellennummer 0 wird abgelehnt', () => {
  assert.throws(() => getWave(0));
});
