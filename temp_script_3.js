
    function openImageModal(code) {
        document.getElementById('imageModalProductCode').value = code;
        
        const product = allProducts.find(p => p.Code === code);
        document.getElementById('imageModalUrlInput').value = product && product.Image ? product.Image : '';
        
        document.getElementById('imagePickerModal').classList.remove('hidden');
        document.getElementById('imagePickerModal').classList.add('flex');
    }

    function closeImageModal() {
        document.getElementById('imagePickerModal').classList.add('hidden');
        document.getElementById('imagePickerModal').classList.remove('flex');
        document.getElementById('imageModalFileInput').value = '';
    }

    async function handleModalImageUpload(input) {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const res = await fetch('/api/admin/products/upload-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.imageUrl) {
                document.getElementById('imageModalUrlInput').value = data.imageUrl;
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch(err) {
            console.error('Upload error', err);
            alert('Upload connection error');
        }
    }

    function confirmImageModal() {
        const code = document.getElementById('imageModalProductCode').value;
        const newUrl = document.getElementById('imageModalUrlInput').value.trim();
        
        const product = allProducts.find(p => p.Code === code);
        if (product) {
            product.Image = newUrl;
        }
        
        if(typeof unsavedChanges !== 'undefined') {
            if(!unsavedChanges[code]) unsavedChanges[code] = {};
            unsavedChanges[code]['Image'] = newUrl;
            if (typeof commitChanges === 'function') commitChanges();
        }
        
        const container = document.getElementById('img-preview-container-' + code);
        if (container) {
            if (newUrl) {
                container.innerHTML = '<img class="w-10 h-10 object-cover bg-surface-container" src="' + newUrl + '" id="img-preview-' + code + '" />';
            } else {
                container.innerHTML = '<div class="w-10 h-10 bg-surface-container flex items-center justify-center material-symbols-outlined text-outline" id="img-preview-' + code + '">image</div>';
            }
        }
        
        closeImageModal();
    }

    async function deleteProduct(code) {
        if (!confirm('Are you sure you want to delete product ' + code + '?')) return;
        
        try {
            const res = await fetch('/api/admin/products/' + code + '?password=6515', {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success || data.message) {
                allProducts = allProducts.filter(p => p.Code !== code);
                renderTable();
            } else {
                alert('Failed to delete: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Delete error', err);
            alert('Connection error while deleting');
        }
    }

    function editProductRow(code) {
        const cells = document.querySelectorAll('.excel-cell[data-id="' + code + '"]');
        if (cells.length > 0) {
            cells.forEach(c => {
                c.setAttribute('contenteditable', 'true');
                c.classList.add('bg-white', 'text-black', 'ring-1', 'ring-primary', 'shadow-inner');
            });
            cells[0].focus();
        }
    }
  