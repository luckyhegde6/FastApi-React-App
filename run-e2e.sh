#!/usr/bin/env bash
set -euo pipefail

# repo root assumed as current working dir for this script
TEST_DB="$(pwd)/FastAPI/test_e2e.db"
export DATABASE_URL="sqlite:///${TEST_DB}"
export FASTAPI_TESTING=1

echo "Using DATABASE_URL=${DATABASE_URL}"
echo "Starting app stack using ./start-app.sh..."
./start-app.sh &

# wait for services to come up
sleep 5

echo "Running Playwright E2E tests..."
pushd React/finance-app >/dev/null
npx playwright test "$@"
popd >/dev/null

echo "Stopping app stack using ./stop-app.sh..."
./stop-app.sh

echo "Done."