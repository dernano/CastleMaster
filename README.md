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

**Die Burg reitet mit.** Ihre 50 Lebenspunkte müssen den ganzen Feldzug tragen
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

### Zielen und die Salve

Eine Zeit lang schoss das Spiel für dich: alle Türme feuerten am Zugende in
einer Salve, jeder auf sein bestes Ziel. Das gab den Kämpfen einen
Höhepunkt, nahm aber die Entscheidung weg, auf die es ankommt — **worauf**.
Ob ein Turm feuert, stand ohnehin fest; wen er umwirft, ist das Spiel.

Beides gilt jetzt nebeneinander:

- **Selbst zielen.** Turm anklicken, dann über einen Gegner fahren. Ein roter
  Bogen spannt sich vom Turm zum Ziel, mit Spitze, Fadenkreuz und der Zahl,
  die dieser Schuss wirklich macht — `⚔ 7 · 12 LP`, oder `⚔ 7 · fällt`, wenn
  er reicht. Reicht der Turm nicht so weit, bricht die Linie gestrichelt ab
  und sagt, wie viele Felder fehlen. Klick feuert.
- **Die Salve räumt den Rest.** Am Zugende feuert nur noch, was du nicht
  selbst angewiesen hast. Ein Turm schießt nie zweimal.

Schießen kostet **keinen Tatendrang**. Die Entscheidung ist das Ziel, nicht
die Frage, ob man sich den Schuss leisten kann; der Tatendrang gehört den
Karten. Nach einem Schuss wählt sich der nächste bereite Turm von selbst an,
damit man eine Reihe durchklicken kann, ohne jedes Mal neu zu greifen.

### Die Frist

Lange fehlte dem Spiel jeder Druck. Die Burg nahm fast nie Schaden: Türme
fingen alles ab, und weil an jeder Station kostenlos neu gebaut wird, kostete
ein verlorener Turm nichts. Man konnte beliebig lange bauen, bis das Aufgebot
irgendwann zerschossen war. Ein Kampf dauerte im Schnitt zehn Züge, und ein
Bot gewann sechzehn von sechzehn Läufen. Wo nichts schiefgehen kann, gibt es
auch nichts zu entscheiden.

Jede Kampfstation hat deshalb eine **Frist**:

    Frist = 7 + Runde / 4        Züge
    Vorhut  + 1
    Meister + 3

Die Anzeige oben in der Mitte zählt herunter und wird in den letzten beiden
Zügen rot. Ist die Frist verstrichen, kommt **der Sturm**: alles, was noch
steht — auf dem Feld wie im Lager — rennt gemeinsam ins Tor und bringt seinen
vollen Schaden mit. Bei sieben Belagerern sind das schnell zwanzig bis dreißig
Punkte auf fünfunddreißig Burgleben. Wer das übersteht, hat die Station
gehalten, aber teuer bezahlt; die Burg heilt nur an Rastplätzen.

Damit ist das Burgleben die eigentliche Währung des Feldzugs, nicht mehr nur
eine Anzeige, die selten fällt. Messung über vierundzwanzig Läufe: Siege von
16/16 auf 11/24, ein Viertel aller Kämpfe endet im Sturm, 8,4 statt 9,9 Züge
je Kampf.

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

## Die Welt jenseits des Spielfelds

Lange endete die Welt am Rand der Scholle, und dahinter war Schwarz. Das liess
das Ganze wie ein Brett aussehen, das irgendwo schwebt: mehr Handy-Spiel als
Belagerung.

Jetzt liegt die Burg in einer Ebene, die bis zum Horizont läuft:

- **Himmel** mit tief stehender Sonne im Dunst, kalt oben, staubig warm zur Kimm.
- **Drei Höhenzüge**, nach hinten blasser, dazu ein Dunstband genau auf dem
  Horizont, damit Land und Himmel ineinanderlaufen.
- **Das Heer am Horizont** als Zeltreihen, darüber sechs Rauchsäulen, die im
  Wind stehen.
- **Kein Wassergraben mehr.** Er machte aus dem Land ein Brett im Nichts. Das
  Feld geht heute in die Ebene über und franst zum Rand hin aus.
- **Steppe statt Palmenhain**: vereinzelte Palmen am Feldrand, sonst Geröll und
  Dornbusch, nach aussen hin blasser.

Gezeichnet wird das in `baueHimmel` (einmal vorgemalt) und `drawFernerRauch`
(lebt mit). `randDeckung` bestimmt, wie sichtbar eine Kachel ausserhalb des
Spielfelds noch ist. Nichts wird über die Kimm hinaus gemalt, sonst
verschwände der Horizont hinter dem eigenen Acker.

## Das Belagerungslager

Rechts neben dem Spielfeld steht das Lager des Angreifers, und es steht immer,
auch wenn niemand mehr darin wartet: eine Pfahlreihe, fünf Zelte, das
Herrenzelt mit Wimpel, zwei Feuer, ein **Trebuchet** und ein **Sturmturm** mit
halb heruntergelassener Klappbrücke. Dort hinein kann der Spieler nicht
schiessen.

## Belagerungsgerät

Ramme und Katapult sind kein umgefärbter Mann mehr, sondern gezeichnete
Maschinen (`drawGeraet`): die Ramme ein Kasten auf Rädern mit einem Baumstamm
darin und einem eisernen Kopf, das Katapult ein Rahmen mit schwingendem
Wurfarm. Das Katapult wirft aus sieben Feldern Entfernung und ist ab Station 6
im Aufgebot.

Gleichzeitig stehen jetzt bis zu **sechzehn** Gegner auf dem Feld statt acht,
und je Zug treten mehr aus dem Lager. Vier Männer sind kein Sturm.

## Nur einmal je Kampf

Die **Wachturmkarte** trägt als einzige diese Grenze: an einer Station lässt sie
sich einmal ausspielen, dann nicht mehr. Ungespielt wandert sie wie jede andere
Karte in den Ablagestapel — der Verbrauch hängt am Ausspielen, nicht am Ziehen.

Vorher gab es gar keine Grenze. Das Zehnerdeck läuft alle zwei Züge einmal
durch, dieselbe Karte kommt also immer wieder — gemessen konnte ich sechsmal
hintereinander einen Wachturm bauen. Das machte den Wall zu einer Reihe
gleicher Türme und alle anderen Gebäudekarten überflüssig.

Im Code hängt der Vermerk an `bezahle`, weil dort jede gespielte Karte
durchläuft:

```js
function bezahle(card) {
  state.tatendrang -= card.cost;
  if (card.einmalJeKampf) state.einmalGenutzt[card.id] = true;
}
```

`state.einmalGenutzt` wird beim Betreten jeder Station geleert.

**Erkenntlich gemacht** ist es doppelt. Die Karte trägt die Regel immer im
Text (`Nur einmal je Kampf.`), damit man sie vor dem Spielen kennt. Und ist sie
gelaufen, liegt ein rotes Band **Verbraucht** quer darüber und die Karte wird
dunkel. Grau allein hätte nicht gereicht: grau heißt „geht gerade nicht" und
könnte auch am Tatendrang liegen.

### Was sie kostet

Über je 48 Bot-Feldzüge: **22/48 ohne die Grenze, 14/48 mit ihr** — rund
siebzehn Prozentpunkte, bei gleichbleibender Sturmquote (28 %). Der Bot kauft
allerdings ziemlich blind (er greift mit 60 % Wahrscheinlichkeit zur ersten
Ware). Wer gezielt Gebäudekarten kauft, für die die Grenze nicht gilt, fährt
besser — und genau dahin schiebt die Regel das Spiel: der Wachturm ist der
Notnagel am Anfang, nicht die Maschine für den ganzen Feldzug.

## Musik

