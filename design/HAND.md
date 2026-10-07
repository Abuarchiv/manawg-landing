# HAND: realistische Hände aus Blender

Stand 2026-10-07, achter Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus gerenderten Daten-Pässen (Leuchtdichte, Alpha, Normale, Tiefe); die Engine zeichnet daraus weiter Halbton-Punkte mit Zeigerlicht. Struktur wie in der Design-Referenz: linke Hand hält das Handy von hinten, Daumen schräg über der linken Rahmenkante, breiter Daumenballen links bis zur Handyunterkante, gestaffelte Fingerkuppen am rechten Rand, Handgelenk und Unterarm laufen unter dem Handy fast senkrecht nach unten; rechte Zeigehand von unten rechts, Zeigefinger steil zur Spitze bei (794, 301), übrige Finger eingerollt, Daumen angelegt, Faust vor dem Bildschirm, Unterarm in etwa 45° zur unteren rechten Ecke.

## 0. Was sich im achten Durchgang geändert hat

**Übernommener Stand (31f6074):** `hold.*` aus dem achten Durchgang (7ad67d0), `point.*` aus dem siebten (e7a1818). Die Zeigehand des achten Durchgangs war im Halbton eine weiße Umrisszeichnung mit Tuschelinien (Jury 5/10); die Fassung des siebten hat echte Volumenschattierung. Die Tintenkurve aus Abschnitt 6 gilt deshalb nur als Vorschlag; die Engine entscheidet die Halbton-Abbildung selbst.

Die Jury hat den siebten Stand (e7a1818) mit 6/10 bewertet. Offen waren die Kuppen, der Halbton der Zeigehand, die Faust, Reste am Daumen, die Hautfahne unter dem Handy und die Engine-Werte. Modell (MPFB-Mann), Pass-Format und Bühnenkoordinaten bleiben gleich. Vergleich und Ausschnitte liegen in `archiv/hand/v3/doc8/` (jeweils Referenz | vorher e7a1818 | neu Halbton | neu Luminanz).

- **Kuppen aus einer eigenen Finger-Hand.** Die Handy-Hand wird jetzt in zwei Teilen gerendert (`v3/scripts/render8.py`, `cut`):
  - Der Haupt-Pass zeigt die Hand ohne die Finger 2–5 (`no_fingers`).
  - Der zweite Pass enthält nur die Finger 2–5 einer zweiten, kleineren Hand (`only_fingers`, Größe 0,5, `fs8` mit eigener Dicke und Länge je Finger). Diese Hand liegt hinter dem Handy, mit den Fingern zur rechten Kante.
  - Die Finger wickeln sich um die Kante: Grundglied hinten, Mittelglied an der Seite, Endglied mit dem Nagel zur Kamera auf dem Rahmen. Man sieht also Mittel- und Endglied von der Seite, mit Nagel und DIP-Knöchel, statt einer Kuppe von vorn.
  - Die Schnittkante liegt hinter dem Handy (Kostenterm `cut_vis_w` in `fing8.py`). `pack8.py --over` legt beide Pässe zusammen (Beauty und Aux premultipliziert).
  - Die Pose kommt aus `fing8.py` (Zielspitze, Durchdringung, Höhe und Überstand je Finger, Mindestlänge). Den kleinen Finger heben `metacarpal4` −10° und ein längeres Grundglied.
- **Zeigehand-Halbton hell, nur Fugen dunkel.**
  - Licht frontal von oben links (`lights/LP8d.json`, Fülllicht 1,0).
  - Packen mit S-Kurve `--sig 0.4,8,0.96`, also Licht hoch und Maximum 243 ohne Clipping.
  - Fugen als Tiefensprung- und Knickkanten in `lum` (`--ink 1.3 --inkn 1.5 --inkw 3 --zt 0.15 --inke 4`).
  - Im Referenz-Shader gilt über dem Bildschirm die neue Tintenkurve `inkOf(v) = ((PW − v) / (PW − PB))^PG` mit `PW 1,05`, `PB 0,4` und `PG 1,0` (Abschnitt 6). Lichtflächen bleiben so weiß, Kontur und Fugen dunkel. Das alte `tn`/`vd` ließ selbst bei `v = 1` noch 37 % der Zellen punkten, daher kam das Schachbrett.
