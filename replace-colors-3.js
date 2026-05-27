const fs = require('fs');
const path = require('path');

const map = {
  '#e5f7fa': 'brand-light-subtle-bg',
  '#d8f3f6': 'brand-subtle-bg',
  '#eeeeee': 'tertiary-b',
  '#666666': 'secondary-text',
  '#a3a3a3': 'disabled-text',
  '#5c5e64': 'secondary-text',
  '#e6f4f5': 'brand-subtle-bg',
  '#e5e7eb': 'tertiary-b',
  '#d1d5db': 'secondary-b',
  '#9ca3af': 'disabled-text',
  '#f0fafb': 'brand-light-subtle-bg',
  '#054f59': 'brand-active-bg',
  '#999999': 'disabled-text',
  '#fefefe': 'span-text',
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
