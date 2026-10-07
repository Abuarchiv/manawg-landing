# HAND: realistische Hände aus Blender

Stand 2026-10-07, fünfter Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus gerenderten Daten-Pässen (Leuchtdichte, Alpha, Normale, Tiefe); die Engine zeichnet daraus weiter Halbton-Punkte mit Zeigerlicht. Struktur wie in der Design-Referenz: linke Hand hält das Handy von hinten, Daumen schräg über der linken Rahmenkante, breiter Daumenballen links bis zur Handyunterkante, gestaffelte Fingerkuppen am rechten Rand, Handgelenk und Unterarm laufen unter dem Handy fast senkrecht nach unten; rechte Zeigehand von unten rechts, Zeigefinger steil zur Spitze bei (794, 301), übrige Finger eingerollt, Daumen über die eingerollten Finger gelegt, Unterarm in etwa 45° zur unteren rechten Ecke.

## 0. Was sich im fünften Durchgang geändert hat

Die Jury hat den vierten Stand (Basisnetz „Hand – Realistic“) mit 4/10 abgelehnt: Daumen als dünner Stiel, kein Thenar, Kugelkuppen mit Glanzringen, Finger ohne Lücken, Unterarm als Röhre, Zeigehand zu flach und puppenhaft, helle Säume, Weiß-Clipping. Neu ist alles außer Pass-Format und Shader:

- **Neues Modell:** Mensch aus **MPFB 2.0.17** (MakeHuman für Blender, CC0), Erwachsener, Mann (Makros `gender 0,9`, `age 0,55`, `muscle 0,62`, `weight 0,5`), MPFB-Standard-Rig `default` (Mittelhandknochen, drei Glieder je Finger, Daumen mit drei Knochen, Handgelenk, zwei Unterarmknochen) mit den MPFB-Gewichten. Beide Unterarme ab dem Ellbogen werden herausgelöst (`v3/scripts/extract.py`) und zweifach unterteilt (`bake_sub.py`, 29 305 Punkte je Arm). Modellwahl: Abschnitt 9.
- **Anatomie ergänzt** (`v3/scripts/sculpt3.py`, im Ruhezustand, Verschiebung entlang der Normale): Beugesehnen am Handgelenk (Palmaris longus, Flexor carpi radialis/ulnaris), Brachioradialis- und Beugermasse am proximalen Unterarm (Unterarm konisch statt Röhre), Elle-Kopf, Strecksehnen und Knöchel-Plateaus (MCP) auf dem Handrücken, leichte Verdickung an PIP/DIP, Fingerbeeren. Die MPFB-Nagelrille (Ursache der „Ringe“) wird radial geglättet; der Nagel ist eine eigene Maske (abgerundetes Rechteck, länger als breit, Nagelhaut als Bogen, seitlicher Falz), 0,06 mm erhaben. Venen als Attribut (Unterarm volar, Handrücken).
- **Haut** (`v3/scripts/skin3.py`): Random-Walk-Subsurface (Radius 1/0,42/0,25, Skala 4 mm), Albedo-Variation (Handfläche heller, Rücken und Gelenke dunkler/rötlicher, großflächige Flecken), Venen leicht bläulich-dunkler, Gelenkfalten als Relief quer zur Fingerachse (Abstand 1,15 mm, Hülle an PIP/DIP/MCP), Handgelenk mit zwei bis drei Beugefalten, Poren und feine Linien. Nägel heller, Rauigkeit 0,4 statt 0,6 (weicher Glanz), Nagelhaut als dunkle Linie. Kein Sheen, Specular 0,28.
- **Pose aus Optimierung statt Handarbeit:** Handy-Hand per Nelder-Mead (`v3/scripts/opt_hold.py`) über Handgelenk-Lage, Handrichtung, Rollen, Handgelenk-Abweichung/-Beugung; Finger per IK zu den Kuppen-Zielen, Daumen in einer zweiten Stufe per FK (`opt_thumb.py`) mit Zielen für Spitze, Richtung der Daumenglieder, Überstand, Nagel zur Kamera. Strafterme: Durchdringung des Handys, Handballen vor dem Bildschirm, Überstand der Kuppen außerhalb 30 bis 52 px, Unterarmwinkel, Hautkeil links über dem Daumen. Zeigehand per FK mit Handgelenk-Suche, sodass der Unterarm in Richtung der Ecke läuft (`point3.py`).
- **Verformung:** Armature, danach *Corrective Smooth* (Ruhezustand ORCO, 6 Iterationen), danach Unterteilung 1. Unterarmstreckung nur an den Unterarmknochen (`inherit_scale NONE` am Handgelenk), Hand und Finger bleiben unverzerrt.
- **Licht:** nur Key (Fläche 0,30 m oben links vorne) und schwacher Fill von rechts vorne, **kein Rim**, Welt 0,01; Handy wirft keinen Schatten auf die Kuppen (sonst unlesbar). Zeigehand: steilerer Key (`lights/LP1.json`) für Kernschatten an Faust und Daumen.
- **Tonkurve ohne Clipping** (`v3/scripts/pack5.py`): weiche Schulter (Reinhard mit Weißpunkt 1,6) statt hartem Abschneiden, 99,5. Perzentil der Hand auf 0,8 gelegt. Ergebnis: p99 = 0,78, Maximum 0,89 nur in Glanzpunkten. Alpha straight aus dem transparenten Film (Pixelfilter 1,0 px), keine eingebackene Tinte, keine Fenster-Maske mehr: vor dem Handy liegt nur, was geometrisch davor liegt (Daumenkuppe).

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 1840 × 2688, Kachel 920 × 1792, Maßstab 1,5, `origin [400, 205,3]`, `bottomY 1400`) | 64 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 4296 × 552, Kachel 2148 × 368, Maßstab 1,0, `origin [−8, −80]`) | 43 kB |
| Summe | | 107 kB (Grenze 600 kB) |

