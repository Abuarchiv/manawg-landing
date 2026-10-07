# HAND: realistische Hände aus Blender

Stand 2026-10-07, vierter Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus einem in Blender gerenderten, anatomisch aufgebauten Handmodell. Struktur, Pose, Position und Bildsprache folgen der Design-Referenz: Handy-Hand hinter dem Handy, Daumen nur mit der Kuppe über dem linken Rahmen, Daumenballen links neben dem Handy, vier gestaffelte Fingerkuppen am rechten Rand, Unterarm nach links unten; die Zeigehand folgt dem Zeiger, ist klein und schlank, hat einen langen gestreckten Zeigefinger über einer Faust aus drei getrennt eingerollten Fingern, und der Unterarm läuft diagonal in die untere rechte Ecke. Gezeichnet wird weiter in Halbton-Punkten (`dot()`, Bayer, `mix-blend-mode: difference` auf der vorderen Ebene). Die Engine bekommt keine Fotos, sondern **Daten-Pässe** (Leuchtdichte, Alpha, Normale, Tiefe) und shadet daraus selbst; die Lichtreaktion auf den Zeiger bleibt erhalten.

## 0. Was sich im vierten Durchgang geändert hat

Die Jury hat den dritten Stand abgelehnt (Zeigehand halb so groß wie die Bühne und wie ein Fäustling, Geometriefehler unter der Faust, Ringfalten und Flosse am Handgelenk, Daumenstiel quer über der Bildschirmspalte, nur zwei bis drei Finger, Halbton als flacher Punktteppich). Das Basisnetz ist geblieben („Hand – Realistic“, Abschnitt 9), aber Mesh, Skinning, beide Posen, Licht und Alpha sind neu:

- **Skinning mit Delta-Mush-Ersatz.** `HandHi` bekommt hinter dem Armature-Modifier einen *Corrective Smooth* (Bindung in der Ruhepose, 12 Iterationen). Damit gibt es keine Volumenverluste und keine Schnittflächen mehr, wenn Finger eingerollt werden: Mittel-, Ring- und kleiner Finger sind als getrennte, gerundete Kuppen modelliert und liegen mit sichtbaren Zwischenräumen aufeinander; vorher war dort ein offener grauer Keil.
- **Mesh-Anatomie** (`scripts/make_hi4.py`, Datei `hand_v4_hi.blend`): die drei Handgelenksringe sind weg (eine einzige weiche, gebogene Beugefalte, 0,1 mm), die harten Sehnenbänder auf der Handfläche und die Unterarmstreifen sind entfernt, die Thenarfalte ist weich (zuvor kollabierte sie bei Dehnung zu einem Knitter). Daumenballen (Thenar) als breite Muskelmasse (4,6 mm), kleinerer Kleinfingerballen. Der Unterarm wird zum Handgelenk hin schmaler und hat einen runden Muskelbauch; vorher war er schmaler als das Handgelenk. Der Unterarm ist ab z 0,20 auf das Fünffache gestreckt, damit der Arm der Zeigehand ohne Ende in die Bühnenecke reicht.
- **Zeigehand neu:** Handgröße 0,46 (vorher 0,64, das ist rund 0,52 der früheren Fläche), Zeigefinger 12 % länger (Knochenskalen `index_prox/mid 1,12`, `index_dist 1,10`) und damit etwa so lang wie die Mittelhand, Handgelenk aus der Draufsicht auf den Handrücken gedreht zu einer Ansicht von Daumen- und Kleinfingerseite (`gamma −110` statt −25), `beta 0` (Zeigefinger parallel zur Bildschirmebene), Handgelenk 10° zur Kleinfingerseite abgewinkelt, damit der Unterarm flach nach rechts unten läuft und die Fingerkuppen der Handy-Hand frei lässt. Der Daumen liegt an der Faust. Nagel sitzt bündig in der Kuppe, mit Nagelhaut und nur wenig hellerem Albedo.
- **Handy-Hand neu gelöst:** Handgröße 1,0 (Handlänge 18,8 cm; vorher 0,78, so klein, dass alles nur knapp erreichbar war), Daumenknochen auf 0,66 und 0,78 gekürzt, Daumenspitze nur noch 20 bis 25 px über dem Rahmen bei y 386 (Ziel: 15 bis 25 px, Höhe von „Lina hat 18,90 €“). Vier Fingerkuppen mit Endglied und Gelenk, 20 bis 55 px Überstand.
- **Alpha im Handy-Umriss.** Alles von der Handy-Hand, was innerhalb der Handy-Silhouette (3 px kleiner als das DOM) vor dem Bildschirm liegt, ist Alpha 0. Ausnahme ist ein Fenster am linken Rahmen für die Daumenkuppe (`x ≤ 700`, `y 330 bis 440`, weich ausgeblendet). Damit liegen Daumenballen und Handfläche optisch hinter dem Handy und der Bildschirm bleibt lesbar; das war vorher der Streifen quer über der linken Bildschirmspalte.
- **Licht für Formlesbarkeit.** Handy-Hand: Key von oben links nah am Rahmen (Fläche 0,22 m), schwacher Fill, Tonkurve `lum^1,6` im Pass: dadurch haben Daumen, Handballen und Unterarm Verläufe statt grauer Flächen. Zeigehand: Key von links, Tonkurve `lum^0,7` mit Verdunkelung entlang des Arms (Faktor 0,5 bei 1500 px): auf dem weißen Bildschirm bleibt der Zeigefinger hell, die Faust bekommt Kernschatten und dunkle Fingerzwischenräume, der Arm zur Ecke wird dunkler.
- **Keine Halo-Kanten.** `lum` wird weiter 12 Bühnen-px über den Rand fortgesetzt; Alpha kommt aus dem Render (bei der Handy-Hand zusätzlich aus der Maske), kein heller Saum.

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 3048 × 2706, Maßstab 1,5) | 113 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 4144 × 426, Maßstab 1,0) | 37 kB |
| Summe | | 150 kB (Grenze 600 kB) |

