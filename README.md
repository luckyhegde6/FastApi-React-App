# FastAPI-React Finance App

A modern full-stack finance management application built with FastAPI (backend) and React with Vite (frontend). This application allows users to track their income and expenses with a clean, responsive interface.

## 🚀 Features

- **Backend (FastAPI)**
  - RESTful API for transaction management
  - SQLite database with SQLAlchemy ORM
  - Comprehensive input validation with Pydantic
  - Full CRUD operations for transactions
  - Filtering and pagination support
  - Comprehensive unit test coverage

- **Frontend (React + Vite)**
  - Modern React with Vite for fast development
  - Tailwind CSS for beautiful, responsive UI
  - Component-based architecture
  - Form validation and error handling
  - Real-time transaction display
  - Comprehensive unit and E2E test coverage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js

## 🛠️ Installation & Setup

### Backend Setup (FastAPI)

1. **Navigate to the FastAPI directory:**
   ```bash
   cd FastAPI
   ```

2. **Create a virtual environment:**
   
   **Windows:**
   ```bash
   python -m venv venv
   ```
   
   **macOS/Linux:**
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment:**
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables (optional):**
   
   Copy the example environment file:
   ```bash
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # macOS/Linux
   ```
   
   Edit `.env` to customize settings if needed.

6. **Initialize the database:**
   
   The database will be created automatically when you run the application. The database file (`finance.db`) will be created in the `FastAPI` directory.

### Frontend Setup (React)

1. **Navigate to the React app directory:**
   ```bash
   cd React/finance-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   
   Copy the example environment file:
   ```bash
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # macOS/Linux
   ```
   
   The default API URL is `http://localhost:8000`. Modify `.env` if your backend runs on a different port.

## 🏃 Running the Application

### Quick Start (Recommended)

**Start both servers with one command:**

**Unix/Linux/macOS/Git Bash:**
```bash
./start-app.sh
```

**Windows:**
```cmd
start-app.bat
```

This will automatically:
- Set up and start the FastAPI backend on http://127.0.0.1:8000
- Set up and start the React frontend on http://localhost:3000
- Install dependencies if needed

**Stop servers:**
```bash
./stop-app.sh  # Unix/Linux/macOS
# Or close the windows on Windows
```

See [README_SCRIPTS.md](README_SCRIPTS.md) for detailed script documentation.

### Manual Startup

#### Start the Backend

1. **Activate your virtual environment** (if not already activated):
   
   **Windows:**
   ```bash
   cd FastAPI
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   cd FastAPI
   source venv/bin/activate
   ```

2. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```
   
   The API will be available at:
   - **API**: http://127.0.0.1:8000
   - **Interactive API Docs (Swagger)**: http://127.0.0.1:8000/docs
   - **Alternative API Docs (ReDoc)**: http://127.0.0.1:8000/redoc

#### Start the Frontend

1. **Open a new terminal** and navigate to the React app:
   ```bash
   cd React/finance-app
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at: http://localhost:3000

### Production Build

#### Build the Frontend

```bash
cd React/finance-app
npm run build
```

The production build will be in the `dist` directory.

#### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Backend Tests

1. **Navigate to the FastAPI directory:**
   ```bash
   cd FastAPI
   ```

2. **Activate your virtual environment** (if not already activated)

3. **Run tests:**
   ```bash
   pytest
   ```

4. **Run tests with coverage:**
   ```bash
   pytest --cov=. --cov-report=html
   ```
   
   Coverage report will be generated in `htmlcov/index.html`

5. **Run specific test file:**
   ```bash
   pytest tests/test_transactions.py
   ```

### Frontend Tests

1. **Navigate to the React app directory:**
   ```bash
   cd React/finance-app
   ```

2. **Run unit tests:**
   ```bash
   npm test
   ```

3. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

4. **Run tests with UI:**
   ```bash
   npm run test:ui
   ```

5. **Run E2E tests:**
   
   Make sure both backend and frontend are running, then:
   ```bash
   npm run e2e
   ```

6. **Run E2E tests with UI:**
   ```bash
   npm run e2e:ui
   ```

## 📁 Project Structure

