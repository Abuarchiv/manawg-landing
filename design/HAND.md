# HAND: realistische Hände aus Blender

Stand 2026-10-07, zweiter Durchgang (Branch `hand-v2`). Die beiden Hände der Engine (Handy-Hand `holdBack`/`holdFront`, Zeigehand `point`) kommen aus einem in Blender gerenderten, anatomisch echten Handmodell. Struktur, Pose, Position und Bildsprache bleiben wie im Design: Daumen links am Handyrand, Finger am rechten Rand, Handballen und Unterarm hinter dem Handy, Unterarm nach links unten; die Zeigehand folgt dem Zeiger und der Arm zeigt nach 1460/1020. Gezeichnet wird weiter in Halbton-Punkten (`dot()`, Bayer, `mix-blend-mode: difference` auf der vorderen Ebene). Die Engine bekommt keine Fotos, sondern **Daten-Pässe** (Leuchtdichte, Alpha, Normale, Tiefe) und shadet daraus selbst. Dadurch bleibt die Lichtreaktion auf den Zeiger erhalten.

Was sich gegenüber dem ersten Durchgang geändert hat (Mängel: überdehnter Daumenstiel, überstrahlte Nägel, gleich lange lose Finger, Röhren-Unterarm, Pistolenhaltung der Zeigehand, flaches Licht):

- Neues Rig auf demselben CC0-Basisnetz (siehe 9): Gelenkmitten aus der Anatomie des Netzes, je Finger eigene Krümmung, Daumen mit Grundgelenk und Ballen, Hautfalten und Sehnenzüge als Verschiebung, Unterarm konisch.
- Griffpose per Inverskinematik gelöst: Fingerspitzen liegen am Rand, kein Durchdringen des Handys, Daumen liegt auf dem Rahmen.
- Zeigehand: natürliche Zeigehaltung (Zeigefinger leicht gebeugt, drei Finger eingerollt, Daumen angelegt), Kamera-Neigung 30 Grad zum Bildschirm.
- Haut mit Subsurface (Random Walk Skin), Farbvariation, Poren-Bump; Nägel matt, ohne weißen Rand.
- Licht: kleines Key-Licht oben links (Handy-Hand) bzw. von der Fingerspitzen-Seite (Zeigehand, siehe 5), schwache Füllung, Gegenlicht. Dadurch viele Grauwerte statt flacher Fläche. Kein Kantenpass mit Halo: Alpha kommt direkt aus dem Render, die 12-px-Fortsetzung der Kacheln ist nur Farbe.
- Die Zeigehand ist jetzt in Echtgröße zur Handy-Hand modelliert (siehe 5), nicht mehr kleiner als die Finger der Handy-Hand.

Referenz-Umsetzung (läuft, Screenshots bei 1440 × 900 und 390 × 844 geprüft): `/Users/abu/Company/archiv/hand/scripts/preview.html` (Aufruf: Ordner `archiv/hand` mit `python3 -m http.server`, dann `/scripts/preview.html` mit `?b=../v2/out/<lauf>/`; Parameter `ps`, `g`, `con`, `rim`, `view`, `ascii=1`, `mx/my/px/py`), eingeklebt im Abschnitt 6. Vergleichsbild (Design / Halbton / Luminanz): `scratchpad/hand-v2/vergleich.png` der Sitzung.

## 1. Dateien

