const { execSync } = require('child_process');
const fs = require('fs');

// Log environment information
console.log('Node version:', process.version);
console.log('NPM version:', execSync('npm --version').toString().trim());
console.log('Current directory:', process.cwd());

// List installed packages
console.log('Installed packages:');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  console.log('Dependencies:', Object.keys(packageJson.dependencies || {}).join(', '));
  console.log('DevDependencies:', Object.keys(packageJson.devDependencies || {}).join(', '));
} catch (error) {
  console.error('Error reading package.json:', error);
}

// Try to build the project
console.log('\nAttempting to build the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 