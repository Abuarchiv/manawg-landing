# PLAN-FINAL: Von final.dc.html zur Award-Landing

Stand 2026-10-06. Maßgebend ist `design/final.dc.html`, `design/v24.dc.html` ist nur der Vorgänger. Grundlage sind eine Architektur-Analyse und drei Kritiken (Bewegung, Werk/Bogen, Award-Jury). Wo sich die Kritiken widersprechen, ist hier entschieden, und die Annahme steht jeweils dabei.

Leitsätze, die überall gelten:
- Das ist Kunst, keine Website. Abstrakt, Schönheit zuerst, keine erzwungene Geschichte.
- Es gibt einen Protagonisten: das Zeichen aus acht Körpern. Es gibt ein Material: Halbton und Bayer-Korn in Schwarz/Weiß. Die Schraffur bleibt die Ausnahme für den Berg, ASCII nur als Echo im Finale.
- Kein Slop. Keine Partikelwolken, kein Bloom, keine radialen Glows, keine Glow-Schatten, keine KI-Bilder, keine Fotos.
- Schriften: Inter, Inter Tight, JetBrains Mono. Alles auf Deutsch.
- Mobil zuerst. Hochformat 390×844 ist die erste Komposition, Querformat ab 900 px Breite die zweite. Die Querformat-Fassung behält den Look von Final.
- Nichts pushen, nur lokal committen. Vercel baut `main` automatisch, deshalb wird `site/` vorerst nicht in den Next-Build eingehängt (siehe Abschnitt 3).

Vorbedingung, die nicht Teil dieses Plans ist: Backup des alten Landing-Stands und der Blender-Dateien.

---

## 1. Architektur und Portierung

### Ziel-Struktur `manawg-landing/site/`
Statisch, ohne Framework und ohne Bundler, ES-Module.

```
site/
  index.html            Komplettes semantisches Markup, aller Text im DOM, Canvases aria-hidden
  style.css             Tokens, Typo-Stufen, Layout (mobil zuerst, eine Stufe min-width:900px), Reduced Motion
  css/<szene>.css       Eine Datei je Szene (verhindert Konflikte beim parallelen Bauen)
  main.js               Boot, Lenis, eine rAF-Schleife, IntersectionObserver, Resize/DPR, Pointer/Licht, ?fps
  ui.js                 Ersatz für die Mini-Runtime (state/on/set, ca. 15 Zeilen)
  lib.js                cl, ss, lerp, ease, backOut, spring, damp(k), hsh, vnz, smn, uc, Bayer-Matrix,
                        Zeichen-Geometrie (AB, a_mark, HOME/HOME3) + daraus erzeugter GLSL-Schnipsel,
                        Zeitachse TL (alle P-Bereiche an einer Stelle)
  scenes/hero.js        WebGL2: Berg, Sonne=Zeichen, Organ, Zerfall, Tauchgang; Montage-Auftakt
  scenes/hero.glsl.js   Shader-Strings mit #define-Stufen (DESKTOP/MOBILE)
  scenes/wohnung.js     Isometrische Wohnung, Raum-Texte, Logo-Masken-Clip
  scenes/flut.js        Raster-Übergang Wohnung → Hand
  scenes/hand.js        Hand + Handy-Rahmen als eigener kleiner WebGL-Pass, Handy-UI-Bindings
  scenes/physics.js     „Wirf sie. Sie finden zurück.“
  scenes/depth.js       Tiefe (Wörter aus Halbton)
  scenes/install.js     Papier-Kapitel: Installieren inkl. Schritte 01–03 (ptext-Ziffern)
  scenes/sun.js         Finale: Zeichen-Sonne in ASCII, an Scroll gekoppelt
  fonts/                3 woff2 aus manawg-landing/src/fonts/
  img/                  manawg-mark.svg (public/), icon-512.png (aus manawg-app/apps/web/public/), og-zeichen.png (public/)
  vendor/lenis.mjs, lenis.css   aus node_modules/lenis/dist (v1.3.26)
  tools/shots.mjs       Playwright: Screenshots je P-Marke und Viewport, fps-Auslese
```

