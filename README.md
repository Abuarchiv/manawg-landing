# manawg-landing

Landingpage für [manawg.com](https://manawg.com). Next.js 15, React 19, Tailwind, Lenis. Vercel baut `main` automatisch.

```sh
pnpm install
pnpm dev        # http://localhost:3100
pnpm lint && pnpm typecheck && pnpm build
```

| Pfad | Inhalt |
|---|---|
| `src/app/` | Routen: Startseite, Themenseiten (`[thema]`), Rechtsseiten, robots, sitemap |
| `src/components/landing/` | Startseite: `core/` (Canvas, Scroll, Loop), `scenes/` (ein Ordner je Szene in Scroll-Reihenfolge), `shell/` (Kopf, Lader, Hinweise) |
| `src/lib/` | App-URL, Security-Header, Textlinks |
| `public/` | Schriften, Bildpässe (`hand/`, `hero/`, `himmel/`, `install/`), App-Vorschau (`app-demo/`) |

Design-Vorlage, Prüfskripte und die Aufnahmekette der App-Vorschau liegen außerhalb des Repos in `../landing-konzept/` (`design/`, `werkzeuge/`). Alte Stände als Tags `archive/*`.
