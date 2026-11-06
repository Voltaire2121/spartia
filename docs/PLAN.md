# Plan oficial de Spartia

> **Estado actual:** Módulo 1, paso 1.3 (`app.ts`/`server.ts` y `env.ts` con Zod)
> **Última actualización:** 2026-11-06

Este archivo es el roadmap del proyecto. Cada paso es pequeño, se puede verificar y termina en un commit. Al cerrar un paso se marca con `[x]`, el hash corto del commit y el enlace a su nota de la guía. Los cambios al plan se hacen con commits `docs(plan): ...`.

## Decisiones

1. **Datos de ejercicios: base propia.** Nuestra tabla es la fuente de verdad. De free-exercise-db se importan **solo textos**; las imágenes no se usan (ver la investigación abajo). Se pueden crear ejercicios propios (`source = "spartia"`).
2. **Ruta de aprendizaje del backend:** array en memoria → PostgreSQL con SQL a mano → Prisma.
3. **Quién escribe qué:** el backend lo escribe Cristian (Claude guía y revisa); la app móvil la escribe Claude y explica lo nuevo de React Native.
4. **Plataforma:** solo iOS por ahora (simulador iPhone 16 con iOS 18.6). Android queda como módulo futuro.

## Cómo trabajamos cada paso del backend

1. **Explicación** corta: qué construimos y por qué, con una analogía de frontend.
2. **Instrucciones:** qué archivo crear y qué debe hacer, con fragmentos cortos solo para la sintaxis nueva (nunca el archivo completo).
3. **Cristian lo escribe.** Si se atasca, pide pistas progresivas.
4. **✅ Checkpoint:** un comando (curl, test, psql) y el resultado esperado.
5. **Revisión** del `git diff`: bugs, buenas prácticas y por qué.
6. **Nota de la guía** en `docs/guia/NN-titulo.md`, con un 🧠 Reto.
7. **Commit** con Conventional Commits, aprobado por Cristian.

---

## Módulo 0 · Preparación

- [x] **0.1** Entorno solo para iOS: Node 22 (fnm), Watchman, Docker vía Colima, Xcode 26.6, CocoaPods. Se borró el runtime de iOS 26.5 para liberar espacio. ([guía](guia/00-entorno-y-repo.md))
- [x] **0.2** `git init`, `.gitignore`, `README.md` inicial y este `docs/PLAN.md` (`1b9dd9e`)
- [x] **0.3** ADR [`0001-fuente-de-ejercicios`](decisiones/0001-fuente-de-ejercicios.md) y actualizar `CLAUDE.md` (nuevo modo de trabajo, solo iOS, sin imágenes del dataset) ([guía](guia/00-entorno-y-repo.md))

## Módulo 1 · Node + Express con datos en memoria

Objetivo: entender HTTP, Express, validación, paginación y capas sin base de datos de por medio.

- [x] **1.1** `apps/api`: `npm init`, TypeScript `strict` y `tsx`. `src/index.ts` imprime "hola". ✅ `npm run dev` imprime "hola" ([guía](guia/01-node-typescript-express.md))
- [x] **1.2** Primer servidor Express con `GET /health`. ✅ `curl localhost:3000/health` → `{"status":"ok"}` ([guía](guia/01-node-typescript-express.md))
- [ ] **1.3** Separar `app.ts` de `server.ts`; `config/env.ts` con Zod (`PORT`). ✅ Con un `PORT` inválido no arranca y explica por qué
- [ ] **1.4** ESLint + Prettier. ✅ `npm run lint` pasa
- [ ] **1.5** `scripts/download-exercises.ts`: descarga el JSON con `fetch` y guarda 20 ejercicios en `src/data/exercises.sample.json`. ✅ El archivo existe con 20 ejercicios
- [ ] **1.6** `GET /api/v1/exercises` devuelve la muestra. ✅ curl devuelve los 20
- [ ] **1.7** `GET /api/v1/exercises/:id`, `AppError`, `notFound` y `errorHandler`. ✅ Un id inexistente → 404 `{ error: { code, message } }`
- [ ] **1.8** Filtros `?search`, `?muscle`, `?equipment` leyendo `req.query` a mano. ✅ `?search=curl` filtra
- [ ] **1.9** Validación con Zod y middleware `validate(schema)`. ✅ `?pageSize=abc` → 400
- [ ] **1.10** Paginación `page`/`pageSize` (máximo 100) con respuesta `{ data, meta }`. ✅ `?page=2&pageSize=5` con `meta` correcto
- [ ] **1.11** Refactor por capas: routes → controller → service → repository. ✅ Todo responde igual que antes
- [ ] **1.12** Tests con Vitest + Supertest (lista, filtro, 400, 404). ✅ `npm test` en verde
- [ ] **1.13** `POST /api/v1/exercises` (`source: "spartia"`). ✅ Se crea, se lista y, al reiniciar el servidor, desaparece

## Módulo 2 · PostgreSQL con SQL a mano

