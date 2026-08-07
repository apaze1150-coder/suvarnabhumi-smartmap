import sys
content = open('index.html', 'r', encoding='utf-8').read()
target = '''        function showPreorderStep(step) {
            const steps = ['select-store','products','confirm','done','track'];'''
replace = '''        function showPreorderStep(step) {
            // Update background based on step
            const pagePreorder = document.getElementById('page-preorder');
            if (pagePreorder) {
                const bgLayer = pagePreorder.querySelector('.fixed.inset-0.z-0');
                if (bgLayer) {
                    if (step === 'select-store' || step === 'store') {
                        bgLayer.style.display = 'block';
                        pagePreorder.style.backgroundColor = 'transparent';
                    } else {
                        bgLayer.style.display = 'none';
                        pagePreorder.style.backgroundColor = '#f8fafc'; // White/light-gray background
                    }
                }
            }

            const steps = ['select-store','products','confirm','done','track'];'''
content = content.replace(target, replace)
open('index.html', 'w', encoding='utf-8').write(content)
print('Done index.html')

