# PowerShell script to run Playwright tests
# This script helps verify the app is set up correctly before running tests

Write-Host "🔍 FastAPI-React App Test Runner" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from React/finance-app directory" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if Playwright is installed
Write-Host "📦 Checking Playwright installation..." -ForegroundColor Cyan
$playwrightInstalled = npm list @playwright/test 2>$null
if (-not $playwrightInstalled) {
    Write-Host "⚠️  Playwright not found. Installing..." -ForegroundColor Yellow
    npm install -D @playwright/test
    npx playwright install
}

# Check if backend is running
Write-Host "🔌 Checking backend server..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 2 -UseBasicParsing
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend not responding at http://localhost:8000" -ForegroundColor Yellow
    Write-Host "   Please start the backend server:" -ForegroundColor Yellow
    Write-Host "   cd ..\..\FastAPI" -ForegroundColor Yellow
    Write-Host "   uvicorn main:app --reload" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Check if frontend is running
Write-Host "🔌 Checking frontend server..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing
    Write-Host "✅ Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Frontend not running. Playwright will start it automatically." -ForegroundColor Blue
}

Write-Host ""
Write-Host "🚀 Starting Playwright tests..." -ForegroundColor Cyan
Write-Host ""

# Run tests
npm run e2e

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "View detailed report with: npx playwright show-report" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed. Check the output above for details." -ForegroundColor Red
    Write-Host "View detailed report with: npx playwright show-report" -ForegroundColor Cyan
    exit 1
}