- **Faust neu:** Die Hand ist auf −160° um die Zeigefingerachse gedreht, mit Größe 0,38 statt 0,44. Zeigefinger-Grundglied und Mittelglied sind 1,3-/1,1-fach lang, die eingerollten Finger enger (MCP 86/92/98).
  - Der Daumen liegt jetzt quer über dem eingerollten Mittelfinger (keine Fingerpistole mehr).
  - Darunter sitzen zwei gestufte eingerollte Finger mit dunklen Fugen.
  - Die Faust beginnt bei x 802 und lässt „Küche wischen“, „Mikas Bruder übernachtet“, den Kalender-Pfeil und den Tab „Austausch“ frei.
- **Daumen-Reste** (`fix7.py` auf `hands_sc7h.blend` → `hands_sc8a.blend`): Der Wulst am Daumen-MCP ist um 1,5 mm eingezogen, die linke Kontur läuft jetzt 573 → 563 → 564 → 563 ohne zweiten Buckel. Der Hautbuckel über der linken Rahmenkante bei y 550–590 ist um 2,2 mm nach links verschoben (rechter Rand jetzt 653 statt 656, das ist die Holdout-Kante des Handys).
- **Hautfahne unter dem Handy** (`hands_sc8b`/`hands_sc8c.blend`): Die ulnare Kontur unter dem Handy ist jetzt eine runde Hypothenar-Wölbung statt einer geraden Diagonale. Sie läuft 816 → 813 → 810 → 805 → 793 → 770 → 743 → 726 (y 710–790) und geht dann in die Taille über. Bei ausgeblendeter Zeigehand liest sie sich als Handballen (`doc8/fin8_ht_nopoint.png`).
- **Engine:** `hero.js` `drawHands` verblasst jetzt mit `520`/`560` statt `300`/`420`. Dazu kommt ein eigener Commit, damit er sich getrennt zurücknehmen lässt.

Grundlage aus dem fünften und sechsten Durchgang (weiter gültig): MPFB-Mann, Rig `default` mit detailed helpers, Herauslösen der Unterarme (`extract.py`), Unterteilung 2 (`bake_sub.py`), `sculpt3.py` (Beugesehnen, Brachioradialis, Elle-Kopf, Strecksehnen, Knöchel, Fingerbeeren, eigene Nagelmaske), Corrective Smooth + Unterteilung 1 beim Render, Licht ohne Rim, Tonkurve mit weicher Schulter (`pack5.py`).

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 1792 × 2676, Kachel 896 × 1760, Maßstab 1,5, `origin [410,7, 226,7]`, `bottomY 1400`) | 60 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 3800 × 648, Kachel 1900 × 432, Maßstab 1,0, `origin [−8, −160]`) | 46 kB |
| Summe | | 106 kB (Grenze 600 kB) |

Schlüssel, Kachelnamen, Kodierung, `space`, `phone`, `screen`, `bottomY` und die Bühnenkoordinaten sind unverändert; geändert haben sich nur Kachelmaße, `origin` und Inhalt. Nichts ist abgeschnitten: die Handy-Hand endet unten an `bottomY 1400`, der Unterarm der Zeigehand reicht 1040 Bühnen-px weit (Sprite 1892 px × 0,55), also bis weit hinter den Bühnenrand (unterer Rand nach 683 px). Am Ende steht das Verblassen schon bei 0,07.

## 2. Koordinaten

Bühne der Engine: 1280 × 800, Handy-Mitte 800/400, 4,19 Bühnen-px je mm in der Handy-Ebene (Handy 71,6 × 147,6 × 7,8 mm, Eckenradius 11,5 mm).

- Handy außen (Silhouette, `Ende` in `overlays.tsx`): `x 650, y 90, w 300, h 620, r 48`.
- Bildschirm, hier kommt die echte App hinein: `x 661, y 101, w 278, h 598, r 37` (Inset 11, wie das Handy-DOM).
- Der Pass-Raum ist die Bühne. Bei Vollbild gilt dieselbe gleichmäßige Skalierung + Verschiebung für Handy-DOM, Canvas und Pässe; die Pässe selbst bleiben unverändert.

