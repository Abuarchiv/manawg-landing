# Audit Fehler und Feinschliff

Stand 2026-10-06 (Runde 2 am Abend, 22:20 bis 23:15) · Branch `landing-produktion` · Quellstand `f28204a` (`src/` ist byte-identisch zu `c766fd3`, dem Stand der ersten Runde, und bis zum aktuellen HEAD `a7839e6` unverändert; `public/` kam seither nur um `public/hand/` dazu, vom Code nicht benutzt) · nur Messung und Befund, am Quellcode wurde nichts geändert.

**Runde 2:** Die Läufe der ersten Runde (Vormittag bis 18:38, Prod-Build `c766fd3`, Server :3140) wurden auf einem frischen Prod-Build von `f28204a` (eigener Server :3152) wiederholt. Alle Befunde haben sich bestätigt, die Zahlen decken sich bis auf Lastschwankungen der Maschine (z. B. Finale unter 4x Drosselung 56 gegen 71 fps). Präzisiert wurde die Wheel-Schwelle von F-01, korrigiert die Saldo-Aussage in F-11. Neu in Runde 2 und mit **(neu)** markiert: Tastatur- und Handy-Wisch als sichere Auslöser von F-01, F-19 (Rückmeldung), F-20 (Texte, Rechtsseiten), die Zeichenrate bei 60 Hz in F-06, WebKit, Ladeverhalten unter Drosselung, Speichertest, Touch-Taps und Abnahmekriterien (Abschnitt 11).

Belege liegen im Scratchpad (nicht im Repo): `S = /private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/fehler/`. Runde 1 in `S/v2/`, Runde 2 in `S/v3/` (dort `old/` mit den auf :3152 umgestellten Skripten aus Runde 1). Überall Skripte (`*.mjs`), Rohdaten (`out/`) und Bilder (`shots/`). Jede Zahl unten stammt aus einem dieser Läufe. Querverweise: `V-xx` = `vollbild.md`, `T-xx` = `text.md`.

---

## 1. Ergebnis in Kürze

1. **Konsole und Netzwerk sind sauber.** 0 Fehler, 0 Warnungen, 0 fehlgeschlagene Anfragen in allen Läufen (Laden, Volldurchlauf, alle Interaktionen). 14 Anfragen beim Laden, rund 275 kB (JS 142 kB, Schriften 125 kB). Alle CTAs und Links sind wohlgeformt und die Ziele antworten mit 200 (`/neu?action=create` wird von der App ausgewertet).
2. **Fast alle Interaktionen funktionieren:** Handy-Tabs, Abhaken, Ausgabe, Antworten, Körper greifen und werfen, Planet ziehen, Install-Tabs, FAQ, Anker, Maus und Tastatur an den Bedienelementen, Taps am Handy-Viewport **(neu)**. Nicht in Ordnung: **Tippen auf Planeten-Orte tut auf Touch nichts**, **die Planeten-Beschriftung ist auch mit Maus nicht klickbar**, **die Tab-Reihenfolge ist falsch**, ein **unsichtbarer Skip-Link fängt Klicks** (F-04, F-05) und **kein einziges Bedienelement reagiert auf Hover** außer dem Skip-Link (F-19, neu).
3. **Wichtigster Fehler (F-01): Nach jedem Sprung bleibt der Zustand der Intro-Szene stehen.** Sichere Auslöser: die **Taste End** (von T 6400: das ganze Hand-und-Handy-Bild füllt das Fenster über dem Footer), Deep Links (`/#fragen` usw.), der erste Tab-Druck, Leertaste und Bild-ab in Folge, und auf dem **Handy jeder Wisch durch die Hand-Szene, schon mit 1 500 px/s (neu)**. Mit dem Mausrad nur unscharf (Reststreifen bis 315 px, siehe F-01). Titel, Hinweise, Raumkarten und das Ende-Overlay (Hand, Handy, `WG erstellen`) bleiben über allen späteren Abschnitten stehen. Reproduziert und gemessen, in Runde 2 erneut. Ursache `hero.js:243`. Das ist die Erklärung für "eingefrorenes Hand-Bild bis zum Footer" und für "Körper und Tiefe nur Schwarz" aus der Sichtprüfung (bei langsamem Wheel-Scrollen rendern beide Szenen sauber, `v3/shots/sheet-1800-1.jpg`).
4. **Ohne WebGL2 bleibt der Lader für immer stehen (F-02)**: schwarzer Bildschirm mit `000`, kein Inhalt, keine Bedienung.
5. **Die Hand-Szene ist die einzige langsame (F-03):** 27 fps auf dem M3 Pro, 6,9 fps bei 4x und 4,7 fps bei 6x CPU-Drosselung (Mittelklasse-Handy). 93 % der Hauptthread-Zeit liegen in `drawHands`, etwa die Hälfte davon in Bildteilen, die sich nie ändern (Haltehand, Daumen). Alle anderen neun Szenen laufen mit 120 fps, auch unter 6x Drosselung (Ausnahme Finale-ASCII: 50 fps).
6. **Das Tempo der Animationen hängt an der Bildwiederholrate (F-06):** Bei 60 Hz dreht der Planet nur halb so schnell (0,075 statt 0,150 rad/s), die Körper brauchen 7 s statt 3,5 s zurück, und **Körper, Tiefe, Planet und Finale zeichnen nur 30 statt 60 Bilder pro Sekunde (neu, gezählt)**. Die Seite zeigt ihr Tempo und ihre Flüssigkeit so, wie sie auf einem 120-Hz-Bildschirm gedacht ist, auf dem üblichen 60-Hz-Laptop und -Handy läuft sie sichtbar ruckeliger und langsamer.
7. **Die adaptive Auflösung rastet nach einem einzigen Ruckler ein (F-07):** Nach einem 320-ms-Frame fällt die Berg-Szene um 38 % in der Schärfe und braucht 0,7 s (bei 60 Hz 1,4 s) zur Erholung.
8. **Reduced Motion wirkt nur auf den Lader und den Anker-Scroll (F-08).** Alle Szenen bewegen sich unverändert (gemessen, 11 Stopps).
9. **Zurück, Neuladen, Größenänderung verlieren die Position (F-09).** Zurück und Neuladen springen auf Anfang und spielen den Lader (2,4 s) neu. Eine Größenänderung springt in eine andere Szene und klemmt am Seitenende (Position danach endgültig weg).
10. **Größen (Abschnitt 7):** Die Flut-Zelle (32 Bühnen-px) ist rund fünfmal gröber als jedes andere Raster der Seite (6 bis 8 px) und ihre Ziffer (10 px) kleiner als das kleinste Label. Dazu kommt: Die Bühne wird auf Fenstergröße hochskaliert (k = 1,23 auf 1800 px, 1,8 auf QHD), dadurch ist **jede** Schrift und jeder Button 23 % bis 80 % größer als im Entwurf. Ein guter Teil des Eindrucks "zu groß" ist dieser Skalierungsfaktor, nicht die Einzelgröße.
11. **Inhalt des Handy-Mocks hat Fehler (F-11):** "1 Dinge stehen auf der Liste", fester Monat "MÄRZ", Saldo springt nach "Ausgabe erfassen" auf 12,00 € und rechnet nur den neuen Posten, umbrechende Zeile bei Kinoabend. Der Mock wird ohnehin durch die echte App ersetzt.
12. **Leere Strecken (F-13):** In der Tiefe haben 21 von 36 Messpunkten unter 2 % helle Pixel, drei Strecken unter 1 % (T 8400-8700, 9300-9700, 10600-10900).
13. **Rückmeldung fehlt (F-19, neu):** CTAs, Tabs, FAQ-Zeilen und Footer-Links haben weder Hover-, noch Fokus-, noch Textmarkierungs-Gestaltung (im Entwurf ist genau ein Hover-Stil vorhanden, am Skip-Link). Auf einer Award-Seite fällt das sofort auf.
14. **Kleinfehler in Texten und Nebenseiten (F-20, neu):** missverständliche erste FAQ-Frage, "AGB" gegen "Nutzungsbedingungen", "Strasse" gegen "Straße", ISO-Datum in den Rechtstexten (bricht am Handy mitten im Datum um), Farb-Emoji auf der 404-Seite. Keine falschen Umlaute in sichtbaren Texten (geprüft).
15. **Stabil (neu):** kein Speicher- oder Listener-Wachstum (3 Durchläufe, 20 Resizes), CLS 0,000 bis 0,005, WebKit ohne Konsolenfehler, Laden auch bei Slow 4G mit 6x CPU-Drosselung nach 4,6 s fertig.

Priorität: F-01 bis F-04 kritisch. F-05 bis F-12 hoch. F-13 bis F-17 und F-19 mittel. F-18 und F-20 Feinschliff. Zu jedem Fund gibt Abschnitt 11 ein messbares Abnahmekriterium.

**Zuordnung zur Sichtprüfung des Hauptagenten (1800x987, 2026-10-06):**

| # | Beobachtung | Befund | Wo |
|---|---|---|---|
| 1 | Vollbild fehlt, Balken links und rechts | `k = min(vw/1280, vh/800)`, 1580 x 987 Bühne in 1800 x 987 | V-01 |
| 2 | Hand und Handy bleiben ab etwa 8800 bis zum Footer stehen | `hero.js:243` parkt den Overlay-Zustand nicht. Mit der Taste End sofort reproduziert (Runde 2) | F-01, V-15, T-03 |
| 3 | Flut-Blöcke verdecken Raumtexte, wirken grob | Zelle 32 px (39,5 px am Bildschirm), Ziffer 10 px. Raumkarten liegen unter der Flut | T-01, Abschnitt 7.3 und 7.4 |
| 4 | Geisterduplikat hinter "Putzplan" | Karten blenden über 90 T ineinander (Übergang Bad-Flur) | T-02 |
| 5 | Körper und Tiefe nur Schwarz mit Labels, Planet nicht gesehen | Kein Init-Fehler: Bei langsamem Wheel-Scrollen rendern alle drei sauber (`v3/shots/sheet-1800-1.jpg`, `sheet-1800-2.jpg`). Ursachen sind das stehende Overlay (F-01), die Fall-Phase der Körper (F-12) und die dünne Tiefe (F-13) | F-01, F-12, F-13, T-10, T-12 |
| 6 | Handy zeigt generische UI | Mock in `overlays.tsx`/`logic.js`, echte App liegt in `design/app-ref/` | F-11, App-Auftrag |
| 7 | Installieren: erfundene Schrittfolge, Mock halb leer | Eigener Auftrag, Ablauf in `design/INSTALL-FLOWS.md` | F-15, Install-Auftrag |
| 8 | ASCII-Elemente zu groß | Flut-Zelle und -Ziffer, Tiefe-Nahzeichen, Lader-Ziffer, FAQ-Marke, Buttons 48 px | Abschnitt 7 |

---

## 2. Messaufbau