Der Soundtrack liegt als Datei neben dem Spiel, unter `musik/`. Standardname
ist `musik/soundtrack.mp3`; mehrere Stücke trägt man in die Liste `MUSIK` ein.
Eines läuft in Schleife, mehrere gehen der Reihe nach durch.

**Warum nicht eingebettet wie die Kartenbilder.** Ein Kartenmotiv sind vierzig
Kilobyte — als Datenadresse in `index.html` ist das richtig, und die Seite
bleibt eine einzige Datei. Ein Stück Musik sind einige Megabyte. Als Base64 im
Quelltext wäre `index.html` zehnmal so groß, läge bei jeder Änderung neu im
Verlauf und wäre von Hand nicht mehr zu lesen. Die veröffentlichte Seite
bekommt die Dateien stattdessen als Beilage mit — dieselbe Herkunft, also
nichts von außen geladen.

Drei Dinge, die der Spieler nie merken soll:

- **Fehlt die Datei, bleibt es still.** Kein Fehler, keine Meldung — der
  Notenknopf erscheint erst, wenn eine Datei wirklich geladen wurde
  (`canplay`), und verschwindet wieder bei `error`.
- **Browser lassen Ton erst nach einer Berührung zu.** Die Musik beginnt darum
  beim ersten Klick oder Tastendruck, nicht beim Laden, und ein abgelehntes
  `play()` wird geschluckt statt gemeldet.
- **Sie liegt unter den Klängen** (`MUSIK_LAUT = 0.15`). Die Salve, der Schritt
  und das Horn tragen das Spiel; die Musik trägt den Raum. Erste Einstellung
  waren 0.34 — das legte sich über die Klänge statt darunter.

Der Schalter merkt sich seinen Zustand im Browser (`cm-musik`), getrennt vom
Klangschalter (`cm-ton`).

## Der Wall

Bis hierher fing jede Station als leeres Feld an. Die Mauer war **abgeleitet**:
sobald ein Turm stand, legte `pruefeMauer` eine konvexe Hülle um Burg und Türme
und zeichnete deren Randkanten. Das hatte drei Mängel — sie war Kulisse
(`blockiert` kannte nur Burg und Türme, jeder Belagerer lief hindurch), ohne
Turm gab es sie gar nicht, und der erste Zug hatte nichts zu entscheiden.

Jetzt steht an jeder Station ein **fertiger Riegel**: eine geschlossene Linie
vom oberen zum unteren Kartenrand. Er hängt nicht an der Burg, sondern kommt
seitlich herein und schließt ab. Vier Grundformen, dazu gewürfelte Grundspalte,
Torzeile und Basteienverteilung:

| Form | Was sie macht |
| --- | --- |
| `gerade` | eine Flucht von oben nach unten |
| `knick` | die untere Hälfte springt zwei Spalten vor |
| `bug` | die Mitte wölbt sich nach Osten — eine Barbakane |
| `bucht` | die Mitte weicht nach Westen — ein Trichter |

Drei Dinge gehören dazu:

- **Das Torhaus**, ein 2×3-Bauwerk, das *quer im Wall* sitzt — und die
  **Durchfahrt geht mitten hindurch**, nicht daran vorbei. Zwei Pfeiler tragen
  einen Riegel über der Einfahrt, darüber läuft eine durchgehende Wehrplatte
  mit Zinnen, auf der die Besatzung steht (**zwei Plätze ab Zug 1**).

  Die erste Fassung hatte hier eine Lücke im Wall und ein Türmchen daneben.
  Das war kein Tor, sondern ein fehlendes Mauerstück mit einem Turm in der
  Nähe. Jetzt ist das Tor das Gebäude:

  ```js
  // Die Einfahrt gehoert zum Bauwerk, sperrt aber nicht.
  durchfahrt: [{ col: c, row: g + 1 }, { col: c + 1, row: g + 1 }]
  ```

  `blockiert` und `feldKosten` fragen `inDurchfahrt` ab, bevor sie das Bauwerk
  prüfen — sonst wäre das Torhaus eine Mauer mit Dach. Es läuft ansonsten
  absichtlich durch `state.towers`: damit gilt für es alles, was für Türme
  gilt — zielen, Zinnen, Plakette, und es kann fallen.

  Es trägt den **Sandstein des Walls**, nicht den grauen `stein` der Burg. Mit
  dem grauen verschmolz es aus der Entfernung mit der Burg zu einem Klumpen.

  Gebaut ist es als **ein Baukörper mit einem Loch darin**, nicht als zwei
  Pfeiler nebeneinander — genau so las sich die erste Fassung nämlich: zwei
  Türmchen mit einer Lücke. In der Durchfahrt hängt eine **Gittertür**, in die
  dunkle Laibung geclippt, mit Stangen, zwei Bändern und einem Schlussstein.

  Zwei Fehler ließen es davor verstümmelt aussehen. **Der Bogen der Hofseite
  wurde mitgemalt**, obwohl er hinter dem Baukörper liegt und gar nicht zu
  sehen ist — er landete als zweite dunkle Scharte mitten auf der Vorderseite.
  Und **der Bogen lag flach im Bildschirm**, mit waagerechten Versätzen. Eine
  Wandfläche läuft hier aber schräg: bei festem `x` trägt jeder Schritt in `y`
  zugleich nach rechts und nach unten. Jetzt gehen alle Punkte durch `mx/my`,
  dann sitzt er in der Wand statt darauf.
- **Türme überall im Wall.** Alle vier Felder eines Turms müssen auf Mauerwerk
  stehen — dann sitzt er vollständig darin. Vorher gab es dafür Basteien:
  2×2-Podeste mit einer gelben Marke darüber. Das machte aus dem Wall ein Brett
  mit sechs Steckplätzen; jetzt geht es überall an ihm entlang.

### Zwei Felder dick, und warum das nötig war

Der Wall war ein Feld dick, Türme und Torhaus sind zwei Felder breit. Sie hingen
also zur Hälfte darüber hinaus, und hinten stieß die Mauer nur auf ihre halbe
Breite. Das sah nach Bruch aus, nicht nach Mauerwerk — und es war kein
Zeichenfehler, sondern ein Maßfehler.

Jetzt ist der Wall **zwei Felder dick**. Ein Bauwerk sitzt vollständig darin und
schließt bündig ab; das Torhaus füllt genau die beiden Wallspalten. Nebenbei
verschwinden die Zinnen an den Innenkanten von selbst, weil dort ein Nachbarfeld
Mauer steht.

Dazu zwei Griffe beim Zeichnen eines eingebauten Turms:

- **Ein Sockel aus Wallstein** über seine ganze Grundfläche. Ohne ihn stand er in
  einem Loch: die Mauerfelder darunter werden verdeckt, und weil die Modelle
  ringsum einen Rand lassen, klaffte ein Streifen blanker Boden.
- **Das Modell sitzt auf dem Sockel, nicht darin** (`zeichneModell(..., sockel)`).
  Ohne die Anhebung steckte der Steinkörper des Wachturms (30 hoch) fast
  vollständig im Sockel (27), und heraus schaute nur seine hölzerne Hurde — eine
  braune Kiste auf einer Steinmauer. Angehoben wächst der Turm aus dem Wall
  heraus. Figurenhöhe und Zielbogen wachsen um denselben Betrag mit.

### Dicht ist nicht selbstverständlich

Der Riegel muss wirklich schließen, sonst ist er gemalt. Die erste Fassung tat
das nicht: Wechselte der Wall genau an der Toröffnung die Spalte, lagen die
beiden Torfelder in **verschiedenen Spalten**, und an dieser Stufe kam ein
Diagonalschritt am Tor vorbei ins Innere.

Der Test dafür mauert das Tor zu und flutet vom rechten Rand: erreicht dann noch
irgendetwas die Burg, leckt der Wall. **46 von 200 Layouts leckten.** Vier
Zeilen in einer Flucht um das Tor herum, und es sind 0 von 200.

### Wer auf was zielt

