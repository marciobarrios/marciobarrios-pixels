# 003 — Move the portrait visual inside a fixed hit target

**DONE — rebased adaptation:** Implemented on `e03087f` with a named Tailwind `group/portrait` button and `.portrait-visual` child. Visual styles stay in component utility classes, with a 150ms expo transition and `motion-safe:pointer-fine:group-hover/portrait` variants. Reduced motion retains the resting orientation. No legacy `.portrait` rules were restored to global CSS.

- **Commit:** b5fa76c
- **Severity:** MEDIUM
- **Category:** Physicality / interruptibility
- **Estimated scope:** pixel-portrait.tsx, globals.css, hover regression coverage

## Problem and current code

`/Users/marciobarrios/.codex/worktrees/5482/marciobarrios-pixels/src/app/globals.css:171-182` places `transform: rotate(-3deg)` and a 250ms transform transition on `.portrait`. At lines 730-732, `.portrait:hover` becomes `rotate(0deg) translateY(-2px)`. That moves the button's hover geometry and permits flicker at its edges.

## Target

Keep `.portrait` as a stationary button with its existing responsive width/height, focus outline, and accessible behavior. Put the photo/poster/canvas and their background, border radius, and shadow in an inner `.portrait-visual` span filling the button. Set `pointer-events: none` on the visual so transformed overflow cannot alter the hover target. Move the existing resting `rotate(-3deg)` and hover `rotate(0deg) translateY(-2px)` onto the span. Use `transition: transform 150ms cubic-bezier(0.19, 1, 0.22, 1)` on the base visual. Keep hover behind `(hover: hover) and (pointer: fine)`. Under reduced motion disable this transform transition and use the same resting orientation in both states, so there is no positional snap on hover.

150ms follows the hover duration budget; the expo curve supplies a responsive settle. `src/app/globals.css` already keeps clip hover movement on the child video under a stationary `.clip-trigger`; follow that structure. Coordinate the same visual wrapper with plan 002.

## Steps

1. Add the inner visual wrapper without moving button event handlers or semantics.
2. Move visual styles and all responsive radius/image selectors to the correct layer.
3. Gate hover and reduced motion; retain ref-based current-value pixel animation.
4. Verify all button edges remain stable when the visual moves and when the pointer enters/exits rapidly.

## Out of scope

Clip, favicon, dialog and theme hover changes; changing portrait layout dimensions; new animation libraries.

## Verification

Run standard checks, keyboard/touch tests, and desktop pointer-boundary tests. Compare button bounding boxes before, during and after hover; they must be unchanged while the visual moves. Check visible focus indication, early interactions from plan 002, reduced-motion stationary geometry, and 390px/1440px responsive layouts. Record/replay rapid hover transitions and inspect for flicker. No drag gesture is introduced.
