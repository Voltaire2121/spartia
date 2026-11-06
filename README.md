# Spartia

A mobile app to build gym routines with supersets, plan them across the week, log them set by set, and track your progress and PRs.

> 🚧 Work in progress. Step-by-step progress lives in [`docs/PLAN.md`](docs/PLAN.md).

## Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native CLI + TypeScript (iOS first) |
| Navigation & data | React Navigation, TanStack Query |
| API | Node 22, Express, TypeScript, Zod |
| Database | PostgreSQL 16 (Docker locally), Prisma |
| Tests | Vitest + Supertest (API), Jest + React Native Testing Library (app) |
| Quality | ESLint, Prettier, `strict: true` |

## Structure

```
spartia/
├── apps/
│   ├── api/       # Node + Express + PostgreSQL
│   └── mobile/    # React Native CLI
├── design/        # Design system: screens, components and tokens
└── docs/
    ├── PLAN.md        # Official roadmap
    ├── decisions/     # Architecture Decision Records (ADR)
    └── guide/         # Step-by-step learning notes
```

## Exercise data

The initial catalog is imported from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (Unlicense). The dataset images are used during the MVP only: their origin is unclear, so they'll be replaced with our own before the app is monetized. Details in [ADR 0001](docs/decisions/0001-exercise-data-source.md) and [ADR 0002](docs/decisions/0002-use-dataset-images-for-mvp.md).

## Getting started

Coming soon: this section grows as the [plan](docs/PLAN.md) moves forward.
