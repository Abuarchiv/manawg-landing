export function art() { // PORT
      const a_hs = (i, j) => { let h = (i * 374761393 + j * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
      const a_vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = a_hs(xi, yi), b = a_hs(xi + 1, yi), c = a_hs(xi, yi + 1), d = a_hs(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
      const a_cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
      const a_sm = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
      const AB = [[200,198,80],[77,105,52],[142,302,33],[274,297,44],[194,32,29],[288,70,42],[360,177,56],[42,239,44]];
      const a_mark = (x, y) => { let d = 1e9; for (const c of AB) d = a_sm(d, Math.hypot(x - c[0], y - c[1]) - c[2], 38); return Math.max(d, 23 - Math.hypot(x - 207, y - 175)); };
      const adpr = 1, ART = { list: [], fv: 0, t0: performance.now() / 1000 };
      if (document.fonts) { document.fonts.ready.then(() => { ART.fv++; }); document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', () => { ART.fv++; }); }
      const scan = () => { ART.list = [...document.querySelectorAll('canvas[data-art]')].map(cv => { if (cv.__s) return cv.__s; const W = +cv.dataset.w, H = +cv.dataset.h; cv.width = W * adpr; cv.height = H * adpr; const ctx = cv.getContext('2d'); ctx.setTransform(adpr, 0, 0, adpr, 0, 0);
        let sc = cv.parentElement; while (sc && sc.style && sc.style.overflowY !== 'auto') sc = sc.parentElement;
        const s = { cv, ctx, W, H, sc, type: cv.dataset.art, m: { x: -999, y: -999, in: false }, sm: { x: W * 0.6, y: H * 0.4 } };
        const host = cv.parentElement; host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); s.m.x = (e.clientX - r.left) * W / r.width; s.m.y = (e.clientY - r.top) * H / r.height; s.m.in = true; s.onMove && s.onMove(); }); host.addEventListener('pointerleave', () => { s.m.in = false; s.m.down = false; }); host.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); s.m.x = (e.clientX - r.left) * W / r.width; s.m.y = (e.clientY - r.top) * H / r.height; s.m.down = true; s.onDown && s.onDown(); }); window.addEventListener('pointerup', () => { if (s.m.down) { s.m.down = false; s.onUp && s.onUp(); } });
        cv.__s = s; return s; }); };
      const ptext = s => { const { ctx, W, H, cv } = s, cs = +cv.dataset.cs || 8, txt = cv.dataset.text || '', fs = +cv.dataset.fs || 120, mono = cv.dataset.font === 'mono', ff = mono ? '"JetBrains Mono", monospace' : '"Inter Tight", sans-serif', fw = mono ? 500 : 600;
        const key = txt + '|' + ART.fv; if (s.key !== key) { s.key = key; const cols = Math.ceil(W / cs), rows = Math.ceil(H / cs), oc = document.createElement('canvas'); oc.width = cols; oc.height = rows; const o = oc.getContext('2d'); o.fillStyle = '#000'; o.font = fw + ' ' + (fs / cs) + 'px ' + ff; o.textBaseline = 'alphabetic';
          txt.split('|').forEach((ln, i) => o.fillText(ln, 0, (fs * 0.8 + i * fs * 0.9) / cs)); const d = o.getImageData(0, 0, cols, rows).data, on = new Uint8Array(cols * rows); for (let q = 0; q < on.length; q++) on[q] = d[q * 4 + 3] > 110 ? 1 : 0;
          const old = s.cells || []; s.cells = []; let k = 0; for (let q = 0; q < on.length; q++) if (on[q]) { const p = old[k++]; s.cells.push({ x: (q % cols) * cs, y: Math.floor(q / cols) * cs, ox: p ? p.x + p.ox - (q % cols) * cs : (a_hs(q, 1) - 0.5) * 300, oy: p ? p.y + p.oy - Math.floor(q / cols) * cs : (a_hs(q, 2) - 0.5) * 300, vx: 0, vy: 0 }); }
          s.nums = []; if (cs >= 10) for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) { if (on[b * cols + a]) continue; let c = 0; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const x = a + di, y = b + dj; if ((di || dj) && x >= 0 && y >= 0 && x < cols && y < rows && on[y * cols + x]) c++; } if (c && a_hs(a, b) < 0.3) s.nums.push([a * cs + cs / 2, b * cs + cs / 2, c]); } }
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#FAFAFA'; const R = 110, GL = cv.dataset.glyph, GR = '@%#*+=-:'; if (GL) { ctx.font = '500 ' + Math.round(cs * 1.25) + 'px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; } const tq = Math.floor(performance.now() / 90);
        for (const c of s.cells) { if (s.m.in) { const dx = c.x + c.ox - s.m.x, dy = c.y + c.oy - s.m.y, d2 = dx * dx + dy * dy; if (d2 < R * R) { const d = Math.sqrt(d2) + 0.1, g = (1 - d / R) * 3.2; c.vx += dx / d * g; c.vy += dy / d * g; } }
          c.vx += -c.ox * 0.07; c.vy += -c.oy * 0.07; c.vx *= 0.8; c.vy *= 0.8; c.ox += c.vx; c.oy += c.vy; if (GL) { const sp = Math.hypot(c.vx, c.vy), off = Math.hypot(c.ox, c.oy); const gi = off > 3 || sp > 0.5 ? Math.floor(a_hs(c.x + tq, c.y) * 8) : Math.floor(a_hs(c.x, c.y) * 3); ctx.fillText(GR[gi], c.x + c.ox + cs / 2, c.y + c.oy + cs / 2); } else ctx.fillRect(c.x + c.ox, c.y + c.oy, cs - 1, cs - 1); }
        if (s.nums.length) { ctx.globalAlpha = 0.5; ctx.font = '500 ' + Math.round(cs * 0.8) + 'px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (const n of s.nums) ctx.fillText(String(n[2]), n[0], n[1] + 1); ctx.globalAlpha = 1; } };
      const tone = (s, t) => { const { ctx, W, H } = s, step = 6, sc = 1.3 * (1 + 0.025 * Math.sin(t * Math.PI / 3)), cx = W / 2, cy = H / 2;
        const tg = s.m.in ? [s.m.x, s.m.y] : [cx + Math.cos(t * 0.3) * 220, cy - 160 + Math.sin(t * 0.4) * 80]; s.sm.x += (tg[0] - s.sm.x) * 0.08; s.sm.y += (tg[1] - s.sm.y) * 0.08;
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#FAFAFA';
        for (let y = step / 2, j = 0; y < H; y += step, j++) for (let x = step / 2, i = 0; x < W; x += step, i++) { const mx = (x - cx) / sc + 208, my = (y - cy) / sc + 173; if (mx < -60 || mx > 480 || my < -60 || my > 400) continue; const d = a_mark(mx, my); let v = 0;
          if (d < 0) { const gx = a_mark(mx + 1, my) - d, gy = a_mark(mx, my + 1) - d, h = Math.sqrt(a_cl(-d / 46)), sl = (1 - h) * 2, nx = gx * sl, ny = gy * sl, nl = Math.hypot(nx, ny, 1), lx = s.sm.x - x, ly = s.sm.y - y, ll = Math.hypot(lx, ly, 220), lam = Math.max(0, (nx * lx + ny * ly + 220) / (nl * ll)); v = Math.pow(h, 0.3) * (0.08 + 0.92 * lam * lam); }
          else if (d < 70) { if (a_hs(i * 7 + Math.floor(t * 2), j) < 0.18 * (1 - d / 70)) v = 0.25; }
          if (v > 0.03) { const r = step * 0.5 * Math.sqrt(a_cl(v)); ctx.fillRect(x - r, y - r, r * 2, r * 2); } } };
      const topo = (s, t) => { const { ctx, W, H } = s, g = 12, cols = Math.ceil(W / g) + 1, rows = Math.ceil(H / g) + 1;
        const tg = s.m.in ? [s.m.x, s.m.y] : [W * 0.6 + Math.cos(t * 0.2) * 160, H * 0.5 + Math.sin(t * 0.25) * 100]; s.sm.x += (tg[0] - s.sm.x) * 0.05; s.sm.y += (tg[1] - s.sm.y) * 0.05;
        if (!s.f || s.f.length !== cols * rows) s.f = new Float32Array(cols * rows); const F = s.f;
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = i * g, y = j * g, r2 = ((x - s.sm.x) ** 2 + (y - s.sm.y) ** 2) / (2 * 160 * 160); F[j * cols + i] = a_vn(x * 0.0035 + t * 0.012, y * 0.0035) * 0.75 + a_vn(x * 0.009, y * 0.009 - t * 0.02) * 0.25 + Math.exp(-r2) * 0.55 + (x / W) * 0.2; }
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.lineWidth = 1; const L = 22;
        for (let l = 1; l < L; l++) { const iso = l / L * 1.5; ctx.strokeStyle = l % 5 === 0 ? 'rgba(250,250,250,0.8)' : 'rgba(250,250,250,0.3)'; ctx.beginPath();
          for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) { const a = F[j * cols + i], b = F[j * cols + i + 1], c = F[(j + 1) * cols + i + 1], d = F[(j + 1) * cols + i]; const k = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0); if (k === 0 || k === 15) continue;
            const x = i * g, y = j * g, T = [x + g * (iso - a) / (b - a), y], R = [x + g, y + g * (iso - b) / (c - b)], B = [x + g * (iso - d) / (c - d), y + g], Lf = [x, y + g * (iso - a) / (d - a)], sg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
            switch (k) { case 1: case 14: sg(Lf, B); break; case 2: case 13: sg(B, R); break; case 3: case 12: sg(Lf, R); break; case 4: case 11: sg(T, R); break; case 5: sg(Lf, T); sg(B, R); break; case 6: case 9: sg(T, B); break; case 7: case 8: sg(Lf, T); break; case 10: sg(T, R); sg(Lf, B); break; } }
          ctx.stroke(); } };
      const ascii = (s, t) => { const { ctx, W, H, cv } = s, mode = cv.dataset.mode || 'mark', cw = 9, chh = 14, RAMP = ' .:-=+*#%@';
        const tg = s.m.in ? [s.m.x, s.m.y] : [W / 2 + Math.cos(t * 0.3) * 260, H * 0.3 + Math.sin(t * 0.4) * 90]; s.sm.x += (tg[0] - s.sm.x) * 0.08; s.sm.y += (tg[1] - s.sm.y) * 0.08;
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#FAFAFA'; ctx.font = '500 12px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const sc = 1.25, cx = W / 2, cy = H / 2, rise = Math.min(1, t / 6), sr = H * 0.62, sy = H + sr * 0.35 - rise * sr * 0.55;
        for (let y = chh / 2, j = 0; y < H; y += chh, j++) for (let x = cw / 2, i = 0; x < W; x += cw, i++) { let v = 0;
          if (mode === 'globe') { const R = H * 0.42, gx0 = W * 0.62, gy0 = H * 0.5, nx = (x - gx0) / R, ny = (y - gy0) / R, q = nx * nx + ny * ny;
            if (q < 1) { const nz = Math.sqrt(1 - q), rot = t * 0.18 + (s.sm.x / W - 0.5) * 2, X = nx * Math.cos(rot) + nz * Math.sin(rot), Z = -nx * Math.sin(rot) + nz * Math.cos(rot), lon = Math.atan2(X, Z), lat = Math.asin(-ny);
              const land = a_mark(208 + lon / Math.PI * 320, 173 - lat / 1.5708 * 230) < 0, lx = (s.sm.x - gx0) / R, ly = (s.sm.y - gy0) / R, ll = Math.hypot(lx, ly, 1.4), lam = Math.max(0, (nx * lx + ny * ly + nz * 1.4) / ll);
              v = land ? 0.35 + 0.65 * lam : (a_hs(i, j) < 0.5 ? 0.12 + 0.18 * lam : 0); if (q > 0.93) v = Math.max(v, 0.3); } }
          else if (mode === 'mark') { const mx = (x - cx) / sc + 208, my = (y - cy) / sc + 173, d = a_mark(mx, my);
            if (d < 0) { const gx = a_mark(mx + 1, my) - d, gy = a_mark(mx, my + 1) - d, h = Math.sqrt(a_cl(-d / 46)), sl = (1 - h) * 2, nx = gx * sl, ny = gy * sl, nl = Math.hypot(nx, ny, 1), lx = s.sm.x - x, ly = s.sm.y - y, ll = Math.hypot(lx, ly, 240), lam = Math.max(0, (nx * lx + ny * ly + 240) / (nl * ll)); v = Math.pow(h, 0.3) * (0.1 + 0.9 * lam * lam); }
            else if (d < 90 && a_hs(i + Math.floor(t * 3) * 13, j) < 0.06 * (1 - d / 90)) v = 0.15; }
          else { const dx = x - cx, dy = y - sy, r = Math.hypot(dx, dy), an = Math.atan2(dy, dx);
            if (r < sr) v = 0.35 + 0.6 * (1 - r / sr) + (a_vn(x * 0.02, y * 0.03 - t * 0.5) - 0.5) * 0.3; else { const ray = 0.5 + 0.5 * Math.cos(an * 22 + t * 0.2); v = ray > 0.82 ? 0.5 * Math.exp(-(r - sr) / 160) : 0; }
            const md = Math.hypot(x - s.sm.x, y - s.sm.y); if (s.m.in && md < 120) v *= md / 120;
            if (a_hs(i, j + Math.floor(t * 4 + i * 0.37) * 7) < 0.012 * (1 - y / H)) v = Math.max(v, 0.2); }
          if (v > 0.06) { let ci = Math.min(9, 1 + Math.floor(a_cl(v) * 8.99)); if (s.m.in) { const md = Math.hypot(x - s.m.x, y - s.m.y); if (md < 70 && a_hs(i + Math.floor(t * 12), j) < 0.6 * (1 - md / 70)) ci = 1 + Math.floor(a_hs(i, j + Math.floor(t * 12)) * 9); } ctx.fillText(RAMP[ci], x, y); } } };
      const mosaic = (s, t) => { const { ctx, W, H, cv } = s, c = 16, cy = H * (+cv.dataset.cy || 0.52);
        const tg = s.m.in ? [s.m.x, s.m.y] : [W / 2 + Math.sin(t * 0.3) * 120, cy]; s.sm.x += (tg[0] - s.sm.x) * 0.06; s.sm.y += (tg[1] - s.sm.y) * 0.06;
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);
        for (let y = 0, j = 0; y < H; y += c, j++) for (let x = 0, i = 0; x < W; x += c, i++) { const px = x + c / 2, py = y + c / 2, dy = (py - cy) / (H * 0.17);
          let v = Math.exp(-dy * dy) * (0.65 + 0.35 * a_vn(i * 0.25 + t * 0.3, j * 0.4)); const dh = Math.hypot(px - s.sm.x, (py - s.sm.y) * 1.4);
          v += Math.max(0, Math.sin(dh * 0.12 - t * 3)) * Math.exp(-dh / 200) * 0.35; v *= a_cl((dh - 46) / 30); v += (a_hs(i, j + Math.floor(t * 2)) - 0.5) * 0.08 * Math.exp(-dy * dy * 0.3);
          if (v < 0.05) continue; const q = Math.round(a_cl(v) * 8) / 8, g = Math.round(20 + q * 230); ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; ctx.fillRect(x, y, c - 1, c - 1); }
        ctx.strokeStyle = 'rgba(250,250,250,0.12)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x += c * 4) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } ctx.stroke(); };
      const mesh = (s, t) => { const { ctx, W, H } = s; const tg = s.m.in ? [s.m.x, s.m.y] : [W / 2, H / 2]; s.sm.x += (tg[0] - s.sm.x) * 0.05; s.sm.y += (tg[1] - s.sm.y) * 0.05; const px = (s.sm.x - W / 2) / W, py = (s.sm.y - H / 2) / H;
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.lineWidth = 1;
        const hz = H * 0.42, P = (x, z, y) => { const k = 1 / z; return [W / 2 + (x - px * 2) * k * W * 0.5, hz + (1.2 - y) * k * H * 0.5]; };
        for (let zi = 0; zi < 46; zi++) { const z = 0.9 + zi * 0.16; ctx.strokeStyle = 'rgba(250,250,250,' + (0.55 * Math.exp(-zi / 26)).toFixed(3) + ')'; ctx.beginPath();
          for (let xi = 0; xi <= 70; xi++) { const x = (xi / 70 - 0.5) * 9, y = (a_vn(x * 0.7 + 3, z * 0.7 - t * 0.15) - 0.3) * 1.2 + Math.exp(-((x - 1.5) ** 2) / 2) * 0.6; const p = P(x, z, y); xi ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); }
        const SPH = [[0.62, 0.38, 92, 0.6], [0.4, 0.52, 54, 1.1], [0.3, 0.32, 32, 1.6]];
        for (const sp of SPH) { const cx = W * sp[0] - px * 40 * sp[3], cy = H * sp[1] - py * 30 * sp[3] + Math.sin(t * 0.6 + sp[3] * 3) * 8, r = sp[2], rot = t * 0.25 * sp[3]; ctx.strokeStyle = 'rgba(250,250,250,0.55)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.stroke();
          ctx.strokeStyle = 'rgba(250,250,250,0.28)'; ctx.beginPath(); for (let k = 1; k < 8; k++) { const a = k / 8 * Math.PI, yy = cy - Math.cos(a) * r, rr = Math.sin(a) * r; ctx.moveTo(cx + rr, yy); ctx.ellipse(cx, yy, rr, rr * 0.18, 0, 0, 6.2832); }
          for (let k = 0; k < 8; k++) { const a = rot + k / 8 * Math.PI, rx = Math.abs(Math.cos(a)) * r; ctx.moveTo(cx, cy - r); ctx.ellipse(cx, cy, rx, r, 0, -Math.PI / 2, Math.PI * 1.5); } ctx.stroke(); } };
      const z_l = (a, b, t) => a + (b - a) * t, z_ss = x => { x = a_cl(x); return x * x * (3 - 2 * x); }, ZMONO = '"JetBrains Mono", monospace', ZTT = '"Inter Tight", sans-serif';
      const stickP = s => { const sec = s.sec || (s.sec = s.cv.closest('[data-stick]')); if (!sec || !s.sc) return 0; const a = sec.getBoundingClientRect(), b = s.sc.getBoundingClientRect(); return a_cl((b.top - a.top) / Math.max(1, a.height - b.height)); };
      const sampleT = (lines, px, step) => { const lh = px * 0.95, w = 1600, h = Math.ceil(lines.length * lh + px * 0.4), oc = document.createElement('canvas'); oc.width = w; oc.height = h; const o = oc.getContext('2d'); o.font = '600 ' + px + 'px ' + ZTT; o.textAlign = 'center'; o.fillStyle = '#000'; lines.forEach((l, i) => o.fillText(l, w / 2, px * 0.82 + i * lh)); const d = o.getImageData(0, 0, w, h).data, pts = []; for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 128) pts.push([x - w / 2, y - h / 2]); return pts; };
      const depth = (s, t) => { const { ctx, W, H } = s;
        if (!s.P || s.built !== ART.fv) { s.built = ART.fv; const RAMP = '@#%*+='; s.isl = [['GELD'], ['HAUSHALT'], ['ABSPRACHEN']].map((w, i) => ({ z: 26 * i, x: [-4.5, 4.5, -4.5][i], y: [0.8, -0.8, 0.8][i], pts: sampleT(w, 200, 5).map(p => [p[0] / 85, p[1] / 85]) }));
          s.P = []; s.isl.forEach((I, k) => I.pts.forEach((p, q) => s.P.push([I.x + p[0], I.y + p[1], I.z + (a_hs(q, k) - 0.5) * 0.6, RAMP[Math.floor(a_hs(q, k + 9) * 6)], k]))); for (let q = 0; q < 1600; q++) s.P.push([(a_hs(q, 1) - 0.5) * 60, (a_hs(q, 2) - 0.5) * 36, a_hs(q, 3) * 90 - 14, '.:+'[Math.floor(a_hs(q, 4) * 3)], -1]);
          s.caps = [...s.cv.parentElement.querySelectorAll('[data-dcap]')]; s.dep = s.cv.parentElement.querySelector('[data-depth]'); s.dp = 0; }
        s.dp += (stickP(s) - s.dp) * 0.1; const p = s.dp, camZ = -14 + p * 57, seg = a_cl((camZ + 14) / 26, 0, 1.999), si = Math.floor(seg), sf = z_ss(seg - si);
        if (s.m.in) { s.sm.x += (s.m.x - s.sm.x) * 0.06; s.sm.y += (s.m.y - s.sm.y) * 0.06; }
        const camX = z_l(s.isl[si].x, s.isl[si + 1].x, sf) * 0.85 + (s.sm.x - 640) / 640 * 1.2, camY = z_l(s.isl[si].y, s.isl[si + 1].y, sf) * 0.85 + (s.sm.y - 400) / 400 * 0.8, F = 720;
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); const near = [];
        for (const q of s.P) { let x = q[0], y = q[1]; const dz = q[2] - camZ; if (dz < 0.25 || dz > 110) continue;
          if (q[4] >= 0 && dz < 5) { const I = s.isl[q[4]], k = (5 - dz) * 0.35; x += (x - I.x) * k; y += (y - I.y) * k; }
          const fz = F / dz; let sx = W / 2 + (x - camX) * fz, sy = H / 2 + (y - camY) * fz; if (sx < -40 || sy < -40 || sx > W + 40 || sy > H + 40) continue;
          if (s.m.in) { const dx = sx - s.m.x, dy = sy - s.m.y, d = Math.hypot(dx, dy); if (d < 120) { const g = (1 - d / 120) * 46; sx += dx / (d + 0.1) * g; sy += dy / (d + 0.1) * g; } }
          const a = a_cl(dz / 1.2) * (q[4] < 0 ? a_cl((110 - dz) / 50) * 0.55 : a_cl((34 - dz) / 12)), sz = a_cl(0.07 * fz, 0.8, 64); if (a <= 0.01) continue;
          if (sz < 6) { ctx.globalAlpha = a; ctx.fillStyle = '#FAFAFA'; ctx.fillRect(sx, sy, sz * 0.55, sz * 0.55); } else near.push([Math.min(5, Math.floor(Math.log2(sz / 6) * 2)), sx, sy, q[3], a]); }
        near.sort((a, b) => a[0] - b[0]); let fb = -1; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FAFAFA';
        for (const n of near) { if (n[0] !== fb) { fb = n[0]; ctx.font = '500 ' + Math.round(8 * Math.pow(2, fb / 2)) + 'px ' + ZMONO; } ctx.globalAlpha = n[4]; ctx.fillText(n[3], n[1], n[2]); }
        ctx.globalAlpha = 1; s.caps.forEach(el => { const i = +el.getAttribute('data-dcap'), dz = s.isl[i].z - camZ; el.style.opacity = a_cl(1 - Math.abs(dz - 9) / 5).toFixed(3); });
        if (s.dep) s.dep.textContent = String(Math.max(0, Math.round((camZ + 14) * 10))).padStart(3, '0'); };
      const PW = 900, PH = 2300;
      const press = (s, t) => { const { ctx, W, H } = s;
        if (!s.L || s.built !== ART.fv) { s.built = ART.fv; const oc = document.createElement('canvas'); oc.width = PW; oc.height = PH; const o = oc.getContext('2d'); o.fillStyle = '#FFFFFF'; o.fillRect(0, 0, PW, PH); o.fillStyle = '#000';
          const T = (txt, y, px) => { o.font = '600 ' + px + 'px ' + ZTT; o.textAlign = 'left'; o.fillText(txt, 60, y); }; T('Die App', 300, 190); T('für eure WG.', 480, 150);
          const ms = 1.55, mx = PW / 2 - 208 * ms, my = 700; AB.forEach(c => { const cx = mx + c[0] * ms, cy = my + c[1] * ms, r = c[2] * ms * 1.08, g = o.createRadialGradient(cx - r * 0.45, cy - r * 0.5, r * 0.05, cx, cy, r); g.addColorStop(0, '#D4D4D4'); g.addColorStop(0.6, '#404040'); g.addColorStop(1, '#0A0A0A'); o.fillStyle = g; o.beginPath(); o.arc(cx, cy, r, 0, 6.2832); o.fill(); });
          o.fillStyle = '#FFFFFF'; o.beginPath(); o.arc(mx + 207 * ms, my + 175 * ms, 23 * ms, 0, 6.2832); o.fill();
          for (let k = 0; k < 10; k++) { const g = Math.round(k * 25.5); o.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; o.fillRect(60 + k * 78, 1380, 70, 70); }
          const lg = o.createLinearGradient(0, 0, PW, 0); lg.addColorStop(0, '#000'); lg.addColorStop(1, '#FFF'); o.fillStyle = lg; o.fillRect(60, 1530, PW - 120, 130); o.fillStyle = '#000'; T('Alltag', 1950, 200); T('teilen.', 2130, 200);
          const d = o.getImageData(0, 0, PW, PH).data; s.L = new Uint8Array(PW * PH); for (let q = 0; q < s.L.length; q++) s.L[q] = d[q * 4];
          s.labels = [[60, 80, 'MANAWG · DRUCKBOGEN · RASTER 60', 12], [60, 540, 'Für alle in der WG an einem Ort.', 20], [60, 1490, 'TONWERTE 0–100 %', 12], [60, 1690, 'VERLAUF', 12], [60, 2200, 'app.manawg.com', 22]];
          const par = s.cv.parentElement; s.cta = par.querySelector('[data-pcta]'); s.sheet = par.querySelector('[data-sheet]'); s.pp = 0; }
        const prev = s.pp; s.pp += (stickP(s) - s.pp) * 0.1; const p = s.pp, vel = (s.pp - prev) * 3000, RY = H - 150, RR = 46, top = RY - 640 - p * (PH - 640), px0 = (W - PW) / 2, st = 6;
        ctx.fillStyle = '#E5E5E5'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(10,10,10,0.08)'; ctx.fillRect(px0 + 10, Math.max(0, top) + 10, PW, H); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(px0, Math.max(0, top), PW, H);
        ctx.fillStyle = '#E5E5E5'; for (let y = ((top % 24) + 24) % 24; y < H; y += 24) { if (y < top) continue; ctx.beginPath(); ctx.arc(px0 + 18, y, 5, 0, 6.2832); ctx.arc(px0 + PW - 18, y, 5, 0, 6.2832); ctx.fill(); }
        ctx.fillStyle = '#0A0A0A'; ctx.beginPath();
        for (let y = Math.max(0, Math.ceil((0 - top) / st) * st + top); y < RY - RR + 4; y += st) { const py = Math.round(y - top); if (py < 0 || py >= PH) continue; const wet = a_cl(1 - (RY - RR - y) / 50);
          for (let x = 40; x < PW - 40; x += st) { const dk = 1 - s.L[py * PW + x] / 255; if (dk < 0.04) continue; const r = st * 0.56 * Math.sqrt(dk), jx = wet ? (a_hs(x, py) - 0.5) * wet * 2 : 0; ctx.moveTo(px0 + x + jx + r, y); ctx.arc(px0 + x + jx, y, r, 0, 6.2832); } }
        ctx.fill(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        for (const lb of s.labels) { const y = top + lb[1]; if (y > 0 && y < RY - RR - 2) { ctx.font = lb[3] < 14 ? '500 ' + lb[3] + 'px ' + ZMONO : '500 ' + lb[3] + 'px Inter, sans-serif'; ctx.fillText(lb[2], px0 + lb[0], y); } }
        [[0.12, 1000], [0.88, 1000], [0.12, 1800], [0.88, 1800]].forEach(r => { const x = px0 + PW * r[0], y = top + r[1]; if (y < 0 || y > RY - RR) return; ctx.strokeStyle = '#0A0A0A'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.2832); ctx.moveTo(x - 16, y); ctx.lineTo(x + 16, y); ctx.moveTo(x, y - 16); ctx.lineTo(x, y + 16); ctx.stroke(); });
        const g = ctx.createLinearGradient(0, RY - RR, 0, RY + RR); g.addColorStop(0, '#0A0A0A'); g.addColorStop(0.3, '#737373'); g.addColorStop(0.45, '#D4D4D4'); g.addColorStop(0.7, '#262626'); g.addColorStop(1, '#0A0A0A'); ctx.fillStyle = g; ctx.fillRect(0, RY - RR, W, RR * 2);
        s.ph = (s.ph || 0) + vel * 0.004 + 0.002; ctx.fillStyle = '#FAFAFA';
        for (let k = 0; k < 28; k++) { const a = s.ph + k / 28 * 6.2832, c = Math.cos(a); if (c <= 0.05) continue; const y = RY - Math.sin(a) * RR; ctx.globalAlpha = c * 0.35; for (let x = (k * 13) % 26; x < W; x += 26) ctx.fillRect(x, y - 0.75, 2 + c * 2, 1.5); }
        ctx.globalAlpha = 1; const sh = ctx.createLinearGradient(0, RY + RR, 0, RY + RR + 30); sh.addColorStop(0, 'rgba(10,10,10,0.25)'); sh.addColorStop(1, 'rgba(10,10,10,0)'); ctx.fillStyle = sh; ctx.fillRect(px0, RY + RR, PW, 30);
        if (Math.abs(vel) > 0.5) for (let k = 0; k < Math.min(40, Math.abs(vel) * 4); k++) { ctx.fillStyle = '#0A0A0A'; ctx.fillRect(px0 + 40 + a_hs(k, Math.floor(t * 30)) * (PW - 80), RY - RR - 4 - a_hs(k + 7, Math.floor(t * 30)) * 30, 1.5, 1.5); }
        ctx.font = '500 11px ' + ZMONO; ctx.fillStyle = '#525252'; ctx.fillText('WALZE 01 · ' + String(Math.round(p * 100)).padStart(3, '0') + ' %', 40, RY - RR - 12);
        if (s.m.in && s.m.y < RY - RR) { const R = 92; ctx.save(); ctx.beginPath(); ctx.arc(s.m.x, s.m.y, R, 0, 6.2832); ctx.clip(); ctx.drawImage(s.cv, (s.m.x - R / 3) * adpr, (s.m.y - R / 3) * adpr, (R * 2 / 3) * adpr, (R * 2 / 3) * adpr, s.m.x - R, s.m.y - R, R * 2, R * 2); ctx.restore();
          ctx.strokeStyle = '#0A0A0A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s.m.x, s.m.y, R, 0, 6.2832); ctx.stroke(); ctx.lineWidth = 1; ctx.fillStyle = '#0A0A0A'; ctx.textAlign = 'center'; ctx.fillText('FADENZÄHLER 3×', s.m.x, s.m.y + R + 18); }
        if (s.cta) { s.cta.style.opacity = a_cl((p - 0.85) / 0.1).toFixed(3); s.cta.style.pointerEvents = p > 0.92 ? 'auto' : 'none'; } if (s.sheet) s.sheet.textContent = '0' + Math.min(3, 1 + Math.floor(p * 3)); };
      const planet = (s, t) => { const { ctx, W, H } = s, cx = 820, cy = 430, R = 300;
        if (!s.PT) { s.PT = []; const N = 4200; for (let i = 0; i < N; i++) { const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * 2.399963, x = Math.cos(th) * r, z = Math.sin(th) * r, lon = Math.atan2(x, z), lat = Math.asin(y); s.PT.push([x, y, z, a_mark(208 + lon / Math.PI * 200, 173 - lat / 1.5708 * 160) < 0 ? 1 : 0]); }
          s.LM = AB.map(c => { const lon = (c[0] - 208) / 200 * Math.PI, lat = -(c[1] - 173) / 160 * 1.5708; return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]; });
          s.yaw = 0.3; s.pitch = 0.25; s.vy = 0; s.hov = -1; s.walk = [0, 1, 2, 3].map(k => ({ a: k * 2, b: (k * 2 + 3) % 8, t: a_hs(k, 3), tr: [] })); s.stars = []; for (let q = 0; q < 260; q++) s.stars.push([a_hs(q, 11) * W, a_hs(q, 12) * H, a_hs(q, 13)]);
          s.onDown = () => { s.px = s.m.x; s.py = s.m.y; s.mv = 0; }; s.onMove = () => { if (s.m.down) { const dx = s.m.x - s.px, dy = s.m.y - s.py; s.mv += Math.abs(dx) + Math.abs(dy); s.vy = dx * 0.006; s.yaw += dx * 0.006; s.pitch = a_cl(s.pitch + dy * 0.004, -0.9, 0.9); s.px = s.m.x; s.py = s.m.y; } };
          s.onUp = () => { if (s.mv < 6 && s.hov >= 0) this.setState({ sel: s.hov }); s.mv = 99; }; }
        const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
        if (!s.m.down) { s.vy *= 0.95; s.yaw += s.vy + 0.0025; }
        const ca = Math.cos(s.yaw), sa = Math.sin(s.yaw), cb = Math.cos(s.pitch), sb = Math.sin(s.pitch), rot = v => { const X = v[0] * ca + v[2] * sa, Z1 = -v[0] * sa + v[2] * ca; return [X, v[1] * cb - Z1 * sb, v[1] * sb + Z1 * cb]; };
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#FAFAFA';
        for (const st of s.stars) { ctx.globalAlpha = 0.15 + 0.35 * st[2] * (0.6 + 0.4 * Math.sin(t * 2 + st[0])); ctx.fillRect(st[0], st[1], 1.2, 1.2); }
        const gl = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 1.3); gl.addColorStop(0, 'rgba(250,250,250,0.12)'); gl.addColorStop(1, 'rgba(250,250,250,0)'); ctx.globalAlpha = 1; ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, 6.2832); ctx.arc(cx, cy, R, 0, 6.2832, true); ctx.fill('evenodd');
        ctx.fillStyle = '#0A0A0A'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill(); ctx.strokeStyle = 'rgba(250,250,250,0.35)'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = '#FAFAFA';
        for (const q of s.PT) { const v = rot(q); if (v[2] <= 0) continue; const lam = Math.max(0, v[0] * -0.45 + v[1] * 0.55 + v[2] * 0.7), a = q[3] ? 0.35 + 0.65 * lam : 0.15 + 0.3 * lam, sz = q[3] ? 2.6 : 1.6; ctx.globalAlpha = a * (0.4 + 0.6 * v[2]); ctx.fillRect(cx + v[0] * R - sz / 2, cy - v[1] * R - sz / 2, sz, sz); }
        ctx.globalAlpha = 0.25; ctx.strokeStyle = '#FAFAFA'; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.25, R * 0.28, -0.25, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1;
        for (const w of s.walk) { w.t += 0.004; if (w.t >= 1) { w.a = w.b; let nb; do nb = Math.floor(Math.random() * 8); while (nb === w.a); w.b = nb; w.t = 0; }
          const A = s.LM[w.a], B2 = s.LM[w.b], e = z_ss(w.t), u = nrm([z_l(A[0], B2[0], e), z_l(A[1], B2[1], e), z_l(A[2], B2[2], e)]); w.tr.push(u); if (w.tr.length > 60) w.tr.shift();
          w.tr.forEach((pt, i) => { const v = rot(pt); if (v[2] <= 0) return; ctx.globalAlpha = (i / w.tr.length) * 0.8; ctx.fillRect(cx + v[0] * R * 1.01 - 1, cy - v[1] * R * 1.01 - 1, 2, 2); });
          const v = rot(u); if (v[2] > 0) { ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx + v[0] * R * 1.015, cy - v[1] * R * 1.015, 4, 0, 6.2832); ctx.fill(); } }
        s.hov = -1; let bd = 26; const sel = this.state.sel || 0; ctx.font = '500 11px ' + ZMONO; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        s.LM.forEach((pp, i) => { const v = rot(pp); if (v[2] <= 0.05) return; const bx = cx + v[0] * R, by = cy - v[1] * R, k = 1.13 + (i === sel ? 0.05 : 0), tx = cx + v[0] * R * k, ty = cy - v[1] * R * k;
          if (s.m.in) { const d = Math.hypot(s.m.x - tx, s.m.y - ty); if (d < bd) { bd = d; s.hov = i; } }
          const on = i === sel, hv = i === s.hov; ctx.globalAlpha = Math.min(1, v[2] * 1.6); ctx.strokeStyle = '#FAFAFA'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
          ctx.fillStyle = on ? '#FAFAFA' : '#0A0A0A'; ctx.fillRect(tx - 5, ty - 5, 10, 10); ctx.strokeRect(tx - 5.5, ty - 5.5, 11, 11);
          if (on) { const pr = (t * 0.8) % 1; ctx.globalAlpha = 1 - pr; ctx.beginPath(); ctx.arc(tx, ty, 8 + pr * 26, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = Math.min(1, v[2] * 1.6); }
          ctx.fillStyle = '#FAFAFA'; if (v[2] > 0.3 || on || hv) ctx.fillText(String(i + 1).padStart(2, '0') + ' ' + this.PL[i][0].toUpperCase(), tx + 12, ty); });
        ctx.globalAlpha = 1; s.cv.style.cursor = s.m.down ? 'grabbing' : s.hov >= 0 ? 'pointer' : 'grab'; };
      const fluid = (s, t) => { const { ctx, W, H } = s, NX = 96, NY = 54, cw = W / NX, chh = H / NY, IX = (i, j) => i + (NX + 2) * j;
        if (!s.u) { const n = (NX + 2) * (NY + 2); ['u', 'v', 'd', 'u0', 'v0', 'd0', 'pp', 'dv'].forEach(k => s[k] = new Float32Array(n)); s.lm = { x: s.m.x, y: s.m.y }; s.sd = Math.random() * 100; s.mk = [];
          for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const mx = ((i - 0.5) * cw - W / 2) / 1.15 + 208, my = ((j - 0.5) * chh - H / 2) / 1.15 + 173; if (a_mark(mx, my) < 0) s.mk.push(IX(i, j)); } }
        const { u, v, d, u0, v0, d0, pp, dv } = s;
        if (s.m.in) { const mx = s.m.x / cw, my = s.m.y / chh, dx = s.m.x - s.lm.x, dy = s.m.y - s.lm.y, sp = Math.hypot(dx, dy); for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) { const a = Math.floor(mx) + i, b = Math.floor(my) + j; if (a < 1 || b < 1 || a > NX || b > NY) continue; const w = Math.max(0, 1 - Math.hypot(i, j) / 4.5); u[IX(a, b)] += dx * 0.05 * w; v[IX(a, b)] += dy * 0.05 * w; d[IX(a, b)] += Math.min(1.5, sp * 0.03) * w; } }
        s.lm.x = s.m.x; s.lm.y = s.m.y;
        for (const k of s.mk) { d[k] = Math.max(d[k], 0.55 + 0.25 * Math.sin(t * 1.5 + k * 0.01)); }
        for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const k = IX(i, j); u[k] += Math.sin(t * 0.4 + j * 0.15 + s.sd) * 0.004; v[k] += Math.cos(t * 0.35 + i * 0.12 + s.sd) * 0.004; }
        const adv = (dst, src, dt) => { for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const k = IX(i, j); let x = i - dt * u[k], y = j - dt * v[k]; x = Math.min(NX + 0.5, Math.max(0.5, x)); y = Math.min(NY + 0.5, Math.max(0.5, y)); const i0 = Math.floor(x), j0 = Math.floor(y), s1 = x - i0, t1 = y - j0; dst[k] = (1 - s1) * ((1 - t1) * src[IX(i0, j0)] + t1 * src[IX(i0, j0 + 1)]) + s1 * ((1 - t1) * src[IX(i0 + 1, j0)] + t1 * src[IX(i0 + 1, j0 + 1)]); } };
        u0.set(u); v0.set(v); adv(u, u0, 1); adv(v, v0, 1);
        for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const k = IX(i, j); dv[k] = -0.5 * (u[k + 1] - u[k - 1] + v[k + NX + 2] - v[k - NX - 2]); pp[k] = 0; }
        for (let it = 0; it < 14; it++) for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const k = IX(i, j); pp[k] = (dv[k] + pp[k - 1] + pp[k + 1] + pp[k - NX - 2] + pp[k + NX + 2]) / 4; }
        for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const k = IX(i, j); u[k] = (u[k] - 0.5 * (pp[k + 1] - pp[k - 1])) * 0.995; v[k] = (v[k] - 0.5 * (pp[k + NX + 2] - pp[k - NX - 2])) * 0.995; }
        d0.set(d); adv(d, d0, 1); for (let q = 0; q < d.length; q++) d[q] *= 0.984;
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.font = '500 12px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FAFAFA'; const RAMP = ' .:-=+*#%@', DIR = '-\\|/';
        for (let j = 1; j <= NY; j++) for (let i = 1; i <= NX; i++) { const k = IX(i, j), dd = d[k], x = (i - 0.5) * cw, y = (j - 0.5) * chh;
          if (dd > 0.05) { ctx.globalAlpha = Math.min(1, 0.35 + dd); ctx.fillText(RAMP[Math.min(9, 1 + Math.floor(Math.min(1, dd) * 8.99))], x, y); }
          else { const vv = Math.hypot(u[k], v[k]); if (vv > 0.08) { const an = (Math.atan2(v[k], u[k]) + Math.PI) / Math.PI * 4; ctx.globalAlpha = Math.min(0.5, vv); ctx.fillText(DIR[Math.round(an) % 4], x, y); } } }
        ctx.globalAlpha = 1; };
      const physics = (s, t) => { const { ctx, W, H } = s, ph = s.cv.dataset.mode === 'phone', BX0 = ph ? 830 : 0, BY0 = ph ? 110 : 0, BX1 = ph ? 1130 : W, BY1 = ph ? 690 : H, S = ph ? 0.42 : 1.15, hx = (BX0 + BX1) / 2 - 208 * S, hy = ph ? 250 - 173 * S : H / 2 - 173 * S + 20;
        if (!s.B) { s.B = AB.map((c, i) => ({ x: hx + c[0] * S, y: hy + c[1] * S, px: hx + c[0] * S, py: hy + c[1] * S, r: c[2] * S * 0.98, hx: hx + c[0] * S, hy: hy + c[1] * S, n: this.PL[i][0].toUpperCase() })); if (ph) s.B.forEach((b, i) => { b.x = b.px = BX0 + 40 + a_hs(i, 7) * (BX1 - BX0 - 80); b.y = b.py = BY0 - 120 - i * 70; }); s.idle = 0; s.grab = -1;
          s.onDown = () => { let best = -1, bd = 1e9; s.B.forEach((b, i) => { const d = Math.hypot(b.x - s.m.x, b.y - s.m.y) - b.r; if (d < 10 && d < bd) { bd = d; best = i; } }); s.grab = best; s.idle = 0; if (best < 0) s.B.forEach(b => { const dx = b.x - s.m.x, dy = b.y - s.m.y, d = Math.hypot(dx, dy) + 1; b.px -= dx / d * 18; b.py -= dy / d * 18; }); };
          s.onUp = () => { s.grab = -1; s.idle = 0; }; }
        s.idle += 1 / 60; if (ph && s.idle > 12) { s.idle = 0; s.B.forEach((b, i) => { b.py = b.y + 6 + a_hs(i, Math.floor(t)) * 8; b.px = b.x + (a_hs(i + 3, Math.floor(t)) - 0.5) * 16; }); } const loose = s.idle < 3.5, G = loose ? 0.45 : 0;
        for (const b of s.B) { const vx = (b.x - b.px) * 0.985, vy = (b.y - b.py) * 0.985; b.px = b.x; b.py = b.y; b.x += vx; b.y += vy + G; if (!loose) { b.x += (b.hx - b.x) * 0.06; b.y += (b.hy - b.y) * 0.06; } }
        if (s.grab >= 0 && s.m.in) { const b = s.B[s.grab]; b.x += (s.m.x - b.x) * 0.5; b.y += (s.m.y - b.y) * 0.5; }
        for (let it = 0; it < 4; it++) { for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const a = s.B[i], c = s.B[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1, m = a.r + c.r; if (d < m) { const o = (m - d) / 2 * (loose ? 1 : 0.3), ox = dx / d * o, oy = dy / d * o; a.x -= ox; a.y -= oy; c.x += ox; c.y += oy; } }
          for (const b of s.B) { if (b.x < BX0 + b.r) b.x = BX0 + b.r; if (b.x > BX1 - b.r) b.x = BX1 - b.r; if (!ph && b.y < b.r) b.y = b.r; if (b.y > BY1 - b.r) { b.y = BY1 - b.r; b.py = b.y + (b.y - b.py) * 0.4; } } }
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);
        if (ph) { const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
          ctx.strokeStyle = 'rgba(250,250,250,0.5)'; ctx.lineWidth = 1; rr(BX0 - 16, BY0 - 30, BX1 - BX0 + 32, BY1 - BY0 + 60, 46); ctx.stroke(); ctx.fillStyle = '#FAFAFA'; ctx.fillRect((BX0 + BX1) / 2 - 40, BY0 - 18, 80, 18);
          ctx.strokeStyle = 'rgba(250,250,250,0.16)'; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = BX0 + 22 + c * 68, y = BY0 + 270 + r * 74; rr(x, y, 52, 52, 13); ctx.stroke(); }
          const asm = s.idle >= 3.5 ? Math.min(1, (s.idle - 3.5) / 1.2) : 0; if (asm > 0) { ctx.globalAlpha = asm; ctx.strokeStyle = '#FAFAFA'; rr((BX0 + BX1) / 2 - 72, 250 - 72, 144, 144, 34); ctx.stroke(); ctx.font = '500 13px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#FAFAFA'; ctx.fillText('ManaWG', (BX0 + BX1) / 2, 250 + 96); ctx.globalAlpha = 1; } }
        ctx.fillStyle = '#FAFAFA'; const lx = s.m.in ? s.m.x : W * 0.3, ly = s.m.in ? s.m.y : H * 0.2, st = ph ? 4 : 6;
        for (const b of s.B) { const x0 = Math.floor((b.x - b.r) / st) * st, y0 = Math.floor((b.y - b.r) / st) * st; for (let y = y0; y < b.y + b.r; y += st) for (let x = x0; x < b.x + b.r; x += st) { const nx = (x - b.x) / b.r, ny = (y - b.y) / b.r, q = nx * nx + ny * ny; if (q > 1) continue; const nz = Math.sqrt(1 - q), Lx = lx - b.x, Ly = ly - b.y, LL = Math.hypot(Lx, Ly, 200), lam = Math.max(0, (nx * Lx + ny * Ly + nz * 200) / LL), v = 0.08 + 0.92 * lam * lam, r = st * 0.5 * Math.sqrt(v); ctx.fillRect(x - r, y - r, r * 2, r * 2); } }
        ctx.font = '500 11px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (loose && !ph) s.B.forEach(b => { ctx.fillStyle = '#0A0A0A'; const w = ctx.measureText(b.n).width + 10; ctx.fillRect(b.x - w / 2, b.y - 9, w, 18); ctx.fillStyle = '#FAFAFA'; ctx.fillText(b.n, b.x, b.y); });
        s.cv.style.cursor = s.grab >= 0 ? 'grabbing' : 'grab'; };
      const score = (s, t) => { const { ctx, W, H } = s, C = 32, R = 16, cs = 34, gx = (W - C * cs) / 2, gy = (H - R * cs) / 2 + 20;
        if (!s.g) { s.g = new Uint8Array(C * R); for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) { const mx = (i + 0.5) / C * 470 - 25, my = (j + 0.5) / R * 380 - 15; if (a_mark(mx, my) < 0) s.g[j * C + i] = 1; } s.col = -1; s.t0 = t; s.fl = new Float32Array(C * R); s.on = false; s.paint = -1;
          const host = s.cv.parentElement; host.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-snd]'); if (!b) return; s.on = !s.on; b.textContent = s.on ? 'TON AUS' : 'TON AN';
            if (s.on && !s.ac) { const AC = window.AudioContext || window.webkitAudioContext; s.ac = new AC(); s.mg = s.ac.createGain(); s.mg.gain.value = 0.16; const dl = s.ac.createDelay(); dl.delayTime.value = 0.28; const fb = s.ac.createGain(); fb.gain.value = 0.32; s.mg.connect(s.ac.destination); s.mg.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(s.ac.destination); } if (s.ac && s.ac.state === 'suspended') s.ac.resume(); });
          const cell = () => { const i = Math.floor((s.m.x - gx) / cs), j = Math.floor((s.m.y - gy) / cs); return i >= 0 && j >= 0 && i < C && j < R ? j * C + i : -1; };
          s.onDown = () => { const k = cell(); if (k < 0) return; s.paint = s.g[k] ? 0 : 1; s.g[k] = s.paint; }; s.onMove = () => { if (s.m.down && s.paint >= 0) { const k = cell(); if (k >= 0) s.g[k] = s.paint; } }; s.onUp = () => { s.paint = -1; }; }
        const SC = [0, 3, 5, 7, 10], step = Math.floor((t - s.t0) * 7) % C;
        if (step !== s.col) { s.col = step; for (let j = 0; j < R; j++) if (s.g[j * C + step]) { s.fl[j * C + step] = 1; if (s.on && s.ac) { const n = R - 1 - j, semi = SC[n % 5] + 12 * Math.floor(n / 5), fr = 110 * Math.pow(2, semi / 12), o = s.ac.createOscillator(), gn = s.ac.createGain(), now = s.ac.currentTime; o.type = 'triangle'; o.frequency.value = fr; gn.gain.setValueAtTime(0, now); gn.gain.linearRampToValueAtTime(0.5, now + 0.006); gn.gain.exponentialRampToValueAtTime(0.001, now + 0.5); o.connect(gn); gn.connect(s.mg); o.start(now); o.stop(now + 0.55); } } }
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) { const k = j * C + i, x = gx + i * cs + cs / 2, y = gy + j * cs + cs / 2, fl = s.fl[k]; s.fl[k] *= 0.9;
          if (i === step) { ctx.fillStyle = 'rgba(250,250,250,0.08)'; ctx.fillRect(gx + i * cs, gy + j * cs, cs, cs); }
          if (s.g[k]) { ctx.fillStyle = '#FAFAFA'; ctx.globalAlpha = 0.55 + 0.45 * fl; ctx.font = '500 ' + Math.round(18 + fl * 14) + 'px "JetBrains Mono", monospace'; ctx.fillText(fl > 0.5 ? '@' : '#', x, y); if (fl > 0.05) { ctx.globalAlpha = fl * 0.5; ctx.strokeStyle = '#FAFAFA'; ctx.beginPath(); ctx.arc(x, y, 10 + (1 - fl) * 40, 0, 6.2832); ctx.stroke(); } }
          else { ctx.globalAlpha = 0.22; ctx.fillStyle = '#FAFAFA'; ctx.font = '500 14px "JetBrains Mono", monospace'; ctx.fillText('·', x, y); } }
        ctx.globalAlpha = 1; ctx.font = '500 11px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(250,250,250,0.72)'; ctx.textAlign = 'left'; ctx.fillText('TAKT ' + String(step + 1).padStart(2, '0') + ' / 32', gx, gy + R * cs + 22);
        s.cv.style.cursor = 'crosshair'; };
      const ticker = (s, t) => { const { ctx, W, H } = s; if (!s.txt) s.txt = '  MIKA HAT 28,40 € FÜR DEN PIZZAABEND BEZAHLT  ·  LEA PUTZT HEUTE DAS BAD  ·  HAFERMILCH STEHT AUF DER LISTE  ·  INTERNET 29,99 € AM 3. FÄLLIG  ·  JONA BEKOMMT 12,50 €  ·  ÜBERGABE AM FREITAG  ·  „BIN UM ACHT WIEDER DA.“  ·  SAMI HAT EINKAUF ERGÄNZT  ·';
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = 'rgba(10,10,10,0.55)'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(250,250,250,0.3)'; ctx.beginPath(); ctx.moveTo(0, 0.5); ctx.lineTo(W, 0.5); ctx.moveTo(0, H - 0.5); ctx.lineTo(W, H - 0.5); ctx.stroke();
        ctx.font = '500 13px "JetBrains Mono", monospace'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FAFAFA'; const w = ctx.measureText(s.txt).width, sp = s.m.in ? 20 : 60, x = -((t * sp) % w); for (let k = 0; k < 3; k++) ctx.fillText(s.txt, x + k * w, H / 2 + 1);
        ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, 92, H); ctx.fillStyle = '#FAFAFA'; ctx.fillRect(16, H / 2 - 4, 8, 8); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4); ctx.fillText('LIVE', 34, H / 2 + 1); ctx.globalAlpha = 1; };
      const stars = (s, t) => { const { ctx, W, H } = s, S = 0.62, ox = 1180 - 420 * S, oy = 70;
        if (!s.st) { s.st = AB.map((c, i) => ({ x: ox + c[0] * S, y: oy + c[1] * S, r: 2 + c[2] / 22, n: this.PL[i][0].toUpperCase(), l: this.PL[i][1] })); s.ed = [[0, 1], [0, 4], [0, 6], [0, 2], [0, 3], [4, 5], [5, 6], [1, 7], [7, 2], [2, 3], [3, 6]]; s.bg = []; for (let q = 0; q < 220; q++) s.bg.push([a_hs(q, 21) * W, a_hs(q, 22) * H * 0.45, a_hs(q, 23)]); s.st = []; s.ed = []; }
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#FAFAFA'; for (const b of s.bg) { ctx.globalAlpha = 0.2 + 0.4 * b[2] * (0.6 + 0.4 * Math.sin(t * 1.7 + b[0])); ctx.fillRect(b[0], b[1], 1.2, 1.2); }
        let hov = -1, bd = 28; if (s.m.in) s.st.forEach((p, i) => { const d = Math.hypot(s.m.x - p.x, s.m.y - p.y); if (d < bd) { bd = d; hov = i; } });
        const draw = Math.min(1, t / 2.5); ctx.strokeStyle = '#FAFAFA'; ctx.lineWidth = 1; s.ed.forEach((e, k) => { const A = s.st[e[0]], B = s.st[e[1]], fr = a_cl(draw * s.ed.length - k); if (fr <= 0) return; ctx.globalAlpha = (hov === e[0] || hov === e[1]) ? 0.7 : 0.22; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(A.x + (B.x - A.x) * fr, A.y + (B.y - A.y) * fr); ctx.stroke(); }); ctx.setLineDash([]);
        ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.textBaseline = 'middle';
        s.st.forEach((p, i) => { const on = i === hov, tw = 0.75 + 0.25 * Math.sin(t * 2 + i); ctx.globalAlpha = 1; const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (on ? 9 : 6)); g.addColorStop(0, 'rgba(250,250,250,' + (0.28 * tw) + ')'); g.addColorStop(1, 'rgba(250,250,250,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (on ? 9 : 6), 0, 6.2832); ctx.fill();
          ctx.fillStyle = '#FAFAFA'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (on ? 1.6 : 1), 0, 6.2832); ctx.fill();
          if (on) { ctx.font = '500 13px Inter, sans-serif'; const tw2 = Math.max(ctx.measureText(p.l).width, 80) + 24, bx = p.x + tw2 + 30 > W ? p.x - tw2 - 18 : p.x + 18, by = p.y - 26; ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(10,10,10,0.82)'; ctx.fillRect(bx, by, tw2, 52); ctx.strokeStyle = 'rgba(250,250,250,0.35)'; ctx.strokeRect(bx + 0.5, by + 0.5, tw2 - 1, 51); ctx.fillStyle = '#FAFAFA'; ctx.textAlign = 'left'; ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.fillText(p.n, bx + 12, by + 16); ctx.font = '500 13px Inter, sans-serif'; ctx.fillText(p.l, bx + 12, by + 35); ctx.font = '500 10px "JetBrains Mono", monospace'; } });
        ctx.globalAlpha = 1; s.cv.style.cursor = hov >= 0 ? 'pointer' : 'default'; };
      const snow = (s, t) => { const { ctx, W, H } = s, CH = '*+.·:*';
        if (!s.fl) { s.fl = []; for (let q = 0; q < 700; q++) { const z = a_hs(q, 31); s.fl.push({ x: a_hs(q, 32) * W, y: a_hs(q, 33) * H, z, c: CH[Math.floor(a_hs(q, 34) * 6)], ph: a_hs(q, 35) * 6.28 }); } s.wind = 0; }
        const tw = s.m.in ? (s.m.x - W / 2) / W * 6 : Math.sin(t * 0.2) * 0.8; s.wind += (tw - s.wind) * 0.03;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#FAFAFA'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const p of s.fl) { const sp = 0.4 + p.z * 1.8; p.y += sp; p.x += s.wind * sp + Math.sin(t * 1.3 + p.ph) * 0.3; if (s.m.in) { const dx = p.x - s.m.x, dy = p.y - s.m.y, d = Math.hypot(dx, dy); if (d < 90) { p.x += dx / (d + 1) * (90 - d) * 0.05; p.y += dy / (d + 1) * (90 - d) * 0.05; } }
          if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; } if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
          ctx.globalAlpha = 0.25 + p.z * 0.75; ctx.font = '500 ' + Math.round(7 + p.z * 15) + 'px "JetBrains Mono", monospace'; ctx.fillText(p.c, p.x, p.y); }
        ctx.globalAlpha = 1; };
      const DR = { ptext, tone, topo, ascii, mosaic, mesh, depth, press, planet, fluid, physics, score, ticker, stars, snow };
      const artLoop = () => { this.raf2 = requestAnimationFrame(artLoop); this.fa = (this.fa || 0) + 1; if (this.fa % 2) return; if (!ART.list.length || this.fa % 120 === 0 || (this.fa % 15 === 0 && ART.list.some(s => !s.cv.isConnected))) scan(); if (document.hidden) return; const t = performance.now() / 1000 - ART.t0;
        const LL = ART.list.length, st0 = (this.fa * 3) % Math.max(1, LL); let bud = 4; for (let ii = 0; ii < LL && bud > 0; ii++) { const s = ART.list[(st0 + ii) % LL]; const r = s.cv.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue; if (s.sc) { const q = s.sc.getBoundingClientRect(); if (r.bottom < q.top || r.top > q.bottom) continue; }
          try { DR[s.type](s, t); bud--; } catch (e) { if (!s.err) { s.err = 1; console.error(e); } } } };
      artLoop();
} // PORT
