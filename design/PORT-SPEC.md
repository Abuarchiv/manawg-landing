# PORT-SPEC: final.dc.html → Next-Seite, 1:1

Stand 2026-10-06. Quelle: `design/final.dc.html` (825 Zeilen, vom Nutzer fertig geliefert). Referenz-Render: `site-1zu1/final.html` + `site-1zu1/support.js` über `python3 -m http.server 4191` im Ordner `site-1zu1`. `site/` und `site-1zu1/` werden nicht angefasst. `design/PLAN-FINAL.md` (Szenen streichen, Hochformat neu komponieren, Lenis, Verbesserungsrunden) gilt für diesen Port **nicht**.

Grundsatz: Layout, Farben, Typo, Texte, Timings, Canvas-/WebGL-Logik, Animationen und Interaktionen bleiben exakt. Erlaubt sind nur die Eingriffe aus Abschnitt 6 („Abweichungsliste, abschließend“). Alles dort nicht Genannte ist verboten.

Gemessene Eckdaten der Referenz (Playwright, 1280×800, DPR 1):
- Rahmen `#final > div:nth-child(2)`: 1280×800. Scroll-Container = dessen erstes Kind, `scrollHeight` 15374, max. `scrollTop` 14574.
- Kinder des Scroll-Containers (offsetTop/Höhe): Intro 0/7200 · Flut-Raster 7200/96 · [05] 7296/551 · Acht Körper 7847/760 · Tiefe 8607/3600 · [06] 12207/800 · [07] 13007/800 · [08] 13807/622 · Finale 14429/760 · Fußzeile 15189/185.
- `canvas[data-art]` in DOM-Reihenfolge: ptext, ptext, ptext, physics, depth, planet, ascii, stars.
- Referenz gegen sich selbst (zwei Läufe, Fake-Clock, fester Zufall): ≤ 0,012 % abweichende Pixel. Das ist das Grundrauschen für Abschnitt 5.

---

## 1. Zielstruktur in Next

```
src/app/layout.tsx                 Root-Layout (neu geschrieben, Abschnitt 4)
src/app/globals.css                Fonts, Basisregeln der Vorlage, Hüllen-Regeln, Tailwind nur utilities
src/app/page.tsx                   Server-Komponente: Inline-Fit-Skript, <noscript>, <Landing/>
src/components/landing/Landing.tsx 'use client' – einzige Client-Grenze; Wurzel, Zustand, Engine-Start, Dokument-Scroll
src/components/landing/dc.tsx      css()-Parser, <Dc> (style-hover/style-active), press() für Tastatur
src/components/landing/sections.tsx Intro, Flut, SoGehts, Koerper, Tiefe, Bereiche, Installieren, Fragen, Finale, Fusszeile
src/components/landing/overlays.tsx HeroTitel, Kopf, Raeume, Hinweise, Lader, Ende (inkl. Handy)
src/components/landing/engine/logic.js   Zeilen 230–267 (+ schließende Klammer): Klasse mit PL, state, renderVals, V, componentWillUnmount
src/components/landing/engine/hero.js    Zeilen 269–564 (WebGL Berg/Organ, Wohnung drawC, Hände, Flut, loop)
src/components/landing/engine/art.js     Zeilen 566–795 (ART-Loop: ptext, physics, depth, planet, ascii, stars + übrige Zeichner)
src/components/landing/engine/install.js Zeilen 798–818 (Installier-Handy, insLoop)
public/icon-512.png                aus site-1zu1/apps/web/public/icon-512.png kopieren
tools/pixel.mjs                    Verifikation (Abschnitt 5), Ausgabe nach tools/out/ (gitignored)
```

Alle Abschnitte sind Client-Komponenten (über die Grenze in `Landing.tsx`). Nur `Landing.tsx` trägt `'use client'`. Keine weiteren Dateien, keine neuen Abhängigkeiten.

### 1.1 Engine-Module: Skript der Vorlage wörtlich, `this` über `.call`
Der `<script type="text/x-dc">` der Vorlage wird **wörtlich** in vier Module geschnitten. `this` wird nicht ersetzt, sondern beim Aufruf gebunden. Dadurch bleibt jede Zeile der Logik unverändert.

- `logic.js`: Zeile 230 `class Component extends DCLogic {` wird `export class Logic { // PORT`. Zeilen 231–267 wörtlich, danach `} // PORT`.
- `hero.js`: `export function hero() { // PORT`, dann Zeilen 269–564 wörtlich, dann `return loop; // PORT` und `} // PORT`.
- `art.js`: `export function art() { // PORT`, Zeilen 566–795 wörtlich, `} // PORT`.
- `install.js`: `export function install() { // PORT`, Zeilen 798–818 wörtlich, `} // PORT`.
- Einzige Logikzeile, die dazukommt (in `hero.js` als eigene Zeile direkt nach Zeile 517 der Vorlage, `endA` ist in Zeile 514 definiert):
  `s.ctas.forEach(el => { const off = !(endA > 0.6); if (el.inert !== off) el.inert = off; }); // PORT: unsichtbare CTAs nicht fokussierbar`
