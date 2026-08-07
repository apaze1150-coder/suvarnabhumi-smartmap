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
      // Navigate to the main page (index.html) and search for the selected store
      window.location.href = 'index.html?searchStore=' + encodeURIComponent(storeId);
  }
`);
        }
    });
    fs.writeFileSync(storeSelPath, $1.html());
    console.log("Updated store_selection.html");

    // 2. Update index.html
    const indexPath = path.join(__dirname, 'index.html');
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    // Add logic to parse URL params on DOMContentLoaded
    if (!indexHtml.includes('const searchStoreParam = urlParams.get')) {
        const injection = `
        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchStoreParam = urlParams.get('searchStore');
            if (searchStoreParam) {
                setTimeout(() => {
                    if (typeof showPage === 'function') showPage('map-view');
                    const searchInput = document.getElementById('map-search-input');
                    if (searchInput) searchInput.value = searchStoreParam;
                    if (typeof searchMapLive === 'function') searchMapLive();
                }, 500); // Wait a bit for everything to init
            }
        });
        `;
        // Inject before the closing body tag
        indexHtml = indexHtml.replace('</body>', `\n<script>\n${injection}\n</script>\n</body>`);
        fs.writeFileSync(indexPath, indexHtml);
        console.log("Updated index.html with URL param parser");
    } else {
        console.log("index.html already has URL param parser");
    }
} catch (error) {
    console.error("Error updating files:", error);
}
