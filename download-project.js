#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a write stream for the zip file
const output = fs.createWriteStream('resume-builder-complete.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Pipe archive data to the file
archive.pipe(output);

// Include all important project files
const filesToInclude = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'postcss.config.js',
  'components.json',
  'drizzle.config.ts',
  'replit.md',
  'client/',
  'server/',
  'shared/',
  '.gitignore'
];

filesToInclude.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      archive.directory(filePath, file);
    } else {
      archive.file(filePath, { name: file });
    }
  }
});

// Finalize the archive
archive.finalize();

output.on('close', () => {
  console.log(`✅ Project packaged successfully!`);
  console.log(`📦 File size: ${archive.pointer()} bytes`);
  console.log(`📁 Download: resume-builder-complete.zip`);
});

archive.on('error', (err) => {
  console.error('❌ Error creating archive:', err);
});