```
FastApi-React-App/
├── FastAPI/                    # Backend application
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection and session management
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas for validation
│   ├── requirements.txt       # Python dependencies
│   ├── pytest.ini             # Pytest configuration
│   ├── .env.example           # Example environment variables
│   ├── routers/               # API route handlers
│   │   ├── __init__.py
│   │   └── transactions.py   # Transaction endpoints
│   ├── services/              # Business logic layer
│   │   ├── __init__.py
│   │   └── transaction_service.py
│   └── tests/                 # Test files
│       ├── __init__.py
│       ├── conftest.py        # Pytest fixtures
│       ├── test_transactions.py
│       └── test_services.py
│
├── React/
│   └── finance-app/           # Frontend application
│       ├── src/
│       │   ├── App.jsx        # Main application component
│       │   ├── main.jsx       # Application entry point
│       │   ├── index.css      # Global styles with Tailwind
│       │   ├── api/           # API client
│       │   │   └── api.js
│       │   ├── components/    # React components
│       │   │   ├── Navbar.jsx
│       │   │   ├── TransactionForm.jsx
│       │   │   ├── TransactionTable.jsx
│       │   │   └── __tests__/ # Component tests
│       │   └── test/          # Test utilities
│       │       └── setup.js
│       ├── e2e/               # E2E tests (Playwright)
│       │   └── app.spec.js
│       ├── package.json       # Node dependencies
│       ├── vite.config.js    # Vite configuration
│       ├── tailwind.config.js # Tailwind CSS configuration
│       ├── playwright.config.js # Playwright configuration
│       └── .env.example       # Example environment variables
│
└── README.md                  # This file
```

## 🔌 API Endpoints

### Transactions

- `GET /transactions` - Get all transactions
  - Query parameters:
    - `skip` (int, default: 0) - Number of records to skip
    - `limit` (int, default: 100) - Maximum records to return
    - `is_income` (bool, optional) - Filter by income/expense
    - `category` (string, optional) - Filter by category

- `GET /transactions/{transaction_id}` - Get a specific transaction

- `POST /transactions/` - Create a new transaction
  - Request body:
    ```json
    {
      "amount": 100.50,
      "category": "Food",
      "description": "Lunch",
      "is_income": false,
      "date": "2024-01-15"
    }
    ```

- `PUT /transactions/{transaction_id}` - Update a transaction
  - Request body: (all fields optional)
    ```json
    {
      "amount": 200.0,
      "description": "Updated description"
    }
    ```

- `DELETE /transactions/{transaction_id}` - Delete a transaction

### Other Endpoints

- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## 🎨 Frontend Features

### Components

- **Navbar**: Application header with title
- **TransactionForm**: Form for creating new transactions with validation
- **TransactionTable**: Displays all transactions in a responsive table format

### Styling

The application uses **Tailwind CSS** for styling, providing:
- Responsive design
- Modern, clean UI
- Consistent color scheme
- Accessible components

## 🔧 Configuration

### Backend Configuration

Edit `FastAPI/.env` (create from `.env.example`) to customize:
- Database URL
- API settings
- CORS origins
- Environment mode

### Frontend Configuration

Edit `React/finance-app/.env` (create from `.env.example`) to customize:
- API base URL (default: `http://localhost:8000`)

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
- Change the port: `uvicorn main:app --reload --port 8001`

**Database errors:**
- Delete `finance.db` and restart the server to recreate the database

**Import errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Port already in use:**
- Vite will automatically try the next available port
- Or specify a port in `vite.config.js`

**API connection errors:**
- Ensure backend is running on `http://localhost:8000`
- Check `VITE_API_BASE_URL` in `.env`

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📝 Development Guidelines

### Code Style

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: ESLint configuration is included

### Adding New Features

1. **Backend:**
   - Add models in `models.py`
   - Create schemas in `schemas.py`
   - Implement service logic in `services/`
   - Add routes in `routers/`
   - Write tests in `tests/`

2. **Frontend:**
   - Create components in `src/components/`
   - Add tests in `__tests__/` directories
   - Update API client in `src/api/`

### Testing Best Practices

- Write tests for all new features
- Maintain test coverage above 80%
- Test both success and error cases
- Use descriptive test names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React and Vite for the modern frontend tooling
- Tailwind CSS for the utility-first CSS framework
- All contributors and open-source libraries used in this project

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Happy coding! 🚀**
