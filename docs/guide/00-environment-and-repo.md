# 00 · Entorno, repositorio y decisiones

## Objetivo

Dejar la Mac lista para desarrollar el API y la app de iOS, crear el repositorio con su plan oficial y decidir de dónde salen los datos de ejercicios.

## Qué se hizo

- Revisamos versiones: Xcode 26.6, CocoaPods, Git y Homebrew ya estaban instalados.
- Instalamos **Node 22** con **fnm**, **Watchman** y **Docker sobre Colima**.
- Borramos el runtime del simulador iOS 26.5 (sin dispositivos), conservando el iPhone 16 con iOS 18.6. Liberamos unos 11 GB.
- `git init -b main`, `.gitignore`, `README.md` y `docs/PLAN.md`.
- Investigamos la licencia de free-exercise-db y registramos la decisión en `docs/decisiones/0001-fuente-de-ejercicios.md`.

## Conceptos clave

- **Gestor de versiones de Node (fnm):** permite tener varias versiones de Node y elegir cuál usar por proyecto. Es como tener varias versiones de una dependencia en distintos `package.json`, pero para el runtime. `fnm` modifica el `PATH` al abrir la terminal, así que **una terminal abierta antes de instalarlo sigue usando el Node viejo**.
- **PATH:** la lista ordenada de carpetas donde la terminal busca los comandos. Gana la primera que contenga el comando (`which -a node` las muestra todas).
- **Docker y Colima:** Docker corre contenedores Linux; en macOS hace falta una máquina virtual. Colima es esa máquina virtual, más liviana que Docker Desktop. Un contenedor es como un `node_modules` de servicios: Postgres se levanta igual en cualquier computadora.
- **Watchman:** observa cambios en archivos. Metro (el bundler de React Native, el equivalente de Vite) lo usa para recargar rápido.
- **ADR (Architecture Decision Record):** un documento corto con contexto, decisión y consecuencias. Explica el *por qué* de una decisión para tu yo del futuro y para quien lea el repo.

## Comandos

```bash
fnm install 22 && fnm default 22   # instalar y fijar Node 22
which -a node                       # ver qué binarios de node hay en el PATH
colima start --cpu 2 --memory 2     # encender Docker
colima stop                         # apagarlo y liberar RAM
docker run --rm hello-world         # comprobar Docker
xcrun simctl runtime list           # runtimes de simulador y su tamaño
```

## Errores comunes

- **`node -v` sigue mostrando la versión vieja:** cierra la terminal y abre una nueva (o reinicia VS Code con `Cmd+Q`).
- **`Cannot connect to the Docker daemon`:** Colima está apagado. Corre `colima start`.
- **Disco lleno al compilar iOS:** borra DerivedData (`~/Library/Developer/Xcode/DerivedData`) y los runtimes de simulador que no uses.

## 🧠 Reto

Tienes dos Node instalados: el del instalador oficial en `/usr/local/bin/node` (v20) y el de fnm (v22).
1. ¿Por qué gana el de fnm? Explícalo mirando la salida de `echo $PATH | tr ":" "\n"`.
2. Investiga cómo desinstalar el Node 20 del instalador oficial sin romper fnm. *(Pista: el .pkg no trae desinstalador; busca qué archivos dejó en `/usr/local`.)*
