# HAND: realistische Hände aus Blender

Stand 2026-10-07. Die beiden Kapsel-Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) sind durch ein in Blender gerendertes, anatomisch echtes Handmodell ersetzt (umgesetzt in `src/components/landing/scenes/ende/hand.js`, Abschnitt 11). Struktur, Pose, Position und Bildsprache bleiben wie im Design: Daumen links am Handyrand, vier Finger um den rechten Rand, Handballen und Unterarm hinter dem Handy, Unterarm nach links unten; die Zeigehand folgt dem Zeiger und der Arm zeigt nach 1460/1020. Gezeichnet wird weiter in Halbton-Punkten (`dot()`, Bayer, `mix-blend-mode: difference` auf der vorderen Ebene). Die Engine bekommt keine Fotos, sondern **Daten-Pässe** (Leuchtdichte, Alpha, Normale, Tiefe) und shadet daraus selbst. Dadurch bleibt die Lichtreaktion auf den Zeiger erhalten.

Referenz-Umsetzung (läuft, Screenshots bei 1440 × 900 und 390 × 844 geprüft): `/Users/abu/Company/archiv/hand/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/scripts/preview.html` mit `?b=../final/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `ascii=1`, `mx/my/px/py`), eingeklebt im Abschnitt 6.

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 2072 × 2754, Maßstab 1,5, Kachel ab Bühnen-x 424, y 176) | 88 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 3328 × 894, Maßstab 1,0) | 66 kB |
| Summe | | 154 kB (Grenze 600 kB) |

Die JSON-Dateien beschreiben sich selbst (`tiles`, `origin`, `scale`, `encoding`, `space`; `hold.json` zusätzlich `phone`, `screen`, `bottomY`).

## 2. Koordinaten

Bühne der Engine: 1280 × 800, Handy-Mitte 800/400, 4,19 Bühnen-px je mm in der Handy-Ebene (Handy 71,6 × 147,6 × 7,8 mm, Eckenradius 11,5 mm).

- Handy außen (Silhouette, `Ende` in `overlays.tsx`): `x 650, y 90, w 300, h 620, r 48`.
- Bildschirm, hier kommt die echte App hinein: `x 661, y 101, w 278, h 598, r 37` (Inset 11, wie das Handy-DOM).
- Der Pass-Raum ist die Bühne. Bei Vollbild gilt dieselbe gleichmäßige Skalierung + Verschiebung für Handy-DOM, Canvas und Pässe; die Pässe selbst bleiben unverändert.

## 3. Atlas-Format (beide Dateien)

8-Bit-Grau, WebP. Kacheln laut JSON (`tiles.<name>`: `x, y, w, h, div`). `div = 2` bedeutet halbe Auflösung (bilinear hochskalieren).

| Kachel | Auflösung | Inhalt |
|---|---|---|
| `lum` | voll | Leuchtdichte, sRGB-Anzeigewert 0..1: Studiolicht oben links (wie `LX/LY/LZ` der Engine), Hautstreuung, Kontakt-Schatten zwischen Fingern, Nagelränder und Fingerüberlappungen als Tintenlinie eingebacken |
| `a` | voll | Alpha der Hand. Beim Handy-Pass ist das Handy Holdout: dort, wo das Handy die Hand verdeckt, ist Alpha 0 |
| `nx`, `ny` | halb | Normale im Bildraum, 0..255 = −1..1 (x nach rechts, y nach oben), `nz = sqrt(1 − nx² − ny²)` |
| `z` | halb | Tiefe, 0..255 = −100..+100 mm relativ zur Handy-Vorderseite (Handy-Pass) bzw. zur Fingerspitzen-Ebene (Zeigehand), plus = weiter weg |

Lage der Kacheln in der Bühne: `origin` (Bühnen-px der oberen linken Ecke von `lum`/`a`) und `scale` (Kachel-px je Bühnen-px). Kachel-px `u = (x − origin.x) · scale / div`, `v = (y − origin.y) · scale / div`.

Außerhalb der Silhouette sind `lum`, `nx`, `ny`, `z` 12 Bühnen-px weit nach außen fortgesetzt, damit bilineares Sampling am Rand keine schwarzen Säume zieht. Immer mit `a` maskieren.

## 4. Handy-Hand (`hold`)

Linke Hand (Blender-Rechtshand, Spiegelkamera), natürlicher Griff. Gemessen im Bühnenraum:

- Daumenspitze ragt 8 px über den linken Handyrand (Design: 28 px). Der Daumen liegt am Rand, die Nagelkante bleibt sichtbar.
- Fingerkuppen ragen über den rechten Rand (Maskenmessung am Bild, ab Außenkante x 950): Zeige 45 px, Mittel 38 px, Ring 20 px, klein 0 px (Kuppe sitzt am Rand, Nagel daneben sichtbar). Design: 28 px. Die erste Fassung (Zeige 100, Mittel 81, Ring 47, klein 4) verdeckte Beträge und Chevrons der echten App und ist ersetzt (PLAN-V2 Entscheidung 8).
- Unterarm-Achse 13,0° aus der Senkrechten nach links (Mittellinie zwischen y 900 und 1300 gemessen, Design 12,5°, erste Fassung 9,6°), Arm endet bei `bottomY = 1400` (Bühnen-px, 690 px unter der Handy-Unterkante). Ab etwa y 1310 ausblenden, wenn der Ausschnitt höher ist (der Shader macht das über `bottomY`).
- Die rechte App-Spalte (Bühnen-x 880 bis 939, y 101 bis 699) ist in Ruhe zu 11 % verdeckt (Blöcke à 6 px, `tools/qa/hand/mask.mjs`), die Grenze liegt bei 15 %.
- Pose: `scripts/q_hold2.json`, gelöst mit `scripts/solve_hold2.py` aus `q_hold.json` (Spitzenziel x ≥ 921 px für den Zeigefinger, Unterarmneigung 0,15 bis 0,23, Daumenziele wie zuvor). Gleiche Kamera, gleiches Licht, gleiche Befehle wie Abschnitt 8.
- Holdout ist 2 % schmaler als das Handy-DOM: Haut darf bis zu 3 px darunterliegen, das DOM-Handy deckt sie.

**Vorn/hinten** wird im Shader aus `z` und der Handy-Silhouette bestimmt, nicht eingebacken: `vorne = sdf(Handy außen) < 4 && z < 1,5 mm`. Vorne = Zeichenfläche über dem Handy (`mix-blend-mode: difference`, wie bisher `data-hand="front"`), alles andere = Fläche unter dem Handy (`data-hand="back"`). Vorne sind der Daumen und alle Fingerspitzen, die über den Rand auf den Bildschirm ragen.

## 5. Zeigehand (`point`)

Linke Hand von hinten, Zeigefinger gestreckt, Daumen oben, drei Finger eingerollt, Zeigefinger und Unterarm fast in einer Linie (wie im Design). Das Sprite ist ein starrer Körper in demselben Rahmen wie bisher `P(a, b)` in `drawHands`:

- Sprite-Raum: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger (im Design `b > 0`). `point.json: origin` ist die Kachel-Ecke in diesem Raum (Bühnen-px bei Maßstab 1).
- Platzierung wie in der Engine: `u = normalize(1460 − ht.x, 1020 − ht.y)`, `n = (−u.y, u.x)`, Spitze `(tx, ty) = ht + u · (6 + push · 4)`, Maßstab `sc = PS · (1 − push · 0,06)`.
  Zelle `(x, y)` → Sprite `a = ((x − tx) · u.x + (y − ty) · u.y) / sc`, `b = ((x − tx) · n.x + (y − ty) · n.y) / sc`, dort mit `samp()` lesen.
- **`PS = 0,62`**: Zeigefinger 52 Bühnen-px breit (Sprite 84 px). Die Finger der Haltehand sind real 16 bis 17 mm breit (67 bis 71 px), das Verhältnis liegt bei 0,75 (Vorgabe: mindestens 0,6). Das alte Design hatte ≈ 37 px. Echte Größe wäre `PS = 1`.
- Verblassen wie bisher: `fade = clamp(1 − (dist − 300) / 420)` mit `dist` = Abstand zur Spitze. Das Sprite reicht 1636 Sprite-px weit (900 Bühnen-px bei `PS 0,55`), also über das Verblassen (720 px) hinaus; kein sichtbarer Schnitt.
- Normalen ins Bühnenraum-System, falls die Zeigehand auch vom Zeigerlicht beleuchtet werden soll: `n_bühne = nx_s · (u.x, −u.y) + ny_s · (u.y, u.x)` (x rechts, y oben). Die Referenz nutzt für die Zeigehand nur das eingebackene Licht.
- Soll die Hand rechts statt links sein: `b = −b` im Sampler (dann sitzt der Daumen unten, wie bei der natürlichen Rechtshand von hinten).

## 6. Halbton-Shader (Referenz, aus `preview.html`)

`dot()`, `HB`, `hsh`, `cl`, `ss`, `lightF`, `ink`, `step 2,5` bleiben aus der Engine. Neu ist nur die Herkunft von `v` (Ton 0..1) je Zelle. Abgestimmte Konstanten: `GAM 0,6`, `CON 1,25`, `RIM 0,45`, `EDW 3,4`, `EDV 1,0`, `JIT 0,15` (Engine: 0,4; weniger Zufall = lesbare Finger).

```js
// --- Atlas laden (einmal) ---
async function loadHand(url, jsonUrl) {
  const meta = await (await fetch(jsonUrl)).json(), img = new Image(); img.src = url; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const D = g.getImageData(0, 0, c.width, c.height).data, T = {};
  for (const [n, t] of Object.entries(meta.tiles)) {
    const a = new Uint8Array(t.w * t.h);
    for (let j = 0; j < t.h; j++) for (let i = 0; i < t.w; i++) a[j * t.w + i] = D[((t.y + j) * c.width + t.x + i) * 4];
    T[n] = { a, w: t.w, h: t.h, div: t.div };
  }
  const S = meta.scale, [X0, Y0] = meta.origin;
  const samp = (t, X, Y) => {                       // X, Y in Buehnen-px bzw. Sprite-px, bilinear, ausserhalb 0
    const u = (X - X0) * S / t.div - 0.5, v = (Y - Y0) * S / t.div - 0.5, i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j;
    const q = (ii, jj) => (ii < 0 || jj < 0 || ii >= t.w || jj >= t.h) ? 0 : t.a[jj * t.w + ii];
    return ((q(i, j) * (1 - fu) + q(i + 1, j) * fu) * (1 - fv) + (q(i, j + 1) * (1 - fu) + q(i + 1, j + 1) * fu) * fv) / 255;
  };
  return { meta, T, samp };
}

