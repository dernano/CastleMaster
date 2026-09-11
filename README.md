# Castle Master

Ein rundenbasiertes Deckbuilding-Spiel im Browser, im Aufbau an Slay the Spire
angelehnt. Du reitest eine Route aus siebzehn Stationen entlang der Grenze. An
jeder Kampfstation errichtest du Türme auf einem Raster, besetzt sie mit
Einheiten und hältst damit ein Aufgebot von Angreifern von deiner Burg fern.
Dazwischen liegen Marketender, Lager und Begegnungen. Am Ende der Route wartet
der Belagerungsmeister.

Die Kartenfarben folgen dem doppeldeutschen Blatt. Die Darstellung ist eine
isometrische Pixel-Ansicht, vollständig im Code gezeichnet.

## Starten

```bash
npm start          # http://localhost:5173
```

Kein `npm install` nötig, das Projekt hat keine Abhängigkeiten. Alles steckt in
`index.html`, ein Doppelklick auf die Datei funktioniert ebenfalls.

## Feldzug und Route

Ein **Feldzug** ist ein Durchlauf von siebzehn **Stationen**. Die Route wird zu
Beginn zufällig erzeugt: Fünf Wege werden von unten nach oben gezogen, sie
überlappen und verzweigen sich und münden alle in der letzten Station. Was die
Wege dabei berühren, sind die Knoten. Nach jeder Station wählst du, auf welchem
Weg es weitergeht, wie in Slay the Spire.

| Knoten | Zeichen | Was dort passiert |
| --- | --- | --- |
| Angriff | ⚔ | Ein gewöhnliches Aufgebot. |
| Vorhut | ☠ | Zäheres Aufgebot, dafür mehr Sold. Ab Station 6. |
| Marketender | ⚖ | Fünf Karten zum Kauf, dazu Streichen und Schärfen. |
| Lager | ⌂ | Eine Nacht Ruhe: Mauern flicken, schärfen oder ausmisten. |
| Begegnung | ? | Ein Ereignis mit zwei bis drei Entscheidungen. |
| Belagerungsmeister | ♛ | Station 17, der Endgegner. |

Mindestens zwei Marketender liegen auf jedem Feldzug, Station 16 ist immer ein
Lager, und die ersten beiden Stationen sind mild.

Fällt der Belagerungsmeister, ist der Feldzug bestanden und der nächste beginnt
eine Stufe härter: Aufgebote und Gegnerstärke steigen um 18 Prozent je
bestandenem Feldzug. Fällt die Burg, endet der Lauf und ein neuer beginnt bei
Stufe eins. In beiden Fällen wird alles zurückgesetzt. Erreichte Station,
bestandene Feldzüge und die beste Station bleiben gespeichert.

### Was mitreitet und was nicht

**Türme bleiben nie stehen.** An jeder Station baust du von vorn. Die
eigentliche Fortschrittsachse ist damit das Deck, nicht das Feld.

**Die Burg reitet mit.** Ihre 35 Lebenspunkte müssen den ganzen Feldzug tragen
und heilen nicht von selbst. Geheilt wird nur im Lager oder durch eine
Begegnung.

**Deck und Sold reiten mit.** Was du kaufst, findest oder schärfst, bleibt bis
zum Ende des Feldzugs.

## Sold

Nach jedem gewonnenen Kampf zahlt die Krone **Sold**, bei einer Vorhut deutlich
mehr. Der Betrag wächst leicht mit der Station.

| Posten | Preis |
| --- | --- |
| Karte beim Marketender, gewöhnlich | rund 45 |
| Karte beim Marketender, selten | rund 80 |
| Karte beim Marketender, kostbar | rund 135 |
| Karte streichen | 70 |
| Karte schärfen | 60 |

Ein Stück der Auslage liegt immer günstiger aus, damit sich der Umweg zum
Marketender auch bei schmalem Beutel lohnt.

**Schärfen** verbessert, was eine Karte ohnehin tut: Schaden, Leben, Reichweite
oder Höhe. Karten ohne solche Werte werden stattdessen um einen Tatendrang
billiger. Jede Karte lässt sich nur einmal schärfen, danach trägt ihr Name ein
`+`.

## Seltenheit

Jede Karte hat eine von drei Seltenheiten. Sie steuert, wie oft die Karte in
Auslagen und Belohnungen auftaucht, und was sie kostet. Zu sehen ist sie am
**Rahmen und am Fußband** der Karte; die Kartenfarbe bleibt an der linken Kante
und im Zeichen oben rechts.

