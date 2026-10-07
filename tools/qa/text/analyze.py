#!/usr/bin/env python3
"""Messkette Text, Teil 2: Glyphenkontrast je Textknoten und Marke aus den Bildern von capture.mjs.

A (normal) gegen B (Text transparent) an den Glyphenkernen aus C (Canvas unsichtbar).
Je Knoten: Anteil der Glyphenpixel mit Kontrast >= 4,5:1 (>= 3:1 ab 24 px Schrift).
Bei Schrift unter 14 px druckt die Kantenglättung den gemessenen Wert, dort gilt die Schwelle x 0,75.

  python3 tools/qa/text/analyze.py <out>/<vp> [--sec intro,so-gehts] [--min-vis 0.5]
"""
import glob
import json
import os
import sys

import numpy as np
from PIL import Image

D = sys.argv[1]
opt = {}
for i, a in enumerate(sys.argv[2:], 2):
    if a.startswith('--') and i + 1 < len(sys.argv):
        opt[a[2:]] = sys.argv[i + 1]
SECS = set(opt['sec'].split(',')) if 'sec' in opt else None


def lum(a):
    c = a / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def load(p):
    return np.asarray(Image.open(p).convert('RGB'), dtype=np.float64)


def ratio(a, b):
    return (np.maximum(a, b) + 0.05) / (np.minimum(a, b) + 0.05)


rows = []
for f in sorted(glob.glob(f'{D}/[0-9][0-9]-*.json')):
    meta = json.load(open(f))
    base = f[:-5]
    S = meta['dpr']
    A, B, C = (load(f'{base}_{k}.png') for k in 'ABC')
    LA, LB, LC = lum(A), lum(B), lum(C)
    Hh, Ww = LA.shape
    for e in meta['els']:
        if SECS and e['sec'] not in SECS:
            continue
        if e['vis'] < 0.5 or e['op'] < 0.02:
            continue
        x0, y0, x1, y1 = e['r']
        x0 = max(0, int(np.floor(x0 * S)) - 1)
        y0 = max(0, int(np.floor(y0 * S)) - 1)
        x1 = min(Ww, int(np.ceil(x1 * S)) + 1)
        y1 = min(Hh, int(np.ceil(y1 * S)) + 1)
        if x1 - x0 < 2 or y1 - y0 < 2:
            continue
        rA, rB, rC = LA[y0:y1, x0:x1], LB[y0:y1, x0:x1], LC[y0:y1, x0:x1]
        light = e['lum'] > 0.35
        if light:
            bg = np.median(rC)
            hi = np.percentile(rC, 99.7)
            mask = rC > bg + 0.5 * (hi - bg) if hi - bg >= 0.01 else np.zeros_like(rC, dtype=bool)
        else:
            d = np.abs(rA - rB)
            mx = d.max()
            mask = d > 0.4 * mx if mx > 0.02 else np.zeros_like(d, dtype=bool)
        n = int(mask.sum())
        if n < 4:
            continue
        r = ratio(rA[mask], rB[mask])
        thr = 3.0 if e['fs'] >= 24 else 4.5
        if e['fs'] < 14:
            thr *= 0.75
        rows.append(
            {
                'mark': meta['mark'],
                'P': meta['P'],
                'sec': e['sec'],
                'txt': e['txt'],
                'fs': e['fs'],
                'op': round(e['op'], 3),
                'n': n,
                'ok': float(np.mean(r >= thr)),
                'p10': float(np.percentile(r, 10)),
                'med': float(np.median(r)),
                'thr': thr,
                'lt3': float(np.mean(r < 3.0)),
            }
        )

json.dump(rows, open(f'{D}/metrics.json', 'w'))
print(f'{"mark":<18} {"sec":<7} {"fs":>5} {"op":>5} {"ok%":>6} {"p10":>6} {"med":>6} {"<3%":>5}  text')
for r in rows:
    print(
        f'{r["mark"]:<18} {r["sec"][:7]:<7} {r["fs"]:5.1f} {r["op"]:5.2f} {100 * r["ok"]:6.1f} {r["p10"]:6.1f} {r["med"]:6.1f} {100 * r["lt3"]:5.1f}  {r["txt"][:40]}'
    )
print(f'{len(rows)} Messungen')
