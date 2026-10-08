# Audit Vollbild und Responsive

Stand 2026-10-06 · Branch `landing-produktion` · Quellstand `c766fd3` · nur Messung und Befund, am Quellcode wurde nichts geändert.

Belege liegen im Scratchpad (nicht im Repo): `V = /private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/vollbild/`
Dort auch alle Messskripte (`cap.mjs` Scroll-Aufnahme, `dom.mjs` Maße und Schrift, `hits.mjs` Trefferflächen, `canv.mjs` Canvas-Backing, `at.mjs` Einzelbilder bei bestimmtem T, `resize.mjs`/`resize2.mjs` Größenwechsel, `overlap.mjs` Kopf-Überdeckung, `jump.mjs` Sprung-Scroll, `legal2.mjs` Rechtsseiten, `wk2.mjs` + `proxy.mjs` WebKit, `barcheck.py` Balken-Pixelprüfung, `sheet2.py` Kontaktbögen), damit der Umbau gegen dieselben Messungen geprüft werden kann. Aufruf z. B. `node cap.mjs 390x844 touch`, `URL=http://localhost:PORT/` für einen anderen Server.

---

## 1. Ergebnis in Kürze

1. **Die Seite ist nirgends echtes Vollbild.** Alles (alle Szenen, Texte, Kopf, Hinweise, Lader) liegt in einer festen 1280x800-Bühne, die per `transform: scale(k)` mit `k = min(vw/1280, vh/800)` in den Viewport eingepasst wird (`Landing.tsx:24, 62-66`, gleiche Formel vorab in `page.tsx:5`). Nur bei exakt 16:10 füllt sie das Fenster. Sonst bleiben Balken in `#0A0A0A`: breiter als 16:10 = Seitenbalken, schmaler = Ober-/Unterbalken.
2. **Fast jedes echte Desktop-Fenster ist breiter als 16:10** (die Browserleiste frisst Höhe). Gerechnet: Full-HD-Chrome (1920x953) 198 px Balken je Seite = 21 % der Fläche leer, QHD-Chrome 240 px je Seite, Windows-Laptop bei 125 % (1536x730) 184 px, Ultrawide 680 px je Seite (40 %). Gemessen: 1920x1080 hat 96 px je Seite, 1024x768 hat 64 px oben/unten.
3. **Hochformat ist praktisch leer:** 768x1024 = 53 % ungenutzt (272 px Balken oben/unten), 390x844 = 71 % (Streifen 390x244 mitten im Bild), 360x740 = 70 %. Kopf, Hinweise und CTA hängen an der Bühne und schweben dort mitten auf dem Bildschirm.
4. **"Abgeschnitten" ist an mehreren Stellen echt:** Szenen enden hart an der Bühnenkante (Berg, Flut, ASCII-Finale, Fußzeilenlinie, Arm der Hand), und auf den Rechtsseiten (`/impressum`, `/datenschutz`, `/agb`) läuft der Text auf Handys 32 px über den rechten Rand hinaus (`scrollWidth` 422 bei 390 px).
5. **Mobil unlesbar und nicht bedienbar:** Die Schrift skaliert mit k. Bei 390 px sind 12-px-Labels 3,7 px groß, Fließtext (16 px) 4,9 px, 23 von 25 interaktiven Elementen sind kleiner als 44 px (21 kleiner als 24 px). Bei 1024x768 liegt der Median der Schrift schon bei 10,4 px.
6. **Scroll-Tempo hängt an k:** Die Hero-Strecke (6400 Einheiten) ist auf dem Desktop 8,0 Bildschirme lang, auf dem Handy 2,3. Ein Wisch überspringt dort ganze Szenen.
7. **Größenwechsel springt in eine andere Szene** (`Landing.tsx:68`): Drehen des Handys, Fenstergröße ändern, DevTools öffnen, Safari-Leiste im Querformat. Gemessen: 1440x900 bei T 8101 wird bei 1024x768 zu T 11393, bei 1920x1080 zu T 6751.
8. **HiDPI weich:** Art-Canvases haben festes 1280x800-Backing (`art.js:8`, `hero.js:148, 264, 282`). Auf einem MacBook (1440x900 bei 2x) wird alles um den Faktor 2,25 hochgezogen: Canvas-Text, ASCII und Dither-Quadrate sind sichtbar unscharf, DOM-Text bleibt scharf.
9. **Sprung-Scroll friert das Hand/Handy-Bild über der ganzen Seite ein** (`hero.js:243, 250`). Reproduziert mit `scrollTo` von T 6000 auf T 9000: Overlay bleibt auf `translateY(0)`, `--e = 1`, deckt alles bis zum Footer ab. Das ist sehr wahrscheinlich auch die Ursache für "Körper/Tiefe nur Schwarz" in der Sichtprüfung vom 2026-10-06, Punkt 5 (siehe V-15). Mit echtem Wheel-/Touch-Scroll in kleinen Schritten rendern Körper, Tiefe und Planet bei allen 7 Viewports sauber.
10. **Kein Befund:** kein horizontaler Überlauf der Landing (`scrollWidth == clientWidth` in allen Läufen), keine JS-Fehler in 7 Aufnahmeläufen, WebKit (iPhone-15-Emulation) rendert dieselbe Seite wie Chromium.

---

## 2. Messaufbau

