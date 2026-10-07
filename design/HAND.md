# HAND: realistische Hände aus Blender

Stand 2026-10-07, dritter Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus einem in Blender gerenderten, anatomisch aufgebauten Handmodell. Struktur, Pose, Position und Bildsprache folgen der Design-Referenz: Handy-Hand hinter dem Handy, Daumen schräg nach oben rechts über dem linken Rahmen, Daumenballen breit bis zur Handyunterkante, Fingerkuppen am rechten Rand, Unterarm nach links unten; die Zeigehand folgt dem Zeiger, der Unterarm kommt diagonal aus der unteren rechten Ecke (Achse nach 1460/1020, 43° aus der Senkrechten). Gezeichnet wird weiter in Halbton-Punkten (`dot()`, Bayer, `mix-blend-mode: difference` auf der vorderen Ebene). Die Engine bekommt keine Fotos, sondern **Daten-Pässe** (Leuchtdichte, Alpha, Normale, Tiefe) und shadet daraus selbst; die Lichtreaktion auf den Zeiger bleibt erhalten.

## 0. Was sich im dritten Durchgang geändert hat

Auf die Jury-Mängel des zweiten Stands (Daumen wie beim Trampen, Sanduhr-Taille, drei wurstartige Finger mit 110 bis 180 px Überstand, Tintenkanten, Handgelenksringe, Röhren-Unterarm, senkrechte Zeigehand mit zu hohem Tipp-Punkt, Streifen auf dem Handrücken) ist so reagiert worden:

- **Handy-Hand komplett neu aufgestellt** (`scripts/mk.py`, `thumb_rs.py`, `combo_grid.py`): Daumen und Fingergelenke werden zusammen gegen die Referenzmaße gesucht (Daumenspitze am linken Rahmen, vier Kuppen am rechten Rand, Handballen hinter dem Handy, keine Durchdringung). Handgröße 0,78 (Handlänge 15,7 cm statt 18,8 cm), damit Daumen und Finger zugleich den Rahmen erreichen. Der Daumen liegt jetzt schräg am linken Rahmen, der Daumenballen läuft breit nach unten und das Handgelenk setzt links unter dem Handy an.
- **Finger rechts**: Überstand über den rechten Rand 21 bis 33 px (vorher 111 px), die Finger schauen mit den Endgliedern hervor; Mittel- und Zeigefinger liegen gestaffelt von y 298 bis 385, der kleine Finger bei y 430 bis 480. Knöchel und die ulnare Handkante liegen hinter dem Handy.
- **Zeigehand diagonal**: Pose um die Zeigerichtung gerollt (Kamera auf der Daumenseite), Handgelenk fast gestreckt (4°), Zeigefinger fast gestreckt. Die Hand ist auf 0,64 skaliert (0,82 der Handy-Hand), wie in der Referenz kleiner als die haltende Hand. Der Tipp-Punkt liegt bei Bühne (794, 301) im oberen Drittel des Bildschirms.
- **Material**: Haut mit größerer Albedo-Variation (großflächige und feine Flecken, Rötung an Kuppen und Gelenken), Rauigkeit 0,55, Subsurface, Poren-Bump. Nägel heller als die Haut, nur noch über Glanz und Normale vom Finger getrennt (Rauigkeit 0,30), Nagelfalz weich, Nagelrand ohne Stufe. **Keine eingebackenen Tintenkanten** mehr (`--ink 0`).
- **Anatomie**: Ulnakopf am Handgelenk, Muskelbauch im oberen Drittel des Unterarms (Beuger und Strecker, 3,4 mm), Unterarm 20 % schlanker, Sehnenzüge des Handrückens auf 0,26 mm reduziert. Der Skinning-Modifier arbeitet ohne Volumenerhalt (Dual-Quaternion-Artefakte waren die Ursache der Ringfalten am Handgelenk). Die Beugefalten liegen nur palmar.
- **Kontaktschatten**: das Handy wirft im Render keinen Schatten auf die Hand mehr, der dunkle Fleck an der Handyunterkante entfällt.
- **Holdout** bleibt 2 % schmaler als das Handy-DOM (Haut reicht rund 3 px unter den Rahmen), Alpha kommt direkt aus dem Render.

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 1664 × 2502, Maßstab 1,5) | 55 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 3528 × 804, Maßstab 1,0) | 54 kB |
| Summe | | 109 kB (Grenze 600 kB) |