| Seltenheit | Farbe | Anteil |
| --- | --- | --- |
| Gewöhnlich | grau | 62 |
| Selten | blau | 30 |
| Kostbar | goldorange | 8 |

## Begegnungen

Acht Ereignisse, jedes mit zwei bis drei Entscheidungen: der fahrende Barde,
eine verlassene Schmiede, ein alter Steinbruch, der Grenzstein, ein enger
Hohlweg, ein wandernder Baumeister, ein alter Wachturm und Söldner ohne Sold.
Sie geben oder nehmen Sold, Burg-Lebenspunkte und Karten. Zweimal dieselbe
Begegnung hintereinander kommt nicht vor.

## Stationen und Züge

Eine **Kampfstation** ist ein ganzer Kampf gegen ein festes Aufgebot. Innerhalb
davon zählen **Züge**: erst handelst du, dann die Gegner.

Das Aufgebot wartet zu Beginn vollständig im **Lager** rechts neben dem
Spielfeld. Dort sind die Gegner geschützt, du kannst sie nicht angreifen,
siehst aber von Anfang an, was auf dich zukommt. Zug um Zug treten einige von
ihnen aufs Feld.

Hast du alle Gegner erschlagen, ist die Station gehalten. Du bekommst Sold und
wählst eine von drei Karten für dein Deck, oder überspringst die Auswahl, um
das Deck schlank zu halten. Danach geht es zurück auf die Route.

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

Ein hoher Turm verdeckt geometrisch korrekt alles, was dahinter steht. Im
Spiel ist das unbrauchbar, deshalb werden verdeckte Gegner blass über das
Mauerwerk gelegt und bleiben so sichtbar. Klicks bevorzugen Gegner gegenüber
Bauwerken, sonst wäre ein verdecktes Ziel nicht anwählbar.

Beim Betreten einer Station und nach gehaltener Station fährt ein Banner über
das Bild.
Karten fächern sich beim Nachziehen auf.

## Aufbau des Bildes

Das Spiel ist eine einzige gerahmte Ansicht, keine Seite mit Kästen darunter.
Unten schließt eine Brüstung mit Zinnen ab: Du schaust über deine eigene Mauer,
und die Handkarten liegen darauf. Werte und Rundenanzeige liegen oben auf,
Minikarte unten links, Zug-Knopf und Deck unten rechts, die Meldungen schweben
frei über der Mauer.

Steuerung und Kartenfarben stehen auf einer Hilfetafel hinter dem `?` oben
rechts, statt als Fußzeile außerhalb des Bildes.

Auf schmalen Bildschirmen bleibt die Hand im Bild, wird aber kompakt:
Kostenstein, Name, Bild und Typenband, ohne Beschreibungstext.

## Schrift und Karten

Die Oberfläche läuft in Pixelify Sans, einer kantigen Pixelschrift, die zum
gezeichneten Spielfeld passt. Sie ist als variabler lateinischer Schnitt fest in
die Datei eingebettet, rund 16 KB. Damit hängt nichts an einem Schriftdienst,
es wird nichts nachgeladen, und das Spiel sieht ohne Netz genauso aus.
Kartenbeschreibungen bleiben in einer ruhigen Kursiven, weil Pixelschrift in
Fließtext schlecht liest.

Die Karten sind keine Kacheln mehr, sondern Karten: dicker Rand, heller Grat
innen, Schlagschatten nach unten, Farbkante und Typenband in der Farbe der
Kartenfarbe, ein facettierter Kostenstein und das Bild in vertiefter Fassung.

Die Hand liegt aufgefächert wie ein Blatt, die Karten überlappen und sind
leicht gedreht. Unter dem Zeiger neigt sich eine Karte räumlich mit, hebt ab,
ein Glanz wandert darüber, und beim Drücken federt sie ein. Im Ruhezustand
schweben sie unmerklich.

## Ton

Alle Geräusche werden zur Laufzeit erzeugt, es kommen keine Klangdateien dazu.
Bogenschuss, Treffer, Turmbau, einstürzender Turm, Schlag gegen die Burg, ein
kleiner Dreiklang nach gehaltener Station. Der Schalter `♪` oben rechts schaltet
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