## 3. Atlas-Format (beide Dateien)

8-Bit-Grau, WebP. Kacheln laut JSON (`tiles.<name>`: `x, y, w, h, div`). `div = 2` bedeutet halbe Auflösung (bilinear hochskalieren).

| Kachel | Auflösung | Inhalt |
|---|---|---|
| `lum` | voll | Leuchtdichte, sRGB-Anzeigewert 0..1 (Studiolicht oben links, Hautstreuung, Kernschatten; Tonkurve mit weicher Schulter, Lichtseite ≈ 0,8) |
| `a` | voll | Alpha der Hand, straight. Beim Handy-Pass ist das Handy Holdout (2 % schmaler als das DOM): wo das Handy die Hand verdeckt, ist Alpha 0 |
| `nx`, `ny` | halb | Normale im Bildraum, 0..255 = −1..1 (x nach rechts, y nach oben), `nz = sqrt(1 − nx² − ny²)` |
| `z` | halb | Tiefe, 0..255 = −100..+100 mm relativ zur Handy-Vorderseite (Handy-Pass) bzw. zur Fingerspitzen-Ebene (Zeigehand), plus = weiter weg |

Lage in der Bühne: `origin` (Bühnen-px der oberen linken Ecke von `lum`/`a`) und `scale` (Kachel-px je Bühnen-px). Kachel-px `u = (x − origin.x) · scale / div`, `v = (y − origin.y) · scale / div`. Außerhalb der Silhouette sind `lum`, `nx`, `ny`, `z` 12 Bühnen-px nach außen fortgesetzt; immer mit `a` maskieren. Saum-Prüfung (`v3/scripts/edgecheck.py`): Helligkeit im Alpha-Rand minus 3 px innen im Mittel −0,011 (Handy-Hand) bzw. −0,016 (Zeigehand), also kein heller Saum; Randbreite ≤ 2 Kachel-px.

## 4. Handy-Hand (`hold`)

Linke Hand im Bild (MPFB-Rechtshand hinter der Spiegelkamera), Handgröße 0,88 des MPFB-Mannes. Gemessen im Bühnenraum aus `a`/`origin` (`v3/scripts/measure7.py`, `leftrows.py`, `thprobe7.py`; Soll aus der Referenz in Klammern):

- **Daumen:** Grundglied **69°**, Endglied **69°** zur Waagerechten (Soll 60–70°), MCP 41°, IP 47° gebeugt, Nagel zur Kamera. Äußerster Punkt vor dem Handy **18 px** über dem Rahmen bei y 406, obere Kontur der Kuppe ab y 382 (Soll 15–25 px, y 400–460).
- **Linke Kontur (Daumen, Ballen, Handgelenk):** x 573 (y 500) → 563 (y 530–540, Daumen-MCP) → 564 (y 550–580) → 563 (y 600) → 571 (y 640) → 585 (y 690–730, Taille) → 577 (y 770) → 570 (y 790). Es gibt keinen zweiten Buckel am MCP mehr und keinen Wert unter 563. Rechts endet der Ballen bei y 550–590 auf x 652, also hinter dem Rahmen.
- **Kuppen rechts** (eigene Finger-Hand, Zeilen mit Alpha rechts von x 950): y **238–275 / 285–321 / 330–362 / 369–399**. Höhe **37/36/32/30 px**, abnehmend vom Zeige- zum kleinen Finger (Soll 30–38). Überstand über x 950: 36/49/36/29 px. Länge einschließlich Endglied auf dem Rahmen **57/61/54/41 px**, also 1,4- bis 1,7-mal so lang wie hoch. Lücken **10/9/7 px** (Soll 6–12). Die Spitzen liegen bei x 929–937 auf dem Rahmen bzw. der Glaskante, die Nägel zeigen zur Kamera.
- **Unter dem Handy** (Breite der Hand je Zeile): y 710: x 585–816 (230 px), y 740: 583–810 (227), y 760: 580–793 (213), y 780: 573–743 (170), y 790: 570–726 (156). Das Handgelenk hat 0,67 der Breite an der Handy-Unterkante (Soll ≈ 0,6). Die rechte (ulnare) Kontur 816 → 813 → 810 → 805 → 793 → 770 → 743 → 726 ist erst eine runde Hypothenar-Wölbung, dann eine Taille und dann der Unterarm, als S.
- **Unterarm:** Handgelenk-Knochen bei (654, 766), Unterarm 6° aus der Senkrechten nach links unten.
- Die Handfläche liegt hinter dem Handy (Holdout). Links vom Rahmen oberhalb der Daumenkuppe ist nichts sichtbar (Pose + Maske `hold`).

