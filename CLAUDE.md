# Spartia Workout Tracker — context for Claude Code

## What this project is

Spartia is a mobile app to log gym workouts. The user:

1. creates routines (with supersets of 2 or more exercises),
2. assigns them to days of the week,
3. runs them set by set, seeing what they did last time,
4. sees a summary with their progress and PRs, plus the week's progress.

It's **Cristian's main portfolio project** on GitHub. Cristian is a frontend developer (React, TypeScript, Vite) and uses this project to learn **React Native and Node backend**. The repo must look professional: layered architecture, strict typing, tests, clean commits and a README that explains the decisions.

## Official plan

The roadmap lives in **`docs/PLAN.md`**. At the start of a session, read it to know which step we're on. When a step is done, mark it with `[x]`, the short commit hash and a link to its guide note, and update the "Current status" block. Changes to the plan go in `docs(plan): ...` commits. Before writing any mobile code, we write the frontend plan (`docs/PLAN-MOBILE.md`, step 4.0).

Architecture decisions are recorded as ADRs in `docs/decisions/NNNN-title.md`.

## How to work with me: guide mode

This repo is also a course. **I care more about learning than about going fast.**

### Who writes what

- **Backend (`apps/api`): I write it.** You explain, tell me which file to create and what it should do, and give me short snippets only for new syntax. **Never write the whole file or edit my API code.** If I get stuck, give me progressively more specific hints before showing the solution. When I'm done, review my `git diff` and point out bugs, best practices and the reasons behind them.
- **Format that works for me:** small mini-steps (A, B, C…), **one per message**, with a progress map (✅/🔵/⬜), each command with a short explanation, snippets explained line by line, and a quick test at the end of each mini-step. Check my files on disk before moving on (sometimes I forget to save).
- **Backend path:** in-memory array → PostgreSQL with hand-written SQL (`pg`) → Prisma. Don't skip stages.
- **Mobile app (`apps/mobile`): you write it**, explaining what's new in React Native. I review.
- **Documentation** (`docs/`, README, ADRs, guide notes): you write it.

### General rules

- **Explain before doing.** At the start of each step, say in 2–4 sentences what we're building and why it's done that way (the architecture decision, the alternative we ruled out).
- **Small, verifiable steps.** One step = something I can run and see working (a command, an endpoint with curl, a screen in the simulator). End each step with a **✅ Checkpoint** that says exactly which command to run and what I should see.
- **I run the important commands.** Commands that start things or touch the database (`docker compose up`, `prisma migrate`, `npm run seed`, the simulator): tell me so I run them, unless I ask you to.
- **New backend or React Native concepts:** when one shows up (middleware, ORM, migration, FlatList, Metro…), explain it in a short paragraph with a frontend/React analogy I already know.
- **When closing each step**, add a note in `docs/guide/NN-title.md` with: goal, what we did, key concepts, commands, common errors and a small **🧠 Challenge** for me to solve on my own.
- **One commit per step**, using Conventional Commits (`feat(api): ...`, `chore(mobile): ...`, `docs(guide): ...`). Propose the message and wait for my "yes" before committing.
- **Talk to me in English** (since step 1.4; I want to practice). Code, comments in any file, variable names, commits and docs are in English. App user-facing text stays in Spanish.
- If something is unclear or a decision is hard to undo, ask me first.

## Stack (decided)

| Layer | Technology | Why |
|---|---|---|
| Mobile app | **React Native CLI** + TypeScript (no Expo). **iOS only for now** | Cristian wants to master native tooling (Xcode, Metro and later Gradle) for interviews at big companies. Android is postponed because the MacBook (M2, 8 GB) doesn't handle Android Studio well |
| Navigation | React Navigation (native stack + bottom tabs) | Industry standard |
| Remote data | TanStack Query | Caching, retries and pagination without reinventing them |
| API | Node 22 (fnm), **Express**, TypeScript 6.0 | Requested; the most common in job posts. TS 6.0 because typescript-eslint doesn't support TS 7 yet |
| Database | **PostgreSQL** | Relational data (routines → exercises → sets); PRs and volume come from SQL queries |
| ORM | **Prisma** | Readable schema, migrations, in demand |
| Validation | **Zod** | Validates query params, bodies and env vars; types are inferred from the schema |
| Tests | Vitest + Supertest (API), Jest + React Native Testing Library (app) | |
| Local database | Docker Compose (`postgres:16`) on **Colima** (not Docker Desktop, to save RAM) | Production will be on Neon |
| Quality | ESLint (`recommendedTypeChecked`) + Prettier (single quotes, no semicolons), `strict: true` | |