- Die Blöcke greifen nicht auf fremde Bezeichner zu (geprüft: `W`, `H`, `G`, `B`, `cl`, `t0` sind in `art`/`install` jeweils lokal definiert). Ein `ReferenceError` beim Start bedeutet: falsch geschnitten. ES-Module laufen strikt, die Vorlage lief über `new Function` nicht strikt; ein Fehler daraus zeigt sich ebenfalls als Konsolenfehler in 5.3/4.
- Prüfbefehl:
  ```
  diff <(sed -n '230,822p' design/final.dc.html) \
       <(cat src/components/landing/engine/{logic,hero,art,install}.js | grep -v '// PORT')
  ```
  Jede `>`-Zeile im diff ist ein Fehler. `<`-Zeilen dürfen nur die Wrapper-Zeilen 230, 268, 565, 796, 797, 819, 820, 821, 822 sein.
- `biome.json`: `files.ignore` um `src/components/landing/engine/**` ergänzen (Format der Vorlage bleibt). Die Module bleiben `.js` (allowJs ist an, checkJs aus).

### 1.2 Zustand per React-Hooks statt DCLogic
In `Landing.tsx`:
```ts
// inst ist `any`: die Engine ist untypisiertes JS, Felder (raf, sc, fa, …) entstehen zur Laufzeit
const inst = useRef<any>(null); if (!inst.current) { inst.current = new Logic(); inst.current.props = { tour: false }; }
const [, rerender] = useState(inst.current.state);
inst.current.setState = (p) => {            // Semantik 1:1 aus support.js DCLogic.setState
  const i = inst.current!; const n = typeof p === 'function' ? p(i.state) : p;
  i.state = { ...i.state, ...n }; rerender(i.state);
};
const v = inst.current.renderVals();        // jedes Render, wie __update()
```
`v` (instTabs, instSteps, sheetRows, dlgTitle, dlgBtn, plNo…plAmt, faqs, tabTitle, isStart/isHaus/isFin/isAus, saldo, saldoText, lastAct, openCount, openText, items, exps, addLabel, addExp, replyText, reply, tabs) geht als Props in die Abschnitte. Die Engine liest `this.state.sel`/`this.state.inst` live vom selben Objekt, `this.setState({ sel })` aus dem Planeten läuft über dieselbe Funktion. `props.tour` ist `false` (Default aus `data-props`).

Engine-Start, ein Effekt, Reihenfolge exakt wie `componentDidMount`:
```ts
useEffect(() => { const i = inst.current!; const loop = hero.call(i); art.call(i); install.call(i); loop();
  return () => i.componentWillUnmount(); }, []);
```
Mehr Aufräumen als die Vorlage gibt es nicht (Produktion hängt die Seite nie aus; in Dev bleiben durch StrictMode höchstens ein GL-Kontext und Font-Listener liegen – bekannt, akzeptiert).

### 1.3 DOM-Gerüst (bestimmt die Engine-Zugriffe ohne Codeänderung)
`mk()` liest `document.getElementById('final').children[1]` als Rahmen, dessen erstes Kind als Scroller, dessen erstes Enkelkind als Bühne. `loop()` nimmt `#final … querySelector('canvas')`. `scan()` und `insLoop()` suchen den Scroller über `style.overflowY === 'auto'`. Das Gerüst erfüllt das wörtlich:

```html
<div id="final">
  <div data-sizer aria-hidden="true"></div>                 <!-- children[0]: Dokumenthöhe (Abschnitt 3) -->
  <div data-root style="ROOT">                              <!-- children[1]: der 1280×800-Rahmen (Zeile 35) -->
    <main data-scroller style="position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none">
      Intro · Flut · SoGehts · Koerper · Tiefe · Bereiche · Installieren · Fragen · Finale · Fusszeile
    </main>
    HeroTitel · Kopf · Raeume · Hinweise · Lader · Ende        <!-- Reihenfolge = Zeilen 109–223 -->
  </div>
</div>
```
`ROOT` = `position:fixed;left:0;top:0;width:1280px;height:800px;overflow:hidden;background:#0A0A0A;color:#FAFAFA;font-family:Inter,system-ui,sans-serif;transform-origin:0 0;transform:translate(var(--x,0px),var(--y,0px)) scale(var(--k,1))`. Nicht übernommen: `border-radius:14px` (Artboard-Rahmen, siehe 6). `font-family` steht dabei, weil der Rahmen sie in der Vorlage von der Doku-`<section>` erbt.

Der Scroller behält im Inline-Style `overflow-y:auto` (die Engine-Suche bleibt wörtlich gültig). Wirklich gescrollt wird das Dokument: `globals.css` enthält `html.js [data-scroller]{overflow:hidden!important}`. Ohne JS greift die Regel nicht, dann scrollt der Rahmen selbst wie in der Vorlage (Fallback, Abschnitt 4).

