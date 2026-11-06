# Spartia design system

This folder is the app's **visual source of truth**. It was exported from the Spartia design system in Claude (artifact "Spartia Workout Tracker").

## How to use this folder (humans and Claude Code)

- **To see what a screen looks like:** open `screens/<Name>.png` (light theme) and `screens/<Name>.dark.png` (dark). Claude Code can read the images directly.
- **For exact measurements** (padding, radii, font sizes): read `screens/<Name>.html` together with `components.css`. The HTML is a **layout reference**, not code to copy: in React Native it's rebuilt with `View`/`Text`/`StyleSheet`.
- **For a screen's behavior:** read `screens/<Name>.md`.
- **Colors, typography, spacing and radii:** `tokens.json` is the source of truth. In the app it becomes `apps/mobile/src/theme/tokens.ts`. Never hard-code a hex color in a component: always use a token.
- `tokens.css` was generated from `tokens.json` and only exists so the HTML files render in the browser.

### CSS → React Native equivalents

| In the HTML/CSS | In React Native |
|---|---|
| `var(--primary)`, `var(--space-4)`… | `theme.colors.primary`, `theme.space[4]`… from `src/theme` |
| `.title`, `.body`, `.overline`… (text styles) | `<AppText variant="title">` |
| `.sp-btn.primary / secondary / quiet / danger` | `<Button variant="primary">` |
| `.sp-sheet` + `.sp-scrim` | Bottom sheet (`@gorhom/bottom-sheet` or `Modal`) |
| `.sp-tabbar` | React Navigation bottom tabs |
| `.sp-ex` | `<ExerciseRow>` |
| `.sp-sets` | `<SetTable>` |
| `box-shadow` | `shadow*` on iOS / `elevation` on Android |
| `font-variant-numeric: tabular-nums` | `fontVariant: ['tabular-nums']` |
| Dark theme `[data-theme="dark"]` | `useColorScheme()` + `dark` theme tokens |

The gray thumbnails with a dumbbell are placeholders: the app shows each exercise's real image (from the dataset during the MVP; see `docs/decisions/0002-use-dataset-images-for-mvp.md`). The placeholder is still used while an image loads or if it's missing.

## Screen index

| Flow step | Screen | Files |
|---|---|---|
| 1 · Routines | Routine library | `screens/RoutinesScreen.*` |
| 1 · Routines | Create routine (empty) | `screens/RoutineBuilderEmpty.*` |
| 1 · Routines | Exercise picker (sheet) | `screens/ExercisePickerSheet.*` |
| 1 · Routines | Routine with a superset | `screens/RoutineBuilder.*` |
| 1 · Routines | Exercise settings (sheet) | `screens/ExerciseSettingsSheet.*` |
| 2 · Week | Week (home) | `screens/WeekScreen.*` |
| 2 · Week | Day menu | `screens/DayMenuSheet.*` |
| 2 · Week | Assign routine to a day (sheet) | `screens/AssignRoutineSheet.*` |
| 3 · Train | Active workout | `screens/ActiveWorkout.*` |
| 3 · Train | Rest timer | `screens/RestTimer.*` |
| 3 · Train | Confirm finish | `screens/FinishSheet.*` |
| 4 · Results | Post-workout summary | `screens/WorkoutSummary.*` |
| 4 · Results | Weekly progress | `screens/ProgressScreen.*` |

## Components

`components/Button`, `DayCard`, `TodayCard`, `ExerciseRow`, `SetTable`, `Badges`, `TabBar` (`.png`, `.html`, `.md` each).

---

# Brand guide

Spartia is a mobile app to create your routines, place them on the days of the week, run them set by set, and see how you progressed and which PRs you hit. The visual language is deliberately clean and "serious gym": light gray background, white cards, a single blue for actions, and status colors (red, green, gold) that each mean exactly one thing.

> This system is the first version of the MVP, built from screenshots of a reference app. There's no logo yet: the name is set in Inter ExtraBold. Exercise thumbnails are placeholders until a licensed exercise database is connected.

