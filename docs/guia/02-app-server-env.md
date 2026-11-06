# 02 · `app.ts` + `server.ts` y variables de entorno con Zod

## Objetivo

Separar la configuración de la app de su arranque y sacar el puerto del código, leyéndolo de variables de entorno validadas con Zod.

## Qué se hizo

- `src/app.ts`: crea y **exporta** la app de Express con sus rutas. **Sin `listen`.**
- `src/server.ts`: importa `app` y `env` y hace `listen(env.PORT)`.
- `src/config/env.ts`: esquema de Zod para `NODE_ENV` y `PORT`, validación con `safeParse` y `process.exit(1)` si algo falla.
- `.env.example` (se sube a git) y `.env` (no se sube).
- Scripts `dev` y `start` con `--env-file-if-exists=.env`, que viene integrado en Node 22, sin `dotenv`.

```
src/
├── app.ts          ← QUÉ hace la app (rutas)   ~ App.tsx
├── server.ts       ← la ENCIENDE (listen)      ~ main.tsx
└── config/env.ts   ← configuración validada
```

## Conceptos clave

- **Por qué separar `app` de `server`:** los tests (paso 1.12) importarán `app` y le harán requests con Supertest **sin abrir un puerto**. Si `listen` estuviera en el mismo archivo, cada test levantaría un servidor real.
- **Variables de entorno:** configuración que cambia según dónde corre la app, sin tocar el código. Son como `import.meta.env.VITE_*` en Vite. En Node viven en `process.env` y **siempre son `string | undefined`**.
- **Zod vs tipos de TS:** los tipos desaparecen al compilar; Zod **revisa datos reales en ejecución**. Por eso `zod` va en `dependencies`.
- **`z.coerce.number()`:** convierte `"3000"` → `3000` antes de validar. `"abc"` → `NaN` → error.
- **`safeParse` vs `parse`:** `parse` lanza una excepción; `safeParse` devuelve `{ success, data | error }` y tú decides qué hacer.
- **Tipos inferidos:** `env` tiene tipo `{ NODE_ENV: …; PORT: number }` sin escribir ninguna `interface`. Si necesitas el tipo con nombre: `z.infer<typeof envSchema>`.
- **Fail fast:** si la configuración es inválida, el servidor no arranca y dice por qué. `process.exit(1)` termina el proceso con código de error (0 = bien, distinto de 0 = falló).
- **Prioridad:** una variable definida en la terminal (`PORT=4000 npm run dev`) gana sobre la del `.env`.
- **`.env.example`:** documenta *todas* las variables, con valores de desarrollo seguros. Nunca lleva secretos reales.

## Comandos

```bash
npm run dev                  # arranca con el .env
PORT=4000 npm run dev        # sobrescribe una variable solo para esta ejecución
PORT=abc npm run dev         # fail fast: ❌ Invalid env variables … → at PORT
echo $?                      # código de salida del último comando (1 = error)
```

## Errores comunes

- **`Relative import paths need explicit file extensions`:** en ESM falta el `.js` (`./app.js`, no `./app`).
- **Escribí el código y no cambia nada:** el archivo no está guardado. Hay un punto ● en la pestaña. Activa *File → Auto Save*.
- **Cambié el `.env` y no se aplica:** `tsx watch` solo vigila los archivos `.ts`. Reinicia con `Ctrl+C` y `npm run dev`.

## 🧠 Reto

1. Agrega a `env.ts` una variable `LOG_LEVEL` que solo acepte `"debug" | "info" | "warn" | "error"`, con default `"info"`. Agrégala también a `.env.example`.
2. Prueba `LOG_LEVEL=verbose npm run dev`. ¿Qué mensaje te da Zod?
3. Pregunta para pensar: ¿por qué **no** es buena idea leer `process.env.PORT` directamente en `server.ts` y validar ahí mismo? *(Pista: piensa qué pasa cuando haya 10 variables usadas en 8 archivos distintos.)*