Zwei Regeln geben dem Wall seinen Brennpunkt:

**Nahkampf will ans Tor.** Wer nur eine Armlänge weit reicht (`reach <= 2`),
geht auf das Torhaus zu — egal, wo er steht und welcher Turm näher wäre. Dort
staut sich die Belagerung, und dort entscheidet sie sich. Fällt das Torhaus,
klafft ein 2×3-Loch im Wall, und das Fußvolk sucht sich wieder den nächsten
Turm. Fernkampf bleibt beim nächsten Ziel: ein Armbrustschütze hat keinen
Grund, an einem besetzten Turm vorbeizulaufen, um am Tor anzustehen.

**Schützen zielen auf Männer, nicht auf Stein.** Steht jemand auf dem Turm,
bekommt er den Treffer; ist die Krone leer, nehmen sie das Mauerwerk. Dafür
haben Einheiten jetzt eigene Lebenspunkte (`6 + 2 × zaeh`) und einen eigenen,
schmalen grünen Balken dicht unter den Figuren. Zinnen helfen dagegen nicht —
sie decken den Turm, nicht den Kopf. Vorher war der Turm das einzige Ziel und
wer oben stand unantastbar: ein Armbrustschütze schoss auf Mauerwerk statt auf
Männer.

## Wer durchs Tor geht und wer nicht

Der Wall sperrt (`blockiert` kennt ihn jetzt) und er fällt (jedes Feld hat 24
LP). Damit das keine Formel wird, sondern eine Entscheidung, läuft die Bewegung
über ein **Wegfeld** — Dijkstra vom Ziel nach außen, in dem ein Mauerfeld nicht
unmöglich, sondern nur teuer ist:

```js
const MAUER_KOSTEN = 9;
const MAUER_KOSTEN_RAMME = 1;
```

Mit **einem** Wert für alle schlug niemand je zu: weil diagonal gegangen wird,
kostet der Umweg zum Tor fast nichts, und sieben war immer teurer — gemessen
null eingeschlagene Mauerfelder in neun Zügen. Mit zwei Werten ergibt sich das
von selbst:

- **Fußvolk** meidet den Stein und strömt zum Tor.
- **Die Ramme** sieht ihn gar nicht. Sie geht schnurstracks und bricht durch, wo
  sie steht — und schlägt dabei doppelt so hart zu. Das Loch, das sie reißt,
  wird danach für alle anderen der günstigste Weg.
- **Was Reichweite hat**, kümmert der Wall ohnehin nicht. Ein Katapult mit
  sieben Feldern stellt sich davor und schießt darüber hinweg. Genau diese
  Asymmetrie soll der Wall erzeugen: Nahkampf muss durchs Tor, Belagerungsgerät
  nicht.

Die alte Bewegung (`schrittRichtung`) ging stur aufs Ziel zu und probierte bei
einem Hindernis genau eine Ausweichrichtung. An einem Wall, der die halbe Karte
sperrt, blieb sie kleben.

### Zwei Fehler, die das Spiel unspielbar machten

**Der Wall stand zu weit vorn.** Grundspalte 6–9 klang nach „Mitte der Karte",
verschob aber die ganze Verteidigungslinie fünf Spalten nach Osten — denn Türme
dürfen nur noch auf ihn. Der Anmarsch unter Beschuss wurde um ebenso viele Züge
kürzer. Über je 48 Feldzüge: **6 Siege bei Spalte 6–9, 14 bei 4–6**, gegen 18
ohne Wall.

**Die Basteien waren ein stiller Verlust.** Beim Bauen löschte ich die vier
Mauerfelder der Bastei — `isValidTowerPlacement` verlangt aber Stein unter dem
Turm. Fiel der Turm, war der Bauplatz für den Rest der Station weg. Wer Türme
verlor, konnte irgendwann gar nicht mehr bauen. Jetzt werden die Felder nur
verdeckt und kommen beim Fall des Turms wieder zum Vorschein.

### Was es gekostet hat

Über je 48 Bot-Feldzüge, mit demselben Bot:

| | Siege | Stürme | Züge/Kampf |
| --- | --- | --- | --- |
| ohne Wall | 18/48 (38 %) | 30 % | 9,5 |
| Wall, Frist 8 | 12/48 (25 %) | 32 % | 9,1 |
| Wall, Frist 9 | 16/48 (33 %) | 31 % | 9,8 |
| …mit Torhaus als Tor | 18/48 (38 %) | 27 % | 9,7 |
| …frei am Wall bauen, Wall bei 6–8 | **22/48 (46 %)** | **27 %** | 9,6 |

Der Festungskampf ist strukturell länger — alles muss durchs Tor, und das Feuer
steht auf einer festen Linie statt verteilt auf dem Feld. Dafür bekommt er
**einen Zug mehr Frist** (`9 + ⌊Runde/4⌋`).

Die letzten beiden Zeilen waren Überraschungen. Das Torhaus als echtes Tor hat
die Bilanz nicht gekostet, sondern sie auf den Stand vor dem Wall gehoben — der
**engere Durchlass** (vorher zwei Felder Lücke, jetzt eine Einfahrt von einem
Feld) staut die Belagerer, und jeder gestaute Zug ist ein Schussfenster mehr.

Und das freie Bauen am Wall hat sie darüber hinaus gehoben, obwohl der Wall
gleichzeitig zwei Spalten **nach vorn** rückte (von 4–6 auf 6–8, weil er der
Burg auf den Füßen stand). Fünfundzwanzig Stellen statt sechs Podesten wiegen
den kürzeren Anmarsch mehr als auf.

Eine Warnung an mich selbst aus dieser Runde: Ich hatte zwischendurch den
Testbot zweimal geändert und danach gegen die *alte* Messzahl verglichen. Das
sah nach einem Einbruch von 40 auf 0 Prozent aus. Mit demselben Bot auf beiden
Ständen waren es 38 gegen 15 — immer noch ein echter Unterschied, aber ein
ganz anderer. Eine Messzahl gilt nur für das Messgerät, mit dem sie entstand.

## Das Startdeck: zehn Karten, vier Sorten

Vorher waren es zwölf Karten aus sechs Sorten — Palisade, Wachturm, Waldläufer,
Bogenschütze, Sturmwind, Krone. Das las sich wie eine Auswahl, nicht wie eine
Handschrift: man zog jede Sorte selten genug, um nie einen Plan daraus zu
machen. Jetzt sind es **zehn Karten aus vier Sorten**, und jeder Zug stellt
dieselben vier Fragen:

| Karte | Art | Kosten | Anzahl | Frage |
| --- | --- | --- | --- | --- |
| Wachturm | Gebäude | 2 | 3 | Wo baue ich? |
| Waldläufer | Einheit | 1 | 3 | Wen stelle ich drauf? |
| Zinnen | Fähigkeit | 1 | 3 | Was schütze ich? |
| Krone der Belagerung | Macht | 3 | 1 | Halte ich die große Karte? |

Eine Karte je Kategorie, und ein Deck, das sich alle zwei Züge einmal durchhat.

### Zinnen

Die einzige neue Karte. Sie sind **kein Heilen und kein Block, der am Zugende
verfällt** — sie liegen als eigener Vorrat oben auf den Lebenspunkten des Turms:

```js
const aufZinnen = Math.min(turm.zinnen || 0, e.dmg);
turm.zinnen -= aufZinnen;
turm.hp -= e.dmg - aufZinnen;
```

Was am Stein zerspringt, erreicht den Turm nicht. Früh gesetzt sind sie später
noch da; aufgebraucht sind sie aufgebraucht. Über dem Turm stehen sie auch als
Zinnen da — ein Stein je zwei Punkte, höchstens zehn, daneben die genaue Zahl
(`drawZinnen`). Ein Balken wäre einfacher gewesen, aber die Karte heißt Zinnen.

### Was das Deck gekostet hat, und was es zurückbekam

