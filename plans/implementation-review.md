# Animation implementation review

Reviewed 2026-09-07 against `b9cc152` on `codex/fix-load-animations`. Scope: selected audit findings 1–3.

| Before                                                                                                   | After                                                                                                                                                  | Why                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Four reading groups blurred and translated over 550ms; `both` retained their final filter and transform. | `src/app/globals.css:69` uses a 320ms opacity fade with `cubic-bezier(0.19, 1, 0.22, 1)` and backwards fill; `appear` has no transform or filter.      | Text stays in place and sharp throughout the entrance, then leaves no retained animation. The user selected this intentional opacity-only text treatment.              |
| A regular image switched to the canvas when the original texture finished loading.                       | `src/components/pixel-portrait.tsx` renders a deterministic 28-cell SVG poster; canvas readiness preserves it and user interaction enables the canvas. | The first visible portrait has the same pixelated resting appearance with late JavaScript, a delayed texture, or unavailable WebGL. Early keyboard intent is retained. |
| Hover moved and rotated the button itself over 250ms.                                                    | The fixed button contains a non-interactive visual span with a 150ms expo transform transition.                                                        | All four tested button corners remain stationary while the visual moves; the transformed child cannot enlarge the hover target.                                        |

## Verification

- Rebased onto the Tailwind refactor `e03087f`, then onto `b9cc152` before publication to include the title and theme-persistence updates. Retained the Tailwind structure and motion-safe classes. The final build and all browser tests were rerun on this base.
- Production build completed successfully using installed Next.js 16.3.4.
- Lint, typecheck, formatting, and diff whitespace checks passed.
- Full production browser suite: **27 passed, 1 skipped**. The skipped case is the desktop fine-pointer hover check on the mobile WebKit project.
- Chromium and iPhone WebKit tested cache-disabled loads and reloads, monotonic opacity, stable text geometry, absent filter/transform during and after entrance, delayed portrait texture, early keyboard reveal, reduced motion, and JavaScript-disabled rendering.
- Existing content/media, accessibility, saved themes, keyboard controls, portrait taps, no-WebGL fallback, and 320px layout tests passed.
- Visually inspected 1440×1000 desktop and 390×844 mobile previews. Browser logs showed no warnings or errors.
- Inspected frames at 0.2s, 0.4s, and 0.8s from the recorded Chromium cold-load test. Text fades in place and the poster stays consistent. Both engine runs retain WebM recordings in the ignored `test-results/` directory.

## Verdict

**Approve.** The selected reload and hover issues are addressed with the refactored styling conventions. The portrait retains current-value animation for interruptions, changes its visibility attribute only at state boundaries, and respects reduced motion. No new animation library or runtime dependency was added.

Mobile verification used WebKit device emulation; a physical phone was not available. The original audit is a historical record and its old line references are not current implementation locations. Findings 4 and 5 were outside the selected scope.