| Datei | Inhalt | Größe |
|---|---|---|
| `public/hand/hold.webp` + `hold.json` | Hand, die das Handy hält (Atlas 2040 × 2568, Maßstab 1,5) | 89 kB |
| `public/hand/point.webp` + `point.json` | Zeigehand als Sprite (Atlas 3276 × 1032, Maßstab 1,0) | 104 kB |
| Summe | | 193 kB (Grenze 600 kB) |

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
| `lum` | voll | Leuchtdichte, sRGB-Anzeigewert 0..1: Studiolicht oben links (wie `LX/LY/LZ` der Engine), Hautstreuung, Kontakt-Schatten zwischen Fingern, Nagelränder und Fingerüberlappungen als Tintenlinie eingebacken |
| `a` | voll | Alpha der Hand. Beim Handy-Pass ist das Handy Holdout: dort, wo das Handy die Hand verdeckt, ist Alpha 0 |
| `nx`, `ny` | halb | Normale im Bildraum, 0..255 = −1..1 (x nach rechts, y nach oben), `nz = sqrt(1 − nx² − ny²)` |
| `z` | halb | Tiefe, 0..255 = −100..+100 mm relativ zur Handy-Vorderseite (Handy-Pass) bzw. zur Fingerspitzen-Ebene (Zeigehand), plus = weiter weg |

Lage der Kacheln in der Bühne: `origin` (Bühnen-px der oberen linken Ecke von `lum`/`a`) und `scale` (Kachel-px je Bühnen-px). Kachel-px `u = (x − origin.x) · scale / div`, `v = (y − origin.y) · scale / div`.

Außerhalb der Silhouette sind `lum`, `nx`, `ny`, `z` 12 Bühnen-px weit nach außen fortgesetzt, damit bilineares Sampling am Rand keine schwarzen Säume zieht. Immer mit `a` maskieren.

## 4. Handy-Hand (`hold`)

Linke Hand (Blender-Rechtshand, Spiegelkamera), natürlicher Griff, Handgröße 18,8 cm (93 % des Basisnetzes). Gemessen im Bühnenraum (aus `a` und `origin`):

- Daumen: Spitze bei etwa x 618 / y 340, die Kuppe liegt mit dem Nagel auf dem Rahmen und reicht bis x ≈ 668 (18 px über den Handyrand, Design: 28 px). Der Daumenballen läuft links vom Handy diagonal zum Handgelenk.
- Finger: Zeige- und Mittelfinger reichen bis x ≈ 1061 (111 px über den rechten Rand, Nägel zeigen zum Betrachter), Ring- und kleiner Finger bis x ≈ 995 (45 px). Je Finger andere Krümmung, Nägel matt sichtbar. Design: 28 px; echte Finger sind dicker, der Halbton lässt die App dazwischen durchscheinen.
- Unterarm-Achse 13,9° aus der Senkrechten nach links (Design 12,5°), konisch, endet bei `bottomY = 1400`. Ab etwa y 1310 ausblenden, wenn der Ausschnitt höher ist (Referenz-Shader macht das).
- Holdout ist 2 % schmaler als das Handy-DOM: Haut darf bis zu 3 px darunterliegen, das DOM-Handy deckt sie.

**Vorn/hinten** wird im Shader aus `z` und der Handy-Silhouette bestimmt, nicht eingebacken: `vorne = sdf(Handy außen) < 4 && z < 1,5 mm`. Vorne sind der Daumen und die Fingerspitzen, die über den Rand auf den Bildschirm ragen.

Helligkeit: 99. Perzentil der Hand = 0,85 (sRGB-Anzeigewert), Median 0,6, dunkelste 2 % unter 0,18. Die Zeigehand ist mit Faktor 1,16 heller normiert (99. Perzentil nach Gain), damit sie vor der Handy-Hand steht.

## 5. Zeigehand (`point`)

Linke Hand von hinten, Zeigefinger gestreckt (Grundgelenk −6°, Mittelgelenk −8°, Endgelenk −4°), Daumen angelegt, drei Finger eingerollt, Zeigefinger und Unterarm fast in einer Linie, Fingerneigung 30° zur Bildschirmebene (`params: beta 30, gamma 0`). Das Sprite ist ein starrer Körper in demselben Rahmen wie bisher `P(a, b)` in `drawHands`:

