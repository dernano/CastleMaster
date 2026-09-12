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
davon zählen **Züge**: erst handelst du, dann das Aufgebot.

Das Aufgebot wartet zu Beginn vollständig im **Lager** rechts neben dem
Spielfeld. Dort sind die Gegner geschützt, du kannst sie nicht angreifen,
siehst aber von Anfang an, was auf dich zukommt. Zug um Zug treten einige von
ihnen aufs Feld.

Hast du alle Gegner erschlagen, ist die Station gehalten. Du bekommst Sold und
wählst eine von drei Karten für dein Deck, oder überspringst die Auswahl, um
das Deck schlank zu halten. Danach geht es zurück auf die Route.

### Der Takt des Gegnerzugs

Früher handelte das ganze Aufgebot in einem einzigen Augenblick: Ein Klick auf
*Zug beenden*, dreiundsiebzig Millisekunden Rechenzeit, und acht Gegner waren
gleichzeitig gelaufen und hatten zugeschlagen. Man sah nichts davon und konnte
nichts lesen; in der Meldezeile standen drei zusammengezogene Bruchstücke.

Jetzt tritt einer nach dem anderen vor. Jeder bekommt eine kurze Pause, einen
Ring unter den Füßen und seine eigene Zeile. Sieben Gegner brauchen so rund
drei Sekunden statt eines Wimpernschlags. Solange das läuft, sind die Karten
gesperrt und der Knopf heißt *Aufgebot zieht*.

Der Takt steckt in `TAKT`, angestoßen von `starteGegnerzug` und fortgeschrieben
von `schreiteGegnerzug` aus der Bildschleife heraus. Was ein einzelner Gegner
tut, steht in `handleGegner`; `resolveEnemyTurn` ruft das in einer Schleife auf
und bleibt für Tests und für `prefers-reduced-motion` erhalten. `endTurn` stößt
nur noch an, den Abschluss macht `zugAbschluss`.

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

## Schrift und Kartenbild

Die Schrift ist Pixelify Sans, als Datei in die Seite eingebettet. Das Spiel
sieht deshalb ohne Netz genauso aus und hängt an keinem fremden Dienst.

Das Kartenbild folgt dem **doppeldeutschen Blatt** aus Wien: weißer Grund,
schwarze Konturen, flache Leuchtfarben ohne jeden Verlauf, und die Zeichnung
**doppelköpfig gespiegelt**. Gemalt wird nur die obere Hälfte; die untere ist
dieselbe Zeichnung, um 180 Grad gedreht, getrennt durch die schwarze Linie, auf
der das Namensband sitzt.

Dazu kommen die Zeichen des Blattes:

- **Eckzeichen** oben links und, um 180 Grad gedreht, unten rechts: Wert und
  Farbe, wie die römischen Ziffern der Zahlkarten.
- **Die vier Farben** sind gezeichnet, nicht als Schriftzeichen gesetzt:
  Eichel, Herz, Laub und Schellen. Ein Emoji ist in dieser Größe nur ein
  Klecks, eine gezeichnete Form trägt den Strich des Blattes weiter.
- **Alle Karten sind gleich groß.** Was nicht hineinpasst, läuft am unteren
  Rand aus, statt die Karte zu dehnen. So bleibt der Fächer ruhig.

Die Farben liegen in `BLATT`, die Motive in `zeichneMotiv`, die Spiegelung in
`paintCardArt`, die Kartenfarben in `zeichneFarbe`. Eine Halbfigur wie im
Wiener Bild baut `hofFigur`, einen Turm mit Zinnen `turmForm`; `umriss`,
`kasten`, `scheibe` und `zug` sind die Grundformen, jede flach gefüllt und
schwarz umrandet.

Die Seltenheit sitzt auf dem **Namensband** und der inneren Linie: grau, blau,
goldorange. Die Kartenfarbe steht im Eckzeichen, wie im echten Blatt.

Auf schmalen Schirmen wird aus dem Fächer eine Reihe zum Wischen, und die
Auslage des Marketenders ebenso. Ein Fächer aus fünf Karten, der auf ein
Handy passen soll, verdeckt sich sonst fast vollständig selbst.

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

75 Karten, alle im Lauf kaufbar. Es gibt keinen gesperrten Teil des Stapels und
keine sichtbare Einteilung in Spielrichtungen: Womit du skalierst, entscheidest
du selbst.

| Farbe | Zeichen | Typ | Anzahl |
| --- | --- | --- | --- |
| Eichel | 🌰 | Gebäude | 18 |
| Herz | ❤ | Einheit | 25 |
| Blatt | 🍃 | Fähigkeit | 20 |
| Schellen | 🔔 | Macht | 12 |

**Gebäude** werden auf ein freies Feld gesetzt. Sie haben Lebenspunkte, oft
eine Höhe (`rangeBonus`), die die Reichweite ihrer Besatzung verlängert, und
manche zwei Plätze statt einem.

**Einheiten** beziehen einen freien Platz auf einem Turm. Neben Schaden und
Reichweite können sie den Turm härten (`zaeh`) oder Durchschlag mitbringen:
Dann reißt die Salve auch den nächststehenden Gegner mit, für halben Schaden.

**Fähigkeiten** verstärken entweder eine Einheit dauerhaft oder wirken einmalig:
Schaden auf einen Gegner oder auf alle, einen Gegner fesseln oder zurückstoßen,
einen Turm flicken oder verstärken, nachziehen, Tatendrang oder Sold.

