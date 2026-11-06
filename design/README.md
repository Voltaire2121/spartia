# Sistema de diseño de Spartia

Esta carpeta es la **fuente de verdad visual** de la app. Se exportó del sistema de diseño de Spartia en Claude (artifact "Spartia Workout Tracker").

## Cómo usar esta carpeta (humanos y Claude Code)

- **Para saber cómo se ve una pantalla:** abre `screens/<Nombre>.png` (tema claro) y `screens/<Nombre>.dark.png` (oscuro). Claude Code puede leer las imágenes directamente.
- **Para medidas exactas** (paddings, radios, tamaños de letra): lee `screens/<Nombre>.html` junto con `components.css`. El HTML es una **referencia de layout**, no código para copiar: en React Native se reimplementa con `View`/`Text`/`StyleSheet`.
- **Para el comportamiento de una pantalla:** lee `screens/<Nombre>.md`.
- **Colores, tipografía, espaciado y radios:** `tokens.json` es la fuente de verdad. En la app se convierte a `apps/mobile/src/theme/tokens.ts`. Nunca escribas un color hex a mano en un componente: usa siempre un token.
- `tokens.css` se generó desde `tokens.json` y sirve solo para que los HTML se vean en el navegador.

### Equivalencias CSS → React Native

| En el HTML/CSS | En React Native |
|---|---|
| `var(--primary)`, `var(--space-4)`… | `theme.colors.primary`, `theme.space[4]`… desde `src/theme` |
| `.title`, `.body`, `.overline`… (estilos de texto) | `<AppText variant="title">` |
| `.sp-btn.primary / secondary / quiet / danger` | `<Button variant="primary">` |
| `.sp-sheet` + `.sp-scrim` | Hoja inferior (`@gorhom/bottom-sheet` o `Modal`) |
| `.sp-tabbar` | Bottom tabs de React Navigation |
| `.sp-ex` | `<ExerciseRow>` |
| `.sp-sets` | `<SetTable>` |
| `box-shadow` | `shadow*` en iOS / `elevation` en Android |
| `font-variant-numeric: tabular-nums` | `fontVariant: ['tabular-nums']` |
| Tema oscuro `[data-theme="dark"]` | `useColorScheme()` + tokens del tema `dark` |

Las miniaturas grises con mancuerna son marcadores de posición: en la app van las imágenes reales de cada ejercicio.

## Índice de pantallas

| Paso del flujo | Pantalla | Archivos |
|---|---|---|
| 1 · Rutinas | Biblioteca de rutinas | `screens/RoutinesScreen.*` |
| 1 · Rutinas | Crear rutina (vacía) | `screens/RoutineBuilderEmpty.*` |
| 1 · Rutinas | Selector de ejercicios (hoja) | `screens/ExercisePickerSheet.*` |
| 1 · Rutinas | Rutina armada con superserie | `screens/RoutineBuilder.*` |
| 1 · Rutinas | Ajustes de ejercicio (hoja) | `screens/ExerciseSettingsSheet.*` |
| 2 · Semana | Semana (inicio) | `screens/WeekScreen.*` |
| 2 · Semana | Menú del día | `screens/DayMenuSheet.*` |
| 2 · Semana | Asignar rutina a un día (hoja) | `screens/AssignRoutineSheet.*` |
| 3 · Entrenar | Entrenamiento activo | `screens/ActiveWorkout.*` |
| 3 · Entrenar | Temporizador de descanso | `screens/RestTimer.*` |
| 3 · Entrenar | Confirmar fin | `screens/FinishSheet.*` |
| 4 · Resultados | Resumen post-entrenamiento | `screens/WorkoutSummary.*` |
| 4 · Resultados | Progreso semanal | `screens/ProgressScreen.*` |

## Componentes

`components/Button`, `DayCard`, `TodayCard`, `ExerciseRow`, `SetTable`, `Badges`, `TabBar` (`.png`, `.html`, `.md` cada uno).

---

# Guía de marca

Spartia es una app móvil para crear tus rutinas, ponerlas en los días de la semana, ejecutarlas serie por serie y ver qué avanzaste y qué PRs lograste. El lenguaje visual es deliberadamente limpio y "de gimnasio serio": fondo gris claro, tarjetas blancas, un solo azul de acción, y colores de estado (rojo, verde, dorado) que significan una sola cosa cada uno.

> Este sistema es la primera versión del MVP, construida a partir de pantallazos de una app de referencia. No hay logo todavía: el nombre se escribe en Inter ExtraBold. Las miniaturas de ejercicio son marcadores hasta conectar la base de datos de ejercicios licenciada.

