# PLAN-V2: Vollbild, echte App, echte Installation, echte Hand, lesbare Szenen

Stand 2026-10-07 · Branch `landing-produktion` · Basis `1fc8af3` · Grundlage: `design/audit/vollbild.md` (V-xx), `design/audit/text.md` (T-xx), `design/audit/fehler.md` (F-xx), `design/app-ref/REF.md`, `design/INSTALL-FLOWS.md`, `design/HAND.md`, Code `src/components/landing/*` (vollständig gelesen).

Wortlaut des Nutzers (2026-10-06, maßgeblich):

> „also das ist noch nicht gut genug ist nicht voll screen ist abgeschnitten! und die animation sind auch nicht gut weil text nicht zur sehen sind! app demo soll genau unsere app sein und keine ai slop und alles muss funktionieren die installation animation auch die echte animation anstatt fake rheinfolge weil in echte leben ist das nicht so muss noch schöne werden! bei der hände ist so unrealistisch stelle das so releastisch wie menschliche hand aber das struktur der hand bleibt gleiche ascii button sind zur groß und sieht nicht schön aus manche sachen muss man kleine machen damit die auch gut aussehen! es enthält allgemein so viel fehler fixe die! ich will award wining kunst website bauen“

Grundsatz: Das fertige Design des Nutzers (`design/final.dc.html`) bleibt. Alle Szenen und Inhalte (Berg, Zeichen, Flut, Wohnung, Handy mit Hand, So geht’s, acht Körper, Tiefe, Planet, Installieren, Fragen, Finale, Fußzeile), Texte, Farbwelt Schwarz/Weiß, Typografie (Inter, Inter Tight, JetBrains Mono) und Stimmung bleiben. Geändert wird nur, was der Nutzer verlangt hat, und echte Fehler. Ziel ist eine Award-würdige Kunst-Website (Awwwards SOTD), keine Template-Seite, kein KI-Slop.

Ablauf: **Fundament** (seriell, Abschnitt 5) → **sechs Arbeitspakete** parallel in Worktrees (Abschnitt 6) → **Integration und Endabnahme** (Abschnitt 9).

---

## 0. Nutzerpunkte und Zuordnung

| # | Nutzerpunkt | Ursache (Audit) | erledigt in | Abnahme |
|---|---|---|---|---|
| U1 | nicht Vollbild, abgeschnitten | feste 1280×800-Bühne mit `k = min(vw/1280, vh/800)` (`Landing.tsx:24, 62`), V-01…V-03, V-05…V-10, V-13, V-14, V-16 | Fundament (Architektur), jedes Paket (Hochformat seiner Szenen), SHELL (V-16) | A1 |
| U2 | Animationen: Text nicht zu sehen | F-01/T-03/V-15 (eingefrorenes Ende-Bild), T-01 (Flut über Raumtexten), T-02 (Geisterduplikat), T-04 (Karten zu kurz), T-05, T-06/V-04 (Kopf über Text), T-07, T-09, T-10/F-13 (Tiefe dunkel), T-12/F-12 (Körper am Boden) | Fundament (F-01, Zeitachse, Grundfix Körper/Tiefe), TEXT, SZENEN, HAND, SHELL | A2 |
| U3 | App-Demo genau unsere App, alles funktioniert | Handy-Mock ist erfunden (REF §1, F-11, T-16) | APP | A3 |
| U4 | echte Install-Animation statt erfundener Reihenfolge | `engine/install.js` weicht ab (INSTALL-FLOWS §8, F-15, T-11) | INSTALL | A4 |
| U5 | muss schöner werden, Award | F-03 (Hand 27 fps), F-06 (Tempo an Bildrate), F-07, F-16, F-19 (keine Zustände) | alle | A5 |
| U6 | Hand realistisch, Struktur gleich | Kapsel-SDFs `hero.js:172-226`; Pässe liegen in `public/hand/` (HAND.md) | HAND | A6 |
| U7 | ASCII-Buttons zu groß, manches kleiner | Bühnenfaktor bis 1,8 (fehler §7.1), Flut-Zelle 32, Tiefe-Zeichen 45 px, Lader 176 px, CTAs 48 px | Fundament (Deckel), TEXT, SZENEN, SHELL | A7 |
| U8 | allgemein viele Fehler | alle übrigen F/V/T laut Tabelle 3.3 | alle | A8 |
| U0 | Design bleibt | — | alle | A0 |

Sichtprüfung des Hauptagenten (1800×987), Zuordnung: 1 Letterbox → U1/Fundament · 2 eingefrorener Hero-Frame → F-01, Fundament · 3 Flut-Blöcke über Raumtexten, zu grob → T-01, TEXT · 4 Geisterduplikat → T-02, TEXT · 5 Körper/Tiefe nur Schwarz → F-01 + T-12 + T-10/F-13, Fundament + SZENEN (kein Init-Fehler, Planet rendert) · 6 generische Handy-UI → APP · 7 erfundene Installation, halb leerer Mock → INSTALL · 8 ASCII/Mono zu groß → Größen-Tabelle 2.6.

---

## 1. Entscheidungen (Annahme je Punkt in einem Satz)

1. **Architektur:** Dokument-Scroll statt skalierter 1280×800-Bühne. Szenen mit Zeitachse sind Sticky-Bühnen in voller Fenstergröße, Canvases rendern in echter CSS-Größe × Pixelfaktor. Annahme: Nur so gibt es Vollbild ohne Balken, scharfe Retina-Ausgabe, funktionierenden Browser-Zoom und stabile Positionen bei Drehen und Zurück.
2. **Komposition:** Hintergründe (Berg, Flut, ASCII-Feld, Sterne, Staub) füllen immer die ganze Fläche. Komponierte Objekte (Wohnung, Handy, Hand, Körper, Planet, Tiefe-Wörter) werden standardmäßig aus ihrem bisherigen 1280×800-Raum per „contain“ eingepasst, Deckel ×1,25, zentriert im sichtbaren Bereich. Für Hochformat legt jedes Paket eigene Bezugsboxen fest. Annahme: Bei 1280×800 bleibt die Seite damit pixelgleich, und auf großen Schirmen wächst nichts mehr übermäßig.
3. **Text:** DOM-Text in CSS-px über Tokens mit `clamp()`. Bei 1280×800 gilt der Designwert, Wachstum höchstens ×1,15, Untergrenzen für Hochformat. Annahme: „zu groß“ kam zum großen Teil vom Bühnenfaktor (k bis 1,8).
4. **Zeitachse:** Intro-Strecke 10 statt 8 Bildschirmhöhen. Nur das Wohnungsfenster (vier Raumkarten) und die Ruhezeit der Ende-Szene werden langsamer, alle anderen P-Marken bleiben (Abschnitt 2.4). Annahme: Die Karten waren nur 0,29 Bildschirme voll lesbar (T-04), und die echte App im Handy braucht Zeit zum Ausprobieren.
5. **App im Handy:** gleich-originiges `<iframe>` auf ein statisches Demo-Dokument `public/app-demo/index.html`, gebaut aus den Standalone-HTML von `design/app-ref` (echtes DOM und CSS), dazu ein kleines Zustandsskript. Für `/app-demo/*` gilt `X-Frame-Options: SAMEORIGIN`. Annahme: Das ist pixelgenau (REF §12: ≤ 0,03 %), und Shadow-DOM scheitert an `rem`, `position:fixed`, `svh`, `@property` und `@font-face` der App.
6. **Farben im Handy:** Die App zeigt ihre echten Farben (Avatar-Tönung, Grün bei „bekommst du“). Die Installations-Dialoge zeigen die echten Systemfarben (iOS-Blau, Schalter-Grün, Material-Farben). Der Rest der Seite bleibt Schwarz/Weiß. Annahme: „genau unsere App“ und „echte Animation“ gehen hier vor dem Monochrom, das nur außerhalb der Gerätebildschirme gilt.
7. **Installation:** iPhone = iOS 27 Safari im Layout „Kompakt“ (5 Tipps), Android = Chrome ≥ 150 mit Adressleiste oben (Standard) und Menüeinträgen nach Chromium 157, Rechner = Chrome 154 auf macOS. Zeitgesteuerte Schleife, solange der Abschnitt sichtbar ist, und die Schrittliste ist klickbar. Annahme: Das sind die belegten Standardwege (INSTALL-FLOWS §6).
8. **Hand:** Beide Hände aus den Blender-Pässen in `public/hand/` als Halbton im WebGL2-Fragment-Shader. Fingerkuppen der Haltehand ragen höchstens 48 Bühnen-px über den rechten Handyrand (gemessen ab Außenkante x 950), das Design hat 28. Bei Bedarf wird die Pose neu gerendert. Annahme: Die heutigen 100 px verdecken Beträge und Chevrons der echten App, und Lesbarkeit hat Vorrang.
9. **Flut:** Zelle 16 CSS-px fest, Ziffer 10–11 px, Rauschen im Pixelraum (Form bleibt). Löcher kommen aus echten DOM-Rechtecken (Logo, CTA, Raumtext-Spalte, Hinweis). Annahme: Empfehlung fehler §7.4 und T-01.
10. **Kopf:** bleibt wie im Design, also während der Ende-Szene verdeckt (T-14 Option 1). Nach der Intro bekommt er einen Schleier statt Text auf Text. Annahme: Das entspricht dem Design und behebt T-06.
11. **Lader:** an echte Bereitschaft gebunden (erstes Hero-Bild und Schriften), mindestens 0,8 s, höchstens 4 s. Bei Zurück, Neuladen und erneutem Besuch in derselben Sitzung entfällt er. Die Ziffer misst höchstens 140 px. Annahme: Empfehlung F-10, Größe aus fehler §7.3.
12. **Ankersprünge:** Über mehr als 3 Bildschirmhöhen wird sofort gesprungen, mit 160 ms Überblendung über `#0A0A0A`. Kürzere Sprünge laufen weich, bei `reduce` immer sofort. Annahme: Das verhindert das „Spulen“ mit Weiß-Blitz (F-16).
13. **Reduced Motion:** Eigenbewegung aus (Autopiloten, Drift, Idle), scrollgetriebene Übergänge bleiben, Flut-Deckung ≤ 0,6. Annahme: Empfehlung F-08.
14. **Scrollleiste:** `scrollbar-width: thin` mit `rgba(250,250,250,0.28)` statt ausgeblendet. Annahme: Eine 20 Bildschirme lange Seite braucht eine greifbare Leiste, unter macOS ist sie ohnehin eine Überlagerung (F-19).
15. **Textkorrekturen (echte Fehler):**
    - FAQ 1 lautet „Wie kommen meine Mitbewohner in die WG?“ statt „… dazu?“.
    - Die Impressum-Anschrift schreibt „Straße“.
    - Das Datum steht als „19.05.2026“.
    - Die Fußzeile verlinkt „AGB“.
    - Die 404-Seite zeigt kein Emoji.
    - Alle anderen Texte des Entwurfs bleiben unverändert.