### Szenen-Schnittstelle (in A0 festgelegt, danach eingefroren)
```js
export default { init(el, ctx), frame(t, dt, ctx), resize(ctx), destroy() }
// ctx: { P, scrollY, vel, light:{x,y,on,pulse}, reduced, tier:'mobile'|'desktop', stage:{holeX,holeY,holeR}, set, state }
```
`main.js` ruft `frame` nur für Szenen auf, die laut IntersectionObserver sichtbar sind. `hero.js` schreibt `ctx.stage` (Lochmitte und -radius im Bildschirmraum), `wohnung.js` liest das. Szenen tauschen nur über `ctx` Daten aus.

### Portierungsschritte (A0, in dieser Reihenfolge)
1. Gerüst anlegen, Assets kopieren und die Pfade umstellen (`apps/web/src/shared/fonts/…` → `./fonts/`). `index.html` bekommt `lang="de"`, title, description, OG/Twitter mit `og-zeichen.png`, canonical, JSON-LD SoftwareApplication, Favicon, theme-color, preload für Inter Tight und JetBrains Mono, für Inter `font-display:swap`.
2. Markup aus Final semantisch übertragen: header/nav, main, section, ein h1, h2 je Abschnitt, `<a href="https://app.manawg.com/…">` für alle CTAs, `<button>` für alle Schalter, Fragen als `<details name="faq">`, Footer-Links mit href (Impressum, Datenschutz). Nur Szenen übernehmen, die laut Runde 2 bleiben. Jede Szene steht zwischen Markern `<!-- #name -->…<!-- /name -->`.
3. `ui.js` schreiben (Muster aus der Architektur-Analyse). sc-if wird zu `hidden`, sc-for zu einer statischen Liste mit Umschaltung, Inline-Style-Bindings zu `[aria-pressed]`/`[data-done]` in CSS.
4. `main.js`: Dokument-Scroll statt Container-Scroll. Lenis mit `autoRaf:false`, lerp 0.1, Touch nativ. Eine einzige rAF-Schleife mit `dt = min(0.05, …)`, Pause bei `document.hidden`. Layout-Offsets nur bei resize messen, nie pro Frame `getBoundingClientRect`. ResizeObserver je Canvas, Backing-Store mit `min(devicePixelRatio, 2)` (Hero-Szenenpuffer bleibt adaptiv klein).
5. `lib.js`: Helfer aus Final übernehmen. Zeichen-Geometrie aus einer Quelle, GLSL wird daraus erzeugt. Dazu `damp(rate, dt) = 1 - exp(-rate*dt)` und eine Feder (semi-implizit, k=170, d≈14). Die Zeitachse TL bekommt die neuen Werte aus Runde 3–5.
6. Licht-Quelle: Pointer auf dem Desktop. Auf Touch Halten = Licht, nach dem Loslassen 0,6 s Nachglühen, sonst die vorhandene Autopilot-Lissajous. Hover-Effekte (Scramble) nur bei `(hover:hover)`.
7. `?fps=1`: kleines Overlay, das `window.__fps = {avg, p95, perScene}` schreibt und von `shots.mjs` ausgelesen wird.
8. `tools/shots.mjs`: Playwright aus `/Users/abu/Company/manawg-app/apps/web/node_modules/@playwright`. Lokaler Server `python3 -m http.server 4190 -d site`. Viewports 390×844 und 1440×900, Scroll auf jede P-Marke der TL, Screenshot nach `site/tools/out/` (gitignored), dazu fps-Log mit 5 s Messung je Szene.
9. Toten Code nicht übernehmen: tone, topo, ascii globe/mark, mosaic, mesh, press, fluid, score (inkl. WebAudio), ticker, snow; Shader-Zweige uSt 0/2/4 und uL; physics Phone-Modus; calc*; V-Array; `for(kk<1)`; `fine()`; `if(false&&…)`; Prop tour; Sternbild/Sterne; Planet.

Abnahme A0: Seite lädt ohne Konsolenfehler unter `http://localhost:4190`. Alle drei Fonts kommen aus `./fonts` (Network-Panel). Tab-Reihenfolge erreicht jeden CTA und Schalter. `shots.mjs` liefert Bilder für beide Viewports.

---

## 2. Verbesserungsrunden (nach Wirkung geordnet)

