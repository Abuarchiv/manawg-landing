# Brief: neue ManaWG-Landing, inspiriert von Lusion

Quelle: eigene Lusion-Analyse vom 2026-09-05 (19 Segmente, 266 s Aufnahme).

## Was Lusion gut macht

1. Ruhige Bedienebene (Logo, Nav, Typo, gerundete Bildrahmen) bleibt stabil, während die 3D-Bühne im Fenster lebt.
2. Scrollen verändert den Status eines Elements: ein kleines geneigtes Bild wird zur Bühne für die nächste Szene und kehrt später als Oberfläche zurück.
3. Mehrere Zeitarten: Lesefluss, Eingabe, Film, selbstlaufende räumliche Passage nach einem Auslöser (bei Lusion ca. 10 s ohne weitere Eingabe).
4. Ein wiederkehrendes Motiv (Astronaut) hält mehrere Bildwelten und Seiten zusammen.
5. Nach der Inszenierung folgt eine ruhige Auswahlfläche mit Mikrobewegung (Pfeil beim Hover), die nicht mit dem Inhalt konkurriert.

## Konsequenzen für ManaWG

- Vor Code: Storyboard mit Ein- und Austritten der Szenen, Eingaben, Rückwegen. Festlegen, wann der Besucher die Zeit steuert und wann die Seite.
- Ein eigenes Motiv für ManaWG statt Astronaut. Assets in Blender bauen, Motion-Tests in TouchDesigner, dann Web (three.js / R3F).
- Ruhige Zonen sind produktiv: Verständnis, Auswahl, Einstieg in app.manawg.com.
- Erster Qualitätsnachweis: eine 15–20-s-Studie mit einem echten Übergang zwischen zwei Zuständen, nicht die ganze Seite.
- Handy zuerst (Rest der ManaWG-Regeln gilt weiter: kompakte Skala, Phone-only-Layout).

## Live-Durchgang 2026-10-01 (Desktop, Chrome)

Ablauf der Startseite, in Scroll-Reihenfolge:

1. **Hero:** Claim oben, darunter gerundetes dunkles Fenster mit 3D-Kreuzteilen (Blau/Schwarz/Weiß). Ein Klick tauscht die Farbwelt (z. B. Blau → Limette), die Teile treiben dauernd.
2. **Statement:** „Bold Ideas, Brought to Life", riesige Typo, eine farbige Linie zeichnet sich beim Scrollen ins Bild.
3. **Reel:** Blumen-Clip wächst zum breiten Fenster, „PLAY REEL" mit zentralem Play-Button.
4. **Featured Work:** ruhiges 2er-Raster, großes Bild, kleine Leistungszeile, Projektname. Beim Weiterscrollen kippen die Karten leicht in 3D.
5. **Weltpassage:** „Where Creative Ideas Become Immersive Experiences" mit türkiser Linie, dann Schnitt ins Schwarz: Astronaut, riesiges „LET'S…", Flug durch Gitter-Tunnel (Neon-Glitch), Kristallröhre, blauer Bogengang. Der Scroll steuert die Kamerafahrt.
6. **Footer:** Adresse, Kontakt, Newsletter. Darunter „ABOUT US / NEXT PAGE": weiteres Scrollen füllt einen Fortschrittsbalken und löst den Seitenwechsel aus.
7. **Seitenwechsel:** diagonale Wisch-Blende, dann Pixel-Loader „L… LOADING" (bei uns ca. 20 s), dann About mit Partikel-Wolke über riesigem „LUSION" und Mondlandschaft mit Lichtsäule.

Technik, soweit von außen sichtbar: Astro, eigenes WebGL ohne globales three.js, virtueller Scroll (Dokument hat `overflow: hidden`, Wheel-Events treiben alles), eine Schrift (Aeonik), Menü als gestapelte gerundete Karten rechts oben.

**Was wir übernehmen:** heller ruhiger Rahmen um ein dunkles 3D-Fenster; Klick als Spielzeug (Farbwechsel) ohne Pflicht; scroll-gesteuerte Kamerafahrt als Höhepunkt; Footer als Übergang zur nächsten Seite.

**Was wir nicht übernehmen:** 20-s-Loader und gekaperter Scroll. ManaWG ist Handy-first, also nativer Scroll mit Scroll-Timeline statt Wheel-Hijack, und Assets klein genug für mobile GPUs.