16. **Keine neuen Abhängigkeiten**, kein Lenis, nativer Scroll. Toter Code (`tone` außer als Fallback ohne WebGL, `topo`, `mosaic`, `mesh`, `press`, `fluid`, `score`, `ticker`, `snow`, Phone-Modus von `physics`, `fine`, `asc`, `tour`, das leere Sternbild) wird beim Dateischnitt nicht mitgenommen. Nichts davon ist im Design sichtbar.

---

## 2. Zielarchitektur

### 2.1 Seitenaufbau

```
<div id="final" data-mode="quer|hoch" data-flach? data-phase="intro|ende|nach">   CSS-Variablen hier
  <Kopf/>        position:fixed, oben, Safe-Area           (shell/Kopf.tsx)
  <Hinweise/>    position:fixed, unten, Safe-Area          (shell/Hinweise.tsx)
  <main id="inhalt">  normaler Dokumentfluss, keine overflow-Sperre
    <section id="intro">  Höhe (1 + INTRO_SCREENS) × 100lvh
      <div data-buehne="intro"> position:sticky; top:0; height:100lvh; overflow:hidden
        canvas[data-intro=hero] · canvas[data-intro=wohnung] · canvas[data-intro=flut]
        <div data-safe> absolute, top 0, Höhe 100svh: <HeroTitel/> <Raeume/>
        <Ende/>   eigene Ebene (inset 0) mit [data-ende-space], Hand-Canvases, Titel, CTA
    <FlutBand/> <SoGehts/> <Koerper/> <Tiefe/> (Sticky 100lvh in 4,5 × 100lvh) <Bereiche/> <Installieren/> <Fragen/> <Finale/> <Fusszeile/>
  </main>
  <Lader/>       position:fixed, inset 0, oberste Ebene
</div>
```

- Kein Scroll-Container, kein `[data-sizer]`, kein Zwei-Wege-Abgleich, kein `--k/--x/--y`, kein `transform: scale` mehr. Das Inline-Skript in `page.tsx` setzt nur noch die Klasse `js` und `data-mode` vor dem ersten Paint.
- Die Ende-Ebene liegt **in** der Sticky-Bühne und scrollt mit ihr natürlich weg. Die alte `translateY(-(scrollTop-6400))`-Rechnung entfällt und damit die Ursache von F-01, T-03 und V-15.
- Hintergründe nutzen `100lvh` (füllen auch bei eingeklappter Safari-Leiste). Text und Bedienelemente liegen im `100svh`-Kasten `[data-safe]` (nie unter der ausgeklappten Leiste). Desktop: lvh = svh = Fensterhöhe.
- Breiten nie mit `100vw` (Windows-Scrollleiste würde überlaufen), immer `100%`.
- Abschnittshöhen: Körper `95lvh` (min. 520 px), Bereiche `100lvh` (min. 560 px), Installieren `min-height:100lvh`, Finale `95lvh` (min. 560 px). Fragen, So geht’s, Fußzeile richten sich nach dem Inhalt. Bei 1280×800 ergibt das exakt die bisherigen Höhen (760, 800, 800, 760).

### 2.2 Modi

- `hoch`, wenn Breite/Höhe < 1 oder Breite < 700 px (Handy hoch, Tablet hoch), sonst `quer`. Zusatz `data-flach`, wenn quer und Höhe < 500 px (Handy quer).
- CSS: `@media (max-aspect-ratio: 1/1), (max-width: 699px)` = hoch; `@media (orientation: landscape) and (max-height: 499px)` = flach.
- Safe-Area: Kopf `top: max(Token, env(safe-area-inset-top) + 8px)`, Hinweise `bottom: max(Token, env(safe-area-inset-bottom) + 8px)`, seitlich `env(safe-area-inset-left/right)`.

### 2.3 Canvas und Szenenraum

- Jeder Canvas folgt per `ResizeObserver` seiner CSS-Box. Backing = `round(CSS × d)` mit `d = min(devicePixelRatio, Deckel)`. Deckel 2 auf Desktop. Auf Touch-Geräten 2 für kleine Canvases und 1,5 für vollflächige 2D-Felder (Flut, ASCII, Körper, Tiefe, Planet). Der Hero-Szenenpuffer bleibt adaptiv klein, der Ausgabe-Pass läuft in voller Auflösung.
- Szenenraum: Jede Szene nennt eine Bezugsbox `bw × bh` (Standard 1280×800, Körper und Finale 1280×760). Daraus folgen `f = min(W/bw, safeH/bh, 1,25)`, `ox = (W − bw·f)/2`, `oy = (safeH − bh·f)/2`.
  - `full()` setzt `setTransform(d,0,0,d,0,0)` für vollflächige Hintergründe.
  - `scene()` setzt `setTransform(d·f,0,0,d·f,d·ox,d·oy)` für die Komposition.
  - Zeiger kommen in Szenenkoordinaten an (`(clientX − rect.left − ox)/f`).
  - Raster, die die Fläche füllen (Flut, ASCII, Sterne, Staub, Körper-Wände), laufen über die ganze Fläche: im Szenenraum von `−ox/f` bis `(W − ox)/f`.
- Bei 1280×800 und DPR 1 gilt `f = 1`, `ox = oy = 0`. Alles ist identisch zum heutigen Stand, das ist das Regressions-Gate des Fundaments.
- Zeiger-Listener hängen an der ganzen Szenenfläche, nicht mehr an der Bühne (V-14).