Die JSON-Dateien beschreiben sich selbst (`tiles`, `origin`, `scale`, `encoding`, `space`; `hold.json` zusätzlich `phone`, `screen`, `bottomY`). Schlüssel, Kachelnamen, Kodierung und Bühnenkoordinaten sind identisch zum ersten Durchgang; geändert haben sich nur Kachelmaße und `origin`.

## 2. Koordinaten

Bühne der Engine: 1280 × 800, Handy-Mitte 800/400, 4,19 Bühnen-px je mm in der Handy-Ebene (Handy 71,6 × 147,6 × 7,8 mm, Eckenradius 11,5 mm).

- Handy außen (Silhouette, `Ende` in `overlays.tsx`): `x 650, y 90, w 300, h 620, r 48`.
- Bildschirm, hier kommt die echte App hinein: `x 661, y 101, w 278, h 598, r 37` (Inset 11, wie das Handy-DOM).
- Der Pass-Raum ist die Bühne. Bei Vollbild gilt dieselbe gleichmäßige Skalierung + Verschiebung für Handy-DOM, Canvas und Pässe; die Pässe selbst bleiben unverändert.

## 3. Atlas-Format (beide Dateien)

8-Bit-Grau, WebP. Kacheln laut JSON (`tiles.<name>`: `x, y, w, h, div`). `div = 2` bedeutet halbe Auflösung (bilinear hochskalieren).

| Kachel | Auflösung | Inhalt |
|---|---|---|
| `lum` | voll | Leuchtdichte, sRGB-Anzeigewert 0..1: Studiolicht oben links (wie `LX/LY/LZ` der Engine), Hautstreuung, Kontakt-Schatten zwischen Fingern; keine eingebackenen Konturen (Kanten ergibt der Shader aus Alpha und Tiefe) |
| `a` | voll | Alpha der Hand. Beim Handy-Pass ist das Handy Holdout: dort, wo das Handy die Hand verdeckt, ist Alpha 0 |
| `nx`, `ny` | halb | Normale im Bildraum, 0..255 = −1..1 (x nach rechts, y nach oben), `nz = sqrt(1 − nx² − ny²)` |
| `z` | halb | Tiefe, 0..255 = −100..+100 mm relativ zur Handy-Vorderseite (Handy-Pass) bzw. zur Fingerspitzen-Ebene (Zeigehand), plus = weiter weg |

Lage der Kacheln in der Bühne: `origin` (Bühnen-px der oberen linken Ecke von `lum`/`a`) und `scale` (Kachel-px je Bühnen-px). Kachel-px `u = (x − origin.x) · scale / div`, `v = (y − origin.y) · scale / div`.

Außerhalb der Silhouette sind `lum`, `nx`, `ny`, `z` 12 Bühnen-px weit nach außen fortgesetzt, damit bilineares Sampling am Rand keine schwarzen Säume zieht. Immer mit `a` maskieren.

## 4. Handy-Hand (`hold`)

Linke Hand (Blender-Rechtshand, Spiegelkamera), Handgröße 0,78 des Basisnetzes (Handlänge 14,7 cm, kleine Hand; sie ist so skaliert, dass Daumen am linken Rahmen und Kuppen am rechten Rand zugleich erreichbar sind). Gemessen im Bühnenraum (aus `a`, `z` und `origin`):

