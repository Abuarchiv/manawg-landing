# manawg-landing

Struktur und Befehle: `README.md`. Werkstatt (Blender, Studien, Verworfenes): `../landing-konzept/`.

- `design/final.dc.html` ist das gelieferte Design: 1:1 umsetzen, nicht ausdünnen oder neu interpretieren.
- Nur `main`, lokal committen. Push und Deploy erst nach ausdrücklicher Freigabe (Vercel baut `main` automatisch).
- Vor „fertig“: `pnpm lint && pnpm typecheck && pnpm build`. Build mit `NEXT_DIST_DIR=.next-xyz`, wenn parallel ein Dev-Server läuft, danach den Ordner entfernen.
- Ändert sich die App, `public/app-demo` mit der Kette in `tools/app-demo/` neu aufnehmen, nicht die alte Aufnahme nachbessern.