**Vorn/hinten** wie bisher im Shader aus `z` und Handy-Silhouette (`vorne = sdf < 4 && z < 1,5 mm`); vorne liegen die Daumenkuppe und die Fingerkuppen auf dem rechten Rahmen.

## 5. Zeigehand (`point`)

Die Zeigehand ist im Bild die rechte Hand (MPFB-Linkshand hinter der Spiegelkamera), mit Handgröße 0,38 des MPFB-Mannes.

- **Pose:** Zeigefinger fast gestreckt (MCP −2°, PIP 10°, DIP 6°). Grundglied und Mittelglied sind 1,3-/1,1-fach lang, damit die Faust rechts von x 800 bleibt.
  - Mittel-, Ring- und kleiner Finger eingerollt (86/100/50, 92/100/50, 98/95/48).
  - Daumen angelegt (`finger1-1 [28,6, 26,3, 32,9]`, `finger1-2 [53,5, 0, −15,2]`, `finger1-3 [40, 0, 0]`).
  - Die Hand ist auf **−160°** um die Zeigefingerachse gerollt (Sicht auf die Handflächenseite). Der Daumen liegt so quer über dem eingerollten Mittelfinger, darunter stufen sich zwei weitere eingerollte Finger mit Fugen.
  - `fang 2`, Zeigefinger 12° in die Bildschirmebene geneigt, Unterarm 25° zur Kamera ansteigend und 4° flacher als die Engine-Richtung (`aang −4`). Spec: `v3/q8/td3.json`.
- **Licht und Packen:** Das Licht kommt frontal von oben links (`lights/LP8d.json`: Key `[0,3, −0,8, 0,3]` mit Größe 0,4 und Leistung 14, Fülllicht 1,0). Gepackt wird mit `pack8.py --gain 0.88 --lgamma 0.68 --sig 0.4,8,0.96 --ink 1.3 --inkn 1.5 --inkw 3 --zt 0.15 --inke 4`. Die Fugen (Daumen über den Fingern, Fingerspalten, Zeigefinger-Grundgelenk) sind als dunkle Linien in `lum` eingebacken.
- Sprite-Raum unverändert: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger. Dazu `origin [−8, −160]` und Kachel 1900 × 432 bei Maßstab 1,0 (7,62 Sprite-px/mm, mit `PS 0,55` = 4,19 Bühnen-px/mm wie die Handy-Ebene).
- Platzierung wie in der Engine (`u = normalize(1460 − ht.x, 1020 − ht.y)` usw., Abschnitt 6).
- **Messwerte bei Spitze (794, 301)** (`v3/scripts/fistbox.py`, `fistbox7.py`):
  - Zeigefinger **51,2°** über der Waagerechten (Soll 50–55°).
  - Faust **x 802–935, y 337–548** (Soll x 800–930, y 360–510). Der untere Wert ist der Ring 60–250 px um die Spitze und enthält den Handballen.
  - Unterarm **42,5°** zur Ecke, 97 px breit.
  - Tab „Austausch“ (x 875–935, y 668–692) zu **0 %** bedeckt (vorher 61 %).
  - Kein Loch in der Faust (Alpha-Minimum im Fenster bei (838, 487) = 1,0).
