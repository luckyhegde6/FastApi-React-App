# Migration Guide

This guide documents the major refactoring changes made to the FastAPI-React-App project.

## Overview

The project has been completely refactored with:
- **Backend**: Better structure with routers, services, schemas, and comprehensive tests
- **Frontend**: Migrated from Create React App to Vite, added Tailwind CSS, improved component structure, and added comprehensive tests

## Backend Changes (FastAPI)

### New Structure

```
FastAPI/
├── main.py                 # Application entry point
├── config.py               # Configuration management
├── database.py             # Database setup
├── models.py              # SQLAlchemy models
├── schemas.py             # Pydantic schemas
├── routers/               # API route handlers
│   └── transactions.py
├── services/              # Business logic
│   └── transaction_service.py
└── tests/                 # Test suite
    ├── conftest.py
    ├── test_transactions.py
    └── test_services.py
```

### Key Improvements

1. **Separation of Concerns**
   - Routes in `routers/` directory
   - Business logic in `services/` directory
   - Data validation with Pydantic schemas
   - Configuration management with `config.py`

2. **Enhanced API**
   - Added PUT and DELETE endpoints
   - Filtering by `is_income` and `category`
   - Better error handling
   - Comprehensive API documentation

3. **Testing**
   - Full test coverage with pytest
   - Test fixtures in `conftest.py`
   - Unit tests for services
   - Integration tests for endpoints

### Migration Steps

1. **Update dependencies:**
   ```bash
   cd FastAPI
   pip install -r requirements.txt
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

3. **Run tests:**
   ```bash
   pytest
   ```

## Frontend Changes (React)

### Migration from CRA to Vite

The React app has been migrated from Create React App to Vite for:
- Faster development server
- Better build performance
- Modern tooling
- Improved developer experience

### New Structure

```
React/finance-app/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css          # Tailwind CSS imports
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionTable.jsx
│   │   └── __tests__/
│   └── test/
│       └── setup.js
├── e2e/                   # Playwright E2E tests
│   └── app.spec.js
├── index.html            # Vite entry point
├── vite.config.js
├── tailwind.config.js
└── playwright.config.js
```

### Key Improvements

1. **Vite Migration**
   - Replaced `react-scripts` with Vite
   - Updated entry point from `index.js` to `main.jsx`
   - New `index.html` in root directory
   - Faster HMR (Hot Module Replacement)

2. **Tailwind CSS**
   - Replaced Bootstrap with Tailwind CSS
   - Utility-first CSS approach
   - Responsive design
   - Modern, clean UI

3. **Component Refactoring**
   - Separated components into individual files
   - Added PropTypes for type checking
   - Better error handling
   - Improved user experience

4. **Testing**
   - Migrated from Jest to Vitest
   - Comprehensive unit tests
   - E2E tests with Playwright
   - Test coverage reporting

### Migration Steps

1. **Remove old CRA files:**
   ```bash
   cd React/finance-app
   # Remove old CRA-specific files if they exist
   ```

2. **Install new dependencies:**
   ```bash
   npm install
   ```

3. **Update environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   # Unit tests
   npm test
   
   # E2E tests (requires backend running)
   npm run e2e
   ```

### Breaking Changes

1. **File Extensions**
   - Changed from `.js` to `.jsx` for React components
   - Entry point changed from `index.js` to `main.jsx`

2. **API Client**
   - Moved from `src/api.js` to `src/api/api.js`
   - Uses environment variable `VITE_API_BASE_URL`

3. **Styling**
   - Removed Bootstrap classes
   - All styling now uses Tailwind CSS classes
   - Custom CSS moved to `index.css` with Tailwind directives

4. **Testing**
   - Test files use Vitest instead of Jest
   - Setup file location changed to `src/test/setup.js`

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=sqlite:///./finance.db
API_TITLE=Finance API
API_VERSION=1.0.0
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
ENVIRONMENT=development
DEBUG=true
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

### Backend Tests

```bash
cd FastAPI
pytest                    # Run all tests
pytest --cov=.            # With coverage
pytest tests/test_transactions.py  # Specific test file
```

### Frontend Tests

```bash
cd React/finance-app
npm test                  # Unit tests
npm run test:coverage     # With coverage
npm run test:ui          # Interactive UI
npm run e2e              # E2E tests
npm run e2e:ui           # E2E with UI
```

## Common Issues

### Backend

**Issue**: Import errors after refactoring
- **Solution**: Ensure virtual environment is activated and dependencies are installed

**Issue**: Database not found
- **Solution**: Database is created automatically on first run

### Frontend

**Issue**: Module not found errors
- **Solution**: Run `npm install` to install all dependencies

**Issue**: Tailwind styles not applying
- **Solution**: Ensure `index.css` has Tailwind directives and PostCSS is configured

**Issue**: API connection errors
- **Solution**: Check `VITE_API_BASE_URL` in `.env` and ensure backend is running

## Next Steps

1. Review the new code structure
2. Run all tests to ensure everything works
3. Update any custom configurations as needed
4. Deploy using the new build commands

## Support

For issues or questions about the migration, please refer to:
- Main README.md for setup instructions
- Test files for usage examples
- API documentation at `/docs` endpoint when backend is running

