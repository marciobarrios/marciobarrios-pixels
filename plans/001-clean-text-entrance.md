# 001 — Fade reading content without blur or travel

**DONE — rebased adaptation:** The historical excerpts below describe `b5fa76c`. On `e03087f`, the entrance lives in `--animate-appear` in `src/app/globals.css:68` and the four page groups use `motion-safe:animate-appear` with their existing delays. The implemented fix updates that token and its keyframes. The existing `motion-safe` gate already gives reduced-motion users immediately visible text, so no legacy `.reveal` CSS was restored.

- **Commit:** b5fa76c
- **Severity:** MEDIUM
- **Category:** Performance / legibility
- **Estimated scope:** globals.css and focused browser regression coverage

## Problem and current code

In `/Users/marciobarrios/.codex/worktrees/5482/marciobarrios-pixels/src/app/globals.css:706`, `appear` animates `opacity`, `translateY(7px)`, and `blur(3px)` to `translateY(0)` and `blur(0)`. `.reveal` uses `animation: appear 550ms cubic-bezier(0.16, 1, 0.3, 1) both`. Four reading groups in `src/app/page.tsx` use it. The user reports an odd text entrance on hard reload.

## Target

Keep the server-rendered text, class names, and the existing 0/80/150/210ms group delays. Animate only opacity from 0 to 1 with `appear 320ms cubic-bezier(0.19, 1, 0.22, 1) backwards`. The base text remains visible; backwards fill covers the delay without retaining the end frame. No transform, filter, permanent will-change, mounted state, font readiness gate, or JavaScript animation start. Under reduced motion, set `.reveal { animation: none; opacity: 1; }`.

320ms is a restrained one-time portfolio fade; the strong expo curve comes from the audit's text-reveal guidance. Existing local CSS keyframes and the tagline's separate opacity/transform animation in `src/app/globals.css` are the convention; this intentional text-only fade is selected to remove the reported blur/travel artifact.

## Steps

1. Read installed Next.js CSS guidance before editing.
2. Replace only the entrance keyframes and declaration; keep the stagger and layout.
3. Strengthen the reduced-motion rule for these groups.
4. Add meaningful regression coverage for opacity staying monotonic, no filter/transform during and after entrance, no late disappearance on a reload, and stable text geometry.

## Out of scope

Tagline rotation, copy, other hovers, dialogs, video playback, dependencies, new animation libraries.

## Verification

Run lint, formatting, typecheck, production build, existing desktop/mobile tests and focused entrance coverage. Record or sample the first second on initial load and hard reload; scrub frames for text blinking or shifting. Check both themes, reduced motion, and 390px/1440px layouts. No real-device gestures are introduced.
