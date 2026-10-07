# HAND: realistische Hände aus Blender

Stand 2026-10-07, siebter Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus gerenderten Daten-Pässen (Leuchtdichte, Alpha, Normale, Tiefe); die Engine zeichnet daraus weiter Halbton-Punkte mit Zeigerlicht. Struktur wie in der Design-Referenz: linke Hand hält das Handy von hinten, Daumen schräg über der linken Rahmenkante, breiter Daumenballen links bis zur Handyunterkante, gestaffelte Fingerkuppen am rechten Rand, Handgelenk und Unterarm laufen unter dem Handy fast senkrecht nach unten; rechte Zeigehand von unten rechts, Zeigefinger steil zur Spitze bei (794, 301), übrige Finger eingerollt, Daumen angelegt, Faust vor dem Bildschirm, Unterarm in etwa 45° zur unteren rechten Ecke.

## 0. Was sich im siebten Durchgang geändert hat

Die Jury hat den sechsten Stand (8381b42) mit 5/10 bewertet und elf Punkte genannt. Modell (MPFB-Mann), Rig, Pass-Format und Shader bleiben; neu sind die Pose der Handy-Hand (Finger per FK statt IK), die Handgröße, Netzkorrekturen am Daumenballen und Handgelenk, die Zeigehand-Drehung, das Licht der Zeigehand und die Hautfalten. Vergleich und Ausschnitte (Referenz | vorher | neu Halbton | neu Luminanz, 2-fach): `archiv/hand/v3/doc7/`.

- **Kuppen als liegende Fingerglieder:** Die Finger 2–5 werden nicht mehr per IK an Punkte neben der Kante gezogen (das ergab von vorn gesehene Halbkuppeln), sondern je Finger per FK gelöst (`v3/scripts/fing7.py`: Raster + Nelder-Mead über MCP-Beugung, Abspreizung, PIP, DIP; Kosten: Spitze vor dem Rahmen, Durchdringung des Handys, Überstand, Höhe, Bildschirm frei). Die Handlage selbst kommt aus einem Raster über Handgelenk, Richtung, Neigung, Rollen und Handgelenk-Abweichung mit Strafterm für den Handteller im Handy. Die Fingerglieder liegen jetzt schräg um die Kante, die Kuppen greifen auf den Rahmen (bis x ≈ 905–935) und zeigen nach links unten; Mittel- und Endglied sind seitlich zu sehen. Grundglieder 1,04-fach lang, Finger 0,9-fach schlanker (`fsc`, damit die Lücken bleiben).
- **Handgröße 0,88** statt 1,0 des MPFB-Mannes: Nur so passen Daumenkuppe (y ≈ 390–410), Kuppenreihe (y 220–480) und Handgelenk (y ≈ 770) gleichzeitig in die Referenz-Komposition; bei 1,0 stand der Daumen 13 mm zu hoch oder musste im MCP 78° geknickt werden.
- **Daumen über das CMC-Gelenk:** MCP-Beugung von 78° auf 41° begrenzt (`mcp_max`), die Neigung kommt aus dem Daumen-Mittelhandknochen; Grund- und Endglied jetzt **69°/69°** (vorher 85°/71°). Ziele für Spitze und IP-Gelenk in `fing7.py` (`thumb.tip`, `thumb.ip`).
- **Daumenballen als eine Form, Handgelenk-Taille, Hypothenar** (`v3/scripts/sculpt7.py`, Ruhenetz): Ballen um den Daumen-Mittelhandknochen 0,9 statt 0,6 (keine Kerbe unter dem Daumen-MCP), Handgelenk um die Falte radial-ulnar auf 0,84 eingezogen, Hypothenar-Rundung 3,5 mm am ulnaren Handballen. Dazu posenbezogene Korrektur (`v3/scripts/fix7.py`): Verschiebungen im Bildraum der fertigen Pose über die Skinning-Matrizen ins Ruhenetz zurückgerechnet (Wulst am Daumen-MCP 2 mm flacher, Übergang Ballen–Handgelenk per Taubin geglättet). Ergebnis `hands_sc7h.blend`.
- **Holdout-Kante unten:** Im Haltehand-Pass gibt es keinen Holdout der Zeigehand; die Haltehand ist dort vollständig gerendert. Die gerade Diagonale von der Handy-Ecke war die ulnare Handkante selbst; sie verläuft jetzt als S (Hypothenar-Rundung, Taille, Unterarm). Die waagerechte Kante bei y ≈ 707 ist die Handy-Unterkante (Handy-Holdout 1 % kürzer als das DOM) und liegt unter dem gezeichneten Rahmen.
- **Zeigehand:** um die Zeigefingerachse von −80° auf −140° gedreht (Sicht schräg auf die Handfläche): Daumen als eigene Form oben auf der Faust, darunter zwei weitere gestufte eingerollte Finger mit dunklen Fugen; das Loch bei (838, 487) ist geschlossen (Alpha dort 1,0). Unterarm 4° flacher (`aang −4`) und schlanker (Unterarmknochen 0,98/1,02 dick statt 1,2/1,3): 42,6° zur Ecke, Tab „Austausch“ zu 39 % frei.
- **Zeigehand-Licht:** Fülllicht 4,0 statt 0,9, Welt 0,03 (`lights/LP7.json`), Packen mit `--gain 0.88 --lgamma 0.68`: Leuchtdichte über dem Bildschirm im Mittel **165** (vorher 135), Maximum 249, Anteil ≥ 250 = 0; im Halbton-Bild (1280 × 800) Mittel der Zeigehand über dem Bildschirm **154** (vorher 138).
- **Haut** (`v3/scripts/skin7.py`): Gelenkfalten als 2–3 Bögen (Phase um 0,035 · seitlicher Abstand² gebogen, Rauschen in der Phase, Rille `max(0, cos)^4` mit weicher Schulter, Tiefe je Falte per Rauschen 0,45–1,0, neues Attribut `jl`); großflächige Tonvariation halbiert und gröber (Noise 12/m, Overlay 0,15, Flecken 0,2 statt 0,34); Wolkenrauschen im Relief durch feine Rauigkeit ersetzt (Noise 1600/m, 0,18).
- **Engine:** Die Verblassen-Werte in `drawHands` (`hero.js`, Zeile 221: `300`/`420`) müssen weiter auf `520`/`560` gesetzt werden; die Engine war nicht Teil dieses Durchgangs (nur Pässe und diese Datei).

