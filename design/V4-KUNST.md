# V4: von der Demo zur Kunst-Website

Stand 2026-10-08. Grundlage: der umgesetzte Entwurf `final.dc.html` (Motion 1:1 portiert), die Recherche (`BRIEF.md`, `RESEARCH.md`, `MOTION.md`, Lusion-Studie, Awwwards-Aufnahmen in `~/Company/unterlagen/recherche/award-motion-study-2026-10-01/`) und die Inspiration des Nutzers (`~/Documents/inspration/`, `Landing/`, `neu/`).

## Was die Recherche sagt und wo wir stehen

| Lehre | Quelle | Stand der Seite |
|---|---|---|
| Ein Material, ein Bild, nie fünf Effekte | Awwwards-Muster 1, Inspiration `Landing/` (Halbton, ASCII, Dither) | Halbton und ASCII ziehen sich durch. Die Szenen sind aber Inseln: jede hat ihr eigenes Material und endet mit einem Schnitt. |
| Scrollen ändert den Status eines Elements | Lusion (kleines Bild wird Bühne und kehrt als Fläche zurück) | Seit V3 gehen Körper, Tiefe und Planet ineinander über. Das Handy in der Hand bleibt ein Bild und wird nie zur Bühne. |
| Interaktion ist Belohnung, keine Pflicht | Don't Board Me, Messenger, Bruno Simon | Körper werfen, Planet drehen und ins Handy tippen gibt es. Der Zeiger macht aber in jeder Szene etwas anderes. |
| Typo ist selbst Animation | Lusion, Chungi, Lando | Nur die Tiefe (Wörter aus Zeichen). Die Überschriften der anderen Szenen stehen einfach da. |
| Ruhige Zonen sind produktiv | Lusion (Auswahlfläche nach der Inszenierung) | Installieren und Fragen sind ruhig, aber ohne eigenes Bild. Sie wirken dadurch wie eine andere Seite. |
| Schwächen der Gewinner: Handy, Ladezeit, Barrierefreiheit | Awwwards-Auswertung | Unser Vorsprung: Handy-Komposition, reduzierte Bewegung, kein Lader über 1 s. Er bleibt Pflicht. |

## Die fünf Hebel (in dieser Reihenfolge)

1. **Ein Korn für alles.** Jede Szene entsteht aus dem Staub der vorigen und zerfällt in den Staub der nächsten. Das Prinzip ist umgesetzt für Körper → Tiefe → Planet → Installieren und kommt jetzt an die übrigen Nähte: Wohnung → Hand, Hand → So geht's (Ziffern setzen sich aus dem Flutband zusammen), Fragen → Finale (die ASCII-Sonne geht aus dem Staub auf). Am Ende gibt es auf der ganzen Seite keinen harten Schnitt mehr.
2. **Das Handy wird zur Bühne (Signature-Moment).** Nach „Alltag teilen.“ fährt die Kamera beim Weiterscrollen in den Bildschirm. Die echte App füllt kurz das ganze Fenster, die Hände treten aus dem Bild. Dann zerfällt die App-Oberfläche in Pixel und wird zum Flutband, aus dem „So geht's“ entsteht. Das ist die Lusion-Lehre „Status ändert sich“ mit unserem eigenen Motiv: die echte App.
3. **Der Zeiger ist Licht.** Auf der ganzen Seite ist der Zeiger dieselbe Lichtquelle: Er hellt den Halbton auf (Berg, Flut, Körper, Hand, Planet, Sonne). Eine Regel statt sechs Spielzeuge. Auf Touch übernimmt ein langsamer Autopilot, bei reduzierter Bewegung bleibt das Licht stehen.
4. **Überschriften verdichten sich aus Punkten.** „Acht Orte. Eine WG.“, „Auf den Home-Bildschirm.“ und „Alltag teilen.“ setzen sich beim Eintritt aus demselben Korn zusammen (Abtastung wie in der Tiefe). Danach stehen sie als echte Schrift, lesbar und auswählbar. Kein Buchstaben-Zufallswechsel (Scramble ist 08/15).
5. **Die ruhigen Zonen bekommen ein Bild.** Installieren und Fragen liegen auf einem kaum sichtbaren Punktfeld, das beim Öffnen einer Antwort eine Welle wirft. Das Feld ist ruhig und liegt nie hinter Text (Kontrast bleibt wie bisher über 15:1).

Bewusst nicht: Ton (erst wenn alles andere sitzt), Lader-Show, Partikel mit Bloom, KI-Bilder, Scroll-Hijack.

## Code

Die Landing wird vollständig TypeScript (`AUFTRAG-TS` im Arbeitsordner der Sitzung): typisierte Szenen-Zustände, keine `any`, `hand.js` (1169 Zeilen) in benannte Teile zerlegt. Die Hebel 1 bis 5 werden erst nach der Umstellung gebaut, damit nichts doppelt angefasst wird.

## Prüfung je Hebel

Jede Naht wird als Bildfolge (`naht.mjs`: Abschnittskante von einer Fensterhöhe darüber bis 10 % darunter, 12 Bilder) bei 1440 × 900 und 390 × 844 aufgenommen und angesehen. Dazu kommen reduzierte Bewegung, Konsole ohne Fehler und Bildzeit unter 16 ms auf dem M3.