Die JSON-Dateien beschreiben sich selbst (`tiles`, `origin`, `scale`, `encoding`, `space`; `hold.json` zusätzlich `phone`, `screen`, `bottomY`). Schlüssel, Kachelnamen, Kodierung und Bühnenkoordinaten sind identisch zum ersten Durchgang; geändert haben sich nur Kachelmaße, `origin` und die Inhalte. `hold`: Kachel 1524 × 1804, `origin [0, 197,3]`, `bottomY 1400`. `point`: Kachel 2072 × 284, `origin [−12, −220]` (Spitze = Ursprung, Anker bei Sprite-px (40, 360)).

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

Linke Hand (Blender-Rechtshand, Spiegelkamera), Handgröße 1,0 des Basisnetzes (Handlänge 18,8 cm, große Hand). Gemessen im Bühnenraum (aus `a` und `origin`):

- **Daumen:** Spitze (Nagel) bei etwa x 673 / y 386, also 20 bis 25 px über dem Rahmen (Soll 15 bis 25 px) auf Höhe von „Lina hat 18,90 €“. Der Daumen liegt neben dem Rahmen; sein Knochen ist auf 0,66 (Grundglied) und 0,78 (Endglied) gekürzt, die Gelenke haben natürliche Beugung, der Daumenballen ist als breite Muskelmasse ausgeformt und steht links vom Handy bis x ≈ 576 heraus.
- **Fenster für die Daumenkuppe:** Alpha ist im Handy-Umriss 0 (3 px innen), außer `x ≤ 700`, `y 330 bis 440`, am unteren Ende über 26 px weich ausgeblendet. `pack4.py` macht das mit `--front 700,330,440,26`.
- **Finger:** vier gestaffelte Kuppen rechts, Überstand bis x 1005 (Rand 950): Zeigefinger bei y 207 bis 265 (bis x 981), Mittel- und Ringfinger bei y 298 bis 385, kleiner Finger bei y 411 bis 490. Jede Kuppe zeigt Endglied und Gelenk, je Finger andere Krümmung. In der Idle-Lage der Zeigehand (794/301) liegt deren Unterarm über dem unteren Teil von Ring- und kleinem Finger.
- **Handgelenk und Unterarm:** der Unterarm verlässt die Hand nach links unten (Achse etwa 45° aus der Senkrechten), er wird zur Hand hin schmaler und endet bei `bottomY = 1400`. Unter dem Handy sind Handgelenk und Unterarm bei y 720 etwa 245 px, bei y 800 etwa 280 px breit und laufen ohne Einschnürung weiter. Die Gelenkfalte ist weich, es gibt keine Ringe.
- Holdout ist 2 % schmaler als das Handy-DOM: Haut darf bis zu 3 px darunterliegen, das DOM-Handy deckt sie.