Grundlage aus dem fünften und sechsten Durchgang (weiter gültig): MPFB-Mann, Rig `default` mit detailed helpers, Herauslösen der Unterarme (`extract.py`), Unterteilung 2 (`bake_sub.py`), `sculpt3.py` (Beugesehnen, Brachioradialis, Elle-Kopf, Strecksehnen, Knöchel, Fingerbeeren, eigene Nagelmaske), Corrective Smooth + Unterteilung 1 beim Render, Licht ohne Rim, Tonkurve mit weicher Schulter (`pack5.py`).

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 1792 × 2676, Kachel 896 × 1784, Maßstab 1,5, `origin [410,7, 210,7]`, `bottomY 1400`) | 61 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 4272 × 672, Kachel 2136 × 448, Maßstab 1,0, `origin [−8, −96]`) | 51 kB |
| Summe | | 112 kB (Grenze 600 kB) |

Schlüssel, Kachelnamen, Kodierung, `space`, `phone`, `screen`, `bottomY` und die Bühnenkoordinaten sind unverändert; geändert haben sich nur Kachelmaße, `origin` und Inhalt. Nichts ist abgeschnitten: die Handy-Hand endet unten an `bottomY 1400`, der Unterarm der Zeigehand reicht 1170 Bühnen-px weit (Sprite 2128 px × 0,55) und damit über das Verblassen (520 + 560) hinaus.

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
- **Linke Kontur (Daumen, Ballen, Handgelenk):** x 571 (y 500) → 557 (y 530–540, Daumen-MCP) → 563 (y 600) → 571 (y 640) → 585 (y 690–730, Taille) → 577 (y 770) → 570 (y 790). Ab der Taille läuft der Unterarm wieder nach links aus; kein Wert unter 557.
- **Kuppen rechts** (Zeilen mit Alpha rechts von x 950): y **220–283 / 290–345 / 355–411 / 422–479**, Höhe 63/55/56/57 px, Überstand über x 950 **45/47/45/47 px**, Länge einschließlich Teil auf dem Rahmen 49/62/56/50 px, Lücken **7/10/11 px** (Soll 6–12).
- **Unter dem Handy** (Breite der Hand je Zeile): y 710 x 585–815 (230 px), y 740 583–781 (198), y 760 580–751 (171), y 790 570–724 (154): Handgelenk 0,67 der Breite an der Handy-Unterkante (Soll ≈ 0,6). Rechte (ulnare) Kontur 815 → 806 → 796 → 781 → 766 → 751 → 738 → 729 → 724: erst flach (Hypothenar), dann steiler, dann wieder flach (Taille) als leichtes S.
- **Unterarm:** Handgelenk-Knochen bei (654, 766), Unterarm 6° aus der Senkrechten nach links unten.
- Die Handfläche liegt hinter dem Handy (Holdout). Links vom Rahmen oberhalb der Daumenkuppe ist nichts sichtbar (Pose + Maske `hold`).