- Server: Produktions-Build `.next-resp` (gebaut 12:22, Quellen unverändert seit 12:21, entspricht `c766fd3`), `next start -p 3141`. Die Ports 3100, 4190, 4191 blieben unberührt.
- Browser: Playwright Chromium, `--use-angle=metal --enable-gpu --ignore-gpu-blocklist`, bestätigt `ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro)`, also echte GPU. Zusätzlich Playwright WebKit (iPhone 15, 393x659) über einen Header-Proxy (der Prod-CSP-Header `upgrade-insecure-requests` plus HSTS bricht lokales WebKit über http, nur ein Testproblem).
- Viewports: 1920x1080, 1440x900, 1280x800, 1024x768, 768x1024 (Touch), 390x844 (Touch, DPR 2), 360x740 (Touch, DPR 2). Zusatz: 1512x860, 2560x1440, 844x390 (Handy quer), 1800x987.
- Scroll: Desktop `page.mouse.wheel` in 70-px-Schritten mit 30 ms Pause, Touch per CDP `Input.synthesizeScrollGesture` (220 px je Wisch), nie Sprünge. Aufnahme alle 450 Bühneneinheiten (T), 380 ms Beruhigung, 34 Bilder je Viewport.
- Kontaktbögen: `V/<viewport>/sheet-00..02.png`, Einzelbilder `V/<viewport>/NNN-tTTTTT.jpg`, Gesamtübersicht `V/matrix.png` (7 Viewports x 7 Schlüsselszenen).
- T ist der `scrollTop` des Bühnen-Rahmens (Zeitachse der Vorlage). Fensterscroll = T * k.

## 3. Wie die Seite heute skaliert

```
Landing.tsx:24   ROOT  position:fixed; width:1280px; height:800px; transform: translate(--x,--y) scale(--k)
Landing.tsx:62   k = Math.min(vw / 1280, vh / 800)
Landing.tsx:65-66 --x = (vw - 1280k)/2, --y = (vh - 800k)/2      (zentriert, Balken = Rest)
Landing.tsx:67   sizer.height = (scrollHeight - 800) * k + vh    (Dokumentscroll = T * k)
Landing.tsx:68   sc.scrollTop = window.scrollY / k               (Sprung bei Größenwechsel, V-08)
globals.css      html.js [data-scroller] { overflow:hidden !important }   (Bühne scrollt nur über den Fensterscroll)
```

Balkenformel: Seitenverhältnis > 1,6: Balken je Seite = `(vw - 1,6 vh) / 2`. Seitenverhältnis < 1,6: Balken oben und unten je `(vh - 0,625 vw) / 2`. Die Balkenfarbe `#0A0A0A` ist zugleich Seiten- und Bühnenhintergrund (`globals.css`, `Landing.tsx:24`). Auf dunklen Szenen sind die Balken deshalb unsichtbar, auf Berg, Flut, Hand-Szene und Finale treten die Kanten hart hervor.

## 4. Messwerte je Viewport (gemessen, `dom.mjs`)

| Viewport | k | Bühne | Balken | leer | Dokumenthöhe | Bildschirme |
|---|---|---|---|---|---|---|
| 1920x1080 | 1,350 | 1728x1080 | 96 links + rechts | 10 % | 20755 | 19,2 |
| 1512x860 | 1,075 | 1376x860 | 68 links + rechts | 9 % | 16527 | 19,2 |
| 1440x900 | 1,125 | 1440x900 | keine | 0 % | 17296 | 19,2 |
| 1280x800 | 1,000 | 1280x800 | keine | 0 % | 15374 | 19,2 |
| 1024x768 | 0,800 | 1024x640 | 64 oben + unten | 16,7 % | 12427 | 16,2 |
| 768x1024 Touch | 0,600 | 768x480 | 272 oben + unten | 53,1 % | 9768 | 9,5 |
| 390x844 Touch | 0,305 | 390x244 | 300 oben + unten | 71,1 % | 5285 | 6,3 |
| 360x740 Touch | 0,281 | 360x225 | 258 oben + unten | 69,6 % | 4839 | 6,5 |
| 844x390 Handy quer | 0,488 | 624x390 | 110 links + rechts | 26,1 % | 7495 | 19,2 |
| 2560x1440 | 1,800 | 2304x1440 | 128 links + rechts | 10 % | 27673 | 19,2 |

Pixelprüfung der Balken (`barcheck.py`, Hero-Bild T=0 und Flut-Bild T~3600, Randstreifen exakt `#0A0A0A`): Balken bei 1920x1080 (links/rechts) und bei 1024x768, 768x1024, 390x844, 360x740 (oben/unten). Kein Balken bei 1440x900 und 1280x800.

**Realistische Browserfenster (gerechnet, Viewporthöhe angenommen):**

| Fenster | Viewport | k | Bühne | Balken je Seite | leer |
|---|---|---|---|---|---|
| Laptop 1366x768, Chrome | 1366x657 | 0,821 | 1051x657 | 157 px seitlich | 23 % |
| Windows 1920x1080 bei 125 %, Chrome | 1536x730 | 0,913 | 1168x730 | 184 px seitlich | 24 % |
| MacBook Air 13, Chrome | 1440x789 | 0,986 | 1262x789 | 89 px seitlich | 12 % |
| MacBook Pro 14, Chrome | 1512x865 | 1,081 | 1384x865 | 64 px seitlich | 8 % |
| MacBook Pro 16, Chrome | 1728x1000 | 1,250 | 1600x1000 | 64 px seitlich | 7 % |
| Full-HD, Chrome | 1920x953 | 1,191 | 1525x953 | 198 px seitlich | 21 % |
| QHD, Chrome | 2560x1300 | 1,625 | 2080x1300 | 240 px seitlich | 19 % |
| Ultrawide 3440x1440, Chrome | 3440x1300 | 1,625 | 2080x1300 | 680 px seitlich | 40 % |
| iPad hoch, Safari | 820x1000 | 0,641 | 820x512 | 244 px oben/unten | 49 % |
| iPhone 15 hoch, Safari | 393x659 | 0,307 | 393x246 | 207 px oben/unten | 63 % |
| iPhone 15 quer | 734x330 | 0,412 | 528x330 | 103 px seitlich | 28 % |

**Schrift auf dem Bildschirm** (CSS-Größe der Bühne x k, Beispiele aus dem DOM):