Prüfwege, auf die unten verwiesen wird:
- **[S]** `node site/tools/shots.mjs` → Screenshots 390×844 und 1440×900 an den genannten P-Marken. Sichtprüfung zusätzlich im echten Chrome (claude-in-chrome).
- **[F]** `?fps=1` und fps-Log aus shots.mjs. Desktop-Chrome: avg ≥ 58, p95-Frame ≤ 20 ms. Android-Emulator ManaWG_Pixel (adb-CDP): avg ≥ 30. Der Emulator-GPU ist nur ein Näherungswert, vor Abgabe auf einem echten Gerät gegenprüfen.
- **[A]** axe-core per Playwright (0 serious/critical), Tastatur-Durchlauf, Lighthouse mobil (Performance ≥ 85, A11y ≥ 95, SEO 100).
- **[R]** Chrome-Emulation `prefers-reduced-motion: reduce` und Screenshots.

### Runde 0: Hochformat-Komposition je Szene (vor dem Bau, gilt für alle Aufgaben)
Was im Hochformat nicht schön wird, fliegt raus. Feste Kompositionen für 390×844:

| Szene | Hochformat |
|---|---|
| Berg/Sonne | Sonne=Zeichen im oberen Drittel, Grat im unteren Drittel, Wortmarke und Mono-Zeile oben links |
| Organ/Zerfall | Zeichen zentriert, Zerfall vertikal gestaffelt statt horizontal |
| Wohnung | Isometrie oben (60 % Höhe), Kapiteltext darunter. Eigene STOPS-Tabelle `STOPS_P` |
| Hand/Handy | Handy zentriert und angeschnitten, nur der Zeigefinger kommt von unten rechts ins Bild |
| Körper | Volle Breite, 100svh hoch |
| Tiefe | Wörter-Inseln enger (x ±2), Wörter umbrechen, wenn nötig |
| Installieren | Handy oben, Schritte darunter. Die Rechner-Variante wird zum skalierten Fenster (max. 100 % Spaltenbreite) |
| Finale | „Alltag teilen.“ zweizeilig etwa 96 px, Sonne dahinter |

Alle Szenen-Konstanten (STOPS, PCX/PCY, Inseln, Flut-Raster, Sonnenraster) liegen je Szene als `{mobile, desktop}`. `tier` wird aus `innerWidth < 900` bestimmt.

### Runde 1: Fundament (sehr hoch)
Bewegung von der Bildrate entkoppeln, Leistung, Basics. Gehört zu A0 und zu jeder Szenen-Aufgabe.
- Alle Glättungen auf `damp(rate, dt)` umstellen. Startwerte: Licht 4/s, Hand 18/s, Wohnungslicht 14/s, Tiefe 7/s, Bewohner 1,5/s. Physik mit festem Schritt 1/120 s und Akkumulator, `idle` in Sekunden.
- Die `fa % 2`-Drosselung entfällt. Eine Schleife, nur sichtbare Szenen rechnen, höchstens eine schwere Szene gleichzeitig.
- Hero: Post-Pass direkt in den sichtbaren WebGL-Canvas mit voller DPR, kein `preserveDrawingBuffer`, kein `drawImage`. Der Szenen-Pass bleibt klein und adaptiv (Regler `ad` bleibt). MOBILE-#define: march 80, Normalen 6 Oktaven, Schatten 12, fw-Untergrenze 120. Kontextverlust-Neuaufbau bleibt. Ohne WebGL2 wird ein statisches Halbton-PNG des ersten Bildes gezeigt.
- Hand: Pixel-SDF von der CPU in einen Fragment-Shader verlegen (eigener kleiner GL-Kontext, 14 Kapseln, Bayer im Bildschirmraum). Backen geht nicht, weil die Hand mit dem Zeiger rotiert und sich bei Klick zusammendrückt.
- Flut: Arrays wiederverwenden, keine Allokation pro Frame.
- ASCII-Sonne: Glyphen-Atlas plus drawImage statt fillText. Mobil Zellen 12×18.
- Budget: JS ≤ 80 KB gz inklusive Lenis, Fonts ca. 125 KB, keine Bilder außer SVG/Icon/OG.
- Abnahme: [F] auf allen Szenen erfüllt. Auf 60-Hz- und 120-Hz-Emulation (CDP `Emulation.setCPUThrottlingRate` reicht nicht, deshalb rAF-Zeitstempel manipulieren oder auf zwei Geräten prüfen) fallen die Körper gleich schnell, Toleranz ±5 %. [A] erfüllt. [R]: Lenis aus, kein Autopilot, Standbilder je Szene.

