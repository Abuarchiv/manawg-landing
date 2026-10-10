# manawg-landing

Ins Repo gehört nur, was die Seite baut. Design-Vorlage (`design/final.dc.html`), Prüfskripte und Aufnahmekette liegen in `../landing-konzept/` (siehe dortige README).

- `final.dc.html` 1:1 umsetzen, nicht ausdünnen oder neu interpretieren.
- Nur `main`, lokal committen. Push und Deploy erst nach ausdrücklicher Freigabe (Vercel baut `main` automatisch).
- Vor „fertig“: `pnpm lint && pnpm typecheck && pnpm build`. Bei laufendem Dev-Server `NEXT_DIST_DIR=.next-xyz`, Ordner danach entfernen.