| Gegner | LP | Schaden | Bewegung | Reichweite | Ab Station |
| --- | --- | --- | --- | --- | --- |
| Späher | 4 | 1 | 5 | 1 | 1 |
| Armbrustschütze | 6 | 2 | 2 | 4 | 2 |
| Ritter | 14 | 3 | 3 | 1 | 3 |
| Ramme | 20 | 5 | 2 | 1 | 5 |
| Belagerungsmeister | 65 | 8 | 2 | 2 | nur Station 17 |

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

Fünf Karten pro Zug. Die Hand gehört zur Station, nicht zum Ritt: Beim Betreten
einer Station wandert sie zurück ins Deck und wird frisch gezogen.

Das Deck wächst über den Feldzug durch Belohnungen, Käufe beim Marketender und
Funde bei Begegnungen. Streichen im Lager oder beim Marketender hält es wieder
schlank.

## Schwierigkeit

Das Aufgebot einer Station wird aus einem Punktebudget zusammengestellt, das mit
der Stationsnummer wächst. Teure Gegnertypen schalten sich erst später frei.
Kein Typ stellt mehr als einen Teil des Aufgebots, damit späte Stationen nicht
nur aus Rammen bestehen. Höchstens acht Gegner stehen gleichzeitig auf dem Feld,
der Rest wartet im Lager. Spätere Stationen schicken zähere und stärkere Gegner.

Eine **Vorhut** bekommt ein um ein Drittel größeres Budget, wählt bevorzugt
schwere Typen, und ihre Gegner tragen ein Viertel mehr Lebenspunkte. Der
Zuschlag auf den Schaden kommt erst ab Station 8, sonst wäre die erste Vorhut
die Wand, an der jeder Feldzug endet.

Der Tatendrang wächst alle zwei Stationen um einen Punkt bis höchstens acht.

Zum Justieren stehen oben im Skript `STATIONEN`, `feldzugHaerte`,
`rundenBudget`, `einsatzProZug`, `maxTatendrangFuer`, `MAX_GEGNER_AUF_DEM_FELD`,
`belagerungsHp`, `belagerungsSchaden`, `SOLD_JE_STATION`, `SOLD_VORHUT`,
`PREIS_ENTFERNEN` und `PREIS_SCHAERFEN`.

Zwölf Testläufe mit einfacher Spielweise endeten viermal bestanden und sonst an
den Stationen 6, 10, 10, 11, 13, 14, 15 und 15. Verloren wird fast immer an
einer Vorhut, was zur Absicht passt: Sie ist die Prüfung des Feldzugs.

## Was noch fehlt

- **Kleiner Kartenpool.** Auslagen und Belohnungen bieten dieselben sechs
  Karten an, die es auch im Startdeck gibt. Geplant sind 75, alle im Durchgang
  kaufbar.
- **Keine Zier-Mauer.** Sobald der erste Turm steht, soll sich automatisch eine
  Mauer um Burg und Türme schließen. Sie hält nichts auf und hat keine
  Lebenspunkte, sie soll nur hübsch aussehen.
- **Gegner weichen Mauern nur einfach aus.** Sie prüfen das nächste Feld, sie
  suchen keinen Weg um eine lange Mauer herum.

## Aufbau

Alles steckt in `index.html`: Stil, Aufbau und Logik.

Spiellogik: `CARD_POOL` für die Karten, `STARTER_DECK` für das Startdeck,
`ENEMY_TYPES` für die Gegner, `buildRoster` für das Aufgebot einer Station,
`deployFromLager` für den Nachschub aus dem Lager, `baueRoute` für die Karte
des Feldzugs, `betreteKnoten` und `weiterAufDerRoute` für den Ablauf einer
Station, `oeffneHaendler`, `oeffneRast` und `oeffneEreignis` für die Stationen
ohne Kampf, `EREIGNISSE` für die Begegnungen, `schaerfeKarte` und
`entferneKarte` fürs Deck, `endTurn` und `nimmBelohnung` für den Ablauf, `enemyPlan` für die Absicht eines Gegners,
`resolveEnemyTurn` für den Gegnerzug sowie `towerReach` und `towerDamageAt` für
Reichweite und Salve eines Turms.

Darstellung: `isoX` und `isoY` rechnen aufs Raster um, `cellFromPoint` ist die
Umkehrung für Klicks, `zeichenReihenfolge` löst die Verdeckung topologisch auf,
`drawBlock` und `drawMerlons` bauen Mauerwerk, `drawSprite` malt die
Pixelfiguren, `drawBadge` die Plaketten und `paintCardArt` die Bilder auf den
Karten.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