- **Server:** Prod-Build von `c766fd3` (Kopie unter `scratchpad/fehler/repo`, `diff -rq src public` identisch zum Arbeitsbaum), `next start -p 3140`. Ports 3100, 4190, 4191 blieben unberührt (3100 nur für ein CPU-Profil gelesen).
- **Browser:** Playwright Chromium, `--use-angle=metal --enable-gpu --ignore-gpu-blocklist`. `UNMASKED_RENDERER` = `ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro)`, also echte GPU. rAF-Takt 120 Hz (Median 8,3 ms). Zusatzlauf mit `--disable-3d-apis` (kein WebGL2).
- **Last:** `uptime` 5 bis 9 bei 12 Kernen, parallel liefen andere Agenten. Fps-Werte sind deshalb Untergrenzen.
- **Viewports:** 1800x987 (Sichtprüfung des Hauptagenten, k = 1,234), 1440x900 (k = 1,125), 1280x800 (k = 1), 390x844 mit DPR 2/3 und Touch (k = 0,305). Für Größen zusätzlich gerechnet: 1920x1080 (k = 1,35), 2560x1440 (k = 1,8).
- **Scrollen:** `page.mouse.wheel` in 60 bis 120 px Schritten, nie `scrollTo`. Wichtig für die Reproduktion: eine Regelschleife mit 22 ms Pause pendelt in der Hand-Szene endlos (`stall.mjs`: ein Wheel-Event wirkt dort erst 1 bis 2 Frames später, die Schleife überschießt abwechselnd um +60 und -60 px). Die Läufe nutzen deshalb offene Schleifen mit Ruhewarten (`lib2.mjs`: `scrollToY`, `goTop`). Das ist zugleich ein Hinweis auf zähes Scrollen in der Hand-Szene.
- **Messmittel:** rAF-Wrapper (Dauer je Callback), CDP-Profiler, Long-Animation-Frames, `readPixels`-Sync für GPU-Zeit, `Emulation.setCPUThrottlingRate`, Pixeldifferenzen zweier Bilder im Abstand von 450 ms, ffmpeg-Einzelbilder aus einem Playwright-Video, axe-core 4.14.
- **Bilder** habe ich selbst angesehen (Kontaktbögen und 1:1-Ausschnitte unter `F/shots/`).
- **T** ist wie in den anderen Audits der `scrollTop` der 1280x800-Bühne (Zeitachse der Engine, 0 bis 15374). Dokument-`scrollY` = T x k.

---

## 3. Übersicht der Funde

| ID | Fund | Schwere | Bereich |
|---|---|---|---|
| F-01 | Zustand der Intro-Szene bleibt nach Sprung stehen (Deep Link, Tab, Taste End, Handy-Wisch) | kritisch | T > 7300 |
| F-02 | Ohne WebGL2 bleibt der Lader für immer stehen | kritisch | ganze Seite |
| F-03 | Hand-Szene 27 fps (M3 Pro), 5 bis 7 fps auf Mittelklasse | kritisch | T 5760-7300 |
| F-04 | Tab-Reihenfolge, unsichtbarer Skip-Link, Fokus und Semantik | kritisch | ganze Seite |
| F-05 | Planet: Touch-Tippen und Beschriftung wirkungslos, Scroll-Falle, keine Tastatur | hoch | T 12207-13007 |
| F-06 | Animationstempo hängt an der Bildwiederholrate | hoch | alle Canvas-Szenen |
| F-07 | Adaptive Auflösung rastet nach einem Ruckler ein | hoch | T 0-3700 |
| F-08 | Reduced Motion greift nur beim Lader und Anker-Scroll | hoch | ganze Seite |
| F-09 | Zurück, Neuladen, Größenänderung verlieren die Position | hoch | ganze Seite |
| F-10 | Lader: 1,7 s Schein-Zählung, Intro-Aufbau läuft dahinter ab | hoch | Laden |
| F-11 | Fehler im Handy-Mock (Plural, Monat, Salden, Umbruch) | hoch | T 5760-7300, Installieren |
| F-12 | Körper: Fall-Phase beim Eintritt, 60 Hz doppelt so lang | hoch | T 7847-8607 |
| F-13 | Tiefe: fast leere Strecken, kleine dunkle Wörter | mittel | T 8400-10900 |
| F-14 | FAQ: Höhensprung ohne Animation, Semantik | mittel | T 13807-14429 |
| F-15 | Installieren: Tabs ohne Tastaturbedienung, Schleife nicht pausierbar | mittel | T 13007-13807 |
| F-16 | Anker und Home: Durchlauf aller Szenen in 0,3 bis 1,4 s, Weiß-Blitze | mittel | Navigation |
| F-17 | Links: Footer 21 px hoch, AGB fehlt, "Funktionen" zeigt auf Bereiche | mittel | Footer |
| F-18 | Feinschliff-Liste (Umbruch "Home-Bildschirm", Scramble, Kleinkram) | niedrig | verteilt |
| F-19 | Keine Hover-, Fokus- und Textmarkierungs-Gestaltung, Scrollleiste ohne Ersatz (neu) | mittel | ganze Seite |
| F-20 | Kleinfehler in Texten, Rechtsseiten und 404 (neu) | niedrig | FAQ, `/impressum`, `/datenschutz`, `/agb`, 404 |

---

## 4. Funde

### F-01 Zustand der Intro-Szene bleibt nach Sprung stehen (kritisch)

- **Bereich:** jede Position ab `scrollTop` 7300 (bei 1800x987 `scrollY` 9 000), wenn der Scroll die Strecke 6400 bis 7300 schneller überfliegt, als die Engine zeichnet.
- **Elemente:** `HeroTitel` (`overlays.tsx:5-40`), `Hinweise` (`:263-287`), `Raeume`-Karten, Ende-Overlay mit Hand, Handy und CTA (`:331-662`).
- **Messung (`back.mjs`, `i-links.mjs`, `freeze.mjs`):**
  - Deep Links `/#so-gehts` (T 7392), `/#bereiche` (12279), `/#installieren` (13103), `/#fragen` (13903): nach 2,8 s steht `--p` auf 0,0000, die HeroTitel-Opacity auf 1, `INTRO ÜBERSPRINGEN` auf 0,72. "Die App für eure WG." liegt über jedem Ziel (`F/shots/deeplink-*.png`).
  - Erster Tab-Druck nach dem Laden: der Fokus springt zu den Install-Tabs (`scrollY` 16131 = T 13075), gleicher Zustand. Titel liegt über Installieren und Footer (`focus-2.png`, `focus-12.png`).
  - Wheel-Tempo (offene Schleife, 5 000 bis 9 000 T): bis 6 000 px/s sauber, auch bei 4x und 6x CPU-Drosselung. Ab etwa 18 000 px/s (300 px je 16 ms, harter Trackpad-Schwung oder Wisch) steht das Ende-Overlay: Unterkante 14 px unterhalb der Fensteroberkante bei 18 000 px/s, 315 px bei 36 000 px/s. Dann liegen Hand, Handy, "Alltag teilen." und `WG erstellen` über der Tiefe (`freeze-normal_36000_px_s.png`). Das ist exakt das Bild der Sichtprüfung.
  - **(neu) Wheel-Schwelle ist unscharf:** Wie hoch der Reststreifen ausfällt, hängt davon ab, wo der letzte gezeichnete Hero-Frame (alle 37 ms in der Hand-Szene) vor T 7300 lag. Feinlauf (`freeze2.mjs`, 2 Läufe je Tempo): 6 250 px/s Streifen -86 px (unsichtbar), 9 375 px/s +14 px (sichtbarer Streifen), 12 500 und 15 625 px/s -86 und -36 px (unsichtbar). Mit dem Mausrad ist der Fehler also selten auffällig. Die Taste und der Handy-Wisch (nächste Punkte) lösen ihn dagegen zuverlässig aus.
  - **(neu) Tastatur (`freeze2.mjs`, 1800x987):** Taste **End** von T 6400: Das Overlay füllt das ganze Fenster über dem Footer (Unterkante bei 987 px, Deckung 1, `--e` 1) (`v3/shots/sheet-freeze2.jpg`, oben rechts: Hand, Handy, "Alltag teilen." an der Stelle des Finales). End von T 5000: Raumkarte "04 / 04 FLUR Pinnwand & Chat" mit "Übergabe am Freitag" liegt über "Alltag teilen." und den Finale-CTAs (oben links, Text auf Text). End von T 1000: `INTRO ÜBERSPRINGEN ↓` (Alpha 0,72) steht über dem Footer. Leertaste 8 x im Abstand von 60 ms ab T 5400: Hand-Unterkante bleibt 106 px im Bild über der Tiefe. Bild-ab 8 x im Abstand von 120 ms bleibt sauber. **Das ist die einfachste Erklärung der Sichtprüfung:** ein Sprung ans Seitenende oder ein schneller Scroll mitten aus der Hand-Szene.
  - **(neu) Handy (390x844, DPR 3, Touch, `touch.mjs`, Wisch von T 5800 nach T 9600 per `Input.synthesizeScrollGesture`):** bei **allen vier Tempi** (1 500, 3 000, 6 000, 12 000 px/s) bleibt der Zustand stehen. Unterkante des Ende-Overlays 340, 296 und 404 px unterhalb der Oberkante (Deckung 1 bzw. 0,81), bei 12 000 px/s `--e` 0,04 mit `INTRO ÜBERSPRINGEN` bei 0,68 und `--p` 0,906. Bild `v3/shots/sheet-flick.jpg`: Hand, Handy und "Alltag teilen." liegen über dem Wort HAUSHALT der Tiefe. Der Grund ist der Maßstab: k = 0,305, ein Wisch mit 1 500 px/s sind 4 900 T/s, die Hero-Szene zeichnet in diesem Bereich nur alle 37 ms, und `scrollTop > 7300` bricht die Schleife ab, bevor das Overlay fertig weggeschoben ist. Auf dem Handy trifft es jeden getesteten Wisch durch diese Szene (1 500 bis 12 000 px/s, langsamere Wische wurden nicht gemessen). T-03 vermutet das ("mobil häufiger"), hier ist es gemessen.
  - Das stehende Overlay bleibt bedienbar (`pointer-events:auto` für CTA und Handy-Tabs), also klickt man ins Unsichtbare oder aufs falsche Element.
  - Richtung Anfang (Home-Taste von T 10000) bleibt nichts hängen. Die Strecke läuft in etwa 0,3 s durch (Video, 24 Frames), siehe F-16.
- **Ursache:** `hero.js:243` `if (s.sc.scrollTop > 7300 && !this.props.tour) continue;` überspringt die ganze Schleife. Der Zustand der Overlays wird nur im Zeichenpfad gesetzt: CSS-Variablen `--p --g --f --e --c0..3` (`:248`), Overlay-Versatz `translateY(-(scrollTop-6400))` und CTA-Schalter (`:250-251`). Was der letzte gezeichnete Frame gesetzt hat, bleibt stehen. `s.sp` folgt `P0` mit 0,1 s Zeitkonstante (`:245`), darum reicht ein Sprung innerhalb weniger Frames. Bei Deep Link und Tab ist es der allererste Frame (`--p` nie gesetzt).
- **Verwandt:** V-15 und T-03 beschreiben End-Taste und Flick. Neu hier: Deep Links und Tab als sichere Auslöser, die Mindestgeschwindigkeit, und die Bedienbarkeit des Geisters.
- **Vorschlag (kein Inhalt entfällt):**
  1. Vor dem `continue` den Endzustand einmal setzen ("parken", Codevorschlag in T-03): `--p 1`, `--g 0`, `--f 0`, `--e 1`, `--c0..3 0`, `endov` auf `translateY(-900px)`, CTAs `inert` und `pointer-events:none`; beim Verlassen (`scrollTop <= 7300`) `parked = 0`.
  2. Zusätzlich `a[data-scr]` im geparkten Zustand ausblenden (siehe F-04, Skip-Link fängt sonst Klicks).
  3. Besser als Flickwerk: den Overlay-Versatz nicht aus der rAF-Schleife ableiten, sondern im `scroll`-Handler von `Landing.tsx` (`onWin`) in eine CSS-Variable schreiben. Dann gibt es keine Szene, in der ein Overlay vom Zeichenpfad abhängt.
- **Abnahme:** `back.mjs` (4 Deep Links: Titel-Opacity 0), `freeze.mjs` (36 000 px/s: Unterkante des Overlays negativ), erster Tab: Titel unsichtbar. **(neu)** `freeze2.mjs` (Taste End von T 1000, 5000 und 6400, Leertaste, alle Wheel-Tempi: Unterkante negativ, Hinweis 0, Karten 0) und `touch.mjs` (4 Wisch-Tempi am Handy: Unterkante negativ, Hinweis 0).

### F-02 Ohne WebGL2 bleibt der Lader für immer stehen (kritisch)

