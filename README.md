# Castle Master

Ein rundenbasiertes Deckbuilding-Kartenspiel im Browser. Du errichtest Türme,
besetzt sie mit Einheiten und verstärkst sie mit Fähigkeiten. Die Kartenfarben
folgen dem doppeldeutschen Blatt.

Der Stand in diesem Repository ist der Prototyp aus dem Chat, unverändert
übernommen. Er zeigt den Kern-Loop: Turm bauen, dann Einheit platzieren.

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
`Runde beenden` füllt den Tatendrang auf und zieht eine neue Hand. Türme und
Einheiten bleiben über Runden hinweg stehen.

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

- **Kein echtes Deck.** Jede Runde besteht die Hand aus allen sechs Pool-Karten,
  nur neu gemischt. Es gibt keinen Nachzieh- und keinen Ablagestapel.
- **Kein Deckbuilding.** Karten lassen sich während einer Partie nicht erwerben.
- **Kein Gegner und kein Kampf.** Der Schadenswert der Einheiten wird nirgends
  ausgewertet.
- **Kein Sieg und keine Niederlage.** Die Partie läuft endlos weiter.

## Aufbau

Alles steckt in `index.html`: Stil, Aufbau und Logik. Der Kartenpool ist das
Feld `CARD_POOL` ganz oben im Skript, der Spielzustand das Objekt `state`.

`scripts/serve.js` ist ein statischer Dev-Server ohne Abhängigkeiten.