Das kleinere Deck richtet weniger aus: kein Bogenschütze mehr, keine Palisade,
kein Sturmwind, und der Waldläufer ist die schwächste Einheit im Spiel. Über je
48 Bot-Feldzüge gemessen:

| | Siege | Stürme | Züge/Kampf |
| --- | --- | --- | --- |
| altes Deck, Frist 7 | 20/48 (42 %) | 28 % | 8,4 |
| neues Deck, Frist 7 | 17/48 (35 %) | **35 %** | 8,6 |
| neues Deck, Frist 8 | 19/48 (40 %) | 30 % | 9,4 |

Bei den Siegen liegt der Unterschied unter einer Standardabweichung. Die
Sturmquote ist das echte Signal — sie stammt aus über fünfhundert Kämpfen je
Zeile, und 35 gegen 28 Prozent ist kein Rauschen: die Kämpfe wurden schlicht
nicht mehr rechtzeitig fertig. Darum bekommt die Frist **einen Zug mehr**
(`8 + ⌊Runde/4⌋` statt `7 + ⌊Runde/4⌋`). Das stellt beides wieder her.

Zwei Dinge, die dabei nicht funktioniert haben und wieder draußen sind:

- **Die Verteilung zu verschieben** (3/4/2/1, 4/4/1/1, 4/3/2/1). Dieselbe
  Konfiguration lieferte in drei Durchläufen 4, 5 und 7 Siege von 16 — bei
  sechzehn Läufen sind ±2 Siege eine Standardabweichung, die ganze Messreihe
  war Rauschen. Erst 48 Läufe trennen die Fälle.
- **Zinnen +1 Reichweite**, solange sie stehen. Thematisch schön, gemessen
  wirkungslos (13/48, Sturmquote unverändert). Eine Mechanik, die nichts
  bewirkt, ist nur Komplexität.

## Kein Schuss von allein

Es gab einmal die **Salve**: am Zugende feuerte jeder Turm, der noch geladen
war, von selbst auf sein bestes Ziel — Turm für Turm im Takt, mit steigendem
Ton und einer großen Schadenszahl in der Bildmitte. Gedacht war sie als
Rhythmus und als Ersparnis an Klickarbeit.

Sie hat aber die Entscheidung mitgenommen. Wer von Hand zielte, korrigierte
nur noch eine Automatik, die meistens recht hatte — und die wusste nicht
einmal, was gefährlich ist:

```js
const wert = (schaden >= e.hp ? 1000 : 0) + schaden * 10 - e.hp - d;
```

`e.dmg` kommt darin nicht vor, und `d` ist der Abstand zum *Turm*, nicht zur
Burg. Die Salve zählte Abschüsse, nicht Bedrohung, und knallte lieber einen
halbtoten Späher ab, als das Katapult zu bearbeiten.

**Jetzt schießt kein Turm mehr von allein.** Jeder Schuss ist ein Klick, jeder
Zug eine Reihe von Entscheidungen. Was du nicht anweist, bleibt ungenutzt.
Drei Dinge tragen das:

- Die **⚔-Plakette** am Turm hat drei Zustände: grau `⚔ –` (hat geschossen),
  grün (geladen, aber nichts in Reichweite) und **gold** (geladen und ein Ziel
  da — hier wartet ein Schuss auf dich).
- Der **Zug-beenden-Knopf** glüht rot statt gold, solange Türme ungenutzt sind.
  Aus einer Verheißung ist eine Warnung geworden.
- Die **Zugzeile** zählt sie mit: `◎ 3 Türme ungenutzt`.

Geblieben ist der **Tonaufstieg**. Der erste Schuss eines Zuges klingt am
tiefsten, jeder weitere eine Stufe höher (`schussKlang`, zurückgesetzt in
`zugAbschluss`). Die Tonleiter spielt jetzt der Finger des Spielers statt der
Rechner.

Zielen kostet weiterhin keinen Tatendrang. Der gehört den Karten; die
Entscheidung am Turm ist *worauf*, nicht *ob*.

Gemessen über 24 Bot-Feldzüge, mit einem Bot, der jeden Turm selbst anweist:
**11 von 24 Siegen, 28 Prozent Stürme, 8,5 Züge je Kampf** — dieselben Zahlen
wie mit Salve. Wer jeden Turm anweist, richtet genauso viel aus wie die
Automatik; er entscheidet nur selbst, wohin.

## Gewicht gegen Tempo

Lange liefen alle Belagerer ungefähr gleich schnell und trafen ungefähr gleich
hart. Der Grund war nicht die Tabelle, sondern eine einzige Zeile darunter:

```js
dmg: t.dmg + belagerungsSchaden(runde)   // + Math.floor(runde / 1.7)
```

Der Zuschlag war **additiv** und galt für alle. In Station 17 bekam jeder +10.
Aus einem Späher mit 1 Schaden wurde 11, aus einer Ramme mit 5 wurde 15 — zwei
Einheiten, die sich als Bedrohung kaum noch unterschieden. Die Skala hat den
Unterschied gefressen, den die Tabelle aufgebaut hatte.

Jetzt wächst die Wucht **mal statt plus**:

```js
const belagerungsWucht = (runde) => (1 + 0.085 * (runde - 1)) * feldzugHaerte(state.feldzug || 1);
```

Wer schwer anfängt, wird schwer — wer kratzt, kratzt weiter. Dazu geht schweres
Gerät langsamer und braucht mehr Züge bis ans Tor. Gemessen an der nackten Burg,
vom rechten Feldrand aus:

| Typ | Züge bis zum ersten Schlag | Bewegung | Reichweite | LP | Schaden Station 1 / 17 |
| --- | --- | --- | --- | --- | --- |
| Späher | 5 | 5 | 1 | 5 | 1 / 2 |
| Armbrustschütze | 6 | 3 | 4 | 8 | 2 / 5 |
| Ritter | 7 | 3 | 1 | 23 | 5 / 12 |
| Ramme | 9 | 2 | 2 | 41 | 11 / 26 |
| Katapult | 12 | 1 | 7 | 21 | 9 / 21 |
| Belagerungsmeister | 9 | 2 | 2 | 92 | 14 / 33 |

Damit ist jeder Typ eine eigene Frage. Der Späher ist in fünf Zügen da und
kostet fast nichts — man lässt ihn laufen. Die Ramme braucht neun Züge, aber
ihre neun Züge sind eine Uhr: wenn sie ankommt, ist ein Viertel der Burg weg.
Das Katapult kriecht ein Feld je Zug und schlägt trotzdem aus sieben Feldern
Entfernung zu; es fällt in die späten Fristen, in denen zwölf Züge reichen.

Schweres Gerät ist auch teurer im Wellenbudget (Ramme 12 Punkte statt 7,
Katapult 9 statt 6). Späte Aufgebote sind deshalb **kleiner, langsamer und
tödlicher** statt einfach größer.

Weil eine Ramme spät fast 30 Schaden auf einmal setzt, steigen die Burg-LP von
35 auf **50**. Ein Tor, das zwei Schläge nicht überlebt, macht jeden Durchbruch
endgültig — und genau diese Zahlen brauchen Raum. Gemessen über je 24
Bot-Feldzüge bleibt die Schwierigkeit dabei, wo sie war: 11 von 24 Siegen gegen
12 von 24 vorher, Stürme bei 28 statt 25 Prozent. Verändert hat sich nicht, wie
schwer es ist, sondern woran man stirbt.

Beim Anmarsch zeigte ein Katapult bisher nur `➤ 1` und las sich damit harmlos.
Schweres Gerät trägt seine Plakette deshalb in Bronze statt in Sandfarbe.

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

## Die Bauwerks-Engine

Zwei Dinge liessen das Spielfeld flach und billig aussehen, und mehr Textur hat
gegen keines von beiden geholfen.