### 2.4 Zeitachse

| Größe | bisher | neu |
|---|---|---|
| Intro-Strecke | 8 Bildschirmhöhen (6400 bei 800) | `INTRO_SCREENS = 10` |
| Fortschritt | `P = scrollTop / 6400` | `s = clamp((scrollY − introTop) / (10 · Bühnenhöhe))`, `P = warp(s)` |
| `warp` (s → P), stückweise linear | Identität | Knoten (0; 0) · (0,496; 0,62) · (0,856; 0,90) · (0,896; 0,95) · (1; 1) |
| P 0–0,62 (Berg … Flut 1) | 4,96 Bildschirme | 4,96 (unverändert) |
| P 0,62–0,90 (Wohnung, 4 Karten) | 2,24 | 3,6 (0,9 je Karte) |
| P 0,90–0,95 (Flut 2, Ende blendet ein) | 0,4 | 0,4 (unverändert) |
| P 0,95–1 (Ende ruht) | 0,4 | 1,04 |
| danach | Overlay per JS hochgeschoben (800) | Bühne scrollt natürlich weg (1 Bildschirm) |
| Tiefe | 3600 = 800 + 2800 | `4,5 × 100lvh` (Fahrt 3,5 Bildschirme) |

- Alle P-Marken der Szenen (`look`, `mx`, `split`, `zoom`, `dive`, `fpA`, `endA`, Flut-Deckung, Kartenkurve) bleiben in P definiert. Damit bleibt die Choreografie, nur das Tempo im Wohnungsfenster und in der Ruhe ändert sich.
- Wird an einem Knoten ein Tempoknick sichtbar, an den Knoten ±0,01 in s mit Smoothstep überblenden.
- Glättung: `sp` folgt `P` mit `1 − exp(−10·dt)`. Sofort übernehmen, wenn |P − sp| > 0,05 oder die Bühne nicht sichtbar ist.
- CSS-Variablen werden **jedes Bild** gesetzt, auch wenn nicht gezeichnet wird (billig). Gezeichnet wird nur, solange die Bühne sichtbar ist.
- Das Fundament baut die Zeitachse zuerst mit `INTRO_SCREENS = 8` und Identität (Regressions-Gate) und schaltet erst in Schritt 4 um.

### 2.5 Schleife

- Eine einzige `requestAnimationFrame`-Schleife (`core/loop.js`), `dt = min(0,05 s, Δ)`, Pause bei `document.hidden`.
- Reihenfolge je Bild: Scroll-Zustand → Intro-Bühne (Variablen, Teilrenderer) → sichtbare Szenen. Jede sichtbare Szene zeichnet **jedes** Bild (kein `fa % 2` mehr).
- Simulationen (Körper, Ziffern-Federn, Planeten-Trägheit, Spaziergänger) laufen mit festem Schritt 1/60 s und Akkumulator (höchstens 4 Schritte je Bild). Glättungen haben die Form `1 − exp(−k·dt)`, Zähler `+= dt`.
- Konstanten so umrechnen, dass sich jede Szene bei 120 Hz genau wie heute verhält. Hero-Konstanten waren auf 120 Bilder/s, Art-Konstanten auf 60 Bilder/s gestimmt (jeder zweite Tick). Ergebnis: gleiches Tempo bei 60, 120 und 144 Hz (F-06).
- `reduced` folgt live `matchMedia('(prefers-reduced-motion: reduce)')`.

### 2.6 Tokens und Größen

**2.6.1 Typo- und Abstands-Tokens** (`landing.css`, `:root`). Regel für einen Designwert d: `clamp(MIN, min(d/12,8 · 1vw, d/8 · 1svh), MAX)`. Bei 1280×800 ergibt das genau d, `MAX` ≈ d × 1,1…1,15.

| Token | Design | Wert |
|---|---|---|
| `--t-label` | 12 | `12px` fest, `letter-spacing: 0.08em`, Deckkraft 0,72 |
| `--t-13`, `--t-14` | 13, 14 | fest |
| `--t-body` | 16 | `clamp(15px, min(1.25vw, 2svh), 17.5px)` |
| `--t-17` | 17 | `clamp(15px, min(1.328vw, 2.125svh), 18.5px)` |
| `--t-18` | 18 | `clamp(16px, min(1.406vw, 2.25svh), 19.5px)` |
| `--t-19` | 19 | `clamp(16px, min(1.484vw, 2.375svh), 20.5px)` |
| `--t-20` | 20 | `clamp(17px, min(1.5625vw, 2.5svh), 21px)` |
| `--t-26` | 26 | `clamp(20px, min(2.031vw, 3.25svh), 28px)` |
| `--t-30` | 30 | `clamp(24px, min(2.344vw, 3.75svh), 33px)` |
| `--t-32` | 32 | `clamp(24px, min(2.5vw, 4svh), 35px)` |
| `--t-40` | 40 | `clamp(28px, min(3.125vw, 5svh), 44px)` |
| `--t-44` | 44 | `clamp(28px, min(3.4375vw, 5.5svh), 48px)` |
| `--t-64` | 64 | `clamp(38px, min(5vw, 8svh), 72px)` |
| `--t-72` | 72 | `clamp(40px, min(5.625vw, 9svh), 80px)` |
| `--t-80` | 80 | `clamp(46px, min(6.25vw, 10svh), 88px)` |
| `--t-96` | 96 | `clamp(54px, min(7.5vw, 12svh), 104px)` |
| `--t-176` | 176 | `clamp(96px, min(13.75vw, 22svh), 176px)` (SHELL senkt auf ≤ 140) |
| `--t-200` | 200 | `clamp(80px, min(15.625vw, 25svh), 216px)` |
| `--rand` | 40 | `clamp(20px, min(3.125vw, 5svh), 48px)` |
| `--rand-kopf` | 28 | `clamp(16px, min(2.1875vw, 3.5svh), 32px)` |
| `--abschnitt-oben` / `--abschnitt-unten` | 96 / 120 | nach Regel, MIN 56 / 64 |
| `--cta-h`, `--cta-fs`, `--cta-px`, `--cta-r` | 40, 14, 16, 10 | fest |
| `--cta-gross-h`, `--cta-gross-fs`, `--cta-gross-px` | 48, 16, 24 | fest, SHELL setzt 44, 15, 22 |
| `--haar` | rgba(250,250,250,0.18) | fest |

Alle übrigen px-Werte im DOM (Abstände, Breiten wie 440, 520, 380, 420, 640) nach derselben Regel mit MIN = d × 0,5. Breiten zusätzlich `max-width: 100%`. Überschriften `overflow-wrap: break-word`, damit nichts überläuft.

**2.6.2 Größen-Tabelle ASCII/Mono und Bedienelemente** (Zielwerte nach allen Paketen, gemessen in CSS-px auf dem Bildschirm):

| Element | heute | Ziel | Paket |
|---|---|---|---|
| Flut-Zelle (Hero-Flut und Flut-Band) | 32 Bühnen-px (bis 58 px) | 16 px fest | TEXT |
| Flut-Ziffer | 10 px, α 0,6 | 10–11 px, α 0,6–0,72 | TEXT |
| So-geht’s-Ziffern 01–03 | Zelle 8, Glyph 10, Glyphenrauschen | Zelle 6, Glyph 8, feste 3-Ton-Rampe | TEXT |
| Finale-ASCII | Zelle 9×14, Glyph 12 | bleibt, in CSS-px fest, Glyphen-Atlas | TEXT |
| Tiefe-Nahzeichen | bis 45 px | ≤ 32 px, darüber Punkte | SZENEN |
| Planeten-Marker / -Label | 10 / 11 px, Treffer r 26 | bleibt, Treffer ≥ 44 px | SZENEN |
| Körper-Namensplatten | 11 px, Platte 18 px voll schwarz | 10 px, Platte α 0,7 | SZENEN |
| Lader-Ziffer | 176 px | ≤ 140 px | SHELL |
| Mono-Labels | 12 px / 0,08 em | 12 px fest | Fundament (Token) |
| Hinweise | 12 px, Treffer 20 px hoch | 12 px, Treffer ≥ 44 px | SHELL |
| FAQ-Marke + − | 26 px | 20–22 px | SHELL |
| Beträge auf der Seite | 12/13/15 gemischt | 14 px | TEXT (Raumkarten), SZENEN (Planet-Karte) |
| CTA klein (Kopf) | 40 / 14 | 40 / 14, Treffer 44 | SHELL (Token) |
| CTA groß (Ende, Finale, Installieren) | 48 / 16 | 44 / 15, Treffer 44 | SHELL (Token) |
| Install-Tabs | 40 / 14 | 40 / 14, Treffer 44 | INSTALL |
| Wachstum auf großen Schirmen | k bis 1,8 | Text ≤ ×1,15, Kompositionen ≤ ×1,25 | Fundament |

