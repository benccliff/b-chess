# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Setup (first time)
```bash
make setup  # Creates backend/.venv, installs Python deps, installs npm deps
```

### Development
```bash
make dev    # Starts both backend (port 8000) and frontend (port 5173) in parallel
```

### Testing
```bash
make test   # Runs backend pytest + frontend vitest
```

### Linting
```bash
make lint   # Runs frontend ESLint
```

### Frontend only
```bash
cd frontend && npm run dev      # Vite dev server with HMR
cd frontend && npm run build    # Type-check (tsc -b) then bundle
cd frontend && npm run lint     # ESLint
cd frontend && npm run preview  # Preview production build
cd frontend && npm test         # Vitest (watch mode)
cd frontend && npm test -- --run  # Vitest (single run)
```

### Backend only
```bash
backend/.venv/bin/python -m pytest backend/tests/ -v
```

## Architecture

**Full-stack local web app**: FastAPI backend + React 19 + TypeScript + Vite frontend.

### Backend (`backend/`)
- `main.py`: FastAPI app factory; CORS (GET, POST, DELETE) + router registration
- `chess/models/`: Frozen dataclasses — `types.py` (enums), `piece.py`, `board.py`, `game_state.py`
- `chess/moves/`: One file per piece validator + `move_generator.py` (filters for king safety)
- `chess/rules/`: `check_detector.py`, `position_applier.py` (immutable state transitions), `game_status.py`
- `chess/notation/fen.py`: FEN serialisation/parsing
- `chess/store/game_store.py`: In-memory dict with threading.Lock; injected via FastAPI Depends()
- `chess/api/`: `schemas.py` (Pydantic), `router.py` (APIRouter prefix=/games)
- `tests/unit/` + `tests/integration/`: pytest with httpx AsyncClient
- Python virtual environment at `backend/.venv` (Python 3.13+)
- `pytest.ini` sets `asyncio_mode = auto` and `pythonpath = .`

### Frontend (`frontend/src/`)
- React entry: `main.tsx` → `App.tsx`
- `types/chess.ts`: All shared TypeScript types (mirrors backend schemas)
- `services/chessApi.ts`: All fetch() calls; throws ApiError on non-OK
- `hooks/useGame.ts`: Game lifecycle (create on mount, submitMove)
- `hooks/useSelectedSquare.ts`: Selection state, legal targets, promotion pending
- Components: `GamePage`, `Board`, `Square`, `Piece`, `StatusBar`, `PromotionModal`
- State managed with React hooks (no external state library)
- Inline styles via `Record<string, React.CSSProperties>` objects (no CSS-in-JS library)
- TypeScript strict mode; three tsconfig files (`tsconfig.json` references `tsconfig.app.json` + `tsconfig.node.json`)
- ESLint 9 flat config format (`eslint.config.js`)
- Tests in `src/__tests__/` using Vitest + React Testing Library

## Board Coordinate System

- `grid[row][col]`: row 0 = rank 8 (black back rank), row 7 = rank 1 (white back rank)
- col 0 = file a, col 7 = file h
- `sq_to_coords("e4")` → `(4, 4)`, `coords_to_sq(4, 4)` → `"e4"`

## Code Style

- **No docstrings or behavioural comments.** Only add a comment when code is genuinely unintuitive (e.g. a non-obvious algorithm step). Self-documenting names are preferred.
- **TDD**: write tests before implementation.
- **SOLID + modular**: one responsibility per file; depend on abstractions not concretions.
- **Immutable state**: all game state objects are frozen dataclasses; mutations return new instances.
- **No external chess libraries**.

## REST API

| Method | Path | Description |
|--------|------|-------------|
| POST | /games | Create new game → 201 |
| GET | /games/{id} | Get current state → 200 / 404 |
| POST | /games/{id}/moves | Submit move → 200 / 422 / 404 |
| DELETE | /games/{id} | Remove game → 200 / 404 |