**Vorn/hinten** wird im Shader aus `z` und der Handy-Silhouette bestimmt: `vorne = sdf(Handy außen) < 4 && z < 1,5 mm`. Wegen der Alpha-Maske liegt vorne nur noch die Daumenkuppe. Helligkeit: 98. Perzentil der Hand auf 1,0 normiert (`--gain 1,0 --pct 98`), danach Tonkurve `lum^1,6` (`--lgamma 1,6`), sodass die Hand viele Grauwerte und Kernschatten hat.

## 5. Zeigehand (`point`)

Linke Hand, Daumen- und Kleinfingerseite zur Kamera gerollt (`gamma −110`, `beta 0`), Handgelenk 4° Beugung und 10° Abwinkelung zur Kleinfingerseite, Zeigefinger gestreckt (Grundgelenk −6°, Mittelgelenk −8°, Endgelenk −4°, Knochen 12 % länger), Daumen an die Faust gelegt (`thumb_m −15/−24/−4`, `thumb_prox −38/0/−8`, `thumb_dist −32`), drei Finger getrennt eingerollt (Mittel −72/−100/−42, Ring −76/−102/−46, klein −80/−102/−50). Handgröße 0,46 des Basisnetzes (0,46 der Handy-Hand; die Referenz zeigt die Zeigehand deutlich kleiner als die haltende Hand). Das Sprite ist ein starrer Körper im Rahmen `P(a, b)` in `drawHands`:

- Sprite-Raum: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten Seite der eingerollten Finger (im Design `b > 0`). `point.json: origin` ist die Kachel-Ecke in diesem Raum (`[−12, −220]`, Kachel 2072 × 284 bei Maßstab 1,0).
- Platzierung wie in der Engine: `u = normalize(1460 − ht.x, 1020 − ht.y)`, `n = (−u.y, u.x)`, Spitze `(tx, ty) = ht + u · (6 + push · 4)`, Maßstab `sc = PS · (1 − push · 0,06)`. Zelle `(x, y)` → Sprite `a = ((x − tx) · u.x + (y − ty) · u.y) / sc`, `b = ((x − tx) · n.x + (y − ty) · n.y) / sc`, dort mit `samp()` lesen.
- **Tipp-Punkt und Richtung (Design):** Spitze bei Bühne etwa **(794, 301)** (oberes Drittel des Bildschirms, Mitte). Der Zeigefinger kommt von rechts unten (etwa 35° unter der Waagerechten), die Faust sitzt rechts davon auf dem Bildschirm (Handrücken und eingerollte Finger liegen klein darunter), der Unterarm läuft flach (etwa 38° unter der Waagerechten) über den rechten Rand und kreuzt den Rahmen unter den Fingerkuppen der Handy-Hand. Die Achse des Sprites zeigt zum Engine-Anker (1460, 1020); die Hand ist im Sprite so abgewinkelt, dass der Arm gegenüber dieser Richtung etwa 9° flacher liegt.
- **`PS = 0,55` bleibt.** Ein Sprite-px entspricht 1/(4,19 · 1,818) = 0,131 mm; bei `PS 0,55` ist ein Bühnen-px in der Zeigerebene gleich einem Bühnen-px der Handy-Ebene (4,19 px/mm). Dadurch stimmen beide Hände im Maßstab überein; `hs` (1,0 / 0,46) bestimmt das Größenverhältnis.
- **Verblassen:** das Sprite reicht 2072 Sprite-px weit (1140 Bühnen-px), also in jede Ecke auch bei höheren Ausschnitten. Der Referenz-Shader (`v2/scripts/preview.html`) verblasst mit `fade = clamp(1 − (dist − 520) / 560)` (Query `fs`, `fl`). **Die Engine-Konstanten `300` und `420` in `drawHands` müssen auf `520` und `560` gesetzt werden**, sonst blendet der Arm vor der Ecke aus (Abstand Spitze zur Ecke: 696 px).
- Helligkeit: Perzentil-Normierung `--gain 1,0`, Tonkurve `lum^0,7` und eine Rampe, die den Arm zwischen 500 und 1500 Sprite-px auf 50 % abdunkelt (`--ramp 500,1500,0.5`). Das Licht ist eingebacken (von links oben); die Normalen ins Bühnenraum-System, falls die Zeigehand auch vom Zeigerlicht beleuchtet werden soll: `n_bühne = nx_s · (u.x, −u.y) + ny_s · (u.y, u.x)` (x rechts, y oben).
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

