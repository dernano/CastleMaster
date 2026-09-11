# Castle Master

Ein rundenbasiertes Deckbuilding-Kartenspiel im Browser. Du errichtest Türme
auf einem Raster, besetzt sie mit Einheiten und hältst damit einen Gegner von
deiner Burg fern. Die Kartenfarben folgen dem doppeldeutschen Blatt.

Grundlage ist Prototyp v2 aus dem Chat, erweitert um ein echtes Deck und um
gezielte Angriffe. Die Darstellung ist eine isometrische Pixel-Ansicht.

## Starten

```bash
npm start          # http://localhost:5173
```

Kein `npm install` nötig, das Projekt hat keine Abhängigkeiten. Der Dev-Server
ist ein kleines Node-Skript. Ein Doppelklick auf `index.html` funktioniert
ebenfalls, weil alles in einer Datei steckt.

## Spielfeld

Ein Raster von 20 mal 15 Feldern als Testgröße, angepeilt sind später 80 mal
60. Die Burg steht links am Wasser und hat 20 Lebenspunkte. Der Gegner
erscheint rechts.

Türme belegen zwei mal zwei Felder und werden frei platziert. Beim Setzen einer
Gebäude-Karte zeigt eine Vorschau, ob die Stelle frei ist. Jeder Turm hat eigene
Lebenspunkte und mindestens einen Platz für eine Einheit.

## Darstellung

Die Ansicht ist isometrisch und wird vollständig im Code gezeichnet, ohne
Bilddateien. Boden, Wasser, Mauern, Zinnen, Palmen und Felsen entstehen aus
Rauten und Quadern, die Figuren aus kleinen Pixelrastern. Auch die Bilder auf
den Karten werden zur Laufzeit gemalt.

Damit hat das Projekt weiterhin keine Abhängigkeiten und besteht aus einer
einzigen Datei. Die Grenze ist die Zeichenfläche: handgezeichnete Pixelgrafik
mit vielen Einzelbildern sieht reicher aus als alles, was sich sinnvoll aus
Rechtecken bauen lässt.

Abstände werden über die größere der beiden Achsen gemessen. Reichweiten
erscheinen deshalb als markierte Felder, nicht als Kreis.

## Kartenfarben und Typen

| Farbe | Typ | Wirkung |
| --- | --- | --- |
| 🌰 Eichel | Gebäude | Turm auf ein freies Feld, bringt eigene Lebenspunkte mit |
| ❤ Herz | Einheit | besetzt einen Turmplatz, hat Schaden und Reichweite |
| 🍃 Blatt | Fähigkeit | verstärkt eine Einheit um 1 Schaden |
| 🔔 Schellen | Macht | globaler Effekt, gibt allen Türmen einen Platz |

| Karte | Typ | Kosten | Werte |
| --- | --- | --- | --- |
| Wachturm | Gebäude | 2 | 6 Turm-LP |
| Palisade | Gebäude | 1 | 3 Turm-LP |
| Waldläufer | Einheit | 1 | 2 Schaden, Reichweite 3 |
| Bogenschütze | Einheit | 2 | 3 Schaden, Reichweite 5 |
| Sturmwind | Fähigkeit | 1 | +1 Schaden auf eine Einheit |
| Krone der Belagerung | Macht | 3 | ein Platz für jeden Turm |

## Rundenablauf

`Tatendrang` ist die Ressource, drei Punkte pro Runde. Karten kosten davon,
und Angriffe ebenfalls.

Der eigene Zug läuft wie in Slay the Spire: Du gibst Tatendrang aus, solange
du willst, und beendest dann die Runde. Erst danach handelt der Gegner.

`Runde beenden` löst zuerst den Gegnerzug aus: Der Gegner rückt bis zu vier
Felder auf das nächstgelegene Ziel vor, sonst auf die Burg, und greift an,
sobald er daneben steht. Eine Einheit auf dem angegriffenen Turm schlägt zurück.
Fällt ein Turm, verschwindet er samt Besatzung. Fällt die Burg auf null, ist die
Partie vorbei.

Danach wandert die restliche Hand auf den Ablagestapel, der Tatendrang wird
aufgefüllt und fünf Karten werden nachgezogen. Die Absichtszeile über dem Feld
kündigt an, was der Gegner als Nächstes vorhat.

## Angreifen

Einheiten schießen nicht von selbst. Du setzt sie im eigenen Zug gezielt auf
den Gegner an:

1. Eine Einheit auf einem Turm anklicken. Ihre Reichweite wird auf dem Boden
   markiert, der Gegner bekommt einen Ring: grün heißt in Reichweite, rot heißt
   zu weit weg oder zu wenig Tatendrang.
2. Den Gegner anklicken. Er nimmt den Schaden der Einheit.

Ein Angriff kostet 1 Tatendrang, festgelegt als `ATTACK_COST`. Der Tatendrang
ist die einzige Grenze, eine Einheit kann in derselben Runde also mehrfach
angreifen, solange du bezahlst. Damit steht jede Runde dieselbe Frage: bauen
oder schießen.

Steht auf einem Turm mehr als eine Einheit, wechselt ein zweiter Klick auf
denselben Turm zur nächsten. `Esc` hebt jede Auswahl auf.

Zusätzlich schlägt eine Einheit weiterhin automatisch zurück, wenn der Gegner
ihren Turm angreift. Das stammt aus v2 und ist unangetastet geblieben.

## Deck

Das Deck besteht aus zwölf Karten und zirkuliert wie in einem klassischen
Deckbuilder. Gespielte und am Rundenende übrige Karten wandern auf den
Ablagestapel. Ist der Nachziehstapel leer, wird die Ablage gemischt und wird
zum neuen Nachziehstapel. Karten gehen nie verloren, die Summe aus
Nachziehstapel, Hand und Ablage ist immer zwölf.

| Karte | Anzahl im Startdeck |
| --- | --- |
| Palisade | 3 |
| Waldläufer | 3 |
| Wachturm | 2 |
| Bogenschütze | 2 |
| Sturmwind | 1 |
| Krone der Belagerung | 1 |

Handgröße und Startdeck stehen als `HAND_SIZE` und `STARTER_DECK` oben im
Skript.

## Was noch fehlt

- **Kein Deckbuilding.** Das Deck zirkuliert, lässt sich während einer Partie
  aber nicht verändern. Es fehlt eine Möglichkeit, Karten zu erwerben.
- **Kein Sieg.** Gegner erscheinen endlos, einer nach dem anderen. Verlieren
  kann man, gewinnen nicht.
- **Nur ein Gegnertyp** mit festen Werten, ohne Wellen oder Steigerung.
- **Keine Meldung beim Vorrücken.** Zieht der Gegner nur, bleibt die
  Meldungszeile leer. Die Absichtszeile deckt das ab.

## Aufbau

Alles steckt in `index.html`: Stil, Aufbau und Logik. Wichtige Stellen im
Skript sind `CARD_POOL` für die Karten, `STARTER_DECK` für das Startdeck,
`state` für den Spielzustand mit den Stapeln `draw`, `hand` und `discard`,
`handleSelectionClick` und `attackEnemy` für das Angreifen und
`resolveEnemyTurn` für den Gegnerzug.

Für die Darstellung sind `isoX` und `isoY` die Umrechnung aufs Raster,
`cellFromPoint` die Umkehrung für Klicks, `drawBlock` und `drawMerlons` die
Bausteine für Mauerwerk, `drawSprite` die Pixelfiguren und `paintCardArt` die
Bilder auf den Karten.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
