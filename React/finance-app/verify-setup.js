/**
 * Verification script to check if the app setup is correct
 * Run this before starting the servers
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying FastAPI-React App Setup...\n');

let hasErrors = false;

// Check FastAPI setup
console.log('📦 Checking FastAPI setup...');
const fastapiPath = path.join(__dirname, '..', '..', 'FastAPI');
const fastapiRequirements = path.join(fastapiPath, 'requirements.txt');
const fastapiMain = path.join(fastapiPath, 'main.py');

if (fs.existsSync(fastapiRequirements)) {
  console.log('  ✅ requirements.txt exists');
} else {
  console.log('  ❌ requirements.txt not found');
  hasErrors = true;
}

if (fs.existsSync(fastapiMain)) {
  console.log('  ✅ main.py exists');
} else {
  console.log('  ❌ main.py not found');
  hasErrors = true;
}

// Check React setup
console.log('\n⚛️  Checking React setup...');
const packageJson = path.join(__dirname, 'package.json');
const viteConfig = path.join(__dirname, 'vite.config.js');
const tailwindConfig = path.join(__dirname, 'tailwind.config.js');
const playwrightConfig = path.join(__dirname, 'playwright.config.js');

if (fs.existsSync(packageJson)) {
  console.log('  ✅ package.json exists');
  const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  if (pkg.dependencies.vite || pkg.devDependencies.vite) {
    console.log('  ✅ Vite is configured');
  } else {
    console.log('  ⚠️  Vite not found in dependencies');
  }
} else {
  console.log('  ❌ package.json not found');
  hasErrors = true;
}

if (fs.existsSync(viteConfig)) {
  console.log('  ✅ vite.config.js exists');
} else {
  console.log('  ❌ vite.config.js not found');
  hasErrors = true;
}

if (fs.existsSync(tailwindConfig)) {
  console.log('  ✅ tailwind.config.js exists');
} else {
  console.log('  ❌ tailwind.config.js not found');
  hasErrors = true;
}

// Check test setup
console.log('\n🧪 Checking test setup...');
const e2eDir = path.join(__dirname, 'e2e');
const e2eTest = path.join(e2eDir, 'app.spec.js');

if (fs.existsSync(e2eDir)) {
  console.log('  ✅ e2e directory exists');
} else {
  console.log('  ❌ e2e directory not found');
  hasErrors = true;
}

if (fs.existsSync(e2eTest)) {
  console.log('  ✅ e2e/app.spec.js exists');
} else {
  console.log('  ❌ e2e/app.spec.js not found');
  hasErrors = true;
}

if (fs.existsSync(playwrightConfig)) {
  console.log('  ✅ playwright.config.js exists');
} else {
  console.log('  ❌ playwright.config.js not found');
  hasErrors = true;
}

// Check source files
console.log('\n📁 Checking source files...');
const srcDir = path.join(__dirname, 'src');
const appJsx = path.join(srcDir, 'App.jsx');
const mainJsx = path.join(srcDir, 'main.jsx');
const componentsDir = path.join(srcDir, 'components');

if (fs.existsSync(appJsx)) {
  console.log('  ✅ src/App.jsx exists');
} else {
  console.log('  ❌ src/App.jsx not found');
  hasErrors = true;
}

if (fs.existsSync(mainJsx)) {
  console.log('  ✅ src/main.jsx exists');
} else {
  console.log('  ❌ src/main.jsx not found');
  hasErrors = true;
}

if (fs.existsSync(componentsDir)) {
  console.log('  ✅ src/components directory exists');
  const components = fs.readdirSync(componentsDir);
  console.log(`  📦 Found ${components.length} component(s)`);
} else {
  console.log('  ❌ src/components directory not found');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup verification found some issues.');
  console.log('Please check the errors above and fix them.');
  process.exit(1);
} else {
  console.log('✅ Setup verification passed!');
  console.log('\n📋 Next steps:');
  console.log('  1. Install backend dependencies:');
  console.log('     cd FastAPI && python -m venv env && env\\Scripts\\activate && pip install -r requirements.txt');
  console.log('  2. Install frontend dependencies:');
  console.log('     cd React/finance-app && npm install');
  console.log('  3. Start backend:');
  console.log('     cd FastAPI && uvicorn main:app --reload');
  console.log('  4. Start frontend:');
  console.log('     cd React/finance-app && npm run dev');
  console.log('  5. Run E2E tests:');
  console.log('     cd React/finance-app && npm run e2e');
  process.exit(0);
}

