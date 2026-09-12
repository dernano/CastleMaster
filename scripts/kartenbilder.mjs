/*
 * Legt echte Bilder in die Karten.
 *
 * Alles unter bilder/ mit dem Namen einer Karten-Kennung wird verkleinert,
 * als JPEG kodiert und als Datenadresse in den Block KARTEN_BILDER in
 * index.html geschrieben. Damit bleibt das Spiel eine einzige Datei und holt
 * nichts von aussen - die veroeffentlichte Seite darf das naemlich nicht.
 *
 *   bilder/waldlaeufer.png        die Zeichnung allein, wird gespiegelt
 *   bilder/waldlaeufer.ganz.png   bringt beide Haelften und das Band schon mit
 *
 * Ausschnitte stehen in bilder/zuschnitt.json, in Anteilen der Bildkante:
 *   { "waldlaeufer": { "x": 0.06, "y": 0.08, "w": 0.88, "h": 0.46 } }
 *
 * Aufruf:  node scripts/kartenbilder.mjs
 *
 * Verkleinert wird mit dem Browser, den Playwright mitbringt - hier liegt
 * keine Bildbibliothek. Fehlt Playwright, wandert die Datei unveraendert
 * hinein; dann sollte sie von sich aus klein sein.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BILDER = join(WURZEL, 'bilder');
const SEITE = join(WURZEL, 'index.html');

// Das Kartenfeld misst 116 mal 104 Punkte in doppelter Schaerfe.
const BREITE = 232, HOEHE = 208;
const GUETE = 0.82;

const TYPEN = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

async function browserFabrik() {
  // Playwright liegt je nach Rechner woanders. Der Reihe nach durchprobieren.
  const orte = ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs',
                '/usr/lib/node_modules/playwright/index.mjs'];
  try {
    let chromium = null;
    for (const ort of orte) {
      try { ({ chromium } = await import(ort)); break; } catch (e) { /* naechster */ }
    }
    if (!chromium) throw new Error('playwright nicht gefunden');
    const pfad = process.env.CHROMIUM_PFAD || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
    const browser = await chromium.launch(existsSync(pfad) ? { executablePath: pfad } : {});
    const seite = await browser.newPage();
    return { browser, seite };
  } catch (e) {
    console.warn('Playwright fehlt (' + e.message.split('\n')[0] + ') - Bilder wandern unveraendert hinein.');
    return null;
  }
}

/** Verkleinert ein Bild im Browser auf Kartenmass und gibt eine Datenadresse. */
async function verkleinern(seite, quelle, hoehenAnteil, zuschnitt) {
  return seite.evaluate(([quelle, breite, hoehe, guete, zuschnitt]) => new Promise((fertig, schief) => {
    const bild = new Image();
    bild.onerror = () => schief(new Error('Bild nicht lesbar'));
    bild.onload = () => {
      const z = zuschnitt || { x: 0, y: 0, w: 1, h: 1 };
      const qx = bild.naturalWidth * z.x, qy = bild.naturalHeight * z.y;
      const qw = bild.naturalWidth * z.w, qh = bild.naturalHeight * z.h;
      const cv = document.createElement('canvas');
      cv.width = breite; cv.height = hoehe;
      const c = cv.getContext('2d');
      c.imageSmoothingEnabled = true;
      c.imageSmoothingQuality = 'high';
      // deckend einpassen, mittig beschneiden
      const mass = Math.max(breite / qw, hoehe / qh);
      const bw = qw * mass, bh = qh * mass;
      c.drawImage(bild, qx, qy, qw, qh, (breite - bw) / 2, (hoehe - bh) / 2, bw, bh);
      fertig(cv.toDataURL('image/jpeg', guete));
    };
    bild.src = quelle;
  }), [quelle, BREITE, Math.round(HOEHE * hoehenAnteil), GUETE, zuschnitt]);
}

const werkzeug = await browserFabrik();
let zuschnitte = {};
if (existsSync(join(BILDER, 'zuschnitt.json'))) {
  zuschnitte = JSON.parse(await readFile(join(BILDER, 'zuschnitt.json'), 'utf8'));
}

const eintraege = [];
for (const datei of (await readdir(BILDER)).sort()) {
  const treffer = datei.match(/^([a-z0-9]+)(\.ganz)?(\.png|\.jpg|\.jpeg|\.webp)$/i);
  if (!treffer) continue;
  const [, id, ganz, endung] = treffer;
  const art = ganz ? 'ganz' : 'motiv';
  const roh = await readFile(join(BILDER, datei));
  const quelle = 'data:' + TYPEN[endung.toLowerCase()] + ';base64,' + roh.toString('base64');

  let daten = quelle;
  if (werkzeug) {
    // 'motiv' fuellt nur die obere Haelfte, 'ganz' das ganze Feld
    daten = await verkleinern(werkzeug.seite, quelle, art === 'ganz' ? 1 : 0.5, zuschnitte[id]);
  }
  eintraege.push({ id, art, daten, datei, kb: Math.round(daten.length * 0.75 / 1024) });
}
if (werkzeug) await werkzeug.browser.close();

const block = eintraege.length
  ? eintraege.map(e => "  " + e.id + ": { art: '" + e.art + "', daten: '" + e.daten + "' },").join('\n')
  : '  // von scripts/kartenbilder.mjs gefuellt';

const seite = await readFile(SEITE, 'utf8');
const anfang = seite.indexOf('const KARTEN_BILDER = {');
if (anfang < 0) throw new Error('Der Block KARTEN_BILDER steht nicht in index.html.');
const ende = seite.indexOf('\n};\n', anfang);
const neu = seite.slice(0, anfang) + 'const KARTEN_BILDER = {\n' + block + seite.slice(ende);
await writeFile(SEITE, neu);

if (!eintraege.length) {
  console.log('Keine Bilder in bilder/. Der Block wurde geleert.');
} else {
  for (const e of eintraege) console.log(e.datei.padEnd(30) + e.art.padEnd(7) + e.kb + ' KB');
  console.log('Zusammen ' + eintraege.reduce((n, e) => n + e.kb, 0) + ' KB in index.html.');
}