- Daumen: schräg nach oben rechts über die linke Rahmenkante, Spitze (Nagel oben) bei etwa x 673 / y 376, der Nagel reicht rund 40 bis 50 px auf den Bildschirm (Design: Spitze bei etwa y 420 und 15 bis 25 px Überstand, das ist nicht ganz erreicht, weil der Daumen des Basisnetzes länger ist als der der Referenz). Der Daumenballen steht links vom Handy 40 bis 45 px über den Rahmen hinaus (x ≈ 609) und läuft zur Handyunterkante.
- Handballen und Handgelenk: Die Silhouette links vom Rahmen ist 42 px breit (y 540 bis 580), verengt sich zur Handgelenkseite hin auf 19 px (y 660 bis 700, die Hand liegt dort hinter dem Handy) und ist unter der Handyunterkante wieder 47 px und mehr breit. Das ist eine flache Handgelenkseinziehung, keine Taille mit Nullbreite wie im zweiten Stand.
- Finger: nur Endglieder (und ein Stück der Mittelglieder) schauen hervor, Überstand 21 bis 33 px (x ≤ 983, Rand 950). Kuppen bei y 298 bis 345 (Zeige- und Mittelfinger), 350 bis 385 (Ringfinger), 430 bis 480 (kleiner Finger, liegt teils unter der Zeigehand). Je Finger andere Krümmung.
- Unterarm-Achse etwa 14° aus der Senkrechten nach links, konisch mit Ulnakopf und Muskelbauch, endet bei `bottomY = 1400`. Ab etwa y 1310 ausblenden, wenn der Ausschnitt höher ist (Referenz-Shader macht das).
- Holdout ist 2 % schmaler als das Handy-DOM: Haut darf bis zu 3 px darunterliegen, das DOM-Handy deckt sie.

**Vorn/hinten** wird im Shader aus `z` und der Handy-Silhouette bestimmt, nicht eingebacken: `vorne = sdf(Handy außen) < 4 && z < 1,5 mm`. Vorne sind der Daumen und die Fingerspitzen, die über den Rand auf den Bildschirm ragen.

Helligkeit: 98. Perzentil der Hand auf 0,62 normiert (`--gain 0,62 --pct 98`), viele Grauwerte, keine ausgebrannten Flächen. Die Zeigehand wird mit demselben Befehl normiert (effektiv Faktor 1,19 heller, weil ihre Perzentile anders liegen), damit sie vor der Handy-Hand steht.

## 5. Zeigehand (`point`)

Linke Hand von hinten, Daumenseite zur Kamera gerollt (`gamma −25`, Fingerneigung `beta 20` zur Bildschirmebene), Handgelenk 4°, Zeigefinger gestreckt (Grundgelenk −6°, Mittelgelenk −8°, Endgelenk −4°), Daumen angelegt, drei Finger eingerollt. Handgröße 0,64 des Basisnetzes (0,82 der Handy-Hand; die Referenz zeigt die Zeigehand deutlich kleiner als die haltende Hand). Das Sprite ist ein starrer Körper im Rahmen `P(a, b)` in `drawHands`:

