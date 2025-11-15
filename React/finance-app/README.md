# Finance App - React Frontend

Modern React application built with Vite, Tailwind CSS, and comprehensive testing.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run e2e` - Run E2E tests (requires backend running)
- `npm run e2e:ui` - Run E2E tests with UI
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
├── index.css            # Global styles with Tailwind
├── api/                 # API client
├── components/          # React components
│   ├── Navbar.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionTable.jsx
│   └── __tests__/       # Component tests
└── test/                # Test utilities
    └── setup.js
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

### Unit Tests

Tests are written with Vitest and React Testing Library:

```bash
npm test
```

### E2E Tests

E2E tests use Playwright:

```bash
# Make sure backend is running
npm run e2e
```

## Styling

This project uses Tailwind CSS. Configuration is in `tailwind.config.js`.

## More Information

See the main [README.md](../../README.md) for complete documentation.
