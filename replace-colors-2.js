const fs = require('fs');
const path = require('path');

const map = {
  '#3a3a3a': 'secondary-text',
  '#9f2b2b': 'negative-text',
  '#2d2d2d': 'secondary-b',
  '#d0d5dd': 'secondary-b',
  '#f8fafc': 'secondary-bg',
  '#e9ffe9': 'positive-subtle-bg',
  '#087a32': 'positive-bold-text',
  '#d92d20': 'negative-text',
  '#f04438': 'warning-b',
  '#e5e5e5': 'tertiary-b',
  '#6b7280': 'secondary-text',
  '#fbfbfb': 'primary-bg',
  '#f2fdfe': 'brand-light-subtle-bg',
  '#111111': 'primary-text',
  '#00798c': 'brand-text',
  '#737373': 'tertiary-text',
  '#dbeff2': 'brand-subtle-bg',
  '#8c8c8c': 'tertiary-text',
  '#4b5563': 'secondary-text',
  '#e2e8f0': 'secondary-b',
  '#8850ee': 'brand-bg', 
  '#c3e2e5': 'brand-subtle-b',
  '#8c8f98': 'secondary-b',
  '#f0f0f0': 'secondary-bg',
  '#ff3158': 'negative-text',
  '#a72e2e': 'negative-bold-text',
  '#9acbd1': 'disabled-bg',
  '#e5f4f6': 'brand-light-subtle-bg',
  '#f5f5f5': 'secondary-bg',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  const regex = /(?:([a-z:-]+))?(text|bg|border|ring|placeholder)-\[\s*(#[0-9a-fA-F]{3,8})\s*\]/g;
  
  content = content.replace(regex, (match, variants, prefix, hex) => {
    hex = hex.toLowerCase();
    if (hex.length === 4) {
      hex = '#' + hex[1]+hex[1] + hex[2]+hex[2] + hex[3]+hex[3];
    }
    let cleanHex = hex.slice(0, 7);
    
    if (map[cleanHex]) {
        return `${variants || ''}${prefix}-${map[cleanHex]}`;
    }
    return match; 
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
