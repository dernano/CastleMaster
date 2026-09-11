import test from 'node:test';
import assert from 'node:assert/strict';
import { effectiveDamage, mulberry32, splashFalloff } from '../src/game/combat.js';

test('Ruestung senkt physischen Schaden', () => {
  assert.equal(effectiveDamage(20, 7, 'physical'), 13);
});

test('magischer Schaden ignoriert Ruestung', () => {
  assert.equal(effectiveDamage(20, 10, 'magic'), 20);
});

test('Schaden faellt nie unter 1', () => {
  assert.equal(effectiveDamage(3, 99, 'physical'), 1);
});

test('Splash faellt zum Rand hin ab und endet dort', () => {
  assert.equal(splashFalloff(0, 40), 1);
  assert.ok(Math.abs(splashFalloff(20, 40) - 0.7) < 1e-9);
  assert.equal(splashFalloff(40, 40), 0);
  assert.equal(splashFalloff(80, 40), 0);
});

test('Zufallsgenerator ist bei gleichem Startwert reproduzierbar', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});
