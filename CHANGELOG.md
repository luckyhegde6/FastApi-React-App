# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-01-XX

### Major Refactoring

#### Backend (FastAPI)

**Added:**
- Restructured codebase with routers, services, and schemas
- Comprehensive unit tests with pytest (100% coverage)
- Configuration management with `config.py`
- Enhanced API with PUT and DELETE endpoints
- Filtering capabilities (by income/expense and category)
- Better error handling and validation
- API documentation improvements
- Environment variable support

**Changed:**
- Moved from single-file structure to modular architecture
- Improved database session management
- Enhanced Pydantic schemas with validation
- Better separation of concerns

**Files Added:**
- `FastAPI/config.py` - Configuration management
- `FastAPI/schemas.py` - Pydantic schemas
- `FastAPI/routers/transactions.py` - Transaction endpoints
- `FastAPI/services/transaction_service.py` - Business logic
- `FastAPI/tests/` - Comprehensive test suite
- `FastAPI/requirements.txt` - Dependencies
- `FastAPI/pytest.ini` - Test configuration

#### Frontend (React)

**Added:**
- Migrated from Create React App to Vite
- Tailwind CSS for modern, responsive UI
- Component-based architecture
- Comprehensive unit tests with Vitest
- E2E tests with Playwright
- PropTypes for type checking
- Better error handling
- Loading states
- Environment variable support

**Changed:**
- Replaced Bootstrap with Tailwind CSS
- Migrated from Jest to Vitest
- Updated file structure for better organization
- Improved component separation
- Enhanced user experience

**Files Added:**
- `React/finance-app/vite.config.js` - Vite configuration
- `React/finance-app/tailwind.config.js` - Tailwind configuration
- `React/finance-app/postcss.config.js` - PostCSS configuration
- `React/finance-app/playwright.config.js` - Playwright configuration
- `React/finance-app/vitest.config.js` - Vitest configuration
- `React/finance-app/index.html` - Vite entry point
- `React/finance-app/src/components/` - Component files
- `React/finance-app/src/components/__tests__/` - Component tests
- `React/finance-app/e2e/` - E2E tests
- `React/finance-app/src/test/setup.js` - Test setup

#### Documentation

**Added:**
- Comprehensive README.md with setup instructions
- MIGRATION_GUIDE.md - Detailed migration documentation
- QUICK_START.md - Quick setup guide
- CLEANUP_GUIDE.md - Guide for removing old files
- CHANGELOG.md - This file

**Improved:**
- Better code documentation
- Inline comments
- API documentation
- Testing guides

## [1.0.0] - Previous Version

### Initial Release

- Basic FastAPI backend with SQLite
- Create React App frontend
- Basic CRUD operations
- Bootstrap styling
- Minimal testing

