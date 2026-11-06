# Spartia official plan

> **Current status:** Module 1, step 1.7 (`GET /api/v1/exercises/:id` and central error handling)
> **Last updated:** 2026-11-06

This file is the project roadmap. Each step is small, verifiable and ends in a commit. When a step is done it gets a `[x]`, the short commit hash and a link to its guide note. Changes to the plan go in `docs(plan): ...` commits.

## Decisions

1. **Exercise data: our own database.** Our table is the source of truth, seeded from free-exercise-db (see the research below). Custom exercises can be created (`source = "spartia"`). **The dataset images are used during the MVP only** ([ADR 0002](decisions/0002-use-dataset-images-for-mvp.md)) and must be replaced before monetizing.
2. **Backend learning path:** in-memory array → PostgreSQL with hand-written SQL → Prisma.
3. **Who writes what:** Cristian writes the backend (Claude guides and reviews); Claude writes the mobile app and explains what's new in React Native.
4. **Platform:** iOS only for now (iPhone 16 simulator, iOS 18.6). Android is a future module.
5. **Language:** conversation, docs, code and comments in English; app UI text in Spanish.

## How each backend step works

1. **Short explanation:** what we build and why, with a frontend analogy.
2. **Instructions:** which file to create and what it should do, in small mini-steps, with short snippets only for new syntax.
3. **Cristian writes it.** If stuck, he asks for progressive hints.
4. **✅ Checkpoint:** a command (curl, test, psql) and the expected result.
5. **Review** of the `git diff`: bugs, best practices and why.
6. **Guide note** in `docs/guide/NN-title.md`, with a 🧠 Challenge.
7. **Commit** using Conventional Commits, approved by Cristian.

---

## Module 0 · Setup

- [x] **0.1** iOS-only environment: Node 22 (fnm), Watchman, Docker via Colima, Xcode 26.6, CocoaPods. Removed the iOS 26.5 runtime to free disk space. ([guide](guide/00-environment-and-repo.md))
- [x] **0.2** `git init`, `.gitignore`, initial `README.md` and this `docs/PLAN.md` (`1b9dd9e`)
- [x] **0.3** ADR [`0001-exercise-data-source`](decisions/0001-exercise-data-source.md) and `CLAUDE.md` update (new way of working, iOS only, no dataset images) (`951cee9` · [guide](guide/00-environment-and-repo.md))

## Module 1 · Node + Express with in-memory data

Goal: understand HTTP, Express, validation, pagination and layers without a database in the way.

- [x] **1.1** `apps/api`: `npm init`, strict TypeScript and `tsx`. `src/index.ts` prints "hello". ✅ `npm run dev` prints "hello" (`a8b9c84` · [guide](guide/01-node-typescript-express.md))
- [x] **1.2** First Express server with `GET /health`. ✅ `curl localhost:3000/health` → `{"status":"ok"}` (`a8b9c84` · [guide](guide/01-node-typescript-express.md))
- [x] **1.3** Split `app.ts` from `server.ts`; `config/env.ts` with Zod (`PORT`). ✅ With an invalid `PORT` it refuses to start and explains why (`feed14a` · [guide](guide/02-app-server-env.md))
- [x] **1.4** ESLint + Prettier + VS Code format on save. ✅ `npm run check` passes (`b88993b` · [guide](guide/03-eslint-prettier.md))
- [x] **1.5** `src/scripts/download-exercises.ts`: downloads the JSON with `fetch`, validates it with Zod and saves 20 exercises to `src/data/exercises.sample.json`. ✅ The file exists with 20 exercises (`cb29fa0` · [guide](guide/04-download-exercises.md))
- [x] **1.6** `GET /api/v1/exercises` returns the sample, with `imageUrls` built by the API. ✅ curl returns all 20 ([guide](guide/05-exercises-endpoint.md))
- [ ] **1.7** `GET /api/v1/exercises/:id`, `AppError`, `notFound` and `errorHandler`. ✅ Unknown id → 404 `{ error: { code, message } }`
- [ ] **1.8** `?search`, `?muscle`, `?equipment` filters reading `req.query` by hand. ✅ `?search=curl` filters
- [ ] **1.9** Validation with Zod and a `validate(schema)` middleware. ✅ `?pageSize=abc` → 400
- [ ] **1.10** `page`/`pageSize` pagination (max 100) with a `{ data, meta }` response. ✅ `?page=2&pageSize=5` with correct `meta`
- [ ] **1.11** Refactor into layers: routes → controller → service → repository. ✅ Everything responds as before
- [ ] **1.12** Tests with Vitest + Supertest (list, filter, 400, 404). ✅ `npm test` is green
- [ ] **1.13** `POST /api/v1/exercises` (`source: "spartia"`). ✅ Created, listed and… gone after a server restart

