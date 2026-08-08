# kyree-yang.github.io

Personal site for Ruikai Yang. React 19 + Vite + TypeScript + Tailwind v4, deployed to GitHub Pages
by GitHub Actions.

Replaces the previous single-page Jekyll build (August 2026).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build -> dist/
npm run preview
```

## Visualizations

Every chart on the site is hand-written SVG — there is no chart library. Each one has the same
signature:

```tsx
function SomeViz({ t, bare }: { t?: number; bare?: boolean })
```

and is a **pure function of `t ∈ [0,1)`**: no accumulated state, no `Math.random()`, no `Date.now()`.
When `t` is omitted the component drives itself through `useAnimationClock`, which pauses off-screen
and freezes entirely under `prefers-reduced-motion`. When `t` is supplied the component renders that
exact frame.

That single property is what lets the same component animate on the page, hold still for a reader who
asked for no motion, and be captured frame-by-frame into a `.gif`.

## GIF export

```bash
npm run build
npm run gif                 # all of them
npm run gif -- rtl-mirror   # just one
npm run gif:check           # what CI asserts
```

`scripts/export-gifs.mjs` serves `dist/`, walks `/_gif/:id?t=…` in headless Chrome one frame at a
time, and stitches the frames with ffmpeg (`palettegen` + `paletteuse`). Output lands in
`public/gif/` and is **committed**, because CI has neither Chrome nor ffmpeg — `scripts/check-gifs.mjs`
just asserts each file exists, is registered, and stays under 400 KB.

Requires Chrome and `ffmpeg` locally. Chrome's new headless mode hangs on `http://` captures on macOS,
so the legacy mode is pinned deliberately; don't "modernize" that flag.

Adding a visualization to the export set means touching two places: `MANIFEST` in
`scripts/export-gifs.mjs` and `GIF_REGISTRY` in `src/gif/registry.tsx`. `check-gifs.mjs` fails the
build if they disagree.

## Deploy

Pushing to `main` runs `.github/workflows/pages.yml`, which builds and publishes `dist/`.

**One-time repository setting:** Settings → Pages → Source must be **GitHub Actions**, not
"Deploy from a branch". The old Jekyll site was served straight from the branch root; this one is not.

`google_scholar_crawler.yaml` is untouched and independent — it force-pushes to the orphan
`google-scholar-stats` branch and has nothing to do with the site build.

## Media

Photographs and videos live in `public/media/`, documents in `public/docs/`. Both are pre-optimized;
nothing at full resolution ships. The predecessor site referenced 106 MB of images, 83 MB of which
were six animated GIFs used as video. Those are now `.webm` + `.mp4` with a poster frame, and the
photos ship WebP with a JPEG fallback.
