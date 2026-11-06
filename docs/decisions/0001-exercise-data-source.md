# ADR 0001 · Exercise catalog source

- **Status:** Accepted, **amended by [ADR 0002](0002-use-dataset-images-for-mvp.md)** (the dataset images are used during the MVP)
- **Date:** 2026-11-06

## Context

Spartia needs an exercise catalog (name, muscles, equipment, level, instructions and ideally images) to build routines. The plan is to **monetize** the app later and to be able to **extend** the catalog with our own exercises.

We evaluated [free-exercise-db](https://github.com/yuhonas/free-exercise-db), a public JSON file with about 876 exercises:

- **Cost:** free, downloaded from GitHub.
- **License:** [Unlicense](https://unlicense.org) (public domain). It's a fork of [wrkout/exercises.json](https://github.com/wrkout/exercises.json), same license.
- **Images:** unknown origin. The maintainer wrote in [issue #2](https://github.com/yuhonas/free-exercise-db/issues/2): *"I actually have no idea where the images are from or if they are royalty free so usage would be at your own risk"*. In [issue #13](https://github.com/yuhonas/free-exercise-db/issues/13) several users point out they seem to come from ExRx.net, and the maintainer suggests replacing them with placeholders.

Options considered:

| Option | Pros | Cons |
|---|---|---|
| Full free-exercise-db (with images) | Fast, has images | Legal risk in a monetized app |
| [wger](https://wger.de) | CC-BY-SA, commercial use with attribution, Spanish text | Incomplete images, more complex API, share-alike on the data |
| Paid provider (ExerciseDB, wrkout.xyz) | Licensed images/videos | Cost and third-party dependency |
| **Our own database, seeded with free-exercise-db text** | No cost or risk; extensible; decoupled from the provider | No images at first |

## Decision

1. **Our database is the source of truth.** The external dataset is only used for the initial load, through an idempotent script (`upsert` by `slug`). The API never calls third parties at runtime.
2. **Only text is imported** from free-exercise-db: name, muscles, equipment, level, mechanic, force, category and instructions. **Its images are not used.**
3. Each exercise stores `source`: `"free-exercise-db"` for imported ones, `"spartia"` for the ones we create.
4. The API returns `imageUrls: []` until licensed images exist, and the app shows a placeholder.

## Consequences

- ✅ The app can be monetized without copyright risk from images.
- ✅ Adding exercises is a `POST` or an `INSERT`. Switching or adding providers (wger, a paid one, our own photos) doesn't affect the app, because only the import script changes.
- ⚠️ No real images at first.
- ⚠️ Names and instructions are in English while the app UI is in Spanish. To be decided later (`nameEs`, a translations table, or wger).
- 🔁 Revisit this decision before publishing to the App Store.