### 2.7 Klassen-Vertrag

Das Fundament vergibt beim Dateischnitt diese Klassen. Pakete behalten sie, SHELL gestaltet Hover, Fokus und Aktiv-Zustände zentral in `landing.css`:
- `.cta` (Grundform: Höhe `--cta-h`, Schrift `--cta-fs`, Trefferfläche ≥ 44 px über Pseudo-Element), `.cta--voll` (weiß gefüllt), `.cta--rand` (Rand α 0,6), `.cta--dunkel` (Rand α 0,3 auf `#0A0A0A`), `.cta--gross`.
- `.label` (Mono-Label), `.haar` (Haarlinie), `.tab` (Install-Tabs), `.faq-zeile`, `.fuss-link`.

---

## 3. Dateischnitt und Besitz

### 3.1 Zielbaum `src/components/landing/`

| Datei | Inhalt | Besitzer nach dem Fundament |
|---|---|---|
| `Landing.tsx` | Wurzel, Reihenfolge der Szenen, feste Ebenen, Start von Schleife und Scroll | Fundament, eingefroren |
| `landing.css` | Tokens 2.6, Modi, Klassen 2.7 | SHELL |
| `core/dc.tsx` | `css()`, `Dc`, `press()` (aus `dc.tsx`) | Fundament, eingefroren |
| `core/math.js` | `cl, ss, lerp, ease, hsh, vnz, smn, uc, cap`, Bayer, Zeichen-Geometrie `AB`, `a_mark`, `HOME/HOME3` | Fundament, eingefroren |
| `core/scroll.js` | Abschnittsmaße, Fortschritt je Abschnitt, Anker bei Größenwechsel, Sprunglinks (Entscheidung 12) | Fundament, eingefroren |
| `core/loop.js` | rAF-Schleife, dt, Sichtbarkeit, `reduced`, Szenen-Register, Touch-Besitz | Fundament, eingefroren |
| `core/canvas.js` | Canvas an CSS-Box koppeln, DPR-Deckel, `fit()`, `full()`, `scene()`, Zeigerumrechnung | Fundament, eingefroren |
| `scenes/intro/Intro.tsx` | Sticky-Bühne mit Ebenen | Fundament, eingefroren |
| `scenes/intro/stage.js` | s → P, CSS-Variablen, `data-phase`, `[data-cta]`-Schalter, Aufruf der Teilrenderer | Fundament, eingefroren |
| `scenes/intro/zeitachse.js` | `INTRO_SCREENS`, `warp()` | Fundament, eingefroren |
| `scenes/intro/hero.js` | WebGL Berg, Zeichen, Organ, Tauchgang, Fallback ohne WebGL2 (`tone`) | Fundament, eingefroren |
| `scenes/intro/HeroTitel.tsx`, `scenes/intro/sterne.js` | Hero-Titel, Sterne | TEXT |
| `scenes/intro/Raeume.tsx` | vier Raumkarten | TEXT |
| `scenes/intro/wohnung.js` | Iso-Wohnung (`drawC`) und `karten(P)` | TEXT |
| `scenes/intro/flut.js` | Flut-Raster, `deckung(P)` | TEXT |
| `scenes/ende/Ende.tsx`, `scenes/ende/kamera.js`, `scenes/ende/hand.js` | Ende-Ebene, Kamera, Hände | HAND |
| `scenes/ende/Phone.tsx` (+ `Phone.module.css`) | Gerät mit Statusleiste und App-Bildschirm | APP |
| `scenes/flutband/FlutBand.tsx` | Flut-Band nach der Intro | TEXT |
| `scenes/sogehts/SoGehts.tsx`, `scenes/sogehts/ziffern.js` | So geht’s mit `ptext`-Ziffern | TEXT |
| `scenes/koerper/Koerper.tsx`, `scenes/koerper/koerper.js` | acht Körper (`physics`) | SZENEN |
| `scenes/tiefe/Tiefe.tsx`, `scenes/tiefe/tiefe.js` | Tiefe (`depth`) | SZENEN |
| `scenes/bereiche/Bereiche.tsx`, `scenes/bereiche/planet.js`, `scenes/bereiche/orte.js` | Planet, acht Orte (bisher `Logic.PL`) | SZENEN |
| `scenes/installieren/Installieren.tsx`, `scenes/installieren/ablauf.js` | Installieren | INSTALL |
| `scenes/fragen/Fragen.tsx` | Fragen | SHELL |
| `scenes/finale/Finale.tsx`, `scenes/finale/ascii.js` | Finale mit ASCII-Sonne | TEXT |
| `scenes/fusszeile/Fusszeile.tsx` | Fußzeile | SHELL |
| `shell/Kopf.tsx`, `shell/Hinweise.tsx`, `shell/Lader.tsx` | feste Ebenen | SHELL |

Gelöscht werden `sections.tsx`, `overlays.tsx`, `dc.tsx`, `engine/*`. Der Zustand von `engine/logic.js` wandert in die Komponenten (FAQ, Install-Tab, Planet-Auswahl, Handy-Zustand). Pro Szene ist ein `*.module.css` erlaubt, es gehört dem Besitzer der Szene.

Weitere Dateien:
- `src/app/page.tsx`, `src/app/layout.tsx`, `tools/pixel.mjs`, `tools/qa/*`, `biome.json`: Fundament, eingefroren. Pakete dürfen eigene Skripte unter `tools/qa/<paket>/` anlegen.
- `src/app/globals.css`, `src/app/impressum|datenschutz|agb/page.tsx`, `src/app/not-found.tsx`, `next.config.ts` (nur Cache-Header): SHELL.
- `public/app-demo/**`, neue Aufnahmen in `design/app-ref/**`: APP.
- `public/install/**`: INSTALL.
- `public/hand/**`, `design/HAND.md`, `/Users/abu/Company/archiv/hand/**`: HAND.
- `design/PLAN-V2.md`: nur das Fundament trägt hier Abweichungen von Abschnitt 4 nach. Pakete melden Bedarf im Bericht.

### 3.2 Regel für gemeinsame Dateien

Eingefrorene Dateien ändert nach dem Fundament kein Paket. Braucht ein Paket dort eine Änderung, löst es das in den eigenen Dateien oder meldet es im Abschlussbericht. Die Integration erledigt das. Keine neuen Abhängigkeiten, `package.json` und `pnpm-lock.yaml` bleiben unverändert.

### 3.3 Fund → Besitzer

| Fund | Besitzer |
|---|---|
| V-01, V-02, V-03, V-07, V-08, V-09, V-10, V-14, V-15 | Fundament |
| V-05, V-06, V-13 | Fundament (Tokens, Grundlayout hoch), jedes Paket für seine Szenen |
| V-04, V-12, V-16 | SHELL (V-12 Grundlage: Fundament) |
| V-11 | SZENEN |
| T-01, T-02, T-09, T-15, Finale-Teil von T-06 | TEXT |
| T-03, T-04 (Zeitachse), T-08 (Grundlage), T-10 (Untertitel-Plateau, Mindesthelligkeit), T-12, T-13 | Fundament |
| T-05, T-17 | HAND |
| T-06, T-07, T-14 | SHELL |
| T-10 (Tunnel, Dichte), F-13 | SZENEN |
| T-11, F-15, F-18.1 | INSTALL |
| T-16 | APP und INSTALL |
| F-01, F-02, F-06, F-07, F-12, F-16, F-18.4 (Überschriften), F-18.5, F-18.6, F-18.7 | Fundament |
| F-03, F-18.3 | HAND |
| F-04 | Fundament (DOM-Reihenfolge), SHELL (Fokus, Skip-Link, FAQ), INSTALL (Tablist), SZENEN (Ortsliste) |
| F-05 | SZENEN |
| F-08 | Fundament (Flag), alle Pakete (ihre Szenen), SHELL (globale Übergänge) |
| F-09 | Fundament (Position), SHELL (Lader) |
| F-10, F-14, F-17, F-18.2, F-18.8, F-19, F-20 | SHELL |
| F-11 | APP |
| F-18.9 | TEXT |