- **Helligkeit:** Die Leuchtdichte über dem Bildschirm liegt im Mittel bei 216, im 5-%-Perzentil bei 101 und im Maximum bei 243. 67 % der Fläche liegen bei ≥ 225 (Lichtflächen), 6 % unter 120 (Fugen und Kernschatten). Im Halbtonbild (Referenz-Shader, 1280 × 800) ist die Zeigehand über dem Bildschirm im Mittel 221 hell, und 85 % der Zellen sind weiß.
- **Verblassen:** `520`/`560` (Engine `hero.js` und Referenz-Shader `fs`/`fl`).

## 6. Halbton-Shader (Referenz, aus `preview.html`)

Lauffähige Referenz: `/Users/abu/Company/archiv/hand/v2/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/v2/scripts/preview.html?b=../out/<ordner>/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `fs`/`fl` (Verblassen der Zeigehand), `ascii=1`, `mx/my/px/py`). Geprüft bei 1440 × 900 und 390 × 844 (Ausschnitt `view=560,40,540,1170`). Vergleichsbild (Design / Halbton / Luminanz): `archiv/hand/v3/doc8/vergleich.png`, Ausschnitte `doc8/crop_{kuppen,faust,daumen,handgelenk}.png`.

`dot()`, `HB`, `hsh`, `cl`, `ss`, `lightF`, `ink`, `step 2,5` bleiben aus der Engine. Neu ist nur die Herkunft von `v` (Ton 0..1) je Zelle. Abgestimmte Konstanten: `GAM 0,6`, `CON 1,25`, `RIM 0,45`, `EDW 3,4`, `EDV 1,0`, `JIT 0,15` (Engine: 0,4; weniger Zufall = lesbare Finger). Für die Tinte über dem weißen Bildschirm gelten `PW 1,05`, `PB 0,4`, `PG 1,0` (`inkOf`). Ab `v ≥ PW` setzt die Kurve keinen Punkt mehr, unter `PB` volle Tinte.

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
const inkOf = v => Math.pow(cl((1.05 - v) / (1.05 - 0.4)), 1.0);   // Tinte ueber dem Bildschirm: Licht = weiss, Fugen/Kontur dunkel
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
    let vd = inkOf(v); if (edge) vd = Math.max(vd, 0.95);
    dot(cf, x, y, vd * cov, i, j);
  } else { if (edge) v = Math.max(v, lf * al); dot(front ? cf : cb, x, y, v * cov, i, j); }
}

// --- Zeigehand: pro Zelle, immer auf der vorderen Ebene ---
function pointCell(P, screen, x, y, i, j, tx, ty, ux, uy, PS, cf) {   // P = loadHand(point), screen = hold.meta.screen, (tx,ty) Spitze, (ux,uy) Armrichtung
  const { T, samp } = P, dx = x - tx, dy = y - ty, a = (dx * ux + dy * uy) / PS, b = (-dx * uy + dy * ux) / PS;
  const al = samp(T.a, a, b); if (al < 0.15) return;
  const fade = cl(1 - (Math.hypot(dx, dy) - 520) / 560); if (fade <= 0) return;
  let L = samp(T.lum, a, b); L = cl(0.5 + (Math.pow(L, 0.6) - 0.5) * 1.25);
  const lf = lightF(x, y); let v = L * (0.62 + 0.5 * lf);
  const e = 3.4 / PS, edge = Math.min(samp(T.a, a - e, b), samp(T.a, a + e, b), samp(T.a, a, b - e), samp(T.a, a, b + e)) < 0.5, cov = ss((al - 0.2) / 0.5);
  if (sdfRR(x, y, screen) < -1) {                                // wie oben: ueber dem Bildschirm Tinte
    let vd = inkOf(v); if (edge) vd = Math.max(vd, 0.95);
    dot(cf, x, y, vd * cov * fade, i, j);
  } else { if (edge) v = Math.max(v, lf * al); dot(cf, x, y, v * cov * fade, i, j); }
}
```

