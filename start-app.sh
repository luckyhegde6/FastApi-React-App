#!/bin/bash
# Combined startup script for FastAPI backend and React frontend
# This script starts both servers in the background

set -e  # Exit on error

echo "=========================================="
echo "  FastAPI-React Finance App Startup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 || nc -z localhost $1 2>/dev/null; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Check if ports are available
if check_port 8000; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use. Backend may already be running.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use. Frontend may already be running.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# ============================================
# Start FastAPI Backend
# ============================================
echo -e "${BLUE}📦 Setting up FastAPI backend...${NC}"
cd FastAPI

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv || python -m venv venv
    echo -e "${GREEN}✅ Virtual environment created.${NC}"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing/updating Python dependencies..."
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

echo -e "${GREEN}✅ Backend dependencies installed.${NC}"

# Start backend server in background
echo -e "${BLUE}🚀 Starting FastAPI server on http://127.0.0.1:8000${NC}"
echo "   API Documentation: http://127.0.0.1:8000/docs"
echo ""

# Start uvicorn in background and capture PID
nohup python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  Backend server may have failed to start. Check backend.log${NC}"
fi

# ============================================
# Start React Frontend
# ============================================
echo ""
echo -e "${BLUE}📦 Setting up React frontend...${NC}"
cd ../React/finance-app

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed.${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies found.${NC}"
fi

# Check if Playwright browsers are installed (optional)
if [ ! -d "node_modules/.playwright" ]; then
    echo "Installing Playwright browsers..."
    npx playwright install --with-deps chromium 2>/dev/null || echo "Playwright installation skipped"
fi

echo -e "${BLUE}🚀 Starting React development server on http://localhost:3000${NC}"
echo ""

# Start frontend server in background and capture PID
nohup npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../../frontend.pid

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend server may have failed to start. Check frontend.log${NC}"
fi

# ============================================
# Summary
# ============================================
cd ../..
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Application started successfully!${NC}"
echo "=========================================="
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://127.0.0.1:8000"
echo "   API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "📋 Process IDs saved to:"
echo "   Backend PID: backend.pid"
echo "   Frontend PID: frontend.pid"
echo ""
echo "📝 Logs:"
echo "   Backend: backend.log"
echo "   Frontend: frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   ./stop-app.sh"
echo "   or"
echo "   kill \$(cat backend.pid) \$(cat frontend.pid)"
echo ""
echo "Press Ctrl+C to stop watching (servers will continue running)"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    if [ -f backend.pid ]; then
        kill $(cat backend.pid) 2>/dev/null || true
        rm backend.pid
    fi
    if [ -f frontend.pid ]; then
        kill $(cat frontend.pid) 2>/dev/null || true
        rm frontend.pid
    fi
    echo "Servers stopped."
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Keep script running and show logs
echo "Watching logs (Ctrl+C to stop watching, servers will continue)..."
echo ""
tail -f backend.log frontend.log