---

## 4. Schnittstellen (Verträge)

### 4.1 Intro-Bühne

`stage.js` baut je Bild den Kontext `c` und ruft die Teilrenderer auf:

```js
c = { P, s, t, dt, now, W, H, safeH, dpr, mode, reduced,
      fit: { f, ox, oy },                    // Standard-Einpassung der Box 1280×800 (contain, f ≤ 1,25, im sicheren Kasten zentriert)
      m: { x, y, in, down, type, clickT },   // Zeiger in Bühnen-CSS-px
      fpA, endA, endOn, cover, stageTop, visible }
wohnung.karten(P)            -> [c0, c1, c2, c3]          // TEXT
wohnung.draw(canvas, c)                                    // TEXT, 2D, eigener Kontext
flut.deckung(P)              -> 0..1                       // TEXT, ergibt c.cover
flut.draw(canvas, c, loecher)                              // TEXT; loecher = [{x,y,w,h,art}] in Bühnen-CSS-px
                                                           //   aus [data-loch="logo|cta|text|hinweis"]
kamera(W, H, safeH, mode)    -> { f, ox, oy }              // HAND; Ende-Raum 1280×800 → Bühne
hand.laden()                 -> Promise                     // HAND; stage ruft es ab P > 0,75
hand.draw(back, front, c, cam)                              // HAND; back/front sind die Canvas-Elemente
```

Teilrenderer bekommen Canvas-Elemente, keine Kontexte. Jeder Besitzer wählt selbst 2D oder WebGL2. Das Backing hält stage.js auf CSS × `c.dpr`. `c.fit` ist nur der Vorschlag, jeder Teilrenderer darf für Hochformat eine eigene Box rechnen. Das Fundament liefert lauffähige Erstfassungen: die heutigen Funktionen, an den Szenenraum angepasst, bei 1280×800 identisch.

### 4.2 CSS-Variablen und Attribute an `#final`

`--p`, `--g`, `--f`, `--e`, `--c0..3` (wie bisher), `--kopf-aus` (1, solange die Ende-Ebene den Kopfbereich deckt: `endA` × [Unterkante der Bühne > Unterkante des Kopfs]). Dazu `data-phase` (`intro` P < 0,9, `ende` ab P 0,9 bei sichtbarer Bühne, `nach`, wenn die Bühne oben aus dem Bild ist), `data-mode`, `data-flach`. Ereignis `landing:bereit` (CustomEvent am `document`) nach dem ersten gezeichneten Hero-Bild bzw. nach dem Fallback ohne WebGL2.

### 4.3 Szenen-Register (`core/loop.js`)

```js
const weg = register({
  el,                                   // HTMLCanvasElement
  box(W, H, safeH, mode) { return { bw: 1280, bh: 800, align: 'center' } },
  dprCap: 2,
  init(s) {}, frame(s, t, dt) {}, resize(s) {},
  ownsTouch(s, e) { return false },     // true = Geste gehört der Szene (preventDefault)
  onDown(s) {}, onMove(s) {}, onUp(s) {},
});
// s = { cv, ctx, W, H, safeH, dpr, f, ox, oy, mode, reduced, m: { x, y, in, down, type }, full(), scene(), step(dt, h, fn) }
```

Jede Szene registriert sich im `useEffect` ihrer Komponente und meldet sich beim Abbau ab. `Landing.tsx` kennt keine Szeneninterna.

### 4.4 Ende-Raum, Handy, Zeiger

- `Ende.tsx` (HAND) enthält `[data-ende-space]`: ein 1280×800 großes `div` mit `transform: translate(var(--ende-x), var(--ende-y)) scale(var(--ende-f))`. Die Werte kommen aus `kamera()` bei jeder Größenänderung, dieselbe Funktion nutzt `hand.draw`.
- `Phone.tsx` (APP) liegt darin unverändert an `left:650px; top:90px; width:300px; height:620px`. Der Bildschirm sitzt bei Inset 11, Radius 37 (= 661/101/278/598 im Raum, wie `hold.json` `screen`). Die Wurzel von `Phone` trägt `data-cta` (stage.js schaltet `inert` und `pointer-events` wie heute).
- Zeiger aus dem iframe: Das Demo-Dokument schickt `pointermove`, `pointerdown`, `pointerup` und `pointerleave` als `PointerEvent` (bubbles) an `window.frameElement`. Die Koordinaten sind in Eltern-Client-Koordinaten umgerechnet, so kommen sie an `[data-buehne="intro"]` an. Rad und Wisch über dem Handy scrollen die Seite. Ist das nicht von selbst so, leitet das Demo-Dokument `wheel` per `parent.scrollBy` weiter.
- Cursor-Steuerung der Ende-Szene liegt bei HAND (stage.js setzt keinen Cursor mehr).

### 4.5 Anker und Abschnitte

- Ids: `#intro`, `#so-gehts`, `#koerper`, `#funktionen` (Tiefe), `#bereiche`, `#installieren`, `#fragen`, `#finale`, `#fusszeile`. Jeder Abschnitt trägt zusätzlich `data-sec` (für QA).
- Ankerziele erhalten `scroll-margin-top` passend zur Kopfhöhe (ersetzt die festen −110).
- Sprungpolitik nach Entscheidung 12 in `core/scroll.js`.
- Größenwechsel und Drehen: vorher Abschnitt und Fortschritt merken, nach dem Layout dieselbe Stelle setzen. Nur eingreifen, wenn sich die Abschnittsmaße geändert haben (die iOS-Leiste ändert `lvh` nicht).
- Zurück und Neuladen: native Wiederherstellung (`history.scrollRestoration = 'auto'`). Die Höhen stehen ohne JavaScript fest, der erste Frame nimmt P ungeglättet.

### 4.6 QA-Haken

Mit `?qa=1`: `window.__landing = { P(), s(), phase(), yForP(P), section(id) → { top, height }, bereit }`. Nur lesend, ohne Einfluss auf das Verhalten.

---

## 5. Fundament (seriell, zuerst)

Ein Agent, Arbeitsverzeichnis `landing-produktion` (Haupt-Checkout oder eigener Worktree), Port **3120**, Scratchpad `v2-fundament/`.

- **Schritt 0, Vorbereitung:**
  - Basis enthält den Commit dieses Plans.
  - `.gitignore` bekommt `/.next-*/`, `biome.json` ignoriert `src/components/landing/**/*.js` statt `engine/**`.
  - Im Haupt-Checkout (dort läuft :3100 als Next-Server) nur mit `NEXT_DIST_DIR=.next-fundament` bauen und danach `tsconfig.json` und `next-env.d.ts` per `git checkout --` zurücksetzen. Im Worktree genügt `pnpm build && pnpm exec next start -p 3120`.
- **Schritt 1, Kern und Dateischnitt:**
  - `core/*`, Zielbaum 3.1, Dokument-Scroll, Sticky-Bühnen, feste Ebenen in der DOM-Reihenfolge Kopf, Hinweise, `main`.
  - Canvas-Kopplung mit Szenenraum (2.3), Szenen-Register (4.3), Schnittstellen 4.1, 4.2, 4.4, 4.5, 4.6.
  - Toter Code entfällt.
  - Zeitachse noch `INTRO_SCREENS = 8` mit Identität.
  - Klassen 2.7 vergeben, Überschriften-Hierarchie: ein `h1`, `h2` je Abschnittstitel, Mono-Labels als `p`/`span`.
  - XFO-Ausnahme `/app-demo/:path*` in `next.config.ts` (nach der globalen Regel, damit sie überschreibt).
