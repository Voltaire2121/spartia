# ActiveWorkout

**Workout in progress** screen, the heart of the app.

- Header: routine name, stopwatch, set progress bar (`2/9`) and a `Terminar` (finish) button.
- Superset card: exercises A and B with an optional note; table with SERIE · ANTERIOR · KG · REPS · ✓.
- **ANTERIOR** (previous) shows what was done last time; the `pr` dot means that value was a PR.
- KG/REPS come prefilled as ghost text (`ink-placeholder`) with the previous values; the active cell is highlighted with `primary`. ▲ arrows suggest going up (progression).
- ✓ completes the set (`success-soft` row) and starts **RestTimer**.
