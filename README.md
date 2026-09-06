# Marcio Barrios — I move pixels.

A personal portfolio for a Design Engineer in Barcelona. One statically rendered page, with the work and the small details doing the talking.

## Run locally

Use Node **24** (`fnm use` reads `.node-version`) and pnpm **11.1.2**.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. No environment variables or database are required.

## Stack

- Next.js 16.3.4, App Router; React 19.2.8; TypeScript 7.0.2
- Tailwind CSS 4, `class-variance-authority`, `clsx`, `tailwind-merge`
- shadcn/ui `base-nova` components using `@base-ui/react` primitives
- Self-hosted Geist Mono through `next/font`
- Oxlint, Oxfmt, Playwright, and axe
- Node 24 and pnpm

## Edit the page

- `src/app/page.tsx`: introduction, social links, career history, and footer.
- `src/lib/content.ts`: the seven projects and three MITO clips, including their copy and destinations.
- `src/app/globals.css`: color tokens, layout, typography, texture, motion, and responsive styles.
- `public/media`: original portrait plus web-optimized copies of the supplied MITO recordings and still posters.
- `public/icons`: locally served favicons. Some projects use their existing default favicon.
- `src/app/opengraph-image.tsx`: social sharing image, generated at build time.

The portrait uses a small WebGL pixelation shader. Hover resolves the image; click/tap pins the clear portrait, and a second click restores the pixels. If WebGL is unavailable or its context is lost, the ordinary portrait stays visible. Rendering only runs during interactions.

Hover or focus the portrait for a Konami-code hint. Enter ↑ ↑ ↓ ↓ ← → ← → B A anywhere on the page to open the animated “Beyond the pixels” dialog; on touch screens, tap the portrait and use the on-screen controls. The six personal details and their links come from the section after “Still here? Do you want to know more about me?” on [marciobarrios.com](https://marciobarrios.com/). The listener ignores text fields, other dialogs, modifier shortcuts, and held-key repeats. Escape, the close button, or the backdrop dismiss the dialog and restore focus; reduced motion is respected.

The MITO work entry starts expanded. The three previews play only while visible and the page is active, with a shared pause button. Each opens a Base UI dialog with native video controls. Reduced-motion visitors start with static posters and can explicitly opt into playback. These are silent screen recordings, with text descriptions in each viewer.

The checkbox near the footer scatters a pixel cursor and restores it on the next toggle. Light/dark mode follows the system until changed, then stores the preference locally. Entrance motion, hover effects, and the pixel toy respect reduced motion.

## Quality checks

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

Playwright runs the production build on port 3101 in desktop Chromium and iPhone WebKit. Checks cover content and media, persisted themes, WCAG AA automated scans, video playback and focus restoration, keyboard operation, reduced motion, portrait fallback, and 320px layout.

To run against a deployment:

```sh
PLAYWRIGHT_BASE_URL=https://marciobarrios-pixels.vercel.app pnpm test:e2e
```

## Vercel

The app is configured for Vercel with Node 24, a frozen pnpm lockfile, and a standard `next build`. The portfolio has its own project name, `marciobarrios-pixels`.

When connecting a custom domain, update `metadataBase` in `src/app/layout.tsx`, the URL in `src/app/sitemap.ts`, and the sitemap URL in `src/app/robots.ts`. The existing `marciobarrios.com` site is separate from this project.

## Content provenance

The brief supplies the MITO role, career dates, and project list. Social handles and the portrait came from the existing marciobarrios.com portfolio. Project descriptions were checked against their public sites. The new visual design takes cues from the supplied portfolio references, with original copy and interactions. The three recordings are optimized copies; the originals in Downloads are untouched.
