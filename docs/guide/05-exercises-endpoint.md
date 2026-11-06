# 05 · `GET /api/v1/exercises`: the first data endpoint

## Goal

Serve the 20-exercise sample from a versioned endpoint, with the API turning stored image paths into full `imageUrls`.

## What we did

- `src/modules/exercises/exercise.routes.ts`: an Express `Router` with `GET /` that responds `{ data }`.
- `app.ts` mounts it: `app.use('/api/v1/exercises', exercisesRouter)`.
- `tsconfig.json`: `"resolveJsonModule": true`, and the sample is imported with `with { type: 'json' }`.
- `env.ts`: `IMAGE_BASE_URL` validated with `z.url()`, with a default and documented in `.env.example`.
- Each exercise is mapped to drop `images` and add `imageUrls` built with `new URL(path, base)`.

```
GET /api/v1/exercises
   │
app.ts   → path starts with /api/v1/exercises → exercisesRouter (prefix removed)
router   → '/' → map exercises → res.json({ data })
```

## Key concepts

- **Router:** a mini-app that groups a feature's routes, like nested routes in React Router. The router doesn't know its prefix; `app.ts` decides where it's mounted.
- **`app.use(prefix, router)`:** sends every request whose path *starts with* the prefix to the router.
- **API versioning (`/v1`):** mobile users don't update for months. Breaking changes go to `/v2` while `/v1` keeps old app versions working.
- **`{ data: [...] }` instead of a bare array:** you can add fields later (`meta` in step 1.10) without breaking clients.
- **Breaking change:** any change that makes an existing client fail (renaming or removing a field, changing a type). Adding a field is not breaking.
- **JSON imports:** `resolveJsonModule` lets TypeScript read `.json` files and infer their types; the import attribute `with { type: 'json' }` is required by Node. `tsc` copies the JSON into `dist/`.
- **The API builds URLs, not the app:** the base URL is server config, so changing image providers (ADR 0002) doesn't require a new app release.
- **Destructuring with rest:** `({ images, ...exercise })` pulls one field out and keeps the rest, so the response never exposes how images are stored.
- **`new URL(path, base)` and the trailing slash:** `…/exercises/` + `a.jpg` → `…/exercises/a.jpg`; without the slash, `exercises` is treated as a file name and replaced → `…/a.jpg`.
- **`jq`:** `.map()`/`.filter()` for JSON in the terminal; preinstalled on macOS.

## Commands

```bash
curl -s localhost:3000/api/v1/exercises | jq                         # pretty-print
curl -s localhost:3000/api/v1/exercises | jq '.data | length'        # 20
curl -s localhost:3000/api/v1/exercises | jq '.data[0]'              # first exercise
curl -s localhost:3000/api/v1/exercises | jq '.data[].name'          # names only
curl -s localhost:3000/api/v1/exercises | jq '.data[] | { name, image: .imageUrls[0] }'
```

## Common errors

- **`Cannot find module '…json'. Consider using '--resolveJsonModule'`:** add `"resolveJsonModule": true` to `tsconfig.json` and restart the server.
- **`needs an import attribute of "type: json"`:** add `with { type: 'json' }` to the import.
- **The route is defined but returns Express's 404:** it was added with `app.get` in the wrong place, or the router isn't mounted with `app.use`. Remember the router only sees the path *after* the prefix (`'/'`, not `'/api/v1/exercises'`).
- **Image URLs are missing `/exercises/`:** the base URL has no trailing slash.
- **I changed `tsconfig.json` and nothing happens:** `tsx watch` doesn't watch it. Restart the server.

## 🧠 Challenge

1. Make `env.ts` reject an `IMAGE_BASE_URL` without a trailing slash, failing fast at startup. *(Hint: `.endsWith('/')`.)*
2. The `.map()` runs on **every request**, even though the result never changes. Move it outside the route so it runs once at startup. Is there any downside?
3. Add `?fields=name` support so `curl …/exercises?fields=name` returns only `{ id, name }` per exercise. (We'll do proper query params in steps 1.8–1.9; this is a warm-up.)