**Erstens war alles im selben Braunton.** Sand, Stein, Holz, Schatten — die
ganze Palette lag im warmen Ocker. Ohne Farbkontrast gibt es keinen Blickfang
und kein Volumen.

**Zweitens war jedes der sechzehn Gebäude derselbe 2×2-Kasten.** Die Karte
sagte „Bergfried" oder „Palisade", auf dem Feld stand beide Male dasselbe.

### Das Licht

Es gibt eine Sonne von rechts oben. Aus der Grundfarbe eines Stoffs leitet
`flaechen()` drei Flächenfarben ab:

| Fläche | Verschiebung |
| --- | --- |
| Deckfläche | 30 % zum warmen Sonnenlicht |
| beschienene Wand | 6 % zum warmen Sonnenlicht |
| abgewandte Wand | **36 % ins kühle Blauviolett** |

Die letzte Zeile ist der wichtigste Teil. Schatten in Braun sehen tot aus,
Schatten in Blauviolett lassen dieselbe Farbe leben. Zehn Stoffe sind
definiert — Quaderstein, Bruchstein, Putz, Holz, Stamm, Erde, Ziegel,
Schiefer, Stroh — jeder mit eigener Textur. Ziegelrot und Schieferblau sind
dabei bewusst kräftig: Sie sind die einzigen Farbakzente auf dem Feld.

### Die Modelle

Ein Bauwerk ist eine Funktion, die Teile in einen Modellraum malt: `teilQuader`,
`teilDach`, `teilKegel`, `teilZinnen`, `teilPfahl`, `teilFahne`, `teilFenster`.
Das Argument `f` läuft beim Bauen von null auf eins, damit es aus dem Boden
wächst.

Achtzehn Modelle, jedes mit eigener Silhouette: die Palisade ein Ring
angespitzter Stämme, der Lugaus eine Plattform auf vier Pfosten mit Strohdach,
der Hohe Horst ein schlanker Turm unter einem blauen Kegeldach, der alte Turm
halb eingestürzt und mit Efeu bewachsen, die Pechnase mit auskragendem Erker
auf Konsolen, der Doppelturm zwei Türme mit einem Steg dazwischen, die
Grenzfeste ein Bergfried zwischen zwei Flügeln mit Wimpeln.

Auch **die Burg** läuft über diese Engine: derselbe Mauerring mit Zinnen, vier
Ecktürme unter Schieferkegeln, das Torhaus mit Fallgitter zum Feld hin, der
Bergfried mit Ziegeldach und Banner, dazu ein flackerndes Feuer im Hof. Sie
spricht damit dieselbe Sprache wie die Türme davor, statt als einziges Bauwerk
aus der Reihe zu fallen.

`MODELL_HOEHE` sagt, auf welcher Höhe die Besatzung steht — sonst stünde der
Bogenschütze beim Lugaus in der Luft und beim Erdwall im Stein.

Gemalt wird jedes Modell einmal in ein eigenes Bild, in Zehntelschritten der
Bauhöhe, und danach nur noch aufgesetzt. Fünf Turmarten auf dem Feld brauchen
fünf Bilder. Ein Bildaufbau kostet damit rund 16 Millisekunden.

## Das Gelände

Vorher würfelte jede Kachel ihre Farbe für sich. Das Ergebnis war Rauschen:
technisch variiert, aber ohne Form. Jetzt liegen **zusammenhängende Flächen**
auf dem Feld — trockenes Gras, Sand, Geröll und festgetretene Erde.

Gemacht wird das mit weichem Rauschen in **zwei Lagen**: eine grobe bestimmt,
wo eine Fläche liegt, eine feinere bricht ihre Ränder auf. Mit nur einer Lage
entstehen rechteckige Klötze — das war beim ersten Versuch deutlich zu sehen.

Dazu ein **Weg vom Lager zum Burgtor**: festgetretene Erde mit zwei Rillen und
Randsteinen, auf der Linie, auf der das Belagerungsgerät heranrollt.

Der Boden folgt derselben Lichtordnung wie die Bauwerke: warm in der Höhe,
kühl in der Senke. Und `bodenVerschattung` dunkelt die Kachel dort ab, wo sie
an Mauerwerk stößt — die Kehle zwischen Wand und Grund. Ohne sie stehen die
Bauwerke *auf* dem Boden statt *darin*. Das kann nicht in den vorgemalten
Boden, weil sich die Türme ändern, wird also live gerechnet, aber nur für die
Felder ringsum.

### Ein Wehrturm trägt kein Dach

Lange saß auf Wachturm, Wehrgang, Lugaus, Doppelturm, Bergfried, Hohem
Horst und Grenzfeste ein Ziegel-, Schiefer- oder Strohdach. Es sah hübsch
aus und war falsch: `MODELL_HOEHE` — die Höhe, auf der die Besatzung steht —
war bei jedem dieser Modelle **genau die Höhe, auf der das Dach ansetzt**.
Die Bogenschützen standen also auf dem First.

Der Fehler war nicht die Zahl, sondern das Dach. Ein Turm, aus dem geschossen
wird, hat oben eine offene Kampfplattform; ein geschlossenes Dach nimmt dem
Schützen die Sicht. Jedes dieser Modelle trägt jetzt statt des Daches:

    Wachturm      auskragende Hurde mit hölzerner Brustwehr
    Wehrgang      Bohlenboden mit Brustwehr
    Lugaus        offener Ausguck mit Geländer
    Doppelturm    zwei Zinnenkränze
    Hoher Horst   auskragender Kranz mit Zinnen
    Bergfried     offene Plattform zwischen vier Ecktürmen
    Grenzfeste    Zinnenkrone

Dafür gibt es ein neues Bauteil, `teilBruestung()`: vier Balken auf den
Kanten einer Fläche, von hinten nach vorn gemalt. Die Burg selbst behält ihr
Dach — dort steht keine Besatzung.

Bei der Gelegenheit vier Modelle, bei denen die Besatzung in der Luft stand,
weil `MODELL_HOEHE` über der wirklichen Plattform lag: Alter Turm (Körper 28,
Figur auf 33), Zwinger (Ring 18, Figur auf 26), Schanze (Boden 20, Figur auf
30) und Palisade (Steg auf halber Höhe). Bei allen vieren ist jetzt der
Baukörper auf die Standhöhe gezogen, nicht die Standhöhe gesenkt — sonst
stünden sie wieder unter der Wallkrone.

### Jedes Bauwerk steht über seinem Wall

Palisade, Erdwall und Wallgraben waren mit 15 bis 19 Bildpunkten **niedriger
als die Ringmauer**, die sie tragen sollen. Das sah aus, als hätte man einen
Turm in den Graben gebaut. Die Untergrenze liegt jetzt bei 25, also sieben
Punkte über der Wallhöhe von 18; Palisade und Erdwall haben dafür einen
Flechtzaun beziehungsweise eine höhere Krone bekommen.

## Mauerwerk und Boden

Lange war jede Wand **eine einzige Farbfüllung** mit ein paar blassen Strichen
darüber. Neben den harten Pixeln der Figuren sah das flach und fremd aus: zwei
Bildsprachen in einem Bild.

Jetzt bekommt jede Fläche echtes Mauerwerk:

- **Steinlagen im Verband.** Jede Lage ist gegen die darüber versetzt, jeder
  Stein hat seinen eigenen Ton.
- **Fugen und Grate.** Über jedem Stein ein heller Grat, darunter eine dunkle
  Fuge, dazu die senkrechten Stoßfugen.
- **Moos am Fuß**, dort wo die Mauer im Boden steht.
- **Kanten:** heller Grat zum Licht hin, dunkle Naht in der Kehle.
- Die Deckflächen bekommen Plattenfugen und einzelne hellere Platten.