Alle `data-*`-Attribute der Vorlage bleiben wörtlich erhalten (`data-flood, data-sec, data-art, data-glyph, data-w, data-h, data-text, data-fs, data-cs, data-font, data-mode, data-stick, data-dcap, data-depth, data-ins, data-istep, data-tgt, data-go, data-scr, data-loader, data-count, data-bar, data-endov, data-hand, data-cta`). Die Engine schreibt in diese Elemente (style, textContent); React rendert sie mit statischen Werten und überschreibt sie deshalb nie. Regel: In Elementen, deren `textContent` die Engine setzt (`[data-count]`, `[data-bar]`, `[data-depth]`, `[data-scr]`), steht genau ein statischer String als Kind. In Styles, die die Engine setzt (Lader `opacity/pointerEvents`, `[data-endov] transform`, `[data-cta] pointerEvents`, `[data-ins=*]`, `[data-istep] opacity`, `[data-dcap] opacity`, Root-`cursor` und `--p/--g/--f/--e/--c0..3`), steht im React-Style nur der Ausgangswert der Vorlage, nie ein abgeleiteter.

### 1.4 Fonts und Assets
- `globals.css` deklariert die drei `@font-face` wörtlich wie Zeilen 13–15, nur mit `src:url('../fonts/<datei>.woff2')` (Dateien in `src/fonts/` sind byte-identisch zu `site-1zu1/fonts/`, geprüft). Familiennamen bleiben `'Inter'`, `'Inter Tight'`, `'JetBrains Mono'`, weil Canvas-Code sie als Strings nutzt (`500 12px "JetBrains Mono"`). Kein `next/font` (es erzeugt gehashte Familiennamen und bricht damit die Canvas-Texte). Next bündelt die woff2 über die CSS-Pipeline.
- Bildpfade: `apps/web/public/manawg-mark.svg` → `/manawg-mark.svg` (liegt in `public/`, identisch), `apps/web/public/icon-512.png` → `/icon-512.png` (kopieren). Einfaches `<img>` mit den Original-Styles und Original-`alt`, kein `next/image`.

---

## 2. Template-Konstrukte → React (exakt)

| Vorlage | React |
|---|---|
| `style="…"` | `style={css("…")}` mit dem Original-String unverändert kopiert. `css()` in `dc.tsx`: an `;` trennen, je Deklaration am ersten `:` trennen, Name kebab→camel (Custom Properties `--x` bleiben), Wert als String, Ergebnis per `Map` gecacht. Keine Umrechnung in Zahlen (React hängt sonst `px` an). |
| `style="…{{ a.b }}…"` | Template-Literal im selben String: ``css(`…${a.b}…`)``. Leerer Wert bleibt leer (support.js setzt `''` für `null`). |
| `{{ x }}` im Text | `{x}`; Text inklusive Leerzeichen auf **einer** JSX-Zeile (JSX kürzt Zeilenumbrüche). Beispiel Zeile 57: `{v.plNo} · {v.plName}`. Zeile 51: `TIEFE <span data-depth="1">000</span>`. |
| `<br>` | `<br />` |
| `<sc-for list="{{ l }}" as="it">…</sc-for>` | `{v.l.map((it, i) => <Fragment key={i}>…</Fragment>)}`. Key = Index, weil support.js Instanzen indexweise wiederverwendet und nur bei Längenänderung neu baut. `display:contents` der Hülle entfällt ersatzlos (Fragment = gleiche Box-Struktur). |
| `<sc-if value="{{ c }}">…</sc-if>` | `{c && <>…</>}` (support.js baut bei `true` auf und leert bei `false` = Mount/Unmount). |
| `onClick="{{ f }}"` | `onClick={f}` plus Tastatur über `press(f)` (Abschnitt 4.3). |
| `data-tgt="{{ r.tgt }}"`, `data-istep="{{ sp.i }}"` | als String-Prop. Leerstring bleibt als Attribut stehen (`data-tgt=""`). |
| `style-hover="X"` / `style-active="Y"` | `<Dc as=… style="BASE" hover="X" active="Y">`. Exakt wie support.js: Stil = `BASE + (h&&X ? ';'+X : '') + (a&&Y ? ';'+Y : '')`. Mit `hover`: `pointerenter`→h=1, `pointerleave`→h=0 **und** a=0. Mit `active`: `pointerdown`→a=1, `pointerup`/`pointercancel`→a=0. Ohne `hover` setzt `pointerleave` a nicht zurück. Zustand per `useState`. |
| `hint-placeholder-*` | entfällt (Editor-Attribut, von support.js entfernt). |
| `<helmet><style>` | nach `globals.css` (Abschnitt 4.1). `<meta name="design_doc_mode">` entfällt. |
| Klasse `DCLogic`, `renderVals`, `setState` | Abschnitt 1.2. |

Wiederholte Strukturen, als Daten statt 120 Handzeilen:
- Flut-Raster (Zeile 43, 40×3 Zellen): `const FLUT = '##5#####5###################4###3#3#####4#####5########44##5#5##5####45#313##6#42#433223#44#43211222122222333#211_1223#2'` (aus der Vorlage extrahiert, 120 Zeichen). `#` → `<div style="background:#FAFAFA">`, Ziffer → Zahlzelle mit dem Original-Style `display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:rgba(250,250,250,0.6)` und der Ziffer als Text, `_` → dieselbe Zahlzelle leer.
- Home-Raster im Installier-Handy (Zeile 95): 16 Zellen, Index 1 ist `data-ins="micon"` (Icon + „ManaWG“), alle anderen sind die Platzhalter-Zelle der Vorlage.

