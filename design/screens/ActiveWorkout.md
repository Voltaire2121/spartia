# ActiveWorkout

Pantalla de **entrenamiento en curso**, el corazón de la app.

- Cabecera: nombre de rutina, cronómetro, barra de progreso de series (`2/9`) y botón `Terminar`.
- Tarjeta de superserie: ejercicios A y B con nota opcional; tabla con SERIE · ANTERIOR · KG · REPS · ✓.
- **ANTERIOR** muestra lo hecho la última vez; el punto `pr` indica que ese valor fue un PR.
- KG/REPS vienen pre-llenados como fantasma (`ink-placeholder`) con lo anterior; la celda activa se resalta con `primary`. Las flechas ▲ sugieren subir (progresión).
- ✓ completa la serie (fila `success-soft`) y arranca **RestTimer**.