**Vorn/hinten** wie bisher im Shader aus `z` und Handy-Silhouette (`vorne = sdf < 4 && z < 1,5 mm`); vorne liegen die Daumenkuppe und die Fingerkuppen auf dem rechten Rahmen.

## 5. Zeigehand (`point`)

Rechte Hand im Bild (MPFB-Linkshand hinter der Spiegelkamera), Handgröße 0,44 des MPFB-Mannes. Pose: Zeigefinger fast gestreckt (MCP −2°, PIP 10°, DIP 6°), Mittel-/Ring-/kleiner Finger eingerollt (78/100/50, 82/100/50, 86/95/48), Daumen angelegt (`finger1-1 [28,6, 26,3, 32,9]`, `finger1-2 [53,5, 0, −15,2]`, `finger1-3 [40, 0, 0]`), Hand auf **−140°** um die Zeigefingerachse gerollt (schräge Sicht auf die Handfläche: Daumen und zwei eingerollte Finger gestuft unter dem Zeigefinger), Zeigefinger 12° in die Bildschirmebene geneigt, Unterarm 25° zur Kamera ansteigend und 4° flacher als die Engine-Richtung (`aang −4`), Unterarmknochen 1,5/1,3-fach lang, 0,98/1,02-fach dick. Spec: `v3/q7_pa-4.json`.

- Sprite-Raum unverändert: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger; `origin [−8, −96]`, Kachel 2136 × 448 bei Maßstab 1,0 (7,62 Sprite-px/mm, mit `PS 0,55` = 4,19 Bühnen-px/mm wie die Handy-Ebene).
- Platzierung wie in der Engine (`u = normalize(1460 − ht.x, 1020 − ht.y)` usw., Abschnitt 6).
- **Messwerte bei Spitze (794, 301)** (`v3/scripts/fistbox.py`, `fistbox7.py`): Zeigefinger **52,4°** über der Waagerechten (Soll 50–55°); Faust **x 777–895, y 336–550** (Soll x 800–930, y 360–510; Referenz-Faust beginnt bei x ≈ 785); Unterarm **42,6°** zur Ecke, 105 px breit; Tab „Austausch“ (x 875–935, y 668–692) zu **61 %** bedeckt, also teilweise frei (vorher 83 %); Loch bei (838, 487) geschlossen (Alpha-Minimum im 20-px-Fenster 1,0, vorher 0).
- **Helligkeit:** Leuchtdichte über dem Bildschirm im Mittel 165, 5-%-Perzentil 98, Maximum 249, Anteil ≥ 250 = 0. Im Halbton-Bild Mittel 154.
- **Verblassen:** wie im vierten Durchgang muss die Engine `300`/`420` in `drawHands` auf **`520`/`560`** setzen (der Referenz-Shader `v2/scripts/preview.html` macht das über `fs`/`fl`).

