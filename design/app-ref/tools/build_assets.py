#!/usr/bin/env python3
"""Baut die Bild- und HTML-Teile von design/app-ref aus den Aufnahmen.
Eingabe:  shots/final/*.png, data/final/*.json + *.doc.json (von capture.mjs)
Ausgabe:  <OUT>/img/*.webp, <OUT>/screens/*.html, <OUT>/app.css, <OUT>/fonts/*, <OUT>/states.json, <OUT>/index.html
Aufruf:   python3 build_assets.py [OUT]   (App/Proxy müssen noch laufen: CSS und Schriften werden von dort geholt)"""
import glob, hashlib, json, os, re, shutil, subprocess, sys, urllib.request

SCR = os.environ.get('SCR', os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else '/Users/abu/Company/manawg-landing/design/app-ref'
APP = os.environ.get('APP', 'http://127.0.0.1:4241')  # Proxy mit der laufenden App (liefert app.css und Schriften)
FONT_SRC = os.environ.get('FONT_SRC') or next(p for p in (f'{SCR}/src3/apps/web/src/shared/fonts', f'{SCR}/src/apps/web/src/shared/fonts') if os.path.isdir(p))
SHOTS, DATA = f'{SCR}/shots/final', f'{SCR}/data/final'

# Zustände mit Standalone-HTML (Rest: nur Bild + Texte in states.json). Dunkel = gleiche HTML-Datei mit <html class="dark">.
HTML_STATES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '16', '18', '21', '23', '24', '27',
               '30', '31', '32', '35', '37', '55']
# Bildstufen: A = 2x (780 px), B = 1,5x (585 px), C = 1x (390 px)
IMG_A = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '15', '16', '18', '21', '23', '24', '26', '27', '28',
         '30', '31', '32', '35', '37', '55', '56', '57', '64']
IMG_C = ['42', '43'] + [str(i) for i in range(44, 54)]

for d in ('img', 'screens', 'fonts'):
    os.makedirs(f'{OUT}/{d}', exist_ok=True)

num = lambda n: n.split('-')[0]
names = sorted(os.path.basename(f)[:-5] for f in glob.glob(f'{DATA}/*.json') if not f.endswith('.doc.json') and not f.endswith('_errors.json'))

# ---------- Bilder ----------
def webp(src, dst, width, q):
    subprocess.run(['cwebp', '-quiet', '-q', str(q), '-m', '6', '-sharp_yuv', '-resize', str(width), '0', src, '-o', dst], check=True)
img_bytes = 0
for n in names:
    w, q = (780, 72) if num(n) in IMG_A else (390, 68) if num(n) in IMG_C else (585, 70)
    webp(f'{SHOTS}/{n}.png', f'{OUT}/img/{n}.webp', w, q)
    img_bytes += os.path.getsize(f'{OUT}/img/{n}.webp')

# ---------- CSS + Schriften ----------
docs = {}
css_urls = []
for n in names:
    p = f'{DATA}/{n}.doc.json'
    if not os.path.exists(p):
        continue
    d = json.load(open(p, encoding='utf8'))
    docs[n] = d
    for u in d['css']:
        if u not in css_urls:
            css_urls.append(u)
font_names = {}
for p in glob.glob(f'{FONT_SRC}/*.woff2'):
    font_names[hashlib.sha1(open(p, 'rb').read()).hexdigest()] = os.path.basename(p)
css = ['/* ManaWG-App: echtes kompiliertes CSS (Next 15, Tailwind v4), unverändert aus dem Build. Schriften liegen in ./fonts */']
for u in css_urls:
    text = urllib.request.urlopen(u).read().decode('utf8')
    for m in set(re.findall(r'url\((/_next/static/media/[^)]+\.woff2)\)', text)):
        data = urllib.request.urlopen(APP + m).read()
        fname = font_names.get(hashlib.sha1(data).hexdigest(), os.path.basename(m))
        open(f'{OUT}/fonts/{fname}', 'wb').write(data)
        text = text.replace(f'url({m})', f'url(fonts/{fname})')
    css.append(f'/* {os.path.basename(u)} */\n{text}')
open(f'{OUT}/app.css', 'w', encoding='utf8').write('\n'.join(css))
for lic in glob.glob(f'{FONT_SRC}/*-OFL.txt'):
    shutil.copy(lic, f'{OUT}/fonts/')

# ---------- Standalone-HTML ----------
HEAD = '''<!doctype html>
<html lang="{lang}" class="{cls}"{style}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="theme-color" content="#0a0a0a">
<title>{title}</title>
<link rel="stylesheet" href="../app.css">
</head>
<body{bcls}{bstyle}>
'''
esc = lambda s: s.replace('&', '&amp;').replace('"', '&quot;')
html_bytes = 0
for n, d in docs.items():
    if num(n) not in HTML_STATES:
        continue
    h = HEAD.format(lang=d['lang'] or 'de', cls=esc(d['htmlClass']), title=f'ManaWG – {n}',
                    style=f' style="{esc(d["htmlStyle"])}"' if d['htmlStyle'] else '',
                    bcls=f' class="{esc(d["bodyClass"])}"' if d['bodyClass'] else '',
                    bstyle=f' style="{esc(d["bodyStyle"])}"' if d['bodyStyle'] else '')
    body = re.sub(r'<meta\b[^>]*>|<title>.*?</title>', '', d['html'], flags=re.S)  # von Next in den Body gestreute Kopfdaten (og:image mit localhost)
    h += body + '\n</body>\n</html>\n'
    open(f'{OUT}/screens/{n}.html', 'w', encoding='utf8').write(h)
    html_bytes += len(h.encode('utf8'))

# ---------- Galerie ----------
cells = []
for n in names:
    if os.path.exists(f'{OUT}/screens/{n}.html'):
        cells.append(f'<figure><figcaption>{n}</figcaption><iframe src="screens/{n}.html" loading="lazy"></iframe></figure>')
    else:
        cells.append(f'<figure><figcaption>{n} (Bild)</figcaption><img src="img/{n}.webp" loading="lazy" width="390"></figure>')
open(f'{OUT}/index.html', 'w', encoding='utf8').write('''<!doctype html><html lang="de"><meta charset="utf-8"><title>ManaWG app-ref</title>
<style>body{margin:0;padding:24px;background:#e5e5e5;font:12px/1.4 ui-monospace,monospace;display:flex;flex-wrap:wrap;gap:20px}figure{margin:0}iframe,img{width:390px;height:844px;border:0;background:#fff;border-radius:24px;display:block;object-fit:cover;object-position:top}figcaption{margin-bottom:6px}</style>
''' + ''.join(cells) + '</html>')

print(f'{len(names)} Zustände | Bilder {img_bytes // 1024} kB | HTML {len([n for n in docs if num(n) in HTML_STATES])} Dateien {html_bytes // 1024} kB | app.css {os.path.getsize(f"{OUT}/app.css") // 1024} kB')
