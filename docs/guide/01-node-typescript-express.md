# 01 · Node + TypeScript + Express: the first server

## Goal

Create `apps/api` from scratch, run TypeScript on Node, and start an HTTP server with `GET /health` that responds `{ "status": "ok" }`.

## What we did

- `npm init -y`, `.node-version` set to `22`, `"type": "module"` and `"private": true`.
- Dev tools: `typescript`, `tsx`, `@types/node@22`, `@types/express`.
- Production dependency: `express`.
- `tsconfig.json` written by hand (`NodeNext`, `strict`, `noUncheckedIndexedAccess`).
- Scripts: `dev` (tsx watch), `build` (tsc), `start` (node dist), `typecheck` (tsc --noEmit).
- `src/index.ts`: an Express app with `GET /health` listening on port 3000.

## Key concepts

- **`dependencies` vs `devDependencies`:** the first are needed to *run* in production (`express`); the second only to *develop or compile* (`typescript`, `tsx`, `@types/*`).
- **tsx vs tsc:** `tsx` runs TS on the fly and **does not type-check**, it just strips the types (like Vite in dev). `tsc` compiles and does check types (like `vite build`). That's why `typecheck` is a separate step and runs in CI.
- **ES Modules in Node:** with `"type": "module"` and `NodeNext`, relative imports need `.js` even when the file is `.ts` (`./app.js`): you write the path that will exist after compiling.
- **`@types/node` must match your Node version:** otherwise TS lets you use APIs your runtime doesn't have.
- **HTTP server:** in React you call `fetch` and wait; here you're on the other side. `app.get(path, (req, res) => …)` is like a React Router route whose "component" builds the response.
- **Port:** `localhost` is the building and `3000` is the door. `listen` keeps the process alive waiting for requests.
- **Overloads:** `app.listen("3000")` compiles because TS picks the `listen(path: string)` signature (a file socket), not the port one. It works by accident. Always use a `number`.
- **`_req`:** the underscore means a parameter is unused on purpose.

## Commands

```bash
npm run dev                       # server with reload on save
npm run typecheck                 # check types
npm run build && npm start        # compile and run like production
curl localhost:3000/health        # {"status":"ok"}
curl -i localhost:3000/health     # + status and headers (HTTP/1.1 200 OK, Content-Type)
npm ls @types/node                # show the installed version of a package
```

## Common errors

- **`"module" is not valid JSON` with `npm pkg set … --json`:** `--json` applies to every value in the command. Split text values from booleans.
- **`EACCES: permission denied, mkdir '/Users/…/node_modules'`:** you're outside the project and npm walked up the folders until it found another `package.json`. Check with `pwd`. **Never use `sudo npm install`.**
- **`EADDRINUSE: address already in use :::3000`:** another process (usually an old server in another terminal) is using the port. Stop it with `Ctrl+C`.
- **`curl localhost:3000/other-route` returns HTML:** that's Express's default 404. We replace it with JSON in step 1.7.

## 🧠 Challenge

1. Add `GET /` that responds `{ name: "Spartia API", version: "1.0.0" }`.
2. Make `version` come from `package.json` instead of hard-coding it. *(Hint: look up "import attributes" `with { type: "json" }` in Node 22, and why TypeScript will ask for `resolveJsonModule`.)*
3. What status code does `curl -i -X POST localhost:3000/health` return? Why isn't it 200?
