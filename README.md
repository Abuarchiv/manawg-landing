# ManaWG website

The marketing site for [ManaWG](https://manawg.com), a free, ad-free flat-share app: split expenses, run a cleaning rota and keep a shared shopping list. The app itself lives in its own repository, [Abuarchiv/manawg](https://github.com/Abuarchiv/manawg). This repository contains only the website.

The site is available in German and English. ManaWG itself is available in both languages too, and amounts are in euros.

## Routes

| Language | Home | Topic pages | Guides | Legal pages |
|---|---|---|---|---|
| German | `/` | `/<slug>` | `/ratgeber` | `/impressum`, `/datenschutz`, `/agb` |
| English | `/en` | `/en/<slug>` | `/en/guides` | `/en/legal-notice`, `/en/privacy`, `/en/terms` |

- German lives at the site root and English under `/en`, each with its own slugs. The slug map is in `src/lib/locale.ts`.
- Every page that exists in both languages declares `hreflang` alternates and links to its counterpart.
- The English legal pages are convenience translations. The German versions are the legally binding ones.
- Machine-readable files: `/llms.txt` and `/en/llms.txt`, `/llms-full.txt` and `/en/llms-full.txt`, `/feed.xml` and `/en/feed.xml`, plus `sitemap.xml` and `robots.txt`.

## Stack

- [Next.js](https://nextjs.org) 15 (app router) and React 19, statically prerendered
- [Tailwind CSS](https://tailwindcss.com) 3
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling on the home page
- [Biome](https://biomejs.dev) for linting and formatting, TypeScript for type checking, `node --test` for unit tests

## Getting started

You need Node.js 22 or newer and pnpm 9 or newer.

```sh
pnpm install
pnpm dev          # http://localhost:3100
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server on port 3100 |
| `pnpm lint` | Biome check |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (`src/**/*.test.ts`) |

Before opening a pull request, run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. If a dev server is already running, build into a separate folder with `NEXT_DIST_DIR=.next-check pnpm build` and delete it afterwards.

`NEXT_PUBLIC_APP_URL` sets the public origin used for canonical links, the sitemap and structured data. Leave it unset for local work.

## Project layout

| Path | Contents |
|---|---|
| `src/app/` | Routes, split into `(de)` and `(en)` route groups with one root layout each, plus `robots`, `sitemap` and the 404 and error pages |
| `src/components/landing/` | The home page: canvas, scroll and loop code in `core/`, one folder per scene in `scenes/`, header, loader and hints in `shell/` |
| `src/content/` | Home page copy per language and the app demo paths |
| `src/topics/` | Topic and guide pages: German data in `de/`, English data in `en/`, shared renderers and UI strings |
| `src/lib/` | Locale helpers and slug map, app and site URLs, security headers, shared text link style |
| `public/` | Fonts, image sequences, the embedded app demo and install screenshots, `llms.txt` files |

## Design template

The home page implements the design template `final.dc.html` one to one: the layout, scene order, sizes and motion are fixed, and the English version changes copy only. The template, the check scripts and the recording chain for the app demo are not part of this repository.

## Contributing

Issues and pull requests are welcome. Keep changes small, write code comments in English, and keep German and English pages in step: a change to one language should come with the matching change to the other, or a note saying why not. Details are in [CONTRIBUTING.md](CONTRIBUTING.md); security problems go through [SECURITY.md](SECURITY.md).

## Licence

The website is open source under the [Apache License 2.0](LICENSE), like [the app](https://github.com/Abuarchiv/manawg). The fonts keep their own licences, see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md). The licence does not grant rights to the name ManaWG or its logo; forks that publish a site of their own use their own name and logo.
