# Selected animation improvements

The user selected and authorized implementation of findings 1–3 on 2026-09-06. The branch was rebased onto `e03087f` (the Tailwind 4 refactor) before finishing implementation. It was subsequently rebased onto `b9cc152` to include the title and theme-persistence updates, with all checks rerun. All source changes follow the refactored utility conventions.

| Order | Plan                                                              | Dependencies           | Status |
| ----- | ----------------------------------------------------------------- | ---------------------- | ------ |
| 1     | [Clean text entrance](001-clean-text-entrance.md)                 | None                   | DONE   |
| 2     | [Stable portrait first frame](002-stable-portrait-first-frame.md) | Shared markup with 003 | DONE   |
| 3     | [Stable portrait hover](003-stable-portrait-hover.md)             | Shared markup with 002 | DONE   |

[Original audit](animation-audit.md). Findings 4 and 5 remain unselected and outside this implementation.

[Implementation review and verification](implementation-review.md).
