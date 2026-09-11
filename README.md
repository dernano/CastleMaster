# Castle Master

Ein rundenbasiertes Deckbuilding-Spiel im Browser, im Aufbau an Slay the Spire
angelehnt. Du errichtest Türme auf einem Raster, besetzt sie mit Einheiten und
hältst damit ein Aufgebot von Angreifern von deiner Burg fern. Überstehst du
eine Runde, suchst du dir eine neue Karte für dein Deck aus.

Die Kartenfarben folgen dem doppeldeutschen Blatt. Die Darstellung ist eine
isometrische Pixel-Ansicht, vollständig im Code gezeichnet.

## Starten

```bash
npm start          # http://localhost:5173
```

Kein `npm install` nötig, das Projekt hat keine Abhängigkeiten. Alles steckt in
`index.html`, ein Doppelklick auf die Datei funktioniert ebenfalls.

## Runden und Züge

Eine **Runde** ist ein ganzer Kampf gegen ein festes Aufgebot. Innerhalb davon
zählen **Züge**: erst handelst du, dann die Gegner.

Das Aufgebot der Runde wartet zu Beginn vollständig im **Lager** rechts neben
dem Spielfeld. Dort sind die Gegner geschützt, du kannst sie nicht angreifen,
siehst aber von Anfang an, was auf dich zukommt. Zug um Zug treten einige von
ihnen aufs Feld.

Hast du alle Gegner einer Runde erschlagen, ist sie überstanden. Dann wählst du
eine von drei Karten für dein Deck, oder überspringst die Auswahl, um das Deck
schlank zu halten. Danach beginnt die nächste Runde mit einem stärkeren
Aufgebot.

Türme, Burgschaden und Deck bleiben über Runden hinweg bestehen. Die Burg heilt
nicht, ihre 35 Lebenspunkte müssen den ganzen Feldzug tragen.

## Bewegung und Darstellung

Das Bild läuft dauerhaft mit rund 60 Bildern je Sekunde. Die Spiellogik bleibt
davon unberührt: Ein Zug gilt sofort, nur die Darstellung läuft nach. Gegner
haben deshalb neben ihrer Rasterposition eine sichtbare Position, die der
logischen hinterherwandert.

Zu sehen sind: Türme wachsen beim Bauen aus dem Boden, schwingen dabei kurz
über ihre Endhöhe hinaus und stauben auf; Zinnen und Dach setzen sich erst zum
Schluss. Dazu gleitende Bewegung statt Springen, Rückstoß beim Schuss,
fliegende Pfeile mit Bogen, Aufblitzen und Zurückweichen des Getroffenen,
aufspringende Schadenszahlen, zusammensackende Gefallene, Staubwolken,
Ausholen beim Zuschlagen, Rütteln der Ansicht bei schweren Treffern, wehende
Fahnen, bewegtes Wasser mit Brandung, ziehende Wolkenschatten, Vögel, Flusen in
der Luft und Rauch über den Lagerfeuern.

Beim Rundenwechsel und nach gewonnener Runde fährt ein Banner über das Bild.
Karten fächern sich beim Nachziehen auf.

## Ton

Alle Geräusche werden zur Laufzeit erzeugt, es kommen keine Klangdateien dazu.
Bogenschuss, Treffer, Turmbau, einstürzender Turm, Schlag gegen die Burg, ein
kleiner Dreiklang nach gewonnener Runde. Der Schalter `♪` oben rechts schaltet
den Ton ab, die Einstellung bleibt gespeichert.

Wer im System weniger Bewegung eingestellt hat, bekommt alles ohne Animation,
die Zahlen und Effekte bleiben lesbar.

Der Boden wird einmal auf eine Zwischenfläche gemalt und danach nur noch
kopiert, das hält die Bildrate stabil.

## Spielfeld

Ein Raster von 20 mal 15 Feldern als Testgröße, angepeilt sind später 80 mal
60. Die Burg steht links am Wasser. Rechts liegt das Lager der Angreifer.

Türme belegen zwei mal zwei Felder und werden frei platziert. Beim Setzen einer
Gebäude-Karte zeigt eine Vorschau, ob die Stelle frei ist. Jeder Turm hat eigene
Lebenspunkte und mindestens einen Platz für eine Einheit.

## Karten

| Farbe | Typ | Wirkung |
| --- | --- | --- |
| 🌰 Eichel | Gebäude | Turm auf ein freies Feld, bringt Lebenspunkte und Reichweite mit |
| ❤ Herz | Einheit | besetzt einen Turmplatz, hat Schaden und Reichweite |
| 🍃 Blatt | Fähigkeit | verstärkt eine Einheit um 1 Schaden |
| 🔔 Schellen | Macht | globaler Effekt, gibt allen Türmen einen Platz |

| Karte | Typ | Kosten | Werte |
| --- | --- | --- | --- |
| Wachturm | Gebäude | 2 | 6 Turm-LP, +2 Reichweite |
| Palisade | Gebäude | 1 | 3 Turm-LP, +1 Reichweite |
| Waldläufer | Einheit | 1 | 2 Schaden, Reichweite 3 |
| Bogenschütze | Einheit | 2 | 3 Schaden, Reichweite 5 |
| Sturmwind | Fähigkeit | 1 | +1 Schaden auf eine Einheit |
| Krone der Belagerung | Macht | 3 | ein Platz für jeden Turm |

Die Höhe des Gebäudes verlängert die Reichweite seiner Besatzung. Ein
Bogenschütze auf einem Wachturm kommt auf 7, auf einer Palisade nur auf 6. Wo
eine Einheit steht, ist deshalb genauso wichtig wie welche Einheit es ist.

## Angreifen

Türme schießen nicht von selbst:

1. Einen Turm anklicken. Seine Reichweite wird auf dem Boden markiert, Gegner
   bekommen einen Ring. Grün heißt in Reichweite, rot heißt zu weit weg,
   bereits geschossen oder zu wenig Tatendrang.
2. Den Gegner anklicken. Er nimmt den Schaden der Salve.

**Ein Schuss pro Turm und Zug**, unabhängig von der Besatzung. Er kostet
1 Tatendrang. Nicht der Tatendrang begrenzt dich also zuerst, sondern die Zahl
deiner besetzten Türme.

**Der Schaden aller Einheiten auf dem Turm summiert sich.** Zwei Bogenschützen
schießen eine Salve über 6 statt über 3. Genau dafür ist die Krone der
Belagerung da. Es zählen dabei nur Einheiten, die selbst weit genug reichen:
Stehen ein Bogenschütze und ein Waldläufer auf einem Wachturm, treffen auf
sieben Felder nur die 3 Schaden des Bogenschützen, auf kurze Entfernung die
vollen 5.

Unter jedem Turm steht die Stärke seiner Salve. Ein ausgegrautes `⚔ –` heißt,
dass er in diesem Zug schon geschossen hat. `Esc` hebt jede Auswahl auf.

## Gegner

| Gegner | LP | Schaden | Bewegung | Reichweite | Ab Runde |
| --- | --- | --- | --- | --- | --- |
| Späher | 4 | 1 | 5 | 1 | 1 |
| Armbrustschütze | 6 | 2 | 2 | 4 | 2 |
| Ritter | 14 | 3 | 3 | 1 | 3 |
| Ramme | 20 | 5 | 2 | 1 | 5 |

Jeder Gegner hat eine eigene Angriffsreichweite. Ein Späher muss bis auf ein
Feld heran, ein Armbrustschütze beschießt deinen Turm aus vier Feldern und
rückt gar nicht erst weiter vor. Gegen ihn hilft nur, ihn zu überreichen.

**Bewegen und Angreifen schließen sich aus.** Wer erst heranrücken muss, kommt
im selben Zug nicht mehr zum Schlag. Du hast also immer einen Zug Zeit zum
Reagieren.

Unter jedem Gegner steht, was er als Nächstes vorhat: `⚔` mit seinem Schaden,
wenn er zuschlägt, `➤` mit seiner Schrittzahl, wenn er vorrückt.

Gegner laufen nicht durch Mauerwerk, sie weichen an Türmen und Burg vorbei.

## Deck

Das Startdeck besteht aus zwölf Karten und zirkuliert wie in einem klassischen
Deckbuilder. Gespielte und am Zugende übrige Karten wandern auf den
Ablagestapel. Ist der Nachziehstapel leer, wird die Ablage gemischt und wird zum
neuen Nachziehstapel.

| Karte | Anzahl im Startdeck |
| --- | --- |
| Palisade | 3 |
| Waldläufer | 3 |
| Wachturm | 2 |
| Bogenschütze | 2 |
| Sturmwind | 1 |
| Krone der Belagerung | 1 |

Fünf Karten pro Zug. Nach jeder gewonnenen Runde wächst das Deck um höchstens
eine Karte.

## Schwierigkeit

Das Aufgebot einer Runde wird aus einem Punktebudget zusammengestellt, das mit
der Rundennummer wächst. Teure Gegnertypen schalten sich erst später frei. Kein
Typ stellt mehr als einen Teil des Aufgebots, damit späte Runden nicht nur aus
Rammen bestehen. Höchstens sechs Gegner stehen gleichzeitig auf dem Feld, der
Rest wartet im Lager. Spätere Runden schicken zähere und stärkere Gegner.

Der Tatendrang wächst alle zwei Runden um einen Punkt bis höchstens acht.

Zum Justieren stehen oben im Skript `rundenBudget`, `einsatzProZug`,
`maxTatendrangFuer`, `MAX_GEGNER_AUF_DEM_FELD`, `belagerungsHp` und
`belagerungsSchaden`. Drei Testläufe mit einfacher Spielweise endeten in Runde
23, 10 und 10.

## Was noch fehlt

- **Kleiner Kartenpool.** Die Belohnung bietet dieselben sechs Karten an, die es
  auch im Startdeck gibt. Ein Deckbuilder lebt von neuen Karten mit eigenen
  Effekten.
- **Kein Ende nach oben.** Die Runden hören nie auf, es gibt keinen Sieg.
- **Keine Erholung.** Die Burg heilt zwischen den Runden nicht, zerstörte Türme
  sind weg.
- **Gegner weichen Mauern nur einfach aus.** Sie prüfen das nächste Feld, sie
  suchen keinen Weg um eine lange Mauer herum.

## Aufbau

Alles steckt in `index.html`: Stil, Aufbau und Logik.

Spiellogik: `CARD_POOL` für die Karten, `STARTER_DECK` für das Startdeck,
`ENEMY_TYPES` für die Gegner, `buildRoster` für das Aufgebot einer Runde,
`deployFromLager` für den Nachschub aus dem Lager, `startRunde`, `endTurn` und
`nimmBelohnung` für den Ablauf, `enemyPlan` für die Absicht eines Gegners,
`resolveEnemyTurn` für den Gegnerzug sowie `towerReach` und `towerDamageAt` für
Reichweite und Salve eines Turms.

Darstellung: `isoX` und `isoY` rechnen aufs Raster um, `cellFromPoint` ist die
Umkehrung für Klicks, `zeichenReihenfolge` löst die Verdeckung topologisch auf,
`drawBlock` und `drawMerlons` bauen Mauerwerk, `drawSprite` malt die
Pixelfiguren, `drawBadge` die Plaketten und `paintCardArt` die Bilder auf den
Karten.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
