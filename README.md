# Spartia

App móvil para crear rutinas de gimnasio con superseries, asignarlas a la semana, registrarlas serie por serie y ver tus avances y PRs.

> 🚧 En construcción. El avance paso a paso está en [`docs/PLAN.md`](docs/PLAN.md).

## Stack

| Capa | Tecnología |
|---|---|
| App móvil | React Native CLI + TypeScript (iOS primero) |
| Navegación y datos | React Navigation, TanStack Query |
| API | Node 22, Express, TypeScript, Zod |
| Base de datos | PostgreSQL 16 (Docker en local), Prisma |
| Tests | Vitest + Supertest (API), Jest + React Native Testing Library (app) |
| Calidad | ESLint, Prettier, `strict: true` |

## Estructura

```
spartia/
├── apps/
│   ├── api/       # Node + Express + PostgreSQL
│   └── mobile/    # React Native CLI
├── design/        # Sistema de diseño: pantallas, componentes y tokens
└── docs/
    ├── PLAN.md        # Roadmap oficial
    ├── decisiones/    # Registros de decisiones de arquitectura (ADR)
    └── guia/          # Notas de aprendizaje paso a paso
```

## Datos de ejercicios

El catálogo inicial se importa desde [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (licencia Unlicense). Solo se copian los textos, no las imágenes, porque su origen no está claro. Los detalles están en el ADR 0001 (pendiente).

## Cómo correrlo

Pendiente: se completa a medida que avanza el [plan](docs/PLAN.md).