**Mächte** halten bis zum Ende der Station: mehr Schaden oder Reichweite für
alle Einheiten, ein zusätzlicher Platz oder mehr Leben auf allen Türmen, eine
Karte oder ein Tatendrang mehr je Zug, oder Dornen, an denen sich jeder
Angreifer verletzt.

Was eine Karte tut, steht als Regelzeile auf ihr und wird aus ihren Feldern
abgeleitet, nicht danebengeschrieben. Nach dem Schärfen stimmt sie deshalb
weiter.

### Eine Karte, die nachzieht, muss etwas kosten

Eine Karte, die sich ihren eigenen Tatendrang zurückgibt und dabei nachzieht,
holt sich nach dem Mischen des Ablagestapels selbst wieder auf die Hand. Der
Zug endet dann nie. `bezahlbarkeitSichern` erzwingt deshalb für jede Karte
Nettokosten von mindestens einem Tatendrang, sowohl beim Laden des Stapels als
auch nach jedem Schärfen.

## Die Wälle

Sobald der erste Turm steht, ziehen sich Wälle von der Burg zu den Türmen und
von Turm zu Turm. Sie kosten nichts, haben keine Lebenspunkte und halten
niemanden auf: Gegner laufen weiterhin auf den nächsten Turm zu und danach
weiter. Sie sind reine Zier.

Gebaut wird ein **minimaler Spannbaum** über Burg und Türme. Jedes Bauwerk
hängt am Netz, aber es entsteht nie ein Ring. Das ist der Kern der Sache.

### Warum kein Ring

Zuerst lag eine konvexe Hülle um alle Bauwerke. Das sah nach Burghof aus, hatte
aber einen Fehler: Ein neuer Turm weit draußen zog die Hülle mit und schloss
jeden Gegner ein, der dazwischen stand. Man baute einen Turm und hatte plötzlich
Belagerer im eigenen Hof.

Ein Baum umschließt keine Fläche, kann also niemanden einsperren. Zwei Wallwege
können sich auf dem Raster aber trotzdem berühren und zusammen mit einem Bauwerk
eine kleine Tasche bilden. Deshalb flutet `oeffneTaschen` nach dem Bauen vom
Spielfeldrand aus und öffnet jede abgeschnittene Tasche durch ein Loch im Wall.
Das Loch sieht aus wie ein Durchlass und ist genau das.

Geprüft wird das an 400 zufälligen Turmstellungen je Durchlauf: keine einzige
schneidet ein Feld vom Rand ab.

Gerechnet wird nur, wenn sich die Türme geändert haben, nicht bei jedem
Bildaufbau. Neue Stücke steigen aus dem Boden auf wie die Türme.

## Die Burg

Ein Mauerring mit Zinnen, vier Ecktürmen unter roten Spitzdächern, einem
Torhaus mit Fallgitter an der zum Feld zeigenden Wand und dem Bergfried am
hinteren Ende. Im Bergfried brennt ein Fenster, das leicht flackert. Auf dem
Dach weht das Banner; darunter steht der Lebensbalken, sobald die Burg getroffen
wurde.

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

Vierzehn Testläufe mit einfacher Spielweise endeten fünfmal bestanden und sonst
an den Stationen 7, 7, 7, 9, 10, 11, 12, 15 und 15. Verloren wird meist an einer
Vorhut, was zur Absicht passt: Sie ist die Prüfung des Feldzugs.

## Was noch fehlt

- **Nichts wächst über den Feldzug hinweg.** Türme fallen an jeder Station weg,
  Mächte gelten nur für eine Station. Das Einzige, was mitwächst, ist das Deck.
  Ein Lauf fühlt sich deshalb nicht an, als würde er zu etwas werden.
- **Wenig Ton.** Die neuen Kartenwirkungen klingen alle gleich.
- **Keine eigenen Bilder.** Alles ist im Code gezeichnet. Eingespielte Grafiken
  und Klänge fehlen noch; dafür bräuchte es einen Lader, und im veröffentlichten
  Artifact müssten die Bilder eingebettet sein, weil die Seite nichts von außen
  holen darf.
- **Die Figuren auf dem Feld sind noch einfach.** Es gibt genau zwei Sprites,
  `FIG_WACHE` und `FIG_GEGNER`; alle fünf Gegnertypen sind dieselbe Figur in
  anderer Farbe. Das Kartenbild ist inzwischen deutlich weiter als das Feld.
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
`entferneKarte` fürs Deck, `zielArt`, `playCard` und `wirke` für das Ausspielen
einer Karte, `wendeMachtAn` für anhaltende Wirkungen, `treffeGegner` als
gemeinsamer Weg für allen Schaden, `pruefeMauer`, `oeffneTaschen` und `drawMauerstueck` für die
Wälle, `endTurn` und `nimmBelohnung` für den Ablauf, `enemyPlan` für die Absicht eines Gegners,
`resolveEnemyTurn` für den Gegnerzug sowie `towerReach` und `towerDamageAt` für
Reichweite und Salve eines Turms.

Darstellung: `isoX` und `isoY` rechnen aufs Raster um, `cellFromPoint` ist die
Umkehrung für Klicks, `zeichenReihenfolge` löst die Verdeckung topologisch auf,
`drawBlock` und `drawMerlons` bauen Mauerwerk, `drawSprite` malt die
Pixelfiguren, `drawBadge` die Plaketten und `paintCardArt` die Bilder auf den
Karten.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