| k | 12 px (Mono-Label) | 16 px (Fließtext) | 30 px (h3) | 44 px (Zeile) | 80 px (Titel) |
|---|---|---|---|---|---|
| 1,35 | 16,2 | 21,6 | 40,5 | 59,4 | 108 |
| 1,125 | 13,5 | 18,0 | 33,8 | 49,5 | 90 |
| 1,0 | 12,0 | 16,0 | 30,0 | 44,0 | 80 |
| 0,8 | 9,6 | 12,8 | 24,0 | 35,2 | 64 |
| 0,6 | 7,2 | 9,6 | 18,0 | 26,4 | 48 |
| 0,488 (quer) | 5,9 | 7,8 | 14,6 | 21,5 | 39 |
| 0,305 | 3,7 | 4,9 | 9,1 | 13,4 | 24 |
| 0,281 | 3,4 | 4,5 | 8,4 | 12,4 | 22 |

DOM-Textknoten (199 insgesamt) mit effektiv unter 12 px: 0 (1920), 56 (1440, davon 55 Flut-Ziffern mit 10 px), 136 (1024), 163 (768), 180 (390), 181 (360). Interaktive Elemente (25) mit kleinster Seite unter 44 px: 9 (1920/1440), 13 (1280), 21 (1024/768), 23 (390/360); unter 24 px: 9 von 1920 bis 768, 21 bei 390/360. Schon auf dem Desktop sind `INTRO ÜBERSPRINGEN` und die 8 Fußzeilenlinks nur 16 bis 23 px hoch.

---

## 5. Funde

### V-01 Letterbox / Pillarbox (Kern des Auftrags)
Siehe Abschnitte 3 und 4. Betroffen sind alle Viewports außer exakt 16:10. Belege: `V/matrix.png`, `V/1920x1080/000-t00000.jpg`, `V/1024x768/sheet-00.png`, `V/768x1024/sheet-00.png`, `V/390x844t/sheet-00.png`.
Ursache: `Landing.tsx:62` (min statt Füllen), alle Szenen als 1280x800-Canvas/DOM (Abschnitt 6).

### V-02 Szenenkanten werden sichtbar ("abgeschnitten")
Wo die Bühnenkante bei Seitenbalken hart auf Schwarz trifft (1920x1080, Kante bei x = 96 und x = 1824):
- **Berg und Zeichen (T 0 bis ca. 1500):** der helle Himmel und die Berge enden an der Kante, `V/1920x1080/000-t00000.jpg`.
- **Flut 1 (T ca. 3200 bis 5000) und Flut 2 (T ca. 5376 bis 6336):** weiße Zellen enden hart an der Kante, `V/1920x1080/008-t03601.jpg`. Auffällig auch die Größe: Zelle = 32 Bühnen-px = 43 px bei 1920, 58 px bei 2560, 36 px bei 1440.
- **Finale (T 14429 bis 15189) und Fußzeile:** ASCII-Sonne, gestrichelte Fußlinie und Spaltenlinien enden bei x = 96/1824, `V/1920x1080/033-t14574.jpg`.
- **Hand/Handy bei Hochformat:** der Arm läuft an der unteren Streifenkante ab statt aus dem Fenster, `V/768x1024/014-t06418.jpg` (Arm endet bei y = 752 von 1024).
- Haarlinien von So geht's, Fragen, Fußzeile (Rahmen im DOM) enden ebenfalls an der Kante, auf Schwarz kaum sichtbar.

Bei 1440x900 und 1280x800 ist nichts abgeschnitten außer durch normales Scrollen.

### V-03 Kopf, Hinweise und CTA sitzen an der Bühne statt am Fensterrand
`overlays.tsx:47` (Kopf `top:28px; left:40px; right:40px`), `overlays.tsx:268, 280` (Hinweise `bottom:28px`), `overlays.tsx:24` (Titel `bottom:64px`). Folge: 390x844: Kopf bei y = 308 px (36 % von oben), Hinweise bei y = 535. 1024x768: Kopf 86 px unter der Fensterkante. 1920x1080: Logo bei x = 150 statt 54, CTA 150 px vom rechten Rand.

### V-04 Überlappung: feststehender Kopf über Inhalt
Der Kopf (`ManaWG`-Logo, CTA `WG erstellen`) hat keinen Hintergrund und liegt über dem Scroll-Inhalt. Gemessen per DOM-Rechteckschnitt (`overlap.mjs`, T in Bühneneinheiten, bei jedem Viewport gleich, nur skaliert). Beleg: `V/1440x900/top-overlaps.png`.

| T | Kopf-Teil | überdeckter Text |
|---|---|---|
| 7175-7250 | Logo, CTA | Ziffern des Flut-Bands |
| 7350 | Logo | `[ 05 ] SO GEHT'S` |
| 7600-7675 | Logo, CTA | `WG erstellen` (h3), `Namen eingeben. Mehr braucht es nicht.`, `Erste Ausgabe, erster Einkauf, erster Putztermin.` |
| 7850-7925 | Logo | `[ ACHT KÖRPER ]`, `Wirf sie. Sie finden zurück.` |
| 11425-11450 | Logo | `[ TIEFE ] WEITER SCROLLEN` |
| 12000-12125 | Logo, CTA | `03 · ABSPRACHEN`, `Kalender, Pinnwand, Chat.`, Zähler `TIEFE 568` |
| 12225-12400 | Logo | `[ 06 ] BEREICHE`, `Acht Orte.`, `Eine WG.`, Hinweiszeile |
| 12750-12900 | Logo | `01 · AUSGABEN`, `Wer zahlt, trägt ein. ManaWG teilt auf.`, Karte `Pizzaabend` |
| 13050-13700 | Logo | `[ 07 ] INSTALLIEREN`, Überschrift, Fließtext, Tabs, Schritte 01 bis 03, Button |
| 13850-14250 | Logo, CTA | `[ 08 ] FRAGEN`, Fragen und Antwort, `+`/`-` |
| 14525-14574 | Logo | Finale-Titel `Alltag` |

Zusätzlich (Canvas-Text, vom DOM-Test nicht erfasst): das Tiefe-Wort `ABSPRACHEN` läuft bei T ca. 11500 bis 11900 unter dem Kopf durch (`V/1440x900/026-t11701.jpg`).

