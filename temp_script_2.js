
    function openBulkImportModal() {
        document.getElementById('bulkImportTextarea').value = '';
        document.getElementById('bulkImportModal').classList.remove('hidden');
        document.getElementById('bulkImportModal').classList.add('flex');
    }
    function closeBulkImportModal() {
        document.getElementById('bulkImportModal').classList.add('hidden');
        document.getElementById('bulkImportModal').classList.remove('flex');
    }
    async function processBulkImport() {
        const text = document.getElementById('bulkImportTextarea').value.trim();
        if(!text) return alert('Please paste data');
        const lines = text.split('\n');
        let updates = {};
        let count = 0;
        for(let line of lines) {
            const cols = line.split('\t');
            if(cols.length >= 12) {
                const code = cols[0].trim();
                if(code) {
                    updates[code] = {
                        Description: cols[1].trim(),
                        Reference: cols[2].trim(),
                        Category: cols[3].trim(),
                        'Sub-Category': cols[4].trim(),
                        Scent: cols[5].trim(),
                        Size: cols[6].trim(),
                        Price: cols[7].trim(),
                        Image: cols[8].trim(),
                        Qty_Branch1: cols[9].trim(),
                        Qty_Branch2: cols[10].trim(),
                        Qty_Branch3: cols[11].trim()
                    };
                    count++;
                }
            }
        }
        if(count === 0) return alert('No valid 12-column data found. Please ensure you copied all columns including Scent and Size.');
        try {
            await fetch('/api/admin/products/batch-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: '6515', updates })
            });
            alert('Successfully imported ' + count + ' products!');
            closeBulkImportModal();
            if(typeof loadProducts === 'function') loadProducts();
        } catch (err) {
            alert('Failed to import: ' + err.message);
        }
    }
  