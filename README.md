# b-chess

Chess app to improve my local dev setup.

This is a full-stack local web app with a FastAPI backend and a Vite + React + TypeScript frontend, connected by a `/greetings` POST endpoint.

## Prerequisites

- **Python 3.13+** — already installed at `/Library/Frameworks/Python.framework/Versions/3.13/`
- **Node.js** — installed via nvm. To activate in a new terminal session:
  ```bash
  export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
  ```
  Or open a new terminal tab (nvm is wired into `~/.zshrc` automatically).

## Quick start

First-time setup (creates the Python venv and installs all deps):

```bash
make setup
```

Then start both servers with one command:

```bash
make dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Press `Ctrl-C` to stop both.

## Usage

1. Run `make dev`
2. Open http://localhost:5173
3. Enter a name and click Submit — you should see `Hello, <name>!`

## Verify the API directly

```bash
curl -X POST http://localhost:8000/greetings \
  -H "Content-Type: application/json" \
  -d '{"name":"World"}'
# → {"greeting":"Hello, World!"}
```
