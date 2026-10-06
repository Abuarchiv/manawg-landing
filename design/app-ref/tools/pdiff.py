#!/usr/bin/env python3
"""Pixelvergleich zweier Aufnahmeordner: python3 pdiff.py A B [schwelle]"""
import sys, os, glob
from PIL import Image, ImageChops
import numpy as np
A, B = sys.argv[1], sys.argv[2]
thr = int(sys.argv[3]) if len(sys.argv) > 3 else 24
rows = []
for fa in sorted(glob.glob(f'{A}/*.png')):
    n = os.path.basename(fa); fb = f'{B}/{n}'
    if not os.path.exists(fb):
        rows.append((n, 'fehlt in B', '', '')); continue
    ia, ib = Image.open(fa).convert('RGB'), Image.open(fb).convert('RGB')
    if ia.size != ib.size:
        rows.append((n, f'Größe {ia.size} vs {ib.size}', '', '')); continue
    d = np.asarray(ImageChops.difference(ia, ib)).max(axis=2)
    m = d > thr
    pct = 100 * m.mean()
    bbox = ''
    if m.any():
        ys, xs = np.where(m); bbox = f'x{xs.min()}-{xs.max()} y{ys.min()}-{ys.max()}'
    rows.append((n, f'{pct:.3f}%', bbox, ''))
for r in rows: print(*r)