// --- Handy-Hand: pro Zelle (x, y), i, j wie in der Engine ---
const sdfRR = (x, y, R) => { const qx = Math.abs(x - (R.x + R.w / 2)) - (R.w / 2 - R.r), qy = Math.abs(y - (R.y + R.h / 2)) - (R.h / 2 - R.r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - R.r; };
function holdCell(H, x, y, i, j, mx, my, cb, cf) {              // H = loadHand(hold), (mx, my) = Zeiger in Buehnen-px
  const { T, samp, meta } = H, al = samp(T.a, x, y); if (al < 0.15) return;
  const zmm = samp(T.z, x, y) * 200 - 100, sdf = sdfRR(x, y, meta.phone);
  const front = sdf < 4 && zmm < 1.5;
  let L = samp(T.lum, x, y); L = cl(0.5 + (Math.pow(L, 0.6) - 0.5) * 1.25);
  const nx = samp(T.nx, x, y) * 2 - 1, ny = samp(T.ny, x, y) * 2 - 1, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)), lf = lightF(x, y);
  let v = L * (0.62 + 0.5 * lf);
  v += 0.45 * Math.max(0, nx * 0.85 + ny * 0.05 + nz * 0.15) * (0.5 + 0.5 * L);               // Gegenlicht von rechts
  { const lx = mx - x, ly = -(my - y), lz = 170 + zmm * (300 / 71.6), d = Math.hypot(lx, ly, lz);   // Zeiger als Punktlicht
    const dn = Math.max(0, (nx * lx + ny * ly + nz * lz) / d), fo = 1 / (1 + Math.pow(d / 300, 2));
    v = v * 0.78 + (0.85 * dn * fo + Math.pow(dn, 18) * fo * 0.9) * (0.35 + 0.65 * L) * 1.15; }
  const e = 3.4, eA = Math.min(samp(T.a, x - e, y), samp(T.a, x + e, y), samp(T.a, x, y - e), samp(T.a, x, y + e));
  const edge = eA < 0.5 && Math.abs(sdf) >= 7;                                                // am Handy-Schnitt keine Kontur
  const cov = ss((al - 0.2) / 0.5) * ss((meta.bottomY - y) / 90);
  if (front && sdfRR(x, y, meta.screen) < -1) {                 // ueber dem weissen Bildschirm: Tinte statt Licht (Haut immer dunkler als Weiss)
    const tn = 0.04 + 0.86 * Math.pow(cl(v), 1.35); let vd = Math.pow(1 - tn, 0.45); if (edge) vd = Math.max(vd, 0.95);
    dot(cf, x, y, vd * cov, i, j);
  } else { if (edge) v = Math.max(v, lf * al); dot(front ? cf : cb, x, y, v * cov, i, j); }
}

