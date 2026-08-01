const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacement = `if (storeLabel) {
    let imgHtml = '';
    if (typeof stores !== 'undefined') {
        const storeObj = stores.find(s => s.id === storeId || s.shop_number === storeId);
        if (storeObj && storeObj.shop_image) {
            let imgUrl = (storeObj.shop_image.startsWith('http') || storeObj.shop_image.startsWith('/uploads/'))
                ? storeObj.shop_image : '/uploads/' + storeObj.shop_image;
            imgHtml = '<br><img src="' + imgUrl + '" onerror="this.style.display=\\'none\\'" class="w-full h-32 mt-3 rounded-lg shadow-sm object-cover" alt="Store Image" />';
        }
    }
    storeLabel.innerHTML = '📍 ' + name + imgHtml;
}`;

// Use regex to match the corrupted text, e.g., if (storeLabel) storeLabel.textContent = 'ðŸ“  ' + name;
const regex = /if\s*\(storeLabel\)\s*storeLabel\.textContent\s*=\s*'[^']+'\s*\+\s*name;/;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('index.html', content);
    console.log("Successfully replaced mojibake in index.html");
} else {
    console.log("Could not find the target string in index.html");
}