- **Bereich:** ganze Seite, Browser ohne WebGL2 (GPU-Blocklist, Remote-Desktop und VM, Lockdown-Modus, ältere iOS-Geräte). Playwright-Chromium braucht für Software-WebGL bereits `--enable-unsafe-swiftshader` (`scratchpad/axe/run.mjs`).
- **Messung (`nogl.mjs`, Chromium mit `--disable-3d-apis`, `getContext('webgl2') === false`):** Der Lader steht nach 3 s und nach Scrollen bis T 9000 unverändert auf `000` (`opacity 1`), `--p --e --f` bleiben leer, kein Inhalt sichtbar, keine Bedienung möglich (Lader `z-index:6`, `pointer-events` bleibt aktiv). Bild `nogl-0.png`, `nogl-6300.png`. Ohne JavaScript dagegen blendet das `<noscript>` den Lader aus und der Text ist erreichbar (`nojs-0.png`).
- **Ursache:** `hero.js:232` `if (!G.gl || G.gl.isContextLost()) { …; return; }` beendet jeden Frame. `mk()` (Lader-Logik `:159-160`, Zeiger-Listener, alle CSS-Variablen, Wohnung, Flut, Hand) wird erst danach aufgerufen (`:241`). `fresh()` versucht alle 800 ms neu, ohne je etwas anzuzeigen. Der ältere Stand hatte einen Halbton-Fallback (Commit `2e760af`), der Port nicht.
- **Vorschlag:**
  1. Nur den GL-Block (`:254-280`) an `G.gl` binden. Lader, Variablen, Overlays, Wohnung, Flut und Hand laufen unabhängig weiter.
  2. Hero-Fläche ohne GL: `tone` aus `art.js:24-30` (Halbton-Zeichen) oder ein Standbild.
  3. Lader nach 4 s hart beenden (`setTimeout`), damit nie ein toter Bildschirm bleibt.

### F-03 Hand-Szene 27 fps, auf Mittelklasse 5 bis 7 fps (kritisch)

- **Bereich:** T 5760 bis 7300 (`endA > 0`, Zeichnen läuft bis 7300, auch wenn das Overlay ab 6400 hochscrollt).
- **Messung (`scan2.mjs`, `throttle2.mjs`, `mobile-perf.mjs`; Hero-Schleife, JS je Frame):**

| CPU-Drosselung | fps | Hero-JS je Frame | Anmerkung |
|---|---|---|---|
| 1x (M3 Pro) | 26,7 bis 29,3 | 33 bis 38 ms | alle Frames 41 bis 43 ms (5 Vsync) |
| 2x | 13,5 | 75 ms | 26 Frames über 50 ms |
| 4x | 6,9 | 154 ms | etwa Mittelklasse-Handy |
| 6x | 4,7 | 232 ms | |

  Gleiche Werte bei 390x844 mit DPR 3 (26,7 und 6,9 fps): die Hand-Canvases sind fest 1280x800 und kosten unabhängig vom Fenster dasselbe (`hero.js:148`).
- **CPU-Profil (`cpuprof.mjs`, 4 s, 5 300 Samples):** Hero-Schleife 95 % der Hauptthread-Zeit, `drawHands` 93 %. Inklusive: `point` 36 %, `shN` 28 %, `holdBack` 27 %, `uc` 18 %, `holdFront` 7 %. Rund 45 000 `fillRect` je gezeichnetem Frame (Haltehand etwa 15 000, Zeige- und Daumenebene etwa 32 000).
- **Auswirkung:** Die Hand folgt dem Zeiger mit `s.ht += (Ziel - s.ht) * 0.3` je Frame (`hero.js:191`), das sind bei 27 fps 123 ms Nachlauf (bei 120 fps 28 ms). Wheel-Ereignisse wirken 40 bis 80 ms verzögert. Auf Handys ist der Abschnitt nahezu ein Standbild. Je länger die Frames, desto wahrscheinlicher greift F-01.
- **Ursache:** `hero.js:213-224` wertet für jeden Rasterpunkt (2,5 px, bis 164 000 je Frame, vorgefiltert durch die 12-px-Maske `cm`) die Distanzfelder komplett neu aus (`holdBack` `:173-178`, `holdFront` `:179-181`, `point` `:204`). `shN` (`:185`) ruft das jeweilige Feld je Punkt dreimal auf. **Haltehand (`holdBack`) und Daumen (`holdFront`) hängen nur von x und y ab, nicht von Zeit oder Zeiger**, werden aber jeden Frame neu gerechnet. Nur die Zeigehand (`point`, Arm) bewegt sich.
- **Vorschlag (Design bleibt):**
  1. Statische Ebenen (Haltehand, Daumen) einmal in Offscreen-Canvases rendern, je Frame `drawImage`. Bei Größenänderung neu. Spart etwa die Hälfte.
  2. Die dynamische Hand nur neu rechnen, wenn sich das Ziel um mehr als 0,5 px bewegt hat, und auf einem 5-px-Raster mit Interpolation.
  3. Besser, vor allem für den geplanten realistischeren Handneubau: den Dither als Fragment-Shader im vorhandenen WebGL2-Kontext. Die SDFs lassen sich 1:1 übersetzen, 0 ms Hauptthread, scharf auf Retina (V-09). Budget für jede neue Hand: höchstens 4 ms Hauptthread je Frame bei 4x Drosselung.
  4. Zeichnen auf die sichtbaren Zeilen begrenzen, sobald das Overlay hochscrollt (T > 6400).

### F-04 Tab-Reihenfolge, unsichtbarer Skip-Link, Fokus und Semantik (kritisch)

- **Messung (`i-links.mjs`, `ghostlink.mjs`, `faqkey.mjs`, `axe2.mjs`):**
  - **Reihenfolge** (19 Stopps ab Seitenanfang): 1 bis 3 Install-Tabs, 4 `App installieren`, 5 bis 7 FAQ, 8 bis 9 Finale-CTAs, 10 bis 17 Footer (8 Links), **18 Kopf-CTA `WG erstellen`, 19 `INTRO ÜBERSPRINGEN ↓`**. Der CTA im Ende-Overlay ist korrekt `inert`. Ursache: `Landing.tsx:147-163` stellt `main` vor `HeroTitel`, `Kopf`, `Raeume`, `Hinweise` (DOM-Reihenfolge, nicht visuelle).
  - **Der erste Tab scrollt 16 000 px** in den Installieren-Abschnitt (und löst F-01 aus).
  - **Unsichtbarer Skip-Link:** Ab T 7300 hat `a[data-scr]` `opacity 0`, aber `pointer-events:auto`, `visibility:visible` und bleibt tabbar. Er fängt Klicks in der linken unteren Ecke (bei 1800x987 Rechteck 160, 933, 201 x 20 px; gemessen bei T 8000, 12215, 13300, 14574). Ein Klick dort bei T 13300 springt zurück auf T 7300. Ursache `overlays.tsx:268-272` (`opacity:calc(0.72 - var(--e,0))`, kein `visibility`/`inert`). Dazu eine Tastatur-Falle: der Fokus liegt auf einem unsichtbaren Element, Enter scrollt 6 000 px nach oben.
  - **Fokusdarstellung:** nur Browser-Standard (`outline: auto`, hellblau). `globals.css` definiert nichts. Auf der Szenenfläche funktioniert das, ist aber kein gestalteter Zustand.
  - **Semantik:** Tabs und FAQ-Zeilen sind `div[role=button]` mit `aria-pressed` bzw. `aria-expanded` (`dc.tsx:68-81`, `sections.tsx:444, 752`, `overlays.tsx:504, 618`). Install- und Handy-Tabs wären `tablist/tab/aria-selected` mit Pfeiltasten (Pfeil rechts bewirkt heute nichts, gemessen). FAQ: bei offener Zeile gehört der Antworttext zum Namen der Schaltfläche (`aria-controls`/Region fehlt). Space und Enter funktionieren (FAQ, Install-Tab, Handy-Tabs gemessen).
  - **Dokumentreihenfolge:** `h1` liegt im Overlay hinter `main`, `header` ebenfalls. `h2` wird für Mono-Labels (`[ 05 ] SO GEHT’S`) benutzt, die Abschnittstitel selbst sind teils `h2`, teils `span`.
  - **axe-core 4.14** (5 Scroll-Stopps): 0 serious/critical, 2 x `region` (moderate: HeroTitel und Skip-Link außerhalb von Landmarken), Kontrast "unklar" wegen Canvas-Hintergrund.
- **Vorschlag:**
  1. `<Kopf />` und `<Hinweise />` im JSX vor `<main>` setzen (sie sind absolut positioniert, optisch ändert sich nichts). Dann: Kopf-CTA, Skip-Link, Inhalt.
  2. Skip-Link im geparkten Zustand (F-01) `visibility:hidden` und `inert`, z. B. über `data-parked` am Root.
  3. `:focus-visible { outline: 2px solid #FAFAFA; outline-offset: 3px; }` und für Karten auf Weiß `#0A0A0A`.
  4. Tabs als `tablist`, FAQ als `<button aria-expanded aria-controls>`.

### F-05 Planet: Touch, Beschriftung, Scroll-Falle, Tastatur (hoch)

- **Messung (`i-planet2.mjs` Maus und Touch, 1800x987, T 12215):**
  - **Maus:** Klick auf das Marker-Quadrat wählt den Ort (05 FIXKOSTEN gewählt). **Klick auf die Beschriftung** (Textmitte 55 px und Textende 110 px rechts vom Marker) wählt nichts (`hov -1`). Klick 30 px neben dem Marker trifft. Der Treffer-Radius beträgt 26 Bühnen-px um das 10-px-Quadrat (`art.js:144-146`), die sichtbare Schaltfläche ist aber das ganze Label `01 AUSGABEN`.
  - **Touch (`touchscreen.tap`):** Tippen auf Marker, Text und daneben wählt nichts (`hov -1`, Karte bleibt `01 · AUSGABEN`). **"ORT ANKLICKEN" funktioniert auf Handys nicht.** Ursache: `s.m.in` wird nur durch `pointermove` gesetzt (`art.js:13`), die Trefferprüfung läuft nur bei `s.m.in` (`:146`), ein Tippen erzeugt kein `pointermove`. `onUp` (`:130`) braucht `hov >= 0`.
  - **Scroll-Falle:** Wischen über den Planeten dreht ihn und scrollt die Seite nicht (senkrechter Wisch über 300 px: `scrollY` unverändert). Gewollt (`Landing.tsx:95-106`), aber bei vollflächigem Planeten (V-11) nicht mehr zu verlassen.
  - Von 8 Orten zeigen nur 1 bis 3 ein Label (`z > 0.3`, `art.js:150`), die übrigen sind stumme Quadrate. Eigendrehung 0,15 rad/s (42 s je Umdrehung bei 120 Hz, 84 s bei 60 Hz, siehe F-06). Eine kurze Ziehgeste (80 px) lässt ihn mit 0,049 rad/Frame los, das sind etwa 1 rad Nachlauf (Trägheit `*0.95`, `:132`).
  - **Tastatur:** keine Alternative, die Ortsliste existiert nur auf dem Canvas.
- **Vorschlag:** Bei `pointerType !== 'mouse'` den Treffer beim Loslassen aus der Loslass-Position berechnen. Trefferfläche = Label-Rechteck (mit `measureText`) plus mindestens 44 px. Eine unsichtbare Liste mit den 8 Orten als `<button>` für Tastatur und Screenreader, die dieselbe Auswahl setzt (`this.setState({ sel })`). Trägheit deckeln (0,03).

### F-06 Animationstempo hängt an der Bildwiederholrate (hoch)