- **Schritt 2, QA-Werkzeuge:**
  - `tools/qa/` aus den Audit-Skripten übertragen: `lib.mjs` (Start mit Metal, Viewports, `wheelTo`, `touchTo`, `toMark`, `shot`, `sheet`, Konsolenwächter), `sheet.mjs`, `check.mjs`, `jump.mjs`, `resize.mjs`, `hz.mjs`, `fps.mjs`, `nogl.mjs`.
  - `tools/pixel.mjs` an den Dokument-Scroll anpassen (Port-Seite ohne `[data-root]`/`[data-scroller]`).
  - Gate A: `pixel.mjs` gegen die Referenz `http://localhost:4191/final.html` bei 1280×800 ≤ 0,10 % an allen 27 Messpunkten, Textgeometrie ≤ 0,5 px.
  - Einzige Ausnahme: Messpunkt 6000 im Kopfstreifen (oberste 80 px). Der Kopf liegt jetzt fest über der Bühne und wird per `--kopf-aus` ausgeblendet, statt unter der halb deckenden Ende-Ebene zu liegen. Dort wird nur der Rest des Bildes gewertet.
- **Schritt 3, Vollbild:**
  - Tokens 2.6.1, Modi 2.2, Safe-Area, Grundlayout `hoch` für jede Szene (Spalten stapeln, nichts läuft über), Vollflächigkeit aller Hintergründe, Hero-Shader im Hochformat so gerahmt, dass Sonne und Zeichen im Bild bleiben.
  - Gate A gilt weiter, dazu `check.mjs` bei allen Viewports.
- **Schritt 4, globale Fehler:**
  - Zeitachse 2.4 einschalten, Sprung- und Parkfestigkeit (F-01), Anker bei Größenwechsel, Sprungpolitik (F-16).
  - F-02: Lader endet spätestens nach 4 s, `tone`-Fallback.
  - F-06: dt und fester Schritt. F-07: Ausreißer > 0,25 s ignorieren, Absenken nur bei gleitendem Mittel über 15 Bilder, Erholung ×1,06.
  - Körper: Einfall erst bei ≥ 70 % Sichtbarkeit, davor Ruhering (T-12). Tiefe: Untertitel-Plateau `cl((5 − |dz − 9|)/1,5)`, Wort-Mindesthelligkeit 0,45 (T-10).
  - `--kopf-aus`, `data-phase`.
- **Schritt 5, Endprüfung:** Kontaktbögen aller Marken (Abschnitt 11) in 6 Viewports ansehen, Verträge prüfen, Abweichungen hier in Abschnitt 4 nachtragen, Bericht.

Abnahme Fundament (alle messbar):
1. typecheck, lint, build grün, 0 Konsolenfehler und -warnungen.
2. Gate A (Schritt 2 und 3).
3. Kein Balken: Bei 1920×1080, 1440×900@2, 1280×800, 1024×768@2, 2560×1440, 1536×730@1,25, 768×1024@2 Touch, 390×844@3 Touch, 360×740@3 Touch und 844×390@3 Touch ist das Rechteck jeder sichtbaren Szenenfläche = Viewport ±1 px, und Berg (P 0) und Flut (P 0,56) haben am Rand keinen einfarbigen `#0A0A0A`-Streifen ≥ 4 px.
4. `scrollWidth == clientWidth`. Kein Textknoten und kein Bedienelement an einer Marke teilweise außerhalb `[0, Breite]`, DOM-Schrift ≥ 12 px (Labels) bzw. ≥ 15 px (Fließtext) bei allen Viewports.
5. Intro = 10 Bildschirmhöhen ±1 %, Tiefe-Fahrt 3,5 ±1 %, bei jedem Viewport.
6. `jump.mjs`:
   - Taste Ende aus P 0,5 / 0,8 / 0,97, vier Deep Links, erster Tab, Leertaste 8× im Abstand von 60 ms, Rad 6 000–36 000 px/s, Touch-Wisch 1 500–12 000 px/s.
   - Prüfgrößen danach: Ende-Ebene, Raumkarten, Hero-Titel und Hinweis unsichtbar und nicht bedienbar, `--e = 1`, `--c0..3 = 0`, `data-phase = nach`. Erwartet: 0 Fehlschläge.
7. `resize.mjs` (1440×900 → 1024×768 → 1920×1080, 390×844 ↔ 844×390, 844×390 → 844×340): Abschnitt und Fortschritt ±1 %.
8. Backing jedes Canvas = CSS × min(DPR, Deckel), Canvas-Text bei DPR 2 so scharf wie DOM-Text (Ausschnitt angesehen).
9. `nogl.mjs` (`--disable-3d-apis`): Lader ≤ 4 s weg, Fallback sichtbar, Wohnung, Flut und Texte laufen.
10. `hz.mjs`: Planet 0,150 ± 0,01 rad/s und Körper-Rückkehr 3,5 ± 0,3 s bei 60 und 120 Hz, Art-Szenen zeichnen jedes Bild.
11. Ruckler-Test (320 ms Blockade): Schärfeverlust ≤ 10 %, Erholung < 0,3 s.
12. Körper beim Eintritt als Ring unter dem Titel. Tiefe-Untertitel je ≥ 0,35 Bildschirmhöhen mit Deckkraft ≥ 0,9.
13. `fps.mjs`: keine Szene langsamer als vor dem Umbau (die Hand-Szene ausgenommen, sie ersetzt HAND), Berg ≥ 55 fps bei 1920×1080@2.
14. Zielbaum 3.1 vollständig, alte Dateien entfernt, Verträge 4.x exportiert.

---

## 6. Arbeitspakete (parallel in Worktrees)

Jedes Paket: Schritt 0 im Worktree (auf `landing-produktion` mit Fundament vorspulen, `pnpm install --frozen-lockfile --prefer-offline`), eigener Port, eigene Dateien laut 3.1, Abnahme und Prüfweg. Die vollständigen Aufträge stehen im Workflow. Hier der Kern:

| Paket | Port | Scratchpad | Kern |
|---|---|---|---|
| APP: echte App im Handy | 3121 (App 3241, Demo-Proxy 4241) | `v2-app/` | Demo-Dokument aus `design/app-ref`, iframe in `Phone.tsx`, Daten Mika/Lina/Jona/Lea, Abläufe A–D aus REF §9 plus Tabbar, SubNav, Kopf-Icons, Start-Zeilen, Ausgleichen. Fehlende Zustände per `design/app-ref/tools/capture.mjs` nachaufnehmen. Pixelvergleich ≤ 0,5 % gegen die Originale `scratchpad/app/shots/final/`. Bewegung nach REF §7, iOS-Statusleiste statt „100 %“ |
| INSTALL: echte Installation | 3122 | `v2-install/` | iPhone, Android und Rechner exakt nach INSTALL-FLOWS §2–4, §6, §8 (Beschriftungen wörtlich, gemessene Federn und Zeiten), echtes Icon, App-Inhalt aus app-ref-Bildern, Schrittliste synchron und klickbar, Tablist mit Pfeiltasten, Hochformat gestapelt, `reduce` als Standbilder |
| HAND: realistische Hand | 3123 | `v2-hand/` | Pässe `hold`/`point` als Halbton im WebGL2-Shader (Fallback statisch), Kamera quer/hoch (HAND.md §7), Fingerkuppen ≤ 48 px über den Handyrand (Pose ggf. neu rendern), ≥ 55 fps bei 1×, ≥ 30 fps bei 4×, ≤ 4 ms Hauptthread, T-05, T-17, Autopilot x 780–860 / y 330–470, Touch, `reduce` |
| TEXT: Lesbarkeit, Flut, ASCII | 3124 | `v2-text/` | T-01 (Löcher aus DOM, Rand 64), T-02 (Kurve, Blur 3, Versatz 16), T-09, T-15, Flut 16/10 im Pixelraum, Flut-Band füllt die Breite, So-geht’s-Ziffern 6/8, Finale (Atlas, Titel unter dem Kopf, Hochformat), Hochformat von Wohnung, Raumkarten, Hero-Titel, Messkette A/B/C nach `tools/qa/text/` |
| SZENEN: Körper, Tiefe, Planet | 3125 | `v2-szenen/` | Hochformat-Kompositionen, Körper (Greifen auf Touch, Platten 10 px α 0,7), Tiefe (Nahzeichen ≤ 32 px, F-13 ≥ 2 % helle Pixel, Tunnel-Vorblende), Planet (F-05 komplett, `touch-action: pan-y`, Ortsliste als Buttons, Trägheit 0,03), `reduce` |
| SHELL: Hülle, Zugänglichkeit, Nebenseiten | 3126 | `v2-shell/` | Kopf (T-06 Schleier, Kontrast, Safe-Area, T-14), Hinweise (T-07, Treffer 44, `aria-label`), Lader (F-10, ≤ 140 px), Fragen (F-14, Text F-20), Fußzeile (F-17, AGB, Treffer 44), Tokens CTA 44/15, Hover, Fokus und Auswahl (F-19), Scrollleiste, Rechtsseiten (V-16, „Straße“, Datum), 404 ohne Emoji, Cache-Header `public/*` (F-18.8), Tab-Reihenfolge (F-04) |