### V-05 Schrift zu klein
Tabelle in Abschnitt 4. Bis 1024x768 (k = 0,8) fallen die Labels unter 10 px, ab 768x1024 ist selbst der Fließtext unter 10 px, bei 390x844 sind nur noch Display-Größen lesbar (Titel 80 px = 24 px, Zeilen 44 px = 13 px). Die Seite ist auf Handys für Texte nicht nutzbar.
Canvas-gezeichnete Schrift (nicht im DOM, wird mit k skaliert): `hero.js:50, 54` (Namen und Raumnamen 11 px Mono), `hero.js:294` (Flut-Ziffern 10 px), `art.js:20` (ptext-Glyphen, 10 px bei `data-cs=8`), `art.js:93` (Tiefe: 8 bis 45 px), `art.js:144` (Planet-Labels 11 px), `art.js:187` (Körper-Labels 11 px), `art.js:43` (ASCII 12 px, Raster 9x14).

### V-06 Trefferflächen
Mindestens 44 px nach HIG, 24 px nach WCAG 2.5.8. Gemessen (25 interaktive Elemente: Links, `role=button`, `data-go`, `data-cta`): siehe Abschnitt 4. Größen bei 390x844 (`hits.mjs`): Fußzeilenlinks 63x5 px, `INTRO ÜBERSPRINGEN` 50x5 px, Kopf-CTA 37x13 px, Installieren-Tabs 24 bis 27 x 12 px, `App installieren` 51x15 px, Finale-Buttons 45x15 und 59x15 px, Tableiste im Handy 18x14 px, FAQ-Zeilen 28 px hoch (geschlossen).

### V-07 Scroll-Tempo hängt an k
Dokumentscroll = T * k (`Landing.tsx:67-68`), die Zeitachse der Szenen ist in T festgelegt (`hero.js:245`: `P0 = scrollTop / 6400`). Strecke der Hero-Szene (6400 Einheiten) in Bildschirmhöhen: 1920x1080 8,0 · 1440x900 8,0 · 1024x768 6,7 · 768x1024 3,75 · 390x844 2,3 · 360x740 2,4. Die vier Wohnungsräume (T 3968 bis 5760) sind bei 390x844 nur 546 px lang (0,65 Bildschirm, 1 bis 2 Wischer). Gesamtseite: 19 Bildschirme (Desktop) gegen 6,3 (390x844).

### V-08 Größenwechsel springt in eine andere Szene
`Landing.tsx:68` setzt nach jedem `resize` `sc.scrollTop = window.scrollY / k_neu`, der Fensterscroll bleibt stehen, k ändert sich, also ändert sich T. Gemessen (`resize.mjs`, `resize2.mjs`):

| Start | danach | T vorher | T nachher |
|---|---|---|---|
| 1440x900 | 1024x768 | 8101 | 11393 |
| 1440x900 | 1920x1080 | 8101 | 6751 |
| 768x1024 | 1024x768 | 8102 | 6076 |
| 390x844 | 844x390 (Drehen) | 8100 | 5063 |
| 844x390 | 844x340 (Safari-Leiste quer) | 8105 | 9296 |
| 1920x1080 | 1920x900 (Höhe) | 8101 | 9721 |

Im Hochformat ändert eine Höhenänderung (844 auf 760) T nicht, weil k dort an der Breite hängt.
Fix an einer Stelle: in `fit()` T merken und `window.scrollTo(0, T * k_neu)` setzen, statt `sc.scrollTop = scrollY / k` (`Landing.tsx:59-69`).

### V-09 HiDPI: Canvas-Backing ist fest 1280x800
Gemessen (`canv.mjs`): Art-Canvases (`ptext`, `physics`, `depth`, `planet`, `ascii`, `stars`) haben Backing 340x150 / 1280x760 / 1280x800 (`art.js:8`: `adpr = 1`; `art.js:10` setzt `cv.width = W * adpr` aus `data-w/data-h`). Hero-Canvas: Backing `1280x800 * qo` mit Deckel 1 (`hero.js:264-265`). Wohnungs-Layer: Faktor höchstens 1,25 (`hero.js:282-283`). Hand- und Flut-Canvas: fest 1280x800 (`hero.js:148`).
Hochskalierung auf dem Bildschirm: 1440x900 bei DPR 2 = Faktor 2,25 (Wohnung 1,8), 1920x1080 bei DPR 1 = 1,35. Belege (DPR 2, 1440x900): `V/at/c-dpr2-koerper.png` (Labels `EINKAUF`, `PUTZEN` weich, DOM-Text daneben scharf), `V/at/c-dpr2-tiefe.png` (Zeichenwolke weich), `V/at/c-dpr2-hero.png` (Halbton-Punkte weich), `V/at/c-dpr2-wohnung2.png` (DOM-Titel scharf, Canvas-Linien und Ziffern weich). Auf Handys ist das Backing dagegen zu groß (390 px bei DPR 2: Faktor 0,61 herunter), das verschenkt Speicher und Rechenzeit.

### V-10 Browser-Zoom wirkt nicht
k folgt `clientWidth`/`innerHeight`. Zoom auf 200 % halbiert den CSS-Viewport, k halbiert sich, die Bühne bleibt exakt gleich groß auf dem Bildschirm. Schriftvergrößerung (WCAG 1.4.4) und Reflow (1.4.10) sind damit außer Kraft. Abgeleitet aus V-01 und dem Code, nicht separat mit echtem Zoom gemessen.

### V-11 Touch: Scroll-Fallen und kleine Greifflächen
- `Landing.tsx:95-106`: `preventDefault` auf `touchstart`, wenn `s.grab >= 0`, `s.paint >= 0` oder (Planet) `hypot(m.x - 820, m.y - 430) < 300`. Der Planet-Kreis (r = 300 Bühnen-px) ist heute nur 183 px breit (390 px Fenster). In einem echten Vollbild-Layout wäre er groß und würde die Seite an dieser Stelle nicht mehr scrollen lassen. Scroll-Rand von mindestens 24 px einplanen.
- Körper greifen (`art.js:173`: Treffer bei Abstand < 10 Bühnen-px zum Rand). Radien der acht Körper = `[80,52,33,44,29,42,56,44] * 1,15 * 0,98` = 33 bis 90 Bühnen-px, bei 390 px Breite 10 bis 27 px Radius. Die kleinen Körper (Putzen, Pinnwand) sind mit dem Finger kaum zu greifen.

