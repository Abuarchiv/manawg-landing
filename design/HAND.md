# HAND: realistische Hände aus Blender

Stand 2026-10-07, sechster Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus gerenderten Daten-Pässen (Leuchtdichte, Alpha, Normale, Tiefe); die Engine zeichnet daraus weiter Halbton-Punkte mit Zeigerlicht. Struktur wie in der Design-Referenz: linke Hand hält das Handy von hinten, Daumen schräg über der linken Rahmenkante, breiter Daumenballen links bis zur Handyunterkante, gestaffelte Fingerkuppen am rechten Rand, Handgelenk und Unterarm laufen unter dem Handy fast senkrecht nach unten; rechte Zeigehand von unten rechts, Zeigefinger steil zur Spitze bei (794, 301), übrige Finger eingerollt, Daumen angelegt, Faust vor dem Bildschirm, Unterarm in etwa 45° zur unteren rechten Ecke.

## 0. Was sich im sechsten Durchgang geändert hat

Die Jury hat den fünften Stand (c961d10) mit 5/10 bewertet. Modell (MPFB-Mann), Rig, Pass-Format und Shader bleiben; geändert sind Netz-Korrekturen, Gewichte, Posen, Haut und Messung. Vergleich vorher/nachher: `archiv/hand/v3/doc4/vorher_nachher.png`.

- **Hautkeil über dem Daumen:** stammte vom Zeigefinger-Mittelhandknochen hinter dem Handy, der links vom Rahmen über der Daumenkuppe hervorschaute. Die Pose hält ihn jetzt rechts vom Rahmen (Strafterm `wedge`, 20 je Punkt), und `render4.py` maskiert zusätzlich alle Nicht-Daumen-Punkte hinter der Handy-Vorderseite links von x 656 oberhalb der Daumenkuppe als Holdout (Attribut `hold`). Links vom Rahmen ragt oberhalb der Kuppe nichts mehr heraus.
- **Einschnürung unter dem Daumenballen:** Ursache war das Daumengrundglied, das als Wurst vor dem Handy bis y 680 hing, während das Handgelenk dahinter weiter rechts lag. Neu: Ziel für das Daumen-Grundgelenk (MCP) links unten am Rahmen, Hand um die Längsachse auf −27° gerollt, Handgelenk-Ziel x 640, Konturterm je 20-px-Band (x 560–590, ab y 660 höchstens 570) mit Glattheitsterm (Sprung ≤ 6 px). Gemessen aus `a` (`v3/scripts/leftrows.py`): linke Kontur von y 560 bis 790 zwischen x 559 und 573, Zeile zu Zeile höchstens 4 px Änderung, kein Hals, keine waagerechte Unterkante.
- **Daumen und Ballen schlanker** (`v3/scripts/sculpt4.py`, im Ruhenetz): Daumen-Grund-/Endglied radial auf 0,72/0,86 um die Knochenachse, Ballen um den Daumen-Mittelhandknochen auf 0,6 eingezogen (zur Handwurzel hin auslaufend 1,25–1,45, damit kein Absatz entsteht). Daumen-Endgelenk per Taubin-Glättung (ohne Volumenverlust) entknotet, IP-Beugung auf höchstens 40° begrenzt (die 72° des fünften Stands quetschten die Haut hinter dem Nagel zu einem Knoten). Keine Venen am Daumen.
- **Kuppen rechts:** Zeige-, Mittel-, Ring- und kleiner Finger per IK mit vier Knochen (Mittelhand + drei Glieder; Mittelhandknochen ±25°/±12° begrenzt), damit auch Zeige- und kleiner Finger um die Kante reichen; Strafterm für sichtbare Punkte rechts vom Rahmen außerhalb ±28 px um die Ziele (Lücken, kein Schwanz). Optimiert auf dem unterteilten Netz (29 305 Punkte), Zählterme durch die Dichte (16) geteilt.
- **Gelenkfalten:** Hülle 1,9 mm statt 4,5 mm, Abstand 1,5 mm, also 2–3 flache Querfalten an PIP/DIP/IP statt vieler paralleler Riefen; Daumen-MCP schwächer.
- **Zeigehand:** Daumen per eigener Optimierung (`opt_pthumb.py`, Raster + Nelder-Mead, Durchdringung per BVH) angelegt, Spitze am Mittelglied des Mittelfingers. Hand um die Zeigefingerachse auf −80° gerollt: Sicht auf Handrücken mit Knöchel-Plateaus, eingerollte Finger liegen hinter der Hand, Faust in der Soll-Box. Größe 0,44 statt 0,42. Unterarm weniger gestreckt (1,5/1,3 statt 1,9/1,4), dafür 1,2–1,3-fach dicker; Strecksehnen und MCP-Knöchel zusätzlich modelliert (`sculpt4.py`, `tendons`), Brachioradialis-Masse proximal +22 %.
- **Haut** (`v3/scripts/skin4.py`): zusätzlich großflächige Tonvariation (Noise 22/m, Overlay 0,3), Rauigkeit 0,44–0,58 mit Noise statt konstant 0,6, Specular 0,42 statt 0,28 (feuchter Hautglanz statt Gips), Bump 0,42; Nägel 0,36 Rauigkeit mit weicher Glanzlinie. Poren (Voronoi 0,45 mm) und Falten bleiben unter der Halbtonzelle (2,5 px ≈ 0,6 mm).

