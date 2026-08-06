const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let target = \        function showPreorderStep(step) {
            const steps = ['select-store','products','confirm','done','track'];\;
let replace = \        function showPreorderStep(step) {
            // Update background based on step
            const pagePreorder = document.getElementById('page-preorder');
            if (pagePreorder) {
                const bgLayer = pagePreorder.querySelector('.fixed.inset-0.z-0');
                if (bgLayer) {
                    if (step === 'select-store') {
                        bgLayer.style.display = 'block';
                        pagePreorder.style.backgroundColor = 'transparent';
                    } else {
                        bgLayer.style.display = 'none';
                        pagePreorder.style.backgroundColor = '#f8fafc'; // White/light-gray background
                    }
                }
            }

            const steps = ['select-store','products','confirm','done','track'];\;
html = html.replace(target, replace);
fs.writeFileSync('index.html', html);
console.log('done index.html');
