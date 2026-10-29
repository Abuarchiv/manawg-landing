# manawg-landing

Only what builds the site belongs in this repo. The design template (`final.dc.html`), check scripts and the capture chain are kept outside this repository (see README, section Design template).

- Implement `final.dc.html` 1:1, do not thin it out or reinterpret it.
- `main` only, commit locally. Push and deploy only after explicit approval (Vercel builds `main` automatically).
- Before "done": `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. With a dev server running, use `NEXT_DIST_DIR=.next-xyz` and remove the folder afterwards.