- **Messung (`hz.mjs`, rAF auf 60 Hz emuliert):** Planeten-Eigendrehung 0,151 rad/s bei 120 Hz, **0,075 rad/s bei 60 Hz**. Körper-Idle-Zähler 1,00 je s, **0,50 je s** (Rückkehr der Körper nach 3,5 s, **bei 60 Hz nach 7,0 s**).
- **(neu) Zeichenrate (`drawrate.mjs`, gezählt als `fillRect(0,0,1280,800)` je Sekunde je Szene):** Körper, Tiefe, Planet und Finale-ASCII zeichnen **60 Bilder je Sekunde bei 120 Hz und nur 30 bei 60 Hz** (emuliert über halbierten rAF-Takt). Auf dem üblichen 60-Hz-Laptop und -Handy laufen diese vier Szenen also mit 30 fps, die Hero-Szenen (Berg, Organ, Hand) mit dem vollen Takt. Planeten-Drehung heute erneut 0,150 rad/s (120 Hz) gegen 0,075 (60 Hz), Körper-Rückkehr 3,5 s gegen 7,0 s.
- **Ursache:** `art.js:228` zeichnet nur jeden zweiten rAF-Tick (`this.fa % 2`), alle Bewegungen zählen Frames statt Zeit: `art.js:132` (`yaw += vy + 0.0025`), `:175` (`idle += 1/60`), `:22` (Feder `*0.8`, `*0.07`), `:176` (Verlet `*0.985`), `:22/:225` (Schnee). Im Hero: `hero.js:36` (`pp.x += … * 0.02`), `:191` (`* 0.3`), `:253` (`* 0.06`), `:289` (`tr *= 0.985`). Bei 144 Hz läuft alles 1,2x schneller.
- **Folge:** Die meisten Laptops und Handys (60 Hz) sehen die Hälfte des abgenommenen Tempos, ProMotion und 144-Hz-Bildschirme das Doppelte bis 1,2fache. Die Hand im F-03-Bereich folgt dem Zeiger je nach Rate in 28 ms bis 123 ms.
- **Vorschlag:** `dt` aus `performance.now()` (gedeckelt 0,05 s) verwenden und Glättung als `1 - Math.exp(-k * dt)`, Zähler als `+= dt`. `fa % 2` durch ein Zeitbudget ersetzen (z. B. mindestens 12 ms zwischen Zeichnungen je Canvas).

### F-07 Adaptive Auflösung rastet nach einem Ruckler ein (hoch)

- **Messung (`adapt.mjs`, T 300, 320-ms-Blockade des Hauptthreads, Kantenenergie des Berg-Ausschnitts):** vorher 2,22, 71 ms danach 1,38 (**-38 %**), 471 ms 1,94, 671 ms wieder 2,22. Bei 60 Hz verdoppelt sich die Erholungszeit (1,4 s).
- **Ursache:** `hero.js:236` `if (dt > 0.2) this.ad = 0.25;` setzt schon bei einem einzigen langen Frame (Tab-Wechsel, GC, Last durch andere Prozesse) auf 25 %. Erholung nur mit `*1.02` je Frame (`:236`). Die Szenen Berg, Zeichen und Organ rechnen mit `fw = 0.42 * W * ad * qo` (`:267`).
- **Vorschlag:** Dt-Spitzen über 0,25 s ignorieren, Absenken nur bei gleitendem Mittel über 15 Frames, Erholung `*1.06`.

### F-08 Reduced Motion wirkt nur auf Lader und Anker-Scroll (hoch)

- **Messung (`rm.mjs`, Zeiger außerhalb der Bühne geparkt, Pixeldifferenz zweier Bilder im Abstand von 500 ms):**

| T | 0 | 1200 | 2600 | 4300 | 6300 | 7600 | 8000 | 10130 | 12207 | 13300 | 14200 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| normal (% Pixel verändert) | 4,76 | 0,41 | 3,24 | 0,88 | 1,56 | 1,39 | 3,79 | 4,33 | 3,52 | 0,04 | 1,71 |
| reduced | 5,00 | 0,35 | 3,22 | 0,41 | 1,42 | 1,39 | 3,79 | 4,24 | 3,54 | 0,04 | 1,81 |

  `matchMedia('(prefers-reduced-motion: reduce)')` ist wahr, die Szenen bewegen sich trotzdem unverändert (Sonne, Staub, Hand-Autopilot, Planeten-Eigendrehung, ASCII-Sonne, Körper). Geändert sind nur der Lader (764 ms statt 2449 ms bis zum Verschwinden, `hero.js:159`) und der Anker-Sprung (sofort statt 1,4 s, `Landing.tsx:91`). Smooth-Scroll der Engine-Variante ist dank Capture-Handler abgefangen.
- **Folge:** Für Nutzer mit Bewegungsempfindlichkeit (vestibulär) laufen Dauer-Animationen, Zoom-Fahrt durch die Tiefe und Weiß-Blitze der Flut weiter. WCAG 2.2.2 (Pausieren, Beenden, Ausblenden) und 2.3.3.
- **Vorschlag:** Bei `reduce` Eigenbewegungen anhalten (Hero-Autopilot `tm`, Hand-Autopilot `:190`, Planeten-Drift `:132`, Staub, ASCII-Aufstieg `:44`, Körper-Idle) und scrollgetriebene Übergänge behalten, Flut ohne harte Weiß-Wechsel (Deckung auf 0,6 begrenzen).

### F-09 Zurück, Neuladen, Größenänderung verlieren die Position (hoch)

- **Messung (`back.mjs`, `back2.mjs`, `resize.mjs`):**
  - **Zurück** von `/impressum` (Footer-Link, volle Navigation, `navigation.type = back_forward`): Seite startet bei T 0, **der Lader läuft erneut** (Zähler 037, 068, 087, 096, 100, Verschwinden bei etwa 2,4 s). Position vorher T 14574.
  - **Neuladen** bei T 9000: T 0 und Lader. `history.scrollRestoration = 'manual'` (`Landing.tsx:110`) und der Anfangswert `sc.scrollTop` sind 0.
  - **Größenänderung** (V-08 bestätigt): 1800x987 auf 1000x987 ändert T bei festem `scrollY` von 3000 auf 4737 (Flut zu Wohnung), von 8000 auf 12634 (Körper zu Planet), von 11000 auf 14574. **Letzteres klemmt am Seitenende**: nach Zurück auf 1800x987 steht T bei 8698, die Ausgangsposition ist endgültig verloren. Beim Ziehen des Fensterrands während des Scrollens springt T je Schritt um 300 bis 600.
- **Ursache:** `Landing.tsx:68` `sc.scrollTop = window.scrollY / k` nach jedem Resize, kein Merken von T. Zurück und Neuladen: manuelle Scroll-Wiederherstellung ohne eigene Speicherung, Lader in `hero.js:159` unbedingt.
- **(neu) Folge für den Hauptweg:** Alle CTAs öffnen die App im selben Tab (kein `target`, `overlays.tsx:61, 651`, `sections.tsx:829, 837`, Footer). Wer aus der App mit Zurück kommt, steht wieder bei T 0 und sieht den Lader (2,4 s).
- **Vorschlag:** In `fit()` T merken und `window.scrollTo(0, T * k_neu)` setzen (V-08). T in `sessionStorage` bei `pagehide` schreiben, bei `back_forward` und Neuladen wiederherstellen und den Lader überspringen.

### F-10 Lader: Schein-Zählung, Aufbau läuft dahinter ab (hoch)

- **Messung (`boot.mjs`):** Zähler 005 (50 ms), 041 (300), 077 (700), 097 (1200), 100 (1700), Ausblenden bis etwa 2,4 s. Die Zählung ist reine Zeit (`hero.js:160`, 1700 ms, `ease-out`), nicht an Schriften, Shader oder Canvas gebunden (First Paint 148 ms, Schriften und Chunks sind zu diesem Zeitpunkt längst da). Das Intro (Zeichen setzt sich aus 8 Körpern zusammen, `hero.js:257`, `s.a0` bei erster Zeichnung) läuft zeitgleich **hinter** dem Lader: bei 2,3 s ist das Zeichen fertig. Der Auftakt wird praktisch nie gesehen.
- **Folge:** Jeder Aufruf kostet 2,4 s, auch bei Zurück oder Neuladen (F-09), ohne etwas zu laden. **(neu)** Unter Drosselung (Abschnitt 8) bleibt die Wartezeit zwischen gezeichnetem Berg und ausgeblendetem Lader bei 2,1 bis 2,4 s, ob lokal oder Slow 4G.
- **Vorschlag:** `s.a0` beim Ausblenden des Laders setzen, Lader an echte Bereitschaft binden (Schriften, erster GL-Frame) mit Mindestdauer 0,8 s, bei Wiederkehr in derselben Sitzung überspringen. Die große Ziffer (176 px) darf bleiben.

### F-11 Fehler im Handy-Mock (hoch, Querverweis: Handy soll die echte App zeigen)

- **Messung (`i-phone.mjs`, echte Mausklicks, Treffer per `elementFromPoint` geprüft):** Alle 4 Tabs, 4 Abhak-Zeilen, `Ausgabe erfassen` und `Antworten …` funktionieren und treffen das richtige Element (Tabs 73 x 57 px, Zeilen 69 bis 70 px hoch bei 1800x987). Inhaltsfehler:
  1. `logic.js:29` `open + ' Dinge stehen auf der Liste.'` ergibt bei 1 **"1 Dinge stehen auf der Liste."** (nach dem Abhaken von drei Einträgen gemessen).
  2. `overlays.tsx:440` **`MÄRZ · 4 PERSONEN`** ist fest, heute ist Oktober.
  3. **Saldo `0,00 €` und "Diesen Monat ist alles ausgeglichen."** neben Pizzaabend 28,40 € (Mika), Wocheneinkauf 18,90 € (Lina), Internet 29,99 € (`logic.js:8, 27`). Das stimmt nur, wenn die Posten beglichen sind: In der echten App sind alle drei als "beglichen" markiert (`design/app-ref/REF.md`, Ausgaben), der Mock zeigt das aber nirgends. Nach `Ausgabe erfassen` springt der Saldo auf `12,00 €` ("Lea gibt Jona 12,00 €.", es zählt nur das Kinoabend, die anderen Posten nicht). Beides fällt weg, sobald der Mock durch die echte App-Oberfläche ersetzt ist.
  4. Die Zeile `Jona bezahlt · Jona und Lea` bricht im Handy um (`logic.js:9`, zweizeilig, Zeile höher als die anderen).
  5. `Ausgabe erfassen` ist ein Umschalter, keine Erfassung (die Zeile heißt dann `Kinoabend entfernen`), `Antworten …` ebenfalls (zweiter Klick setzt zurück). Die Hand liegt bei einem Klick auf die Zeile über dem Betrag (`24,00 €` nicht lesbar, `phone-finanzen-ausgabe.png`).
  6. Tab-Beschriftungen 11 px, Details `#737373` (T-16).
- **Vorschlag:** Pluralfunktion, Monat aus dem Datum (oder bewusst "Oktober"), Saldo aus den Posten rechnen, Mock durch die echte App-Oberfläche ersetzen (läuft als eigener Auftrag).

### F-12 Körper: Fall-Phase beim Eintritt, bei 60 Hz doppelt so lang (hoch)

- **Messung (`i-physics.mjs`, 120 Hz):** Beim ersten Sichtbarwerden fallen alle 8 Körper auf den Boden der Sektion (mittlere Abweichung von der Ruhelage 237 px nach 1,5 s, **396 px nach 3,6 s**) und tragen schwarze Namensplatten. Erst bei `idle >= 3,5` kehren sie zurück (nach 5,1 s Abweichung 18 px, nach 6,5 s 1 px). Greifen, Ziehen, Werfen funktionieren (nach Loslassen wieder 3,5 s locker, dann Rückkehr auf 631/430), Mausrad über dem Canvas scrollt die Seite (200 px), Klick ins Leere stößt die Körper ab.
- **Folge:** Der Nutzer sieht zuerst einen Haufen am Boden mit Namensplatten, die Überschrift ist da oft schon aus dem Bild (T-12). Bei 60 Hz dauert das 7 s (F-06).
- **Vorschlag:** wie T-12 (`s.idle = 3.5` beim Erzeugen, Fall erst nach `onDown`), und Zeit statt Frames.

### F-13 Tiefe: fast leere Strecken, kleine dunkle Wörter (mittel)

