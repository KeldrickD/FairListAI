const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in the right directory
const workingDir = process.cwd();
console.log('Current working directory:', workingDir);

// Function to run a command and log output
function runCommand(command, cwd = workingDir) {
  console.log(`Running command: ${command}`);
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Create necessary directories
const clientDistDir = path.join(workingDir, 'client', 'dist');
if (!fs.existsSync(clientDistDir)) {
  fs.mkdirSync(clientDistDir, { recursive: true });
}

// Copy static fallback page
const staticHtml = path.join(workingDir, 'client', 'public', 'index.html');
if (fs.existsSync(staticHtml)) {
  fs.copyFileSync(staticHtml, path.join(clientDistDir, 'index.html'));
}

// Install dependencies
console.log('Installing dependencies...');
runCommand('npm install --no-save');
runCommand('npm install --no-save', path.join(workingDir, 'client'));

// Build the client
console.log('Building client...');
runCommand('npm run build', path.join(workingDir, 'client'));

// Create a simple API endpoint for health check
const apiDir = path.join(clientDistDir, 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

const healthCheck = path.join(apiDir, 'health.js');
fs.writeFileSync(healthCheck, `
module.exports = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: 'static'
  });
};
`);

console.log('Build completed successfully!'); 