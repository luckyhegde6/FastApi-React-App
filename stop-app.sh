#!/bin/bash
# Stop script for FastAPI backend and React frontend

echo "Stopping FastAPI-React Finance App..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Stop backend
if [ -f backend.pid ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping backend server (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || kill -9 $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Backend server stopped.${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend server (PID: $BACKEND_PID) not running.${NC}"
    fi
    rm backend.pid
else
    echo -e "${YELLOW}⚠️  Backend PID file not found.${NC}"
fi

# Stop frontend
if [ -f frontend.pid ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || kill -9 $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend server stopped.${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend server (PID: $FRONTEND_PID) not running.${NC}"
    fi
    rm frontend.pid
else
    echo -e "${YELLOW}⚠️  Frontend PID file not found.${NC}"
fi

# Clean up log files (optional)
read -p "Delete log files? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f backend.log frontend.log
    echo -e "${GREEN}✅ Log files deleted.${NC}"
fi

echo ""
echo -e "${GREEN}✅ All servers stopped.${NC}"