Einbau in `hero.js`: `holdBack`, `holdFront`, `point`, `S`, `KS`, `FR`, `uc`, `smn`, `cap`, `nail`, `phoneBox` entfallen. In `drawHands` bleiben `tg`/`s.ht`-Glättung, `push`, `u/n`-Rahmen, `ink`, die Zellschleife, `dot`, der Klick-Ring und `endA`. Die Schleife läuft über die belegten Zellen (12er-Raster aus `a`, im Referenz-Shader `occ`) statt über SDF-Masken.

Aufwand: Referenz-Shader braucht in Chromium (M3, ohne Optimierung) 25–40 ms je Bild für beide Hände. Billiger: Alpha, `lum`, Normale, `front`, `edge`, `onScreen`, `cov` der Handy-Hand je Zelle einmal beim Laden vorberechnen (die Zellen sind fest); je Bild bleibt nur die Zeigerlicht-Rechnung. Die Zeigehand muss je Bild neu gesampelt werden, sie bewegt sich.

## 7. Hochformat / Mobil

Dieselben Pässe, keine zweite Fassung. Die Komposition (Handy, Daumen, Finger, Arm) ist im Pass-Raum fest; für Hochformat wählt man nur einen anderen Bühnenausschnitt. Geprüft mit Ausschnitt `x 560, y 40, w 540, h 1170` auf 390 × 844 (Maßstab 0,72, Handy 217 × 447 px): Handy mittig, Daumenkuppe am linken Rahmen, Fingerkuppen rechts, Unterarm der Handy-Hand läuft links unten aus dem Bild, die Zeigehand liegt auf dem Bildschirm und ihr Arm läuft rechts hinaus. Höhere Ausschnitte (bis y 1400) funktionieren, darunter blendet der Arm der Handy-Hand aus. Schriftzug und Button gehören dort unter oder neben die Arme, sie sind nicht Teil der Pässe.

## 8. Kamera, Rig, Licht (zum Neu-Rendern)

Arbeitsordner `/Users/abu/Company/archiv/hand/v3/` (Blender 5.2 mit MPFB 2.0.17, Python-Werkzeuge aus `v2/venv`). Kameras und Pass-Ausgabe kommen unverändert aus `v2/scripts/scene2.py` und `build_common.py` (`CamMaster` mit Spiegelung, `make_point_cam`, `render_pass_pair`).

- Modell: `mk_mpfb.py` (Mensch, Makros eingebacken, Rig `default` mit **detailed helpers**, sonst passt MPFB das Rig nicht an die Makros an) → `extract.py` → `bake_sub.py` → `sculpt3.py` → `hands_sc.blend` → `sculpt4.py` (`blender -b hands_sc.blend --python scripts/sculpt4.py -- hands_sc4.blend 190`; grobes Netz für Schnelltests: `hands_male.blend` → `hands_male4.blend` mit 12) → `hands_sc4.blend` (Objekte `ArmL`, `ArmR`, Rig `Human.rig`).
- Bone-Achsen im MPFB-Rig: Finger `X` = Beugung (+), `Z` = Abspreizung; Daumen `finger1-*`: `X` quer über die Handfläche, `−Z` zur Handfläche; `wrist`: `X` radial (+), `Z` Beugung (+). `finger1` = Daumen, `finger2..5` = Zeige- bis kleiner Finger, `metacarpal1..4` = Mittelhand Zeige- bis kleiner Finger.
- Netz achter Durchgang: wie im siebten (`sculpt7.py`, zweimal `fix7.py` → `hands_sc7h.blend`), dazu dreimal `fix7.py` für die Pose `q/q7_h23.json` → `hands_sc8a.blend` (Daumen-MCP, Ballen am Rahmen), `hands_sc8b.blend` (Hypothenar-Wölbung), `hands_sc8c.blend` (Taille). Die Finger-Hand rendert mit demselben Netz.
- Posen: `q8/main0.json` (Handy-Hand wie `q/q7_h23.json`, mit `cut: no_fingers`), `q8/fp8_s.json` (Finger-Hand: Größe 0,5, Handgelenk (702, 310, 14 mm), Richtung (0, 0, 0), `fs8`, `metacarpal3/4`, FK der Finger 2–5, `cut: only_fingers`), `q8/td3.json` (Zeigehand).
- Licht: `lights/L2.json` (Handy-Hand und Finger-Hand), `lights/LP8d.json` (Zeigehand). Cycles 192 Samples, Entrauschen, transparenter Film, Pixelfilter 1,0. Render mit `render8.py` (= `render7.py` + `cut`).

