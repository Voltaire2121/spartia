# 01 · Node + TypeScript + Express: el primer servidor

## Objetivo

Crear `apps/api` desde cero, ejecutar TypeScript en Node y levantar un servidor HTTP con `GET /health` que responda `{ "status": "ok" }`.

## Qué se hizo

- `npm init -y`, `.node-version` con `22`, `"type": "module"` y `"private": true`.
- Herramientas de desarrollo: `typescript`, `tsx`, `@types/node@22`, `@types/express`.
- Dependencia de producción: `express`.
- `tsconfig.json` escrito a mano (`NodeNext`, `strict`, `noUncheckedIndexedAccess`).
- Scripts: `dev` (tsx watch), `build` (tsc), `start` (node dist), `typecheck` (tsc --noEmit).
- `src/index.ts`: app de Express con `GET /health` escuchando en el puerto 3000.

## Conceptos clave

- **`dependencies` vs `devDependencies`:** las primeras se necesitan para *ejecutar* en producción (`express`); las segundas solo para *desarrollar o compilar* (`typescript`, `tsx`, `@types/*`).
- **tsx vs tsc:** `tsx` ejecuta TS al vuelo y **no revisa tipos**, solo los borra (como Vite en desarrollo). `tsc` compila y sí revisa tipos (como `vite build`). Por eso `typecheck` es un paso aparte y se corre en CI.
- **ES Modules en Node:** con `"type": "module"` y `NodeNext`, los imports relativos llevan `.js` aunque el archivo sea `.ts` (`./app.js`): escribes la ruta que existirá después de compilar.
- **`@types/node` debe coincidir con tu versión de Node:** si no, TS te deja usar APIs que tu runtime no tiene.
- **Servidor HTTP:** en React haces `fetch` y esperas; aquí estás del otro lado. `app.get(ruta, (req, res) => …)` es como una ruta de React Router cuyo "componente" construye la respuesta.
- **Puerto:** `localhost` es el edificio y `3000` la puerta. `listen` mantiene el proceso vivo esperando requests.
- **Overloads:** `app.listen("3000")` compila porque TS elige la firma `listen(path: string)` (un socket de archivo) y no la de puerto. Funciona por casualidad. Usa siempre `number`.
- **`_req`:** el guion bajo indica que un parámetro no se usa a propósito.

## Comandos

```bash
npm run dev                       # servidor con recarga al guardar
npm run typecheck                 # revisar tipos
npm run build && npm start        # compilar y correr como en producción
curl localhost:3000/health        # {"status":"ok"}
curl -i localhost:3000/health     # + status y headers (HTTP/1.1 200 OK, Content-Type)
npm ls @types/node                # ver qué versión de un paquete está instalada
```

## Errores comunes

- **`"module" is not valid JSON` con `npm pkg set … --json`:** `--json` se aplica a todos los valores del comando. Separa los valores de texto de los booleanos.
- **`EACCES: permission denied, mkdir '/Users/…/node_modules'`:** estás fuera del proyecto y npm subió de carpeta hasta encontrar otro `package.json`. Revisa con `pwd`. **Nunca uses `sudo npm install`.**
- **`EADDRINUSE: address already in use :::3000`:** otro proceso (casi siempre un servidor viejo en otra terminal) ya usa el puerto. Ciérralo con `Ctrl+C`.
- **`curl localhost:3000/otra-ruta` devuelve HTML:** es el 404 por defecto de Express. Lo reemplazaremos por JSON en el paso 1.7.

## 🧠 Reto

1. Agrega `GET /` que responda `{ name: "Spartia API", version: "1.0.0" }`.
2. Consigue que la `version` salga del `package.json`, sin escribirla a mano. *(Pista: busca "import attributes" `with { type: "json" }` en Node 22, y por qué TypeScript te pedirá `resolveJsonModule`.)*
3. ¿Qué código de estado devuelve `curl -i -X POST localhost:3000/health`? ¿Por qué no es 200?
