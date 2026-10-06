#!/usr/bin/env python3
"""probes.json -> measurements.md (lesbare Messwerte je Komponente)"""
import json, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'data/probes.json'
out = sys.argv[2] if len(sys.argv) > 2 else 'data/measurements.md'
d = json.load(open(src))
L = []
def tok(title, t):
    L.append(f'### Farben {title}')
    L.append('| Token | Hex | OKLCH (roh) |'); L.append('|---|---|---|')
    for k, v in t['colors'].items(): L.append(f"| --{k} | {v['hex']} | {v['raw']} |")
    L.append('')
L.append('# Messwerte der echten ManaWG-App (390 × 844, DPR 3, Fixture-Modus)')
L.append('')
L.append('Alle Maße in CSS-Pixeln, gemessen per getComputedStyle/getBoundingClientRect auf dem laufenden Build. `@x,y` ist die Position im Viewport, `w×h` die Größe. Schrift: Familie Gewicht Größe/Zeilenhöhe.')
L.append('')
tok('hell', d['tokens']); tok('dunkel', d['tokensDark'])
t = d['tokens']
L.append('### Maße und Schriften'); L.append('```'); L.append(json.dumps(t['dims'], ensure_ascii=False)); L.append(json.dumps(t['radii'])); L.append(f"root {t['rootFontSize']} · body {t['bodyFontSize']}/{t['bodyLine']} · font-feature-settings {t['bodyFont']}"); L.append(json.dumps(t['fonts'])); L.append('```'); L.append('')
def line(n, o):
    if o is None: return f'- {n}: (nicht vorhanden)'
    if 'error' in o: return f'- {n}: Fehler {o["error"][:50]}'
    p = [f"{o['tag']}" + (f"[{o['slot']}]" if o.get('slot') else '')]
    r = o['rect']; p.append(f"@{r[0]:g},{r[1]:g} {r[2]:g}×{r[3]:g}")
    if o.get('position'): p.append(o['position'])
    if o['padding'] != '0 0 0 0': p.append('pad ' + o['padding'])
    if o.get('margin'): p.append('mar ' + o['margin'])
    if o.get('gap'): p.append('gap ' + o['gap'])
    if o.get('flex'): p.append(o['flex'])
    p.append('bg ' + str(o['bg'])); p.append('fg ' + str(o['color']))
    if o['border'] and not o['border'].startswith('0px'): p.append('bd ' + o['border'])
    if o['radius'] != '0px': p.append('r ' + o['radius'])
    if o.get('shadow'): p.append('shadow ' + o['shadow'])
    if o.get('opacity'): p.append('opacity ' + o['opacity'])
    p.append(o['font'])
    if o.get('numeric'): p.append('num ' + o['numeric'])
    if o.get('transform'): p.append(o['transform'])
    if o.get('deco'): p.append(o['deco'])
    if o.get('stroke'): p.append(f"stroke {o['stroke']}")
    if o.get('text'): p.append('„' + o['text'] + '“')
    return f'- {n}: ' + ' | '.join(p)
for scr, items in d['screens'].items():
    L.append(f'## {scr}')
    for n, o in items.items(): L.append(line(n, o))
    L.append('')
open(out, 'w', encoding='utf8').write('\n'.join(L))
print(len(L), 'Zeilen ->', out)
