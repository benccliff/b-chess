.PHONY: dev setup

SHELL := /bin/bash

# Start backend and frontend in parallel. Ctrl-C kills both.
dev:
	@. $(HOME)/.nvm/nvm.sh; \
	trap 'kill 0' EXIT; \
	(cd backend && source .venv/bin/activate && uvicorn main:app --reload) & \
	(cd frontend && npm run dev) & \
	(sleep 2 && open http://localhost:5173) & \
	wait

# First-time setup: create venv, install Python and Node deps.
setup:
	python3 -m venv backend/.venv
	backend/.venv/bin/pip install -r backend/requirements.txt
	. $(HOME)/.nvm/nvm.sh && cd frontend && npm install
