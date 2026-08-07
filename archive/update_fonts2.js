const fs = require('fs');
let html = fs.readFileSync('smartmap.html', 'utf8');

// Fix duplicate links
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+SC:wght@400;500;700&display=swap" rel="stylesheet" \/>\r?\n    <link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+SC:wght@400;500;700&display=swap" rel="stylesheet" \/>/g, '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />');

const fontRegex = /"fontFamily":\s*\{[\s\S]*?"headline-xl-mobile":\s*\["Manrope"\]\s*\}/;

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

html = html.replace(fontRegex, newFonts);
fs.writeFileSync('smartmap.html', html);
console.log('Fonts updated successfully!');