### V-12 Safe-Area
`layout.tsx` setzt `viewport-fit=cover`, aber die Landing nutzt nirgends `env(safe-area-inset-*)` (nur die Rechtsseiten). Heute harmlos, weil die Bühne durch den Letterbox-Abstand weit von Notch und Home-Indikator weg liegt. Sobald Kopf und Hinweise echt am Fensterrand sitzen, werden Insets nötig.

### V-13 Hochformat ist nicht komponiert
Spalten bleiben nebeneinander und werden einfach verkleinert: So geht's (3 Spalten, je 400 px, bei 390 px Breite 122 px), Installieren (Text 520 px + Handy-Spalte ab x = 620), Planet links, Karte unten links, Handy rechts der Mitte (`overlays.tsx:352`, Mitte 800/400), Fußzeile 4 Spalten (`sections.tsx:861`). Das ist die Folge von V-01, nicht ein eigener Fehler, muss aber im Umbau mitgelöst werden.

### V-14 Eingaben nur innerhalb der Bühne
Zeiger-Listener hängen an der Bühne (`hero.js:153` auf `root`, `art.js:13` auf dem Canvas-Host). In den Balken passiert nichts: Maus-Licht, Hand-Zeiger, Flut-Cursor und Körperabstoßung hören an der Kante auf (`pointerleave`).

### V-15 Sprung-Scroll friert das Ende-Overlay ein (Querverweis: Sichtprüfung 2026-10-06, Punkt 2 und 5)
`hero.js:243`: `if (s.sc.scrollTop > 7300 && !this.props.tour) continue;` überspringt die ganze Schleife inklusive `--e` und `endov.style.transform` (`hero.js:248, 250`). Der Fehler greift, wenn der letzte gezeichnete Frame im Handy-Bereich lag (T über ca. 5760, dort ist `--e > 0`) und der Scroll danach innerhalb eines Frames über 7300 springt (belegt für `scrollTo`; sonst denkbar bei Anker-Links mit `prefers-reduced-motion`, `Landing.tsx:91`, Taste Ende oder Frame-Aussetzern). Dann bleiben `--e` und die letzte `translateY` stehen. Reproduktion `jump.mjs` (1440x900): von T ca. 6000 per `scrollTo` auf T 9000 ergibt `transform: translateY(0px)`, `--e: 1`, `opacity: 1`. Das Hand/Handy-Bild mit `#0A0A0A`-Hintergrund liegt dann über Tiefe, Planet, Installieren, Fragen und Finale (`V/at/jump-scrollto.jpg`), auch über dem Kopf. Bei 6x `PageDown` blieb `translateY(-824px)` stehen und der Fehler zeigte sich nicht. Mit der echten Scrollfolge der Aufnahmen (Wheel in 70-px-Schritten) tritt er nicht auf.
Folge für die Prüfung: Körper/Tiefe "nur Schwarz" ist sehr wahrscheinlich dieses Overlay bei Sprungscroll (zeigt Hand/Handy oder, bei teilweiser Verschiebung, schwarze Fläche über der Szene), kein Init-Fehler der Szenen. Die ursprüngliche Prüfsitzung wurde nicht nachgestellt. Beleg für den Normalfall: `V/at/m1800-sheet.png` (1800x987, Körper, Tiefe, Planet sichtbar), `V/koerper-tiefe-check.png` (1280x800 und 360x740) und alle `sheet-*.png`.
Fix an einer Stelle: vor dem `continue` Overlay sicher ausblenden (`--e` auf 0 und `endov` aus dem Bild), nicht nur die Schleife überspringen.

### V-16 Rechtsseiten laufen auf Handys über den Rand (echtes Abschneiden)
`/impressum`, `/datenschutz`, `/agb`: Wrapper `div.flex-1.max-w-2xl.mx-auto.w-full.px-4` (jeweils `page.tsx:16`) hat `box-sizing: content-box`, weil `globals.css` nur `@tailwind utilities` lädt (kein Preflight). `w-full` + `px-4` ergibt 100 % + 32 px. Gemessen: `scrollWidth` 422 bei 390 px, 392 bei 360 px, 352 bei 320 px (Landing selbst: kein Überlauf). Text ist am rechten Rand abgeschnitten (`V/at/legal-390-impressum.jpg`: `Stand: 2026-05-` und `Eine schnelle Kontaktaufnahme und` fehlen die Enden). Ab ca. 704 px Breite verschwindet der Fehler (max-w-2xl greift).
Fix: `box-border` an den drei Wrappern. Globaler Preflight wäre falsch, er würde die Bühne verändern (deren Inline-Styles rechnen mit `content-box`).

### V-17 Nicht betroffen
- Horizontaler Überlauf der Landing: nirgends (`scrollWidth == clientWidth`).
- Konsole: keine Fehler und Warnungen in allen Läufen.
- 404-Seite (`not-found.tsx`): kein Überlauf bei 390 und 1440.
- WebKit iPhone 15 (393x659, `V/wk/wk-sheet.png`): gleiche Bühne k = 0,307, gleiche Szenen, `webgl2` verfügbar.

---

## 6. Fest auf 1280x800 gerechnete Koordinaten (Datei:Zeile)

Konvention: "Bühnen-px" = Pixel der 1280x800-Bühne vor `scale(k)`.