### Runde 2: Ein Bogen statt zwei Akte (sehr hoch)
- Struktur: Auftakt → Berg → Verwandlung → Zerfall → Tauchgang → Wohnung (einziger Ort mit Funktions-Erklärung) → Flut → Hand mit Handy, ohne Headline und Button, nur „du bist drin“ → Körper „Wirf sie.“ → Tiefe → Papier-Kapitel (Installieren mit Schritten 01–03, Fragen) → Finale (Sonne + „Alltag teilen.“ + CTA) → Footer leise.
- Streichen: Planet, Sterne-Overlay, „So geht’s“ als eigener Abschnitt (geht in Installieren auf, die ptext-Ziffern werden dort zu den Schrittnummern), das erste „Alltag teilen.“ samt CTA am Hand-Ende, Namen-Labels an den Körpern, Tiefe-Untertitel mit Funktionstexten, statisches DOM-Flutraster (Final Z. 43).
- Papier-Kapitel: Installieren und Fragen auf #FAFAFA mit Tinte #0A0A0A. Das Finale holt die Seite zurück ins Schwarz. Fragen als ruhige typografische Liste mit Fragen in 17 px.
- Header-CTA „WG erstellen“ immer aktiv (`<a>`), nach dem Intro als feste Pille. Höchstens 1 Tipp und 0 Scrolls bis zur App.
- Abnahme: „Alltag teilen.“ steht genau einmal im DOM (`grep -c`). Kein Element mit `data-art="planet|stars"`. [S] Seitenverlauf 390 px als Bildstreifen: Hell-Dunkel-Rhythmus sichtbar, keine zwei Höhepunkte.

### Runde 3: Auftakt = Logo-Montage (sehr hoch)
- Kein Zähler, kein Balken, kein vorgespieltes setInterval. Der Loader wartet auf `document.fonts.ready` und die Shader-Kompilierung (`KHR_parallel_shader_compile`, falls vorhanden), Ziel ≤ 800 ms. Danach montieren sich die acht Körper sichtbar auf dem Halbton-Post: Dauer 1,8 s, 0,09 s Versatz je Körper, backOut c=1,2, am Ende ein Atemzug (Radius 1 → 1,06 → 1 über 0,5 s). Danach kommen die Headline-Zeilen über eine Maske herein (0,6 s, 0,08 s Versatz, cubic-bezier(.2,.8,.2,1)).
- Hero atmet: Der Berg steht P 0–0,12 still, erst dann kippt die Kamera.
- H1 steht ab dem ersten Paint im DOM und ist visuell leise: Wortmarke plus Mono-Zeile „Die App für eure WG.“. Annahme: Der große Satz gehört dem Finale.
- Ein Klick auf die Bühne (nicht auf Nav oder CTA) wirft die Körper radial auseinander (Weite 0,9) und sie federn zurück. Über der Sonne wird der Cursor zu „+“.
- Hinweistexte streichen bis auf einen leisen Scroll-Hinweis: „INTRO ÜBERSPRINGEN“, „WEITER SCROLLEN“, „ZIEHEN ZUM DREHEN“, „LÄDT DIE WG“.
- Abnahme: Video per Playwright `recordVideo` der ersten 4 s zeigt die Montage vollständig sichtbar. LCP ≤ 2,5 s in Lighthouse mobil. Klick auf den Header-CTA löst keine Explosion aus.

### Runde 4: Berg → Organ als Verwandlung (hoch)
- Kein `mix(mountain, organ, uMix)` mehr. Die Sonne wächst, bis ihr Bildschirmradius dem projizierten Organ bei cz=17 entspricht, dann wird in einem Frame auf `organ()` umgeschaltet (Match-Cut, gleiche Silhouette).
- Der Post wechselt als Wischfront von der Sonnenmitte nach außen von Schraffur zu Halbton: `uD = smoothstep(r-.08, r+.08, length(uv-sunPos))`, r von 0 bis 1,2.
- Bereich P 0,14–0,26.
- Abnahme: [S] an P 0,18 / 0,20 / 0,22 / 0,24 zeigt keine Doppelbelichtung, sondern eine Front. Silhouetten-Differenz im Schnitt-Frame unter 2 % der Fläche (Pixel-Diff zweier Screenshots um den Schnitt).

