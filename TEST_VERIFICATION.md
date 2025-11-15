# Test Verification Guide

This guide helps you verify the app functionality using Playwright tests.

## Prerequisites

Before running tests, ensure:

1. **Backend dependencies are installed:**
   ```bash
   cd FastAPI
   python -m venv env
   env\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

2. **Frontend dependencies are installed:**
   ```bash
   cd React/finance-app
   npm install
   ```

3. **Playwright browsers are installed:**
   ```bash
   cd React/finance-app
   npx playwright install
   ```

## Running the Application

### Step 1: Start Backend Server

Open Terminal 1:
```bash
cd FastAPI
env\Scripts\activate  # Windows
# or: source env/bin/activate  # macOS/Linux
uvicorn main:app --reload
```

✅ Backend should be running at http://localhost:8000

Verify by visiting: http://localhost:8000/docs

### Step 2: Start Frontend Server

Open Terminal 2:
```bash
cd React/finance-app
npm run dev
```

✅ Frontend should be running at http://localhost:3000

## Running Playwright E2E Tests

### Option 1: Automatic (Recommended)

Playwright can start the frontend server automatically:

```bash
cd React/finance-app
npm run e2e
```

**Note:** The backend must still be running manually in a separate terminal.

### Option 2: Manual (Both Servers Running)

If both servers are already running:

```bash
cd React/finance-app
npx playwright test
```

### Option 3: Interactive UI Mode

For debugging and watching tests:

```bash
cd React/finance-app
npm run e2e:ui
```

This opens Playwright's interactive test runner.

## Test Coverage

The E2E tests verify:

1. ✅ **App Title Display** - Verifies the navbar shows "Finance App"
2. ✅ **Transaction Form** - Checks all form fields are visible
3. ✅ **Create Transaction** - Tests submitting a new expense transaction
4. ✅ **Create Income Transaction** - Tests submitting an income transaction
5. ✅ **Empty State** - Verifies empty state message when no transactions
6. ✅ **Form Validation** - Tests HTML5 form validation
7. ✅ **Transactions Table** - Verifies transactions are displayed

## Expected Test Results

When all tests pass, you should see:

```
Running 7 tests using 1 worker

  ✓ e2e/app.spec.js:4:5 › Finance App E2E Tests › should display the app title (2s)
  ✓ e2e/app.spec.js:12:5 › Finance App E2E Tests › should display transaction form (1s)
  ✓ e2e/app.spec.js:20:5 › Finance App E2E Tests › should submit a new transaction (3s)
  ✓ e2e/app.spec.js:36:5 › Finance App E2E Tests › should submit an income transaction (3s)
  ✓ e2e/app.spec.js:52:5 › Finance App E2E Tests › should display empty state when no transactions (1s)
  ✓ e2e/app.spec.js:64:5 › Finance App E2E Tests › should validate required fields (1s)
  ✓ e2e/app.spec.js:73:5 › Finance App E2E Tests › should display transactions table (1s)

  7 passed (12s)
```

## Troubleshooting

### Tests Fail with Connection Errors

**Problem:** `net::ERR_CONNECTION_REFUSED`

**Solution:**
1. Ensure backend is running on port 8000
2. Ensure frontend is running on port 3000
3. Check firewall settings
4. Verify no other applications are using these ports

### Tests Fail with Timeout Errors

**Problem:** Tests timeout waiting for elements

**Solution:**
1. Check browser console for JavaScript errors
2. Verify API is responding: http://localhost:8000/health
3. Check network tab for failed API calls
4. Increase timeout in test if needed

### Playwright Browsers Not Installed

**Problem:** `Executable doesn't exist`

**Solution:**
```bash
npx playwright install
npx playwright install chromium  # For specific browser
```

### Backend Not Starting

**Problem:** Import errors or missing dependencies

**Solution:**
```bash
cd FastAPI
pip install -r requirements.txt
# Check Python version: python --version (should be 3.8+)
```

### Frontend Not Starting

**Problem:** Module not found or Vite errors

**Solution:**
```bash
cd React/finance-app
rm -rf node_modules  # or rmdir /s node_modules on Windows
npm install
```

## Manual Verification Checklist

If you prefer to verify manually:

- [ ] Backend API docs accessible at http://localhost:8000/docs
- [ ] Frontend loads at http://localhost:3000
- [ ] Navbar displays "Finance App"
- [ ] Transaction form is visible with all fields
- [ ] Can submit a transaction
- [ ] Transaction appears in table after submission
- [ ] Can submit income transaction (check checkbox)
- [ ] Income transactions show "Income" badge
- [ ] Expense transactions show "Expense" badge
- [ ] Form validation works (try submitting empty form)

## Viewing Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens a detailed test report with:
- Test execution timeline
- Screenshots of failures
- Network requests
- Console logs
- Video recordings (if enabled)

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Install dependencies
npm install
npx playwright install --with-deps

# Run tests
npm run e2e
```

Set `CI=true` environment variable for CI-specific settings.