Dieselben Pässe, keine zweite Fassung. Die Komposition (Handy, Daumen, Finger, Arm) ist im Pass-Raum fest; für Hochformat wählt man nur einen anderen Bühnenausschnitt. Geprüft mit Ausschnitt `x 560, y 40, w 540, h 1170` auf 390 × 844 (Maßstab 0,72, Handy 217 × 447 px): Handy mittig, Daumenkuppe am linken Rahmen, Fingerkuppen rechts, Unterarm der Handy-Hand läuft links unten aus dem Bild, die Zeigehand liegt auf dem Bildschirm und ihr Arm läuft rechts hinaus. Höhere Ausschnitte (bis y 1400) funktionieren, darunter blendet der Arm der Handy-Hand aus. Schriftzug und Button gehören dort unter oder neben die Arme, sie sind nicht Teil der Pässe.

## 8. Kamera, Rig, Licht (zum Neu-Rendern)

Arbeitsordner: `/Users/abu/Company/archiv/hand/v2/` (Blender 5.2, Python mit numpy, scipy, Pillow, OpenEXR in `v2/venv`). Alte Dateien in `archiv/hand/` bleiben unverändert.

- Szene `hand_v4_hi.blend` (aus `scripts/make_hi4.py`, Quelle `hand_v2_rig.blend`): Basisnetz `HandBase` (3300 Punkte), Rig `HandRig` (Knochen je Finger 3, Daumen 3 plus Mittelhand, Hand, Unterarm in 6 Segmenten), `HandHi` = Basisnetz 3 × unterteilt (238 k Punkte) mit interpolierten Gewichten, danach Armature (ohne Volumenerhalt) und *Corrective Smooth* (gebunden). Pose als Winkelsatz in `poses/*.json` (`angles`, `scales`, `T`), Vorwärtskinematik `scripts/fk.py`.
- Handy-Hand: Pose `poses/hold_ty1.json`, erzeugt mit `scripts/hp.py specs/s2.json … sc_tp=[1,0.66,1] sc_td=[1,0.78,1] fa_dir=[0.75,-0.2,-0.65]`, danach Daumen-Mittelhand `[14, −50, 8,4]` (Daumenkuppe über den Rahmen), Verschiebung der Pose-Matrix um +2,2 mm in x (nach Bühnen-links) und +1,2 mm in z. Fingerstellung per konstruktiver IK (`scripts/mk.py`, `solve_hold4.py`): Handgelenk (700, 830), `phi 12`, `roll −45`, `pitch −20`, Kuppen-Ziele 225/306/385/456 bei x 952, Überstand bis 20 mm.
- Zeigehand: Pose `poses/point_w3.json`, erzeugt mit `scripts/pp.py '{"beta":0,"gamma":-110,"hs":0.46,"wr":[4,0,-10], "ang":{…}, "scales":{…}}'` (Parameter siehe Abschnitt 5).
- Kamera Handy-Hand `CamMaster`: Linse 85 mm, Sensor 36 mm, Position (0; −0,7252; 0) m, Drehung (90°, 0, 0), **Skalierung x = −1** (Spiegelkamera: macht aus der Blender-Rechtshand die Linkshand im Bild), Shift (−0,125; −0,234375), Auflösung 1920 × 2100 (= 1,5 × 1280 × 1400). Die Handgröße steckt als gleichmäßige Skalierung `hs` in der Pose-Matrix `T`. Handy-Vorderseite liegt 0,7213 m vor der Kamera, Handy als Holdout (Skalierung 0,98/1/0,99).
- Kamera Zeigehand `CamPoint` (`make_point_cam` in `scripts/build_common.py`): Linse 85 mm, Sensor `36 · W / (1280 · k)` mm mit `k = 1,6 · Maßstab`, Abstand 0,7213 m; 2100 × 800 Sprite-px bei Maßstab 1,0, Spitze bei (40, 360).
- Licht Handy-Hand (`lights/H5.json`): Key (Fläche 0,22 m, 34 W) bei (1,0; −0,30; 0,55), Rim (0,4 m, 10 W) bei (−0,6; 0,4; 0,4), Fill (1,6 m, 1,6 W) bei (0,2; −0,9; −0,1), Welt 0,02, Rauigkeit 0,55, kein Handy-Schatten. Zeigehand (`lights/FP3.json`): Key (0,22 m, 17 W) bei (0,95; −0,30; 0,55), Rim 7 W, Fill 0,45 W, Welt 0,006. Cycles, 192 Samples, Entrauschen, Standard-Farbverwaltung, transparenter Film.
- Aux-Pass (Emission): R = `Nx_Welt · 0,5 + 0,5`, G = `Nz_Welt · 0,5 + 0,5`, B = `(Tiefe − 0,7213) · 5 + 0,5`, A = Alpha. `pack4.py` macht daraus Bildraum-Normalen (x gespiegelt) und `z` in mm, normiert die Helligkeit (98. Perzentil), hebt lokalen Kontrast an (`--detail 0,55`), wendet `--lgamma`, `--ramp` und `--front` an und backt **keine** Tinte (`--ink 0`).
- Befehle (aus `archiv/hand/v2`):