Der Boden dazu: Sandriffel, Trockenrisse, Kiesel mit eigenem kleinen Schatten,
trockene Grasbüschel und die Wagenspur, auf der das Gerät herangerollt wird.
Lage und Länge der Riffel fallen je Kachel anders aus — sitzen sie gleich,
bilden sie über das Feld regelmäßige Streifen.

### Warum das schneller ist als vorher

Jeden Bildaufbau so viele Steine zu malen wäre unbezahlbar. Deshalb wird jeder
Quader **einmal in ein eigenes kleines Bild gemalt** und danach nur noch
aufgesetzt. Der Schlüssel ist Form, Höhe, Farbe und eines von sechs
Steinmustern; zwei gleiche Türme teilen sich also dasselbe Bild.

Damit ersetzt ein einziges `drawImage` die vielen Einzelflächen von früher.
Gemessen mit fünf Türmen, Mauerring und Aufgebot: **13,7 Millisekunden je Bild
gegenüber 18,1 vorher** — mehr Detail und trotzdem schneller.

Zwei Fallen dabei: Die Aufbauanimation eines Turms durchläuft jede Höhe
einzeln und legte allein dafür über hundert Bilder an. Deshalb wird die Höhe
auf gerade Werte gerundet und es gibt nur sechs Steinmuster statt eines je
Position. Und der Vorrat wirft das älteste Bild weg, statt bei Überlauf alles
auf einmal zu leeren; sonst hätte es an genau dieser Stelle geruckelt.

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

## Der Waldläufer

Eine Vorlage im doppeldeutschen Blatt gab die Richtung vor: ein Grenzgänger
in Grün, Schlapphut mit Feder, Umhang über den Schultern, Köcher im Rücken,
der Langbogen in der Hand, und zwei Gefährten im Hintergrund. Daraus kamen
drei Änderungen, zwei davon an allen Karten.

**Doppelte Zeichenschärfe.** Das Kartenbild wird jetzt in `BILD_SCHAERFE = 2`
gemalt und halb so groß eingesetzt. Die Motive rechnen weiter in ihren alten
Maßen — es war eine Zeile in `paintCardArt` —, bekommen aber die doppelte Zahl
an Bildpunkten. Erst damit trägt eine Zeichnung Falten, Riemen und Federn
statt nur Klötze. Das gilt für alle 75 Karten.

**Das Kartengewand.** Das Namensband war dunkel und schnitt das Bild in der
Mitte durch; im Blatt ist es ein helles Schriftband *auf* dem Bild. Es hat
jetzt hellen Grund und dunkle Schrift, außen die schwarze Linie, innen die
Farbe der Seltenheit — die Seltenheit bleibt also lesbar. Dazu Eichenlaub mit
roten Eicheln in zwei Ecken; die anderen beiden gehören den Eckzeichen. Der
Zweig wird einmal gemalt und als Hintergrundbild gesetzt.

**Die Figur selbst.** Der erste Versuch war ein grüner Klotz mit einem Kreuz
darauf. Was eine Figur bei sechsundvierzig Bildpunkten Höhe lesbar macht, ist
nicht die Zahl der Riemen, sondern die Silhouette: schmaler Hals, breite
Schultern, ein Arm am Bogen, ein Umhang, der unten in Zipfeln ausläuft. Das
Motiv setzt drei davon nebeneinander — einer vorn, zwei kleinere dahinter.

Dazu ein eigenes Sprite. Der Waldläufer trug bisher die Figur des
Bogenschützen und war auf dem Turm nicht von ihm zu unterscheiden; jetzt hat
er breite Hutkrempe mit Feder, grünen Umhang und den Köcher im Rücken. Dafür
kam ein Farbpaar in die Figurenpalette:

    n  Wald        #2f5228
    N  Wald hell   #5b8c48

Beide stehen in der Werkstatt zur Wahl, und der Waldläufer ist dort
bearbeitbar wie jede andere Figur.

### Echte Bilder statt gemalter Motive

Ein gezeichnetes Motiv ist eine Nacherzählung, keine Kopie. Wer eine Vorlage
*exakt* auf der Karte haben will, braucht die Datei selbst. Dafür gibt es
jetzt einen Bildpfad:

    bilder/waldlaeufer.png          die Zeichnung allein, wird gespiegelt
    bilder/waldlaeufer.ganz.png     bringt beide Hälften und das Band schon mit

    node scripts/kartenbilder.mjs

Das Werkzeug verkleinert jede Datei auf Kartenmaß, kodiert sie als JPEG und
schreibt sie als Datenadresse in den Block `KARTEN_BILDER` in `index.html`.
Datenadressen, weil die veröffentlichte Seite nichts von außen laden darf —
und weil das Spiel eine einzige Datei bleiben soll.

Verkleinert wird mit dem Browser, den Playwright mitbringt; auf dieser
Maschine liegt keine Bildbibliothek. Fehlt Playwright, wandert die Datei
unverändert hinein und sollte dann von sich aus klein sein.

Ein Bild in `zuschnitt.json` bekommt einen Ausschnitt in Anteilen der
Bildkante — nützlich, wenn die Vorlage schon einen eigenen Rahmen und
Eckzeichen mitbringt, die das Spiel ohnehin selbst zeichnet.

Zwei Dinge, die erst im Gebrauch auffielen: Die Stationsansichten setzen eine
eigene Bildhöhe und gewinnen über die Kennung — eine Bildkarte hing dort oben
und darunter blieb Papier. Und eine geschärfte Karte trägt sonst ein `+` im
Namen; bei einer Bildkarte steht der Name im Blatt und lässt sich nicht
ändern, sie bekommt deshalb ein goldenes Zeichen in der Ecke.

**Was eine Bildkarte anders macht.** Ein ganzes Bild bringt Rahmen, Schriftband,
Eichenlaub und sein eigenes Eckzeichen schon mit. Die Karte blendet ihre
eigenen also aus und gibt dem Bild die Höhe, die sonst der Spruch bekommt
(166 statt 104 Punkte). Was bleibt, sind die **Werte** — Kosten, Kartenfarbe,
Schaden, Reichweite. Die stehen bei einer Bildkarte unter dem Bild statt in
der Ecke, weil sie sich im Lauf ändern: Kosten sinken beim Schärfen,
mitwachsende Karten zeigen ihren jetzigen Wert. Ein festes Bild könnte das
nicht und würde lügen.

Die Maße stehen an zwei Stellen und müssen zusammenpassen: `BILDFELD` in
`index.html` und `BREITE`/`HOCH`/`HOCH_MIT_BILD` im Werkzeug. Sonst wird das
Bild gestreckt.

Und: auch eine Datenadresse wird erst nebenher entschlüsselt. Ohne ein
Nachzeichnen, sobald das letzte Bild liegt, zeigte die Karte beim ersten
Aufbau das gemalte Motiv und behielt es, weil niemand sie noch einmal
anfasste.

Zur Größe: bei Anzeigemaß wiegt ein Kartenbild als JPEG rund 20 KB. Alle
fünfundsiebzig wären also etwa 1,5 MB gegen eine Grenze von 16 MB. Der Platz
ist nicht das Problem, die fünfundsiebzig Zeichnungen sind es.

## Zahlen muss man lesen können

An Zahlen hängt hier jede Entscheidung — wie viel Schaden dieser Schuss macht,
wie viele Züge bis zum Sturm bleiben, wie viel die Burg noch hält. In der
Pixelschrift sind bei zwölf Punkten **2 und 8, 1 und 7, 6 und 9** kaum
auseinanderzuhalten. Aus `35/35` wurde `38/35`.

Der erste Versuch zog die Grenze falsch: nur Zahlen bekamen eine eigene
Schrift, alles andere blieb in der Pixelschrift. Das war Flickwerk — die
Pixelschrift trägt schlicht erst **ab etwa achtzehn Punkten**. Darunter wird
sie zur Ratearbeit, bei Kartennamen und Legenden genauso wie bei Ziffern.