```
cd /Users/abu/Company/archiv/hand/v3
blender -b hands_sc7h.blend --python scripts/fix7.py -- q/q7_h23.json hands_sc8a.blend '[[557,535,10,-1.5,-1,0],[655,572,12,-2.2,1,0],[790,742,12,2.5,1,0.3],[762,766,12,2.5,1,0.3],{"smooth":[780,750,16,20]}]'
blender -b hands_sc8a.blend --python scripts/fix7.py -- q/q7_h23.json hands_sc8b.blend '[[818,712,7,-3.0,1,0],[800,742,10,1.2,1,0.3],[771,762,10,3.0,1,0.3],[740,780,10,3.5,1,0.3],{"smooth":[790,740,14,15]}]'
blender -b hands_sc8b.blend --python scripts/fix7.py -- q/q7_h23.json hands_sc8c.blend '[[745,794,9,-3.5,1,0.3],[765,782,8,-1.5,1,0.3]]'
blender -b hands_male4.blend --python scripts/fing8.py -- q8/fp8.json q8/fp8_s.json      # Finger-Hand: FK je Finger, Schnittkante hinter dem Handy
./v8.sh q8/fp8_s.json fq8 320 0.09                                                     # vier Workbench-Ansichten der Kuppen
FS=q8/fp8_s.json ./final8.sh                                                           # Haupt-Pass, Finger-Hand, Zeigehand (192 Samples, voll)
PY=../v2/venv/bin/python
$PY scripts/pack8.py out/HM/hold out/fin8/pk hold --over out/HF/hold --scale 1.5 --q 90 --pct 99.5 --gain 0.8 --lgamma 1.0 --detail 0 --phone 650,90,300,620,48 --ink 0
$PY scripts/pack8.py out/PF/point out/fin8/pk point --scale 1 --q 90 --pct 99.5 --gain 0.88 --detail 0 --anchor 60,240 --ink 1.3 --inkn 1.5 --inkw 3.0 --zt 0.15 --inke 4 --sig 0.4,8,0.96 --lgamma 0.68
$PY scripts/measure7.py out/fin8/pk; $PY scripts/fistbox7.py out/fin8/pk; $PY scripts/fistbox.py out/fin8/pk
$PY scripts/edgecheck.py out/fin8/pk hold; $PY scripts/edgecheck.py out/fin8/pk point
./ht7.sh fin8; $PY scripts/htmean8.py out/fin8/pk <scratchpad>/fin8_ht_1280.png   # Halbton 1280x800, 1440x900, 390x844; Mittel unter der Zeigehand
$PY scripts/vergleich8.py                                                              # Vergleich + Ausschnitte
```

Schnellschleifen: `hq.sh` (Handy-Hand), `hq8.sh` (Finger-Hand über Haupt-Pass), `pq.sh` (Zeigehand), `rpk.sh` (Zeigehand nur neu packen), `htq.sh` (Halbton + Ausschnitte). Der erste Screenshot nach einem neuen Ordner weicht ab (Ladezeit), daher schießen `htq.sh` und `ht7.sh` zweimal.

Halbton-Vorschau: Dateien nach `archiv/hand/v2/out/c_<tag>/` kopieren, Server `python3 -m http.server 4290` in `archiv/hand`, dann `v2/scripts/shot.mjs "b=../out/c_<tag>/&px=794&py=301&mx=794&my=301" out.png 1280 800 794 301` (`PAGE=v2/scripts/preview.html`). Geprüft bei 1280 × 800, 1440 × 900 und 390 × 844 (`view=560,40,540,1170`); Bilder in `archiv/hand/v3/doc8/` (`ht7.sh` erledigt Kopie, Server und alle drei Größen).

Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz und Modellwahl