---

## 7. Gemeinsame Regeln und Prüfweg

- **Server:** `pnpm build && pnpm exec next start -p <Port>` (kein dev).
  - Belegt und nie beenden: 3100 (Next aus dem Haupt-Checkout), 3110 (älterer Next-Server), 3111–3113 (agentmemory), 4190, 4191 (Referenz `site-1zu1`).
  - Eigene Server am Ende beenden.
- **Browser:** Playwright über `createRequire('/Users/abu/Company/manawg-app/apps/web/package.json')('@playwright/test')`, `chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']})`.
  - Renderer prüfen (`ANGLE Metal Renderer: Apple M3 Pro`).
  - Nur `tools/pixel.mjs` nutzt bewusst SwiftShader, weil es deterministisch gegen die Referenz vergleicht.
  - WebKit-Smoke über einen Proxy, der die CSP entfernt (`scratchpad/fehler/v3/proxy3.mjs`), weil `upgrade-insecure-requests` lokales http bricht.
- **Scrollen:** realistisch.
  - Desktop: `page.mouse.wheel` mit 60–120 px je Schritt und 30–60 ms Pause.
  - Touch: CDP `Input.synthesizeScrollGesture` mit 150–250 px je Wisch.
  - Keine `scrollTo`-Sprünge außer in ausdrücklichen Sprungtests.
- **Viewports:** Desktop 1920×1080@1, 1440×900@2, 1280×800@1, 2560×1440@1, 1536×730@1,25, 1024×768@2. Touch 390×844@3, 360×740@3, 768×1024@2, 844×390@3.
- **Bilder:** selbst ansehen (Read auf PNG/JPG). Ablage nur unter `/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/v2-<kürzel>/`, nie ins Repo.
- **fps-Messungen** unter paralleler Agentenlast sind Untergrenzen. Endgültige fps misst die Integration.
- **Git:**
  - Nur lokal committen, jede Datei einzeln per `git add <pfad>`, Commit-Texte auf Deutsch.
  - Nirgends Claude-, KI- oder Co-Author-Hinweise. Kein Push, kein PR, kein Deploy.
  - `site/`, `site-1zu1/` und der Quellcode von `/Users/abu/Company/manawg-app` bleiben unverändert, die App darf nur gestartet werden.
- **Texte:** Alle sichtbaren Texte Deutsch mit korrekten Umlauten.

---

## 8. Abnahme für das Ganze (je Nutzerpunkt)

**A0 Design bleibt**
- A0.1 Alle 13 Szenen in der Reihenfolge des Entwurfs vorhanden, alle Texte des Entwurfs wörtlich außer Entscheidung 15, Schwarz/Weiß außerhalb der Gerätebildschirme.
- A0.2 Gate A des Fundaments war vor Schritt 4 grün (Beleg im Fundament-Bericht).

**A1 Vollbild, nichts abgeschnitten**
- A1.1 An allen Viewports aus Abschnitt 7 füllt jede Szene die ganze Fläche (Abnahme Fundament 3). Kein Letterbox-Streifen auf hellen Szenen.
- A1.2 An jeder Marke liegt kein Text, kein Bedienelement, kein Handy und keine Hand teilweise außerhalb des sichtbaren Kastens. Ausnahme: der gewollt aus dem Bild laufende Unterarm. Rechtsseiten bei 320–768 px ohne Überlauf.
- A1.3 Hochformat 390×844 und 360×740: jede Szene eigens komponiert (Kontaktbogen angesehen). DOM-Schrift ≥ 12 px (Labels) und ≥ 15 px (Fließtext), Canvas-Schrift ≥ 10 px, Trefferflächen ≥ 44 px (außer innerhalb der App, die echte App-Maße hat).
- A1.4 Drehen und Größenwechsel halten die Stelle (±1 %). Canvas-Text scharf bei DPR 2 und 3.

**A2 Text nie verdeckt**
- A2.1 Messkette A/B/C (TEXT liefert sie unter `tools/qa/text/`), Zeiger aus, Flut über 200 Zeitphasen simuliert. Jeder Textblock in animierten Szenen (Hero-Titel, Raumkarten, Ende-Titel und CTA, Körper-Titel, Tiefe-Untertitel, Planet-Titel und Karte, Install-Schritte, Finale-Titel und CTAs) hat im Plateau ≥ 95 % der Glyphenpixel mit Kontrast ≥ 4,5:1 (≥ 3:1 ab 24 px).
- A2.2 0 Schritte mit zwei Raumkarten > 0,05, kein Geisterduplikat.
- A2.3 Jede Raumkarte ≥ 0,5 Bildschirmhöhen voll sichtbar, Tiefe-Untertitel ≥ 0,35 Bildschirmhöhen ≥ 0,9.
- A2.4 `jump.mjs` 0 Fehlschläge (alle Fälle aus Abnahme Fundament 6).
- A2.5 Der Kopf liegt nie ungeschützt über Text (0 Kollisionen ohne Schleier). Logo und CTA haben an allen Marken ≥ 4,5:1, außer in der Ende-Szene, wo der Kopf gewollt verdeckt ist.
- A2.6 Tiefe: an jedem Messpunkt im 100er-Raster ≥ 2 % helle Pixel. Körper: Ring beim Eintritt sichtbar.

**A3 Echte App im Handy**
- A3.1 Jeder Demo-Zustand im Ref-Modus (390×844, DPR 3, Uhr 06.10.2026 17:00 Europe/Berlin) weicht ≤ 0,5 % Pixel (Kanal-Δ > 24) vom Original ab.
- A3.2 Tabbar (4), SubNav (alle Einträge), Kopf-Icons, Abläufe A–D aus REF §9, „Ausgleichen“, Start-Zeilen und „Neu in deiner WG“ enden jeweils im Zielzustand der echten App: Text gegen `texts.md`, Pixel ≤ 0,5 %.
- A3.3 Bewegung wie REF §7: Dialog 200/220 ms ease, Sheet 300/400 ms `(.22,1,.36,1)`, Knopf 80 ms, Toast 4 s, Abhaken ohne Animation.
- A3.4 Nur Mika, Lina, Jona (Du), Lea. Kein Element ohne Vorbild in einer Aufnahme. Datumsangaben relativ zum heutigen Datum im App-Format.
- A3.5 In der Landing:
  - Die Hand folgt dem Zeiger auch über dem Bildschirm, Klick und Tipp lösen die App-Aktion aus.
  - Rad und Wisch über dem Handy scrollen die Seite.
  - Tastatur bedienbar, vor `--e` > 0,6 nicht fokussierbar.
  - Text im Handy ist bei 2560×1440@1 und 1440×900@2 scharf.

**A4 Echte Installation**
- A4.1 Jede Zeile der Prüfliste INSTALL-FLOWS §6 ist per Bildfolge belegt.
- A4.2 Beschriftungen wörtlich (Liste im INSTALL-Auftrag).
- A4.3 Zeiten (30-fps-Aufnahme):
  - iOS-Seitenmenü als Feder ζ 0,59 ± 0,06, ωn 16,6 ± 1,7 rad/s.
  - „Mehr anzeigen“ 400–480 ms ohne Überschwinger, Home-Dialog ≈ 0,8 s, „Hinzufügen“ ≈ 0,45 s, Icon ohne Pop.
  - Android-Menü 0,45–0,65 s gestaffelt, Dialog 0,2 s.