Semantik-Tausch ohne Pixelwirkung (alle Größen, Gewichte, Abstände stehen inline, UA-Stile werden überschrieben):
- `<div>`-CTAs → `<a href>` mit Original-Style plus `text-decoration:none` (die globale `a`-Regel der Vorlage würde sonst unterstreichen). `display` muss nicht ergänzt werden: alle betroffenen Elemente sind `display:flex`, absolut positioniert oder Flex-Kinder.
- Überschriften: Zeilen 118/128/138/148 (Raum-Titel) `h3`→`h2`; Zeile 55 „Acht Orte. Eine WG.“ `h3`→`h2`; Zeile 65 „Auf den Home-Bildschirm.“ `h3`→`h2`; Zeile 44 `[ 05 ] SO GEHT’S` `span`→`h2` + `margin:0`; Zeile 46 „Wirf sie. Sie finden zurück.“ `span`→`h2` + `margin:0`; Zeile 101 `[ 08 ] FRAGEN` `span`→`h2` + `margin:0`. Die drei `h3` in [05] bleiben `h3`. Hero-`h1` (Zeile 109) bleibt einziges `h1`; das Doku-`h1` „ManaWG Landing.“ entfällt mit dem Artboard (Abschnitt 6).
- Container-`div` → Landmarken: Scroller = `<main id="inhalt">`; Scroll-Abschnitte (Zeilen 37, 44, 46, 47, 53, 62, 101, 103) = `<section>` mit `aria-labelledby` auf ihre Überschrift bzw. `aria-label` (Intro: „Intro“, Tiefe: „Funktionen“, Finale: über das `h2`); Zeile 104 = `<footer>`; Zeile 110 = `<header>`; Zeile 162 (`data-endov`) = `<section aria-label="App-Vorschau">`; Zeile 114 (Raum-Texte) = `<section aria-label="Die Wohnung">`.
- Sprungziele: `id` auf die `[data-sec]`-Elemente: 05 `so-gehts`, 06 `bereiche`, 07 `installieren`, 08 `fragen`.

---

## 3. Vom festen 1280×800-Entwurf zur echten Seite

### 3.1 Skalierung (eine Regel, alle Formate)
```
vw = document.documentElement.clientWidth, vh = window.innerHeight
k  = Math.min(vw / 1280, vh / 800)
x  = (vw - 1280·k) / 2,  y = (vh - 800·k) / 2
```
Gesetzt als `--k`, `--x` (px), `--y` (px) auf `<html>`; der Rahmen nutzt sie im `transform` (Abschnitt 1.3). Der Rahmen ist also immer exakt der 1280×800-Entwurf, gleichmäßig skaliert und zentriert. Außerhalb liegt `#0A0A0A` (Body-Hintergrund), was zum Rahmen-Hintergrund passt.
- 1280×800: k = 1, x = y = 0 → pixelgleich.
- 1440×900: k = 1,125, randlos. 1920×1080: k = 1,35, je 96 px Rand links/rechts. 1024×768: k = 0,8, je 64 px oben/unten.
- Hochformat (vw < vh): k = vw/1280. Gleiche Szenen, gleiche Komposition, als 16:10-Band vertikal zentriert (390×844 → 390×244 bei y = 300). Weil k im Hochformat nur von der Breite abhängt, ändert das Ein-/Ausblenden der Mobil-Adressleiste k nicht, nur y und die Dokumenthöhe. Pinch-Zoom bleibt erlaubt (kein `maximum-scale`). Grenze: Texte werden im Hochformat entsprechend klein; eine eigene Hochformat-Komposition wäre ein Designeingriff und gehört nicht in diesen Port.
- Zeiger-Koordinaten, Bühnenqualität und Handy-Tap-Positionen rechnen in der Vorlage bereits über `getBoundingClientRect()`/`offsetWidth` auf 1280×800 zurück (`mv`, `scan`, `insLoop`, `qo`, `stickP`). Deshalb funktioniert `transform: scale` ohne Engine-Änderung.

Erstwert vor dem ersten Paint: `page.tsx` rendert vor `<Landing/>` ein Inline-Skript (CSP erlaubt `'unsafe-inline'`), das `--k/--x/--y` setzt und `document.documentElement.classList.add('js')` ausführt:
```js
(function(){var d=document.documentElement,w=d.clientWidth,h=innerHeight,k=Math.min(w/1280,h/800);d.classList.add('js');d.style.setProperty('--k',k);d.style.setProperty('--x',(w-1280*k)/2+'px');d.style.setProperty('--y',(h-800*k)/2+'px')})()
```
`<html>` im Layout bekommt `suppressHydrationWarning` (Klasse/Style kommen vom Skript). `Landing.tsx` rechnet dieselbe Formel in `fit()` bei `resize` neu.

