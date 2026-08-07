const fs = require('fs');
const indexPath = 'd:\\apaze\\Smartindoormap\\index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

// 1. Revert Back button on confirm step
content = content.replace(
    /<a href="#" onclick="showPage\('view-panpuri-boutique'\); return false;" class="inline-flex items-center gap-2 text-white transition-colors group hover:text-\[#c2ba9b\]">/,
    '<a href="#" onclick="showPage(\'view-panpuri-boutique\'); return false;" class="inline-flex items-center gap-2 text-[#000a1e] transition-colors group">'
);
content = content.replace(
    /<div class="flex items-center justify-center w-8 h-8 rounded-full border border-white\/20 bg-transparent group-hover:border-\[#c2ba9b\] transition-all">/,
    '<div class="flex items-center justify-center w-8 h-8 rounded-full border border-[#000a1e]/10 bg-white group-hover:border-[#000a1e]/30 transition-all">'
);

// 2. Revert title text color on confirm step
content = content.replace(
    /<h1 class="text-2xl font-black text-\[#fdfbf6\] tracking-tight">Confirm Pre-order<\/h1>/,
    '<h1 class="text-2xl font-black text-[#000a1e] tracking-tight">Confirm Pre-order</h1>'
);

// 3. Update showPreorderStep to toggle background
const oldShowPreorderStep = `        function showPreorderStep(step) {
            const steps = ['select-store','products','confirm','done','track'];
            steps.forEach(s => {
                const el = document.getElementById(\`preorder-step-\${s === 'store' ? 'select-store' : s}\`);
                if (el) el.classList.add('hidden');
            });
            const target = step === 'store' ? 'preorder-step-select-store' : \`preorder-step-\${step}\`;
            const el = document.getElementById(target);
            if (el) el.classList.remove('hidden');

            if (step === 'confirm') renderCartSummary();
        }`;

const newShowPreorderStep = `        function showPreorderStep(step) {
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

content = content.replace(oldShowPreorderStep, newShowPreorderStep);

fs.writeFileSync(indexPath, content, 'utf-8');
console.log('Reverted confirm page background to white successfully.');