## 6. Halbton-Shader (Referenz, aus `preview.html`)

Lauffähige Referenz: `/Users/abu/Company/archiv/hand/v2/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/v2/scripts/preview.html?b=../out/<ordner>/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `fs`/`fl` (Verblassen der Zeigehand), `ascii=1`, `mx/my/px/py`). Geprüft bei 1440 × 900 und 390 × 844 (Ausschnitt `view=560,40,540,1170`). Vergleichsbild (Design / Halbton / Luminanz): `archiv/hand/v3/doc7/vergleich.png`, Ausschnitte `doc7/crop_{kuppen,faust,daumen,handgelenk}.png`.

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
- Netz siebter Durchgang: `blender -b hands_sc.blend --python scripts/sculpt7.py -- hands_sc7b.blend 190 0.9 0.84 3.5 4.5 0.038` (Ballen, Taille, Hypothenar), dann zweimal `fix7.py` (posenbezogen) → `hands_sc7f.blend` → `hands_sc7h.blend`.
- Posen: `q/q7_h23.json` (Handy-Hand: Handgelenk, Richtung, Skala 0,88, `fsc [1,04, 0,9]`, FK für Handgelenk, Daumen und alle Finger), `q7_pa-4.json` (Zeigehand). Licht: `lights/L2.json` (Handy-Hand), `lights/LP7.json` (Zeigehand). Cycles 192 Samples, Entrauschen, transparenter Film, Pixelfilter 1,0. Render mit `render7.py` (Haut `skin7.py`, Keil-Maske).

```
cd /Users/abu/Company/archiv/hand/v3
blender -b hands_male4.blend --python scripts/fing7.py -- q7_h23.json q/q7_h23.json   # Handlage-Raster (hands), Finger je FK, Daumen
./v7.sh q/q7_h23.json h23                      # Schnellansicht (Workbench, Netz wie im Render) vorne | Röntgen | Seite
blender -b hands_sc7b.blend --python scripts/fix7.py -- q/q7_h17.json hands_sc7f.blend '[[584,600,12,3.5,-1,0]]'
blender -b hands_sc7f.blend --python scripts/fix7.py -- q/q7_h23.json hands_sc7h.blend '[[552,556,12,-2.0,-1,0],{"smooth":[590,596,14,40]}]'
BL=hands_sc7h.blend ./rh7.sh F7h q/q7_h23.json 192 100 lights/L2.json              # Render + Pack Handy-Hand
LG=0.68 GAIN=0.88 BL=hands_sc7f.blend ./rp7.sh F7p q7_pa-4.json 192 100 lights/LP7.json   # Render + Pack Zeigehand
./comp7.sh F7h F7p fin7                        # Packs zusammenlegen, Faust-Messung, Luminanz im Bühnenraum
../v2/venv/bin/python scripts/measure7.py out/fin7/pk    # Kuppen, Lücken, Daumen, Breiten unter dem Handy
../v2/venv/bin/python scripts/fistbox7.py out/fin7/pk    # Faust, Tab-Abdeckung, Loch, Helligkeit über dem Bildschirm
../v2/venv/bin/python scripts/leftrows.py out/fin7/pk    # linke Kontur je 10 px
./ht7.sh fin7                                  # Halbton 1280x800, 1440x900, 390x844
../v2/venv/bin/python scripts/vergleich7.py    # Vergleich + Ausschnitte
```

Halbton-Vorschau: Dateien nach `archiv/hand/v2/out/c_<tag>/` kopieren, Server `python3 -m http.server 4290` in `archiv/hand`, dann `v2/scripts/shot.mjs "b=../out/c_<tag>/&px=794&py=301&mx=794&my=301" out.png 1280 800 794 301` (`PAGE=v2/scripts/preview.html`). Geprüft bei 1280 × 800, 1440 × 900 und 390 × 844 (`view=560,40,540,1170`); Bilder in `archiv/hand/v3/doc7/` (`ht7.sh` erledigt Kopie, Server und alle drei Größen).

Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz und Modellwahl

Basismodell: **MPFB 2.0.17** (MakeHuman Plugin for Blender), Ausgabe der Basis-Assets und Ziele unter **CC0**; Paket `archiv/hand/mpfb/add-on-mpfb-v2.0.17.zip`. Alles Weitere (Herauslösen, Unterteilung, anatomische Ergänzungen, Nägel, Material, Posen-Optimierung, Licht, Render, Pässe) ist eigene Arbeit. Kein generiertes Modell, keine fremde Fotografie; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

**Vergleich** (`archiv/hand/v3/doc/modellwahl.png`, gleiche Haut, gleiches Licht, vier Ansichten): MPFB Standard (androgyn, schmale lange Finger), MPFB Mann (breitere Hand, kräftigere Finger, modellierte Nagelbetten, Daumenballen, natürlichere Proportionen) und das bisherige „Hand – Realistic“ (Human Base Meshes; Sehnen auf dem Handrücken, aber eigenes Rig ohne Mittelhandknochen). Gewählt: **MPFB Mann**, weil Proportionen und Rig (echte Mittelhandknochen, Unterarm mit zwei Segmenten, Körpergewichte) natürlicher verformen und die Hand ohne Unterarm-Streckung und Knochen-Kürzungen in die Pose passt; die Sehnen und Knöchel, die das alte Netz voraus hatte, ergänzt `sculpt3.py`. Im sechsten Durchgang bestätigt: Die Mängel des fünften Stands (Keil, Hals, Daumenknoten, Kuppen) waren Pose- und Gewichtsfragen, kein Modell-Limit; die Mittelhandknochen des MPFB-Rigs werden jetzt sogar gebraucht (IK-Kette 4 für die Kuppen). Ein Wechsel zurück zum Human-Base-Meshes-Netz (ohne Mittelhandknochen) hätte das verhindert.

## 10. Bekannte Grenzen

- Die Zeigehand ist wie in der Referenz deutlich kleiner als die Handy-Hand (0,44 zu 0,88). In echter Perspektive wäre die vordere Hand eher größer; die Faust-Box der Referenz lässt kaum mehr zu.
- Kuppen: Die Fingerglieder liegen schräg um die Kante, aber die Hand steht 2–4 cm hinter dem Handy; die Spitzen erreichen den Rahmen nur am Rand (x ≈ 905–935), nicht flach auf dem Glas. Die Höhe je Kuppe ist 55–63 px statt der in der Referenz gezeichneten ≈ 30–45 px: Ein echter Finger ist 14–16 mm breit, schmaler geht es nur mit unrealistisch dünnen Fingern. Länge (49–62 px) und Höhe sind daher etwa gleich, nicht deutlich länger als hoch.
- Daumen: Der Daumen-MCP zeichnet sich links weiter als flacher Wulst ab, weil das Daumengrundglied vor dem Ballen liegt (Verdeckungskante, keine Netzfalte); der Ballen darunter ist durchgehend, die Kerbe ist weg.
- Die Faust beginnt bei x 777 (Soll ≥ 800, Referenz ≈ 785): Der angelegte Daumen liegt in der neuen Drehung links oben auf der Faust.
- Unterarm der Zeigehand 42,6° statt 45°, damit der Tab „Austausch“ teilweise frei bleibt.
- Der Halbton der Zeigehand über dem Bildschirm ist im Referenz-Shader ein gleichmäßiges Punktraster; heller als Mittel 154 wird er auch bei hellerem `lum` kaum, weil `tn`/`vd` im Shader die Tinte begrenzen.
- `lum` ist für ein festes Licht gebacken; das Zeigerlicht verschiebt nur Glanz und Helligkeit. Der Halbton (Zelle 2,5 px) löst Poren und Gelenkfalten nicht auf; sie wirken nur in `lum`.
- Haut ohne Haare und ohne echte Albedo-Texturen (MPFB-Hauttexturen sind nicht im Paket); Tonvariation und Poren sind prozedural.
- `fix7.py` gilt für genau diese Pose; bei einer neuen Pose der Handy-Hand muss es mit den neuen Bildkoordinaten neu laufen.