Grundlage aus dem fünften Durchgang (weiter gültig): MPFB-Mann, Rig `default` mit detailed helpers, Herauslösen der Unterarme (`extract.py`), Unterteilung 2 (`bake_sub.py`), `sculpt3.py` (Beugesehnen, Brachioradialis, Elle-Kopf, Strecksehnen, Knöchel, Fingerbeeren, eigene Nagelmaske), Corrective Smooth + Unterteilung 1 beim Render, Licht ohne Rim, Tonkurve mit weicher Schulter (`pack5.py`).

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 1960 × 2658, Kachel 980 × 1772, Maßstab 1,5, `origin [341,3, 218,7]`, `bottomY 1400`) | 61 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 4304 × 774, Kachel 2152 × 516, Maßstab 1,0, `origin [−12, −36]`) | 58 kB |
| Summe | | 119 kB (Grenze 600 kB) |

Schlüssel, Kachelnamen, Kodierung, `space`, `phone`, `screen`, `bottomY` und die Bühnenkoordinaten sind unverändert; geändert haben sich nur Kachelmaße, `origin` und Inhalt. Nichts ist abgeschnitten: die Handy-Hand endet unten an `bottomY 1400`, der Unterarm der Zeigehand reicht 1180 Bühnen-px weit (Sprite 2139 px × 0,55) und damit über das Verblassen (520 + 560) hinaus.

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

Linke Hand im Bild (MPFB-Rechtshand hinter der Spiegelkamera), Handgröße 1,0 des MPFB-Mannes (fünfter Stand 1,06). Gemessen im Bühnenraum aus `a`/`origin` (`leftrows.py`, `measure4.py`, `hold3.py`; Soll aus der Referenz in Klammern):

- **Daumen:** äußerster Punkt vor dem Handy bei y 450, **21 px** über dem Rahmen (Soll 15–25 px, y 400–460); obere Kontur der Kuppe ab y 420. Endglied 71°, Grundglied 85° zur Waagerechten, IP 40° gebeugt, Nagel zur Kamera.
- **Linke Kontur (Daumenballen bis Handgelenk):** x 629 (y 420, Kuppe) → 590 (y 480) → 573 (y 550) → **559 (y 610)** → 569 (y 660) → 572 (y 700) → 559 (y 790). Durchgehend leicht konvex, ohne Absatz bis unter die Handyunterkante (Soll ≈ 570, ≥ 560).
- **Kuppen rechts:** vier Fingerenden mit Lücken; y-Bereiche rechts von x 953: 229–279 / 294–347 / 372–423 / 439–500, Lücken **15 / 25 / 16 px**, Überstand über x 950: **29 / 33 / 33 / 29 px** (Soll 28–48), kleiner Finger am kürzesten. IK-Ziele der Fingerspitzen (972, 246), (974, 326), (968, 402), (966, 476).
- **Handgelenk und Unterarm:** Handgelenk-Knochen bei (659, 797), Unterarm 10° aus der Senkrechten nach links unten, bei y 800 von x 556 bis 767 (211 px = 50 mm), konisch zum Ellbogen hin, Sehnen und Beugefalten am Handgelenk.
- Die Handfläche liegt hinter dem Handy (Holdout). Links vom Rahmen oberhalb der Daumenkuppe ist nichts mehr sichtbar (Pose + Maske `hold`).