Basismodell: **MPFB 2.0.17** (MakeHuman Plugin for Blender), Ausgabe der Basis-Assets und Ziele unter **CC0**; Paket `archiv/hand/mpfb/add-on-mpfb-v2.0.17.zip`. Alles Weitere (Herauslösen, Unterteilung, anatomische Ergänzungen, Nägel, Material, Posen-Optimierung, Licht, Render, Pässe) ist eigene Arbeit. Kein generiertes Modell, keine fremde Fotografie; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

**Vergleich** (`archiv/hand/v3/doc/modellwahl.png`, gleiche Haut, gleiches Licht, vier Ansichten): MPFB Standard (androgyn, schmale lange Finger), MPFB Mann (breitere Hand, kräftigere Finger, modellierte Nagelbetten, Daumenballen, natürlichere Proportionen) und das bisherige „Hand – Realistic“ (Human Base Meshes; Sehnen auf dem Handrücken, aber eigenes Rig ohne Mittelhandknochen). Gewählt: **MPFB Mann**, weil Proportionen und Rig (echte Mittelhandknochen, Unterarm mit zwei Segmenten, Körpergewichte) natürlicher verformen und die Hand ohne Unterarm-Streckung und Knochen-Kürzungen in die Pose passt; die Sehnen und Knöchel, die das alte Netz voraus hatte, ergänzt `sculpt3.py`. Im sechsten Durchgang bestätigt: Die Mängel des fünften Stands (Keil, Hals, Daumenknoten, Kuppen) waren Pose- und Gewichtsfragen, kein Modell-Limit; die Mittelhandknochen des MPFB-Rigs werden jetzt sogar gebraucht (IK-Kette 4 für die Kuppen). Ein Wechsel zurück zum Human-Base-Meshes-Netz (ohne Mittelhandknochen) hätte das verhindert.

## 10. Bekannte Grenzen

- Die Kuppen kommen aus einer zweiten, kleineren Hand (Größe 0,5, Finger 0,63–0,9 dick), nicht aus den Fingern der Handy-Hand (0,88). Nur so lassen sich Höhe 30–38 px, Lücken 6–12 px und die Sicht auf Mittel- und Endglied mit Nagel verbinden. Ein Finger der 0,88-Hand ist 14–16 mm dick, das sind 55–63 px. Die Verbindung zur Hand liegt vollständig hinter dem Handy. Die Finger wirken dadurch schlanker als der Daumen.
- Die Kuppen-Spitzen liegen bei x 929–937 auf der Glaskante. Über dem weißen Bildschirm zeichnet der Shader sie als feine Kontur, nicht als gefüllte Fläche.
- Die Zeigehand ist wie in der Referenz deutlich kleiner als die Handy-Hand (0,38 zu 0,88). Der Zeigefinger ist mit 1,3-/1,1-fachem Grundglied und Mittelglied etwas lang, damit die Faust rechts von x 800 bleibt.
- Die Faust-Box (Messring 60–250 px um die Spitze) reicht bis y 548, weil sie den Handballen mitzählt.
- Unterarm der Zeigehand 42,5° statt 45°.
- Die Fugen der Zeigehand sind in `lum` als dunkle Linien eingebacken (Tiefensprung und Normalenknick). Die Luminanz wirkt dort gezeichnet, im Halbton sind es die Schattenfugen der Referenz.
- Die Tintenkurve über dem Bildschirm (`inkOf`) ist neu im Referenz-Shader. Die Engine muss sie beim Einbau der Pässe übernehmen; mit der alten Kurve wird die Zeigehand wieder zum Punktraster.
- `lum` ist für ein festes Licht gebacken; das Zeigerlicht verschiebt nur Glanz und Helligkeit. Der Halbton (Zelle 2,5 px) löst Poren und Gelenkfalten nicht auf, sie wirken nur in `lum`.
- Die Haut hat keine Haare und keine echten Albedo-Texturen (MPFB-Hauttexturen sind nicht im Paket). Tonvariation und Poren sind prozedural.
- `fix7.py` gilt nur für die Pose `q/q7_h23.json`. Bei einer neuen Pose der Handy-Hand muss es mit den neuen Bildkoordinaten erneut laufen.