- **Messung (`dense.mjs`, 154 Stopps im Abstand 100 T, Anteil Pixel über Helligkeit 90):** In 8600 bis 12100 haben **21 von 36 Stopps unter 2 %** helle Pixel (Median 1,65 %, Maximum 5,3 %). Strecken unter 1 %: **T 8400-8700, 9300-9700, 10600-10900** (Bilder `empty-8450.png`, `empty-9330.png`, `empty-10620.png`). Auf dem Bildschirm steht nur Staub, `[ TIEFE ] WEITER SCROLLEN` und ein Wort, das nur etwa 18 % der Breite einnimmt (Durchflug durch den Mittelbuchstaben bei 9330 und 10620). Zwischen T 400 und 8500 tragen 46 Stopps nur Kopf und Hinweis als DOM-Text (Intro, Zeichen, Flut-Phasen: gewollt).
- **(neu) Wiederholung (`dense.mjs`, 1800x987, T 0 bis 12 400, Build `f28204a`):** identische Werte. 21 von 36 Stopps in T 8600 bis 12100 unter 2 % helle Pixel (Median 1,65 %, Maximum 5,28 %), unter 1 % bei T 8400-8700, 9000, 9300-9700 und 10600-10900. Harte Schnitte (Bildänderung über 12 % je 100 T) nur bei T 3300-3600, 5500-5600, 5900-6000 und 6500-7200, also in den gewollten Wischs und beim Hochscrollen des Overlays.
- **Folge:** Das ist die Beobachtung "Tiefen-Wörter nicht sichtbar" (T-10 liefert die Ursachen: Spitzen-Einblendung, dunkle Wörter beim Erscheinen, Untertitel nur 49 Einheiten voll).
- **Vorschlag:** wie T-10. Zusätzlich: Wortgröße anheben (Wort bis etwa 40 % der Breite bei Abstand 9), damit in den drei Strecken etwas Lesbares im Bild steht.

### F-14 FAQ: Höhensprung ohne Animation, Semantik (mittel)

- **Messung (`i-faq.mjs`):** Beim Öffnen erscheint die Antwort sofort (`sections.tsx:777`, bedingtes Rendern), die Zeile wächst von 114 auf 194 px, die Dokumenthöhe ändert sich um 81 px (18968 auf 18887 beim Schließen), alles darunter (Finale-Canvas, Footer) rutscht. `fit()` setzt `scrollTop` neu (`Landing.tsx:139-141`), die Position bleibt stabil. Exklusives Akkordeon (nur eine Antwort offen, Frage 1 ist beim Laden offen). Die Antwort ist Teil des Namens der Schaltfläche (F-04).
- **Vorschlag:** Höhe über `grid-template-rows: 0fr → 1fr` mit 0,3 s animieren, `<button aria-expanded aria-controls>`.

### F-15 Installieren: Tabs ohne Tastaturbedienung, Schleife nicht pausierbar (mittel)

- **Messung (`i-install.mjs`):** Alle drei Tabs funktionieren (Maus, Tab plus Enter), Rahmen 300 x 620 px mit Radius 46 (iPhone, Android), 600 x 400 mit Radius 14 (Rechner). Zyklus 8 s (Rechner 6,5 s): Sheet fährt hoch (bei 0,4 s), Dialog 1,3 bis 3,3 s, Home-Bildschirm ab 2,6 s, Symbol-Aufpoppen bei 3,0 bis 4,5 s, danach Neustart. Die Hervorhebung der Schritte folgt dem Zyklus (T-11). Pfeiltasten ohne Wirkung. Die Schleife läuft unbegrenzt, auch bei `reduce` (F-08).
- **Hinweis:** Inhalt und Ablauf (Android-Sheet im iOS-Stil, Rechner mit Handy-Home-Raster) gehören zum Auftrag "echte Installation" und sind hier nicht bewertet.
- **Vorschlag:** Tabs als `tablist` (F-04), Zyklus bei `reduce` auf ein Standbild je Schritt.

### F-16 Anker und Home: Durchlauf aller Szenen, Weiß-Blitze (mittel)

- **Messung (`i-links.mjs`, Video `homekey.mjs`):** `INTRO ÜBERSPRINGEN` von T 0 und `So geht’s` im Footer von T 14574 landen korrekt bei T 7282 (Ziel 110 px unter der Oberkante, `Landing.tsx:87-90`), in etwa 1,4 s. Die Home-Taste von T 10000 läuft in 0,3 s durch Tiefe, Körper, Wohnung, Flut, Organ und Zeichen. Im Video stehen dabei ein bis zwei Frames mit fast vollflächig weißer Flut (`vid/home-sheet2.jpg`, 8110 und 8150 ms). Funktionell richtig, als Übergang aber ein "Spulen" durch das ganze Werk mit Weiß-Blitz, und die Engine zeichnet dabei nur wenige Frames (F-01).
- **Vorschlag:** Bei Sprüngen über mehr als drei Fensterhöhen `behavior: 'auto'` (oder 200-ms-Überblendung) statt Smooth-Scroll. Entscheidung des Auftraggebers.

### F-17 Links: Footer 21 px hoch, AGB fehlt, "Funktionen" zeigt auf Bereiche (mittel)

- **Messung (`i-links.mjs`, `curl`):** 14 Links, alle `href` gültig, `https://app.manawg.com/`, `/neu?action=create`, `/neu` antworten mit 200, `/impressum`, `/datenschutz`, `/agb` 200, `/wg` und `/neu` auf der Landing leiten per 307 auf die App. Treffbarkeit: Footer-Links 255 x 21 px (CSS), `INTRO ÜBERSPRINGEN` 201 x 20 px (V-06). Footer verlinkt Impressum und Datenschutz, **`/agb` fehlt** (Seite existiert, steht in der Sitemap). Footer `Funktionen` zeigt auf `#bereiche` (Planet, T 12169), der Abschnitt mit `aria-label="Funktionen"` ist die Tiefe (T 8607-12207). Der Kopf-CTA bleibt unter dem opaken Ende-Overlay klickbar, obwohl unsichtbar (T 5970-7220, T-14).
- **Vorschlag:** Footer-Zeilen mindestens 44 px Trefferhöhe (Padding), `AGB` ergänzen, `Funktionen` auf die Tiefe zeigen lassen (`data-sec` dort setzen).

### F-18 Feinschliff

1. **Umbruch** "Auf den / Home- / Bildschirm." (`sections.tsx:428-431`, 72 px in 520 px Spalte): der Bindestrich bricht um, "Home-" steht allein in der Zeile. `white-space:nowrap` auf der zweiten Zeile mit 64 px oder Spalte 580 px.
2. **`data-scr`-Scramble** (`hero.js:156`): ersetzt beim Überfahren 0,7 s lang den Text des Links durch Zufallszeichen (`@%#*+=-:`), der zugängliche Name flackert. `aria-label="Intro überspringen"` ergänzen.
3. **Cursor:** Im Ende-Bereich ist der Mauszeiger ausgeblendet (`hero.js:250`, `cursor:none`), die Hand ersetzt ihn. Über Handy und CTA zeigt der Browser `pointer` (gewollt), im übrigen Bereich ist kein Zeiger sichtbar, die Hand läuft bei 27 fps nach (F-03).
4. **Überschriften-Hierarchie:** `h2` für die Mono-Labels und `h3` für Schritte, Planeten-Titel ohne Überschrift, siehe F-04.
5. **Ankerziel `So geht’s`** landet mit dem Label 110 px unter der Kante, das Flutband (96 px) steht direkt darüber im Bild.
6. **Staub und Sterne** (`HeroTitel` `stars`, `art.js:209-218`): nach Portierung ist das Sternbild leer (`s.st = []`, `s.ed = []`), nur 220 Hintergrundpunkte werden gezeichnet. Entweder wieder einsetzen oder den toten Code und die Hover-Logik entfernen.
7. **Tote Pfade:** `fine = () => true` (`hero.js:9`), `asc`-Zweig der Hand (`:206-207`), `tour` (`:243-244`), `score/ticker/mosaic/fluid/topo/mesh/tone/snow` (`art.js:24-227`, im DOM nicht benutzt) vergrößern Bundle und Profil. Sinnvoll erst nach der Abnahme zu entfernen.
8. **`public`-Dateien** (`manawg-mark.svg`, `icon-512.png`, `og.png`) haben `Cache-Control: public, max-age=0` (Revalidierung bei jedem Laden). Mit Hash oder `max-age` versehen.
9. **Wohnung:** Namen-Label teils unter der Scheibe einer anderen Person (T-15). Raumlabels bei kleinem k unter 10 px.

### F-19 Keine Hover-, Fokus- und Textmarkierungs-Gestaltung, Scrollleiste ohne Ersatz (mittel, neu)

- **Messung (`hover.mjs`, 1800x987, Computed-Style von Element und zwei Eltern vor und 500 ms nach Hover):** Änderung bei Kopf-CTA keine, Handy-Tab keine, Install-Tab keine, `App installieren` keine, FAQ-Zeile keine, beide Finale-CTAs keine, Footer-Link keine. **Einzige Ausnahme `INTRO ÜBERSPRINGEN` (Alpha 0,72 auf 1, dazu das Scramble).** Übergangsdauer überall 0 s, Zeiger überall `pointer`. Die Pixeldifferenzen bei Kopf-CTA, Handy-Tab und Finale-CTAs (3 bis 24 %) kommen vom bewegten Hintergrund, nicht vom Element (Install-Tab, Install-CTA, FAQ, Footer: 0,0 %).
- **Ursache:** Der Entwurf enthält genau einen `style-hover` (`opacity:1` am Skip-Link) und vier `style-active="transform:scale(0.97)"`, alle vier im Handy-Mock (`overlays.tsx:502, 534, 598, 616`). Die Portierung ist 1:1, der Befund steht also schon im Entwurf. `Dc` (`dc.tsx`) kann Hover und Active bereits, es fehlen nur die Werte.
- **Weitere Lücken (`globals.css`, `layout.tsx`):** kein `:focus-visible` (Browser-Standardring, hellblau, siehe F-04), kein `::selection` (Standard-Blau auf dem Schwarz), `scrollbar-width: none` mit `html::-webkit-scrollbar{display:none}`: Die Seite ist 19 Bildschirme lang und hat weder Scrollleiste noch eigene Fortschrittsanzeige. Mit der Maus lässt sie sich nur per Rad, Trackpad oder Tastatur bewegen, die Leiste ziehen geht nicht. Text wird beim Ziehen auf den Szenen nicht markiert (geprüft, 0 Zeichen auf Körper, Planet, Tiefe, Wohnung), das ist in Ordnung.
- **Vorschlag (Design bleibt, es kommen nur Zustände dazu, je 120 bis 160 ms):**
  1. Weiße CTAs (`#FAFAFA`): Hover Hintergrund `#E5E5E5`, Active `scale(0.98)`. Outline-CTAs: Hover Rand von Alpha 0,6 bzw. 0,3 auf 1 und Hintergrund `rgba(250,250,250,0.08)`.
  2. Install-Tabs und Handy-Tabs: Hover Hintergrund `rgba(250,250,250,0.08)` bzw. `#F5F5F5` im hellen Handy.
  3. FAQ-Zeilen: Hover Frage von Alpha 0,72 auf 1, Marke `+` dreht kurz. Footer-Links: Alpha 0,72 auf 1 und Unterstreichung.
  4. `:focus-visible { outline: 2px solid #FAFAFA; outline-offset: 3px; }` (auf hellen Karten `#0A0A0A`).
  5. `::selection { background: #FAFAFA; color: #0A0A0A; }`.
  6. Entscheidung des Auftraggebers: dünne Fortschrittslinie am oberen Rand oder Abschnittsmarken (der Entwurf hat nur den Zähler `TIEFE 000`), und/oder die Scrollleiste schmal sichtbar lassen.
- **Abnahme:** `hover.mjs` meldet für jede Zeile eine nicht leere Style-Änderung.

### F-20 Kleinfehler in Texten, Rechtsseiten und 404 (niedrig, neu)

