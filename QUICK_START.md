# Quick Start Guide

Get up and running with the FastAPI-React Finance App in minutes!

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## 5-Minute Setup

### 1. Backend Setup (2 minutes)

```bash
# Navigate to FastAPI directory
cd FastAPI

# Create and activate virtual environment
python -m venv env
env\Scripts\activate  # Windows
# or
source env/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

✅ Backend running at http://localhost:8000

### 2. Frontend Setup (2 minutes)

```bash
# Open a new terminal, navigate to React app
cd React/finance-app

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at http://localhost:3000

### 3. Verify Installation (1 minute)

1. Open http://localhost:3000 in your browser
2. You should see the Finance App interface
3. Try adding a transaction:
   - Amount: 100
   - Category: Food
   - Description: Test
   - Date: Today's date
   - Click Submit

✅ If the transaction appears in the table, everything is working!

## Next Steps

- **View API Docs**: http://localhost:8000/docs
- **Run Tests**: See main README.md
- **Customize**: Edit `.env` files for configuration

## Troubleshooting

**Backend won't start?**
- Check if port 8000 is available
- Ensure virtual environment is activated
- Verify Python version: `python --version`

**Frontend won't start?**
- Check if port 3000 is available
- Run `npm install` again
- Clear node_modules and reinstall if needed

**Can't connect to API?**
- Ensure backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS settings in backend

## Need Help?

See the main [README.md](README.md) for detailed documentation.

