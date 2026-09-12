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

Ist auf dem Bild mehr zu sehen als in die Karte soll — etwa weil es schon
einen eigenen Rahmen und Eckzeichen mitbringt —, steht der Ausschnitt in
`zuschnitt.json`, in Anteilen der Bildkante:

    {
      "waldlaeufer": { "x": 0.06, "y": 0.08, "w": 0.88, "h": 0.46 }
    }

## Was das Spiel weiter selbst zeichnet

Rahmen, Eckzeichen mit den Kosten, die Werte-Pillen und der Regeltext bleiben
vom Spiel gezeichnet, auch wenn ein Bild da ist. Sie ändern sich im Lauf: die
Kosten sinken beim Schärfen, mitwachsende Karten zeigen ihren jetzigen Wert.
Ein festes Bild könnte das nicht und würde lügen.