```
# Handy-Hand und Zeigehand rendern und packen (mehrere Minuten unnötig, rund 1 Minute je Hand)
blender -b hand_v4_hi.blend --python scripts/render_hand4.py -- hold poses/hold_ty1.json out/F3/hold 192 100 lights/H5.json
venv/bin/python scripts/pack4.py out/F3/hold out/F3/pk hold --scale 1.5 --q 88 --pct 98 --gain 1.0 --lgamma 1.6 \
    --phone 650,90,300,620,48 --ink 0 --front 700,330,440,26
blender -b hand_v4_hi.blend --python scripts/render_hand4.py -- point poses/point_w3.json out/F3/point 192 100 lights/FP3.json
venv/bin/python scripts/pack4.py out/F3/point out/F3/pk point --scale 1.0 --q 88 --pct 98 --gain 1.0 --lgamma 0.7 \
    --ramp 500,1500,0.5 --anchor 40,360 --ink 0
scripts/pv3.sh F3 vorschau.png 1280 800 "" 794 301               # Halbton-Vorschau (v2/scripts/preview.html)
venv/bin/python scripts/compose_lum4.py out/F3/pk lum.png 2 794 301   # Graustufen-Luminanz im Bühnenraum
scripts/q.sh <tag> <hold.json> <point.json> 100 192              # beides in einem Schritt (Umgebung LH, LP, FRONT, GH, GP)
```

Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz / Credits und Modellwahl

Basismodell: „Hand – Realistic“ aus dem Blender-Studio-Paket **Human Base Meshes v1.4.1**, Autor Dan Ulrich, Lizenz **CC0** (kein Nachweis nötig, wird hier trotzdem genannt). Quelle: https://mirror.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.4.1.zip. Alles Weitere (Rig, Gewichte, Unterteilung, Corrective Smooth, Hautfalten und Sehnen, Thenar, Nägel, Material, Pose, Licht, Render, Pässe) ist eigene Arbeit. Es wurde kein generiertes Modell und keine fremde Fotografie benutzt; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