### 6.1 `Landing.tsx` und `page.tsx`
| Zeile | Wert | Bedeutung |
|---|---|---|
| `Landing.tsx:24` | `width:1280px; height:800px; transform: translate(--x,--y) scale(--k)` | die feste Bühne |
| `Landing.tsx:62` | `Math.min(vw / 1280, vh / 800)` | Skalierung, erzeugt Letterbox |
| `Landing.tsx:65-66` | `(vw - 1280 * k) / 2`, `(vh - 800 * k) / 2` | Zentrierung |
| `Landing.tsx:67` | `(sc.scrollHeight - 800) * k + vh` | Dokumenthöhe, T = scrollY / k |
| `Landing.tsx:68` | `sc.scrollTop = window.scrollY / k` | Szenensprung beim Größenwechsel (V-08) |
| `Landing.tsx:72, 76` | `/ kRef.current` | Zwei-Wege-Abgleich, bleibt gültig, wenn k fest bleibt |
| `Landing.tsx:87-90` | `- 110` | Sprunglink-Versatz in Bühnen-px (Kopfhöhe) |
| `Landing.tsx:103` | `hypot(m.x - 820, m.y - 430) < 300` | Planet-Scrollfalle, Planetmitte (V-11) |
| `page.tsx:5` | `Math.min(w/1280, h/800)` | dieselbe Formel vor dem ersten Paint |
| `dc.tsx` | keine | nur `css()`-Parser, `Dc`, `press` |

### 6.2 `sections.tsx`
| Zeile | Wert | Bedeutung |
|---|---|---|
| 14 | `sticky; width:1280px; height:800px` | Hero-Fläche (3 Canvases `100%`, 18-32) |
| 35 | `height:6400px` | Hero-Pinnstrecke, passt zu `hero.js:245` |
| 47 | `repeat(40,32px)`, Zeilen 32 px | Flut-Band: 1280 px breit, 3 Zeilen, Zelle 32 |
| 70, 84 | `padding:96px 40px 120px`, 3 Spalten | So geht's, Spalte (1280 - 80) / 3 = 400 |
| 95-96, 123-124, 147-148, 102/130/154 | Canvas 340x150 | Ziffern 01 bis 03 |
| 179, 184-187 | `height:760px`, Canvas 1280x760 | Acht Körper |
| 191 | `left:40px; top:48px` | Körper-Titel |
| 221, 223 | `height:3600px`, sticky `height:800px` | Tiefe (Pinnstrecke 2800 plus 800) |
| 226-229 | Canvas 1280x800 | Tiefe |
| 233, 241, 262, 283, 303 | `top:72`, `bottom:72`, `right:40; bottom:28` | Tiefe-Beschriftungen |
| 321, 326-329 | `height:800px`, Canvas 1280x800 | Planet |
| 333, 365 | `top:72; left:40`, `left:40; bottom:48; width:380px` | Planet-Titel, Karte |
| 405, 410, 432 | `height:800px`, `left:40; top:96; width:520px`, `max-width:420px` | Installieren Text |
| 487, 493 | `left:620px; right:0`, Handy `300x620` | Installieren Handy-Spalte |
| 731, 780 | `padding:96px 40px 120px`, `max-width:640px` | Fragen |
| 801, 807-810, 814, 820 | `height:760px`, Canvas 1280x760, `padding:0 40px`, Titel 200 px | Finale |
| 856, 861 | `padding:0 40px`, Grid `2fr 1fr 1fr 1fr`, `margin:0 -40px` | Fußzeile |

Abschnittsversatz (Bühnen-px, aus `canv.mjs`): Intro 0/7200, Flut-Band 7200/96, So geht's 7296/551, Körper 7847/760, Tiefe 8607/3600, Planet 12207/800, Installieren 13007/800, Fragen 13807/622, Finale 14429/760, Fußzeile 15189/185, gesamt 15374.

### 6.3 `overlays.tsx`
| Zeile | Wert | Bedeutung |
|---|---|---|
| 15-19 | Canvas `stars` 1280x800 | Hero-Sterne |
| 24 | `left:40px; bottom:64px` | Hero-Titel |
| 47 | `top:28px; left:40px; right:40px` | Kopf (V-03) |
| 79 | `left:40px; top:150px; width:440px; height:520px` | Raumtexte der Wohnung |
| 268, 280 | `left:40px; bottom:28px`, `right:40px; bottom:28px` | Hinweise |
| 296, 302 | `padding:40px`, Zähler 176 px | Lader |
| 338, 341-345 | `inset:0`, Hand-Canvas `100%` | Ende-Overlay |
| 352 | `left:650px; top:90px; width:300px; height:620px` | Handy-Hülle, Mitte (800/400) = `PCX/PCY` in `hero.js:168` |
| 632, 637 | Front-Hand-Canvas `100%`, `left:40px; bottom:48px` | Hand vorn, CTA |