**Don't use:** Expo, MongoDB/Mongoose, untyped JavaScript, hard-coded colors in components.

## Repo structure

```
spartia/
├── apps/
│   ├── api/          # Node + Express + Prisma
│   └── mobile/       # React Native CLI
├── design/           # Design system (PNG/HTML screens, tokens). See design/README.md
├── docs/
│   ├── PLAN.md       # Official roadmap with checkboxes
│   ├── decisions/    # ADRs (Architecture Decision Records)
│   └── guide/        # The step-by-step guide we write as we go
├── CLAUDE.md
└── README.md         # Portfolio front page
```

For now `api` and `mobile` are independent projects, each with its own `package.json`. Later, in a separate lesson, we add a `packages/shared` package with shared types and Zod schemas.

## API architecture (layered)

```
apps/api/src/
├── app.ts                # builds the Express app (no listen) → testable with Supertest
├── server.ts             # reads config and calls listen
├── config/env.ts         # environment variables validated with Zod
├── lib/prisma.ts         # a single PrismaClient instance (from Module 3; before that, the repository uses an array and then `pg`)
├── middlewares/          # errorHandler, notFound, validate(schema)
├── modules/
│   └── exercises/
│       ├── exercise.routes.ts      # routes → controller
│       ├── exercise.controller.ts  # HTTP: reads req, writes res. No business logic
│       ├── exercise.service.ts     # business rules
│       ├── exercise.repository.ts  # the only place that talks to the database
│       ├── exercise.schemas.ts     # Zod: query params and DTOs
│       └── exercise.test.ts
└── utils/
```

Conventions:
- List responses: `{ "data": [...], "meta": { "page", "pageSize", "total", "totalPages" } }`.
- Errors: `{ "error": { "code": "NOT_FOUND", "message": "..." } }` with the right HTTP status, always from the central `errorHandler`.
- All routes under `/api/v1`. There's `GET /health` to check the server is alive.
- The controller never imports the database client; the repository never knows about `req`/`res`.

## Exercise data

Full decision in `docs/decisions/0001-exercise-data-source.md`. **Our table is the source of truth**; the external dataset is only used for the initial load.

Source: **free-exercise-db** (github.com/yuhonas/free-exercise-db), about 876 exercises, **Unlicense**.
- Full JSON: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`
- Fields: `id` (slug, e.g. `3_4_Sit-Up`), `name`, `force`, `level`, `mechanic`, `equipment`, `primaryMuscles[]`, `secondaryMuscles[]`, `instructions[]`, `category`, `images[]`.
- `force`, `mechanic` and `equipment` can be `null`.
- **Don't use the dataset images.** Their origin is unclear (the maintainer admits it in issue #2) and the app will be monetized. The API returns `imageUrls: []` and the app shows a placeholder. Licensed images will come later.
- The data is **copied into our database** with an idempotent script (`upsert` by `slug`), never queried live.
- Store `slug` (the original `id`) and `source`: `"free-exercise-db"` for imported ones and `"spartia"` for ones we create (`POST`).

## Mobile app

- Theme: `apps/mobile/src/theme/` generated from `design/tokens.json` (light/dark colors, spacing, radii, Inter typography). Supports dark mode with `useColorScheme()`.
- **Before building a screen, open `design/screens/<Screen>.png` (and `.dark.png`), read its `.md` and, if you need measurements, the `.html` with `design/components.css`.** The result should look as close as possible to those images.
- Architecture: defined in step 4.0 (`docs/PLAN-MOBILE.md`) with clean architecture by feature (`domain/`, `data/`, `presentation/`) plus shared `core/` and `ui/`. **Don't write mobile code before that plan.**
- Simulator: iPhone 16 on iOS 18.6 (the only runtime installed; don't install others without asking, disk space is tight).
- API URL in development: iOS simulator → `http://localhost:3000`, physical phone → the computer's IP on the local network. (Android, when it comes: `http://10.0.2.2:3000`.)
- Long lists with `FlatList` (with `keyExtractor`, `onEndReached` for pagination and fixed-size images).

## Commands (growing as we go)

```bash
# Docker (Colima)
colima start --cpu 2 --memory 2
colima stop                 # when done, to free RAM

# API
cd apps/api
npm run dev                 # http://localhost:3000
npm run check               # typecheck + lint + format:check
npm run format              # apply Prettier
docker compose up -d        # local Postgres (Module 2)
npx prisma migrate dev      # apply migrations (Module 3)
npm run seed                # load exercises (Module 3)
npm test                    # (step 1.12)

# Mobile
cd apps/mobile
npm start                   # Metro
npm run ios                 # (Android postponed)
```
