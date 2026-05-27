const fs = require('fs');
const path = require('path');

const files = [
  'src/components/dashboard/profile-builder/PreviewCanvas.tsx',
  'src/app/(external-pages)/[username]/page.tsx'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  if (!content.includes('THEME_DEFAULTS')) {
    const targetImport = 'import { getRgbaColor } from "@/utils/color";';
    if (content.includes(targetImport)) {
      content = content.replace(
        targetImport,
        `import { getRgbaColor } from "@/utils/color";\nimport { THEME_DEFAULTS } from "@/constants/theme";`
      );
    } else {
      const importMatches = content.match(/import.*\n/g);
      if (importMatches) {
        const lastImport = importMatches[importMatches.length - 1];
        content = content.replace(lastImport, `${lastImport}import { THEME_DEFAULTS } from "@/constants/theme";\n`);
      }
    }
  }

  content = content.replace(/"#FFFFFF"/g, 'THEME_DEFAULTS.BG_COLOR');
  content = content.replace(/"#1E1E1E"/g, 'THEME_DEFAULTS.DARK_MODE.BG_COLOR');
  
  content = content.replace(/"#050505"/g, 'THEME_DEFAULTS.TEXT_COLOR');
  content = content.replace(/"#FAFAFA"/g, 'THEME_DEFAULTS.DARK_MODE.TEXT_COLOR');
  
  content = content.replace(/"#2D2D2D"/g, 'THEME_DEFAULTS.DARK_MODE.BORDER_COLOR');
  content = content.replace(/"#EDEDED"/g, 'THEME_DEFAULTS.LIGHT_MODE.BORDER_COLOR');
  content = content.replace(/"#F0F0F0"/g, 'THEME_DEFAULTS.LIGHT_MODE.BORDER_LIGHT');
  
  content = content.replace(/"#E0E0E0"/g, 'THEME_DEFAULTS.DARK_MODE.MUTED_TEXT');
  content = content.replace(/"#454545"/g, 'THEME_DEFAULTS.LIGHT_MODE.MUTED_TEXT');
  
  content = content.replace(/"#0a92a4"/g, 'THEME_DEFAULTS.ACCENT_COLORS.DEFAULT');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

files.forEach(f => processFile(path.join(__dirname, f)));
