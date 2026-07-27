const fs = require('fs');
let html = fs.readFileSync('d:/apaze/Smartindoormap/smartmap.html', 'utf8');

const oldPills = `<!-- Category Pills -->
<div id="boutique-category-pills" class="flex gap-sm overflow-x-auto pb-md no-scrollbar mb-lg">
<button class="px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md whitespace-nowrap">All Items</button>
<button class="px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Bath &amp; Body</button>
<button class="px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Face Care</button>
<button class="px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Hair Care</button>
<button class="px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Home Fragrance</button>
</div>`;

const newPills = `<!-- Category Pills -->
<div id="boutique-category-pills" class="flex gap-sm overflow-x-auto pb-md no-scrollbar mb-lg">
<button onclick="filterBoutique('all', this)" class="boutique-cat-btn px-6 py-2 bg-primary text-on-primary border border-transparent rounded-full font-label-md text-label-md whitespace-nowrap">All Items</button>
<button onclick="filterBoutique('Bath & Body', this)" class="boutique-cat-btn px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Bath &amp; Body</button>
<button onclick="filterBoutique('Face', this)" class="boutique-cat-btn px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Face</button>
<button onclick="filterBoutique('Hair Care', this)" class="boutique-cat-btn px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Hair Care</button>
<button onclick="filterBoutique('Gift', this)" class="boutique-cat-btn px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap">Gift</button>
</div>`;

html = html.replace(oldPills, newPills);

const filterLogic = `
        function filterBoutique(cat, btnElem) {
            currentProductCategory = cat;
            document.querySelectorAll('.boutique-cat-btn').forEach(b => {
                b.classList.remove('bg-primary', 'text-on-primary', 'border-transparent');
                b.classList.add('border-outline-variant', 'text-on-surface');
            });
            if(btnElem) {
                btnElem.classList.remove('border-outline-variant', 'text-on-surface');
                btnElem.classList.add('bg-primary', 'text-on-primary', 'border-transparent');
            }
            renderProductGrid();
        }
`;

html = html.replace('</script>\n</body>', filterLogic + '\n</script>\n</body>');

fs.writeFileSync('d:/apaze/Smartindoormap/smartmap.html', html);
console.log('Pills updated.');