- Sprite-Raum: Ursprung = Fingerspitze, `x` = Richtung Arm, `y` nach unten = Seite der eingerollten Finger (im Design `b > 0`). `point.json: origin` ist die Kachel-Ecke in diesem Raum (`[-28, -84]`, Kachel 1638 × 688 bei Maßstab 1,0, Spitze bei Kachel-px 28/84 plus Rand 8).
- Platzierung wie in der Engine: `u = normalize(1460 − ht.x, 1020 − ht.y)`, `n = (−u.y, u.x)`, Spitze `(tx, ty) = ht + u · (6 + push · 4)`, Maßstab `sc = PS · (1 − push · 0,06)`.
  Zelle `(x, y)` → Sprite `a = ((x − tx) · u.x + (y − ty) · u.y) / sc`, `b = ((x − tx) · n.x + (y − ty) · n.y) / sc`, dort mit `samp()` lesen.
- **`PS = 0,55` bleibt.** Das Sprite ist dafür 1,6/0,55 fach größer als im ersten Durchgang gerendert: ein Sprite-px entspricht 1/(4,19 · 1,6) = 0,149 mm. Bei `PS 0,55` ergibt das 0,88 der Echtgröße (Zeigefinger 59 px breit, Handy-Hand-Finger 67 px). Mit `PS = 0,625` wäre es 1:1 zur Handy-Hand.
- Verblassen wie bisher: `fade = clamp(1 − (dist − 300) / 420)` mit `dist` = Abstand zur Spitze. Das Sprite reicht 1638 Sprite-px weit (900 Bühnen-px bei `PS 0,55`), also über das Verblassen (720 px) hinaus; kein sichtbarer Schnitt. Wegen der Echtgröße liegt das Handgelenk bei etwa 640 px und verblasst; der Unterarm ist nur noch im Auslauf sichtbar (Design: Arm sichtbar bis zur Ecke). Wer den Arm länger sehen will, setzt den Verblass-Beginn von 300 auf 520 und die Länge von 420 auf 520 (Engine-Konstante, nicht Teil der Pässe).
- Licht der Zeigehand ist von der Fingerspitzen-Seite gebacken (nach der Drehung in die Bühne kommt es von oben links). Normalen ins Bühnenraum-System, falls die Zeigehand auch vom Zeigerlicht beleuchtet werden soll: `n_bühne = nx_s · (u.x, −u.y) + ny_s · (u.y, u.x)` (x rechts, y oben). Die Referenz nutzt für die Zeigehand nur das eingebackene Licht.
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

Einbau in `hero.js`: `holdBack`, `holdFront`, `point`, `S`, `KS`, `FR`, `uc`, `smn`, `cap`, `nail`, `phoneBox` entfallen. In `drawHands` bleiben `tg`/`s.ht`-Glättung, `push`, `u/n`-Rahmen, `ink`, die Zellschleife, `dot`, der Klick-Ring und `endA`. Die Schleife läuft über die belegten Zellen (12er-Raster aus `a`, im Referenz-Shader `occ`) statt über SDF-Masken.

Aufwand: Referenz-Shader braucht in Chromium (M3, ohne Optimierung) 25–40 ms je Bild für beide Hände. Billiger: Alpha, `lum`, Normale, `front`, `edge`, `onScreen`, `cov` der Handy-Hand je Zelle einmal beim Laden vorberechnen (die Zellen sind fest); je Bild bleibt nur die Zeigerlicht-Rechnung. Die Zeigehand muss je Bild neu gesampelt werden, sie bewegt sich.

## 7. Hochformat / Mobil

Dieselben Pässe, keine zweite Fassung. Die Komposition (Handy, Daumen, Finger, Arm) ist im Pass-Raum fest; für Hochformat wählt man nur einen anderen Bühnenausschnitt. Geprüft mit Ausschnitt `x 560, y 40, w 540, h 1170` auf 390 × 844 (Maßstab 0,72, Handy 217 × 447 px): Handy mittig, Daumen links, Fingerspitzen rechts, Unterarm läuft unten aus dem Bild, die Zeigehand liegt vor dem Bildschirm. Höhere Ausschnitte (bis y 1400) funktionieren, darunter blendet der Arm aus. Schriftzug und Button gehören dort unter oder neben die Arme, sie sind nicht Teil der Pässe.

