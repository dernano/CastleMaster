# Soundtrack

Hier hinein kommen die Stücke, die im Spiel laufen. Standardname:

    musik/soundtrack.mp3

Mehr als eins geht auch — dann in `index.html` die Liste `MUSIK` erweitern:

```js
const MUSIK = [
  'musik/soundtrack.mp3',
  'musik/belagerung.mp3',
];
```

Ein einzelnes Stück läuft im Kreis, mehrere gehen der Reihe nach durch.

## Warum keine Datenadresse im Quelltext

Kartenbilder werden in `index.html` eingebettet, Musik nicht. Ein Kartenmotiv
sind vierzig Kilobyte; ein Stück Musik sind einige Megabyte, und als Base64 im
Quelltext wäre `index.html` zehnmal so groß, bei jeder Änderung neu im Verlauf
und von Hand nicht mehr zu lesen. Die veröffentlichte Seite bekommt die
Dateien stattdessen als Beilage mit — dieselbe Herkunft, also nichts von außen.

## Was zu beachten ist

- **Format:** MP3, OGG oder M4A. MP3 ist am sichersten.
- **Größe:** Höchstens 15 MB je Datei, 64 MB für die ganze Seite — so viel
  lässt die Veröffentlichung zu. Praktisch reichen 128 kbit/s für
  Hintergrundmusik völlig; das sind rund 1 MB je Minute.
- **Anfang und Ende:** Ein einzelnes Stück läuft in Schleife. Ohne sauberen
  Übergang hört man die Naht bei jedem Durchlauf.
- **Rechte:** Nur einspielen, was dir gehört oder wofür du eine Lizenz hast.
  Die Seite ist veröffentlicht, auch wenn sie zunächst privat ist.

## Im Spiel

Der Notenknopf oben rechts schaltet die Musik. Er erscheint nur, wenn eine
Datei wirklich geladen werden konnte — fehlt sie, bleibt es still und es gibt
keine Fehlermeldung. Die Einstellung merkt sich der Browser (`cm-musik`).

Browser lassen Ton erst zu, nachdem der Benutzer etwas angefasst hat. Die
Musik beginnt darum beim ersten Klick oder Tastendruck, nicht beim Laden.