### 6.4 `engine/hero.js`
| Zeile | Wert | Bedeutung |
|---|---|---|
| 2 | `const W = 1280, H = 800` | Basis aller Hero-Rechnungen |
| 10-11 | `ROOMS` (Iso-Raster 0..20 x 0..16), `STOPS` mit `ox/oy` = 780/470, 840/420, 640/300, `u` = 24 bis 80 | Wohnung, Projektionsursprung in Bühnen-px |
| 22 | `FL = 210`, `stp = 5.5 / u` | Lichtkegel, Rasterweite |
| 27 | Clip `pt[0] > W`, `pt[1] > H` | Zeichnen nur innerhalb der Bühne |
| 50, 54 | `mono(11)` | Canvas-Schrift |
| 120, 122 | `6. * uR.y / 800.`, `uR.y / 800.` | Shader: Zellen/Schraffur skalieren mit Höhe 800 (aspektneutral) |
| 134 | `texImage2D(..., W, H, ...)` | Offscreen-Textur fest 1280x800 |
| 146, 149 | `m: {x:640, y:400}`, `sm: {x:640, y:400}` | Mausstart in der Mitte |
| 147 | `ht: {x:860, y:430}` | Hand-Zielstart |
| 148 | `c.width = W; c.height = H` | Hand- und Flut-Canvas fest 1280x800 |
| 150 | `(clientX - r.left) * W / r.width` | Zeiger in Bühnen-px (bleibt gültig bei k) |
| 168 | `PCX = 800, PCY = 400` | Handy-Mitte, gekoppelt an `overlays.tsx:352` |
| 172-181 | `FR`, `holdBack`, `holdFront` (Koordinaten 600 bis 990, 232 bis 1160) | Hand-Geometrie in Bühnen-px |
| 183 | `phoneBox`: Halbmaße 104x264, Radius 46 | Handy-Maske |
| 187 | `lightF`: `(x - 450) + (y - 120)) / 1100` | Handlicht von links oben |
| 190 | `[840 + sin * 50, 380 + cos * 80]` | Idle-Ziel der Hand |
| 193 | `1460 - s.ht.x`, `1020 - s.ht.y` | Arm-Anker unten rechts außerhalb der Bühne |
| 208-212 | `CG = 12`, `W / CG`, Radien 160, 36, 26, 40, 60 | Masken-Raster der Hand |
| 216 | `(y - 760) / 320` | Schatten der hinteren Hand |
| 243, 250 | `scrollTop > 7300`, `scrollTop - 6400` | Szenen-Ende und Overlay-Verschiebung (V-15) |
| 245 | `scrollTop / 6400` | Zeitachse P |
| 252 | `(m.x - 640) / 640`, `(400 - m.y) / 400` | Parallaxe um die Mitte |
| 262-264 | `hx`, `hy`, `cz`, `qo = ... r.width / W * dpr` | Organ-Kamera, Auflösungsfaktor (Deckel 1) |
| 265, 267 | `cv.width = W * qo`, `fh = fw * H / W` | Canvas fest Seitenverhältnis 1,6 |
| 282-284 | `fq` (Deckel 1,25), `setTransform(cv.width / W)` | Wohnungs-Layer |
| 289 | `cs = 32, cols = 40, rows = 25` | Flut-Raster 40x25 Zellen à 32 |
| 292 | `(b < 3 && a < 9) || (b < 3 && a > 33)` | Aussparung für Logo (Spalten 0 bis 8) und CTA (34 bis 39), oberste 3 Zeilen |
| 294, 296 | `500 10px Mono`, Cursorbox `cs` | Ziffern, Zellrahmen |

Die Shader (`SCENE`, `POST`) rechnen mit `UV = (gl_FragCoord - .5 * uR) / uR.y` und sind damit seitenverhältnis-neutral (breiteres Fenster zeigt mehr Berg). Fest sind nur Texturgröße (134), Canvas-Backing (265, 267) und die 2D-Teile.