## 8. Kamera, Rig, Licht (zum Neu-Rendern)

Arbeitsordner: `/Users/abu/Company/archiv/hand/v2/` (Blender 5.2, Python mit numpy, scipy, Pillow, OpenEXR in `v2/venv`). Alte Dateien in `archiv/hand/` bleiben unverändert.

- Szene `hand_v2_hi.blend`: Basisnetz `HandBase` (3300 Punkte), Rig `HandRig` (Knochen je Finger 3, Daumen 3 plus Mittelhand, Hand, Unterarm in 6 Segmenten), `HandHi` = Basisnetz 3 × unterteilt (238 k Punkte) mit interpolierten Gewichten. Pose als Winkelsatz in `poses/*.json` (`angles`, `T`), Vorwärtskinematik `scripts/fk.py`.
- Kamera Handy-Hand `CamMaster`: Linse 85 mm, Sensor 36 mm, Position (0; −0,7252; 0) m, Drehung (90°, 0, 0), **Skalierung x = −1** (Spiegelkamera: macht aus der Blender-Rechtshand die Linkshand im Bild), Shift (−0,125; −0,234375), Auflösung 1920 × 2100 (= 1,5 × 1280 × 1400). Handy-Vorderseite liegt 0,7213 m vor der Kamera, Handy als Holdout (Skalierung 0,98/1/0,99).
- Kamera Zeigehand `CamPoint` (`make_point_cam` in `scripts/build_common.py`): Linse 85 mm, Sensor `36 · W / (1280 · k)` mm mit `k = 1,6 · Maßstab`, Abstand 0,7213 m; 1650 × 1000 Sprite-px bei Maßstab 1,0, Spitze bei (40, 300). Neu gegenüber dem ersten Durchgang ist `k` (Zoom); früher war `k = 1` und der Maßstab im JSON stimmte bei Teilauflösung nicht mit der Dichte überein.
- Licht Handy-Hand (`lights/F.json`): Key (Fläche 0,32 m, 30 W) bei (0,72; −0,40; 0,78), Rim (0,4 m, 9 W) bei (−0,55; 0,45; 0,35), Fill (1,4 m, 1,1 W) bei (−0,7; −0,5; −0,1), Welt 0,015. Zeigehand (`lights/FP.json`): Key (0,35 m, 11 W) bei (0,9; −0,3; 0,15), Fill 1,0 W, Rim 6 W. Cycles, 192 Samples, Entrauschen, Standard-Farbverwaltung, transparenter Film.
- Aux-Pass (Emission): R = `Nx_Welt · 0,5 + 0,5`, G = `Nz_Welt · 0,5 + 0,5`, B = `(Tiefe − 0,7213) · 5 + 0,5`, A = Alpha. `pack4.py` macht daraus Bildraum-Normalen (x gespiegelt) und `z` in mm, normiert die Helligkeit (99. Perzentil), hebt lokalen Kontrast an (`--detail 0,8`) und backt Tinte an Tiefen- und Normalensprüngen (`--ink 0,22`).
- Befehle (aus `archiv/hand/v2`; rendert beide Pässe, packt sie und schreibt `out/<lauf>/pk/`):

```
scripts/run_all.sh r8 poses/hold_v2.json poses/pw_b.json lights/F.json 100 100 192 0.85 0.85 99 lights/FP.json
scripts/pack_only.sh r8 r8 0.85 0.85 99 0.22 0.8 100 100      # nur neu packen (Ink/Detail/Gain)
scripts/preview_combo.sh r8 r8 out.png 1280 800                 # Halbton-Vorschau
venv/bin/python scripts/compose_lum.py out/r8/pk lum.png 2      # Graustufen-Luminanz im Bühnenraum
```

Ein Lauf braucht rund 1 Minute (Apple GPU). Nicht mehrere Blender-Läufe mit GPU parallel starten (Metal: „Insufficient Memory“).

## 9. Lizenz / Credits und Modellwahl