- **Texte (alle sichtbaren und versteckten Strings gelesen, `texts.mjs`, Listen in `v3/out/texts-dom.txt`, `texts-extra.txt`, `texts-engine.txt`):**
  1. **Keine falschen Umlaute.** Die Suche nach `ae`, `oe`, `ue` als Umlaut-Ersatz in `src/` findet nur Bezeichner (`Raeume`, `Koerper`), keinen sichtbaren Text. Anführungszeichen („ “) und Apostroph (’) sind typografisch richtig.
  2. **Erste FAQ-Frage mehrdeutig:** "Wie kommen meine Mitbewohner dazu?" kann im Deutschen auch als Empörung gelesen werden ("Wie kommen die dazu?" = "Was fällt denen ein?"). Gemeint ist der Beitritt. Vorschlag: "Wie kommen meine Mitbewohner in die WG?" (`logic.js:11`).
  3. **"Straße" gegen "Strasse":** Handy-Mock "WG Lindenstraße" (ß), Rechtsseiten "Kurt-Schumacher-Strasse 2" (ss). Die Anschrift ist die des Betreibers, Schreibweise bestätigen und angleichen.
  4. **"AGB" gegen "Nutzungsbedingungen":** Auf den Rechtsseiten heißt der Link "AGB", Titel und Überschrift der Seite lauten "Nutzungsbedingungen". Im Footer der Landing fehlt der Link ganz (F-17).
  5. "1 Dinge" und "MÄRZ" siehe F-11, Umbruch "Home- / Bildschirm." siehe F-18.
- **Rechtsseiten (`legal.mjs`, 1800x987 und 390x844, `v3/shots/sheet-legal.jpg`):** `/impressum`, `/datenschutz`, `/agb` antworten mit 200. Am Handy läuft die Seite über (`scrollWidth` 422 bei 390 px), Text am rechten Rand abgeschnitten (V-16, bestätigt). "Stand: 2026-05-19" steht im ISO-Format und bricht am Handy mitten im Datum um ("2026-05-" und "19"). Deutsch wäre "19.05.2026". Konsole sauber.
- **404 (`/gibtsnicht`, Status 404 korrekt):** zeigt ein farbiges Haus-Emoji. Es sieht je Betriebssystem anders aus und fällt aus dem Schwarz-Weiß der Seite. Vorschlag: ManaWG-Zeichen oder ein ASCII-Haus. Die einzige Konsolenmeldung ist der erwartete 404 der Seite selbst.
- **Meta:** `canonical` und `og:url` kommen aus `NEXT_PUBLIC_APP_URL` (`app-url.ts`). Der lokale Build zeigt `http://localhost:3100`. Vor dem Release prüfen, dass die Variable in Vercel auf `https://manawg.com` steht (`.env.example`), sonst greift `VERCEL_PROJECT_PRODUCTION_URL`. Titel, Beschreibung, OG-Bild 1200x630, `lang="de"`, `theme-color` und Favicons sind vorhanden.

---

## 5. Fps und Last je Szene (echte GPU, 1800x987)

`fps` = rAF-Takt über 2 s. JS = Dauer der Hero- bzw. Art-Schleife je Frame aus dem rAF-Wrapper. GPU-Zeit der Hero-Draws per `readPixels`-Sync (`gpu.mjs`).

| T | Szene | fps 1x | JS je Frame | fps 4x | fps 6x | GPU |
|---|---|---|---|---|---|---|
| 0 | Berg (WebGL) | 118 bis 120 | 0,1 bis 0,2 ms | 120 | 120 | 3,5 bis 4,7 ms je Draw (2 Draws), p95 11 ms |
| 1900 | Organ und Körper-Zerfall (WebGL) | 120 | 0,2 ms | 120 | 120 | etwa 1 ms |
| 3800 | Flut (2D) | 120 | 0,7 ms | 120 | 120 | etwa 1 ms |
| 5043 | Wohnung (2D) | 113 bis 120 | 0,7 ms | 120 | 120 | – |
| **6400** | **Handy und Hand** | **26,7 bis 29,3** | **33 bis 38 ms** | **6,9** | **4,7** | – |
| 8000 | Acht Körper | 120 | 0,45 ms | 120 | 120 | – |
| 10130 | Tiefe | 120 | 0,4 ms | 120 | 120 | – |
| 12207 | Planet | 120 | 0,2 ms | 120 | 120 | – |
| 13300 | Installieren | 120 | 0,1 ms | 120 | 120 | – |
| 14200 | Finale ASCII | 120 | 1,2 ms | **56** | **50** | – |

- **(neu) Wiederholung am Abend (`fps3.mjs`, Build `f28204a`, Systemlast 9 bis 14):** Alle neun Szenen außer Hand 120,1 bis 120,5 fps, kein Frame über 9,4 ms. Hand-Szene 26,3 fps (Median 41,6 ms, 49 Frames über 33 ms in 2 s, Hero-JS 37,7 ms je Frame), bei 4x 6,6 fps. Finale-ASCII bei 4x 71 fps (Tabelle oben 56, die Last der Maschine schwankt). Die Hand-Szene ist weiter die einzige, die die 60 fps verfehlt. Die fps-Spalte ist der rAF-Takt, nicht die Zeichenrate: Körper, Tiefe, Planet und Finale zeichnen davon nur jeden zweiten Tick (F-06).
- Bei 2x Drosselung ist nur die Hand-Szene auffällig (13,5 fps). Finale-ASCII zeichnet 142 x 57 = 8 100 `fillText` je Frame (`art.js:45-57`) und liegt bei 4x knapp über der Grenze: ein Glyphen-Atlas oder Teilneuzeichnen hält die 60 fps.
- **Einmalige Ausreißer:** 58 ms in der Wohnung (1 Frame), 367 ms beim Anhalten bei T 13007 (in einem von zwei Scans; vier gezielte Läufe in den Installieren-Abschnitt hinein blieben alle unter 25 ms, `hitch.mjs`). Nicht reproduzierbar, vermutlich Messartefakt (Screenshot-Zeitpunkt).
- **Long-Animation-Frames (`loaf.mjs`, vollständiger Durchlauf mit 5 600 px/s, 4 Läufe):** nur Hand-Frames (47 ms Skript bei T 6055, 6080, 6720, 7920) und der erste Frame beim Laden (51 bis 56 ms). Keine Layout- oder Paint-Spitzen.
- **GPU-Reserve:** Der Berg-Raymarcher kostet auf dem M3 Pro rund 8 ms je Frame (2 Draws). Auf einer iGPU (etwa 5- bis 10-fach langsamer) greift die adaptive Auflösung (F-07 beachten). Auf Windows/ANGLE-D3D11 ist die Kompilierzeit der Shader (Schleifen bis 140 Schritte, `hero.js:86`) nicht prüfbar (offener Punkt).
- **Dichter Durchlauf (154 Stopps):** Harte Schnitte (Bildänderung über 12 % je 100 T) nur in den gewollten Wischs (Flut T 3300-3600, 5500-5600, Ende-Einblendung 5900-6000, Hochscrollen des Overlays 6500-7200, 12800, 13200). Keine ungewollten Sprünge im normalen Scrollen.

---

## 6. Interaktionsmatrix

Spalten: M = Maus, T = Tastatur, F = Touch (Planet; in Runde 2 zusätzlich Handy-Tabs, Install-Tab, FAQ, CTAs und Footer-Link mit echten Taps am Handy-Viewport 390x844, DPR 3, `touch.mjs`). OK = funktioniert, die Messung steht im Fund. Flächen bei Touch in CSS-px auf dem Handy (Mindestmaß 44 x 44).

| Element | M | T | F | Befund |
|---|---|---|---|---|
| Handy-Tabs (Start, Haushalt, Finanzen, Austausch) | OK | OK (Tab, Enter, Space, `inert` außerhalb) | Tap trifft, **Fläche 18 x 14** | F-04 Semantik, V-06 Größe |
| Abhaken (4 Zeilen) | OK, `EINKAUF · n OFFEN` zählt | OK | – | F-11 Plural |
| Ausgabe erfassen | OK (Umschalter) | OK | – | F-11 Saldo, Umschalter statt Erfassung |
| Antworten | OK (Umschalter) | OK | – | F-11 |
| Körper greifen, ziehen, werfen | OK | – | gemäß V-11 | F-12 Fall-Phase, F-06 |
| Planet ziehen | OK, Trägheit | – | dreht, scrollt nicht | F-05 Scroll-Falle |
| Planet Ort wählen | Marker OK, **Label nicht** | – | **wirkungslos** | F-05 |
| Install-Tabs | OK | Tab+Enter OK, Pfeile ohne Wirkung | Tap trifft, **Fläche 26 x 12** | F-15, V-06 |
| FAQ | OK (exklusiv) | OK (Enter, Space) | Tap trifft, Fläche 366 x 28 | F-14 |
| CTAs (Kopf, Finale, Install, Footer) | OK, Ziele 200 | OK, aber Reihenfolge falsch | Taps lösen aus, **Flächen 37 x 13 (Kopf), 45 x 15 (Finale), 51 x 15 (Install), Footer-Link 63 x 5** | F-04, F-17, V-06 |
| Anker (Footer, Skip) | OK, 1,4 s | OK | – | F-16, F-01 |
| Skip-Link nach Intro | fängt unsichtbar Klicks | tabbar, unsichtbar | – | F-04 |
| Tastaturscrollen (Leertaste, Bild, End, Home) | OK | | | **End und Leertaste in Folge lösen F-01 aus** |
| Zurück, Neuladen, Resize | – | – | – | F-09 |
| Reduced Motion | – | – | – | F-08 |

---

## 7. Größen-Audit der ASCII- und Mono-Elemente

### 7.1 Vorbemerkung: Skalierungsfaktor

Alle Größen stehen in Bühnen-px und werden mit k auf den Bildschirm gerechnet (`Landing.tsx:62`). Auf Fenstern über 1280 px wächst **alles** mit, die Seite wirkt dadurch auf großen Bildschirmen überdimensioniert. Der Entwurf wurde bei k = 1 gestaltet.

| Viewport | k | Label 12 px | Body 16 px | CTA 48 px hoch | Flut-Zelle 32 px |
|---|---|---|---|---|---|
| 1280x800 | 1,00 | 12,0 | 16,0 | 48 | 32 |
| 1440x900 | 1,125 | 13,5 | 18,0 | 54 | 36 |
| 1800x987 (Sichtprüfung) | 1,234 | 14,8 | 19,7 | 59 | 39,5 |
| 1920x1080 | 1,35 | 16,2 | 21,6 | 65 | 43 |
| 2560x1440 | 1,80 | 21,6 | 28,8 | 86 | 58 |

Ein Teil von "ASCII-Buttons zu groß" ist dieser Faktor: der Kopf-CTA misst bei 1800 px 148 x 52 px, die Finale-CTAs 59 px Höhe. Im Entwurf gibt es **keine Buttons in ASCII-Schrift** (Suche in `final.dc.html`: nur das Label `[ ACHT KÖRPER ]` und der Scramble-Link `INTRO ÜBERSPRINGEN ↓`). Gemeint sind sehr wahrscheinlich in dieser Reihenfolge: **Flut-Zellen** (große weiße Blöcke mit Ziffer, wirken wie Schaltflächen), Planeten-Marker mit Mono-Label, die Mono-Hinweise, zuletzt die CTAs im ASCII-Finale. Empfehlung: Größen in CSS-px mit Deckel statt Bühnen-Skalierung (V-Abschnitt 8), dann stimmen die Werte unten wörtlich.

### 7.2 Typografische Skala der Seite (gemessen, 1280x800)

- Inter: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 (zehn fast gleiche Stufen).
- Inter Tight: 18, 19, 20, 26, 30, 32, 40, 44, 64, 72, 80, 96, 200.
- JetBrains Mono: 10, 11, 12, 13, 15, 26, 28, 176 (acht Stufen, davon 55 Textknoten = Ziffern des Flutbands bei 10 px, 26 Label bei 12 px mit 0,08 em).
- Raster in den Canvases: Dither 6 px (Körper, Wohnung, Hand 2,5 px), Ziffern 8 px, ASCII 9 x 14, **Flut 32 px**.

Die Label-Stufe (12 px, 0,08 em, Versalien) ist konsequent und stimmig. Die Mono-Stufen darüber und darunter (10, 11, 13, 15) sind Einzelfälle und lassen sich auf 11 (Mikro), 12 (Label), 14 (Daten), 28 (Display-Zahl) und 176 (Lader) vereinheitlichen.

