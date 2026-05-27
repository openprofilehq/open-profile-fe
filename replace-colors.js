const fs = require('fs');
const path = require('path');

const hexMap = {
  // text colors
  '#050505': 'primary-text',
  '#454545': 'secondary-text',
  '#747474': 'tertiary-text',
  '#e8e8e8': 'inverse-text',
  '#a2a2a2': 'disabled-text',
  '#0a92a4': 'brand-text',
  '#daf2f5': 'brand-subtle-text',
  '#087583': 'link-hover-text', // Or brand-hover-bg
  '#065862': 'link-active-text',
  '#043a42': 'info-bold-text',
  '#fd6c01': 'notice-text',
  '#6e2f00': 'notice-bold-text',
  '#ff4d4d': 'negative-text',
  '#7c1f1f': 'negative-bold-text',
  '#31e47f': 'positive-text',
  '#145b33': 'positive-bold-text',
  '#171717': 'selected-text',
  '#fefefe': 'span-text',
  '#e6e6e6': 'span-text-100',

  // bg colors
  '#fafafa': 'primary-bg',
  '#f6f6f6': 'secondary-bg',
  '#f1f1f1': 'hover-bg',
  '#ededed': 'active-bg',
  '#065e69': 'button-brand-bg', // Or brand
  '#f1fdfe': 'brand-light-subtle-bg',
  '#95d2da': 'info-bg',
  '#c3e8ec': 'info-hover-bg',
  '#ffe8d7': 'notice-subtle-bg',
  '#fea360': 'notice-hover-bg',
  '#ffeded': 'negative-subtle-bg',
  '#ff9494': 'negative-hover-bg',
  '#eafcf2': 'positive-subtle-bg',
  '#83efb2': 'positive-hover-bg',
  '#262626': 'button-bg-waitlist',

  // border colors
  '#ababab': 'primary-b',
  '#c9c9c9': 'secondary-b',
};

// Also we want to correctly replace tailwind utility prefixes:
// bg-[#050505] -> bg-primary-text is wrong, it should be bg-something.
// Let's refine the map by prefix.
const textMap = {
  '#050505': 'primary-text',
  '#454545': 'secondary-text',
  '#747474': 'tertiary-text',
  '#e8e8e8': 'inverse-text',
  '#a2a2a2': 'disabled-text',
  '#0a92a4': 'brand-text',
  '#daf2f5': 'brand-subtle-text',
  '#087583': 'link-hover-text',
  '#065862': 'link-active-text',
  '#043a42': 'info-bold-text',
  '#fd6c01': 'notice-text',
  '#6e2f00': 'notice-bold-text',
  '#ff4d4d': 'negative-text',
  '#7c1f1f': 'negative-bold-text',
  '#31e47f': 'positive-text',
  '#145b33': 'positive-bold-text',
  '#171717': 'selected-text',
  '#fefefe': 'span-text',
  '#e6e6e6': 'span-text-100',
  '#9F2B2B': 'negative-text', // mapping to negative
  '#3A3A3A': 'secondary-text',
  '#6B7280': 'secondary-text', // extra mapping for common gray
  '#202020': 'primary-text',
  '#525252': 'secondary-text',
  '#087A32': 'positive-bold-text',
  '#D92D20': 'negative-text',
};

const bgMap = {
  '#fafafa': 'primary-bg',
  '#f6f6f6': 'secondary-bg',
  '#f1f1f1': 'hover-bg',
  '#ededed': 'active-bg',
  '#e8e8e8': 'neutral-bg',
  '#171717': 'inverse-bg',
  '#0a92a4': 'brand-bg',
  '#087583': 'brand-hover-bg',
  '#065862': 'brand-active-bg',
  '#daf2f5': 'brand-subtle-bg',
  '#f1fdfe': 'brand-light-subtle-bg',
  '#95d2da': 'info-bg',
  '#c3e8ec': 'info-hover-bg',
  '#fd6c01': 'notice-bg',
  '#ffe8d7': 'notice-subtle-bg',
  '#fea360': 'notice-hover-bg',
  '#ff4d4d': 'negative-bg',
  '#ffeded': 'negative-subtle-bg',
  '#ff9494': 'negative-hover-bg',
  '#31e47f': 'positive-bg',
  '#eafcf2': 'positive-subtle-bg',
  '#83efb2': 'positive-hover-bg',
  '#262626': 'button-bg-waitlist',
  '#065e69': 'button-brand-bg',
  '#121212': 'inverse-bg', // generic mapping for dark bg
  '#F8FAFC': 'secondary-bg',
  '#DFF3F6': 'brand-subtle-bg',
  '#E9FFE9': 'positive-subtle-bg',
  '#FBFBFB': 'primary-bg',
  '#F2FDFE': 'brand-light-subtle-bg',
};

const borderMap = {
  '#ababab': 'primary-b',
  '#c9c9c9': 'secondary-b',
  '#ededed': 'tertiary-b',
  '#f1f1f1': 'disabled-b',
  '#171717': 'inverse-b',
  '#e8e8e8': 'inverse-bold-b',
  '#0a92a4': 'brand-b',
  '#c3e8ec': 'brand-subtle-b',
  '#fd6c01': 'notice-b',
  '#ff4d4d': 'warning-b',
  '#31e47f': 'positive-b',
  '#454545': 'button-b',
  '#D0D5DD': 'secondary-b',
  '#2D2D2D': 'secondary-b',
  '#E5E5E5': 'tertiary-b',
  '#F04438': 'warning-b',
};

function getMapForPrefix(prefix) {
  if (prefix === 'text' || prefix === 'placeholder') return textMap;
  if (prefix === 'bg') return bgMap;
  if (prefix === 'border' || prefix === 'ring') return borderMap;
  return null;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Find classes like bg-[#FAFAFA], text-[#050505], hover:border-[#ABABAB]
  // Regex needs to capture the prefix (bg, text, border, ring, placeholder), the hex, and optional variants (hover:, focus:)
  // For simplicity: ([a-z:-]+)(text|bg|border|ring|placeholder)-\[\s*(#[0-9a-fA-F]{3,6})\s*\]
  
  const regex = /(?:([a-z:-]+))?(text|bg|border|ring|placeholder)-\[\s*(#[0-9a-fA-F]{3,8})\s*\]/g;
  
  content = content.replace(regex, (match, variants, prefix, hex) => {
    hex = hex.toLowerCase();
    // Normalize 3 char hex
    if (hex.length === 4) {
      hex = '#' + hex[1]+hex[1] + hex[2]+hex[2] + hex[3]+hex[3];
    }
    
    // Ignore hex colors with opacity if we don't have them mapped, but we can strip opacity for the map check
    let cleanHex = hex.slice(0, 7);
    
    const map = getMapForPrefix(prefix);
    if (map && map[cleanHex]) {
      const token = map[cleanHex];
      const variantStr = variants ? variants : '';
      return `${variantStr}${prefix}-${token}`;
    }
    // If not found in map, try to see if it matches any other map as a fallback
    const allMap = {...bgMap, ...textMap, ...borderMap};
    if (allMap[cleanHex]) {
        return `${variants || ''}${prefix}-${allMap[cleanHex]}`;
    }
    return match; // Unchanged
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
