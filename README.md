# manawg-landing

Landingpage für [manawg.com](https://manawg.com). Next.js 15, React 19, Tailwind, Lenis. Deploy: Vercel baut `main` automatisch.

```sh
pnpm install
pnpm dev        # http://localhost:3100
pnpm lint && pnpm typecheck && pnpm build
```

## Struktur

| Pfad | Inhalt |
|---|---|
| `src/app/` | Routen: Startseite, Themenseiten (`[thema]`), Rechtsseiten, robots, sitemap |
| `src/components/landing/` | Die Startseite: `core/` (Canvas, Scroll, Loop), `scenes/` (ein Ordner je Szene in Scroll-Reihenfolge), `shell/` (Kopf, Lader, Hinweise) |
| `src/lib/` | App-URL, Security-Header, Textlinks |
| `public/` | Schriften, Bildpässe (`hand/`, `hero/`, `himmel/`, `install/`), App-Vorschau (`app-demo/`) |
| `design/` | `final.dc.html` ist das gelieferte Design und wird 1:1 umgesetzt. `HAND.md` und `INSTALL-FLOWS.md` beschreiben Hand-Pässe und Installationsabläufe |
| `tools/app-demo/` | Kette, die `public/app-demo` aus der echten App aufnimmt (`demo-server` → `demo-crawl` → `demo-worlds` → `demo-typing` → `demo-pages` → `build-demo`) |
| `tools/qa/` | Playwright-Prüfskripte je Szene (`node tools/qa/<skript>.mjs --help`), Referenzbilder unter `install/ref/` |

Konzepte, Studien und verworfene Stände liegen außerhalb des Repos in `../landing-konzept/`. Alte Stände als Tags `archive/*`.