### 7.3 Einzelne Elemente (Bühnen-px, Bildschirm-px bei k 1,234 / 1,125 / 1,8)

| # | Element | Quelle | Ist | 1800 / 1440 / QHD | Urteil | stimmig wäre |
|---|---|---|---|---|---|---|
| 1 | **Flut-Zelle** | `hero.js:289` | 32 px, Raster 40 x 25 | 39,5 / 36 / 58 | **zu grob**, 5x gröber als jedes andere Raster | 16 px (Raster 80 x 50) |
| 2 | **Flut-Ziffer** | `hero.js:294` | 10 px, Alpha 0,6, Verhältnis Zelle:Ziffer 3,2 : 1 | 12,3 / 11,3 / 18 | **kleiner als das kleinste Label**, verliert sich im Block | 10 bis 11 px bei Zelle 16 (0,62 : 1) |
| 3 | **Flutband (DOM)** | `sections.tsx:7-8, 47` | Zelle 32, Ziffer 10 | gleich | muss der Hero-Flut folgen | 16 / 10, 80 Spalten x 6 Zeilen |
| 4 | Raum- und Namenslabels | `hero.js:50, 54` | 11 px | 13,6 / 12,4 / 19,8 | passend, bei kleinem k unter 10 px | 11 px, nicht kleiner als 10 effektiv |
| 5 | So-geht’s-Ziffern 01 bis 03 | `art.js:20`, `sections.tsx:92-103` | Zelle 8, Glyph 10, Ziffer 150 hoch | 185 hoch | Display-Größe passt, **Glyphenrauschen** (`@%#` je Zelle) macht die Ziffern unruhig | Zelle 6, Glyph 8, feste 3-Ton-Rampe |
| 6 | Körper-Raster | `art.js:185-186` | 6 px (Handy 4) | 7,4 | passt zum Dither | – |
| 7 | Körper-Namensplatten | `art.js:187-188` | 11 px, Platte 18 px hoch, volles Schwarz | 13,6 / 22 | schwer auf den Kugeln, nur in der Fall-Phase | 10 px, Platte mit Alpha 0,7 (verschwindet mit dem Fix aus F-12) |
| 8 | **Tiefe-Zeichen** | `art.js:93` | 8, 11, 16, 23, 32, **45** px | 10 bis 55 | **Nahzeichen 45 px ≙ 3,8x das Label**, Wörter zerfallen in Brocken (`mc-sheet3.png`) | Deckel bei 32 px, darüber Punkte statt Zeichen |
| 9 | Tiefe-Zähler `TIEFE 000` | `sections.tsx:303` | 12 px / 0,08 em | 14,8 | passend | – |
| 10 | Planeten-Marker | `art.js:148` | 10 x 10 px | 12,3 | passend, aber **Trefferfläche 26 px Radius** (F-05) | Marker 10 px, Trefferfläche mindestens 44 px |
| 11 | Planeten-Label | `art.js:144, 150` | 11 px | 13,6 | passend (`mc-sheet2.png`) | – |
| 12 | Finale-ASCII | `art.js:41-43` | Zelle 9 x 14, Glyph 12 | 11 x 17 | stimmig zum Label (`mc-sheet4.png`) | – (8 100 Zeichen je Frame, siehe Abschnitt 5) |
| 13 | **Lader-Ziffer** | `overlays.tsx:302` | 176 px, -0,05 em | 217 / 198 / 317 | größtes Mono-Element, 2,2x der H1 (80 px) | 120 bis 140 px |
| 14 | Lader-Balken | `overlays.tsx:313` | 12 px, 40 x `#` | 14,8 | passend | – |
| 15 | Mono-Labels im DOM (26 x) | `sections.tsx:80, 195, 233, 246…` | 12 px / 0,08 em | 14,8 / 13,5 / 21,6 | konsequent, nur auf QHD zu groß | durch Deckel (CSS-px) |
| 16 | Hinweise `INTRO ÜBERSPRINGEN`, `SCROLLEN` | `overlays.tsx:268-283` | 12 px / 0,08 em, Alpha 0,72 | 14,8 | passend, Trefferfläche 20 px hoch | 44 px Treffer durch Padding |
| 17 | FAQ-Marke `+ −` | `sections.tsx:771` | 26 px | 32 / 29 / 47 | größer als nötig (Frage 32 px) | 20 bis 22 px |
| 18 | Beträge (Karten, Handy) | `overlays.tsx:122, 557`, `sections.tsx:389, 568` | 12, 13, 15 px gemischt | 14,8 bis 18,5 | uneinheitlich | 14 px |
| 19 | Handy-Mono (Mock) | `overlays.tsx:403, 437, 444` | 11, 13, 28 px | – | eigenes Maß der Oberfläche | folgt der echten App |
| 20 | Hand-Dither | `hero.js:207` | Raster 2,5 px, Punkt 0,9 bis 2,4 px | 3,1 / 2,8 | fein, passt | – |
| 21 | Cursor-Ring Wohnung | `hero.js:58` | r 18 + 3 x 3 px | – | passt | – |

**Buttons (nicht ASCII, aber im ASCII-Umfeld):** Kopf-CTA 40 px hoch, 14 px, Padding 16 (`overlays.tsx:63`). Finale-CTAs und `App installieren` 48 px, 16 px, Padding 24 (`sections.tsx:478, 831, 839`). Install-Tabs 40 px, 14 px. Handy-Tabs 44 px, 11 px. Der Kopf-CTA (40 / 14) ist das stimmige Maß, die 48-px-Varianten sind im Verhältnis zur 12-px-Label-Stufe 20 % zu groß. Empfehlung: einheitlich 40 / 14 (Finale 44 / 15 wegen des 200-px-Titels), Treffer über Padding auf 44.

### 7.4 Flut-Zellgrößen im Vergleich (`flutmock.mjs`, gleiche Rauschfunktion, gleiche Form)

Bilder `F/shots/flutmock-sheet.jpg` (Gesamtbild) und `flutmock-crops.png` (1:1 am Rand, wo die Ziffern stehen). Die Form der Flut bleibt in allen Varianten gleich, nur das Raster ändert sich.

| Zelle / Ziffer | Verhältnis | Eindruck bei 1:1 |
|---|---|---|
| 32 / 10 (Ist) | 0,31 | Ziffern verloren, Treppenstufen 32 px grob |
| 24 / 12 | 0,50 | gut lesbar, noch deutlich gerastert |
| 20 / 11 | 0,55 | lesbar, Kante ruhiger |
| **16 / 10** | **0,63** | **dichte Minesweeper-Rückseite, Kante fein, Ziffern lesbar** |
| 12 / 9 | 0,75 | Kante glatt, Ziffern zu klein (unter 10 px) |

Empfehlung **16 / 10** (bei Bedarf 20 / 11). Das Raster ist dann 2 x das 8-px-Ziffern-Raster der Seite. Mit Zelle 16 müssen die Aussparungen der Kopfzeile (`hero.js:292`, `b < 3 && a < 9`) auf `b < 6 && a < 18` und die Spalten-Maske aus T-01 mitgeführt werden. Die Flut bleibt eine weiße Fläche, die Raumtexte verdeckt (T-01), unabhängig von der Zellgröße.

---

## 8. Konsole, Netzwerk, Links (Messung)