## El flujo del MVP

| Paso | Qué hace el usuario | Pantallas (Componentes) |
|---|---|---|
| **1 · Rutinas** | Crea una rutina, busca y agrega ejercicios, define series / reps / descanso y arma superseries | `RoutinesScreen` → `RoutineBuilderEmpty` → `ExercisePickerSheet` → `RoutineBuilder` → `ExerciseSettingsSheet` |
| **2 · Semana** | Pone cada rutina en un día, reordena días, marca descansos | `WeekScreen` → `DayMenuSheet` → `AssignRoutineSheet` |
| **3 · Entrenar** | Toca *Empezar entrenamiento*, registra KG y REPS viendo lo de la vez anterior, descansa con temporizador, termina | `ActiveWorkout` → `RestTimer` → `FinishSheet` |
| **4 · Resultados** | Ve el resumen con PRs y progreso vs. la última vez; revisa la semana completa | `WorkoutSummary` → `ProgressScreen` |

Navegación: barra inferior con **Semana · Rutinas · Progreso · Perfil**. *Semana* es la pantalla de inicio.

### Reglas del registro de series

- **ANTERIOR** muestra el mejor dato de la sesión pasada para esa serie (`77 × 15`). Un punto `pr` al lado indica que ese valor fue un récord.
- KG y REPS se pre-llenan con lo anterior en gris (`ink-placeholder`); el usuario confirma o edita. La celda en edición lleva contorno `primary`.
- Una flecha ▲ (`primary-text`) sugiere progresar: más reps si aún no llega al tope del rango, o más peso si ya lo alcanzó.
- Marcar ✓ pinta la fila en `success-soft` y arranca el descanso configurado del ejercicio.
- En una superserie las series se intercalan 1A, 1B, 2A, 2B…; el descanso arranca tras la serie B.

### Qué cuenta como PR

- **Peso máximo** levantado en un ejercicio.
- **1RM estimado** (Epley: peso × (1 + reps / 30)).
- **Más reps** con un mismo peso.
- **Volumen** de sesión (Σ kg × reps) se compara con la última vez pero no es un PR.

## Fundamentos visuales

**Color.** Gris `bg-app` de fondo y `bg-surface` en tarjetas, separadas por un borde `line` de 1px y una sombra mínima (`shadow-card`); en oscuro, solo el borde. Un único color de acción, `primary`: el botón principal, la tarjeta de HOY, la pestaña activa. Los estados no se mezclan:

- `danger` = día **Perdido** o acción destructiva.
- `success` = serie o día **Completado**, delta positivo.
- `pr` / `pr-soft` / `pr-ink` = **récord personal**. El dorado nunca va como texto sobre blanco: usa `pr-ink` sobre `pr-soft`.
- `primary-soft` = información y selección (banner, chip SUPERSERIE, fila seleccionada).

**Tipografía.** Inter en todo. Títulos en ExtraBold (`title`, `section`) con tracking negativo; listas en `headline` (600); metadatos en `body`/`caption` con `ink-muted`; días y cabeceras de tabla en `overline` mayúsculas. Todo número de KG/REPS/tiempo usa `numeric` con cifras tabulares para que las columnas no bailen.

**Forma.** Las acciones son píldoras (`radius-pill`); las tarjetas usan `radius-md` (filas) y `radius-lg` (tarjetas grandes, superseries); las hojas inferiores `radius-xl` arriba. Margen lateral de pantalla `space-4`, gap entre filas `space-2`.

**Hojas inferiores.** Todo lo que agrega o elige algo (rutina, ejercicio, ajustes) aparece como hoja inferior sobre `scrim`, con asa, título en `section` y un botón primario al fondo que nombra la acción ("Asignar al jueves", "Agregar 2 ejercicios").

## Iconografía

Íconos de trazo, 24px de grilla, trazo 1.8, extremos redondeados, en `currentColor` (en la app: Lucide o similar con el mismo trazo). Los estados usan ícono en caja de 36px con su color suave: mancuerna para entrenamiento, figura para descanso, check para completado. Las figuras anatómicas resaltan el músculo objetivo en `muscle`.

## Voz

Español neutro, de tú, corto y directo: "Empezar entrenamiento", "Agregar serie", "¡Entrenamiento completado!". Números siempre con unidad (`48 min`, `82 kg`, `+2 reps`). Celebra los PRs, no regaña los días perdidos: el rojo informa, el texto no culpa.
