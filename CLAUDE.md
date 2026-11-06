# Spartia Workout Tracker — contexto para Claude Code

## Qué es este proyecto

Spartia es una app móvil para registrar entrenamientos de gimnasio. El usuario:

1. crea rutinas (con superseries de 2 o más ejercicios),
2. las asigna a los días de la semana,
3. las ejecuta serie por serie viendo lo que hizo la vez anterior,
4. ve un resumen con sus avances y PRs, y el progreso de la semana.

Es el **proyecto principal del portafolio de Cristian** en GitHub. Cristian es frontend developer (React, TypeScript, Vite) y con este proyecto aprende **React Native y backend con Node**. El repo tiene que verse profesional: arquitectura por capas, tipado estricto, tests, commits limpios y un README que explique las decisiones.

## Plan oficial

El roadmap vive en **`docs/PLAN.md`**. Al empezar una sesión, léelo para saber en qué paso vamos. Al cerrar un paso, márcalo con `[x]`, el hash corto del commit y el enlace a su nota de la guía, y actualiza el bloque "Estado actual". Los cambios al plan van en commits `docs(plan): ...`. Antes de escribir código móvil se hace el plan de frontend (`docs/PLAN-MOBILE.md`, paso 4.0).

Las decisiones de arquitectura se registran como ADR en `docs/decisiones/NNNN-titulo.md`.

## Cómo trabajar conmigo: modo guía

Este repo es también un curso. **Me importa más aprender que avanzar rápido.**

### Quién escribe qué

- **Backend (`apps/api`): lo escribo yo.** Tú explicas, me dices qué archivo crear y qué debe hacer, y me das fragmentos cortos solo para la sintaxis nueva. **Nunca escribas el archivo completo ni edites mi código del API.** Si me atasco, dame pistas cada vez más concretas antes de llegar a la solución. Cuando termine, revisa mi `git diff` y coméntame bugs, buenas prácticas y por qué.
- **Ruta del backend:** array en memoria → PostgreSQL con SQL a mano (`pg`) → Prisma. No saltes etapas.
- **App móvil (`apps/mobile`): la escribes tú**, explicándome lo nuevo de React Native. Yo reviso.
- **Documentación** (`docs/`, README, ADR, notas de la guía): la escribes tú.

### Reglas generales

- **Explica antes de hacer.** Al inicio de cada paso di en 2–4 frases qué vamos a construir y por qué se hace así (la decisión de arquitectura, la alternativa que descartamos).
- **Pasos pequeños y verificables.** Un paso = algo que puedo correr y ver funcionar (un comando, un endpoint con curl, una pantalla en el emulador). Termina cada paso con un **✅ Checkpoint** que diga exactamente qué comando correr y qué debo ver.
- **Yo corro los comandos importantes.** Los comandos que levantan cosas o tocan la base de datos (`docker compose up`, `prisma migrate`, `npm run seed`, el simulador) dímelos para que los corra yo, salvo que te pida hacerlo tú.
- **Conceptos nuevos de backend o React Native:** cuando aparezca uno (middleware, ORM, migración, FlatList, Metro…), explícalo en un párrafo corto con una analogía de frontend/React que yo ya conozca.
- **Al cerrar cada paso**, agrega una nota en `docs/guia/NN-titulo.md` con: objetivo, qué se hizo, conceptos clave, comandos, errores comunes y un **🧠 Reto** pequeño para que yo lo resuelva solo.
- **Un commit por paso**, con Conventional Commits (`feat(api): ...`, `chore(mobile): ...`, `docs(guia): ...`). Propón el mensaje y espera a que yo diga que sí antes de hacer commit.
- Escríbeme en español. El código, los nombres de variables y los commits van en inglés; los textos que ve el usuario de la app, en español.
- Si algo no está claro o hay que decidir algo que cuesta deshacer, pregúntame antes.

## Stack (decidido)

| Capa | Tecnología | Por qué |
|---|---|---|
| App móvil | **React Native CLI** + TypeScript (no Expo). **Por ahora solo iOS** | Cristian quiere dominar el tooling nativo (Xcode, Metro y, más adelante, Gradle) para entrevistas en empresas grandes. Android se pospone porque el MacBook (M2, 8 GB) no aguanta bien Android Studio |
| Navegación | React Navigation (native stack + bottom tabs) | Estándar de la industria |
| Datos remotos | TanStack Query | Caché, reintentos y paginación sin reinventar |
| API | Node 22 (fnm), **Express**, TypeScript | Lo pedido; el más común en ofertas |
| Base de datos | **PostgreSQL** | Datos relacionales (rutinas → ejercicios → series); los PRs y el volumen salen de consultas SQL |
| ORM | **Prisma** | Esquema legible, migraciones, muy pedido en ofertas |
| Validación | **Zod** | Valida query params y bodies; los tipos se infieren del esquema |
| Tests | Vitest + Supertest (API), Jest + React Native Testing Library (app) | |
| Base de datos local | Docker Compose (`postgres:16`) sobre **Colima** (no Docker Desktop, para ahorrar RAM) | La de producción irá en Neon |
| Calidad | ESLint + Prettier, `strict: true` en tsconfig | |