### 3.2 Scroll-Container → Dokument-Scroll, identische scrollTop-Zeitachse
Die Zeitachse der Vorlage hängt an `scroller.scrollTop` (P = scrollTop/6400, Sticky-Intro bis 6400, Abbruch der Hero-Schleife ab 7300, Tiefe über `stickP`, `--e`-Overlay mit `translateY(-(scrollTop-6400))`). Diese Größe bleibt die Wahrheit, das Dokument treibt sie:

1. `fit()`: k/x/y setzen, dann `sizer.style.height = ((scroller.scrollHeight - 800) * k + innerHeight) + 'px'`, dann `scroller.scrollTop = scrollY / k`. Aufruf: beim Mount, bei `resize`, und per `useEffect(fit, [v.faqs.findIndex(q => q.open)])` nach jedem FAQ-Wechsel (einzige Höhenänderung im Inhalt; alle anderen Abschnitte haben feste Höhen).
2. Dokument → Rahmen: `window` `scroll` (passive): `if (Math.abs(scroller.scrollTop - scrollY/k) > 1) scroller.scrollTop = scrollY / k`.
3. Rahmen → Dokument: `scroller` `scroll`: `if (Math.abs(scroller.scrollTop - scrollY/k) > 1) window.scrollTo(0, scroller.scrollTop * k)`. Damit funktionieren ohne Sonderfall: das wörtliche `sc.scrollTo({…, behavior:'smooth'})` aus `go()` (Intro überspringen, Fußzeilen-Sprünge), Fokus-Scrollen beim Tabben in den Rahmen, Suche im Browser, `#hash` beim Laden. Die Schwelle von 1 px verhindert, dass sich beide Richtungen gegenseitig eine laufende Smooth-Animation abbrechen.
4. Mount: `history.scrollRestoration = 'manual'`, dann `fit()`, dann `window.scrollTo(0, scroller.scrollTop * k)` (ohne Hash steht der Scroller auf 0 → Seite startet oben mit Lader und Intro, wie die Referenz).
5. Ergebnis: Dokument-scrollY = scrollTop·k, Dokument-Max = 14574·k. Bei k = 1 ist `scrollY` identisch mit dem `scrollTop` der Vorlage.
6. `html{scrollbar-width:none} html::-webkit-scrollbar{display:none}` (Vorlage: `scrollbar-width:none` am Scroller). Dadurch gilt `clientWidth = innerWidth` und k = 1 bei 1280 px.
7. Kein Lenis, kein eigenes Smooth-Scrolling (die Vorlage hat keins). Tastatur (Leertaste, Bild↓, Pfeile), Mausrad, Touch und Scrollbalken-Gesten bewegen das Dokument; der Scroller ist per `overflow:hidden!important` nicht vom Nutzer scrollbar und leitet Rad/Touch an das Dokument weiter.

Bekanntes Verhalten der Vorlage, bleibt: Die Hero-Schleife steht ab `scrollTop > 7300` still. Springt man in einem Schritt von 6400…7300 nach > 7300, bleibt das Hand-Overlay in der zuletzt berechneten Verschiebung stehen. Normales Scrollen und `go()` laufen durch den Bereich und sind nicht betroffen.

---

## 4. Professionelle Hülle ohne Designeingriff

### 4.1 `globals.css` (vollständig)
```css
@font-face{font-family:'Inter';src:url('../fonts/inter-latin.woff2') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'Inter Tight';src:url('../fonts/inter-tight-latin.woff2') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('../fonts/jetbrains-mono-latin.woff2') format('woff2');font-weight:100 900;font-display:swap}
html,body{margin:0;background:#0A0A0A;color:#FAFAFA;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
html{scrollbar-width:none} html::-webkit-scrollbar{display:none}
a{color:inherit;text-decoration:underline;text-underline-offset:3px}
a:hover{text-decoration:none}
html.js [data-scroller]{overflow:hidden!important}
:root{--text-1:#FAFAFA;--text-2:rgba(250,250,250,0.72);--text-3:#A3A3A3;--accent:#FAFAFA;--bg-base:#0A0A0A}
@tailwind utilities;
```
Kein `@tailwind base`: Preflight setzt `line-height:1.5` auf `html` und verschiebt damit jede Zeile des Entwurfs mit `line-height:normal`. Die `--text-*`-Tokens bedienen nur Impressum/Datenschutz/AGB. Hintergrund `#E5E5E5` der Vorlage ist Artboard-Fläche und wird `#0A0A0A`.
`tailwind.config.ts`: `fontFamily` auf `sans: ['Inter','system-ui','sans-serif']`, `mono: ['"JetBrains Mono"','monospace']`, `serif` raus (Geist-Variablen gibt es nicht mehr).

