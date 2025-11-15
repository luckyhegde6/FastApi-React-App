@echo off
REM Combined startup script for FastAPI backend and React frontend (Windows)
REM This script starts both servers

echo ==========================================
echo   FastAPI-React Finance App Startup
echo ==========================================
echo.

REM Check if ports are in use
netstat -ano | findstr ":8000" >nul 2>&1
if %errorlevel% == 0 (
    echo [WARNING] Port 8000 is already in use. Backend may already be running.
    pause
)

netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% == 0 (
    echo [WARNING] Port 3000 is already in use. Frontend may already be running.
    pause
)

REM ============================================
REM Start FastAPI Backend
REM ============================================
echo [INFO] Setting up FastAPI backend...
cd FastAPI

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing/updating Python dependencies...
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

echo [OK] Backend dependencies installed.

REM Start backend server in new window
echo [INFO] Starting FastAPI server on http://127.0.0.1:8000
echo        API Documentation: http://127.0.0.1:8000/docs
start "FastAPI Backend" cmd /k "venv\Scripts\activate.bat && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM ============================================
REM Start React Frontend
REM ============================================
echo.
echo [INFO] Setting up React frontend...
cd ..\React\finance-app

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
    echo [OK] Frontend dependencies installed.
) else (
    echo [OK] Frontend dependencies found.
)

echo [INFO] Starting React development server on http://localhost:3000
start "React Frontend" cmd /k "npm run dev"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

REM ============================================
REM Summary
REM ============================================
cd ..\..
echo.
echo ==========================================
echo [OK] Application started successfully!
echo ==========================================
echo.
echo Access points:
echo    Frontend: http://localhost:3000
echo    Backend API: http://127.0.0.1:8000
echo    API Docs: http://127.0.0.1:8000/docs
echo.
echo [INFO] Both servers are running in separate windows.
echo        Close those windows to stop the servers.
echo.
pause

