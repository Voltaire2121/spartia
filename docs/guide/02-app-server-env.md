# 02 · `app.ts` + `server.ts` and environment variables with Zod

## Goal

Separate configuring the app from starting it, and move the port out of the code by reading it from environment variables validated with Zod.

## What we did

- `src/app.ts`: creates and **exports** the Express app with its routes. **No `listen`.**
- `src/server.ts`: imports `app` and `env` and calls `listen(env.PORT)`.
- `src/config/env.ts`: Zod schema for `NODE_ENV` and `PORT`, validated with `safeParse`, and `process.exit(1)` if anything is wrong.
- `.env.example` (committed) and `.env` (not committed).
- `dev` and `start` scripts use `--env-file-if-exists=.env`, which is built into Node 22, so there's no need for `dotenv`.

```
src/
├── app.ts          ← WHAT the app does (routes)  ~ App.tsx
├── server.ts       ← TURNS IT ON (listen)        ~ main.tsx
└── config/env.ts   ← validated configuration
```

## Key concepts

- **Why split `app` from `server`:** tests (step 1.12) will import `app` and send requests with Supertest **without opening a port**. If `listen` lived in the same file, every test would start a real server.
- **Environment variables:** configuration that changes depending on where the app runs, without touching the code. Like `import.meta.env.VITE_*` in Vite. In Node they live in `process.env` and are **always `string | undefined`**.
- **Zod vs TS types:** types disappear when compiling; Zod **checks real data at runtime**. That's why `zod` goes in `dependencies`.
- **`z.coerce.number()`:** turns `"3000"` → `3000` before validating. `"abc"` → `NaN` → error.
- **`safeParse` vs `parse`:** `parse` throws; `safeParse` returns `{ success, data | error }` and you decide what to do.
- **Inferred types:** `env` is typed `{ NODE_ENV: …; PORT: number }` without writing any `interface`. If you need the type by name: `z.infer<typeof envSchema>`.
- **Fail fast:** if the config is invalid, the server doesn't start and says why. `process.exit(1)` ends the process with an error code (0 = ok, anything else = failed).
- **Precedence:** a variable set in the terminal (`PORT=4000 npm run dev`) wins over the one in `.env`.
- **`.env.example`:** documents *every* variable with safe development values. Never real secrets.

## Commands

```bash
npm run dev                  # starts with .env
PORT=4000 npm run dev        # override a variable for this run only
PORT=abc npm run dev         # fail fast: ❌ Invalid env variables … → at PORT
echo $?                      # exit code of the last command (1 = error)
```

## Common errors

- **`Relative import paths need explicit file extensions`:** the `.js` is missing in an ESM import (`./app.js`, not `./app`).
- **I wrote the code and nothing changes:** the file isn't saved. There's a ● dot on the tab. Turn on *File → Auto Save*.
- **I changed `.env` and nothing happens:** `tsx watch` only watches `.ts` files. Restart with `Ctrl+C` and `npm run dev`.

## 🧠 Challenge

1. Add a `LOG_LEVEL` variable to `env.ts` that only accepts `"debug" | "info" | "warn" | "error"`, defaulting to `"info"`. Add it to `.env.example` too.
2. Try `LOG_LEVEL=verbose npm run dev`. What message does Zod give you?
3. Something to think about: why is it **not** a good idea to read `process.env.PORT` directly in `server.ts` and validate it right there? *(Hint: think about 10 variables used in 8 different files.)*
