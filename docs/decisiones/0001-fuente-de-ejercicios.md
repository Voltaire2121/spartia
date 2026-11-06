# ADR 0001 · Fuente del catálogo de ejercicios

- **Estado:** Aceptada
- **Fecha:** 2026-11-06

## Contexto

Spartia necesita un catálogo de ejercicios (nombre, músculos, equipo, nivel, instrucciones e idealmente imágenes) para armar rutinas. La intención es **monetizar** la app más adelante y que el catálogo se pueda **ampliar** con ejercicios propios.

Evaluamos [free-exercise-db](https://github.com/yuhonas/free-exercise-db), un JSON público con unos 876 ejercicios:

- **Costo:** gratis; se descarga de GitHub.
- **Licencia:** [Unlicense](https://unlicense.org) (dominio público). Es un fork de [wrkout/exercises.json](https://github.com/wrkout/exercises.json), con la misma licencia.
- **Imágenes:** su procedencia es desconocida. El mantenedor escribió en el [issue #2](https://github.com/yuhonas/free-exercise-db/issues/2): *"I actually have no idea where the images are from or if they are royalty free so usage would be at your own risk"*. En el [issue #13](https://github.com/yuhonas/free-exercise-db/issues/13) varios usuarios señalan que parecen tomadas de ExRx.net, y el mantenedor propone reemplazarlas por marcadores.

Alternativas consideradas:

| Opción | Ventajas | Desventajas |
|---|---|---|
| free-exercise-db completo (con imágenes) | Rápido, con imágenes | Riesgo legal en una app monetizada |
| [wger](https://wger.de) | CC-BY-SA, uso comercial con atribución, textos en español | Imágenes incompletas, API más compleja, share-alike sobre los datos |
| Proveedor de pago (ExerciseDB, wrkout.xyz) | Imágenes/videos licenciados | Costo y dependencia de un tercero |
| **Base propia, sembrada con los textos de free-exercise-db** | Sin costo ni riesgo; ampliable; desacoplada del proveedor | Sin imágenes al inicio |

## Decisión

1. **Nuestra base de datos es la fuente de verdad.** El dataset externo solo se usa para la carga inicial, con un script idempotente (`upsert` por `slug`). La API nunca consulta a terceros en vivo.
2. **Se importan solo los textos** de free-exercise-db: nombre, músculos, equipo, nivel, mecánica, fuerza, categoría e instrucciones. **No se usan sus imágenes.**
3. Cada ejercicio guarda `source`: `"free-exercise-db"` para los importados y `"spartia"` para los creados por nosotros.
4. El API devuelve `imageUrls: []` mientras no haya imágenes con licencia, y la app muestra un marcador.

## Consecuencias

- ✅ La app puede monetizarse sin riesgo de copyright por imágenes.
- ✅ Agregar ejercicios es un `POST` o un `INSERT`; cambiar o sumar proveedores (wger, uno de pago, fotos propias) no afecta a la app, porque solo cambia el script de importación.
- ⚠️ La app no tendrá imágenes reales al inicio.
- ⚠️ Los nombres e instrucciones están en inglés y la app es en español. Se decidirá después (`nameEs`, una tabla de traducciones o wger).
- 🔁 Revisar esta decisión antes de publicar en el App Store.
