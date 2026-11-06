# ADR 0002 · Use the dataset images during the MVP

- **Status:** Accepted (amends [ADR 0001](0001-exercise-data-source.md))
- **Date:** 2026-11-06

## Context

[ADR 0001](0001-exercise-data-source.md) decided not to use the free-exercise-db images, because their origin is unclear and the app was going to be monetized.

After reviewing the MVP scope:

- The app **will not be monetized right away**. The MVP is a portfolio and learning project.
- Images make a big difference in how the app looks and feels (exercise picker, routine builder), and placeholders would make the MVP look unfinished.
- We still don't know who owns the images ([issue #2](https://github.com/yuhonas/free-exercise-db/issues/2), [issue #13](https://github.com/yuhonas/free-exercise-db/issues/13)), so the risk is still there. It's just acceptable for a non-commercial MVP.

## Decision

1. **During the MVP we use the dataset images.** Each exercise stores the relative image paths (`images`, e.g. `3_4_Sit-Up/0.jpg`).
2. **The API builds the full URLs** (`imageUrls`) from a configurable base URL (`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/`). The app never builds image URLs itself.
3. Everything else from ADR 0001 stays the same: our table is the source of truth, imports are idempotent, and `source` tracks the origin.

## Consequences

- ✅ The MVP shows real exercise images.
- ✅ Swapping images later only changes the data (`images`) and the base URL in the API. The app doesn't change, because it only reads `imageUrls`.
- ⚠️ The images are served from GitHub (raw.githubusercontent.com), a third party, at runtime. Fine for an MVP, but not for production.
- 🚫 **Before monetizing or publishing to the App Store**, replace the images with our own or licensed ones and write a new ADR.
