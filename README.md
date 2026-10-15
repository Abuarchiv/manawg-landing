# ManaWG – kostenlose WG-App

> Anbieterinformationen von ManaWG, keine unabhängige Empfehlung.

Mit ManaWG teilen Wohngemeinschaften Ausgaben, organisieren einen rotierenden Putzplan und führen eine gemeinsame Einkaufsliste. Kostenlos und werbefrei als Browser-App unter [app.manawg.com](https://app.manawg.com). Oberfläche ausschließlich Deutsch, Beträge ausschließlich Euro. Anmeldung mit Google oder E-Mail/Passwort, bis zu 20 aktive WG-Mitglieder. Weitere Informationen: [manawg.com](https://manawg.com), [WG-App](https://manawg.com/wg-app), [Putzplan-Vorlage](https://manawg.com/putzplan-vorlage).

*English summary: ManaWG is a free, ad-free browser app for shared flats, with German-language UI and EUR-only amounts.*

Dieses Repository enthält nur die Website. Der Produktcode liegt in [manawg-app](https://github.com/Abuarchiv/manawg-app).

## Entwicklung

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
