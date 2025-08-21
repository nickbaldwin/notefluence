#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting development server with CSS verification...');

// Check if .next directory exists and has CSS files
const nextDir = path.join(__dirname, '..', '.next');
const cssDir = path.join(nextDir, 'static', 'css');

function checkCssFiles() {
  if (!fs.existsSync(nextDir)) {
    console.log('📦 No .next directory found, running initial build...');
    return false;
  }
  
  if (!fs.existsSync(cssDir)) {
    console.log('🎨 No CSS directory found, rebuilding...');
    return false;
  }
  
  const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found, rebuilding...');
    return false;
  }
  
  console.log(`✅ Found ${cssFiles.length} CSS file(s), starting dev server...`);
  return true;
}

function startDevServer() {
  console.log('🌐 Starting Next.js development server...');
  
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..')
  });
  
  devProcess.on('error', (error) => {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
  });
  
  devProcess.on('close', (code) => {
    console.log(`\n🛑 Development server stopped with code ${code}`);
    process.exit(code);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    devProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development server...');
    devProcess.kill('SIGTERM');
  });
}

// Main execution
if (!checkCssFiles()) {
  console.log('🔨 Running build to ensure CSS is bundled...');
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..')
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Build completed successfully');
      startDevServer();
    } else {
      console.error('❌ Build failed');
      process.exit(code);
    }
  });
} else {
  startDevServer();
}