**Vorn/hinten** wie bisher im Shader aus `z` und Handy-Silhouette (`vorne = sdf < 4 && z < 1,5 mm`); vorne liegt nur die Daumenkuppe.

## 5. Zeigehand (`point`)

Rechte Hand im Bild (MPFB-Linkshand hinter der Spiegelkamera), Handgröße 0,44 des MPFB-Mannes (die Referenz zeigt die Zeigehand deutlich kleiner als die haltende Hand). Pose: Zeigefinger fast gestreckt (MCP −2°, PIP 10°, DIP 6°), Mittel-/Ring-/kleiner Finger eingerollt (78/100/50, 82/100/50, 86/95/48), **Daumen angelegt** (`finger1-1 [28,6, 26,3, 32,9]`, `finger1-2 [53,5, 0, −15,2]`, `finger1-3 [40, 0, 0]`, Spitze am Mittelglied des Mittelfingers, kollisionsfrei), Hand auf −80° um die Zeigefingerachse gerollt (Sicht auf Handrücken, Knöchel oben, eingerollte Finger hinter der Hand), Zeigefinger 12° in die Bildschirmebene geneigt, Unterarm 25° zur Kamera ansteigend, Unterarmknochen 1,5/1,3-fach lang und 1,2/1,3-fach dick.

- Sprite-Raum unverändert: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger; `origin [−12, −36]`, Kachel 2152 × 516 bei Maßstab 1,0 (7,62 Sprite-px/mm, mit `PS 0,55` = 4,19 Bühnen-px/mm wie die Handy-Ebene).
- Platzierung wie in der Engine (`u = normalize(1460 − ht.x, 1020 − ht.y)` usw., Abschnitt 6).
- **Messwerte bei Spitze (794, 301)** (`v3/scripts/fistbox.py`, `measure4.py`): Zeigefinger **52°** über der Waagerechten (Soll 50–55°); Faust einschließlich Zeigefingerwurzel und Handgelenk **x 798–926**, y 336–550 (Soll Faust x 800–930, y 360–510; fünfter Stand x 754–930); Unterarm **45°** zur Ecke, 118 px breit. Breite quer zum Arm (Sprite-px): Handgelenk 147, +150 px 175, +300 px 211 (1,43-fach, Brachioradialis-Bauch), +600 px 295. Handgelenk zu Hand (inkl. eingerollter Finger) 0,59; zur Mittelhand allein ≈ 0,65.
- Die Textanfänge der Liste („Küche wischen“, „Mikas Bruder …“) bleiben frei; die Faust beginnt bei x 798.
- **Verblassen:** wie im vierten Durchgang muss die Engine `300`/`420` in `drawHands` auf **`520`/`560`** setzen (der Referenz-Shader `v2/scripts/preview.html` macht das über `fs`/`fl`).
- Helligkeit: Perzentil 99,5 → 0,8 mit weicher Schulter, keine Rampe mehr.

## 6. Halbton-Shader (Referenz, aus `preview.html`)