// --- Zeigehand: pro Zelle, immer auf der vorderen Ebene ---
function pointCell(P, screen, x, y, i, j, tx, ty, ux, uy, PS, cf) {   // P = loadHand(point), screen = hold.meta.screen, (tx,ty) Spitze, (ux,uy) Armrichtung
  const { T, samp } = P, dx = x - tx, dy = y - ty, a = (dx * ux + dy * uy) / PS, b = (-dx * uy + dy * ux) / PS;
  const al = samp(T.a, a, b); if (al < 0.15) return;
  const fade = cl(1 - (Math.hypot(dx, dy) - 300) / 420); if (fade <= 0) return;
  let L = samp(T.lum, a, b); L = cl(0.5 + (Math.pow(L, 0.6) - 0.5) * 1.25);
  const lf = lightF(x, y); let v = L * (0.62 + 0.5 * lf);
  const e = 3.4 / PS, edge = Math.min(samp(T.a, a - e, b), samp(T.a, a + e, b), samp(T.a, a, b - e), samp(T.a, a, b + e)) < 0.5, cov = ss((al - 0.2) / 0.5);
  if (sdfRR(x, y, screen) < -1) {                                // wie oben: ueber dem Bildschirm Tinte
    const tn = 0.04 + 0.86 * Math.pow(cl(v), 1.35); let vd = Math.pow(1 - tn, 0.45); if (edge) vd = Math.max(vd, 0.95);
    dot(cf, x, y, vd * cov * fade, i, j);
  } else { if (edge) v = Math.max(v, lf * al); dot(cf, x, y, v * cov * fade, i, j); }
}
```

Einbau: umgesetzt in `scenes/ende/hand.js` (Abschnitt 11). `holdBack`, `holdFront`, `point`, `S`, `KS`, `FR`, `uc`, `smn`, `cap`, `nail`, `phoneBox` sind entfernt, Glättung, `push`, `u/n`-Rahmen, Klick-Ring und `endA` bleiben.

Aufwand: Der Referenz-Shader auf der CPU brauchte 25 bis 40 ms je Bild. Die Umsetzung rechnet auf der GPU in zwei Durchgängen (Abschnitt 11) und braucht im Hauptthread 0,1 bis 0,3 ms je Bild.

## 7. Hochformat / Mobil

Dieselben Pässe, keine zweite Fassung. Die Komposition (Handy, Daumen, Finger, Arm) ist im Pass-Raum fest, für Hochformat wählt man nur einen anderen Bühnenausschnitt. Festgelegt in `scenes/ende/kamera.js`:

- Ausschnitt `x 562, w 566` (Daumen bei x ≈ 585, Fingerkuppen bis x ≈ 1105), Maßstab `f = min(Breite / 566, (Höhe − Platz oben − 100) / 620, 1,25)`, mittig.
- Oben bleibt Platz für Titel und Knopf (`titelPlatz`: Rand, Titel zwei Zeilen, Abstand, Knopf 48, Abstand 24, bei 390 × 844 rund 209 px). Das Handy beginnt darunter, der Unterarm läuft unten aus der Bühne (die Pässe tragen ihn bis y 1400).
- Die Zeigehand zielt im Hochformat auf die untere rechte Fensterecke statt auf 1460/1020.
- Titel und Knopf liegen quer unten links wie im Design, hoch oben links. Sie berühren weder Handy noch Hand.

## 8. Kamera, Rig, Licht (zum Neu-Rendern)

Quelle: `/Users/abu/Company/archiv/hand/hand.blend` (Blender 5.2) mit allen Skripten in `archiv/hand/scripts/`.

- Kamera `CamMaster` (Handy-Hand): Linse 85 mm, Sensor 36 mm (horizontal), Position (0; −0,7252; 0) m, Drehung (90°, 0, 0), **Skalierung x = −1** (Spiegelkamera: macht aus der Blender-Rechtshand die Linkshand im Bild), Shift (−0,125; −0,234375), Auflösung 1920 × 2100 (= 1,5 × 1280 × 1400), Clip 0,05–5 m. Handy-Vorderseite liegt 0,7213 m vor der Kamera.
- Handy: 71,6 × 147,6 × 7,8 mm, Eckenradius 11,5 mm, Mitte im Ursprung, im Pass als Holdout (Skalierung 0,98/1/0,99).
- Licht: Key (Fläche 0,6 m, 18 W) bei (0,6; −0,55; 0,75), Rim (9 W) bei (0,55; 0,5; 0,2), Fill (3,4 W, 1,0 m) bei (−0,6; −0,65; 0,2), Welt weiß 0,05. Cycles, 192 Samples, Entrauschen, Standard-Farbverwaltung, transparenter Film.
- Aux-Pass (Emission): R = `Nx_Welt · 0,5 + 0,5`, G = `Nz_Welt · 0,5 + 0,5`, B = `(Tiefe − 0,7213) · 5 + 0,5`, A = Alpha. `pack3.py` macht daraus Bildraum-Normalen (x gespiegelt) und `z` in mm.
- Rig: 3 Knochen je Finger, 3 Daumen, Hand, Arm; Pose als 31-Parameter-Vektor (`q_hold.json`, Vorwärtskinematik in `handlib.py`). Zeigehand: `point_q.json` (Pose + Kamera `CamPoint`: Linse 85 mm, Abstand 0,7213 m, Sensor `36 · W / 1280` mm, damit die Dichte bei 4,19 px/mm bleibt und nur das Sichtfeld mit der Breite wächst; Spitze bei Pixel 64/450, Spin 8° macht den Unterarm waagerecht).
- Befehle (aus `archiv/hand/scripts/`, Python mit numpy, scipy, Pillow, OpenEXR):

```
blender -b ../hand.blend --python render_passes.py -- q_hold2.json out/hold 192 1920 2100 lt_hold.json
python3 pack3.py out/hold out/pk hold --scale 1.5 --q 88 --pct 80 --gain 0.78 --phone 650,90,300,620,48
blender -b ../hand.blend --python qpoint.py -- point_q.json out/point passes 1700 1000 192
python3 pack3.py out/point out/pk point --scale 1.0 --q 88 --pct 80 --gain 0.78 --anchor 64,450
```

Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz / Credits

Basismodell: „Hand – Realistic“ aus dem Blender-Studio-Paket **Human Base Meshes v1.4.1**, Autor Dan Ulrich, Lizenz **CC0** (kein Nachweis nötig, wird hier trotzdem genannt). Quelle: https://mirror.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.4.1.zip. Alles Weitere (verlängerter und aufgeweiteter Unterarm, Rig, Gewichte, Pose, Nägel, Hautfalten, Material, Licht, Render, Pässe) ist eigene Arbeit. Es wurde kein generiertes Modell und keine fremde Fotografie benutzt.

## 10. Bekannte Grenzen

- Die Kuppe des kleinen Fingers sitzt am rechten Handyrand (0 px Überstand), nur Zeige-, Mittel- und Ringfinger ragen über den Rand. Die Pose mit allen vier über dem Rand hätte den kleinen Finger verdreht (Kollision mit dem Ring).
- Beide Hände sind Linkshände (Spiegelkamera, wie im Design). Für eine Rechtshand beim Zeigen: `b = −b` (Abschnitt 5).
- Die Zeigehand kann bei Zeigerposition rechts der Handymitte auf die Finger der Haltehand fallen. Der Shader nimmt die Haltehand dort heraus (Verdeckung, Abschnitt 11), der Autopilot bleibt bei `x 780–860, y 330–470`.
- Zwischen Daumen und Zeigefinger der Zeigehand sitzt ein kleiner Haut-Zipfel (Gewichtsübergang am Daumengrundgelenk), bei `PS 0,62` nur ein Punktpaar groß.
- `lum` ist für ein Licht von oben links gebacken. Das Zeigerlicht verschiebt nur Glanz und Helligkeit, keine Schlagschatten.
- Ohne WebGL2 (Fallback) fehlen Zeigerlicht und die Verdeckung der Haltehand durch die Zeigehand.

## 11. Umsetzung in der Landing (`scenes/ende/`)

- `hand.laden()` lädt beide Pässe auf Abruf (stage.js ab P > 0,75). Texturen als R8, Zeichnen als zwei WebGL2-Ebenen (`back` unter, `front` über dem Handy mit `mix-blend-mode: difference`).
- Je Ebene zwei Durchgänge: (1) ein Texel je Zelle des 2,5-px-Rasters mit dem Ton aus `lum`, `a`, `nx`, `ny`, `z` (GAM 0,6, CON 1,25, RIM 0,45, EDW 3,4, EDV 1,0), Zeigerlicht an der Fingerspitze, Verdeckung durch die Zeigehand und Ruhe unter Titel und Knopf; (2) Punkte je Zelle (Bayer 4 × 4, Hash-Zufall 0,15, Größe 0,9 bis 2,4 Bühnen-px) mit analytischer Kante auf Gerätepixel. Gezeichnet wird nur bei geänderten Eingaben.
- Ruhe (T-17): Unter Titel und Knopf (`data-quiet`) fällt der Ton über 56 px auf 0, so liegen dort nie Punkte hinter der Schrift (Kontrast 18,9:1 und besser an allen 240 Zeigerpunkten, `tools/qa/hand/sweep.mjs`).
- Autopilot (T-17): x 820 ± 40, y 400 ± 70 als Dreieckswelle mit Periode 8 s (35 px/s), nie länger als 0,5 s über einer Textzeile. Touch: nur Tipps ziehen die Hand an (ein Wisch zum Scrollen nicht), nach 1,5 s zurück in den Autopiloten. `reduce`: kein Autopilot, nur der echte Zeiger bewegt die Hand.
- Zeiger (F-18.3): `pointer` über Handy und Knopf, sonst `none`, solange die Hand den Zeiger ersetzt, danach normal.
- QA-Haken: `window.__landing.dbg.hand()` (Modus, Spitze, Zeit), `dbg.gpuT = true` misst die GPU-Zeit, `dbg.noPoint = true` blendet die Zeigehand aus (Maskenmessung).
- Prüfwerkzeuge: `tools/qa/hand/` (`shoot`, `sweep`, `perf`, `mask`, `kontakt`, `video`, `cursor`, `zustand`, `log`).
