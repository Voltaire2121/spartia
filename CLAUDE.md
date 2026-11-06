# Spartia Workout Tracker — contexto para Claude Code

## Qué es este proyecto

Spartia es una app móvil para registrar entrenamientos de gimnasio. El usuario:

1. crea rutinas (con superseries de 2 o más ejercicios),
2. las asigna a los días de la semana,
3. las ejecuta serie por serie viendo lo que hizo la vez anterior,
4. ve un resumen con sus avances y PRs, y el progreso de la semana.

Es el **proyecto principal del portafolio de Cristian** en GitHub. Cristian es frontend developer (React, TypeScript, Vite) y con este proyecto aprende **React Native y backend con Node**. El repo tiene que verse profesional: arquitectura por capas, tipado estricto, tests, commits limpios y un README que explique las decisiones.

## Cómo trabajar conmigo: modo guía

Este repo es también un curso. Al trabajar:

- **Explica antes de hacer.** Al inicio de cada paso di en 2–4 frases qué vamos a construir y por qué se hace así (la decisión de arquitectura, la alternativa que descartamos).
- **Pasos pequeños y verificables.** Un paso = algo que puedo correr y ver funcionar (un comando, un endpoint con curl, una pantalla en el emulador). Termina cada paso con un **✅ Checkpoint** que diga exactamente qué comando correr y qué debo ver.
- **Yo corro los comandos importantes.** Los comandos que levantan cosas o tocan la base de datos (`docker compose up`, `prisma migrate`, `npm run seed`, el emulador) dímelos para que los corra yo, salvo que te pida hacerlo tú.
- **Conceptos nuevos de backend o React Native:** cuando aparezca uno (middleware, ORM, migración, FlatList, Metro…), explícalo en un párrafo corto con una analogía de frontend/React que yo ya conozca.
- **Al cerrar cada paso**, agrega una nota en `docs/guia/NN-titulo.md` con: objetivo, qué se hizo, conceptos clave, comandos, errores comunes y un **🧠 Reto** pequeño para que yo lo resuelva solo.
- **Un commit por paso**, con Conventional Commits (`feat(api): ...`, `chore(mobile): ...`, `docs(guia): ...`). Propón el mensaje y espera a que yo diga que sí antes de hacer commit.
- Escríbeme en español. El código, los nombres de variables y los commits van en inglés; los textos que ve el usuario de la app, en español.
- Si algo no está claro o hay que decidir algo que cuesta deshacer, pregúntame antes.

## Stack (decidido)

| Capa | Tecnología | Por qué |
|---|---|---|
| App móvil | **React Native CLI** + TypeScript (no Expo) | Cristian quiere dominar el tooling nativo (Gradle, Xcode, Metro) para entrevistas en empresas grandes |
| Navegación | React Navigation (native stack + bottom tabs) | Estándar de la industria |
| Datos remotos | TanStack Query | Caché, reintentos y paginación sin reinventar |
| API | Node 20+, **Express**, TypeScript | Lo pedido; el más común en ofertas |
| Base de datos | **PostgreSQL** | Datos relacionales (rutinas → ejercicios → series); los PRs y el volumen salen de consultas SQL |
| ORM | **Prisma** | Esquema legible, migraciones, muy pedido en ofertas |
| Validación | **Zod** | Valida query params y bodies; los tipos se infieren del esquema |
| Tests | Vitest + Supertest (API), Jest + React Native Testing Library (app) | |
| Base de datos local | Docker Compose (`postgres:16`) | La de producción irá en Neon |
| Calidad | ESLint + Prettier, `strict: true` en tsconfig | |

**No usar:** Expo, MongoDB/Mongoose, JavaScript sin tipos, colores escritos a mano en componentes.

## Estructura del repo

```
spartia/
├── apps/
│   ├── api/          # Node + Express + Prisma
│   └── mobile/       # React Native CLI
├── design/           # Sistema de diseño (pantallas PNG/HTML, tokens). Ver design/README.md
├── docs/guia/        # La guía paso a paso que vamos escribiendo
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
├── lib/prisma.ts         # una sola instancia de PrismaClient
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

Origen: **free-exercise-db** (github.com/yuhonas/free-exercise-db), 876 ejercicios.
- JSON completo: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`
- Campos: `id` (slug, p. ej. `3_4_Sit-Up`), `name`, `force`, `level`, `mechanic`, `equipment`, `primaryMuscles[]`, `secondaryMuscles[]`, `instructions[]`, `category`, `images[]`.
- Imágenes: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<images[i]>` (2 jpg por ejercicio).
- `force`, `mechanic` y `equipment` pueden venir en `null`.
- Antes de usarlo, revisa la licencia en el repo y anótala en el README. Lo entendemos como dominio público, pero hay que confirmarlo.
- Los datos se **copian a nuestra base** con un script de seed idempotente (`upsert` por `slug`), no se consultan en vivo. Así la API no depende de terceros y luego podemos cambiar a una base licenciada (con instrucciones en español) sin tocar la app.
- Guarda `slug` (el `id` original) y `source = "free-exercise-db"`. Las URLs de las imágenes las arma el API, no la app.

## App móvil

- Tema: `apps/mobile/src/theme/` generado desde `design/tokens.json` (colores claro/oscuro, espaciado, radios, tipografía Inter). Soporta tema oscuro con `useColorScheme()`.
- **Antes de construir una pantalla, abre `design/screens/<Pantalla>.png` (y `.dark.png`), lee su `.md` y, si necesitas medidas, el `.html` con `design/components.css`.** El resultado debe parecerse lo más posible a esas imágenes.
- Estructura sugerida: `src/api/` (cliente HTTP + hooks de TanStack Query), `src/features/<feature>/` (pantallas y componentes de cada funcionalidad), `src/components/` (Button, AppText, ExerciseRow…), `src/navigation/`, `src/theme/`.
- URL del API en desarrollo: Android emulator → `http://10.0.2.2:3000`, iOS simulator → `http://localhost:3000`, teléfono físico → la IP de la computadora en la red local.
- Listas largas con `FlatList` (con `keyExtractor`, `onEndReached` para paginar e imágenes con tamaño fijo).

## Comandos (se van completando)

```bash
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
npm run android             # o: npm run ios
```
