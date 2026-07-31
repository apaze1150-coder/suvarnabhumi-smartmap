
const CATEGORY_MAP = {
      "NEW & CURATED": ["CARE EAU DE PARFUM"],
      "FINE FRAGRANCES": ["EXTRACT Perfume Oil", "Care Eau de Parfum", "Accessories"],
      "BATH & BODY": ["Bath & Body Oil", "Body & Hand Lotion", "Body Polish", "Hand Care", "Hair Care", "Bath & Body Accessories"],
      "FACE": ["Natural Face Oil & Serum", "Face & Eye Cream", "Gentle Cleanser & Toner", "Lip Care"],
      "HOME": ["Candles", "Reed Diffusers & Refills", "Room Spray & Pillow Mist", "Essential Oils", "Electric Oil", "Home Accessories", "Sachets & Refills"],
      "GIFT": ["Gift of Fine Fragrances", "Gift For Face", "Gift For Bath & Body", "Gift For Home"]
  };

function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const catSelect = document.getElementById('newProductCategory');
    
    // Populate Categories if empty
    if(catSelect.options.length <= 1) {
        Object.keys(CATEGORY_MAP).forEach(cat => {
            let opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            catSelect.appendChild(opt);
        });
    }
    
    document.getElementById('addProductForm').reset();
    document.getElementById('newProductSubCategory').innerHTML = '<option value="">Select Sub Category</option>';
    modal.classList.remove('hidden');
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.add('hidden');
}

function updateSubCategoryDropdown() {
    const catSelect = document.getElementById('newProductCategory');
    const subSelect = document.getElementById('newProductSubCategory');
    const selectedCat = catSelect.value;
    
    subSelect.innerHTML = '<option value="">Select Sub Category</option>';
    
    if(selectedCat && CATEGORY_MAP[selectedCat]) {
        CATEGORY_MAP[selectedCat].forEach(sub => {
            let opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            subSelect.appendChild(opt);
        });
    }
}


window.updateImage = function(code, url) {
    const preview = document.getElementById('img-preview-' + code);
    if(preview && preview.tagName === 'IMG') {
        preview.src = url;
    } else if (preview && preview.tagName === 'DIV') {
        const img = document.createElement('img');
        img.className = "w-10 h-10 object-cover bg-surface-container rounded-md";
        img.src = url;
        img.id = 'img-preview-' + code;
        preview.replaceWith(img);
    }
    
    if(typeof unsavedChanges !== 'undefined') {
        if(!unsavedChanges[code]) unsavedChanges[code] = {};
        unsavedChanges[code]['Image'] = url;
        if (typeof commitChanges === 'function') commitChanges();
    }
};

window.uploadImageInline = async function(input, code) {
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    
    // Quick preview
    const reader = new FileReader();
    reader.onload = (e) => window.updateImage(code, e.target.result);
    reader.readAsDataURL(file);
    
    // Upload to server
    const formData = new FormData();
    formData.append('image', file);
    try {
        const res = await fetch('/api/admin/products/upload-image', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.imageUrl) {
            window.updateImage(code, data.imageUrl);
            // Also update the input text URL
            input.parentElement.previousElementSibling.value = data.imageUrl;
        } else {
            alert('Upload failed: ' + data.error);
        }
    } catch(err) {
        console.error('Upload error', err);
        alert('Upload connection error');
    }
};

async function saveNewProduct(e) {
    e.preventDefault();
    
    const newProductCode = document.getElementById('newProductCode').value.trim();
    if (!newProductCode) return alert('Product Code is required');

    const newProduct = {
        Code: newProductCode,
        Description: document.getElementById('newProductName').value,
        Reference: document.getElementById('newProductReference') ? document.getElementById('newProductReference').value : '',
        Category: document.getElementById('newProductCategory').value,
        'Sub-Category': document.getElementById('newProductSubCategory').value,
        Scent: document.getElementById('newProductScent') ? document.getElementById('newProductScent').value : '',
        Size: document.getElementById('newProductSize') ? document.getElementById('newProductSize').value : '',
        Price: document.getElementById('newProductPrice').value,
        Qty_Branch1: document.getElementById('newProductStock').value,
        Qty_Branch2: document.getElementById('newProductStockDE12').value,
        Qty_Branch3: document.getElementById('newProductStockDW41').value,
        Image: ''
    };
    
    try {
        const res = await fetch('/api/admin/products/batch-update', {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                password: '6515',
                updates: {
                    [newProductCode]: newProduct
                }
            })
        });
        const data = await res.json();
        
        if (data.success || data.success === undefined) {
            closeAddProductModal();
            if (typeof loadProducts === 'function') {
                loadProducts();
            }
        } else {
            alert('Error adding product: ' + (data.error || 'Unknown error'));
        }
    } catch(err) {
        console.error(err);
        alert('Connection error');
    }
}