Schlüssel, Kachelnamen, Kodierung, `space`, `phone`, `screen`, `bottomY` und die Bühnenkoordinaten sind unverändert; geändert haben sich nur Kachelmaße, `origin` und Inhalt. Nichts ist abgeschnitten: die Handy-Hand endet unten an `bottomY 1400`, der Unterarm der Zeigehand reicht 1180 Bühnen-px weit und damit über das Verblassen (520 + 560) hinaus.

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

Lage in der Bühne: `origin` (Bühnen-px der oberen linken Ecke von `lum`/`a`) und `scale` (Kachel-px je Bühnen-px). Kachel-px `u = (x − origin.x) · scale / div`, `v = (y − origin.y) · scale / div`. Außerhalb der Silhouette sind `lum`, `nx`, `ny`, `z` 12 Bühnen-px nach außen fortgesetzt; immer mit `a` maskieren. Saum-Prüfung (`v3/scripts/edgecheck.py`): Helligkeit im Alpha-Rand minus 3 px innen im Mittel −0,008 (Handy-Hand) bzw. −0,016 (Zeigehand), also kein heller Saum; Randbreite ≤ 2 Kachel-px.

## 4. Handy-Hand (`hold`)

Linke Hand im Bild (MPFB-Rechtshand hinter der Spiegelkamera), Handgröße 1,06 des MPFB-Mannes (Handfläche 11,5 cm, Hand 19,5 cm). Gemessen im Bühnenraum aus `a`/`origin` (Soll aus der Referenz in Klammern):

- **Daumen:** äußerster Punkt der Kuppe bei x 670 / y 457, also **20 px** über dem Rahmen (Soll 15–25 px, y 400–460). Daumen schräg (Endglied 55°, Grundglied 68° zur Waagerechten), Nagel zur Kamera, breiter Daumenballen links des Handys von y 430 bis unter die Handyunterkante, linke Kontur bei x 515–600 (Soll ≈ 570).
- **Kuppen rechts:** vier gestaffelte Fingerenden, Zeigefinger oben ≈ y 205–272, Mittelfinger ≈ 272–318, Ringfinger ≈ 333–405, kleiner Finger ≈ 459–540; Überstand über x 950: 27 / 44 / 53 / 41 px (Soll 28–48). Zwischen Ring- und kleinem Finger eine deutliche Lücke, zwischen den oberen drei schmale Lücken (die Finger liegen in der Tiefe gestaffelt).
- **Handgelenk und Unterarm:** Handgelenk-Knochen bei (684, 775), Unterarm 10° aus der Senkrechten nach links unten, Breite bei y 800: 217 px (52 mm), das ist 0,61 der Handflächenbreite; konisch zum Ellbogen hin, Sehnen und Beugefalten am Handgelenk.
- Die Handfläche liegt hinter dem Handy (Holdout). Links über dem Daumen bleibt ein schmaler Hautstreifen (Rückseite des Daumens am Rahmen, x 598–650, y 380–430), der in der Engine am DOM-Rahmen endet.

