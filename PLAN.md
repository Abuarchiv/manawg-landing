# Plan: Award-Landingpage „Die WG“

Stand 2026-10-01. Nur Plan, noch kein Bau. Annahme: Konzept 1 „Die WG“ (änderbar, Alternativen unten).

## Ziel

Site of the Day auf Awwwards (Score ab 7,5) plus Developer Award.

| Kriterium | Gewicht | Unser Hebel |
|---|---|---|
| Design | 40 % | Eine Bildidee, 2–3 Farben (Neutral 950 / FAFAFA + Akzent), Inter Tight groß |
| Usability | 30 % | Nativer Scroll, Handy zuerst, CTA immer erreichbar |
| Kreativität | 20 % | Begehbare 3D-WG, Tag/Nacht-Schalter |
| Inhalt | 10 % | Echte Funktionen der App, kurze deutsche Texte |

Dev Award: Animationen, Barrierefreiheit, Ladezeit, Responsive, SEO, Markup. Referenz Colonia Zacamil (SOTD 2026-10-01) holt nur 6,4 bei Barrierefreiheit, da schlagen wir sie.

## Idee

Eine Wohnung in 3D von schräg oben, gebaut in Blender. Scrollen fährt die Kamera durch die Räume. Jeder Raum ist eine Funktion der App. Vier Mitbewohner als kleine Figuren aus der Bildmarke (Kreise).

## Szenen

1. **Hero:** Ganze WG von oben bei Nacht, Fenster leuchten. Claim: „Zusammen wohnen. Einfach geregelt.“ CTA „WG erstellen“.
2. **Wohnzimmer = Ausgaben:** Kassenbon auf dem Tisch, 48 € teilen sich in 4 × 12 € zu den Figuren.
3. **Bad = Putzplan:** Aufgabenschild wandert im Kreis von Figur zu Figur.
4. **Küche = Einkaufsliste:** Kühlschrank öffnet, Artikel werden abgehakt.
5. **Flur = Pinnwand:** Zettel fliegen an die Wand, „gelesen“-Häkchen.
6. **Ende:** Kamera zoomt raus, Licht geht an, die Wohnung wird zum App-Icon. CTA „WG erstellen“, Rechtslinks.

Gag: Schalter Tag/Nacht ändert Licht der ganzen Szene (zwei gebackene Lightmaps).

## Technik

- Next.js 15 (bestehendes Repo), three.js, nativer Scroll mit Lenis, keine Scroll-Sperre.
- Blender: Low-Poly-Wohnung, Licht gebacken, glTF mit Draco + KTX2, unter 3 MB.
- TouchDesigner: Übergangs- und Partikeltests vor dem Web-Bau.
- Handy: 60 fps auf Mittelklasse-Android, adaptive Auflösung.
- Reduzierte Bewegung: statische Standbilder pro Szene.
- Bestehend weiter nutzen: Rechtsseiten, Redirects zu app.manawg.com, CSP, Markenschriften.

## Ablauf

| Schritt | Dauer |
|---|---|
| 1. Storyboard: 6 Standbilder aus Blender, Freigabe durch dich | 2 h |
| 2. Blender: Wohnung, Figuren, Licht backen, Export | 1 Tag |
| 3. TouchDesigner: Motion-Tests Übergänge | ½ Tag |
| 4. Web: Szenen, Texte, Kamera-Pfad | 1–2 Tage |
| 5. Feinschliff: Lighthouse > 90, a11y, Handy-Test Android + iPhone-Sim | ½ Tag |
| 6. Einreichen bei Awwwards (kostenpflichtig) | du |

## Alternativen

- **Acht Körper:** Die acht Kreise der Marke als flüssige 3D-Tropfen. Markentreu, leicht, aber abstrakter. Ein Code-Ansatz dafür liegt unkommittet im Arbeitsordner.
- **Typo-Bühne:** Große kinetische Schrift, wenig 3D. Schnell, aber zu wenig Kreativität für einen Award.

## Referenzen

lusion.co (Ruhige Rahmen um 3D-Bühne, Scroll-Kamerafahrt), igloo.inc, cerebrium.ai, butter.video (3D-Objekte als Markenträger), Colonia Zacamil (Karte + Tag/Nacht).