## The MVP flow

| Step | What the user does | Screens (Components) |
|---|---|---|
| **1 · Routines** | Creates a routine, searches and adds exercises, sets sets / reps / rest and builds supersets | `RoutinesScreen` → `RoutineBuilderEmpty` → `ExercisePickerSheet` → `RoutineBuilder` → `ExerciseSettingsSheet` |
| **2 · Week** | Puts each routine on a day, reorders days, marks rest days | `WeekScreen` → `DayMenuSheet` → `AssignRoutineSheet` |
| **3 · Train** | Taps *Empezar entrenamiento*, logs KG and REPS seeing last time's numbers, rests with a timer, finishes | `ActiveWorkout` → `RestTimer` → `FinishSheet` |
| **4 · Results** | Sees the summary with PRs and progress vs. last time; reviews the full week | `WorkoutSummary` → `ProgressScreen` |

Navigation: bottom bar with **Semana · Rutinas · Progreso · Perfil** (Week · Routines · Progress · Profile). *Semana* is the home screen.

### Set logging rules

- **ANTERIOR** (previous) shows the best result from last session for that set (`77 × 15`). A `pr` dot next to it means that value was a record.
- KG and REPS are prefilled with the previous values in gray (`ink-placeholder`); the user confirms or edits. The cell being edited has a `primary` outline.
- An ▲ arrow (`primary-text`) suggests progressing: more reps if the top of the range hasn't been reached yet, or more weight if it has.
- Tapping ✓ paints the row `success-soft` and starts the exercise's configured rest.
- In a superset, sets alternate 1A, 1B, 2A, 2B…; rest starts after set B.

### What counts as a PR

- **Max weight** lifted on an exercise.
- **Estimated 1RM** (Epley: weight × (1 + reps / 30)).
- **Most reps** at the same weight.
- Session **volume** (Σ kg × reps) is compared with last time but is not a PR.

## Visual foundations

**Color.** `bg-app` gray background and `bg-surface` for cards, separated by a 1px `line` border and a minimal shadow (`shadow-card`); in dark mode, only the border. A single action color, `primary`: the main button, the TODAY card, the active tab. Status colors never mix:

- `danger` = **Missed** day or destructive action.
- `success` = **Completed** set or day, positive delta.
- `pr` / `pr-soft` / `pr-ink` = **personal record**. Gold is never used as text on white: use `pr-ink` on `pr-soft`.
- `primary-soft` = information and selection (banner, SUPERSET chip, selected row).

**Typography.** Inter everywhere. Titles in ExtraBold (`title`, `section`) with negative tracking; lists in `headline` (600); metadata in `body`/`caption` with `ink-muted`; days and table headers in uppercase `overline`. Every KG/REPS/time number uses `numeric` with tabular figures so columns don't jump.

**Shape.** Actions are pills (`radius-pill`); cards use `radius-md` (rows) and `radius-lg` (large cards, supersets); bottom sheets use `radius-xl` on top. Screen side margin `space-4`, gap between rows `space-2`.

**Bottom sheets.** Anything that adds or picks something (routine, exercise, settings) appears as a bottom sheet over a `scrim`, with a handle, a `section` title and a primary button at the bottom that names the action ("Asignar al jueves", "Agregar 2 ejercicios").

## Iconography

Stroke icons, 24px grid, 1.8 stroke, rounded caps, in `currentColor` (in the app: Lucide or similar with the same stroke). States use an icon in a 36px box with its soft color: dumbbell for workout, figure for rest, check for completed. Anatomical figures highlight the target muscle in `muscle`.

## Voice (app copy, in Spanish)

Neutral Spanish, informal "tú", short and direct: "Empezar entrenamiento", "Agregar serie", "¡Entrenamiento completado!". Numbers always with units (`48 min`, `82 kg`, `+2 reps`). Celebrate PRs, don't scold missed days: red informs, the text doesn't blame.