## Module 2 · PostgreSQL with hand-written SQL

Goal: understand a relational database and talk to it without an ORM.

- [ ] **2.1** `docker-compose.yml` with `postgres:16` and `.env.example`. ✅ Connect with `psql`
- [ ] **2.2** `sql/001_init.sql`: `CREATE TABLE exercise`, `INSERT`, `SELECT`, `WHERE`, `ILIKE`, `= ANY(array)`, `ORDER BY`, `LIMIT/OFFSET`, `COUNT`. Arrays vs. a `Muscle` table
- [ ] **2.3** Connect with `pg` (Pool); `findById` in SQL; parameterized queries and SQL injection
- [ ] **2.4** Idempotent import with `INSERT … ON CONFLICT (slug) DO UPDATE`, including image paths. ✅ Running it twice keeps the same `COUNT`
- [ ] **2.5** Filters and pagination in SQL with a safe dynamic `WHERE`. ✅ Tests against `spartia_test`
- [ ] **2.6** `POST` with `INSERT … RETURNING`. ✅ Survives a restart
- [ ] **2.7** Indexes (btree on `name`, GIN on `primary_muscles`) with `EXPLAIN ANALYZE` before and after

## Module 3 · Prisma

Goal: see what an ORM does for you (and what it doesn't) after doing the work by hand.

- [ ] **3.1** `prisma init`, `Exercise` model and indexes, `prisma migrate dev --name init`. Compare with `001_init.sql`
- [ ] **3.2** Repository with Prisma; controller and service don't change
- [ ] **3.3** `prisma/seed.ts` with `upsert` by `slug`. ✅ `npm run seed` twice keeps the same count
- [ ] **3.4** Prisma query logs: see the SQL it generates
- [ ] **3.5** Cleanup: remove `pg` and the manual SQL, API README, tests green

## Module 4 · iOS mobile app (Claude writes and explains)

- [ ] **4.0** **Official frontend plan** in `docs/PLAN-MOBILE.md` + ADR `0003-mobile-architecture.md`: clean architecture by feature (`domain/`, `data/`, `presentation/`), dependency rule `presentation → domain ← data` enforced with ESLint, shared `core/` and `ui/`, state, testing per layer, path aliases and CI with GitHub Actions. *Steps 4.1–4.4 get rewritten based on this plan.*
- [ ] **4.1** React Native CLI `init` (confirm bundle id `app.spartia.mobile` and the name "Spartia"), `pod install`. ✅ The welcome app runs in the simulator
- [ ] **4.2** Theme from `design/tokens.json`, Inter font, `ThemeProvider`, `AppText` and `Screen`. ✅ It switches with dark mode
- [ ] **4.3** React Navigation, TanStack Query, HTTP client (`http://localhost:3000`) and `useExercises` with `useInfiniteQuery`
- [ ] **4.4** `ExerciseListScreen` (infinite scroll, 300 ms debounced search, loading/error/empty states) and `ExerciseRow` with a 52×52 exercise image (placeholder while loading or if missing). ✅ Scroll to the last exercise; "curl" filters

## Wrap-up of the first stage

- [ ] Repo README (what it is, stack, how to run it, data license) and a summary of what was learned
- [ ] Next stage (backend written by Cristian): routines and supersets, weekly assignment, sessions and sets, PRs and volume

## Future ideas

- Android: Gradle, emulator and `10.0.2.2`
- `packages/shared` with shared types and Zod schemas
- A `Muscle` table instead of arrays
- Spanish exercise names (`nameEs` or translations)
- **Before monetizing:** replace the dataset images with our own or licensed ones (wger CC-BY-SA, a paid provider) and write a new ADR
- Deploy: database on Neon and API in the cloud

---

## Research: data source (2026-11-06)

| Question | Answer |
|---|---|
| Does it cost money? | No. It's a public JSON file on GitHub. |
| License | Unlicense (public domain). A fork of `wrkout/exercises.json`, same license. |
| Can we monetize? | The text, yes. The images are not safe: the maintainer wrote *"I actually have no idea where the images are from or if they are royalty free so usage would be at your own risk"* ([issue #2](https://github.com/yuhonas/free-exercise-db/issues/2)), and in [issue #13](https://github.com/yuhonas/free-exercise-db/issues/13) users report they look like they came from ExRx.net. |
| Can we extend it? | Yes. The data is copied into our database and the `source` column tracks the origin. |
| Alternatives | wger (CC-BY-SA, with Spanish text), paid providers (wrkout.xyz, ExerciseDB) or our own photos. |
