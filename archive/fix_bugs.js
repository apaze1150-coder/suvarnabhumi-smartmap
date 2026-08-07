const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 1. Fix Language Switcher
    // We already added the click events in the previous step, but setLang has a bug.
    // Let's fix the setLang function string inside the script tag.
    let fixedHtml = html.replace(
        "document.getElementById('lang-dropdown').classList.add('hidden');",
        "const dropdown = document.getElementById('lang-dropdown'); if (dropdown) dropdown.classList.add('hidden');"
    );

    // 2. Fix Home AI Search Box
    const $fixed = cheerio.load(fixedHtml);
    const homeSearchInput = $fixed('input[placeholder="Ask AI: Find Thai luxury gifts..."]');
    
    if (homeSearchInput.length > 0) {
        homeSearchInput.attr('id', 'home-ai-search-input');
        homeSearchInput.attr('onkeyup', "if(event.key === 'Enter') executeHomeAISearch()");
        
        const homeSearchBtn = homeSearchInput.next('button');
        homeSearchBtn.attr('onclick', "executeHomeAISearch()");
    }

    // Add the executeHomeAISearch function at the end of the body
    $fixed('body').append(`
    <script>
        function executeHomeAISearch() {
            const input = document.getElementById('home-ai-search-input');
            if (input && input.value.trim() !== '') {
                const val = input.value;
                // Switch to map view
                showPage('map-view');
                // Set the value in the map's search box
                const mapInput = document.getElementById('map-search-input');
                if (mapInput) {
                    mapInput.value = val;
                }
                // Trigger the searches
                setTimeout(() => {
                    if (typeof searchMapLive === 'function') searchMapLive();
                    if (typeof triggerMapAISearch === 'function') triggerMapAISearch(val);
                }, 300);
            }
        }
    </script>
    `);

    fs.writeFileSync(indexPath, $fixed.html());
    console.log("Language and AI Search fixed successfully.");

} catch (error) {
    console.error("Error during update:", error);
}
