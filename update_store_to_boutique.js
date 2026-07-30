const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

try {
    // 1. Update store_selection.html
    const storeSelPath = path.join(__dirname, 'store_selection.html');
    let storeHtml = fs.readFileSync(storeSelPath, 'utf8');
    const $1 = cheerio.load(storeHtml);
    
    // Find the selectStore script
    const scriptTags = $1('script');
    scriptTags.each((i, el) => {
        let content = $1(el).html();
        if (content && content.includes('function selectStore')) {
            $1(el).html(`
  function selectStore(storeId) {
      // Navigate to the main page (index.html) and open the Boutique view
      window.location.href = 'index.html?boutiqueStore=' + encodeURIComponent(storeId);
  }
`);
        }
    });
    fs.writeFileSync(storeSelPath, $1.html());
    console.log("Updated store_selection.html to use boutiqueStore");

    // 2. Update index.html
    const indexPath = path.join(__dirname, 'index.html');
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the previous injected URL parser script
    const newInjection = `
        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchStoreParam = urlParams.get('searchStore');
            const boutiqueStoreParam = urlParams.get('boutiqueStore');
            
            if (boutiqueStoreParam) {
                const storeMap = { 'DE40': 'PANPURI Concourse D East', 'DE12': 'PANPURI Concourse D East 2', 'DW41': 'PANPURI Concourse D West' };
                const storeName = storeMap[boutiqueStoreParam] || 'PANPURI';
                setTimeout(() => {
                    if (typeof selectPreorderStore === 'function') {
                        selectPreorderStore(boutiqueStoreParam, storeName);
                    }
                }, 500); // Wait a bit for everything to init
            } else if (searchStoreParam) {
                setTimeout(() => {
                    if (typeof showPage === 'function') showPage('map-view');
                    const searchInput = document.getElementById('map-search-input');
                    if (searchInput) searchInput.value = searchStoreParam;
                    if (typeof searchMapLive === 'function') searchMapLive();
                }, 500);
            }
        });
        `;
        
    // Find where the old script was injected.
    const oldScriptPattern = /<script>\s*window\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*const urlParams = new URLSearchParams[^<]+<\/script>/s;
    if (oldScriptPattern.test(indexHtml)) {
        indexHtml = indexHtml.replace(oldScriptPattern, `<script>\n${newInjection}\n</script>`);
        fs.writeFileSync(indexPath, indexHtml);
        console.log("Replaced URL param parser in index.html");
    } else {
        // Fallback injection if pattern fails
        indexHtml = indexHtml.replace('</body>', `\n<script>\n${newInjection}\n</script>\n</body>`);
        fs.writeFileSync(indexPath, indexHtml);
        console.log("Injected new URL param parser in index.html");
    }

} catch (error) {
    console.error("Error updating files:", error);
}