- A4.4 Icon md5-gleich mit der App, Name „ManaWG“, Adresse `app.manawg.com`.
- A4.5 In keinem Bild der Schleife ist der Gerätebildschirm zu mehr als 15 % undefiniert oder leer.
- A4.6 Schrittliste synchron, klickbar und per Tastatur bedienbar. Bei `reduce` Standbilder.

**A5 Schöner, Award-Niveau**
- A5.1 Jede Szene ≥ 55 fps bei 1920×1080@2 (M3, Metal) und ≥ 30 fps bei 4× CPU-Drosselung auf 390×844@3. Kein Long-Frame > 50 ms im Durchlauf außer dem ersten Bild.
- A5.2 Tempo bei 60 und 120 Hz gleich (±7 %).
- A5.3 Jedes Bedienelement hat gestaltetes Hover, `:focus-visible` und Aktiv, dazu `::selection`. Keine Browser-Standardringe.
- A5.4 Ankersprünge ohne Weiß-Blitz. Im Video der Übergänge keine Knicke, Ruckler oder Sprünge (angesehen).
- A5.5 Abschluss-Sichtprüfung (Opus-Judge) mit Kontaktbögen aller Marken in 5 Viewports und Videos der Szenenübergänge: keine offenen Funde „kritisch“ oder „hoch“.
- A5.6 Lighthouse mobil (Fast 4G, 4× CPU): Barrierefreiheit ≥ 95, Best Practices ≥ 95, SEO 100, LCP ≤ 2,5 s. axe ohne serious und critical.

**A6 Realistische Hand, gleiche Struktur**
- A6.1 Keine Kapsel-SDFs mehr im Code, beide Hände aus den Pässen.
- A6.2 Struktur wie im Design (Daumen links am Rand, vier Fingerkuppen über dem rechten Rand, Unterarm nach links unten, Zeigehand folgt dem Zeiger mit Arm zur unteren rechten Ecke). Belegt mit Überlagerung gegen die Kapsel-Silhouette.
- A6.3 Fingerkuppen ≤ 48 Bühnen-px über den rechten Handyrand (ab Außenkante x 950), rechte App-Spalte (Bühnen-x ≥ 880) in Ruhe ≤ 15 % verdeckt.
- A6.4 ≥ 55 fps (1×), ≥ 30 fps (4×), ≤ 4 ms Hauptthread je Bild bei 4×.
- A6.5 Titel und CTA der Ende-Szene bei einem Zeiger-Sweep über die ganze Fläche nie unter 4,5:1.

**A7 Größen**
- A7.1 Tabelle 2.6.2 eingehalten (Messung im Stil von `mono.mjs`).
- A7.2 Bei 2560×1440 wächst kein Text über ×1,15 und keine Komposition über ×1,25 des Entwurfs.

**A8 Fehler allgemein**
- A8.1 Jeder Fund V-01…V-16, T-01…T-17, F-01…F-20 ist erledigt (Abnahme aus fehler.md §11 erfüllt) oder in Abschnitt 10 begründet verworfen.
- A8.2 0 Konsolenfehler, 0 Warnungen, 0 fehlgeschlagene Anfragen (Chromium und WebKit-Smoke).
- A8.3 Ohne WebGL2 nach ≤ 4 s bedienbar.
- A8.4 Zurück und Neuladen landen an derselben Stelle, Lader nur beim ersten Besuch der Sitzung.
- A8.5 `reduce`: ohne Zeiger an allen Marken < 0,3 % Pixeländerung je 500 ms.
- A8.6 typecheck, lint, build grün. Kein Speicher- oder Listener-Wachstum (3 Durchläufe, 20 Größenwechsel).

---

## 9. Integration und Endabnahme

1. Nach dem Fundament: `landing-produktion` enthält den Fundament-Stand. Erst dann starten die sechs Worktrees.
2. Zusammenführen in beliebiger Reihenfolge, jeweils `git merge --no-ff <paket-branch>`. Konflikte darf es wegen 3.1 nicht geben. Tritt einer auf, hat ein Paket eine fremde Datei angefasst: rückgängig machen und den Bedarf erfüllen.
3. Gemeldeten Bedarf an eingefrorenen Dateien umsetzen (Integrationsagent), danach volle QA: `tools/qa/*` aller Pakete, Messkette A/B/C, `jump.mjs`, `hz.mjs`, `fps.mjs` auf ruhiger Maschine, WebKit-Smoke, Lighthouse, axe.
4. Endabnahme nach Abschnitt 8, Opus-Judge (A5.5), Sichtprüfung im echten Chrome (claude-in-chrome), zuletzt `graphify update .`.
5. Push, Merge nach `main` und Deploy sind nicht Teil dieses Plans.

---

## 10. Verworfene oder angepasste Audit-Vorschläge

- T-01, optionaler Teil „Abfall der Flut 1 vorziehen“: verworfen, er kürzt die Flut. Die Spaltenmaske reicht.
- T-12, Startzustand „ruhig, Einfall nur nach Klick“: angepasst. Der Einfall ist Teil des Designs („Wirf sie. Sie finden zurück.“) und bleibt, startet aber erst, wenn die Sektion zu ≥ 70 % sichtbar ist.
- T-14, Option 2 „Kopf hinter Ende“: verworfen. Das Design verdeckt den Kopf in der Ende-Szene, das bleibt (Entscheidung 10).
- F-18.6, „Sternbild wieder einsetzen“: verworfen. Das Design zeigt nur die Hintergrundpunkte (`s.st = []`), nur der tote Code entfällt.
- `design/PLAN-FINAL.md` (Szenen streichen, Hochformat ohne Planet und Sterne, Lenis): gilt nicht.
- HAND.md, „natürliche Haltung mit 100 px Überdeckung“: angepasst auf ≤ 48 px (Entscheidung 8).
- T-04, Variante 2 „Wohnungsfenster auf P 0,52–0,92 vorziehen“: verworfen, sie greift in Tauchgang und Flut ein. Stattdessen `warp()` (2.4).
- Kein Vorschlag, der Inhalte entfernt, wird umgesetzt.

---

## 11. Messmarken

Marken sind szenenbezogen und gelten bei jedem Viewport. `intro:P` = Zeitachse P (`yForP`). `<abschnitt>:p` = `scrollY = top + p × Höhe`. Bei `funktionen:p` gilt `p` = Sticky-Fortschritt (`stickP`).

| alter T (1280×800) | neue Marke | Szene |
|---|---|---|
| 0 | `intro:0` | Berg nach dem Lader |
| 400 | `intro:0.0625` | Blick hebt sich, Titel blendet aus |
| 1200 | `intro:0.1875` | Berg → Organ |
| 1900 | `intro:0.297` | Körper teilen sich |
| 2600 | `intro:0.406` | Zoom |
| 3300 | `intro:0.516` | Tauchgang und Flut 1 |
| 3800 | `intro:0.594` | Wohnung |
| 4326 / 4685 / 5043 / 5402 | `intro:0.676` / `0.732` / `0.788` / `0.844` | Raumkarten 01–04 |
| 5700 | `intro:0.891` | Flut 2 |
| 6000 | `intro:0.9375` | Hände blenden ein |
| 6400 | `intro:1` | Ende voll |
| 6900 | `intro-aus:0.625` (Bühne zu 62,5 % weggescrollt) | Ende scrollt weg |
| 7186 | `so-gehts:-0.2` (≈ Ankerziel „Intro überspringen“) | So geht’s |
| 7600 | `so-gehts:0.55` | Ziffern |
| 8000 | `koerper:0.2` | acht Körper |
| 8853 / 10130 / 11407 | `funktionen:0.088` / `0.544` / `1` | Tiefe 01 / 02 / 03 |
| 12207 | `bereiche:0` | Planet |
| 13007 | `installieren:0` | Installieren |
| 13807 | `fragen:0` | Fragen |
| 14200 | `finale:-0.3` | Finale-Eintritt |
| 14574 | `ende-der-seite` | Finale und Fußzeile |