### 6.5 `engine/art.js` (im DOM benutzt: `ptext` x3, `physics`, `depth`, `planet`, `ascii`, `stars`)
| Zeile | Wert | Bedeutung |
|---|---|---|
| 8 | `adpr = 1` | Backing nie über 1 (V-09) |
| 10, 12 | `W = +dataset.w`, `H = +dataset.h`, `sm: {x: W*0.6, y: H*0.4}` | Größe nur aus `data-w/data-h`, nie aus dem Layout |
| 13 | `(clientX - r.left) * W / r.width` | Zeigerumrechnung |
| 15-23 | `cs = 8`, `fs = 150`, 340x150 | `ptext` (So geht's Ziffern) |
| 41, 44 | `cw = 9, chh = 14`, `sr = H * 0.62` | ASCII-Raster und Sonnenradius (Finale), Mitte `W / 2` |
| 78-95, 84 | `F = 720`, `(sm.x - 640) / 640`, `(sm.y - 400) / 400`, `W / 2`, `H / 2` | Tiefe: Brennweite und Mitte |
| 125 | `cx = 820, cy = 430, R = 300` | Planet, absolute Position (Hochformat: nicht zentriert) |
| 128 | Sterne zufällig in `W x H` | Planet-Hintergrund |
| 171, 179 | `S = 1.15`, `hx = W/2 - 208*S`, `hy = H/2 - 173*S + 20`, Wände `0..W`, Boden `H` | Körper (Phone-Modus 830/110/1130/690 ungenutzt) |
| 173 | Treffer `d < 10` | Greifradius (V-11) |
| 187-188 | `500 11px Mono` | Körper-Labels |
| 209-210 | `S = 0.62`, `ox = 1180 - 420*S`, `oy = 70`, Sterne `W x H*0.45` | Sterne (Sternbild aktuell leer: `s.st = []`) |

Ungenutzt (toter Code für den Umbau): `tone`, `topo`, `mosaic`, `mesh`, `press` (`PW = 900, PH = 2300`), `fluid`, `score`, `ticker`, `snow`, Phone-Modus von `physics`.

### 6.6 `engine/install.js`, `engine/logic.js`
`install.js:6`: Rahmen 300x620 (Rechner 600x400), `install.js:8`: Padding; `install.js:15`: Start des Tipp-Punkts `[150, dk ? 300 : 560]` in Rahmen-px. `install.js:10` rechnet mit `sc = R.width / fr.offsetWidth` und ist damit k-neutral. `logic.js`: keine Koordinaten.

---

## 7. Szenenmatrix

16:10 (1440x900, 1280x800) füllt überall. "Kante" = was bei Seitenbalken (1920x1080) sichtbar abgeschnitten ist. "Hochformat" = was bei 390x844 passiert.

| Szene | T | Kante bei Seitenbalken | Hochformat 390x844 |
|---|---|---|---|
| Berg, Zeichen | 0-1500 | Himmel/Berg endet hart bei x = 96/1824 | Streifen 244 px hoch, Titel 24 px, Hinweise 3,7 px |
| Zeichen, Organ, Tauchgang | 1500-3900 | Halbton-Raster endet an der Kante (auf Schwarz kaum sichtbar) | Streifen |
| Flut 1 / Flut 2 | 3200-5000 / 5376-6336 | weiße Zellen enden hart (Zelle 43 px) | Zellen 10 px, Streifen |
| Wohnung | 3968-5760 | Iso-Zeichnung endet an der Kante (dunkel, unauffällig) | Raumtext 12 px = 3,7 px, Titel 64 px = 19 px |
| Handy und Hand | 5760-7200 | Arm blendet vor der Kante aus | Handy 91x189 px, Arm endet an der Streifenkante |
| Flut-Band, So geht's | 7200-7847 | Linien bis zur Kante | 3 Spalten je 122 px, Text 4,9 px |
| Acht Körper | 7847-8607 | Wände bei Bühnenrand, Körper stapeln sich in 1280 | Körperradius 10 bis 27 px |
| Tiefe | 8607-12207 | Staub endet an der Kante (unauffällig) | Wortpunkte 8 bis 45 px Bühnenschrift = 2,4 bis 14 px, Captions 44 px = 13 px |
| Planet | 12207-13007 | Glow endet an der Kante | Planet r = 91 px, Scrollfalle (V-11) |
| Installieren | 13007-13807 | Haarlinien bis zur Kante | zwei Spalten nebeneinander, Handy 91x189 px |
| Fragen | 13807-14429 | Haarlinien bis zur Kante | Zeilen 28 px hoch |
| Finale | 14429-15189 | ASCII-Feld endet hart bei x = 96/1824 | Titel 61 px, Buttons 15 px hoch |
| Fußzeile | 15189-15374 | Fuß- und Spaltenlinien enden hart | Links 5 px hoch |

---

## 8. Folgerungen für den Umbau

1. **Bühne füllt den Viewport (Vorschlag):** `ROOT` nicht mehr 1280x800, sondern Viewport-Größe in Einheiten `u` (Querformat `u = min(vh / 800, vw / 1100)`, Breite `W = vw / u`, Höhe `H = vh / u` als CSS-Variablen; die Mindestbreite 1100 deckt 4:3 ab, die So-geht's-Spalten brauchen ca. 1100). Alle `1280`/`800`/`760` aus Abschnitt 6 an `W`/`H` bzw. an einen `ResizeObserver` je Szene binden, Canvas-Backing = CSS-Größe x `min(dpr, 2)`.
2. **Hintergrund-Szenen füllen (cover), Kompositionen passen (fit):** Berg, Organ, Flut, ASCII-Sonne, Sterne, Staub immer vollflächig. Handy, Hand, Planet, Körper-Boden als Anteil von Mitte und Höhe rechnen (`(x - 640) * f`, `(y - 400) * f`, `f = min(W / 1280, H / 800)`), Arm-Anker an die untere rechte Fensterecke koppeln.
3. **Hochformat getrennt komponieren** (Schwelle Seitenverhältnis ca. 1,15): Spalten stapeln (So geht's, Installieren, Planet mit Karte, Handy mittig, Fußzeile), Pinnstrecken in `svh`, Scroll-Rand für Planet und Körper.
4. **Untergrenzen statt freiem Skalieren:** DOM-Schrift effektiv mindestens 12 px, Trefferfläche mindestens 44 px, Canvas-Schrift mindestens 10 px. Unter k = 0,8 Layout wechseln, nicht weiter verkleinern.
5. **Flut:** `cols = ceil(W / cs)`, `rows = ceil(H / cs)`, `cs` in CSS-px (etwa 14 bis 18) statt 32 * k; Aussparung (`hero.js:292`) an die echten Rechtecke von Logo und CTA koppeln.
6. **Szene halten:** `fit()` merkt T und setzt `window.scrollTo(0, T * k)` (V-08). Scroll-Länge unabhängig von k machen oder auf Handys verlängern (V-07). Ende-Overlay vor dem `continue` in `hero.js:243` ausblenden (V-15).
7. **Kopf:** Hintergrund oder `mix-blend-mode: difference` bzw. Ausblenden beim Scrollen (V-04), echte Fensterkante plus `env(safe-area-inset-*)` (V-03, V-12).
8. **Rechtsseiten:** `box-border` an den drei Wrappern (V-16).
9. **Abnahme nach dem Umbau** (alles mit den Skripten in `V`, 7 Viewports plus 2560x1440, 844x390, 1512x860, 1536x730):
   - `cap.mjs` je Viewport, `barcheck.py`: kein `BALKEN` bei Hero und Flut.
   - `dom.mjs`: Schrift effektiv >= 12 px (DOM), Trefferflächen >= 44 px, `sw == cw`.
   - `resize.mjs`, `resize2.mjs`: T nach Größenwechsel gleich (+-2).
   - `overlap.mjs`: keine Überdeckung von Text durch den Kopf.
   - `at.mjs ... 2 0 ... png` (DPR 2): Canvas-Text scharf wie DOM-Text.
   - `jump.mjs`: nach Sprung auf T 9000 kein Ende-Overlay.
   - `/impressum`, `/datenschutz`, `/agb` bei 320 bis 768 px ohne horizontalen Überlauf.

## 9. Nicht geprüft, offen

- Echtes iOS-Safari (dynamische Leiste, Safe-Area, Gummiband) und Android-Chrome: nur Playwright-Emulation (Chromium Touch, WebKit iPhone 15). Layout und Szenen sind identisch, die Leistenwechsel nur über `setViewportSize` simuliert (V-08).
- Firefox, Windows-Klassik-Scrollbalken (die Seite blendet den Balken aus, `clientWidth` bleibt gültig), Tastatur- und Screenreader-Verhalten, Pinch-Zoom.
- Szeneninhalte (Flut-Zellgröße, Raumtexte, Geisterduplikat bei Putzplan, Hand-Anatomie, Handy-UI, Installationsablauf, ASCII-Größen) sind Gegenstand der anderen Audits. Hier nur dort erwähnt, wo sie die Fläche betreffen.
- Framerate bei größeren Canvases wurde nicht gemessen. Beim Umbau auf Viewport-Größe sollte `hero.js:267` (`fw`, Auflösungsregler `this.ad`) und die Zellschleifen von `ascii`/`physics` auf CSS-Zellgröße statt auf Canvas-Pixel gestellt werden.
