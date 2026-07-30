const fs = require('fs');
let html = fs.readFileSync('smartmap.html', 'utf8');

// 1. Add Google Font for Noto Sans SC
const newFontLink = '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />\n    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
html = html.replace('<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined', newFontLink);

// 2. Update Tailwind config
const oldFonts = `"fontFamily": {
                        "headline": ["Manrope", "sans-serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Inter", "sans-serif"],
                        "headline-lg": ["Manrope"],
                        "headline-xl": ["Manrope"],
                        "label-md": ["Manrope"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-md": ["Manrope"],
                        "label-sm": ["Manrope"],
                        "headline-xl-mobile": ["Manrope"]
                    }`;

const newFonts = `"fontFamily": {
                        "headline": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "label": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-lg": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-xl": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "label-md": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body-sm": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body-md": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body-lg": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-md": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "label-sm": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-xl-mobile": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"]
                    }`;

html = html.replace(oldFonts, newFonts);
fs.writeFileSync('smartmap.html', html);
console.log('Fonts updated successfully!');
