# 03 · ESLint + Prettier

## Goal

Automate code quality: Prettier for formatting, ESLint (with type information) to catch bugs, a single `check` command, and VS Code fixing things on save.

## What we did

- **Prettier** with `.prettierrc.json`: `{ "singleQuote": true, "semi": false }`.
- **Downgraded TypeScript 7 → 6.0** (`typescript@~6.0`), because `typescript-eslint` doesn't support TS 7 yet.
- **ESLint** (flat config in `eslint.config.js`): `@eslint/js` recommended + `typescript-eslint` `recommendedTypeChecked` + `eslint-config-prettier` last.
- Scripts: `format`, `format:check`, `lint`, and `check` (typecheck → lint → format:check).
- `.vscode/settings.json` (format on save, ESLint fix on save, `eslint.workingDirectories`) and `.vscode/extensions.json`.

## Key concepts

- **Prettier vs ESLint:** Prettier decides *how the code looks*; ESLint decides *whether the code has problems*. `eslint-config-prettier` turns off the ESLint rules that would fight with Prettier, so each tool owns its job.
- **Flat config:** `eslint.config.js` exports an array of configs applied **in order**, so later ones override earlier ones. That's why `prettier` goes last.
- **Type-checked linting:** `recommendedTypeChecked` asks TypeScript for the real types, which unlocks rules like `no-floating-promises` (a forgotten `await`). This will matter a lot once we talk to a database.
- **Peer dependencies:** a package can declare which versions of another package it works with. `typescript-eslint` says `typescript >=4.8.4 <6.1.0`, so npm refuses to install it next to TS 7. New major versions take a while for the ecosystem to catch up.
- **`~` vs `^` in versions:** `~6.0` accepts `6.0.x` patches only; `^6.0` would accept `6.x`.
- **`--check` vs `--write`:** CI only *checks* (`format:check`); your machine *writes* (`format`).
- **Semicolon-free code:** safe thanks to JavaScript's Automatic Semicolon Insertion. When a line starts with `(` or `[`, Prettier adds a leading `;` for you.

## Commands

```bash
npm run format          # apply Prettier to every file
npm run format:check    # only report unformatted files (CI)
npm run lint            # ESLint
npm run check           # typecheck + lint + format:check, stops at the first failure
```

## Common errors

- **`ERESOLVE … peer typescript@">=4.8.4 <6.1.0"`:** your TypeScript is too new for `typescript-eslint`. Use `typescript@~6.0`.
- **`… was not found by the project service`:** ESLint tried to type-check a file that isn't in `tsconfig.json` (like `eslint.config.js` itself). Ignore it or add it to `allowDefaultProject`.
- **Save doesn't format:** the file is open from a folder ESLint/Prettier don't know about, or another formatter wins. Check `editor.defaultFormatter` and run *Developer: Reload Window*.

## 🧠 Challenge

1. Turn on the `@typescript-eslint/explicit-function-return-type` rule only for files in `src/` and see where it complains. Would you keep it? Why or why not?
2. Write an `async` function that returns a promise and call it without `await`. Read the `no-floating-promises` error. What are the three ways to fix it?