### 4.2 Layout, Metadaten, Links
- `src/app/layout.tsx` neu: `<html lang="de" suppressHydrationWarning>`, `import './globals.css'` (die alte Zeile `'../globals.css'` zeigt auf eine fehlende Datei), kein `next/font`.
- Metadaten: `metadataBase: new URL(getAppUrl())`, `title: 'ManaWG – Die App für eure WG.'`, `description` wie bisher („Ausgaben, Putzplan, Einkaufsliste und Pinnwand in einer App für die ganze WG. Kostenlos, ohne Werbung, DSGVO-konform.“), `alternates.canonical: '/'`, `openGraph` (de_DE, website, siteName ManaWG, Bild `/og-zeichen.png`), `twitter: summary_large_image`, `icons` (favicon.svg, favicon-32.png, apple-touch-icon.png). `viewport`: `width=device-width, initialScale 1, viewportFit cover, themeColor #0a0a0a, colorScheme dark`.
- `robots.ts`, `sitemap.ts`, `impressum/`, `datenschutz/`, `agb/`, `not-found.tsx`, `error.tsx`, `global-error.tsx`, `middleware.ts` (CSP) bleiben. Löschen (unbenutzte Reste der alten Seite): `src/components/blob-stage.tsx`, `src/lib/choreo.ts`, `src/lib/haptics.ts`, `src/lib/cn.ts`.
- Linkziele (Basis `APP_ORIGIN` aus `src/lib/app-origin.ts`, Pfade aus manawg-app `/neu`):

| Element (Zeile) | Ziel |
|---|---|
| Kopf „WG erstellen“ (112) | `appUrl('/neu?action=create')` |
| [07] „App installieren“ (69) | `appUrl('/')` |
| Finale „WG erstellen“ (103) | `appUrl('/neu?action=create')` |
| Finale „Einladung einlösen“ (103) | `appUrl('/neu')` |
| Ende „WG erstellen“ `data-cta` (221) | `appUrl('/neu?action=create')` |
| Fußzeile Funktionen / So geht’s / Fragen (106) | `href="#bereiche" data-go="06"` / `href="#so-gehts" data-go="05"` / `href="#fragen" data-go="08"` |
| Fußzeile WG erstellen / Einladung einlösen / Anmelden (106) | `/neu?action=create` / `/neu` / `/` auf `APP_ORIGIN` |
| Fußzeile Impressum / Datenschutz (106) | `/impressum` / `/datenschutz` (normale `<a>`, volle Navigation) |
| „INTRO ÜBERSPRINGEN ↓“ (156) | `<a href="#so-gehts" data-go="05" data-scr="1">` |

Klick-Abfang für Anker: In `Landing.tsx` ein Capture-Listener auf dem Rahmen: `a[data-go]` → `preventDefault()` (sonst springt der Browser sofort und kollidiert mit dem Smooth-Scroll aus `go()`). Bei `prefers-reduced-motion: reduce` zusätzlich `stopPropagation()` und sofort springen: `y = (tg.top - sc.top)/k + sc.scrollTop - 110` (Formel aus `go()`, um k korrigiert), `window.scrollTo(0, y*k)`.

### 4.3 Barrierefreiheit (pixelneutral)
- Klickbare `div`s (Install-Tabs 67, FAQ-Einträge 102, Handy-Tabs 212, Einkaufszeilen 186, „Ausgabe erfassen“ 194, „Antworten …“ 207) bleiben `div` (gleiche Box), bekommen aus `press(f)`: `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Leertaste → `f()`, bei Leertaste `preventDefault`). Zustand: Tabs und Einkaufszeilen `aria-pressed`, FAQ `aria-expanded`, „Ausgabe erfassen“/„Antworten“ ohne Zusatz.
- `aria-hidden="true"`: alle `<canvas>`, Flut-Raster, Lader, „SCROLLEN“-Hinweis, Installier-Handy (Zeilen 71–99, reine Animation). Das Handy in „Ende“ bleibt bedienbar und bekommt `role="group" aria-label="ManaWG zum Ausprobieren"`.
- Unsichtbare Bedienelemente: Die eine Engine-Zeile aus 1.1 setzt `inert` auf beide `[data-cta]`, solange sie per `pointer-events` gesperrt sind.
- Stern-Canvas (109) bekommt `pointer-events:none` statt `auto` (Abschnitt 6). Damit ist der Kopf-CTA auch bei P = 0 klickbar.
- Tab-Reihenfolge folgt dem DOM der Vorlage (Inhalt im Scroller, danach Kopf, Hinweis, Ende). Umsortieren würde die Stapelreihenfolge und damit Pixel ändern; bleibt.
- `prefers-reduced-motion` nur als Schutz: Lader läuft schon in der Vorlage mit 1 ms; Sprung-Links springen sofort (4.2). Szenen, Übergänge und Timings bleiben unverändert.

### 4.4 Fallback ohne JS
`page.tsx` rendert `<noscript dangerouslySetInnerHTML={{ __html: '<style>[data-loader]{display:none!important}</style>' }} />`. Ohne JS fehlt die Klasse `js`, der Scroller behält `overflow-y:auto` und ist wie in der Vorlage im 1280×800-Rahmen scrollbar; alle Texte und Links stehen per SSR im HTML (auch für Suchmaschinen). Canvases bleiben schwarz.

### 4.5 Performance
Keine zusätzlichen Eingriffe nötig, nur bestätigen: rAF pausiert im Hintergrund-Tab, `artLoop` prüft `document.hidden`, alle Szenen überspringen sich außerhalb des Sichtbereichs (eigene Prüfungen der Vorlage), DPR-Deckel stehen im Code (Hero `dpr ≤ 1,5` und `qo ≤ 1`, Flut `fq ≤ 1,25`, Art-Canvases `adpr = 1`, Hände fest 1280×800). Der Rahmen ist `position:fixed`, Resize-Messung nur in `fit()`.

### 4.6 CSP lokal
Wenn beim lokalen `next start` Assets wegen `upgrade-insecure-requests` auf https umgeschrieben werden und fehlschlagen (Network-Panel/Konsole in Abschnitt 5), lässt `contentSecurityPolicy()` die Direktive für `localhost`/`127.0.0.1` weg (Host aus `req.nextUrl.hostname` übergeben). Sonst bleibt die CSP unverändert.

---

## 5. Verifikation

Alles mit Produktions-Build: `pnpm build && pnpm start -p 3100`. Referenz: `http://localhost:4191/final.html`. Playwright über `createRequire('/Users/abu/Company/manawg-app/apps/web/package.json')('@playwright/test')`, sharp über `createRequire(realpathSync('node_modules/next/package.json'))('sharp')` (liegt als Next-Abhängigkeit bereit). Chromium mit `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. Keine neue Abhängigkeit, kein pixelmatch: Diff als eigene Schleife über sharp-Rohdaten. Skript `tools/pixel.mjs`, Ausgabe `tools/out/` (in `.gitignore` aufnehmen).

