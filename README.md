# Castle Master

Ein Burgverteidigungsspiel im Browser. Du baust Türme rund um einen Bergfried
und hältst Welle für Welle an Angreifern auf. Türme versperren dabei den Weg,
also entscheidest du mit jedem Bauplatz auch, welche Route die Gegner nehmen.

Läuft ohne Build-Schritt und ohne Abhängigkeiten: reines HTML, CSS und
JavaScript mit ES-Modulen auf einem Canvas.

## Starten

```bash
npm start          # http://localhost:5173
```

Der Dev-Server ist ein kleines Node-Skript, `npm install` ist nicht nötig.
Ein direkter Doppelklick auf `index.html` funktioniert nicht, weil Browser
ES-Module über `file://` blockieren.

```bash
npm test           # 39 Tests der Spiellogik, ohne Browser
```

## Spielprinzip

Zwei Tore am linken Rand, ein Bergfried rechts. Gegner laufen immer den
kürzesten freien Weg. Jeder Turm blockiert sein Feld, verlängert also die
Strecke. Den letzten Weg komplett zumauern geht nicht, das Spiel lehnt
solche Bauplätze ab.

| Turm | Kosten | Rolle |
| --- | --- | --- |
| Bogenturm | 50 | schnelle Einzelziele, schwach gegen Rüstung |
| Kanone | 110 | Flächenschaden, gut gegen Gruppen und Rüstung |
| Frostturm | 80 | verlangsamt, wenig Schaden, trifft auch Flieger |
| Magierturm | 140 | Blitze springen weiter, ignorieren Rüstung |

Jeder Turm hat drei Stufen. Verkaufen gibt 60 Prozent des investierten Goldes
zurück.

Gegner unterscheiden sich in Tempo, Rüstung und Schaden am Bergfried. Ritter
und Kriegsfürsten haben viel Rüstung, gegen sie hilft magischer Schaden.
Drachen fliegen und ignorieren das Labyrinth komplett, sie nehmen den direkten
Weg zum Bergfried.

Welle 10 ist die erste Bosswelle, danach kommt alle zehn Wellen eine weitere.
Ab Welle 11 werden die Wellen prozedural erzeugt, das Spiel endet also nicht.

## Steuerung

| Eingabe | Wirkung |
| --- | --- |
| `1`–`4` | Turmtyp wählen, Linksklick setzt ihn |
| Rechtsklick / `Esc` | Auswahl aufheben |
| Klick auf Turm | Turm auswählen |
| `U` / `X` | ausbauen / verkaufen |
| `Leertaste` | Welle starten, während einer Welle pausieren |
| `F` / `P` | Geschwindigkeit (1x/2x/3x) / Pause |
| `R` | nach der Niederlage neu starten |

## Aufbau des Codes

```
index.html          Seitengerüst und Oberfläche
styles.css          Gestaltung
src/
  main.js           Spielschleife, Eingabe, Verdrahtung
  game/             reine Spiellogik, läuft auch ohne Browser
    constants.js    Feldgröße und Feldtypen
    map.js          Karte als ASCII, wird zum Gitter geparst
    pathfinding.js  Flow-Field per Breitensuche, Bau-Prüfung
    config.js       sämtliche Balance-Werte
    waves.js        Wellen, skriptet und prozedural
    combat.js       Schadensformeln
    game.js         Zustand und Simulationsschritt
  render/renderer.js Canvas-Darstellung und Effekte
  ui/hud.js         Anzeige und Bedienelemente
tests/              Tests der Spiellogik mit node:test
scripts/serve.js    statischer Dev-Server
```

Der Ordner `game/` kennt weder `document` noch `window`. Deshalb lässt sich
eine komplette Partie im Test simulieren, ohne einen Browser zu starten. Die
Oberfläche liest den Zustand nur und meldet Absichten über Rückrufe zurück,
sie verändert ihn nie selbst.

### Wegfindung

Eine Breitensuche startet beim Bergfried und läuft über alle begehbaren
Felder. Jedes Feld merkt sich den Abstand zum Ziel und das nächste Feld auf
dem kürzesten Weg. Alle Gegner folgen diesem einen Feld, das spart pro Gegner
eine eigene Suche. Vor jedem Bau wird das Feld testweise gesperrt und die
Suche wiederholt: Erreicht danach ein Tor den Bergfried nicht mehr, ist der
Bau nicht erlaubt.

### Simulation

Die Schleife läuft mit fester Schrittweite von 1/60 Sekunde, unabhängig von
der Bildrate. Der Geschwindigkeitsschalter führt einfach mehr Schritte pro
Bild aus. Effekte wie Funken und Goldanzeigen entstehen aus Ereignissen, die
die Logik meldet, damit die Darstellung nichts über den Spielablauf wissen
muss.

## Balance anpassen

Alle Zahlen zu Türmen, Gegnern und Wirtschaft stehen in
`src/game/config.js`, die Wellen in `src/game/waves.js`. Die Karte ist die
ASCII-Liste `MAP_ROWS` in `src/game/map.js`: `#` ist Fels, `.` ein freies
Feld, `S` ein Tor, `K` der Bergfried.

## Nächste Schritte

- Ton: Schüsse, Treffer, Wellenbeginn
- mehrere Karten und eine Kartenauswahl
- Held oder Zauber mit Abklingzeit als aktives Element
- Spielstand speichern und fortsetzen
- Bestenliste über mehrere Läufe