**Vorn/hinten** wie bisher im Shader aus `z` und Handy-Silhouette (`vorne = sdf < 4 && z < 1,5 mm`); vorne liegt nur die Daumenkuppe.

## 5. Zeigehand (`point`)

Rechte Hand im Bild (MPFB-Linkshand hinter der Spiegelkamera), Handgröße 0,42 des MPFB-Mannes (die Referenz zeigt die Zeigehand deutlich kleiner als die haltende Hand). Pose: Zeigefinger gestreckt (MCP −4°, PIP 6°, DIP 4°), Mittel-/Ring-/kleiner Finger eingerollt (78/100/50, 82/100/50, 86/95/48), Daumen über die eingerollten Finger gelegt (`finger1-1 [30, −20, −25]`, `finger1-2 [20, 0, −10]`, `finger1-3 [30, 0, 0]`), Sicht auf Handfläche/Daumenseite wie in der Referenz (eingerollte Finger gestaffelt unten links), Zeigefinger 12° in die Bildschirmebene geneigt, Unterarm 25° zur Kamera ansteigend, Unterarmknochen 1,9/1,4-fach gestreckt.

- Sprite-Raum unverändert: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger; `origin [−8, −80]`, Kachel 2148 × 368 bei Maßstab 1,0 (7,62 Sprite-px/mm, mit `PS 0,55` = 4,19 Bühnen-px/mm wie die Handy-Ebene).
- Platzierung wie in der Engine (`u = normalize(1460 − ht.x, 1020 − ht.y)` usw., Abschnitt 6).
- **Messwerte bei Spitze (794, 301)** (`v3/scripts/fistbox.py`): äußerster Spitzenpixel (798, 298); Zeigefinger **51°** über der Waagerechten (Soll 50–55°); Faust einschließlich Zeigefingerwurzel und Handgelenk x 754–930, y 336–550 (Soll Faust x 800–930, y 360–510: rechte Kante getroffen, die eingerollten Finger ragen 45 px weiter nach links); Unterarm **45,5°** zur Ecke, 99 px breit, verlässt die Bühne unten bei x 1065–1219.
- **Verblassen:** wie im vierten Durchgang muss die Engine `300`/`420` in `drawHands` auf **`520`/`560`** setzen (der Referenz-Shader `v2/scripts/preview.html` macht das über `fs`/`fl`).
- Helligkeit: Perzentil 99,5 → 0,8 mit weicher Schulter, keine Rampe mehr.

## 6. Halbton-Shader (Referenz, aus `preview.html`)