### 5.1 Determinismus (beide Seiten gleich)
- `context.addInitScript` mit festem `Math.random` (mulberry32, Seed `0x9e3779b9`).
- `page.clock.install({ time: 0 })`, `page.clock.pauseAt(1000)`, dann `goto`, `await document.fonts.ready`, `clock.runFor(2500)`.
- Viewport 1280×800, `deviceScaleFactor: 1`.
- Referenz-Aufbereitung nach `goto` per `addStyleTag` (nur Artboard, nicht der Rahmen): `section[data-screen-label]{padding:0!important;gap:0!important} section[data-screen-label]>div:first-child,#final>div:first-child{display:none!important} #final>div:nth-child(2){border-radius:0!important}`. Danach liegt der Rahmen bei (0,0) und beide Seiten werden als Viewport-Screenshot 1280×800 verglichen.
- Scrollpfad identisch und schrittweise: von der aktuellen Position in Schritten von 100 px zum nächsten Messpunkt, nach jedem Schritt `clock.runFor(32)`. Referenz: `scroller.scrollTop = v`. Port: `scrollTo(0, v); dispatchEvent(new Event('scroll'))` (synchroner Abgleich vor den nächsten Fake-Frames).
- Am Messpunkt: `clock.runFor(1500)`, dann `page.waitForTimeout(800)` echte Zeit (CSS-Übergänge Lader 0,7 s, Handy 0,6 s, Schritte 0,3 s laufen nicht über die Fake-Uhr), dann Screenshot.
- Gemessen am 2026-10-06: zwei Referenzläufe weichen ≤ 0,012 % ab (Schwelle Kanal-Δ > 8).

### 5.2 Messpunkte (scrollTop des Entwurfs, aufsteigend in einem Lauf)
`0` Hero nach Lader · `400` Blick hebt sich, Titel blendet aus · `1200` Berg → Organ · `1900` Körper teilen sich · `2600` Zoom · `3300` Tauchgang + Flut · `3800` Wohnung · `4326` `4685` `5043` `5402` Raumtexte 01–04 (Maxima von `--c0..3`) · `5700` zweite Flut · `6000` Hände blenden ein · `6400` Ende-Overlay voll · `6900` Overlay schiebt hoch · `7186` Sprungziel [05] · `7600` ptext-Ziffern · `8000` Acht Körper · `8853` `10130` `11407` Tiefe 01/02/03 (Maxima der `data-dcap`) · `12207` [06] Planet · `13007` [07] Installieren · `13807` [08] Fragen · `14200` Finale ASCII-Sonne · `14574` Ende/Fußzeile.

### 5.3 Prüfungen und Schwellen
1. **Pixel 1280×800**, je Messpunkt: Anteil Pixel mit max. Kanal-Δ > 16 ≤ **0,10 %**. Bei Überschreitung `tools/out/diff-<st>.png` (Referenz abgedunkelt, Abweichungen rot) schreiben und ansehen; Ursache beheben, Schwelle nicht anheben.
2. **Textgeometrie**, je Messpunkt: alle Textknoten im Rahmen, die den Viewport schneiden, per `Range.getBoundingClientRect()` als Folge `[text, x, y, w, h]`. Referenz und Port: gleiche Folge, jede Kante |Δ| ≤ 0,5 px.
3. **Interaktionen** (gleiche Mauskoordinaten in beiden, danach `runFor` + 800 ms, dann wie 1. und 2.):
   - bei `6400`: Handy-Tab „Finanzen“ klicken, `runFor(600)`, „Ausgabe erfassen“ klicken, `runFor(600)`.
   - bei `13007`: Install-Tab „Android“ klicken, `runFor(3000)`.
   - bei `13807`: „Brauche ich eine App aus dem Store?“ klicken, `runFor(600)`.
   Koordinaten aus der Referenz per Textsuche im Rahmen ermitteln (Mitte des Elements).