- **Konsole:** 0 Fehler, 0 Warnungen in `boot.mjs`, `scan2.mjs` (26 Stopps), `dense.mjs` (154), allen Interaktionsläufen und beim Laden von `localhost:3100`. Keine Hydration-Warnungen, keine Shader-Fehler (`console.error('shader …')` bleibt aus).
- **Netzwerk beim Laden:** 14 Anfragen, alle 200. JS (gz) 142 kB: `169-…js` 46,6, `3566ff3e-…js` 54,4, `page-…js` 33,9, Rest 7,5. Schriften 125 kB (Inter Latin 48,4, Inter Tight 44,9, JetBrains Mono 31,3), Bilder 8,6 kB. Nicht gesetzt: kein externer Host, kein Tracking, kein Font-CDN. Content-Security-Policy ist streng (`default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `upgrade-insecure-requests`), HSTS, `X-Frame-Options: DENY`. `/_next/static/*` mit `immutable`, `public/*` mit `max-age=0` (F-18).
- **Schriften:** drei Familien, alle `loaded`; `document.fonts.ready` baut die Canvas-Texte neu (`art.js:9`), First Paint 148 ms lokal.
- **SEO und Statik:** `/robots.txt`, `/sitemap.xml` (4 URLs), `/og.png` (200), Metadaten aus `NEXT_PUBLIC_APP_URL` bzw. `VERCEL_*` (lokal `http://localhost:3100`, Produktion über Umgebungsvariable, `.env.example` setzt `https://manawg.com`). 404-Seite vorhanden. `sw.js` ist ein Tombstone-Worker (räumt alte Caches), wird nirgends registriert.
- **Links:** siehe F-17. Alle externen Ziele (`app.manawg.com`) per `curl` mit 200.
- **(neu) Ladeverhalten unter Drosselung (`vitals.mjs`, Cache aus, Messung ab `goto`):**

| Profil | Load | FCP und LCP | CLS | Long Tasks (längste) | Hero erstmals gezeichnet | Lader ausgeblendet |
|---|---|---|---|---|---|---|
| 1800x987 lokal | 175 ms | 192 ms | 0,000 | 0 | 0,54 s | 2,67 s |
| 1800x987, Fast 4G (1,2 MB/s, 40 ms), CPU 4x | 518 ms | 328 ms | 0,005 | 2 (83 ms) | 0,81 s | 3,04 s |
| Handy 390x844 DPR 3, Fast 4G, CPU 4x | 535 ms | 340 ms | 0,000 | 2 (80 ms) | 0,86 s | 3,22 s |
| Handy, Slow 4G (0,2 MB/s, 150 ms), CPU 6x | 1 892 ms | 620 ms | 0,001 | 2 (136 ms) | 2,23 s | 4,59 s |

  Das LCP-Element ist der `h1`, den der Lader verdeckt. Es entsteht nie ein schwarzer Schirm ohne Rückmeldung (der Lader steht schon im Server-HTML, der Zähler beginnt mit dem JS). Aber der Lader ist an nichts gekoppelt (F-10): Der Berg ist lokal nach 0,54 s gezeichnet, der Lader hält ihn bis 2,67 s zurück. Bei Slow 4G liegen Hero (2,23 s) und Lader (4,59 s) dichter beieinander, die Wartezeit nach der Bereitschaft bleibt bei etwa 2,3 s.
- **(neu) Speicher und Listener (`leak.mjs`, 1600x900):** JS-Heap 3,3 MB am Start, danach 5,2 / 5,0 / 5,2 MB nach drei vollen Durchläufen (T 0 bis 15 300 und zurück), 5,0 MB nach 20 Größenwechseln. DOM-Knoten 754, Event-Listener 363, Canvas 13 und Dokumente 2 blieben in allen Messungen unverändert. Kein Leck, kein Wachstum.
- **(neu) WebKit (Playwright-WebKit, 1440x900 mit DPR 2 und iPhone-15-Emulation, `wk.mjs`):** 0 Konsolenfehler und -warnungen, WebGL2 verfügbar (`Apple GPU`), Lader endet, alle Szenen bei T 0, 3400, 6400, 9000, 12207, 13300 und 14500 gezeichnet (`v3/shots/sheet-wk-desk.jpg`). Für den Lauf auf `http` war ein Proxy nötig, der `content-security-policy` entfernt (`proxy3.mjs`): WebKit setzt `upgrade-insecure-requests` auch auf `localhost` um und lädt die Skripte sonst über https (TLS-Fehler). Auf der echten https-Adresse tritt das nicht auf. Die fps im Headless-WebKit liegen in jeder Szene bei 30 (Takt des Headless-Modus) und sagen nichts über Safari. Firefox ist in dieser Playwright-Installation nicht vorhanden und wurde nicht geprüft.

---

## 9. Was in Ordnung ist

- Konsole, Netzwerk, Schriften, Ladegewicht, Sicherheits-Header.
- Alle neun GL- und 2D-Szenen außer Hand und Finale laufen auch bei 6x CPU-Drosselung mit 120 fps. Keine Layout- oder Paint-Spitzen im vollständigen Durchlauf.
- Handy-Mock, Install-Tabs, FAQ, Körper greifen und werfen, Planet ziehen: funktionieren mit der Maus ohne Fehler (Trefferprüfung per `elementFromPoint`).
- Scrollen mit dem Mausrad im normalen Tempo (bis 6 000 px/s) setzt den Zustand der Overlays auch unter 6x Drosselung sauber (kein Hängenbleiben). Gilt nicht für Tasten, Deep Links und Handy-Wische (F-01).
- Fokus ist sichtbar (Standard), Enter und Space bedienen alle `role=button`.
- axe-core: keine serious oder critical Verstöße.
- Home-Taste und alle Anker enden im richtigen Zustand (Titel erscheint nach 0,5 s).
- Der Planet-Klick auf das Marker-Quadrat, das Abhaken und die FAQ-Umschaltung lösen keine Fehler aus.
- **(neu)** Kein Speicher- oder Listener-Wachstum über drei Durchläufe und 20 Größenwechsel (Abschnitt 8). CLS 0,000 bis 0,005, LCP 0,2 bis 0,6 s auch unter Drosselung.
- **(neu)** WebKit: 0 Konsolenfehler, WebGL2 da, alle Szenen gezeichnet.
- **(neu)** Echte Taps am Handy-Viewport treffen Handy-Tab, Install-Tab, FAQ-Zeile und alle CTAs und lösen aus (die Flächen sind aber winzig, Abschnitt 6).
- **(neu)** Ziehen und Doppelklick auf Körper, Planet, Tiefe und Wohnung markieren keinen Text.
- **(neu)** Keine falschen Umlaute und keine Platzhaltertexte in Landing und Rechtsseiten (Suche nach `TODO`, `Mustermann`, `Lorem`, `XXX`: kein Treffer).

---

## 10. Grenzen der Messung und offene Punkte

- **Display:** Takt des Prüf-Displays 120 Hz. 60 Hz nur durch rAF-Verdopplung emuliert (`hz.mjs`), keine echte Messung auf 60- oder 144-Hz-Bildschirm.
- **Geräte:** Kein echtes iOS-Safari, kein Android-Chrome. Touch nur als Chromium-Emulation (Planet-Tippen und Wischen, in Runde 2 zusätzlich Taps auf alle Bedienelemente und Wisch-Gesten per `Input.synthesizeScrollGesture`; andere Touch-Pfade nur aus dem Code). Eine echte Fling-Beschleunigung mit Nachlauf einer Fingergeste ist damit nicht nachgestellt, die Gesten laufen mit gleichmäßiger Geschwindigkeit. Drosselung per `setCPUThrottlingRate` ersetzt kein echtes Handy, die GPU-Last wird davon nicht skaliert.
- **GPU-Reserve und Shader-Kompilierung** auf Windows/ANGLE-D3D11 (Schleifen bis 140 Schritte in `terr`/`march`) sind auf macOS nicht prüfbar. `KHR_parallel_shader_compile` und Kompilieren hinter dem Lader sind trotzdem sinnvoll.
- **WebKit** in Runde 2 auf Konsole, WebGL2 und Szenen geprüft (Abschnitt 8), nicht auf Touch, Wisch-Gesten und Leistung (Headless-Takt 30 fps). **Firefox** ist nicht installiert und nicht geprüft.
- **Screenreader** nicht gehört, nur axe und Tab-Reihenfolge.
- **Nicht geprüft:** Browser-Zoom (V-10), Safe-Area (V-12), Druckansicht, Hochkontrast.
- **Zu klären:** Soll der Lader an die echte Bereitschaft gebunden werden und in der Sitzung nur einmal laufen (F-10)? Soll `INTRO ÜBERSPRINGEN` und Home weich durchlaufen oder schneiden (F-16)? Soll die Seite bei `reduce` Eigenbewegung stoppen (F-08)? **(neu)** Welche Hover-Gestaltung gehört zu den CTAs, und soll die Seite eine Fortschrittsanzeige oder eine schmale Scrollleiste bekommen (F-19)? Stimmt die Schreibweise der Anschrift im Impressum ("Strasse", F-20)?

### Empfohlene Reihenfolge der Behebung

1. F-01 mit F-04 (gemeinsamer Eingriff in `hero.js:243` und `Landing.tsx`/`overlays.tsx`), danach F-17 (Treffer).
2. F-02 (GL-Block entkoppeln).
3. F-03 zusammen mit dem Handneubau (Shader oder gecachte Ebenen), danach F-06 und F-07 (dt-Umstellung betrifft dieselben Dateien).
4. F-05, F-09, F-10, F-08.
5. Größen (Abschnitt 7) im Zug der Vollbild-Umstellung (V-Abschnitt 8), dann stimmen die Maße in CSS-px.

6. **(neu)** F-19 (Zustände, `Dc` kann sie schon) und F-20 (Texte, Rechtsseiten) zuletzt, beides ohne Abhängigkeit zu den Umbauten.

### Abnahme-Skripte (alle in `F`)

`freeze.mjs` (F-01, 36 000 px/s), `back.mjs` (Deep Links, Zurück, Neuladen), `nogl.mjs` (F-02), `throttle2.mjs` und `cpuprof.mjs` (F-03), `i-links.mjs` und `ghostlink.mjs` (F-04), `i-planet2.mjs` und `i-planet2.mjs touch` (F-05), `hz.mjs` (F-06), `adapt.mjs` (F-07), `rm.mjs` (F-08), `resize.mjs` (F-09), `boot.mjs` (F-10), `i-phone.mjs` (F-11), `i-physics.mjs` (F-12), `dense.mjs` (F-13), `i-faq.mjs`, `faqkey.mjs` (F-14), `i-install.mjs` (F-15), `homekey.mjs` (F-16), `mono.mjs`, `flutmock.mjs`, `crops.mjs` (Größen).

Aufruf Beispiel: `node freeze.mjs`, `node i-planet2.mjs touch`, `node dense.mjs 1800x987 1800 100 15374`. Server: `URL_PORT=http://localhost:PORT/ node …` (Standard `:3140`).

**(neu) Skripte aus Runde 2 (`S/v3/`, Aufruf `URL_PORT=http://localhost:3152/ node <skript>`):** `seq.mjs` (Sichtprüfung, Bild je T mit Wheel-Scrollen, Kontaktbögen), `freeze2.mjs` (Wheel-Tempi, End, Leertaste, Bild-ab), `touch.mjs` (Handy-Taps und Wisch-Gesten; `FLICKONLY=1` nur Wische, `CTAONLY=1` nur Taps), `hover.mjs` (F-19), `drawrate.mjs` (Zeichenrate bei 120 und 60 Hz), `fps3.mjs` (fps je Szene und unter 4x), `vitals.mjs` (Laden unter Drosselung), `leak.mjs` (Speicher), `wk.mjs` mit `proxy3.mjs` (WebKit), `legal.mjs` (Rechtsseiten und 404), `texts.mjs` (Textinventar), `select.mjs` (Textmarkierung). Die Skripte aus Runde 1 liegen in `S/v3/old/` bereits auf :3152 umgestellt (`runall.sh` und `runall2.sh` fahren die Wiederholung).

---

## 11. Abnahmekriterien nach dem Umbau (neu)

Zielwerte als Vorschlag, jeweils mit dem Skript, das sie misst (Ablage und Aufruf siehe Abschnitt 10). Die Ist-Werte stehen bei den Funden. Alle Läufe zusätzlich mit 0 Konsolenfehlern und 0 Warnungen.

| Fund | Zielwert | Skript |
|---|---|---|
| F-01 | Bei T > 7300 nach jedem Sprung und Wisch: Unterkante des Ende-Overlays kleiner 0, Titel-Deckung 0, Hinweis-Deckung 0, `--c0..3` gleich 0. Gilt für 4 Deep Links, ersten Tab-Druck, End (von T 1000, 5000, 6400), Leertaste 8 x, Wheel 6 000 bis 36 000 px/s, Handy-Wisch 1 500 bis 12 000 px/s | `back.mjs`, `freeze.mjs`, `freeze2.mjs`, `touch.mjs` |
| F-02 | Mit `--disable-3d-apis`: Lader spätestens nach 4 s weg, Text lesbar, Seite bedienbar, Konsole ohne Fehler | `nogl.mjs` |
| F-03 | Hand-Szene mindestens 55 fps bei 1x und mindestens 30 fps bei 4x Drosselung (heute 26 und 6,6). Neuer Hand-Code höchstens 4 ms Hauptthread je Frame bei 4x | `fps3.mjs`, `throttle2.mjs` |
| F-04 | Kopf-CTA zuerst in der Tab-Reihenfolge, kein Element mit Deckung 0 und `pointer-events:auto`, Fokusring gestaltet, axe ohne serious | `i-links.mjs`, `ghostlink.mjs`, `axe2.mjs` |
| F-05 | Tippen und Klicken auf Ort und Beschriftung wählt den Ort, Ortsliste per Tastatur, senkrechter Wisch am Planetenrand scrollt die Seite | `i-planet2.mjs`, `i-planet2.mjs touch` |
| F-06 | Planeten-Drehung 0,150 ± 0,01 rad/s bei 60 und 120 Hz, Körper-Rückkehr 3,5 ± 0,3 s bei beiden, Zeichenrate der Art-Szenen gleich der Bildwiederholrate | `hz.mjs`, `drawrate.mjs` |
| F-07 | Nach 320-ms-Ruckler höchstens 10 % Schärfeverlust, Erholung unter 0,3 s | `adapt.mjs` |
| F-08 | Mit `reduce`: Pixeländerung ohne Zeigerbewegung unter 0,3 % je 500 ms an allen elf Messpunkten | `rm.mjs` |
| F-09 | Nach Resize, Zurück und Neuladen derselbe Abschnitt (T ± 1 %), Lader nur beim ersten Besuch der Sitzung | `resize.mjs`, `back.mjs` |
| F-10 | Lader endet höchstens 0,3 s nach dem ersten gezeichneten Hero-Frame, Mindestdauer 0,8 s | `boot.mjs`, `vitals.mjs` |
| F-11 | Kein "1 Dinge", kein fester Monat, Mock ist die echte App | `i-phone.mjs` |
| F-12 | Beim Eintritt keine Fall-Phase: Abweichung von der Ruhelage unter 20 px nach 0,5 s | `i-physics.mjs` |
| F-13 | In T 8400 bis 11000 an jedem Messpunkt (Raster 100 T) mindestens 2 % helle Pixel | `dense.mjs` |
| F-14, F-15 | FAQ mit animierter Höhe und `aria-expanded`/`aria-controls`, Install-Tabs mit Pfeiltasten | `i-faq.mjs`, `faqkey.mjs`, `i-install.mjs` |
| F-16 | Anker über mehr als drei Fensterhöhen ohne Durchlauf mit Weiß-Blitz | `homekey.mjs` |
| F-17 | Footer-Links mindestens 44 px Trefferhöhe, AGB verlinkt | `i-links.mjs` |
| F-19 | Jede Zeile von `hover.mjs` meldet eine Style-Änderung, `:focus-visible` und `::selection` definiert | `hover.mjs` |
| F-20 | Rechtsseiten ohne horizontalen Überlauf bei 320 bis 390 px, kein Emoji in der 404 | `legal.mjs` |
| Größen (7) | Flut-Zelle 16 px (alternativ 20), Ziffer 10 bis 11 px, Tiefe-Nahzeichen höchstens 32 px, Lader-Ziffer höchstens 140 px, CTAs 40 bis 44 px mit 44 px Trefferfläche | `mono.mjs`, `flutmock.mjs` |
| Stabilität | Heap nach drei Durchläufen und 20 Resizes innerhalb 10 % des Werts nach dem ersten Durchlauf, Knoten- und Listenerzahl konstant | `leak.mjs` |
