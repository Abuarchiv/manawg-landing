# HAND: Hand-Pässe aus Blender (Stand: Zwischenstand, wird ergänzt)

Die Hand, die das Handy hält, ist kein Kapsel-Gebilde mehr, sondern ein in Blender gerendertes, anatomisch echtes Modell (Linkshand-Griff, Daumen links am Rand, vier Finger um den rechten Rand, Handballen und Unterarm hinter dem Handy, Unterarm nach links unten). Die Engine bekommt keine Bilder, sondern Daten-Pässe und zeichnet daraus wie bisher Halbton-Punkte.

Dateien: `public/hand/hold.webp` (Atlas), `public/hand/hold.json` (Kachel-Tabelle). Alles in Bühnenkoordinaten der Engine (1280 × 800, Handy-Mitte 800/400).

## Koordinaten

- Handy außen (Silhouette, wie `Ende` in `overlays.tsx`): `x 650, y 90, w 300, h 620, r 48`.
- Bildschirm (Platz für die echte App): `x 661, y 101, w 278, h 598, r 37` (Inset 11).
- Bühnen-px = 4,19 px/mm in der Handy-Ebene (Handy 71,6 × 147,6 × 7,8 mm, Eckenradius 11,5 mm).

## Atlas

`hold.webp`, 8 Bit Grau, 2240 × 2724. Kacheln laut `hold.json` (`tiles.<name>`: `x, y, w, h, div`). `div = 2` heißt: halbe Auflösung, bilinear hochskalieren.

| Kachel | Inhalt |
|---|---|
| `lum` | Leuchtdichte (sRGB-Anzeigewert 0..1), Studiolicht oben links, Hautstreuung, Kanten als Tinte eingebacken |
| `a` | Alpha der Hand (Handy ist Holdout: Alpha 0 dort, wo das Handy die Hand verdeckt) |
| `nx`, `ny` | Normale im Bildraum, 0..255 = −1..1 (x nach rechts, y nach oben) |
| `z` | Tiefe relativ zur Handy-Vorderseite, 0..255 = −100..+100 mm, plus = weiter weg |

Bühnen-Position der Kachel `lum`/`a`: `origin` (Bühnen-px, oben links) und `scale` (Kachel-px je Bühnen-px, 1,5).
Kachel-Pixel `u = (x − origin.x) · scale / div`, `v = (y − origin.y) · scale / div`.

## Vorn/hinten

Aus `z` und der Handy-Silhouette, nicht eingebacken: `vorne = sdf(Handy außen) < 4 && z < 1,5 mm`. Vorne = Zeichenfläche über dem Handy (`mix-blend-mode: difference`), alles andere = Fläche unter dem Handy.

## Lizenz / Credits

Basismodell: „Hand – Realistic“ aus dem Blender-Studio-Paket Human Base Meshes v1.4.1, Autor Dan Ulrich, Lizenz CC0. Alles Weitere (Rig, Pose, Nägel, Hautdetails, Material, Licht, Render) ist eigene Arbeit.
