# Kartenbilder

Hier hinein kommen echte Bilder für einzelne Karten. Der Dateiname ist die
Kennung der Karte aus `CARD_POOL`, also zum Beispiel:

    bilder/waldlaeufer.png          die Zeichnung allein
    bilder/waldlaeufer.ganz.png     bringt beide Hälften und das Schriftband mit

Danach einmal

    node scripts/kartenbilder.mjs

aufrufen. Das Werkzeug verkleinert jedes Bild auf Kartenmaß, kodiert es als
JPEG und schreibt es als Datenadresse in den Block `KARTEN_BILDER` in
`index.html`. So bleibt das Spiel eine einzige Datei — die veröffentlichte
Seite darf nichts von außen laden.

## Ausschnitt

Ein ganzes Blatt (`*.ganz.png`) wird **nicht** beschnitten: es behält sein
Seitenverhältnis, und die Karte lässt dafür unten den Streifen für die Werte.
So bleibt der gedruckte Rahmen umlaufend geschlossen, wie bei einem
doppeldeutschen Blatt.

Weggeschnitten wird nur, was *außerhalb* dieses Rahmens liegt — der
ausgefranste oder dunkle Rand der Vorlage. Das steht in `zuschnitt.json`, in
Anteilen der Bildkante:

    {
      "waldlaeufer": { "x": 0.035, "y": 0.021, "w": 0.926, "h": 0.956 }
    }

Wo der Rahmen steht, ist messbar statt Geschmack: ein Helligkeitsprofil von
außen nach innen findet die erste dunkle Linie nach dem Papier. Fehlt ein
Eintrag, wird das Bild ganz genommen — für eine Vorlage ohne Rand ist das
richtig.

## Eine neue Karte dazulegen

1. Die Datei nach `bilder/<kennung>.ganz.png` legen (die Kennung ist die
   Karten-Id aus `CARD_POOL`, also `zinnen.ganz.png` für die Karte Zinnen).
2. `node scripts/kartenbilder.mjs` aufrufen.
3. Sieht die Karte an einer Kante zu breit aus, den Rand in `zuschnitt.json`
   eintragen und noch einmal aufrufen.

## Was das Spiel weiter selbst zeichnet

Rahmen, Eckzeichen mit den Kosten, die Werte-Pillen und der Regeltext bleiben
vom Spiel gezeichnet, auch wenn ein Bild da ist. Sie ändern sich im Lauf: die
Kosten sinken beim Schärfen, mitwachsende Karten zeigen ihren jetzigen Wert.
Ein festes Bild könnte das nicht und würde lügen.