**No usar:** Expo, MongoDB/Mongoose, JavaScript sin tipos, colores escritos a mano en componentes.

## Estructura del repo

```
spartia/
├── apps/
│   ├── api/          # Node + Express + Prisma
│   └── mobile/       # React Native CLI
├── design/           # Sistema de diseño (pantallas PNG/HTML, tokens). Ver design/README.md
├── docs/
│   ├── PLAN.md       # Roadmap oficial con checkboxes
│   ├── decisiones/   # ADR (registros de decisiones de arquitectura)
│   └── guia/         # La guía paso a paso que vamos escribiendo
├── CLAUDE.md
└── README.md         # Portada del portafolio
```

Por ahora `api` y `mobile` son proyectos independientes, cada uno con su `package.json`. Más adelante, en una lección aparte, se agrega un paquete `packages/shared` con los tipos y esquemas Zod compartidos.

## Arquitectura del API (por capas)

```
apps/api/src/
├── app.ts                # crea la app de Express (sin listen) → testeable con Supertest
├── server.ts             # lee config y hace listen
├── config/env.ts         # variables de entorno validadas con Zod
├── lib/prisma.ts         # una sola instancia de PrismaClient (desde el Módulo 3; antes, el repository usa un array y luego `pg`)
├── middlewares/          # errorHandler, notFound, validate(schema)
├── modules/
│   └── exercises/
│       ├── exercise.routes.ts      # rutas → controller
│       ├── exercise.controller.ts  # HTTP: lee req, responde res. Sin lógica de negocio
│       ├── exercise.service.ts     # reglas de negocio
│       ├── exercise.repository.ts  # único lugar que habla con Prisma
│       ├── exercise.schemas.ts     # Zod: query params y DTOs
│       └── exercise.test.ts
└── utils/
```

Convenciones:
- Respuesta de listas: `{ "data": [...], "meta": { "page", "pageSize", "total", "totalPages" } }`.
- Errores: `{ "error": { "code": "NOT_FOUND", "message": "..." } }` con el código HTTP correcto, siempre desde el `errorHandler` central.
- Todas las rutas bajo `/api/v1`. Hay `GET /health` para revisar que el servidor está vivo.
- El controller nunca importa Prisma; el repository nunca conoce `req`/`res`.

## Datos de ejercicios

Decisión completa en `docs/decisiones/0001-fuente-de-ejercicios.md`. **Nuestra tabla es la fuente de verdad**; el dataset externo solo sirve para la carga inicial.

Origen: **free-exercise-db** (github.com/yuhonas/free-exercise-db), unos 876 ejercicios, licencia **Unlicense**.
- JSON completo: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`
- Campos: `id` (slug, p. ej. `3_4_Sit-Up`), `name`, `force`, `level`, `mechanic`, `equipment`, `primaryMuscles[]`, `secondaryMuscles[]`, `instructions[]`, `category`, `images[]`.
- `force`, `mechanic` y `equipment` pueden venir en `null`.
- **No usar las imágenes del dataset.** Su origen no está claro (el mantenedor lo reconoce en el issue #2) y la app se va a monetizar. El API devuelve `imageUrls: []` y la app muestra un marcador. Las imágenes licenciadas vendrán después.
- Los datos se **copian a nuestra base** con un script idempotente (`upsert` por `slug`), no se consultan en vivo.
- Guarda `slug` (el `id` original) y `source`: `"free-exercise-db"` para los importados y `"spartia"` para los creados por nosotros (`POST`).

## App móvil

- Tema: `apps/mobile/src/theme/` generado desde `design/tokens.json` (colores claro/oscuro, espaciado, radios, tipografía Inter). Soporta tema oscuro con `useColorScheme()`.
- **Antes de construir una pantalla, abre `design/screens/<Pantalla>.png` (y `.dark.png`), lee su `.md` y, si necesitas medidas, el `.html` con `design/components.css`.** El resultado debe parecerse lo más posible a esas imágenes.
- Arquitectura: se define en el paso 4.0 (`docs/PLAN-MOBILE.md`) con clean architecture por features (`domain/`, `data/`, `presentation/`) y `core/` + `ui/` compartidos. **No escribas código móvil antes de ese plan.**
- Simulador: iPhone 16 con iOS 18.6 (es el único runtime instalado; no instales otros sin preguntar, porque el disco está justo).
- URL del API en desarrollo: iOS simulator → `http://localhost:3000`, teléfono físico → la IP de la computadora en la red local. (Android, cuando llegue: `http://10.0.2.2:3000`.)
- Listas largas con `FlatList` (con `keyExtractor`, `onEndReached` para paginar e imágenes con tamaño fijo).

## Comandos (se van completando)

```bash
# Docker (Colima)
colima start --cpu 2 --memory 2
colima stop                 # al terminar, para liberar RAM

# API
cd apps/api
docker compose up -d        # Postgres local
npx prisma migrate dev      # aplicar migraciones
npm run seed                # cargar ejercicios
npm run dev                 # http://localhost:3000
npm test

# Mobile
cd apps/mobile
npm start                   # Metro
npm run ios                 # (Android pospuesto)
```
