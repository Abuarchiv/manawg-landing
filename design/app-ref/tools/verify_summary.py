#!/usr/bin/env python3
"""Vergleicht shots/verify (Standalone-HTML neu gerendert) mit shots/final (Live-Aufnahme) -> data/verify.json"""
import glob, json, os, sys
import numpy as np
from PIL import Image, ImageChops
SCR = os.environ.get('SCR', os.path.dirname(os.path.abspath(__file__)))
res = []
for fv in sorted(glob.glob(f'{SCR}/shots/verify/*.png')):
    n = os.path.basename(fv)
    ff = f'{SCR}/shots/final/{n}'
    if not os.path.exists(ff): continue
    a, b = Image.open(ff).convert('RGB'), Image.open(fv).convert('RGB')
    if a.size != b.size: res.append({'name': n[:-4], 'error': f'{a.size} vs {b.size}'}); continue
    d = np.asarray(ImageChops.difference(a, b)).max(axis=2)
    res.append({'name': n[:-4], 'pct24': round(100 * float((d > 24).mean()), 4), 'pct64': round(100 * float((d > 64).mean()), 4)})
json.dump(res, open(f'{SCR}/data/verify.json', 'w'), indent=1)
ok = [r for r in res if 'pct24' in r]
print(len(res), 'verglichen | max', max(r['pct24'] for r in ok), '% (Schwelle 24) | max', max(r['pct64'] for r in ok), '% (Schwelle 64)')
for r in res:
    if r.get('error') or r['pct24'] > 0.03: print('  auffällig:', r)
dk = [r for r in res if r['name'].split('-')[0] in ('40', '65', '66', '67', '68', '69', '70', '71', '72')]
print('dunkel:', [(r['name'][:2], r.get('pct24')) for r in dk])
