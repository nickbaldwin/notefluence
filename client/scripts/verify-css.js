#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying CSS bundling...');

// Check if .next directory exists
const nextDir = path.join(__dirname, '..', '.next');
if (!fs.existsSync(nextDir)) {
  console.error('❌ .next directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check for CSS files
const cssFiles = [];
function findCssFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findCssFiles(filePath);
    } else if (file.endsWith('.css')) {
      cssFiles.push(filePath);
    }
  });
}

findCssFiles(nextDir);

if (cssFiles.length === 0) {
  console.error('❌ No CSS files found in .next directory');
  process.exit(1);
}

console.log(`✅ Found ${cssFiles.length} CSS file(s):`);
cssFiles.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  const size = fs.statSync(file).size;
  console.log(`   📄 ${relativePath} (${size} bytes)`);
});

// Check if CSS contains Tailwind classes
const mainCssFile = cssFiles.find(file => file.includes('static/css'));
if (mainCssFile) {
  const content = fs.readFileSync(mainCssFile, 'utf8');
  const bgClasses = (content.match(/\.bg-/g) || []).length;
  const textClasses = (content.match(/\.text-/g) || []).length;
  const flexClasses = (content.match(/\.flex/g) || []).length;
  
  console.log(`\n🎨 CSS Analysis:`);
  console.log(`   Background classes: ${bgClasses}`);
  console.log(`   Text classes: ${textClasses}`);
  console.log(`   Flex classes: ${flexClasses}`);
  
  if (bgClasses > 0 && textClasses > 0) {
    console.log('✅ CSS appears to be properly bundled with Tailwind classes');
  } else {
    console.warn('⚠️  CSS may not contain expected Tailwind classes');
  }
}

console.log('\n🎉 CSS verification complete!');