4. **Konsole/Netz** (Port): 0 `pageerror`, 0 `console.error`, 0 fehlgeschlagene Requests. Alle drei Fonts kommen aus `/_next/static/media/`.
5. **Engine-Treue**: der diff-Befehl aus 1.1 zeigt nur die erlaubten Wrapper-Zeilen.
6. **Skalierung** (nur Port, Viewports 1440×900, 1920×1080, 1024×768, 390×844, 844×390): Rahmen-Rect = (x, y, 1280k, 800k) aus 3.1 ±0,5 px; `document.documentElement.scrollHeight` = (scrollHeight_Scroller − 800)·k + vh ±2; nach `scrollTo(0, 7186·k)` gilt `scroller.scrollTop` = 7186 ±1; `scrollWidth == clientWidth`. Screenshots bei 0, 3800, 6400, 7186, 12207, 14574 nach `tools/out/<vp>/` und **ansehen** (Komposition unverändert, nur skaliert, Ränder schwarz). Zusätzlich 1440×900 per sharp auf 1280×800 verkleinern und neben die Referenz legen (Sichtvergleich, keine Zahl, Halbton-Raster aliasen beim Verkleinern).
7. **Ohne JS** (`javaScriptEnabled: false`, 1280×800): Lader unsichtbar, `h1` „Die App für eure WG.“ sichtbar, Scroller auf 13807 scrollbar, Screenshot ansehen.
8. **Reduced Motion** (`emulateMedia({ reducedMotion: 'reduce' })`): nach `runFor(100)` ist der Lader auf `opacity: 0`; Klick auf „INTRO ÜBERSPRINGEN ↓“ landet ohne Animation bei scrollTop 7186.
9. **Links**: `[...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))` entspricht genau der Tabelle in 4.2 (Reihenfolge = DOM).
10. **Tastatur**: Tab erreicht jeden Install-Tab, jeden FAQ-Eintrag, alle Links; Enter auf FAQ 2 öffnet die Antwort; bei P < 0,9 ist kein Element im Ende-Overlay fokussierbar.
11. **Gates**: `pnpm typecheck`, `pnpm lint`, `pnpm build` grün. Danach `graphify update .`.
12. **Echter Browser**: Seite einmal in Chrome (claude-in-chrome) bei 1280×800 durchscrollen, Maus als Licht, Planet ziehen und anklicken, Körper werfen, Handy-Tabs, Install-Tabs, FAQ. Konsole leer.

Laufzeit: Referenz und Port parallel in zwei Browser-Kontexten, je Lauf etwa 3–5 Minuten (Swiftshader rendert WebGL auf der CPU).

### 5.4 Commits (lokal, Deutsch, keine KI-/Co-Author-Hinweise, kein Push)
1. „Next-Gerüst übernehmen“: bisher unversionierte Dateien unverändert (`package.json pnpm-lock.yaml next.config.ts next-env.d.ts tsconfig.json tailwind.config.ts postcss.config.js biome.json vitest.config.ts vercel.json .npmrc .nvmrc .env.example .github public src`), einzeln per `git add <pfad>`.
2. „Landing 1:1 aus final.dc.html portieren“: nur die in Abschnitt 1 genannten Pfade plus `.gitignore`, `biome.json`, `tailwind.config.ts`, gelöschte Reste.
3. „Pixelvergleich gegen Referenz“: `tools/pixel.mjs`.

---

## 6. Abweichungsliste (abschließend)

Nur diese Unterschiede zur Vorlage sind erlaubt. Alle sind pixelneutral oder betreffen nur die Artboard-Darstellung.

1. Artboard der Design-Datei fällt weg: Doku-`<section>` mit Padding 72 px, Kopfzeile „ManaWG · Landing Page · Finale Fassung“, Doku-`h1` „ManaWG Landing.“, Hinweis „In der Fläche scrollen…“, Zeile mit Badge „Final“, Seitenhintergrund `#E5E5E5`, `border-radius:14px` des Rahmens. Die Website ist der Rahmen.
2. Rahmen `position:relative` → `position:fixed` mit `transform` (Abschnitt 3.1); Scroller per CSS `overflow:hidden!important` bei aktivem JS; Dokument-Scroll über Platzhalter `[data-sizer]` und Zwei-Wege-Abgleich (3.2).
3. Stern-Canvas `pointer-events:auto` → `none`. Die Referenz-Laufzeit (`support.js`) schaltet es schon ab Deckkraft ≤ 0,05 ab; die Sternbild-Liste ist leer (`s.st = []`), Hover ändert also nichts Sichtbares. Ersetzt das 100-ms-Intervall aus `support.js`.
4. Tags: `div`→`a`/`main`/`section`/`header`/`footer`, `h3`/`span`→`h2` wie in Abschnitt 2, plus `role`, `tabIndex`, `aria-*`, `id`, `inert`, `href`, `text-decoration:none` an Links, `margin:0` an den drei getauschten `span`.
5. Eine Engine-Zeile (`inert` an `[data-cta]`), Capture-Listener für `a[data-go]` (preventDefault, bei Reduced Motion sofortiger Sprung).
6. Bildpfade und Font-URLs auf Next-Pfade.