Objetivo: entender una base de datos relacional y hablarle sin ORM.

- [ ] **2.1** `docker-compose.yml` con `postgres:16` y `.env.example`. ✅ Entrar con `psql`
- [ ] **2.2** `sql/001_init.sql`: `CREATE TABLE exercise`, `INSERT`, `SELECT`, `WHERE`, `ILIKE`, `= ANY(array)`, `ORDER BY`, `LIMIT/OFFSET`, `COUNT`. Arrays frente a una tabla `Muscle`
- [ ] **2.3** Conectar con `pg` (Pool); `findById` en SQL; consultas parametrizadas y SQL injection
- [ ] **2.4** Importación idempotente con `INSERT … ON CONFLICT (slug) DO UPDATE`, solo textos. ✅ Correrla dos veces deja el mismo `COUNT`
- [ ] **2.5** Filtros y paginación en SQL con `WHERE` dinámico seguro. ✅ Tests contra `spartia_test`
- [ ] **2.6** `POST` con `INSERT … RETURNING`. ✅ Sobrevive al reinicio
- [ ] **2.7** Índices (btree en `name`, GIN en `primary_muscles`) con `EXPLAIN ANALYZE` antes y después

## Módulo 3 · Prisma

Objetivo: ver qué hace un ORM por ti (y qué no) después de haber hecho el trabajo a mano.

- [ ] **3.1** `prisma init`, modelo `Exercise` e índices, `prisma migrate dev --name init`. Comparar con `001_init.sql`
- [ ] **3.2** Repository con Prisma; controller y service no cambian
- [ ] **3.3** `prisma/seed.ts` con `upsert` por `slug`. ✅ `npm run seed` dos veces deja el mismo conteo
- [ ] **3.4** Logs de queries de Prisma: ver el SQL que genera
- [ ] **3.5** Limpieza: quitar `pg` y el SQL manual, README del API y tests en verde

## Módulo 4 · App móvil iOS (Claude escribe y explica)

- [ ] **4.0** **Plan oficial de frontend** en `docs/PLAN-MOBILE.md` + ADR `0002-arquitectura-mobile.md`: clean architecture por features (`domain/`, `data/`, `presentation/`), regla de dependencias `presentation → domain ← data` aplicada con ESLint, `core/` y `ui/` compartidos, estado, testing por capa, alias de rutas y CI con GitHub Actions. *Los pasos 4.1–4.4 se reescriben según este plan.*
- [ ] **4.1** `init` de React Native CLI (confirmar el bundle id `app.spartia.mobile` y el nombre "Spartia"), `pod install`. ✅ La app de bienvenida corre en el simulador
- [ ] **4.2** Tema desde `design/tokens.json`, fuente Inter, `ThemeProvider`, `AppText` y `Screen`. ✅ Cambia con el modo oscuro
- [ ] **4.3** React Navigation, TanStack Query, cliente HTTP (`http://localhost:3000`) y `useExercises` con `useInfiniteQuery`
- [ ] **4.4** `ExerciseListScreen` (scroll infinito, búsqueda con debounce de 300 ms, estados de carga, error y lista vacía) y `ExerciseRow` con miniatura marcador de 52×52. ✅ Scroll hasta el último ejercicio; "curl" filtra

## Cierre de la primera etapa

- [ ] README del repo (qué es, stack, cómo correrlo, licencia de datos) y resumen de lo aprendido
- [ ] Siguiente etapa (backend escrito por Cristian): rutinas y superseries, asignación semanal, sesiones y series, PRs y volumen

## Ideas futuras

- Android: Gradle, emulador y `10.0.2.2`
- `packages/shared` con tipos y esquemas Zod compartidos
- Tabla `Muscle` en lugar de arrays
- Nombres de ejercicios en español (`nameEs` o traducciones)
- Imágenes licenciadas (wger CC-BY-SA, un proveedor de pago o fotos propias)
- Deploy: base de datos en Neon y API en la nube

---

## Investigación: fuente de datos (2026-11-06)

| Pregunta | Respuesta |
|---|---|
| ¿Hay que pagar? | No. Es un JSON público en GitHub. |
| Licencia | Unlicense (dominio público). Es un fork de `wrkout/exercises.json`, con la misma licencia. |
| ¿Se puede monetizar? | Los textos sí. Las imágenes no son seguras: el mantenedor escribió *"I actually have no idea where the images are from or if they are royalty free so usage would be at your own risk"* ([issue #2](https://github.com/yuhonas/free-exercise-db/issues/2)), y en el [issue #13](https://github.com/yuhonas/free-exercise-db/issues/13) hay reportes de que parecen sacadas de ExRx.net. |
| ¿Se puede ampliar? | Sí. Los datos se copian a nuestra base y la columna `source` distingue el origen. |
| Alternativas | wger (CC-BY-SA, con textos en español), proveedores de pago (wrkout.xyz, ExerciseDB) o fotos propias. |