- Sprite-Raum: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger (im Design `b > 0`). `point.json: origin` ist die Kachel-Ecke in diesem Raum (`[-24, -80]`, Kachel 1764 × 536 bei Maßstab 1,0).
- Platzierung wie in der Engine: `u = normalize(1460 − ht.x, 1020 − ht.y)`, `n = (−u.y, u.x)`, Spitze `(tx, ty) = ht + u · (6 + push · 4)`, Maßstab `sc = PS · (1 − push · 0,06)`. Zelle `(x, y)` → Sprite `a = ((x − tx) · u.x + (y − ty) · u.y) / sc`, `b = ((x − tx) · n.x + (y − ty) · n.y) / sc`, dort mit `samp()` lesen.
- **Tipp-Punkt und Richtung (Design):** Spitze bei Bühne etwa **(794, 301)** (oberes Drittel des Bildschirms, Mitte); mit dem Ankerpunkt (1460, 1020) ergibt das eine Armachse von 43° aus der Senkrechten, die bei y 800 etwa x 1256 erreicht, also in die untere rechte Ecke läuft. Der Idle-Pfad der Engine sollte um diesen Punkt kreisen (bisher 840/420).
- **`PS = 0,55` bleibt.** Ein Sprite-px entspricht 1/(4,19 · 1,818) = 0,131 mm; bei `PS 0,55` ist ein Bühnen-px in der Zeigerebene gleich einem Bühnen-px der Handy-Ebene (4,19 px/mm). Dadurch stimmen beide Hände im Maßstab überein und `hs` (0,78 / 0,64) bestimmt das Größenverhältnis.
- **Verblassen:** Das Sprite reicht 1764 Sprite-px weit (970 Bühnen-px), also bis in die Ecke. Der Referenz-Shader (`v2/scripts/preview.html`) verblasst jetzt mit `fade = clamp(1 − (dist − 520) / 560)` (Query `fs`, `fl`), damit der Arm bis zur Ecke sichtbar bleibt. **Die Engine-Konstanten `300` und `420` in `drawHands` müssen auf `520` und `560` gesetzt werden**, sonst blendet der Arm vor der Ecke aus (Abstand Spitze zur Ecke: 696 px).
- Licht der Zeigehand ist von der Fingerspitzen-Seite gebacken (nach der Drehung in die Bühne kommt es von oben links). Normalen ins Bühnenraum-System, falls die Zeigehand auch vom Zeigerlicht beleuchtet werden soll: `n_bühne = nx_s · (u.x, −u.y) + ny_s · (u.y, u.x)` (x rechts, y oben). Die Referenz nutzt für die Zeigehand nur das eingebackene Licht.
- Soll die Hand rechts statt links sein: `b = −b` im Sampler (dann sitzt der Daumen unten).

## 6. Halbton-Shader (Referenz, aus `preview.html`)