**Modellwechsel.** Die Jury hat empfohlen, auf einen Fotoscan oder ein Modell mit Korrekturformen zu wechseln. Ein Scan war in dieser Sitzung nicht verfügbar: In der Blender-Instanz sind die Bibliotheken Sketchfab, Poly Haven und Poly Pizza ausgeschaltet (Sketchfab-Downloads brauchen einen API-Schlüssel), Poly Haven hat keine menschliche Hand, `generate_3d` ist aus, und MPFB-Hände haben keine bessere Topologie als das Basisnetz. Das Posen-Problem wurde stattdessen am Netz gelöst: der Corrective Smooth ist ein Delta-Mush-Ersatz und beseitigt die Volumenverluste und Knitter an Handgelenk und Fingergelenken, die beim Einrollen entstanden. Kandidaten für einen Scan wären weiterhin „Male Hand“ (Lassi Kaukonen, CC-BY) und „Female Hand“ (yanix, CC-BY) auf Sketchfab, sobald Schlüssel und Freigabe da sind; das brauchte ein neues Rig und eine neue Pose-Lösung.

Verglichen wurden lokal: „Hand – Realistic“ (gewählt, 3300 Punkte, sauberer Quad-Fluss), die Hände der Realistic-Körper männlich/weiblich (gröber, keine Verbesserung) und die stilisierte Hand desselben Pakets (zu grob).

## 10. Bekannte Grenzen

- Die Handy-Hand ist eine große Hand (18,8 cm). Mit kleinerer Hand erreicht der Zeigefinger den rechten Rand nicht mehr; der Zeigefinger liegt dort mit Kuppe nur knapp an. Die Handy-Hand sitzt dafür weiter nach links und hinter dem Handy; die Alpha-Maske (Abschnitt 0) blendet alles aus, was sonst als Daumenballen über dem Bildschirm läge.
- Die Daumenkuppe liegt als einziges Teil vor dem Bildschirm. Wird das Handy in der Engine breiter oder schmaler gesetzt als 300 px, verschiebt sich der Kontakt entsprechend; die Maske ist in Bühnen-px gebacken (`--front`).
- In der Idle-Lage der Zeigehand (794/301) deckt deren Unterarm Teile von Ring- und kleinem Finger der Handy-Hand. Der Idle-Pfad sollte bei `x 760–830, y 280–340` bleiben. Weiter unten rechts kreuzt die Zeigehand die Kuppen.
- Die Engine-Ausblendung der Zeigehand muss auf 520/560 gestellt werden (Abschnitt 5), sonst fehlt der Arm vor der Ecke.
- Beide Hände sind Linkshände (Spiegelkamera, wie im Design: Daumen links bzw. an der Faust). Für eine Rechtshand beim Zeigen: `b = −b` (Abschnitt 5).
- Der Halbton (Zellgröße 2,5 px) löst Fingernägel, Knöchelfalten und Poren nicht auf; die Echtheit kommt von Silhouette, Verläufen und Kernschatten. Der Unterarm der Zeigehand ist ein langes, gestrecktes Rohr, das nur auf Bildschirmhöhe sichtbar ist; er hat einen Muskelbauch, endet aber nie im Bild.
- Der Übergang vom Fenster zur Maske am linken Rahmen ist über 26 px weich; bei sehr kleinen Zellen kann dort die Kante des Daumens kurz „abreißen“.
- `lum` ist für ein festes Licht gebacken. Das Zeigerlicht verschiebt nur Glanz und Helligkeit, keine Schlagschatten.
- Das Basisnetz bleibt ein 3300-Punkte-Netz mit Verschiebung statt eines Scans. Aus der Nähe (Luminanz bei 2-facher Vergrößerung) liest es sich als Haut mit Poren und weichen Falten; ein Fotoscan hätte zusätzlich echte Albedo.