Die Grenze läuft jetzt an der Schriftgröße, nicht am Inhalt:

| | |
| --- | --- |
| Pixelschrift | die vier großen Überschriften (21–26 px), das Standartentuch (38 px) |
| Anzeigeschrift | **alles andere** — Kartennamen, Meldungen, Legende, Knöpfe, Werte, Preise |

Zahlen bekommen darin zusätzlich Ziffern gleicher Breite. Der Ton des Spiels
hängt ohnehin nicht an der Beschriftung, sondern an der Pixelgrafik; die
Schrift muss vor allem lesbar sein.

## Die Feldzugskarte

Die Route lag lange als Reihe glänzender Knöpfe in einem dunklen Nichts. Sie
zeigte zwar, wohin es geht, aber nicht, **wo man ist**. Darunter liegt jetzt
eine gezeichnete Karte:

- Pergament mit Flecken und Fasern, zum Rand hin angeschnitten, mit einer
  Tintenlinie eingefasst
- Wiese im eigenen Land unten, ein Waldgürtel in der Mitte, Gebirge im Land
  des Belagerers oben
- ein Fluss quer durchs Blatt, die eigene Burg auf einem Sockel unten, die
  Feste des Belagerers oben, dazu Windrose und eine Kartusche

Entscheidend ist dabei nicht, *was* gemalt wird, sondern **wo nicht**.
Gleichmäßig verteilte Bäume sind Tapete; ein Land hat Dickichte und
Lichtungen. Über die Fläche läuft deshalb ein weiches Rauschfeld: wo es hoch
steht, drängen sich die Zeichen, wo es einbricht, bleibt offenes Land. Um die
Stationen bleibt ohnehin Platz, sonst wächst der Wald über den Marsch.

Gemalt wird einmal je Feldzug in ein eigenes Bild. Der Würfel hängt an der
Feldzugsnummer — jeder Feldzug sieht anders aus, aber immer gleich.

Die Wege sind Tinte: ungegangene gestrichelt eingezeichnet, gegangene
nachgezogen, wählbare rot. Die Stationen sind Siegel auf dem Pergament —
heller Grund, Tintenring, ein Tropfen Farbe in der Art der Station, darauf
das gezeichnete Zeichen. Die Zeichen waren vorher Schriftzeichen (`⚔ ☠ ⚖`),
die jedes System anders malt; auf einer gezeichneten Karte sitzt so etwas wie
ein Fremdkörper.

## Batallione

Eine Einheit ist im Bild nicht ein Mann, sondern **drei**: der mittlere einen
Schritt vor und größer, zwei Flanken etwas höher dahinter. Das gilt für die
Besatzung der Türme wie für die Belagerer.

Ein Turm zeigt dabei immer genau **ein** Batallion. Zwei mal drei Figuren wären
auf einer Turmkrone nur noch Gedränge; stehen zwei Einheiten darauf, stellt die
erste die Mitte und die zweite die Flanken, so sieht man beide Waffen.

Einzeln bleiben **Ramme und Katapult** — drei Rammen wären drei Rammen, nicht
eine — und der **Belagerungsmeister**: dass er allein kommt, ist sein ganzer
Punkt.

Für die Regeln ändert das nichts. Ein Batallion ist, wie eine Einheit
*aussieht*, nicht wie sie rechnet.

## Die Belagerer schießen

Belagerer feuerten bisher gar nicht. Sie lehnten sich ins Ziel, und der Schaden
erschien — das sah aus, als rannten sie dagegen. Jetzt feuert auch ihr
Batallion, aus allen drei Stellungen, und der Anlauf ist zu einem Ruck
geschrumpft.

Eine Ausnahme: die **Ramme** behält ihren Anlauf. Sie ist ein Rammbock, sie
soll dagegenknallen; das ist ihr Zweck.

Auch die Türme feuern jetzt dreifach — aus jeder Stellung des Batallions ein
Geschoss, kurz nacheinander. Geschosse dürfen dafür seitlich versetzt starten
und laufen zum Ziel hin zusammen.

## Figuren und die Werkstatt

Lange gab es genau **zwei** Figuren im ganzen Spiel, jede neun mal neun Felder:
eine für deine Leute, eine für alle Angreifer. Späher, Armbrustschütze, Ritter
und Belagerungsmeister waren dieselbe Figur in anderer Farbe.

Heute sind es neun Figuren zu **elf mal dreizehn** Feldern. Neun mal neun ließ
keinen Platz für Haltung und Licht, und daneben hatte durch die Bauwerks-Engine
alles andere im Bild inzwischen Volumen.

Die Palette führt dieselbe Ordnung wie die Stoffe der Bauwerke: **kleine
Buchstaben sind Schatten, große sind Licht.** `s`/`S` Haut, `b`/`B` Tuch,
`r`/`R` Wappenfarbe, `m`/`M` Metall, `y`/`Y` Holz, `g`/`G` Gold, `k`/`K`
Kontur. Damit bekommen die Figuren dasselbe Licht wie die Mauern, statt flach
davor zu stehen.

Jetzt hat jeder seine eigene Silhouette: der Späher schmal mit Kapuze, der
Armbrustschütze mit der Waffe quer vor der Brust, der Ritter mit Helm,
Federbusch und eisernen Schultern, der Belagerungsmeister mit Krone und
Umhang. Auf den Türmen zeigt die Besatzung ihre Waffe: Bogen, Speer, Armbrust,
Schleuder oder Fackel, je nachdem, welche Karte dort steht. Ramme und Katapult
sind gar keine Figuren mehr, sondern gezeichnete Maschinen.

### Selbst zeichnen

Der Knopf `✎` oben rechts öffnet die **Werkstatt**. Dort liegen alle neun
Figuren als Raster; es richtet sich nach der Figur, nicht umgekehrt. Man wählt eine Farbe und malt;
jede Änderung wirkt sofort im Spiel, auch mitten im Kampf. Eine geänderte
Figur trägt in der Auswahl ein `✎`.

| Knopf | Was er tut |
| --- | --- |
| Zurücksetzen | Nimmt die mitgelieferte Figur zurück. |
| Ausgeben | Schreibt die Figur ins Textfeld, zum Kopieren und Weitergeben. |
| Einlesen | Nimmt eine Figur aus dem Textfeld an. |

Gespeichert wird im Browser (`localStorage`), das überlebt einen Neustart.
Wer eine Figur fest ins Spiel bauen will, gibt sie aus und ersetzt damit das
Raster im Quelltext — die Buchstaben in der Werkstatt sind genau dieselben wie
dort.

Bei den Angreifern tauscht der Gegnertyp `r` und `R` gegen seine eigene Farbe,
alles andere bleibt. Deshalb reicht **eine** Zeichnung für alle Farbvarianten.

## Die Anzeige ohne Emoji

Emoji waren die deutlichste Ansage, dass hier etwas im Browser läuft: jedes
System zeichnet sie anders, und keines zeichnet sie in unserem Stil. Ein 🏰
neben gehauenem Stein sieht aus wie ein Fremdkörper, weil es einer ist.

Alle Sinnbilder sind deshalb eigene Pixelbilder, gebaut wie die Figuren — ein
Raster aus Buchstaben, eine Palette, und `ikoneBild()` malt daraus ein
Bildchen, das als Hintergrund an jedem `[data-ikone]` hängt:

    fackel  Tatendrang      muenze   Sold
    burg    Burgleben       stapel   Zugstapel
    ablage  Ablagestapel    sanduhr  Die Frist
    schwerter Gegner        horn     Ton
    pinsel  Werkstatt       rolle    Hilfe

Gezeichnet wird in glattem Vierfachen auf ein Kästchen von zweiundzwanzig
Punkten, also genau zwei Bildpunkte je Rasterfeld. Krumme Vergrößerungen
verwischen die Kanten, und verwischte Pixelbilder sehen aus wie ein Versehen.

