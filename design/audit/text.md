# Audit Text-Lesbarkeit in Animationen

Stand 2026-10-06, Branch `landing-produktion`, Produktionsbuild (`next build` + `next start`) mit echter M3-GPU (ANGLE Metal, kein SwiftShader). Gemessen bei 1440x900 (DPR 1) und 390x844 (DPR 2, Touch-Emulation), plus Stichproben bei DPR 2 und mit Zeiger.

Zweiter Durchlauf am selben Tag: Die Messreihe des ersten Durchlaufs bleibt Grundlage. Neu geprüft wurden alle Zeilenverweise gegen den Quelltext, die Kernbefunde (T-03, T-12, Flut, Karten) per Wiederholung, und die Vorschläge wurden in einer Kopie außerhalb des Repos gebaut und mit derselben Messkette nachgemessen (Abschnitt 8). Das Repo selbst ist unverändert.

## 1. Ergebnis in Kürze

1. **Nach einem Sprung bleibt das Ende-Bild über der halben Seite stehen** (T-03). Taste Ende, ein Sprung per `scrollTo`, ein sehr harter Radschwung oder auf dem Handy ein harter Wisch aus der Ende-Szene lassen das opake Ende-Overlay (Hand, Handy, `Alltag teilen.`, CTA) über So geht's, Fragen, Finale und Fußzeile liegen, der Zeiger bleibt unsichtbar. Das ist die "eingefrorene Hand mit WG-erstellen-Button" aus der Sichtprüfung. Aus anderen Positionen bleiben Raumkarte, `INTRO ÜBERSPRINGEN` und Hero-Titel über späteren Abschnitten hängen.
2. **Die Flut schluckt die Raumtexte.** Im Vollfenster der Küchen-Karte liegen im Mittel 57 % der Überschrift, 69 % des Absatzes und 75 % der Listenzeile unter weißen Zellen (T-01). Die Karten blenden sich mit 90 Einheiten Überlappung ineinander (Geisterduplikat, T-02).
3. **Die Körper starten im Fall** (T-12). Beim ersten Zeichnen liegen sie am Sektionsboden, nur ihre schwarzen Namens-Boxen sind sichtbar, die Überschrift ist da schon aus dem Bild. Das ist das "Schwarz mit Labels" der Sichtprüfung: ein Zustandsfehler beim ersten Zeichnen, kein Ausfall der Szene.
4. **Die Tiefe-Szene initialisiert richtig**, Wörter und Untertitel sind da, aber kurz und anfangs dunkel (T-10). Jede Karte der Wohnung ist nur 233 Einheiten voll sichtbar (262 CSS-px bei 1440), die Tiefe-Untertitel 01 und 02 nur 49 (T-04, T-10).
5. **Die Kopfzeile hat keinen Hintergrund** und liegt in 47 von 411 Schritten (11 %) über durchlaufendem Text, auch im Endzustand der Seite (T-06). `INTRO ÜBERSPRINGEN` ist in drei Bereichen unlesbar (T-07).
6. **Mobil (390 px) sind 160 von 194 Textknoten kleiner als 6 px** (T-08).
7. Statische Abschnitte (So geht's, Bereiche, Fragen, Fußzeile) sind kontrastsicher (9,8:1 bis 19:1). Die Probleme sitzen in den animierten Szenen.
8. **Getestet** (Abschnitt 8): die Korrekturen zu T-01, T-02, T-03, T-05, T-06, T-07, T-09, T-10, T-11, T-12 beheben die Befunde messbar, ohne Inhalt zu streichen. Nicht getestet: T-04, T-08, T-13 bis T-17.

Priorität: T-01, T-02, T-03 kritisch. T-04 bis T-08 hoch. T-09 bis T-13 mittel. T-14 bis T-17 niedrig.

Empfohlene Reihenfolge der Umsetzung: T-03 zuerst (alle späteren Messungen hängen an stimmigen `--e`, `--p`, `--c`), dann T-02 und T-01 (gleiche Datei `hero.js`), T-12, T-06 mit Finale-Versatz und T-07, T-05, T-09, T-10, T-11. T-04 (Zeitachse) und T-08 (Mobil-Layout) vor der letzten Messung entscheiden, weil sie alle `st`-Werte und Bühnenkoordinaten verschieben.

### Zuordnung der Sichtprüfung des Hauptagenten (1800x987, k = 1,2338)

| Beobachtung | y bei 1800x987 | st | Fund |
|---|---|---|---|
| Eingefrorenes Hand/Handy-Bild mit `WG erstellen` oben, "ab ca. 8800" | 8800 bis Ende | ab 7132 | T-03 |
| Küche: `Einkäufe & Vorräte` abgeschnitten, Blöcke mit Ziffern | ~5400 | 4376 (Küchen-Plateau 4210-4443) | T-01 |
| Geisterduplikat hinter `Putzplan` | ~6400 | 5187 (Übergang Bad-Flur 5177-5267) | T-02 |
| Körper "nur Schwarz mit Labels" | 9400-10000 | 7619-8105 | T-12 (bei Sprüngen zusätzlich T-03) |
| Tiefe-Wörter nicht sichtbar | 10000-14000 | 8105-11347 | T-10 (Tunnel, dunkle Wörter), bei Sprüngen T-03 |
| Planet nicht gesehen | 15060-16050 | 12207-13007 | kein Fehler: Planet und Karte sind sichtbar, nur Kopf-Kollision (T-06) |

## 2. Koordinaten und Messmethode

**Koordinaten.** `st` ist `scrollTop` der 1280x800-Bühne (Zeitachse der Engine, 0 bis 15374). Dokument-`scrollY` ist `st x k`:

| Viewport | k | Dokumenthöhe | Schritt je Wheel-Tick |
|---|---|---|---|
| 1440x900 | 1,125 | 17296 | 40 CSS-px = 35,6 st |
| 390x844 | 0,3047 | 5285 | 12 CSS-px = 39,4 st |
| 1800x987 (Sichtprüfung des Hauptagenten) | 1,2338 | 18968 | nur zur Umrechnung |

Jeder Fund nennt `st` und `scrollY` für 1440 und 390 in der Form `st a-b (y1440 a'-b' / y390 a''-b'')`.

**Messaufbau** (Skripte in `scratchpad/text/`, Rohdaten in `out/1440x900/` und `out/390x844/`, Pfad siehe Anhang):

- `capture.mjs`: Wheel-Schritte (`page.mouse.wheel`, kein Zeiger, kein `scrollTo`). Je Schritt 450 ms Beruhigung (in der Tiefe-Zone 900 ms), dann `requestAnimationFrame` und `performance.now` einfrieren (kein dt-Sprung, identischer Canvas-Zustand), alle DOM-Textknoten erfassen (Rechteck, Opacity-Kette, Blur, Farbe, Clip) und drei Screenshots: **A** normal, **B** Text transparent, **C** Canvas unsichtbar (nur Text auf Schwarz).
- `analyze.py`: Glyphkerne aus C, dann je Knoten `crT` = WCAG-Kontrast Textfarbe x Opacity über dem realen Hintergrund aus B (sRGB-Komposition), `cr` = Verhältnis A zu B an den Glyphkernen (Sichtbarkeit nach allen Überlagerungen, Blur, Opacity), `inv` = Anteil der Glyphpixel mit Verhältnis unter 1,5 (unsichtbar). Schwellen: 4,5:1 normal, 3:1 ab 24 px. Bei Text unter 14 px drückt Antialiasing `cr` um 10 % (weiß auf Schwarz) bis 40 % (grau auf Weiß), dort zählt `crT`; `cr` dient dann nur zur Erkennung von Verdeckung.
- Ergebnis: 411 + 372 Schritte, 196 Textknoten je Schritt, keine Konsolenfehler.
- `flood_sim.py` (Nachbau von `hero.js:288-296`, an echten Frames mit 100 % Zellübereinstimmung geeicht) für Flut-Statistik über Zeitphasen, `ocr.swift` (Apple Vision) für Canvas-Wörter, `flow.mjs`, `jump.mjs`, `fling.mjs`, `pointer.mjs`, `retina.mjs` für Tempo-, Sprung-, Zeiger- und DPR-2-Fälle.
- Die Flut hängt an der Seitenzeit (`hero.js:292`: `vnz(a*0.13 + t*0.03, b*0.13 - t*0.02)`). Ein Durchlauf ist deshalb eine Stichprobe, welche Wörter gerade frei sind. Die Statistik in T-01 mittelt über 200 Zeitphasen.
- Kontrolle im zweiten Durchlauf: Kartenzeiten (T-02, T-04) aus der Formel `hero.js:248` neu gerechnet, Flut-Statistik, Kopf-Kollisionen (47 Schritte) und Zeilenverweise sämtlicher Funde gegen den Quelltext geprüft, alle Werte bestätigt. Einzige Abweichung: die Textknoten-Zählung in T-08 (jetzt 194 statt 141, gleiche Messreihe, einheitliche Zählregel).

## 3. Zonenkarte

`st` / `y1440` / `y390`:

| Zone | st | y1440 | y390 | Text-Befund |
|---|---|---|---|---|
| Hero-Titel | 0-427 | 0-480 | 0-130 | nur 0-178 mit 4,5:1 (T-09) |
| Zeichen (Kreise, kein Text) | 427-3260 | 480-3668 | 130-993 | Skip-Link teils unlesbar (T-07) |
| Flut 1 (Deckung ab 5 %) | 3261-4888 | 3669-5499 | 994-1489 | T-01 |
| Wohnung, 4 Karten | 4093-5635 | 4605-6339 | 1247-1717 | T-01, T-02, T-04 |
| Flut 2 (Deckung ab 5 %) | 5420-6292 | 6098-7078 | 1651-1917 | T-05 |
| Ende (Hand, Handy) | 5760-7220 | 6480-8122 | 1755-2200 | T-03, T-05, T-14, T-17 |
| Flut-Band (DOM) | 7200-7296 | 8100-8208 | 2194-2223 | dekorativ, ohne Befund |
| So geht's | 7296-7847 | 8208-8828 | 2223-2391 | statisch ok, Kopf-Kollision |
| Körper | 7847-8607 | 8828-9683 | 2391-2622 | T-12 |
| Tiefe | 8607-12207 | 9683-13733 | 2622-3719 | T-10 |
| Bereiche (Planet) | 12207-13007 | 13733-14633 | 3719-3963 | ok, Kopf-Kollision |
| Installieren | 13007-13807 | 14633-15533 | 3963-4207 | T-11 |
| Fragen | 13807-14429 | 15533-16233 | 4207-4396 | ok, Kopf-Kollision |
| Finale | 14429-15189 | 16233-17088 | 4396-4628 | Endposition T-06 |
| Fußzeile | 15189-15374 | 17088-17296 | 4628-4684 | ok |

## 4. Funde

### T-01 Flut verdeckt Raumkarten, Wohnung und Skip-Link (kritisch)

- **Bereich:** Deckung der Flut 1 ≥ 0,5 bei st 3424-4608 (y1440 3852-5184 / y390 1043-1404), ≥ 0,9 bei st 3561-4374 (y1440 4006-4920). Küchen-Karte voll (Opacity ≥ 0,98) bei st 4210-4443 (y1440 4736-4998 / y390 1282-1353), dort liegt die Deckung bei 0,99 bis 0,80. Wohnzimmer-Karte voll bei st 4568-4801 (Deckung 0,57 bis 0,16).
- **Element:** alle Texte der Karten (`Raeume`), Skip-Link, Kopfzeile am Rand.
- **Messwerte:**
  - Weißanteil der Textspalte (x 40-480, y 150-670) im Küchen-Plateau 42-53 %, im Wohnzimmer-Plateau 21-33 %.
  - Erwarteter verdeckter Glyphenanteil (Simulation, 200 Zeitphasen, Plateau-Schritte, ohne Zeiger): Küche Label 48 %, Überschrift 57 %, Absatz 69 %, Listenzeile 75 %. In nur 22 % der Phasen ist die Überschrift zu mindestens 95 % frei. Wohnzimmer 12 / 17 / 22 / 28 %. Bad 0-3 %, Flur 2-5 %.
  - Im Messlauf: Küchen-Zeile `Hafermilch / 2 Packungen` in allen 7 Plateau-Schritten unsichtbar (`inv` > 0,5), OCR findet sie in keinem der 56 Frames. Der Absatz hat Löcher (`Wer ▮▮▮▮▮, hakt ab`), die Überschrift war nur zufällig frei (`out/1440x900/0121_A.png`).
  - Mit Zeiger bleibt nur ein Fenster von 5x5 Zellen (160x160 Einheiten) frei (`out/pointer/flut-pointer-text.png`). Auf Touch gibt es kein Fenster.
  - Die Karte erscheint vor der Wohnung: Karte 0 ist ab st 4093 sichtbar, die Wohnung liegt bis etwa st 4400 unter Deckung ≥ 0,8.
- **Ursache:**
  - `engine/hero.js:288` Deckungskurve `ss((P-0.5)/0.07) * (1-ss((P-0.66)/0.12))` fällt erst ab P 0,66 (st 4224) ab, genau dort beginnt das Küchen-Plateau (P 0,657-0,694 laut `hero.js:248`).
  - `hero.js:292` blendet nur die Kopfzeilen-Ecken (`pk`) aus, `hero.js:293` füllt `#FAFAFA`. Die Texte (`overlays.tsx:84`, Farbe `#FAFAFA`) sind weiß auf Weiß.
  - Zellgröße 32 Einheiten (`hero.js:289`), Ziffern 10 px mit 0,6 Alpha (`hero.js:294-295`).
- **Vorschlag (getestet, kein Inhalt entfällt):** Die Textspalte aus der Flut ausnehmen, wie es für die Kopfzeile schon geschieht. In `hero.js:292` die Zeile `const pk = ...` ersetzen durch (Maske in Bühnenpixeln, damit sie von der Zellgröße unabhängig bleibt, falls die Flut feiner wird):

  ```js
  const px = a * cs + cs / 2, py = b * cs + cs / 2,
    hole = Math.max(0, 1 - Math.max(16 - px, px - 504, 126 - py, py - 694, 0) / 96), // Textspalte x 40-480, y 150-670 plus Rand
    pk = ((b < 3 && a < 9) || (b < 3 && a > 33) ? 0.5 : 0) + 2 * fpA * (1 - endA) * hole;
  ```

  `fpA` (`hero.js:247`) steigt bei st 3712-4032 von 0 auf 1, die Lücke öffnet sich also, bevor Karte 0 bei st 4093 erscheint, und schließt sich über `(1 - endA)`, wenn die Ende-Szene übernimmt. Die Flut fließt um die Spalte, ihr Umriss und ihr Zeitverlauf bleiben sonst unverändert. Der Rand von 96 Einheiten ist ein Stellwert (bei 64 sitzt die Kante näher am Text). Skip-Link siehe T-07. Optional zusätzlich den Abfall der Flut 1 vorziehen (`hero.js:288` `(P-0.66)/0.12` auf `(P-0.58)/0.08`), das verkürzt die Flut aber spürbar und ist mit der Maske nicht nötig.
- **Nachprüfung:** Küchen-Plateau (st 4210-4443): 50 % der Messungen mit mehr als 30 % unsichtbaren Glyphen (12 von 24), kleinster Kontrast 1,0:1. Mit der Maske 0 von 28, kleinster Kontrast 9,85:1 (`out/after-raeume`, `v2/sheet-after-raeume.png`).

### T-02 Karten überblenden sich auf identischer Position (kritisch)

- **Bereich:** Übergänge Küche-Wohnzimmer st 4461-4551 (y1440 5018-5119 / y390 1359-1386), Wohnzimmer-Bad st 4819-4909 (y1440 5421-5522 / y390 1468-1495), Bad-Flur st 5177-5267 (y1440 5824-5925 / y390 1577-1604). Mittelpunkte st 4506, 4864, 5222. Das "verschwommene Geisterduplikat hinter Putzplan" der Sichtprüfung (y 6400 bei 1800x987 = st 5187) ist der Übergang Bad-Flur.
- **Element:** Überschrift, Absatz und Listenzeile je zweier Nachbarkarten.
- **Messwerte:** Beide Karten ≥ 0,1 Opacity über 90 Einheiten, beide ≥ 0,25 über 51, überhaupt sichtbar (> 0,02) über 124 pro Übergang (neu aus der Formel gerechnet, deckt sich mit den 411 Messschritten: 9 von 40 Schritten im Kartenbereich zeigen zwei Karten > 0,05). Rechteck-Überlappung der Überschriften 0,93-1,00 bei st 4480-4516, 4871, 5227. Blur bis 6,75 px und Versatz bis 45 px bei 1440. Im Mittelbild von `out/crop-ghost.png` liest man `Putzplan & Fixkosten` ineinander.
- **Ursache:** Alle vier Karten liegen mit `position:absolute; inset:0` übereinander (`overlays.tsx:84, 128, 174, 216`, jeweils `opacity:var(--cN)`, `translateY(...*40px)`, `blur(...*6px)`). Die Kurve `ss(1.7 - |fs-(j+1)|*2.4)` in `hero.js:248` ist zu breit: 42 % der Laufzeit jeder Karte überlappen mit dem Nachbarn.
- **Vorschlag (getestet):**
  1. `hero.js:248`: `ss(1.7 - Math.abs(fs-(j+1))*2.4)` durch `ss((0.5 - Math.abs(fs-(j+1))) / 0.2)` ersetzen. Nachbarn sind dann nie gleichzeitig sichtbar, Plateau 215 Einheiten, Ein- und Ausblendung je 72, in der Mitte jedes Übergangs genau ein Punkt ohne Karte.
  2. Blur 6 px auf 3 px, Versatz 40 px auf 16 px (`overlays.tsx:84, 128, 174, 216`), damit die kürzere Überblendung nicht schmiert.
- **Nachprüfung:** 0 von 39 Schritten mit zwei Karten > 0,05 (vorher 9 von 40). Einzelbild mit weicher Überblendung ohne Doppelbild: `v2/sheet-after-raeume.png` (#16, #18, #26).

### T-03 Sprung-Scroll friert Overlay-Texte ein (kritisch, mobil häufiger)

- **Bereich:** jede Position ab st 7300 (y1440 8213 / y390 2224), wenn der letzte gezeichnete Frame vor 7300 lag. Gleicher Fehler wie `vollbild.md` V-15, dort aus Sicht der Überlagerung, hier mit den Text-Folgen.
- **Element:** Ende-Overlay (`Alltag teilen.`, CTA, Handy mit Hand), `Raeume`-Karte, `Hinweise` (`INTRO ÜBERSPRINGEN ↓`), `HeroTitel`, `SCROLLEN`. Alle sind feste Overlays über `main` (`Landing.tsx:159-164`), ihre Deckkraft und Lage hängen an CSS-Variablen und einer Verschiebung, die nur die Engine-Schleife setzt.
- **Reproduktion** (1440x900, `v2/jump2.mjs`, `v2/jump.mjs`, im ersten Durchlauf `out/jump/`; 1800x987 `v2/jump3.mjs`):
  - **Sprung kurz vor dem Ende der Hero-Strecke** (1800x987, st 7016, dann `scrollTo` auf st 9000): `endov` bleibt bei `translateY(-616px)` stehen. Oben im Bild stehen `teilen.`, der CTA `WG erstellen`, die Handy-Tabs `Start Haushalt Finanzen Austausch` und die Hand, darunter läuft die Tiefe-Szene (`v2/jump3/a.png`). Das ist die Beobachtung der Sichtprüfung ("ab ca. 8800 bis zum Footer eingefroren", st 7132 entspricht `translateY(-732px)`).
  - **Taste Ende aus der Ende-Szene** (st 6222 nach st 14574): danach `--p 0,9722`, `--e 1`, `endov` `translateY(0px)` bei Deckkraft 1, Cursor `none`. Das opake Ende-Bild liegt über Fragen, Finale und Fußzeile, die untere Seite ist nicht zu sehen (`v2/jump2/b-nach-end.png`). Das ist der schwerste Fall: kein Text der Seite nach der Hero-Strecke ist zu lesen.
  - Taste Ende direkt nach dem Laden: `--p` bleibt bei etwa 0,23-0,27. `INTRO ÜBERSPRINGEN ↓` bleibt unten links stehen und überdruckt `© 2026 MANAWG` in der Fußzeile (`v2/jump/end-key.png`).
  - Radschwung 4 x 3000 px in 0,5 s: `--p 0,74`. Die Karte `02 / 04 WOHNZIMMER, Ausgaben & Fixkosten` steht dauerhaft über der Tiefe-Szene und dem Wort ABSPRACHEN (`v2/jump/wheel-big.png`).
  - Handy 390x844, harter Wisch von st 3000 auf 8200 in 284 ms: `--p 0,8369`, `--c3 1`. Karte `04 / 04 FLUR Pinnwand & Chat` steht über Körpern, Tiefe-Label und GELD (`out/jump/mob-flick-from-flood.png`).
  - Kein Hängenbleiben: Wheel in 40-px-Schritten, Desktop-Wisch über 0,7 s (`p` 0,989+), mittleres Tempo (`p` 1), Handy-Wisch über 1,2 s (`p` 0,998). Das Ende-Bild bleibt sichtbar, wenn der letzte verarbeitete Frame vor st 7200 lag (Verschiebung unter 800 Einheiten), Karten und Hinweise bleiben hängen, wenn er vor ihrem Ausblenden lag.
- **Ursache:** `hero.js:243` `if (s.sc.scrollTop > 7300 && !this.props.tour) continue;` überspringt die ganze Schleife, auch `hero.js:248` und `hero.js:250` (CSS-Variablen `--p --g --f --e --c0..3`, Verschiebung von `endov`, Cursor, CTA-Zustand). `s.sp` folgt `P0` mit Zeitkonstante 0,1 s (`hero.js:245`). Springt `scrollTop` schneller über 7300, als Frames kommen, bleibt der letzte Zwischenzustand für den Rest der Seite stehen. Auf dem Handy erhöht 1/k = 3,28 die Geschwindigkeit in Bühneneinheiten, deshalb reicht dort ein harter Wisch.
- **Vorschlag (getestet, Ursache an einer Stelle):** Nur das Zeichnen überspringen, den Zustand weiterführen. Vier Änderungen in `hero.js`:

  ```js
  // 243: Flag statt continue
  if (s.a0 === null) s.a0 = now; const parked = s.sc.scrollTop > 7300 && !this.props.tour;
  // 245: geparkt ohne Glättung auf den Zielwert
  ... if (Math.abs(P0 - s.sp) < 1e-4 || parked) s.sp = P0; const P = s.sp;
  // 250: Hände nur zeichnen, wenn nicht geparkt; CTAs im geparkten Zustand nicht klickbar
  s.ctas.forEach(el => { el.style.pointerEvents = endA > 0.6 && !parked ? 'auto' : 'none'; }); ... if (!parked && endA > 0.01 && s.hb && s.hf) drawHands(s, t, now);
  // 251: CTAs nicht fokussierbar, danach WebGL, Flut und Wohnung überspringen
  s.ctas.forEach(el => { const off = !(endA > 0.6) || parked; if (el.inert !== off) el.inert = off; }); if (parked) continue;
  ```

  Die Zustandszeilen laufen weiter (billig, nur Stil-Variablen und eine Verschiebung), das Teure (WebGL, Flut, Wohnung, Hände) bleibt übersprungen. Danach sind `--e` 1, `--c0..3` 0, `endov` aus dem Bild, Cursor normal und die CTAs `inert`. `INTRO ÜBERSPRINGEN` verschwindet über `calc(0.72 - var(--e,0))`, Karte und Hero-Titel über `--c`/`--p`.
- **Nachprüfung:** Taste Ende aus der Ende-Szene: `--p 1`, `--e 1`, `endov translateY(-8174px)`, Cursor `auto`, CTAs `none/inert`, Finale und Fußzeile sichtbar (`v2/jump2-fix/b-nach-end.png`). Sprung von st 7016 auf 9000 (1800x987): `endov` `-2600px`, oben im Bild nichts mehr vom Ende-Bild, Kopf und Untertitel frei (`v2/jump3-fix/a.png`). Radschwung 4 x 3000: `--p 1`, `endov -4267px`. Keine Konsolenfehler in allen Messläufen mit dem Testbuild.

### T-04 Haltezeit der Raumkarten zu kurz (hoch)

- **Bereich:** je Karte sichtbar (Opacity > 0,05) 467 Einheiten (525 CSS-px bei 1440), voll (≥ 0,98) 233 Einheiten (262 CSS-px, 2,6 Wheel-Ticks), volle 1,0 nur 213. Karte 0 st 4093-4560 / 4210-4443, Karte 1 st 4452-4918 / 4568-4801, Karte 2 st 4810-5276 / 4927-5160, Karte 3 st 5168-5635 / 5285-5518 (y1440 Karte 0 4605-5130 / 4736-4998, y390 1247-1389 / 1282-1353).
- **Element:** Label, Überschrift, Absatz und Zeile, zusammen etwa 22 Wörter je Karte (Lesezeit 4-5 s).
- **Messwerte:** Die Messung (Opacity ≥ 0,98, 7 Schritte) deckt sich mit der Formelrechnung (neu geprüft). Für 4 s Lesezeit im Plateau wäre eine Scroll-Geschwindigkeit unter 65 CSS-px/s nötig, ein einzelner Wheel-Tick bewegt 100 px in unter 0,3 s.
- **Ursache:** `hero.js:248` bildet P 0,62-0,90 (1792 Einheiten) auf vier Karten ab. Die Zeichen-Szene davor (P 0,06-0,58, 3330 Einheiten) hat keinen Text. Spacer `sections.tsx:35` (6400) und Normierung `hero.js:245` (`/6400`).
- **Vorschlag (nicht getestet):** Karten nicht kürzen, Zeit zugeben.
  1. Einfach: die Länge der Hero-Strecke auf eine Konstante legen (`HERO = 6400`) und an den vier Stellen ableiten: `hero.js:243` `HERO + 900` (heute 7300), `hero.js:245, 250` `HERO` (6400), `hero.js:250` `HERO + 300` (6700), `sections.tsx:35` `HERO`. Mit `HERO = 8000` wächst das Karten-Plateau von 233 auf 291 Einheiten, mit 9600 auf 350. Alle Szenen werden proportional länger, auch der Hero-Titel (T-09). Alle `st`-Angaben dieses Berichts verschieben sich dann um den Faktor.
  2. Gesamtlänge halten: das Wohnungsfenster auf P 0,52-0,92 legen (`hero.js:248` `fs` und `hero.js:285` `s.fp.sp` von `(P-0.62)/0.28` auf `(P-0.52)/0.40`, `fpA` `hero.js:247` von 0,58 auf 0,48, Flutdeckung `hero.js:288` entsprechend früher). Plateau dann etwa 300 Einheiten. Mehr Eingriffe in die Zeitachse, deshalb Umsetzer und Nutzer entscheiden lassen.

### T-05 Flut 2 verdeckt Einblendung von Ende-Überschrift und Flur-Karte (hoch)

- **Bereich:** Deckung der Flut 2 ≥ 0,9 bei st 5634-6078 (y1440 6338-6837 / y390 1716-1851). Ende-Einblendung `--e` 0 bis 1 bei st 5760-6080 (y1440 6480-6840). Flur-Karte blendet bei st 5518-5635 aus.
- **Element:** `Alltag teilen.`, CTA `WG erstellen` (Ende), Handy, Flur-Karte.
- **Messwerte:** Ende-Überschrift (gemessenes Verhältnis A zu B an den Glyphkernen, `cr`): bei st 5831 1,3:1, 5867 1,8:1, 5902 2,8:1, 5938 4,9:1, 5973 8,6:1. Der Titel ist also von st 5800 bis etwa 5905 (rund 105 Einheiten, 118 CSS-px) sichtbar, aber unter 3:1, bis etwa 5930 unter 4,5:1. Die Szene wird durch das Weiß eingeblendet (bei st 5831 hat der Grund `bgL` 0,72). Das theoretische `crT` (1,0 bis 5,6:1) unterschätzt das hier, weil das Overlay als Gruppe mit eigenem Grund einblendet und der Titel in der Gruppe voll deckt. Flur-Karte: bei st 5582 sind 31 % der Glyphen unsichtbar.
- **Ursache:** `hero.js:288` zweites Fenster `ss((P-0.84)/0.05)*(1-ss((P-0.94)/0.05))` deckt P 0,88-0,95 fast vollständig. `hero.js:247` `endA = ss((P-0.9)/0.05)` und `overlays.tsx:338` (Overlay-Opacity `var(--e)`) blenden genau darin ein: Der dunkle Grund des Overlays (`#0A0A0A`) steht bei `--e` 0,4 erst zu 40 % über dem Weiß, der weiße Titel mit gleicher Deckkraft liegt auf Hellgrau.
- **Vorschlag (getestet):** Titel und CTA erst einblenden, wenn der dunkle Grund steht: am Container von Titel und CTA (`overlays.tsx:637`) `opacity:clamp(0, calc((var(--e,0) - 0.5) * 2.5), 1)` ergänzen. Die Flur-Karte ist durch die Spaltenmaske aus T-01 (`fpA * (1 - endA)`) mitgeschützt, sie bleibt bis `endA` > 0 aktiv.
- **Nachprüfung:** Der Titel erscheint bei st 5927 mit Deckkraft 0,04, hat 3,0:1 bei st 5963 (Deckkraft 0,34), 9,4:1 bei 5998 und 17,2:1 bei 6034. Der sichtbare, aber unlesbare Zwischenzustand (vorher 1,3 bis 2,8:1 über drei Schritte) entfällt, der Titel kommt dafür etwa 50 Einheiten später und blendet in rund 100 Einheiten ein. Flur-Karte im Plateau 9,35:1.

### T-06 Kopfzeile ohne Hintergrund: Text liegt auf Text (hoch)

- **Bereich:** 47 von 411 Schritten (11,4 %), nachgezählt (die Ende-Szene st 5900-7250 zählt nicht, dort liegt der Kopf unter dem Overlay, siehe T-14). Fenster (st): 7609-7680, 7858-7893 (Körper-Titel, 100 % Überdeckung), 12018-12124, 12231-12409 (`Acht Orte. Eine WG.`), 12764-12871, 13084-13262 (`Home-Bildschirm.`, 7 Schritte), 13333-13691, 13867-14222 (alle drei Fragen), 14507-14574 (Finale). In y1440 etwa 8560, 8840, 13520-13640, 13760-13960, 14360-14480, 14680-15400, 15600-16000, 16320-16395. Deckt sich mit `vollbild.md` V-04.
- **Element:** Logo `ManaWG`, CTA `WG erstellen` (`overlays.tsx:45-68`) gegen durchlaufende Überschriften, Absätze, Tabs, Fragen.
- **Messwerte:** weiß auf weiß, wo Text oder Tab-Hintergrund unter dem Logo läuft (`out/crop-head-all.png`: `Acht Orte.` über `ManaWG`, Tab `iPhone` unter dem Logo, CTA-Rand durch die Frage-Trennlinie). Logo `ManaWG` in st 12000-14574: 4 von 68 messbaren Schritten unlesbar, kleinster Kontrast 1,0:1. **Endposition der Seite** (st 14574, y1440 16396): Oberkante von `Alltag` liegt unter dem Logo, weil das Finale 760 hoch ist, über der Fußzeile aber nur 615 sichtbar sind (`v2/jump/end-key.png`).
- **Ursache:** `overlays.tsx:45-68` transparenter Kopf, DOM-Reihenfolge `Landing.tsx:160` über allem, kein Schleier. Das Finale zentriert den Titel (`sections.tsx:814` `justify-content:center`).
- **Vorschlag (getestet):**
  1. Schleier zwischen Inhalt und Kopf, gebunden an `--e` (ist ab der Ende-Szene 1, in den Intro-Szenen 0, kein JS nötig): direkt vor dem `header` (`overlays.tsx:45`) einfügen
     `<div aria-hidden="true" style={css('position:absolute;left:0;right:0;top:0;height:104px;pointer-events:none;background:linear-gradient(#0A0A0A 0%,rgba(10,10,10,0.88) 45%,rgba(10,10,10,0) 100%);opacity:var(--e,0)')} />`
     Abhängigkeit: `--e` muss nach Sprüngen stimmen (T-03).
  2. Finale im Endzustand unter den Kopf rücken, ohne es neu zu komponieren: `sections.tsx:814` `padding:0 40px` zu `padding:130px 40px 0` (Titelblock 65 Einheiten tiefer, Oberkante bei y 84 statt 19 im Endbild, der Kopf endet bei y 68).
- **Nachprüfung:** Logo in st 12000-14574: 0 von 38 Schritten unlesbar, kleinster Kontrast 11,9:1. Der darunter laufende Text blendet im Kopfstreifen aus (`v2/sheet-after-ende2.png`). Endbild: Titel vollständig unter dem Kopf, Fußzeile frei (`v2/jump2-fix/b-nach-end.png`).

### T-07 `INTRO ÜBERSPRINGEN ↓` ist in drei Bereichen unlesbar (hoch)

- **Bereich:** st 142-750 (y1440 160-843 / y390 43-229) Kontrast 1,5-3,3:1 über dem hellen Himmel (`bgL` bis 0,54), st 3342-4871 (y1440 3760-5480 / y390 1018-1484) und st 5404-5938 (y1440 6080-6680) unsichtbar (weiß auf weißer Flut, 0,0 gemessen). Bei st 0 bereits grenzwertig: 5,5:1 theoretisch, 4,5:1 gemessen. OCR findet den Link nur bei st 4978-5404. Im Messlauf 80 von 168 sichtbaren Schritten unter 4,5:1, 64 davon mit mehr als 30 % unsichtbaren Glyphen.
- **Element:** `overlays.tsx:268` (12 px, `opacity:calc(0.72 - var(--e,0))`, `data-scr`), ausgerechnet der Ausgang aus der längsten Strecke ohne Text. Der Hinweis `SCROLLEN` (`overlays.tsx:280`, rechts unten) fällt ab st 142 unter 4,5:1, ist aber bis st 460 ohnehin ausgeblendet.
- **Ursache:** 12 px bei 0,72 Alpha ohne Hintergrund, im DOM über allen Szenen, aber ohne eigene Fläche. `hero.js:156` setzt bei jedem `pointerover` zusätzlich 0,7 s lang Zufallszeichen (`@%#*+=-:`) in den Text, solange der Zeiger darüber steht.
- **Vorschlag (getestet):** Kleine Fläche statt Alpha: in `overlays.tsx:268` `opacity:calc(1 - var(--e,0) * 1.4);background:rgba(10,10,10,0.72);padding:8px 12px;border:1px solid rgba(250,250,250,0.18);border-radius:8px`. Lesbar auf Himmel, Flut und Skulptur, Position und Text unverändert, Ausblendung bleibt bei `--e` 0,72.
- **Nachprüfung:** st 0-498: 16,3:1 bis 10,6:1 (vorher 5,5:1 bis 1,5:1); in der Flut-Zone (`v2/sheet-after-raeume.png`) lesbar.

### T-08 Mobil 390x844: Text ist nicht lesbar (hoch, Querverweis `vollbild.md` V-05)

- **Bereich:** gesamte Seite (st 0-15374, y390 0-4684).
- **Messwerte:** Von 194 Textknoten sind 18 größer als 11 px, 7 liegen bei 9-11, 9 bei 6-9 und **160 unter 6 px**. Nur Überschriften überleben: `Alltag teilen.` 60,9 px, Hero-Titel 24,4 px, Raum-Überschriften 19,5 px, Tiefe-Untertitel 13,4 px, Körper-Titel 12,2 px. Fließtext (17 px) 5,2 px, Labels (12 px) 3,7 px, Kopf-CTA 4,3 px, Karten-Zeilen 4,0-4,6 px, Footer-Links 4,3 px, Telefon-Text 3,0-4,0 px.
- **Zusätzlich:** Die Bühne ist 390x244 hoch in einem 844 hohen Fenster (Balken je 300 px, Kontaktbogen `sheet390-all.png`). Text wird deshalb nicht am Bildschirmrand, sondern mitten im Bild bei y = 300 und y = 544 abgeschnitten (`Home-Bildschirm.` in der Mitte durchgeschnitten, `out/390x844/0336_A.png`). T-01 bis T-03, T-05, T-06 gelten unverändert, ohne Zeiger sogar im Worst Case.
- **Ursache:** `Landing.tsx:24, 62` feste Bühne 1280x800, `k = min(vw/1280, vh/800)`; alle Schriften sind in Bühnenpixeln gesetzt.
- **Vorschlag (nicht getestet):** Textebenen von der Bühnenskalierung entkoppeln: Raumkarte, Tiefe-Untertitel, Hero-Titel, Ende-Überschrift, Fragen, Installieren-Schritte und Fußzeile als Overlay in Viewport-Einheiten (`clamp(14px, 4.2vw, ...)`, Mindestgrößen: Fließtext 15 px, Labels 11 px, Buttons 14 px), die Canvases bleiben skaliert. Die Mindestgrößen gelten auch bei Desktop-Fenstern unter etwa 900 px Breite. Nach der Änderung am Vollbild (`vollbild.md` V-01) neu messen, die Bühnenkoordinaten der Masken aus T-01 gelten nur, solange die Komposition 1280x800 bleibt.

### T-09 Hero-Titel: kurz lesbar, lokal kontrastarm (mittel)

- **Bereich:** st 0-427 (y1440 0-480 / y390 0-130). Kontrast ≥ 4,5:1 nur bis st 175 (y1440 197, knapp zwei Wheel-Ticks), danach 3,6:1 (st 213), 2,3:1 (st 284), unsichtbar ab st 427.
- **Messwerte:** Schon bei st 0 haben 19,9 % (`Die App`) und 14,5 % (`für eure WG.`) der Glyphpixel unter 3:1 (zehntes Perzentil 1,7:1), weil `Die` über der hellsten Schneeflanke liegt (`out/crop-hero-title.png`). Der Hintergrund hellt beim Scrollen auf (`bgL` 0,04 auf 0,17 bis st 391).
- **Ursache:** `overlays.tsx:10` `opacity:calc(1 - var(--p,0) * 14)` beginnt mit dem ersten Pixel zu faden und hat kein Plateau, kein Schatten (`overlays.tsx:27-35`).
- **Vorschlag (getestet):** Plateau und weicher Schatten: `opacity:calc(1.6 - var(--p,0) * 22)` (voll bis st 175, null bei st 465) und am `h1` `text-shadow:0 2px 28px rgba(10,10,10,0.55)`.
- **Nachprüfung:** `Die App` erreicht 4,5:1 erst bei st 270 statt 175 (13,2:1 bei st 0, 10,7:1 bei 178). Glyphpixel unter 3:1 bei st 0: 14,5 % statt 19,9 % (`Die App`), 7,7 % statt 14,5 % (`für eure WG.`). Die helle Schneeflanke links drückt `Die` weiter, wer es ganz sicher will, nimmt Schattenstärke 0,8 oder dunkelt die Szene links unten leicht ab (`v2/hero-title-vergleich.png`).

### T-10 Tiefe: Untertitel nur als Spitze, Wörter anfangs dunkel, Lücken im Tunnel (mittel)

- **Bereich:** Untertitel 01 st 8640-9067 (y1440 9720-10200 / y390 2632-2762), 02 st 9920-10347 (y1440 11160-11640 / y390 3022-3152), 03 st 11200-12053.
- **Messwerte:**
  - Untertitel 01 und 02: Opacity ≥ 0,9 nur 49 Einheiten (ein Messschritt, 55 CSS-px), ≥ 0,5 nur 213-246 Einheiten (240 CSS-px), sichtbar 427. Untertitel 03 ist wegen des Anschlags von `p` ab st 11413 durchgehend voll (640 Einheiten).
  - Wörter (OCR, `out/ocr-tiefe-1440.jsonl`): GELD ab st 8249 (vor der Stage, ohne Untertitel), HAUSHALT st 9031-10347, ABSPRACHEN st 10418-11982. Dazwischen **Tunnel ohne lesbaren Text**: st 9102-9209 (y1440 10240-10360) und 10382-10524 (y1440 11679-11840), OCR liefert dort nur Streuzeichen (Kontaktbogen `sheet-216-330.png`, #258 und #294).
  - Beim ersten Erscheinen sind die Wörter dunkel: Median der leuchtenden Pixel bei st 8249 nur 2,7:1, bei st 8391 4,4:1, bei 10133 6,7:1. Spitzen bis 19:1.
  - Body-Texte der Untertitel selbst haben auf Schwarz 19:1.
- **Ursache:** `engine/art.js:94` `a_cl(1 - |dz-9|/5)` ist ein Dreieck mit einer Spitze. Wörter: `art.js:90` Alpha `a_cl((34-dz)/12)` (bei dz 26 nur 0,67), `art.js:91` Punkte unter 6 px (`sz < 6`) mit `0.55*sz`. Die Kamera hängt der Scrollposition hinterher (`art.js:82` `s.dp += (stickP - s.dp) * 0.1` je zweitem Frame, 95 % nach etwa 0,5 s bei 120 Hz und 1 s bei 60 Hz): Nach einem Sprung in die Tiefe zeigt die Szene kurz eine falsche Tiefe. In der Nähe eines Worts löst es sich in große Streuzeichen auf (GELD ab etwa st 8960), das nächste Wort (HAUSHALT) ist dort noch zu dunkel (`v2/jump3-fix/a.png`, st 9000).
- **Vorschlag:** Plateau statt Spitze (getestet): `art.js:94` `a_cl((5 - Math.abs(dz - 9)) / 1.5)` (voll für |dz-9| ≤ 3,5, das sind etwa 350 Einheiten statt 49, gleicher Gesamtbereich). Wörter früher hell (nicht getestet): `art.js:90` `a_cl((40 - dz)/10)` mit Untergrenze 0,45. Den Tunnel nicht leer lassen: Untertitel des kommenden Worts schon bei dz 14 mit 0,5 einblenden.
- **Nachprüfung:** Untertitel ≥ 0,9 über 357 statt 49 Einheiten (Untertitel 01 und 02, gemessen in 36-Einheiten-Schritten), Gesamtbereich unverändert 462 (`v2/dcap-before.json`, `v2/dcap-after.json`).

### T-11 Installieren: inaktive Schritte 3,05:1, kurze Zeitsteuerung (mittel)

- **Bereich:** st 13007-13807 (y1440 14633-15533 / y390 3963-4207).
- **Element:** Schrittliste `01-03` (`sections.tsx:459-473`).
- **Messwerte:** Inaktive Schritte stehen auf `opacity:0.35` und haben **3,05:1** (19-px-Text und Schrittnummern 13 px), Grenze 4,5:1. Aktiv 19:1. Die Hervorhebung ist zeitgesteuert, nicht scrollgesteuert: Schritt 1 für 1,8 s, Schritt 2 für 1,4 s, Schritt 3 für den Rest der 8-s-Schleife (Rechner 6,5 s).
- **Ursache:** `sections.tsx:464` (`opacity:0.35;transition:opacity 0.3s`), gesetzt in `engine/install.js:21` (`'0.35'`), Takt `install.js:9, 11, 21`.
- **Vorschlag:** `0.35` auf `0.55` in beiden Dateien (getestet). Schritt 1 und 2 auf je 2,4 s dehnen, Schleife 8 auf 9,6 s (nicht getestet). Die Schrittfolge selbst gehört zum Install-Audit.
- **Nachprüfung:** inaktive Schritte 6,04:1 (vorher 3,05:1).

### T-12 Körper: Fall-Phase zeigt Boden mit Mini-Labels (mittel)

- **Bereich:** ab dem Sichtbarwerden der Sektion, st 7047-8200 (y1440 7927-9225 / y390 2147-2498).
- **Befund:** Das ist die vom Hauptagenten gesehene "Schwarz mit Labels"-Szene. Beim ersten Zeichnen ist `s.idle` 0, also `loose`: die Körper fallen auf den Boden der Sektion und tragen schwarze Namens-Boxen (11 px, `art.js:188`, nur im `loose`-Zustand gezeichnet, im Ruhezustand gibt es keine Labels). Erst nach `idle ≥ 3,5` ziehen sie zur Mitte zurück: etwa 3,5 s (120-Hz-Display) bis 7 s (60 Hz) nach dem ersten Sichtbarwerden. Bei normalem Tempo ist die Überschrift `Wirf sie. Sie finden zurück.` dann schon aus dem Bild (`out/flow-koerper/f0014.png`: Körper als Halbmonde am Boden, Titel weg). Bei langsamem Durchgang sind die Körper ab st 7680 in Ruhelage sichtbar.
- **Verhältnis zu T-03:** `vollbild.md` V-15 vermutet für "Körper und Tiefe nur Schwarz" das stehengebliebene Overlay. Beides ist real und unabhängig: bei normalem Scrollen T-12 (Labels sichtbar, weil nur im `loose`-Zustand gezeichnet), nach Sprüngen zusätzlich T-03 (Hand/Handy oder schwarze Fläche ohne Labels).
- **Ursache:** `art.js:172` `s.idle = 0`, `art.js:175` `loose = s.idle < 3.5` und `s.idle += 1/60` je zweiten Frame.
- **Vorschlag (getestet):** Startzustand ruhig: `s.idle = ph ? 0 : 3.5` bei Erzeugung (`art.js:172`, der Handy-Modus `ph` ist heute nirgends eingebaut, der Fall bleibt für ihn erhalten), `loose` erst nach `onDown`. Wer den Einfall behalten will, startet ihn erst, wenn die Sektion zu mindestens 70 % sichtbar ist (Überschrift im Bild).
- **Nachprüfung:** Fließscrollen mit 500 px/s von st 6600 nach 7900 (`flow.mjs`): vorher Körper am Boden mit Namens-Boxen, Titel weg (`v2/fk-before-sheet.png`, #14 bis #20), nachher der Ring aus acht Körpern in Ruhe unter der Überschrift (`v2/fk-after-sheet.png`, #14 bis #20).

### T-13 Canvas-Text auf Retina unscharf (mittel, Querverweis `vollbild.md` V-09)

- **Bereich:** alle Canvas-Beschriftungen: Planeten-Labels (`art.js:144-150`), Körper-Labels (`art.js:188`), Tiefe-Wörter (`art.js:90-93`), Ziffern 01-03 (`art.js:15-23`), Finale-ASCII, Raum- und Namens-Labels (`hero.js:50-56`).
- **Messwerte:** Bei DPR 2 haben die Art-Canvases 1280x800 (`ptext` 340x150, `physics` 1280x760, `planet` 1280x800, `depth` 1280x800) und werden mit 2,25 hochgezogen. `05 FIXKOSTEN` und `01 AUSGABEN` sind sichtbar weich, DOM-Text daneben ist scharf (`out/crop-retina-label.png`).
- **Ursache:** `art.js:8` `adpr = 1`, `art.js:10` `cv.width = W * adpr`; Hände/Flut `hero.js:148`.
- **Vorschlag (nicht getestet):** `adpr = Math.min(2, window.devicePixelRatio)` (scan setzt `setTransform(adpr, ...)` schon, `art.js:10`). Kostet auf Handys Zeichenzeit, dort die Obergrenze 1,5 prüfen.

### T-14 Kopfzeile verschwindet unter dem Ende-Overlay (niedrig, Entscheidung)

- **Bereich:** st 5970-7220 (y1440 6716-8122 / y390 1819-2200). Logo und CTA haben dort 1,0-1,3:1 (nur das opake Overlay sichtbar, `v2/head-ende.png` zeigt das Ausblenden bei st 5902 bis 6044).
- **Ursache:** `Landing.tsx:160` `Kopf` liegt vor `Ende` (`Landing.tsx:164`), `overlays.tsx:338` ist opak (`#0A0A0A`, `opacity:var(--e)`).
- **Vorschlag:** Entweder bewusst lassen (die Szene hat eine eigene CTA) oder `<Kopf />` hinter `<Ende />` setzen. Dann liegt er über dem Handy-Rand (Handy beginnt bei y 90), ohne Kollision.

### T-15 Wohnung: Canvas-Labels klein, am Rand abgeschnitten (niedrig)

- **Bereich:** `ZIMMER · JONA` rechts abgeschnitten bei st 4950-5200 (y1440 5570-5850), OCR-Kästen enden an der Canvaskante bei 1440.
- **Messwerte:** Raum-Labels 11 px (12,4 px bei 1440, 3,4 px bei 390), Alpha 0,6-1,0; Namen `LINA`, `MIKA` 11 px bei 0,72. Namenslabel liegt teils unter der Scheibe einer anderen Person (`MIKA` unter der Lina-Scheibe, `out/1440x900/0140_A.png`). Wandkanten laufen quer durch Absatz und Zeilen (dünne graue Diagonalen), Lesbarkeit bleibt bei 19:1.
- **Ursache:** `hero.js:50` (Namen), `hero.js:52-54` (Raum-Labels ohne Klemmung an `[r, W-r]`).
- **Vorschlag (nicht getestet):** x-Position mit `measureText` auf `[w/2+8, W-w/2-8]` klemmen, Namenslabel nach der Scheibe des nächsten Nachbarn ausrichten.

### T-16 Graue Sekundärtexte im Handy-Mock (niedrig)

- **Bereich:** Ende-Szene und Installieren-Handy.
- **Messwerte:** `#737373` auf Weiß ist 4,74:1 (Grenze 4,5:1), wirksam wegen Antialiasing bei 11-12 px etwa 2,8:1 (`MÄRZ · 4 PERSONEN`, `Lea · heute`, `gerade eben`, `Einkauf`).
- **Ursache:** `overlays.tsx:437, 464, 472, 480, 489, 521, 553, 577, 593`, `sections.tsx:387, 621, 647`.
- **Vorschlag (nicht getestet):** `#5C5C5C` (6,6:1) für Text unter 14 px.

### T-17 Hand folgt dem Zeiger über Überschrift und CTA (niedrig)

- **Bereich:** Ende-Szene mit Zeiger (st 6080-6700).
- **Messwerte:** Die Fingerspitze folgt dem Zeiger (`hero.js:190`). Auf `teilen.` und neben der CTA liegen dann Dither-Punkte der Hand hinter dem weißen Titel. Titel bleibt oben und lesbar, aber unruhig; ohne Zeiger wandert die Spitze über die Zeile `3 Dinge stehen auf der Liste.` im Handy (`out/pointer/ende-heading.png`, `ende-nopointer.png`).
- **Ursache:** `hero.js:190` Ziel = Zeiger, `overlays.tsx:628-634` Hand-Canvas unter dem Text.
- **Vorschlag (nicht getestet):** Autopilot-Ziel (`hero.js:190`) auf die rechte Hälfte des Handys begrenzen (x 840 ± 50, y 380 ± 80 liegt schon dort, Zeile bei y 500-520 vermeiden), bei Zeiger links vom Handy (x < 600) den Hand-Alpha auf 0,5 drücken.

## 5. Was in Ordnung ist

- Statische Texte (Labels 0,72, Überschriften, FAQ, Fußzeile) haben 9,8:1 bis 19:1.
- Tiefe-Untertitel selbst, Finale-Titel über der ASCII-Sonne (19:1, nur 1-2 % der Glyphpixel treffen helle Zeichen), Ende-Telefon (Kontrast 4,7:1 bis 19,8:1, Fingerspitze deckt höchstens ein Zeilenende), Planeten-Szene und Karte (sichtbar und lesbar, nur Kopf-Kollision und Schärfe), Fragen.
- Zeitliche Abstimmung Karte und Kamera der Wohnung: Text-Plateau und Stopp-Ankunft der Kamera passen zusammen (`hero.js:248` gegen `hero.js:16`).
- Ziffern 01-03 der So-geht's-Spalte bauen sich aus Streupunkten auf (`art.js:18`), sind aber fertig, bevor das Ende-Overlay den Platz freigibt (kosmetisch nur bei Flick-Tempo).
- 1440x900 hat keine Letterbox (k 1,125 in beiden Achsen), keine Konsolenfehler in 783 Schritten.

## 6. Grenzen der Messung und offene Punkte

- Touch-Gesten wurden per Rad-Ereignissen nachgebildet (`isMobile`, `hasTouch`), nicht per echter Touch-Gestenkette. WebKit und iOS-Safari sind nicht gemessen.
- Antialiasing drückt `cr` bei Text unter 14 px. Für diese Gruppe zählt `crT`. Bei Gruppen, die als Ganzes über Hell einblenden (Ende-Overlay, `overlays.tsx:338`), unterschätzt `crT`, dort gilt `cr`.
- Die Flut ist zeitabhängig. Einzelläufe sind Stichproben, die Statistik in T-01 stammt aus der validierten Simulation (ohne Zeiger).
- Nicht gemessen: Browser-Zoom, Safe-Area, `prefers-reduced-motion`, Tastaturfokus. Hover-Zustände nur beim Skip-Link (Scramble).
- Zu klären durch den Hauptagenten: T-14 (Kopfzeile im Ende bewusst weg?), Umfang der Zeit-Umschichtung in T-04, Randbreite der Flut-Lücke in T-01 (96 oder 64 Einheiten).
- Die Vorschläge zu T-04, T-08, T-13, T-15, T-16, T-17 sowie die Wörter-Helligkeit in T-10 sind nicht nachgebaut.

## 7. Anhang

Basis `scratchpad/text/` = `/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/text/`.

- Rohdaten: `out/1440x900/` und `out/390x844/` (je Schritt `NNNN.json`, `NNNN_A/B/C.png`, `metrics.json`), Testbuild-Läufe `out/after-raeume/`, `out/after-hero/`, `out/after-koerper/`, `out/after-ende2/`.
- Auswertungen: `find.py`, `report.py`, `collide.py` (Textkollisionen), `flood_stats.py`, `r-raeume2.txt`, `r-collide-1440.txt`, `r-floodstats.txt`.
- Belegbilder: `sheet-*.png` (Kontaktbögen), `sheet390-all.png`, `crop-ghost.png`, `crop-head-all.png`, `crop-koerper-head.png`, `crop-retina-label.png`, `out/jump/*.png`, `out/pointer/*.png`, `out/flow-koerper/f0014.png`.
- Nachprüfung: `v2/` (siehe Abschnitt 8).

## 8. Nachprüfung der Vorschläge (Testbuild)

**Aufbau.** Kopie von `src/` und Konfiguration in `scratchpad/text/v2/repo/` (`node_modules` verlinkt, Repo unverändert), gebaut mit `NEXT_DIST_DIR=.next-v2`, ausgeliefert auf Port 3281. Änderungen per Skript `v2/patch.py` (Marken P1 bis P11), Gesamtdiff gegen den Repostand `0fdab6c`: `v2/text-fixes.diff` (169 Zeilen). Gemessen mit derselben Kette wie der Hauptlauf (`capture.mjs` mit A/B/C-Bildern, `analyze.py`), dazu `v2/jump*.mjs`, `flow.mjs`, `v2/dcap.mjs`. Keine Konsolenfehler in den Läufen mit dem Testbuild.

| Fund | Prüfgröße | vorher | nachher |
|---|---|---|---|
| T-01 | Küchen-Plateau st 4210-4443: Messungen mit > 30 % unsichtbaren Glyphen, kleinster Kontrast | 50 % (12 von 24), 1,0:1 | 0 % (0 von 28), 9,85:1 |
| T-02 | Schritte mit zwei Karten > 0,05 (st 4300-5700) | 9 von 40 | 0 von 39 |
| T-03 | Taste Ende aus der Ende-Szene | `--e 1`, `endov translateY(0)`, Cursor `none`, Ende-Bild über der Fußzeile | `--p 1`, `endov -8174px`, Cursor `auto`, CTAs `inert`, Fußzeile sichtbar |
| T-03 | Radschwung 4 x 3000 px | `--p 0,74`, Karte 02 über Tiefe | `--p 1`, `endov -4267px`, keine Karte |
| T-05 | Ende-Titel st 5831-5938, gemessenes Verhältnis | 1,3 / 1,8 / 2,8 / 4,9:1 sichtbar | blendet erst bei st 5927 ein, 3,0:1 bei 5963, 9,4:1 bei 5998 |
| T-06 | Logo st 12000-14574, unlesbare Schritte, kleinster Kontrast | 4 von 68, 1,0:1 | 0 von 38, 11,9:1 |
| T-07 | Skip-Link st 0-498 | 5,5:1 bis 1,5:1 | 16,3:1 bis 10,6:1 |
| T-09 | `Die App` über 4,5:1 bis | st 175 | st 270 |
| T-10 | Untertitel 01/02 ≥ 0,9 (Messschritt 36) | 36 Einheiten (49 gerechnet) | 357 Einheiten |
| T-11 | inaktive Install-Schritte | 3,05:1 | 6,04:1 |
| T-12 | Fließscrollen 500 px/s st 6600-7900 | Körper am Boden, Titel weg | Ring in Ruhe unter dem Titel |

**Nebenwirkungen und Hinweise.**

- T-01: Die Flut lässt links eine Lücke, deren Kante bei etwa x 580 Bühnenpixeln liegt (Maske plus Rand). Das ist sichtbar, aber ruhig, die Wohnung erscheint zuerst hinter dem Text (`v2/sheet-after-raeume.png`, #9 bis #13). Rand und Spaltenmaße sind Stellwerte.
- T-06: Ohne den Finale-Versatz dunkelt der Schleier im Endbild die Oberkante von `Alltag` an (so im ersten Testbuild ohne P11 gesehen, danach behoben). Beides gehört zusammen.
- T-03 ist Voraussetzung für T-06 (Schleier hängt an `--e`) und für das Ausblenden des Skip-Links nach Sprüngen.
- Die Vorschläge verändern keine Texte, keine Szenen, keine Farben und keine Typografie. Neu sind nur eine Lücke in der Flut, eine Fläche hinter dem Skip-Link, ein Schleier unter dem Kopf und Zeit- und Deckkraftwerte.
- Die Läufe `out/after-*` entstanden mit dem ersten Testbuild (P1 bis P10), die Sprungtests `v2/jump2-fix`, `v2/jump3-fix` mit dem zweiten (zusätzlich P1b, P11). Alle vier Messläufe: keine Konsolenfehler, keine Warnungen.
- Wiederholen: `src/` des Repos nach `v2/repo/src/` kopieren, `python3 v2/patch.py` ausführen (Tags einzeln wählbar, z. B. `P1 P2`), in `v2/repo` mit `NEXT_DIST_DIR=.next-v2 ./node_modules/.bin/next build` bauen, `next start -p 3281`, dann `capture.mjs --url http://localhost:3281/ --from <st> --to <st> --tag <name>` und `python3 analyze.py out/<name>`.
