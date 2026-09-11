# Castle Master

Ein rundenbasiertes Deckbuilding-Kartenspiel im Browser. Du errichtest Türme,
besetzt sie mit Einheiten und verstärkst sie mit Fähigkeiten. Die Kartenfarben
folgen dem doppeldeutschen Blatt.

Grundlage ist der Prototyp aus dem Chat mit seinem Kern-Loop: Turm bauen, dann
Einheit platzieren. Darauf aufgesetzt ist inzwischen ein echtes Deck mit
Nachzieh- und Ablagestapel.

## Starten

```bash
npm start          # http://localhost:5173
```

Kein `npm install` nötig, das Projekt hat keine Abhängigkeiten. Der Dev-Server
ist ein kleines Node-Skript. Ein Doppelklick auf `index.html` funktioniert
ebenfalls, weil alles in einer Datei steckt.

## Kartenfarben und Typen

| Farbe | Typ | Wirkung |
| --- | --- | --- |
| 🌰 Eichel | Gebäude | errichtet einen Turm mit einem Platz |
| ❤ Herz | Einheit | wird auf einen freien Turmplatz gesetzt, hat Schaden |
| 🍃 Blatt | Fähigkeit | verstärkt eine Einheit um 1 Schaden |
| 🔔 Schellen | Macht | globaler Effekt, gibt allen Türmen einen Platz |

## Ressource und Runden

`Tatendrang` ist die Ressource, drei Punkte pro Runde. Karten kosten davon.
`Runde beenden` legt die restliche Hand ab, füllt den Tatendrang auf und zieht
fünf Karten nach. Türme und Einheiten bleiben über Runden hinweg stehen.

## Deck

Das Deck besteht aus zwölf Karten und zirkuliert wie in einem klassischen
Deckbuilder. Gespielte und am Rundenende übrige Karten wandern auf den
Ablagestapel. Ist der Nachziehstapel leer, wird die Ablage gemischt und zum
neuen Nachziehstapel. Karten gehen nie verloren, die Summe aus Nachziehstapel,
Hand und Ablage ist immer zwölf.

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

## Aktueller Kartenpool

| Karte | Typ | Kosten | Schaden |
| --- | --- | --- | --- |
| Wachturm | Gebäude | 2 | – |
| Palisade | Gebäude | 1 | – |
| Waldläufer | Einheit | 1 | 2 |
| Bogenschütze | Einheit | 2 | 3 |
| Sturmwind | Fähigkeit | 1 | – |
| Krone der Belagerung | Macht | 3 | – |

## Was noch fehlt

Der Prototyp bildet den Kern-Loop ab, mehr nicht. Offen sind:

- **Kein Deckbuilding.** Das Deck zirkuliert, aber es lässt sich während einer
  Partie nicht verändern. Es fehlt eine Möglichkeit, Karten zu erwerben.
- **Kein Gegner und kein Kampf.** Der Schadenswert der Einheiten wird nirgends
  ausgewertet.
- **Kein Sieg und keine Niederlage.** Die Partie läuft endlos weiter.

## Aufbau

Alles steckt in `index.html`: Stil, Aufbau und Logik. Der Kartenpool ist das
Feld `CARD_POOL` ganz oben im Skript, der Spielzustand das Objekt `state` mit
den drei Stapeln `draw`, `hand` und `discard`.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
