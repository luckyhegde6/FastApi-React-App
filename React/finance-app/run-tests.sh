#!/bin/bash
# Bash script to run Playwright tests
# This script helps verify the app is set up correctly before running tests

echo "🔍 FastAPI-React App Test Runner"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from React/finance-app directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if Playwright is installed
echo "📦 Checking Playwright installation..."
if ! npm list @playwright/test > /dev/null 2>&1; then
    echo "⚠️  Playwright not found. Installing..."
    npm install -D @playwright/test
    npx playwright install
fi

# Check if backend is running
echo "🔌 Checking backend server..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend not responding at http://localhost:8000"
    echo "   Please start the backend server:"
    echo "   cd ../../FastAPI"
    echo "   source env/bin/activate  # or: env\\Scripts\\activate on Windows"
    echo "   uvicorn main:app --reload"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if frontend is running
echo "🔌 Checking frontend server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "ℹ️  Frontend not running. Playwright will start it automatically."
fi

echo ""
echo "🚀 Starting Playwright tests..."
echo ""

# Run tests
npm run e2e

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo ""
    echo "View detailed report with: npx playwright show-report"
else
    echo ""
    echo "❌ Some tests failed. Check the output above for details."
    echo "View detailed report with: npx playwright show-report"
    exit 1
fi

