const fs = require('fs');
const svg = fs.readFileSync('uploads/3.svg', 'utf8');

// SVG viewBox
const vbMatch = svg.match(/viewBox="([^"]+)"/);
console.log('SVG viewBox:', vbMatch ? vbMatch[1] : 'not found');

// Find all text elements with D1-D8 labels and nearby rect elements
const textRegex = /<text[^>]*>D([1-8])<\/text>/g;
let match;
while ((match = textRegex.exec(svg)) !== null) {
    const label = 'D' + match[1];
    const textTag = match[0];
    const pos = match.index;
    
    // Extract x, y from the text element
    const xMatch = textTag.match(/x="([^"]+)"/);
    const yMatch = textTag.match(/y="([^"]+)"/);
    
    // Look for nearby rect (search backwards from text position)
    const before = svg.substring(Math.max(0, pos - 2000), pos);
    const rectMatches = [...before.matchAll(/<rect[^>]*\/>/g)];
    const lastRect = rectMatches.length > 0 ? rectMatches[rectMatches.length - 1][0] : null;
    
    let rectInfo = 'none found';
    if (lastRect) {
        const rx = lastRect.match(/x="([^"]+)"/);
        const ry = lastRect.match(/y="([^"]+)"/);
        const rw = lastRect.match(/width="([^"]+)"/);
        const rh = lastRect.match(/height="([^"]+)"/);
        const stroke = lastRect.match(/stroke="([^"]+)"/);
        const fill = lastRect.match(/fill="([^"]+)"/);
        rectInfo = `x=${rx?rx[1]:'?'} y=${ry?ry[1]:'?'} w=${rw?rw[1]:'?'} h=${rh?rh[1]:'?'} stroke=${stroke?stroke[1]:'?'} fill=${fill?fill[1]:'?'}`;
    }
    
    console.log(`${label}: text(x=${xMatch?xMatch[1]:'?'}, y=${yMatch?yMatch[1]:'?'}) | rect: ${rectInfo}`);
}
