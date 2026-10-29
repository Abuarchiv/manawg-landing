# Contributing to the ManaWG website

Thanks for helping. Fixes to wording, translations, broken links and page bugs are welcome, in
English or German. This repository is the website [manawg.com](https://manawg.com) only. Problems
with the app itself belong in the [app repository](https://github.com/Abuarchiv/manawg/issues/new/choose).

## Before you start

- **Small fixes** (typos, a wrong fact, a broken link): open a pull request directly.
- **New pages or larger changes:** open an issue first and agree on the approach.
- **Security problems:** see [SECURITY.md](SECURITY.md), never a public issue.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Run it locally

You need Node.js 22 and pnpm 9.

```sh
git clone https://github.com/<you>/manawg-landing.git   # your fork
cd manawg-landing
corepack enable
pnpm install
pnpm dev                                                 # http://localhost:3100
```

## Rules for changes

- **Both languages.** A page that exists in German and English changes in both. German pages live
  in `src/topics/de/` and `src/app/(de)/`, English in `src/topics/en/` and `src/app/(en)/en/`.
  A new topic needs an entry in the slug map in `src/lib/locale.ts`.
- **Facts must match the app.** Describe only what ManaWG really does today. If you are unsure,
  check the app repository.
- **Legal pages.** The German imprint, privacy policy and terms are the binding versions. Changes
  to them need an issue first; the English pages translate them.
- **Home page design.** The layout, scene order, sizes and motion of the home page follow a fixed
  design. Copy fixes are welcome; changes to layout or motion need an issue first.

## Before you open the pull request

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Describe what changed and why, and link the issue if there is one. Keep a pull request to one
topic.

## Licence

By contributing you agree that your contribution is licensed under the
[Apache License 2.0](LICENSE), like the rest of the repository.
