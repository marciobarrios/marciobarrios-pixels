# Marcio Barrios

I'm a design engineer based in Barcelona. This is my portfolio: a single page with selected projects, work history, and a few playful interactions.

## Run locally

You'll need Node **24** and pnpm **11.1.2**. If you use fnm, run `fnm use` to pick up the version in `.node-version`.

```sh
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). No environment variables or database setup needed.

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS 4 for styling
- shadcn/ui components built on Base UI
- Geist Mono, served locally through `next/font`
- Oxlint and Oxfmt for linting and formatting
- Playwright and axe for browser and accessibility checks

## Edit the page

- `src/app/page.tsx`: introduction, social links, career history, and footer.
- `src/lib/content.ts`: project descriptions, links, and MITO video clips.
- `src/app/globals.css`: global color tokens, base behavior, and animation keyframes. Component
  layout, typography, states, and responsive styles live in Tailwind utilities beside the markup.
- `public/media`: portrait, MITO recordings, and video posters.
- `public/icons`: project favicons.
- `src/app/opengraph-image.tsx`: social sharing image, generated at build time.

## Interactions

- Hover over the portrait to reveal it. Click or tap to keep it clear, then click again to bring back the pixels. If WebGL isn't available, the regular portrait is shown.
- The MITO section starts open. Its three silent video previews play while visible, with one button to pause them all. Open a preview to watch it with video controls and a text description.
- Toggle the checkbox near the footer to scatter and rebuild a pixel cursor.
- Light and dark mode follow your system settings until you choose a theme. Your choice is saved in the browser.

Animations respect your reduced motion setting. Video previews start as still posters when reduced motion is enabled, and you can choose to play them.

## Quality checks

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

Playwright runs the production build on port 3101 in desktop Chromium and iPhone WebKit. The tests check content, media playback, saved themes, keyboard navigation, accessibility, reduced motion, and small screen layouts.

To run against a deployment:

```sh
PLAYWRIGHT_BASE_URL=https://marciobarrios-pixels.vercel.app pnpm test:e2e
```

## Vercel

The Vercel project is `marciobarrios-pixels`. It uses Node 24, installs dependencies from the pnpm lockfile, and builds with `next build`.

When connecting a custom domain, update `metadataBase` in `src/app/layout.tsx`, the URL in `src/app/sitemap.ts`, and the sitemap URL in `src/app/robots.ts`. The existing `marciobarrios.com` site is separate from this project.
