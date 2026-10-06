// Gemeinsame Helfer. Nach A0 eingefroren: neue Helfer gehören in die eigene Szenendatei.
export const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ss = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (x) => 1 - Math.pow(1 - cl(x), 4);
export const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
export const backOut = (x, c = 1.2) => { x = cl(x); return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
// Bildratenunabhängige Glättung: cur += (ziel - cur) * damp(rate, dt)
export const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
// Semi-implizite Feder auf {x, v}; k=170, d=14 sind die Startwerte aus dem Plan.
export const spring = (s, target, dt, k = 170, d = 14) => { s.v += (k * (target - s.x) - d * s.v) * dt; s.x += s.v * dt; return s.x; };
export const hsh = (i, j) => { let h = (i * 374761393 + j * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
export const vnz = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hsh(xi, yi), b = hsh(xi + 1, yi), c = hsh(xi, yi + 1), d = hsh(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
export const smn = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
export const cap = (px, py, ax, ay, bx, by, r) => { const pax = px - ax, pay = py - ay, bax = bx - ax, bay = by - ay; const h = cl((pax * bax + pay * bay) / (bax * bax + bay * bay)); return Math.hypot(pax - bax * h, pay - bay * h) - r; };
// Uneven Capsule (Inigo Quilez)
export const uc = (px, py, ax, ay, bx, by, ra, rb) => { const x = px - ax, y = py - ay, ex = bx - ax, ey = by - ay, h = ex * ex + ey * ey; const qx = Math.abs((x * ey - y * ex) / h); const qy = (x * ex + y * ey) / h;
  const bb = ra - rb, cx = Math.sqrt(Math.max(h - bb * bb, 1e-6)), cy = bb, k = cx * qy - cy * qx, m = cx * qx + cy * qy, n = qx * qx + qy * qy;
  if (k < 0) return Math.sqrt(h * n) - ra; if (k > cx) return Math.sqrt(h * (n + 1 - 2 * qy)) - rb; return m - ra; };
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// ---- Zeichen aus acht Körpern: eine Quelle für JS und GLSL ----
export const AB = [[200, 198, 80], [77, 105, 52], [142, 302, 33], [274, 297, 44], [194, 32, 29], [288, 70, 42], [360, 177, 56], [42, 239, 44]];
export const MARK_C = [208, 173], MARK_HOLE = [207, 175, 23], MARK_K = 38;
export const SUN_S = 600, ORG_S = 110;
export const HOME = AB.map((b) => [(b[0] - MARK_C[0]) / SUN_S, -(b[1] - MARK_C[1]) / SUN_S, b[2] / SUN_S]);
export const HOME3 = AB.map((b) => [(b[0] - MARK_C[0]) / ORG_S, -(b[1] - MARK_C[1]) / ORG_S, b[2] / ORG_S]);
export const markD = (x, y) => { let d = 1e9; for (const c of AB) d = smn(d, Math.hypot(x - c[0], y - c[1]) - c[2], MARK_K); return Math.max(d, MARK_HOLE[2] - Math.hypot(x - MARK_HOLE[0], y - MARK_HOLE[1])); };
const f = (n) => (Number.isInteger(n) ? n + '.' : String(n));
// GLSL: markD(p) in Zeichen-Koordinaten (wie markD oben) plus Konstanten für org(p) mit den animierten Körpern in uB[8].
export const MARK_GLSL = `const vec3 MK[8]=vec3[8](${AB.map((b) => `vec3(${b.map(f).join(',')})`).join(',')});
float markD(vec2 p){ float d=1e5; for(int i=0;i<8;i++){ float a=length(p-MK[i].xy)-MK[i].z; float h=max(${f(MARK_K)}-abs(d-a),0.)/${f(MARK_K)}; d=min(d,a)-h*h*${f(MARK_K)}*.25; } return max(d,${f(MARK_HOLE[2])}-length(p-vec2(${f(MARK_HOLE[0])},${f(MARK_HOLE[1])}))); }
const float SMK=${(MARK_K / SUN_S).toFixed(5)};
const vec2 HOLE_OFF=vec2(${((MARK_HOLE[0] - AB[0][0]) / SUN_S).toFixed(5)},${(-(MARK_HOLE[1] - AB[0][1]) / SUN_S).toFixed(5)});
const float HOLE_R=${(MARK_HOLE[2] / SUN_S).toFixed(5)};`;

// ---- Zeitachse: alle P-Bereiche an einer Stelle (P = Fortschritt der Bogen-Sektion, 0..1) ----
export const TL = {
  hold: 0.12,             // Berg steht still
  look: [0.12, 0.24],     // Kamera kippt, Sonne wächst (Verwandlung 0,14-0,26)
  mx: [0.20, 0.26],       // Berg -> Organ
  split: [0.26, 0.36, 0.38, 0.48], // Zerfall hoch / runter
  zoom: [0.22, 0.42],
  dive: [0.48, 0.58],     // Tauchgang, Wohnung im Loch
  fp: [0.56, 0.62],       // Stub: Überblendung GL -> Wohnung (B1/B2 ersetzen durch Clip)
  wohn: [0.58, 0.88],     // Räume 01-04
  flut: [0.82, 0.88, 0.92, 0.97], // Flut nur einmal: Wohnung -> Hand
  end: [0.90, 0.95],      // Hand mit Handy
  gate: { hero: [0, 0.64], wohnung: [0.46, 0.93], flut: [0.8, 0.98], hand: [0.86, 1] },
  // P-Marken für tools/shots.mjs (Bogen), dazu Abschnitts-Marken (Fortschritt 0..1 je Sektion)
  marks: [0, 0.06, 0.12, 0.18, 0.20, 0.22, 0.24, 0.30, 0.44, 0.48, 0.52, 0.56, 0.58, 0.64, 0.72, 0.80, 0.86, 0.90, 0.95, 1],
  sections: { koerper: [0.5], tiefe: [0.05, 0.5, 0.95], installieren: [0.5], fragen: [0.5], finale: [0.1, 0.4, 0.7], footer: [0.5] },
};
const rng = (P, [a, b]) => ss((P - a) / (b - a));
export const tlAt = (P) => {
  const [s0, s1, s2, s3] = TL.split, [f0, f1, f2, f3] = TL.flut;
  const fp = rng(P, TL.fp), end = rng(P, TL.end), wp = cl((P - TL.wohn[0]) / (TL.wohn[1] - TL.wohn[0])), vis = fp * (1 - end), fs = wp * 5;
  return { look: rng(P, TL.look), mx: rng(P, TL.mx), split: ss((P - s0) / (s1 - s0)) * (1 - ss((P - s2) / (s3 - s2))), zoom: rng(P, TL.zoom), dive: rng(P, TL.dive),
    fp, end, wp, g: 1 - fp, f: vis, e: end, flut: ss((P - f0) / (f1 - f0)) * (1 - ss((P - f2) / (f3 - f2))),
    c: [0, 1, 2, 3].map((j) => vis * ss(1.7 - Math.abs(fs - (j + 1)) * 2.4)) };
};

// ---- Virtueller Raum: Desktop 1280x800 passend eingepasst, mobil Ankerpunkt (ax,ay) in der Mitte, Höhe deckend ----
export const space = (vw, vh, tier, ax = 640, ay = 400) => {
  if (tier === 'mobile') { const k = vh / 800; return { W: 1280, H: 800, k, ox: vw / 2 - ax * k, oy: vh / 2 - ay * k }; }
  const k = Math.min(vw / 1280, vh / 800); return { W: 1280, H: 800, k, ox: (vw - 1280 * k) / 2, oy: (vh - 800 * k) / 2 };
};
export const mono = (px) => `500 ${px}px "JetBrains Mono", monospace`;
export const fitCanvas = (cv, vw, vh, dpr) => { const w = Math.round(vw * dpr), h = Math.round(vh * dpr); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } return cv.getContext('2d'); };