Lauffähige Referenz: `/Users/abu/Company/archiv/hand/v2/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/v2/scripts/preview.html?b=../out/<ordner>/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `fs`/`fl` (Verblassen der Zeigehand), `ascii=1`, `mx/my/px/py`). Geprüft bei 1440 × 900 und 390 × 844 (Ausschnitt `view=560,40,540,1170`). Vergleichsbild (Design / Halbton / Luminanz): `archiv/hand/v3/doc/vergleich.png`.

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

- Modell: `mk_mpfb.py` (Mensch, Makros eingebacken, Rig `default` mit **detailed helpers**, sonst passt MPFB das Rig nicht an die Makros an) → `extract.py` → `bake_sub.py` → `sculpt3.py` → `hands_sc.blend` (Objekte `ArmL`, `ArmR`, Rig `Human.rig`).
- Bone-Achsen im MPFB-Rig: Finger `X` = Beugung (+), `Z` = Abspreizung; Daumen `finger1-*`: `X` quer über die Handfläche, `−Z` zur Handfläche; `wrist`: `X` radial (+), `Z` Beugung (+). `finger1` = Daumen, `finger2..5` = Zeige- bis kleiner Finger, `metacarpal1..4` = Mittelhand Zeige- bis kleiner Finger.
- Posen: `q_hold_final.json` (Handgelenk, Richtung, Skala 1,06, FK für Handgelenk und Daumen, IK-Ziele der Kuppen), `q_point_final.json`. Licht: `lights/L2.json` (Handy-Hand), `lights/LP1.json` (Zeigehand). Cycles 192 Samples, Entrauschen, transparenter Film, Pixelfilter 1,0.

```
cd /Users/abu/Company/archiv/hand/v3
./hp.sh q_o13.json h13                  # Optimierung Hand + Daumen, Render, Pack (Handy-Hand)
./rh.sh F2h q_hold_final.json 192 100 lights/L2.json      # nur Render + Pack Handy-Hand
./rp.sh F1p q_point_final.json 192 100 lights/LP1.json    # Render + Pack Zeigehand
../v2/venv/bin/python scripts/fistbox.py out/F1p/pk       # Messwerte Zeigehand
../v2/venv/bin/python scripts/edgecheck.py out/F2h/pk hold # Saum-Prüfung
../v2/venv/bin/python scripts/compose5.py out/fin/pk lum.png 2 794 301 clean   # Luminanz im Bühnenraum
```

Halbton-Vorschau: Dateien nach `archiv/hand/v2/out/c_<tag>/` kopieren, Server `python3 -m http.server 4290` in `archiv/hand`, dann `v2/scripts/shot.mjs "b=../out/c_<tag>/&px=794&py=301&mx=794&my=301" out.png 1280 800 794 301` (`PAGE=v2/scripts/preview.html`). Geprüft bei 1280 × 800, 1440 × 900 und 390 × 844 (`view=560,40,540,1170`); Bilder in `archiv/hand/v3/doc/`.

Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz und Modellwahl

Basismodell: **MPFB 2.0.17** (MakeHuman Plugin for Blender), Ausgabe der Basis-Assets und Ziele unter **CC0**; Paket `archiv/hand/mpfb/add-on-mpfb-v2.0.17.zip`. Alles Weitere (Herauslösen, Unterteilung, anatomische Ergänzungen, Nägel, Material, Posen-Optimierung, Licht, Render, Pässe) ist eigene Arbeit. Kein generiertes Modell, keine fremde Fotografie; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

**Vergleich** (`archiv/hand/v3/doc/modellwahl.png`, gleiche Haut, gleiches Licht, vier Ansichten): MPFB Standard (androgyn, schmale lange Finger), MPFB Mann (breitere Hand, kräftigere Finger, modellierte Nagelbetten, Daumenballen, natürlichere Proportionen) und das bisherige „Hand – Realistic“ (Human Base Meshes; Sehnen auf dem Handrücken, aber eigenes Rig ohne Mittelhandknochen). Gewählt: **MPFB Mann**, weil Proportionen und Rig (echte Mittelhandknochen, Unterarm mit zwei Segmenten, Körpergewichte) natürlicher verformen und die Hand ohne Unterarm-Streckung und Knochen-Kürzungen in die Pose passt; die Sehnen und Knöchel, die das alte Netz voraus hatte, ergänzt `sculpt3.py`.

## 10. Bekannte Grenzen

- Die Zeigehand ist wie in der Referenz deutlich kleiner als die Handy-Hand (0,42 zu 1,06). In echter Perspektive wäre die vordere Hand eher größer.
- Die Kuppen rechts sind bei echter Fingerdicke (≈ 20 mm) größer als in der Referenz und liegen in der Tiefe gestaffelt; der Ringfinger steht mit 53 px etwas weiter über als die Referenz (48).
- Die eingerollten Finger der Zeigehand ragen bis x 754 nach links (Referenz-Box ab 800), weil die Faust aus der Handflächen-Sicht breiter ist.
- `lum` ist für ein festes Licht gebacken; das Zeigerlicht verschiebt nur Glanz und Helligkeit. Der Halbton (Zelle 2,5 px) löst Poren und Gelenkfalten nicht auf; sie wirken nur in `lum`.
- Hautton und Unterarm sind glatt und haarlos; Sommersprossen, Haare und echte Albedo-Texturen fehlen (MPFB-Hauttexturen sind nicht im Paket).
- Ein schmaler Hautstreifen links über der Daumenkuppe (Daumenrückseite am Rahmen) endet am DOM-Rahmen.