Basismodell: „Hand – Realistic“ aus dem Blender-Studio-Paket **Human Base Meshes v1.4.1**, Autor Dan Ulrich, Lizenz **CC0** (kein Nachweis nötig, wird hier trotzdem genannt). Quelle: https://mirror.blender.org/demo/asset-bundles/human-base-meshes/human-base-meshes-bundle-v1.4.1.zip. Alles Weitere (Rig, Gewichte, Unterteilung, Hautfalten und Sehnen, Nägel, Material, Pose, Licht, Render, Pässe) ist eigene Arbeit. Es wurde kein generiertes Modell und keine fremde Fotografie benutzt; Fotos von Händen am Handy dienten nur als Vorlage für Proportion und Haltung.

Vergleich der Kandidaten (Probe-Renderings in `v2/out`, Sitzungsordner `hand-v2`):

1. **Hand – Realistic** (Human Base Meshes, CC0, 3300 Punkte, sauberer Quad-Fluss, anatomisch gute Daumenballen und Fingerproportionen). Gewählt: nach 3-facher Unterteilung plus Falten und Sehnen als Verschiebung in der Nahaufnahme von einer Fotografie kaum zu unterscheiden (siehe Kontaktbogen der Zeigehand-Varianten).
2. Hand der **Realistic-Körper männlich/weiblich** (selbes Paket, CC0): gleiche Herkunft, aber gröber (Körper insgesamt 10 k Punkte, Finger ohne Fingerlücken-Topologie), keine Verbesserung.
3. Stilisierte Hand desselben Pakets: zu grob.

Nicht geprüft werden konnten Fotogrammetrie-Scans von Sketchfab (z. B. „Male Hand“ von Lassi Kaukonen, CC-BY, 7,9 k Flächen; „Female Hand“ von yanix, CC-BY, 193 k Flächen) und die Blender-Erweiterung MPFB: Der Download aus Sketchfab verlangt einen API-Schlüssel, und ein Download aus unbekannter Quelle braucht eine ausdrückliche Freigabe des Nutzers, die in dieser Sitzung nicht vorlag. Ein Scan wäre bei Hautdetail im Vorteil, würde aber ein neues Rig und eine neue Pose-Lösung brauchen. Poly Haven enthält keine menschliche Hand. `generate_3d` wurde nicht benutzt.

## 10. Bekannte Grenzen

- Die Finger der Handy-Hand überdecken mehr vom Bildschirm als im Design (Zeigefinger 111 px statt 28 px), weil echte Finger dicker sind. Verschieben der Hand nach links versteckt den Daumenballen-Knick besser, drückt aber die Fingerspitzen weiter auf den Bildschirm (getestet, verworfen).
- Zwischen Daumen und Unterarm der Handy-Hand sitzt am unteren linken Handyeck eine Taille (der Handballen liegt hinter dem Handy). Im Halbton fällt sie wenig auf, in der Luminanz sieht man sie.
- Beide Hände sind Linkshände (Spiegelkamera, wie im Design: Daumen links bzw. oben). Für eine Rechtshand beim Zeigen: `b = −b` (Abschnitt 5).
- Die Zeigehand verblasst am Handgelenk, weil sie in Echtgröße modelliert ist und die Engine bei 720 px ausblendet (siehe 5). Das Design zeigt den Arm bis in die Ecke.
- Die Zeigehand kann bei Zeigerposition rechts der Handymitte auf den kleinen Finger der Handy-Hand fallen (zwei Halbton-Flächen laufen ineinander). Idle-Pfad der Zeigehand bei etwa `x 780–860, y 330–470` halten.
- Der Halbton (Zellgröße 2,5 px) löst Fingernägel, Knöchelfalten und Poren nicht auf; die Echtheit kommt von Silhouette und Verlauf. Nägel und Daumen erscheinen als kleine, glatte Flächen.
- `lum` ist für ein festes Licht gebacken. Das Zeigerlicht verschiebt nur Glanz und Helligkeit, keine Schlagschatten.
