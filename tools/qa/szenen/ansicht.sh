#!/bin/zsh
# S-4: Kontaktbögen der drei Szenen in allen Viewports (Marken koerper, funktionen, bereiche).
#   tools/qa/szenen/ansicht.sh <url> <out> [viewports...]
URL=${1:-http://localhost:3125/}
OUT=$2
shift 2
VPS=${@:-390x844@3t 360x740@3t 768x1024@2t 844x390@3t 1920x1080@1 1440x900@2 2560x1440@1}
MARKS=koerper:-0.2,koerper:0,koerper:0.3,koerper:0.6,funktionen:0.05,funktionen:0.25,funktionen:0.45,funktionen:0.65,funktionen:0.85,funktionen:1,bereiche:-0.2,bereiche:0,bereiche:0.3,bereiche:0.6
cd "$(dirname "$0")/../../.."
for V in ${=VPS}; do
	node tools/qa/sheet.mjs --url "$URL" --vp "$V" --marks "$MARKS" --out "$OUT" --je 14 --cols 7 --w 280
done
