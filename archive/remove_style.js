const fs=require('fs');
let h=fs.readFileSync('smartmap.html', 'utf8');
h=h.replace(/style="filter: invert\(1\) hue-rotate\(180deg\).*?crisp-edges;"/g, '');
fs.writeFileSync('smartmap.html', h);
console.log('Removed style');
