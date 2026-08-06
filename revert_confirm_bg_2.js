const fs = require('fs');
const indexPath = 'd:\\apaze\\Smartindoormap\\index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

// The regex will match the entire showPreorderStep function block regardless of exact spaces
const regexShowPreorder = /function showPreorderStep\(step\)\s*\{[\s\S]*?if\s*\(step\s*===\s*'confirm'\)\s*renderCartSummary\(\);\s*\}/;

const newShowPreorderStep = `function showPreorderStep(step) {
            const steps = ['select-store','products','confirm','done','track'];
            steps.forEach(s => {
                const el = document.getElementById(\`preorder-step-\${s === 'store' ? 'select-store' : s}\`);
                if (el) el.classList.add('hidden');
            });
            const target = step === 'store' ? 'preorder-step-select-store' : \`preorder-step-\${step}\`;
            const el = document.getElementById(target);
            if (el) el.classList.remove('hidden');

            const pagePreorder = document.getElementById('page-preorder');
            const auraBg = document.querySelector('#page-preorder > .fixed.inset-0.z-0');
            
            if (step === 'confirm') {
                if (auraBg) auraBg.classList.add('hidden');
                if (pagePreorder) {
                    pagePreorder.classList.remove('bg-transparent');
                    pagePreorder.classList.add('bg-gray-50');
                }
                renderCartSummary();
            } else {
                if (auraBg) auraBg.classList.remove('hidden');
                if (pagePreorder) {
                    pagePreorder.classList.add('bg-transparent');
                    pagePreorder.classList.remove('bg-gray-50');
                }
            }
        }`;

if (regexShowPreorder.test(content)) {
    content = content.replace(regexShowPreorder, newShowPreorderStep);
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log('Successfully updated showPreorderStep logic!');
} else {
    console.log('Could not find showPreorderStep using Regex.');
}