Lauffähige Referenz: `/Users/abu/Company/archiv/hand/v2/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/v2/scripts/preview.html?b=../out/<ordner>/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `fs`/`fl` (Verblassen der Zeigehand), `ascii=1`, `mx/my/px/py`). Geprüft bei 1440 × 900 und 390 × 844 (Ausschnitt `view=560,40,540,1170`). Vergleichsbild (Design / Halbton / Luminanz): `scratchpad/hand-v2/vergleich.png` der Sitzung.

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

Dieselben Pässe, keine zweite Fassung. Die Komposition (Handy, Daumen, Finger, Arm) ist im Pass-Raum fest; für Hochformat wählt man nur einen anderen Bühnenausschnitt. Geprüft mit Ausschnitt `x 560, y 40, w 540, h 1170` auf 390 × 844 (Maßstab 0,72, Handy 217 × 447 px): Handy mittig, Daumen links, Fingerspitzen rechts, Unterarm läuft unten aus dem Bild, die Zeigehand liegt vor dem Bildschirm. Höhere Ausschnitte (bis y 1400) funktionieren, darunter blendet der Arm aus. Schriftzug und Button gehören dort unter oder neben die Arme, sie sind nicht Teil der Pässe.

## 8. Kamera, Rig, Licht (zum Neu-Rendern)

Arbeitsordner: `/Users/abu/Company/archiv/hand/v2/` (Blender 5.2, Python mit numpy, scipy, Pillow, OpenEXR in `v2/venv`). Alte Dateien in `archiv/hand/` bleiben unverändert.

- Szene `hand_v3_hi.blend` (aus `scripts/make_hi3.py`; `hand_v2_hi.blend` ist der Stand davor): Basisnetz `HandBase` (3300 Punkte), Rig `HandRig` (Knochen je Finger 3, Daumen 3 plus Mittelhand, Hand, Unterarm in 6 Segmenten), `HandHi` = Basisnetz 3 × unterteilt (238 k Punkte) mit interpolierten Gewichten. Pose als Winkelsatz in `poses/*.json` (`angles`, `T`), Vorwärtskinematik `scripts/fk.py`.
- Kamera Handy-Hand `CamMaster`: Linse 85 mm, Sensor 36 mm, Position (0; −0,7252; 0) m, Drehung (90°, 0, 0), **Skalierung x = −1** (Spiegelkamera: macht aus der Blender-Rechtshand die Linkshand im Bild), Shift (−0,125; −0,234375), Auflösung 1920 × 2100 (= 1,5 × 1280 × 1400). Die Handgröße steckt als gleichmäßige Skalierung `hs` in der Pose-Matrix `T` (`poses/hold_v9.json`, `hs = 0,78`; Zeigehand `poses/point_v8.json`, `hs = 0,64`). Handy-Vorderseite liegt 0,7213 m vor der Kamera, Handy als Holdout (Skalierung 0,98/1/0,99).
- Kamera Zeigehand `CamPoint` (`make_point_cam` in `scripts/build_common.py`): Linse 85 mm, Sensor `36 · W / (1280 · k)` mm mit `k = 1,818 · Maßstab`, Abstand 0,7213 m; 1800 × 1150 Sprite-px bei Maßstab 1,0, Spitze bei (60, 340). Neu gegenüber dem ersten Durchgang ist `k` (Zoom); früher war `k = 1` und der Maßstab im JSON stimmte bei Teilauflösung nicht mit der Dichte überein.
- Licht Handy-Hand (`lights/H.json`, = F.json plus Rauigkeit 0,55, kein Handy-Schatten): Key (Fläche 0,32 m, 30 W) bei (0,72; −0,40; 0,78), Rim (0,4 m, 9 W) bei (−0,55; 0,45; 0,35), Fill (1,4 m, 1,1 W) bei (−0,7; −0,5; −0,1), Welt 0,015. Zeigehand (`lights/P.json`): Key (0,35 m, 11 W) bei (0,9; −0,3; 0,15), Fill 1,0 W, Rim 6 W. Cycles, 256 Samples, Entrauschen, Standard-Farbverwaltung, transparenter Film.
- Aux-Pass (Emission): R = `Nx_Welt · 0,5 + 0,5`, G = `Nz_Welt · 0,5 + 0,5`, B = `(Tiefe − 0,7213) · 5 + 0,5`, A = Alpha. `pack4.py` macht daraus Bildraum-Normalen (x gespiegelt) und `z` in mm, normiert die Helligkeit (99. Perzentil), hebt lokalen Kontrast an (`--detail 0,55`) und backt **keine** Tinte (`--ink 0`).
- Befehle (aus `archiv/hand/v2`; rendert beide Pässe, packt sie und schreibt `out/<lauf>/pk/`):

```
scripts/run_all.sh f5 poses/hold_v9.json poses/point_v8.json lights/H.json 100 100 256 0.62 0.62 98 lights/P.json
scripts/pv3.sh f5 vorschau.png 1280 800 "title=1"               # Halbton-Vorschau (v2/scripts/preview.html)
venv/bin/python scripts/compose_lum.py out/f5/pk lum.png 2 794 301   # Graustufen-Luminanz im Bühnenraum
```

Ein Lauf braucht rund 1 Minute (Apple GPU). Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz / Credits und Modellwahl

Basismodell: „Hand – Realistic“ aus dem Blender-Studio-Paket **Human Base Meshes v1.4.1**, Autor Dan Ulrich, Lizenz **CC0** (kein Nachweis nötig, wird hier trotzdem genannt). Quelle: https://mirror.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.4.1.zip. Alles Weitere (Rig, Gewichte, Unterteilung, Hautfalten und Sehnen, Nägel, Material, Pose, Licht, Render, Pässe) ist eigene Arbeit. Es wurde kein generiertes Modell und keine fremde Fotografie benutzt; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

**Modellwechsel nicht möglich.** Die Jury hat empfohlen, auf einen Fotoscan oder MPFB zu wechseln. Das ging in dieser Sitzung nicht: In der laufenden Blender-Instanz sind die Bibliotheken Sketchfab, Poly Haven und Poly Pizza ausgeschaltet (`get_addon_status`: `sketchfab: off`; Sketchfab-Downloads brauchen einen API-Schlüssel, den es hier nicht gibt), Poly Haven hat ohnehin keine menschliche Hand, und `generate_3d` ist aus. MPFB wurde nicht installiert, weil ein Erweiterungs-Download aus dem Netz ohne ausdrückliche Freigabe des Nutzers nicht stattfinden soll (außerdem hat MPFB-Hand-Topologie keinen Vorteil bei Hautdetail gegenüber dem hier benutzten Netz in dreifacher Unterteilung). Stattdessen wurde das Netz an den Stellen verbessert, an denen die Jury den „Knet-Eindruck“ festgemacht hat: Pose und Platzierung gegen die Referenzmaße gelöst, Skinning ohne Volumenerhalt, Ulnakopf und Muskelbauch, Hautmaterial mit Albedo-Variation und Poren, Nägel ohne Konturen, keine eingebackene Tinte. Ein Scan wäre bei Hautdetail weiterhin im Vorteil und bräuchte ein neues Rig und eine neue Pose-Lösung; Kandidaten wären „Male Hand“ (Lassi Kaukonen, CC-BY) und „Female Hand“ (yanix, CC-BY) auf Sketchfab, sobald Schlüssel und Freigabe da sind.

Verglichen wurden lokal: „Hand – Realistic“ (gewählt, 3300 Punkte, sauberer Quad-Fluss), die Hände der Realistic-Körper männlich/weiblich (gröber, 10 k Punkte pro Körper, keine Verbesserung) und die stilisierte Hand desselben Pakets (zu grob).

## 10. Bekannte Grenzen

- Der Daumen der Handy-Hand reicht etwa 40 bis 50 px auf den Bildschirm (Design 15 bis 25 px) und die Spitze liegt bei y 376 statt 420. Das Basisnetz hat einen längeren Daumen als die Referenz; die Handgröße 0,78 ist schon der Kompromiss, damit Daumen und Fingerkuppen zugleich den Rahmen erreichen.
- Die Handy-Hand ist mit 14,7 cm Handlänge eine kleine Hand; gegen das Handy (14,8 cm hoch) wirkt sie kompakt. Eine größere Hand verschiebt Daumenspitze und Kuppen wieder auf den Bildschirm.
- Handgelenk der Handy-Hand: flache Einziehung zwischen Daumenballen und Unterarm (Silhouette links vom Rahmen 19 px breit an der engsten Stelle bei y 660 bis 700, danach wieder 47 px und mehr). Keine Sanduhr, aber in der Luminanz erkennbar.
- Vom kleinen Finger der Handy-Hand ist bei der Idle-Position der Zeigehand (794/301) nur ein Teil sichtbar, weil der Unterarm der Zeigehand darüber liegt. Idle-Pfad bei etwa `x 760–830, y 280–340` halten; weiter unten rechts kreuzt die Zeigehand die Kuppen.
- Die Engine-Ausblendung der Zeigehand muss auf 520/560 gestellt werden (Abschnitt 5), sonst fehlt der Arm vor der Ecke.
- Beide Hände sind Linkshände (Spiegelkamera, wie im Design: Daumen links bzw. oben). Für eine Rechtshand beim Zeigen: `b = −b` (Abschnitt 5).
- Der Halbton (Zellgröße 2,5 px) löst Fingernägel, Knöchelfalten und Poren nicht auf; die Echtheit kommt von Silhouette und Verlauf. Nägel und Daumen erscheinen als kleine, glatte Flächen.
- `lum` ist für ein festes Licht gebacken. Das Zeigerlicht verschiebt nur Glanz und Helligkeit, keine Schlagschatten.
- Das Basisnetz bleibt ein 3300-Punkte-Netz mit Verschiebung statt eines Scans. Aus der Nähe (Luminanz bei 2-facher Vergrößerung) liest es sich als Haut mit Poren; ein Fotoscan hätte zusätzlich echte Albedo.
