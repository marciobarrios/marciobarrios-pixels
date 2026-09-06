# 002 — Give the portrait a stable pixelated first frame

**DONE — rebased adaptation:** Implemented on `e03087f`, retaining the component's Tailwind utilities. `public/media/marcio-pixelated.svg` is regenerated with `node scripts/portrait-poster.mjs`. The poster remains visible at rest; the canvas's `data-active` attribute only reveals it during an interaction. Readiness no longer makes the canvas visible, and early keyboard/pointer intent is retained. No-JavaScript and no-WebGL paths retain the pixelated poster.

- **Commit:** b5fa76c
- **Severity:** MEDIUM
- **Category:** Cohesion / initial-state continuity
- **Estimated scope:** pixel-portrait.tsx, initial-frame asset or markup, focused regression tests

## Problem and current code

`/Users/marciobarrios/.codex/worktrees/5482/marciobarrios-pixels/src/components/pixel-portrait.tsx:71-99` separately loads `/media/marcio.jpg`, calls `draw(0)`, and sets `canvas.dataset.ready = "true"`. At line 137, a regular `<Image src="/media/marcio.jpg" ... priority />` is initially visible. `/Users/marciobarrios/.codex/worktrees/5482/marciobarrios-pixels/src/app/globals.css:191-197` switches canvas opacity immediately from 0 to 1. A cold load can therefore show the regular portrait before switching to pixels.

## Target

Render the pixelated resting portrait in the initial HTML. It must remain a useful visible fallback with JavaScript disabled, delayed texture loading, image failure, or unavailable WebGL. Enhance that resting state to the existing 28-cell, 65%-color WebGL treatment without an automatic clear-to-pixel change. Preserve the original photo for user-triggered detail reveal and the 420ms interruptible pixel effect. Read the installed Next.js image guide, including the current replacement for deprecated priority.

A small deterministic SVG pixel poster matching the shader's existing 28-by-28 grid and color formula is acceptable as implementation code. Keep its geometry and colors derived from the existing portrait, and avoid generative changes to the person's appearance. Keep the poster visible at rest so late canvas readiness cannot itself cause a visible swap. Only show the detailed canvas as part of user-triggered reveal; returning to rest must match the poster. A failure must leave the poster usable. Do not hide the whole page or wait for hydration before revealing text.

## Conventions to follow

Use the existing ref-based animation lifecycle and cleanup in `src/components/pixel-portrait.tsx`; do not animate React state per frame. Preserve semantic image text, the existing button label and aria-pressed state, touch toggling, and reduced-motion snap behavior. SVG assets already exist under `public/icons`.

## Steps

1. Read installed Next.js image and client-component documentation.
2. Add a stable server-rendered pixelated poster, with a reproducible source if generation is required.
3. Make canvas readiness only enable enhancement; visibility changes must follow user intent, not image completion.
4. Keep requested reveal state when pointer/focus/tap occurs before canvas readiness. Handle errors and context loss by retaining the poster.
5. Add regression coverage for delayed image load, absent WebGL, JavaScript disabled, early interaction, and successful reveal/reset. Coordinate markup with plan 003.

## Out of scope

New animation libraries, portrait redesign, changing source photo, tagline behavior, video or dialog animation.

## Verification

Run the standard checks and production browser tests. On normal and cold reloads inspect the first visible portrait through readiness; there must be no automatic clear-to-pixel swap. Test desktop pointer/focus and mobile taps, including early interaction, reduced motion, and fallback cases. Keep the first frame visible if JavaScript never runs. Document any real-device testing that remains unavailable.
