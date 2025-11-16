@echo off
REM run-e2e.bat — Start stack using test DB, run Playwright E2E, then stop stack.
REM Usage: run-e2e.bat [playwright-args]

REM Configure test DB path (relative to repo root)
set "TEST_DB=%~dp0FastAPI\test_e2e.db"
set "DATABASE_URL=sqlite:///%TEST_DB%"
set "FASTAPI_TESTING=1"

echo Using DATABASE_URL=%DATABASE_URL%
echo Starting app stack using start-app.bat...
call start-app.bat

REM wait for services to come up (increase if necessary)
echo Waiting for services to come up (5s)...
timeout /t 5 /nobreak >nul

echo Running Playwright E2E tests...
pushd React\finance-app
npx playwright test %*
popd

echo Tests finished. Stopping app stack using stop-app.bat...
call stop-app.bat

echo Done.
exit /b 0