### Runde 5: Tauchgang durchs Loch = Fenster in die Wohnung (hoch)
- Die Wohnung wird ab P 0,48 per `clip()` auf den projizierten Lochkreis gerendert (`ctx.stage` aus hero.js) und wächst mit dem Dive, bis sie bei P 0,58 den Schirm füllt. Kein Opacity-Crossfade.
- Eintritt mit Überschwingen: u von 18 auf 26, backOut c=1,1.
- Die Flut kommt nur noch einmal, beim Übergang Wohnung → Hand (P 0,84–0,92). Sie wird aus Halbton-Zellen ohne Minesweeper-Ziffern gebaut. Annahme: Ziffern versprechen ein Spiel, das in einem Übergang niemand spielt, und brechen das Material.
- Abnahme: [S] an P 0,48 / 0,52 / 0,56 / 0,58: Die Wohnung ist im Loch sichtbar, die Flut bis P 0,8 nirgends.

### Runde 6: Eine Materialsprache, Bloom raus (hoch)
- Entfernen: alle `createRadialGradient`-Glows, `box-shadow` mit großem Blur an Handys, Metall- und Glanzverläufe am End-Handy, Sonnenstrahlen.
- Ein Handy-Rahmen: Rahmen und Tasten im selben Dither wie die Hand (phoneBox). Nur der Bildschirm ist scharfes, echtes UI. Das Install-Handy nutzt denselben Rahmen (als SVG/CSS-Linie, keine zweite Stilwelt).
- Tiefe: Die Wörter GELD, HAUSHALT, ABSPRACHEN bestehen aus Halbton-Punkten (Bayer-Größe nach Tiefe). Staub von 1600 auf 200 und an die Scroll-Geschwindigkeit gekoppelt (Streckung `1 + |vel|*0.004` in Flugrichtung), ohne Bewegung praktisch unsichtbar.
- Raum-Texte ohne `blur()`: Zeilen in overflow:hidden einschieben (translateY 100 % → 0, 0,06 s Versatz, an den Scroll gekoppelt).
- Abnahme: `grep -E "createRadialGradient|blur\(|box-shadow:[^;]*[4-9][0-9]px" site -r` ergibt 0 Treffer. [S] Tiefe bei Stillstand: nur Wörter sichtbar.

### Runde 7: Zeit ab Eintritt, Finale schließt den Kreis (hoch)
- Jede Szene misst `te` ab dem ersten sichtbaren Frame (`enter` wird beim Verlassen zurückgesetzt).
- Die Sonne im Finale ist das Zeichen vom Anfang in ASCII-Glyphen (dieselbe Silhouette, keine 22 Strahlen). Sie hängt am Scroll-Fortschritt der Sektion: `rise = ss((p-0,1)/0,6)` und geht beim Zurückscrollen wieder unter.
- ptext-Ziffern streuen beim Eintritt, 0,12 s Versatz je Ziffer.
- Abnahme: [S] im Finale bei p 0,1 / 0,4 / 0,7: Die Sonne steht sichtbar unterschiedlich hoch. Wer nach 60 s Wartezeit hinscrollt, sieht denselben Aufgang.

### Runde 8: Übergaben in der zweiten Hälfte (mittel bis hoch)
- Die Körper aus „Wirf sie“ fallen beim Weiterscrollen aus dem Bild und tauchen als Inseln-Kerne in der Tiefe wieder auf (Positionen aus HOME3, Austausch über `ctx`). Die Tiefe endet in einer Insel, die zum App-Icon im Install-Handy schrumpft (micon scale 0 → 1 gibt es schon).
- physics: `touch-action: pan-y`. `preventDefault` nur im nicht-passiven touchstart, wenn ein Körper getroffen wurde. Werfen horizontal, Scrollen vertikal (Schwelle 8 px, Winkel > 30°).
- Abnahme: [S] als Bildstreifen Körper → Tiefe → Installieren ohne harten Schwarzschnitt. Auf dem Emulator scrollt ein vertikaler Wisch über den Körpern die Seite.

