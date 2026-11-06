# 00 · Environment, repository and decisions

## Goal

Get the Mac ready to build the API and the iOS app, create the repository with its official plan, and decide where the exercise data comes from.

## What we did

- Checked versions: Xcode 26.6, CocoaPods, Git and Homebrew were already installed.
- Installed **Node 22** with **fnm**, **Watchman**, and **Docker on Colima**.
- Removed the iOS 26.5 simulator runtime (it had no devices) and kept the iPhone 16 on iOS 18.6, freeing about 11 GB.
- `git init -b main`, `.gitignore`, `README.md` and `docs/PLAN.md`.
- Researched the free-exercise-db license and recorded the decision in `docs/decisions/0001-exercise-data-source.md`.

## Key concepts

- **Node version manager (fnm):** lets you install several Node versions and pick one per project. Think of it as pinning a dependency version in `package.json`, but for the runtime. fnm edits the `PATH` when a terminal opens, so **a terminal opened before installing it keeps using the old Node**.
- **PATH:** the ordered list of folders where the terminal looks for commands. The first folder that has the command wins (`which -a node` lists them all).
- **Docker and Colima:** Docker runs Linux containers, and macOS needs a virtual machine for that. Colima is that VM, lighter than Docker Desktop. A container is like a `node_modules` for services: Postgres starts the same way on any computer.
- **Watchman:** watches for file changes. Metro (React Native's bundler, the Vite equivalent) uses it to reload fast.
- **ADR (Architecture Decision Record):** a short document with context, decision and consequences. It explains the *why* behind a decision to your future self and to anyone reading the repo.

## Commands

```bash
fnm install 22 && fnm default 22   # install Node 22 and make it the default
which -a node                       # list every node binary in the PATH
colima start --cpu 2 --memory 2     # start Docker
colima stop                         # stop it and free RAM
docker run --rm hello-world         # check Docker works
xcrun simctl runtime list           # simulator runtimes and their size
```

## Common errors

- **`node -v` still shows the old version:** close the terminal and open a new one (or quit VS Code with `Cmd+Q`).
- **`Cannot connect to the Docker daemon`:** Colima is off. Run `colima start`.
- **Disk full while building iOS:** delete DerivedData (`~/Library/Developer/Xcode/DerivedData`) and any simulator runtimes you don't use.

## 🧠 Challenge

You have two Node installs: the official installer one at `/usr/local/bin/node` (v20) and the fnm one (v22).
1. Why does fnm's win? Explain it using the output of `echo $PATH | tr ":" "\n"`.
2. Find out how to uninstall the official installer's Node 20 without breaking fnm. *(Hint: the .pkg has no uninstaller; look at what files it left in `/usr/local`.)*
