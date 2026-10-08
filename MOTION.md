# Bewegungsanalyse: 21 Awwwards-Gewinner (2026-10-01)

Videos (MP4, 1280 px, ca. 50 s je Seite) und Bildstreifen liegen lokal in `~/Company/award-motion-study-2026-10-01/<seite>/`. Aufgenommen mit echtem Scrollen, Pointer-Kreis und einem Klick. Colonia Zacamil brach nach 4 s ab, Bruno Simon ist ein Spiel (nur Tastatur), Orano/Persepolis/Pioneer hängen am Cookie-Banner oder an Scroll-Sperren.

## Die 8 Bewegungs-Techniken, die Gewinner wirklich nutzen

| # | Technik | Wo gesehen | Wie es wirkt |
|---|---|---|---|
| 1 | **Logo-Maske als Übergang** | Lando (Logo wird Fenster, Gesicht erscheint darin), Zentry (Logo zoomt riesig, Inhalt im Dreieck), Lusion (L-Pixel-Loader) | Erster Eindruck = Marke. Der Lader *ist* die Animation. |
| 2 | **Objekt baut sich auf** | Igloo: Drahtgitter → Glühen → Eisblöcke → Schneelandschaft wächst aus dem Boden (ca. 3 s) | Aus Nichts wird Welt. Sehr hoher Wow-Wert. |
| 3 | **Ein Held-Objekt dreht sich mit dem Scroll** | Oryzo: Korkuntersetzer kippt und rotiert, während Text daneben steht. Lusion: Astronaut | Ein Ding, ganz nah, Material zum Anfassen. |
| 4 | **Text zerfällt / setzt sich zusammen** | Lusion: Wörter laufen auseinander, Astronaut fliegt durch die Lücke. Lando: Text wird von Akzent-Blöcken freigewischt. Chungi: Zeilen gleiten nacheinander rein, Kreis zeichnet sich um ein Wort | Typo ist selbst Animation, nicht Beiwerk. |
| 5 | **Handschrift / Linie zeichnet sich** | Lando: Unterschrift zeichnet sich in Neongelb. Lusion: blaue Linie läuft durch die Seite. Chungi: Kreis um „works“ | Menschlich, persönlich, verbindet Abschnitte. |
| 6 | **Kreis-Wischer als Szenenwechsel** | Don't Board Me: Hund erscheint in wachsendem Kreis aus dem Ball | Spielerischer Übergang, kein harter Schnitt. |
| 7 | **Spiel als Eingang** | Don't Board Me („Bounce a ball“), Messenger („Begin“), Bruno (Auto fahren) | Besucher handelt sofort, bleibt länger. |
| 8 | **Karten / Fenster kippen in 3D** | Lusion Featured Work, Zentry (schräge Panels), Jesper (gebogene Galerie), Active Theory (schwebende Projekttafeln) | Raumgefühl ohne volle 3D-Szene. |

## Rhythmus, den alle teilen

1. **Intro 2–6 s** (Logo/Lader als Animation) – nie eine leere weiße Seite.
2. **Hero mit lebendigem Objekt**, das auf Maus reagiert.
3. **Wechsel laut ↔ leise:** nach jeder großen Bewegung kommt ruhiger Text oder ein Raster.
4. **Ein Höhepunkt** in der Mitte (Igloo-Portal, Lusion-Weltraumflug, Oryzo-Neonrand).
5. **Footer als Abschluss-Szene** (Lando: Helm + „Always bringing the fight“, Lusion: „Next page“-Balken).

## Was wir für ManaWG übernehmen (Plan, noch kein Bau)

| Szene | Technik | ManaWG-Umsetzung |
|---|---|---|
| Intro | 1 Logo-Maske | Die acht Kreise der Bildmarke fliegen zusammen, die Aussparung öffnet sich als Fenster in die WG. |
| Hero | 2 Objekt baut sich auf | Die WG-Wohnung baut sich als Miniatur auf (Drahtgitter → Wände → Möbel → Licht an), wie Igloo. |
| Ausgaben | 3 Held-Objekt | Ein Kassenbon dreht sich groß im Bild, 48 € zerfällt in 4 × 12 €. |
| Putzplan | 5 Linie zeichnet sich | Eine Linie zieht die Aufgabe von Zimmer zu Zimmer. |
| Statement | 4 Text zerfällt | „Zusammen wohnen“ läuft auseinander, eine Figur läuft durch die Lücke. |
| Funktionen | 8 Karten kippen | Einkaufsliste, Pinnwand, Kalender als gekippte Karten. |
| Ende | 6 Kreis-Wischer | Kreis öffnet sich zur App, CTA „WG erstellen“. |

Spiel-Element (7): Tippen auf ein Fenster der WG schaltet dort das Licht an.

## Technik-Hinweise

- Alle Gewinner laufen mit WebGL (three.js oder eigene Engine), GSAP-ScrollTrigger, Lenis-Smooth-Scroll.
- Assets: Blender für Wohnung und Figuren, gebackenes Licht. TouchDesigner für Übergangs-Tests (Aufbau-Effekt, Partikel).
- Handy: Die meisten Gewinner sind auf dem Handy schwach. Unser Vorteil: dieselben Szenen, aber Hochformat-komponiert und unter 3 MB.