### Runde 9: Federn und Textwechsel (mittel)
- Glyph-Verdrängung in der Tiefe als Kraft auf eine Feder statt direkter Position. Die Körper kehren mit Feder heim, 0,05 s Versatz je Körper.
- Bewohner in der Wohnung mit kleinem Wippschritt (y ±0,04 u bei 3 Hz, solange sie laufen) und 0,15 s Halt bei der Ankunft.
- Kartenwechsel per Scramble ('@%#*+=-:', 220 ms). Fragen: `grid-template-rows 0fr → 1fr`, 420 ms, das Plus dreht 90°.
- Abnahme: Sichtprüfung im echten Chrome. Kein Sprung beim Ein- und Austritt des Zeigers in der Tiefe (Video 2 s).

### Runde 10: Touch und Cursor (mittel, für mobil zuerst hoch)
- Licht per Touch-Halten (aus A0) in allen Szenen mit Licht verdrahten. Auf Touch gibt es keinen gezeichneten Cursor-Ring.
- Desktop: `cursor:none` nur, solange ein eigener Cursor (Wohnungsring, Hand) gezeichnet wird, und nur bei `(pointer:fine)`. Nie zwei Cursor.
- Hinweistexte für Touch umformulieren („Halten ist Licht“).
- Abnahme: Auf dem Emulator ManaWG_Pixel folgt das Licht beim Halten dem Finger in Wohnung, Hand und Körpern.

### Runde 11: Typografie und Copy (mittel)
- Drei Stufen: S1 200 px Desktop / 96 px mobil (nur Finale), S2 64/40 px (Kapitel), Text 17 px, Mono 12 px. Alle anderen Größen entfallen. Als Tokens in style.css.
- Ein Zählsystem: Die Wohnung zählt 01–04, sonst gibt es keine Abschnittsnummern.
- Namen überall Lina, Mika, Jona, Lea.
- Fragen ergänzen: Was kostet es? Wo liegen die Daten (EU, DSGVO)? Was passiert beim Auszug? Werbung und Tracking? Die doppelte Frage „Wie kommen meine Mitbewohner dazu?“ streichen.
- Installieren-Schritte nicht mit opacity 0,35 abblenden (Kontrast). Inaktive Schritte stattdessen mit Linie und Mono kennzeichnen.
- Abnahme: `grep -oE "font-size:[^;]+" site -r | sort -u` zeigt nur Tokens. [A] Kontrast AA.

---

## 3. Bewusst NICHT gemacht

- Planet (Punkt-Globus, Atmosphären-Glow, Orbit-Ring): Stripe/GitHub-Klischee, verdoppelt die Funktions-Erklärung.
- Sterne-Overlay und Sternbild über dem Berg: Partikel-Funkeln, der fbm-Himmel reicht.
- Zufälliger Staub als Deko (1600 Punkte), Bloom, radiale Glows, Glow-Schatten, Sonnenstrahlen, Blur-Fade-ups.
- Fake-Loader mit Zähler und Balken.
- Klickbares Minesweeper-Floodfill in der Flut (Kritikvorschlag). Die Ziffern fallen stattdessen weg, siehe Runde 5.
- Geräteneigung (DeviceOrientation) als Lichtquelle: Der iOS-Erlaubnisdialog stört den Einstieg. Erst prüfen, wenn Touch-Halten nicht trägt.
- Funktions-Labels in Kunstszenen (Körper, Tiefe). Erklärt wird nur in der Wohnung.
- Zweites Finale bzw. zweites „Alltag teilen.“, eigener Abschnitt „So geht’s“, Footer mit vier Spalten.
- three.js, GSAP, React/Next, Bundler, Scroll-Hijack bzw. virtueller Scroll. Lenis scrollt nativ, auf Touch gar nicht geglättet.
- WebAudio (score), Ticker, alle toten Szenen aus Final.
- Fotos, KI-Bilder, Blender-Renders auf der Seite.
- Einhängen in Next/Vercel und Deploy. `site/` läuft lokal. Die Entscheidung, ob `vercel.json` auf `outputDirectory: site` umgestellt oder der Next-Teil ersetzt wird, fällt nach der Abnahme. Kein Push.
- `beforeinstallprompt` auf der Landing (andere Domain als die App). „App installieren“ verlinkt auf app.manawg.com.

---

