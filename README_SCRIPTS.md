# Startup Scripts Guide

This project includes convenient startup scripts to run both the FastAPI backend and React frontend together.

## Available Scripts

### Unix/Linux/macOS/Git Bash

**Start both servers:**
```bash
./start-app.sh
```

**Stop both servers:**
```bash
./stop-app.sh
```

### Windows

**Start both servers:**
```cmd
start-app.bat
```

**Stop servers:**
- Close the command windows that were opened
- Or use Task Manager to kill the processes

## What the Scripts Do

### `start-app.sh` / `start-app.bat`

1. **Checks ports** - Verifies ports 8000 and 3000 are available
2. **Sets up Backend:**
   - Creates virtual environment if it doesn't exist
   - Activates virtual environment
   - Installs/updates Python dependencies
   - Starts FastAPI server on http://127.0.0.1:8000

3. **Sets up Frontend:**
   - Checks for node_modules
   - Installs Node.js dependencies if needed
   - Starts React development server on http://localhost:3000

4. **Provides access information:**
   - Frontend URL
   - Backend API URL
   - API documentation URL

### `stop-app.sh`

- Stops both backend and frontend servers
- Cleans up PID files
- Optionally removes log files

## Log Files

When running with `start-app.sh`, logs are saved to:
- `backend.log` - FastAPI server logs
- `frontend.log` - React/Vite server logs

## Process IDs

PID files are created for process management:
- `backend.pid` - Backend server process ID
- `frontend.pid` - Frontend server process ID

## Manual Startup (Alternative)

If you prefer to start servers manually:

**Terminal 1 - Backend:**
```bash
cd FastAPI
source venv/bin/activate  # or: venv\Scripts\activate on Windows
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd React/finance-app
npm run dev
```

## Troubleshooting

### Script Permission Denied (Unix/Linux/macOS)

Make scripts executable:
```bash
chmod +x start-app.sh stop-app.sh
```

### Port Already in Use

If ports 8000 or 3000 are already in use:
- Stop existing servers
- Or modify the port in the scripts/config files

### Scripts Not Working on Windows

- Use `start-app.bat` instead of `.sh` files
- Or use Git Bash/WSL to run `.sh` files

### Servers Not Starting

Check the log files:
- `backend.log` for backend errors
- `frontend.log` for frontend errors

## Notes

- The scripts run servers in the background (Unix) or separate windows (Windows)
- Servers will continue running even if you close the terminal
- Use `stop-app.sh` to properly stop all servers

