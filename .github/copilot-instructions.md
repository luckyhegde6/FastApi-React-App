# Copilot instructions for FastApi-React-App

Purpose
Provide immediate, actionable guidance so an AI coding agent can be productive quickly in this repo.

Big-picture architecture
- Backend: `FastAPI/` — FastAPI app using:
  - Routers: `FastAPI/routers/*.py` (HTTP layer)
  - Services: `FastAPI/services/*_service.py` (business logic + DB access)
  - Models & schemas: `FastAPI/models.py`, `FastAPI/schemas.py`
  - DB wiring & scripts: `FastAPI/database.py`, `migrate_database.py`, `reset_database.py`
  - Entrypoint: `FastAPI/main.py` (CORS, router includes)
- Frontend: `React/finance-app/` — Vite + React app
  - API: `React/src/api.js` and `React/src/api/api.js`
  - Components: `React/src/components/*` (UI, state management)
  - Tests: Vitest + Playwright configured in `React/finance-app/`

Key conventions & patterns
- Keep DB/logic in services, routers only transform request/response and call services.
  Example: add business rules to `FastAPI/services/transaction_service.py`, not in `routers/transactions.py`.
- Use Pydantic models in `FastAPI/schemas.py` for all request/response shapes; update schemas before changing routers.
- Tests:
  - Backend: pytest under `FastAPI/tests/` with fixtures in `FastAPI/tests/conftest.py`.
  - Frontend: vitest/playwright in `React/finance-app/`.
- DB lifecycle: use `reset_database.py` for local resets and `migrate_database.py` for schema updates — tests rely on fixtures, prefer them over manual DB mutation.

Developer workflows (concrete commands)
- Backend setup & run (from `FastAPI/`):
  - Install: `python -m pip install -r requirements.txt`
  - Run dev server: `uvicorn main:app --reload --port 8000`
  - Tests: `python -m pytest -q`
- Frontend setup & run (from `React/finance-app/`):
  - Install: `npm install`
  - Dev: `npm run dev` (see `package.json` for exact scripts)
  - Unit/E2E: `npm test` / `npx playwright test`
- DB:
  - Migrate: `python migrate_database.py`
  - Reset: `python reset_database.py`
  - Tests rely on fixtures in `FastAPI/tests/conftest.py` — read before altering test DB behavior.

Where to look first (priority)
1. `FastAPI/main.py` — app wiring, CORS, router includes
2. `FastAPI/database.py` — session / engine pattern
3. `FastAPI/models.py` and `FastAPI/schemas.py` — domain model and API contract
4. `FastAPI/services/*.py` and `FastAPI/routers/*.py` — business flow
5. `FastAPI/tests/conftest.py` — test DB lifecycle
6. `React/finance-app/package.json` and `React/src/api.js` — frontend scripts & API integration

When adding endpoints or fields
- Update `FastAPI/schemas.py` first, then `models.py` if needed.
- Implement service logic in `FastAPI/services/*_service.py`.
- Add route in `FastAPI/routers/*.py`, then update frontend `React/src/api.js` and affected components.
- Run backend tests (`pytest`) and frontend tests (`npm test`) after changes.

Commit & PR guidelines
- Small focused commits with test updates when behavior changes.
- If you change API shapes, update both backend schemas and frontend callers in the same PR.

If anything here is unclear or you want this committed automatically, reply with “enable repo edits” or grant the needed Git/PR tools and I’ll commit and open the PR.