Dazu ein paar Änderungen an derselben Stelle:

- **Tatendrang als Flammen statt als Bruchzahl.** Sechs kleine Lichter, von
  denen erlischt, was du ausgibst. Abzählbar, ohne lesen zu müssen.
- **Der Knopf ist eine eisenbeschlagene Bohle**, keine rote Farbverlauf-Pille:
  Maserung in Streifen, vier Nieten, eine dicke Fase nach unten. Steht eine
  Salve bereit, glüht das Eisen.
- **Das Standartentuch statt des schwarzen Balkens.** Früher fuhr eine
  Einblendung über die volle Breite herein, wie sie jede Netzseite hat. Jetzt
  fällt ein Tuch an zwei Seilen herab, mit Schwalbenschwanz, Falten, Naht und
  Goldlinie.
- **Karten aus gebüttelter Pappe.** `#fffdf4` war das Lauteste am Bildschirm;
  jetzt liegt eine warme Tönung mit feiner Faserung darunter, und die Hand
  ruht in einer Leiste aus Holz, statt über dem Feld zu schweben.
- **Tieferes Gelände.** Boden, Mauer und Himmel hatten denselben Hellwert, und
  ohne Wertunterschied gibt es kein Bild. Der Grund ist jetzt erdig und dunkel,
  damit gehauener Stein darauf der hellste Fleck bleibt; die Vignette ist
  kräftiger und hat unten einen Sockel, in dem die Kartenhand liegt.

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

### Auslöser und Skalierung

Bis vor Kurzem war jede der 75 Karten eine feste Zahl: plus zwei Schaden, sechs
Schaden, ein Platz mehr. Damit konnte sich nichts aufschaukeln, und einem
Deckbuilder fehlt dann das Wichtigste: der Moment, in dem das eigene Deck etwas
Absurdes tut. Zwei Felder ändern das.

**`je` lässt eine Wirkung mitwachsen** mit dem, was gerade auf dem Feld steht.
Gezählt werden kann: Türme, Einheiten, Gegner auf dem Feld, gefallene Gegner,
Karten auf der Hand, fehlende Burg-Lebenspunkte.

```js
{ id: 'steinschlag', cost: 2,
  sofort: { flaeche: 1 },
  je: { zaehler: 'proTurm', wirkung: { flaeche: 1 } } }
```

Auf der Karte steht dann nicht nur die Regel, sondern auch, wie hoch sie
**gerade** ausfällt — bei vier Türmen `Jetzt: 5 Schaden auf alle Gegner`.

**`wenn` trägt eine Wirkung ein, die später von selbst greift.** Sechs
Auslöser: wenn ein Gegner fällt, wenn du einen Turm errichtest, wenn einer
deiner Türme fällt, wenn die Burg getroffen wird, wenn ein Turm schießt, zu
Beginn jedes Zuges.

```js
{ id: 'blutzoll', cost: 3,
  wenn: { ausloeser: 'gegnerFaellt', dann: { alleSchaden: 1 }, gesamt: 5 } }
```

### Warum Auslöser eine Obergrenze brauchen

Ohne Grenze schaukelt sich eine Maschine an einer Station mit sechzehn Gegnern
ins Unermessliche. Blutzoll ohne Deckel ging im Test von 2 auf 11 Schaden je
Salve und gewann neun von zehn Läufen fast ohne Burgschaden.

Deshalb gibt es zwei Deckel: `jeZug` begrenzt, wie oft ein Auslöser in einem
Zug greift, `gesamt`, wie oft an einer Station insgesamt. Beide stehen auf der
Karte, sonst wäre sie gelogen. Schärfen hebt den Deckel um zwei
beziehungsweise eins, statt die Wirkung zu vergrößern.

Mit Deckel: sieben von zehn Läufen bestanden, gegenüber sechs von zehn ohne
jede Maschine. Die Maschinen belohnen also, wer sie sucht, statt jedem Lauf
geschenkt zu werden.

### Eine Karte, die nachzieht, muss etwas kosten

Eine Karte, die sich ihren eigenen Tatendrang zurückgibt und dabei nachzieht,
holt sich nach dem Mischen des Ablagestapels selbst wieder auf die Hand. Der
Zug endet dann nie. `bezahlbarkeitSichern` erzwingt deshalb für jede Karte
Nettokosten von mindestens einem Tatendrang, sowohl beim Laden des Stapels als
auch nach jedem Schärfen.

## Die Ringmauer

Sobald der erste Turm steht, schließt sich eine Mauer um Burg und Türme. Sie
kostet nichts, hat keine Lebenspunkte und hält niemanden auf: Gegner laufen
weiterhin auf den nächsten Turm zu und danach weiter. Sie ist reine Zier.

Der **Hof** ist die konvexe Hülle über alle Grundflächen. Über jede Kante eines
Hoffeldes, hinter der kein Hof mehr liegt, läuft ein Stück Mauer. Kanten an
Bauwerken bleiben frei, dort ist das Bauwerk selbst die Mauer. Kommt ein Turm
dazu, wächst die Mauer von selbst dorthin; die neuen Stücke steigen aus dem
Boden auf wie die Türme.

### Wo ein Belagerer steht, schließt sich kein Ring

Eine Hülle über alle Bauwerke hat einen Haken: Ein neuer Turm weit draußen
zieht sie mit und schließt jeden Gegner ein, der dazwischen steht. Man baut
einen Turm und hat Belagerer im eigenen Hof. Bei 600 zufälligen Stellungen
passierte das in **455** Fällen.

Die Mauer weicht deshalb jedem Gegner aus: `raeumeGang` sucht vom Feld des
Belagerers den kürzesten Weg aus dem Hof heraus und nimmt ihn aus dem Hof. Die
Mauer buchtet dort nach innen ein, solange er steht, und schließt sich wieder,
sobald er fällt oder weiterzieht. Deshalb enthält der Schlüssel des
Zwischenspeichers auch die Gegnerpositionen, nicht nur die Türme.

Bei denselben 600 Stellungen steht danach **kein einziger** Gegner im Hof. Ein
Neuberechnen mit acht Gegnern kostet 0,23 Millisekunden.

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
- **Kein Fortschritt zwischen den Läufen.** Keine Freischaltungen, alle 75
  Karten ab Lauf eins. Es gibt keinen Grund, warum Lauf 12 sich anders anfühlen
  sollte als Lauf 2.
- **Nur ein Endgegner.** Station 17 ist immer derselbe Kampf gegen denselben
  Mann.
- **Wenig Ton.** Die neuen Kartenwirkungen klingen alle gleich.
- **Keine eigenen Bilder.** Alles ist im Code gezeichnet. Eingespielte Grafiken
  und Klänge fehlen noch; dafür bräuchte es einen Lader, und im veröffentlichten
  Artifact müssten die Bilder eingebettet sein, weil die Seite nichts von außen
  holen darf.
- **Die Figuren sind noch grob.** Neun mal neun Felder lassen wenig Raum; das
  Kartenbild ist deutlich weiter als das Feld.
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
gemeinsamer Weg für allen Schaden, `pruefeMauer`, `raeumeGang` und `drawMauerstueck` für die
Ringmauer, `endTurn` und `nimmBelohnung` für den Ablauf, `enemyPlan` für die Absicht eines Gegners,
`resolveEnemyTurn` für den Gegnerzug sowie `towerReach` und `towerDamageAt` für
Reichweite und Salve eines Turms.

Darstellung: `isoX` und `isoY` rechnen aufs Raster um, `cellFromPoint` ist die
Umkehrung für Klicks, `zeichenReihenfolge` löst die Verdeckung topologisch auf,
`drawBlock` und `drawMerlons` bauen Mauerwerk, `drawSprite` malt die
Pixelfiguren, `drawBadge` die Plaketten und `paintCardArt` die Bilder auf den
Karten.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