## 4. Parallelisierbare Bau-Aufgaben ohne Dateikonflikte

Regeln:
- Jede Aufgabe besitzt ihre Dateien exklusiv.
- `index.html` darf nur zwischen den eigenen Markern geändert werden. Git mergt getrennte Hunks konfliktfrei.
- `lib.js`, `main.js`, `ui.js` und `style.css` sind nach A0 eingefroren. Neue Helfer kommen in die eigene Szenendatei. Änderungswünsche an TL oder ctx sammelt C.
- Jede Aufgabe läuft im eigenen Worktree auf dem A0-Commit und committet lokal ohne Attribution. Jede liefert [S]-Bilder ihrer Szene und ein [F]-Log.

### Phase A (seriell, 1 Aufgabe)
**A0 Gerüst + Fundament.** Dateien: site/index.html (komplettes Markup mit Markern), style.css, main.js, ui.js, lib.js (inkl. TL und Feder), fonts/, img/, vendor/, tools/shots.mjs, .gitignore-Eintrag. Runden: 1 (Infrastruktur), 2 (Struktur, Streichungen, Papier-Kapitel in style.css), 10 (Licht-Quelle, Cursor-Regel), 11 (Typo-Tokens, Copy, Fragen). Jede Szene bekommt einen Stub, der die Final-Logik 1:1 portiert (mit dt), damit B auf einer laufenden Seite startet.

### Phase B (parallel, 6 Aufgaben)
| ID | Dateien (exklusiv) | Marker | Runden |
|---|---|---|---|
| B1 Hero | scenes/hero.js, scenes/hero.glsl.js, css/hero.css | `#hero` (ohne Raum-Texte und End-Overlay) | 1 (GL direkt, MOBILE-defines, Fallback-PNG), 3, 4, 5 (schreibt ctx.stage), 0 (Hochformat Berg/Organ) |
| B2 Wohnung | scenes/wohnung.js, css/wohnung.css | `#raeume` | 5 (Clip ins Loch, Überschwingen), 6 (Zeilen-Masken statt Blur), 9 (Bewohner), 10 (Ring/Cursor), 0 (STOPS_P) |
| B3 Flut + Hand | scenes/flut.js, scenes/hand.js, css/ende.css | `#ende` | 1 (Hand-Shader, Flut ohne Allokation), 5 (Flut nur einmal, ohne Ziffern), 6 (Dither-Handy-Rahmen), 0 (Finger von unten) |
| B4 Körper + Tiefe | scenes/physics.js, scenes/depth.js, css/koerper.css | `#koerper`, `#tiefe` | 1 (fester Physikschritt), 6 (Halbton-Wörter, Staub 200), 8 (Übergabe Körper → Tiefe, touch-action), 9 (Federn) |
| B5 Papier | scenes/install.js, css/papier.css | `#installieren`, `#fragen` | 2 (Schritte 01–03 mit ptext-Ziffern), 6 (gleicher Handy-Rahmen), 7 (ptext ab Eintritt), 8 (Icon-Ankunft aus der Tiefe), 9 (Fragen-Animation), 11 (Kontrast) |
| B6 Finale | scenes/sun.js, css/finale.css | `#finale`, `#footer` | 1 (Glyphen-Atlas), 7 (scroll-gekoppelte Zeichen-Sonne), 11 (S1-Satz) |

Schnittstellen zwischen den B-Aufgaben laufen nur über `ctx`, wie in A0 festgelegt: `ctx.stage` (B1 → B2), `ctx.handoff.bodies` (B4 → B5). Wer den Gegenpart noch nicht hat, nutzt den Stub-Wert aus A0.

### Phase C (seriell, 1 Aufgabe)
**C Integration und Abnahme.** Worktrees nacheinander in einen lokalen Branch mergen. TL-Feinschliff (Rhythmus laut/leise, Sticky-Länge in svh, Ausgangswert 8×100svh). Leistungsrunde auf ManaWG_Pixel und Desktop [F]. [A] mit axe und Lighthouse, [R], kompletter [S]-Bildstreifen beider Viewports, Durchklicken im echten Chrome. Danach `graphify update .` und ein lokaler Commit. Kein Push.

Modelle laut Nutzerregel: Plan und Judge auf Opus. A0, B1–B6 und C auf Sonnet.
