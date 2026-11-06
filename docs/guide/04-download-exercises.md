# 04 · Download and validate a sample of exercises

## Goal

Write a one-off Node script that downloads the free-exercise-db JSON, validates it with Zod, and saves 20 exercises to `src/data/exercises.sample.json`, the data our API will serve in step 1.6.

## What we did

- `src/scripts/download-exercises.ts`, run with `npm run download:exercises` (`tsx`, no watch).
- `fetch` with top-level `await` and a check on `response.ok`.
- A Zod schema for one exercise, applied to the whole list with `z.array(schema).parse(data)`.
- `slice(0, 20)` and `writeFile` with `JSON.stringify(sample, null, 2)`.
- `.prettierignore` with `src/data/`, so generated files are never reformatted.
- [ADR 0002](../decisions/0002-use-dataset-images-for-mvp.md): the MVP keeps the dataset `images` paths.

## Key concepts

- **Scripts vs API:** downloading data is a separate one-off job. The API never calls third parties at runtime (ADR 0001).
- **`fetch` in Node:** built in since Node 18, the same API as the browser.
- **Top-level `await`:** works in ES Modules, outside any `async` function.
- **`unknown` vs `any`:** `response.json()` returns `any`, which turns TypeScript off. Typing it as `unknown` forces you to check the data before using it. Use `unknown` for **all external data**.
- **Narrowing limits:** `Array.isArray(data)` turns `unknown` into `any[]`. It proves it's an array but says nothing about the items. Zod checks every item.
- **Zod strips unknown keys:** `z.object()` drops fields that aren't in the schema, so extra fields never leak in.
- **`parse` vs `safeParse`:** in a script, crashing with a clear error (`parse`) is what we want; in `env.ts` we used `safeParse` to print a custom message.
- **`node:` imports:** `node:fs/promises` is a Node built-in, not an npm package.
- **Paths relative to the file:** `new URL('../data/x.json', import.meta.url)` always points to the same place. A plain `'src/data/x.json'` depends on the folder you ran the command from (`cwd`).
- **Deterministic output:** running the script twice gives the exact same file, so git shows no fake changes.
- **Honest logs:** a log that says "received 20" when 876 arrived will mislead you when debugging.
- **Committing the sample:** the API and the tests need it, so it lives in git. It's small and stable. The full dataset goes into the database in Module 2.

## Commands

```bash
npm run download:exercises           # download, validate and save the sample
head -20 src/data/exercises.sample.json
git diff --stat src/data             # nothing after a second run = deterministic
```

## Common errors

- **`ZodError … expected string, received null`:** a field that can be `null` is missing `.nullable()` (`force`, `mechanic`, `equipment`).
- **The file lands in a weird folder:** you used a `cwd`-relative path. Use `import.meta.url`.
- **`format:check` fails on the JSON file:** Prettier formats arrays differently from `JSON.stringify`. Generated files go in `.prettierignore`.
- **`fetch failed` / `ENOTFOUND`:** no internet connection, or a typo in the URL.

## 🧠 Challenge

1. Make the sample size configurable: `npm run download:exercises -- 50` saves 50 exercises. *(Hint: `process.argv`, and validate it with `z.coerce.number().int().positive()`.)*
2. Replace `z.string()` in `level` with `z.enum([...])`. You'll find the three possible values in the data. What happens if the dataset adds a fourth one someday? Is that good or bad?
3. Log how many exercises have `equipment: null`. *(Hint: `filter`.)*
