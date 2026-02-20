.PHONY: dev setup test lint

SHELL := /bin/bash

dev:
	@source /Users/benjamincliff/.nvm/nvm.sh; \
	trap 'kill 0' EXIT; \
	(cd backend && source .venv/bin/activate && uvicorn main:app --reload) & \
	(source /Users/benjamincliff/.nvm/nvm.sh && cd frontend && npm run dev) & \
	(sleep 2 && open http://localhost:5173) & \
	wait

setup:
	python3 -m venv backend/.venv
	backend/.venv/bin/pip install -r backend/requirements.txt
	source /Users/benjamincliff/.nvm/nvm.sh && cd frontend && npm install

test:
	backend/.venv/bin/python -m pytest backend/tests/ -v
	source /Users/benjamincliff/.nvm/nvm.sh && cd frontend && npm test -- --run

lint:
	source /Users/benjamincliff/.nvm/nvm.sh && cd frontend && npm run lint
