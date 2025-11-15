# Cleanup Guide

After migrating from Create React App to Vite, you may want to remove old CRA-specific files that are no longer needed.

## Files That Can Be Safely Removed

### React App (React/finance-app/)

The following files are from Create React App and are no longer needed:

```
React/finance-app/
├── src/
│   ├── api.js              # Old API file (replaced by src/api/api.js)
│   ├── App.js              # Old App file (replaced by App.jsx)
│   ├── App.css             # Old CSS (replaced by Tailwind)
│   ├── App.test.js         # Old test (replaced by __tests__/App.test.jsx)
│   ├── index.js            # Old entry point (replaced by main.jsx)
│   ├── logo.svg            # CRA logo (not used)
│   ├── reportWebVitals.js  # CRA specific (not needed)
│   └── setupTests.js       # Old test setup (replaced by src/test/setup.js)
├── public/
│   ├── index.html          # Old HTML (replaced by root index.html)
│   ├── manifest.json       # PWA manifest (optional, can keep if needed)
│   └── robots.txt          # (optional, can keep)
└── README.md               # Old CRA README (replaced by new README.md)
```

## Cleanup Script (Optional)

You can manually remove these files or use this as a reference:

**Windows:**
```cmd
cd React\finance-app
del src\api.js
del src\App.js
del src\App.css
del src\App.test.js
del src\index.js
del src\logo.svg
del src\reportWebVitals.js
del src\setupTests.js
```

**macOS/Linux:**
```bash
cd React/finance-app
rm src/api.js
rm src/App.js
rm src/App.css
rm src/App.test.js
rm src/index.js
rm src/logo.svg
rm src/reportWebVitals.js
rm src/setupTests.js
```

## Important Notes

1. **Backup First**: If you're unsure, make a backup before deleting files
2. **Git**: These files are likely already in git history, so you can always recover them
3. **Gradual Cleanup**: You can remove files gradually as you verify everything works
4. **Public Folder**: The `public/` folder may still contain assets you want to keep (like favicon)

## Verification

After cleanup, verify everything still works:

```bash
# Frontend
cd React/finance-app
npm run dev

# Tests
npm test
npm run e2e
```

## What to Keep

- `node_modules/` - Dependencies (don't delete)
- `.gitignore` - Git configuration
- `package.json` - Dependencies and scripts
- All new Vite files (vite.config.js, etc.)
- All new component files in `src/components/`
- Test files in `src/__tests__/` and `e2e/`

## FastAPI Cleanup

The FastAPI directory is clean, but you may want to remove:

- `__pycache__/` directories (auto-generated, can be removed)
- Old database files if starting fresh (backup first!)

```bash
# Remove Python cache
cd FastAPI
find . -type d -name __pycache__ -exec rm -r {} +  # macOS/Linux
# or manually delete __pycache__ folders on Windows
```