Lauffähige Referenz: `/Users/abu/Company/archiv/hand/v2/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/v2/scripts/preview.html?b=../out/<ordner>/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `fs`/`fl` (Verblassen der Zeigehand), `ascii=1`, `mx/my/px/py`). Geprüft bei 1440 × 900 und 390 × 844 (Ausschnitt `view=560,40,540,1170`). Vergleichsbild (Design / Halbton / Luminanz): `archiv/hand/v3/doc4/vergleich.png`.

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

Einbau in `hero.js`: `holdBack`, `holdFront`, `point`, `S`, `KS`, `FR`, `uc`, `smn`, `cap`, `nail`, `phoneBox` entfallen. In `drawHands` bleiben `tg`/`s.ht`-Glättung, `push`, `u/n`-Rahmen, `ink`, die Zellschleife, `dot`, der Klick-Ring und `endA`. Die Schleife läuft über die belegten Zellen (12er-Raster aus `a`, im Referenz-Shader `occ`) statt über SDF-Masken.

Aufwand: Referenz-Shader braucht in Chromium (M3, ohne Optimierung) 25–40 ms je Bild für beide Hände. Billiger: Alpha, `lum`, Normale, `front`, `edge`, `onScreen`, `cov` der Handy-Hand je Zelle einmal beim Laden vorberechnen (die Zellen sind fest); je Bild bleibt nur die Zeigerlicht-Rechnung. Die Zeigehand muss je Bild neu gesampelt werden, sie bewegt sich.

## 7. Hochformat / Mobil

Dieselben Pässe, keine zweite Fassung. Die Komposition (Handy, Daumen, Finger, Arm) ist im Pass-Raum fest; für Hochformat wählt man nur einen anderen Bühnenausschnitt. Geprüft mit Ausschnitt `x 560, y 40, w 540, h 1170` auf 390 × 844 (Maßstab 0,72, Handy 217 × 447 px): Handy mittig, Daumenkuppe am linken Rahmen, Fingerkuppen rechts, Unterarm der Handy-Hand läuft links unten aus dem Bild, die Zeigehand liegt auf dem Bildschirm und ihr Arm läuft rechts hinaus. Höhere Ausschnitte (bis y 1400) funktionieren, darunter blendet der Arm der Handy-Hand aus. Schriftzug und Button gehören dort unter oder neben die Arme, sie sind nicht Teil der Pässe.

## 8. Kamera, Rig, Licht (zum Neu-Rendern)

Arbeitsordner `/Users/abu/Company/archiv/hand/v3/` (Blender 5.2 mit MPFB 2.0.17, Python-Werkzeuge aus `v2/venv`). Kameras und Pass-Ausgabe kommen unverändert aus `v2/scripts/scene2.py` und `build_common.py` (`CamMaster` mit Spiegelung, `make_point_cam`, `render_pass_pair`).

- Modell: `mk_mpfb.py` (Mensch, Makros eingebacken, Rig `default` mit **detailed helpers**, sonst passt MPFB das Rig nicht an die Makros an) → `extract.py` → `bake_sub.py` → `sculpt3.py` → `hands_sc.blend` → `sculpt4.py` (`blender -b hands_sc.blend --python scripts/sculpt4.py -- hands_sc4.blend 190`; grobes Netz für Schnelltests: `hands_male.blend` → `hands_male4.blend` mit 12) → `hands_sc4.blend` (Objekte `ArmL`, `ArmR`, Rig `Human.rig`).
- Bone-Achsen im MPFB-Rig: Finger `X` = Beugung (+), `Z` = Abspreizung; Daumen `finger1-*`: `X` quer über die Handfläche, `−Z` zur Handfläche; `wrist`: `X` radial (+), `Z` Beugung (+). `finger1` = Daumen, `finger2..5` = Zeige- bis kleiner Finger, `metacarpal1..4` = Mittelhand Zeige- bis kleiner Finger.
- Posen: `q4_hold_final.json` (Handgelenk, Richtung, Skala 1,0, FK für Handgelenk und Daumen, IK-Ziele der Kuppen mit Kette 4), `q4_point_final.json`. Licht: `lights/L2.json` (Handy-Hand), `lights/LP1.json` (Zeigehand). Cycles 192 Samples, Entrauschen, transparenter Film, Pixelfilter 1,0. Render mit `render4.py` (Haut `skin4.py`, Keil-Maske).

```
cd /Users/abu/Company/archiv/hand/v3
blender -b hands_sc4.blend --python scripts/opt_hold4.py -- q4_h19.json q/q4_h19_o.json 400   # Hand + Finger (dens 16)
BL=hands_sc4.blend IT=600 ./qr.sh q4_h26        # Daumen (opt_thumb4.py, MCP-Ziel, IP <= 40°) + Schnellansicht
blender -b hands_sc4.blend --python scripts/opt_pthumb.py -- qp4_2.json q/qp4_2.json 200   # Daumen Zeigehand
BL=hands_sc4.blend ./rh4.sh F4h q4_hold_final.json 192 100 lights/L2.json     # Render + Pack Handy-Hand
BL=hands_sc4.blend ./rp4.sh F4p q4_point_final.json 192 100 lights/LP1.json   # Render + Pack Zeigehand
./comp.sh F4h F4p fin4                         # Packs zusammenlegen, Faust-Messung, Luminanz im Bühnenraum
../v2/venv/bin/python scripts/leftrows.py out/fin4/pk    # linke Kontur je 10 px
../v2/venv/bin/python scripts/measure4.py out/fin4/pk    # Kuppen, Lücken, Handgelenk/Unterarm
../v2/venv/bin/python scripts/edgecheck.py out/fin4/pk hold   # Saum-Prüfung
./ht.sh fin4                                   # Halbton 1280x800, 1440x900, 390x844
```

Halbton-Vorschau: Dateien nach `archiv/hand/v2/out/c_<tag>/` kopieren, Server `python3 -m http.server 4290` in `archiv/hand`, dann `v2/scripts/shot.mjs "b=../out/c_<tag>/&px=794&py=301&mx=794&my=301" out.png 1280 800 794 301` (`PAGE=v2/scripts/preview.html`). Geprüft bei 1280 × 800, 1440 × 900 und 390 × 844 (`view=560,40,540,1170`); Bilder in `archiv/hand/v3/doc4/` (`ht.sh` erledigt Kopie, Server und alle drei Größen).

Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz und Modellwahl

Basismodell: **MPFB 2.0.17** (MakeHuman Plugin for Blender), Ausgabe der Basis-Assets und Ziele unter **CC0**; Paket `archiv/hand/mpfb/add-on-mpfb-v2.0.17.zip`. Alles Weitere (Herauslösen, Unterteilung, anatomische Ergänzungen, Nägel, Material, Posen-Optimierung, Licht, Render, Pässe) ist eigene Arbeit. Kein generiertes Modell, keine fremde Fotografie; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

**Vergleich** (`archiv/hand/v3/doc/modellwahl.png`, gleiche Haut, gleiches Licht, vier Ansichten): MPFB Standard (androgyn, schmale lange Finger), MPFB Mann (breitere Hand, kräftigere Finger, modellierte Nagelbetten, Daumenballen, natürlichere Proportionen) und das bisherige „Hand – Realistic“ (Human Base Meshes; Sehnen auf dem Handrücken, aber eigenes Rig ohne Mittelhandknochen). Gewählt: **MPFB Mann**, weil Proportionen und Rig (echte Mittelhandknochen, Unterarm mit zwei Segmenten, Körpergewichte) natürlicher verformen und die Hand ohne Unterarm-Streckung und Knochen-Kürzungen in die Pose passt; die Sehnen und Knöchel, die das alte Netz voraus hatte, ergänzt `sculpt3.py`. Im sechsten Durchgang bestätigt: Die Mängel des fünften Stands (Keil, Hals, Daumenknoten, Kuppen) waren Pose- und Gewichtsfragen, kein Modell-Limit; die Mittelhandknochen des MPFB-Rigs werden jetzt sogar gebraucht (IK-Kette 4 für die Kuppen). Ein Wechsel zurück zum Human-Base-Meshes-Netz (ohne Mittelhandknochen) hätte das verhindert.

## 10. Bekannte Grenzen

- Die Zeigehand ist wie in der Referenz deutlich kleiner als die Handy-Hand (0,44 zu 1,0). In echter Perspektive wäre die vordere Hand eher größer; die Faust-Box der Referenz lässt kaum mehr zu.
- Das Daumengrundglied steht steiler als in der Referenz (85° statt etwa 60–70°); ein schrägerer Daumen schiebt den Ballen wieder links über x 560 hinaus. Die Unterkante des Grundglieds liegt vor dem Ballen und zeichnet sich als weiche Falte ab (anatomisch richtig, aber sichtbar).
- Lücken zwischen den Kuppen 15–25 px statt 6–12 px; die Kuppen sind von vorn gesehene Fingerenden ohne sichtbaren Nagel.
- Die ulnare Kontur der Handy-Hand unter dem Handy läuft weiterhin als Gerade von der Handy-Ecke nach links unten; der Knick zur Unterarmkante liegt erst bei y ≈ 820, also unter der Bühnenkante, und wird im Bild größtenteils vom Unterarm der Zeigehand verdeckt.
- `lum` ist für ein festes Licht gebacken; das Zeigerlicht verschiebt nur Glanz und Helligkeit. Der Halbton (Zelle 2,5 px) löst Poren und Gelenkfalten nicht auf; sie wirken nur in `lum`.
- Haut ohne Haare und ohne echte Albedo-Texturen (MPFB-Hauttexturen sind nicht im Paket); Tonvariation und Poren sind prozedural.
