const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const smartmapPath = 'smartmap.html';

    const indexHTML = fs.readFileSync(indexPath, 'utf8');
    const smartmapHTML = fs.readFileSync(smartmapPath, 'utf8');

    const $index = cheerio.load(indexHTML);
    const $smartmap = cheerio.load(smartmapHTML);

    // 1. Get the new header, main layout, and bottom nav
    const newHeader = $index('header').first().toString();
    const newMain = $index('main.w-full').first().toString();
    const newBottomNav = $index('body > div.fixed.bottom-0').first().toString(); // The bottom nav wrapper

    // 2. In smartmap, replace the old header
    $smartmap('header').first().replaceWith(newHeader);

    // 3. In smartmap, replace the contents of #home-view with the new main content
    const homeView = $smartmap('#home-view');
    // We want the new main to just be the inner content of home-view to keep the SPA logic
    // Actually, newMain contains <main class="w-full">...</main>.
    // Let's replace the whole home-view div to be sure, but we MUST keep id="home-view" and class="page-section active absolute inset-0 pt-20 pb-28 px-6 overflow-y-auto" (wait, the new main is edge-to-edge, so we should remove px-6, pt-20, pb-28, etc. and let the new layout handle padding)
    
    // Instead of replacing the div completely, let's change its classes and content.
    // The new layout is edge to edge. 
    homeView.removeClass('px-6 pt-20 pb-28');
    // Add pb-28 back so bottom nav doesn't cover content
    homeView.addClass('pb-28');
    
    homeView.html(newMain);

    // 4. Replace the old bottom nav in smartmap
    // The old bottom nav in smartmap has id="bottom-nav"
    const oldBottomNav = $smartmap('#bottom-nav');
    if (oldBottomNav.length) {
        // We will insert the new bottom nav right after the old one, then remove the old one.
        // Wait, the new bottom nav doesn't have id="bottom-nav", let's give it the id so the script can still toggle it if needed.
        const $newNav = cheerio.load(newBottomNav)('div.fixed.bottom-0').first();
        $newNav.attr('id', 'bottom-nav');
        oldBottomNav.replaceWith($newNav.toString());
    } else {
        // Just append to body
        $smartmap('body').append(newBottomNav);
    }

    // 5. Update the onclick handlers in the new UI to trigger SPA functions
    // For Bottom Nav:
    $smartmap('#bottom-nav div[onclick="window.location.href=\'index.html\'"]').attr('onclick', "showPage('home-view')");
    $smartmap('#bottom-nav div[onclick="window.location.href=\'smartmap.html\'"]').attr('onclick', "showPage('map-view')");
    $smartmap('#bottom-nav div[onclick="window.location.href=\'store_selection.html\'"]').attr('onclick', "showPage('page-preorder')");
    
    // For Top Nav (Admin Mode):
    $smartmap('header a[href="panpuri_staff.html"]').attr('onclick', "showPage('page-preorder'); showPreorderStep('track'); return false;"); 
    // Wait, the prompt says "การเข้า Mode Admin: ผูกปุ่มหรือ Trigger สำหรับการเข้าสู่หน้าจัดการแอดมิน (Admin Mode / Stock Logs / Management) ให้ใช้งานได้เหมือนเดิม"
    // The original smartmap probably didn't have an admin page directly. In index.html it links to panpuri_staff.html. That's correct. Let's keep it as href="panpuri_staff.html".

    // For Main Content buttons:
    // "Explore Map" button
    $smartmap('#home-view div[onclick="window.location.href=\'smartmap.html\'"]').attr('onclick', "showPage('map-view')");
    // "Shops" grid card
    $smartmap('#home-view div:contains("Shops")[onclick="window.location.href=\'smartmap.html\'"]').attr('onclick', "showPage('map-view')");
    // "Track Flight" button (we will need to bind this to trackFlight logic later in the script)
    // "Pre-Order" Panpuri button
    $smartmap('#home-view button[onclick="window.location.href=\'store_selection.html\'"]').attr('onclick', "showPage('page-preorder')");

    // Fix the "Ask AI" search bar:
    const searchInput = $smartmap('#home-view input[placeholder="E.G. Perfume, Gucci, GATE D4"]');
    if (searchInput.length) {
        searchInput.attr('id', 'ai-search-input');
        searchInput.attr('onkeyup', 'if(event.key === "Enter") triggerSearch()');
        
        // Also bind the search button next to it
        const searchBtn = searchInput.next('button');
        if (searchBtn.length) {
            searchBtn.attr('onclick', 'triggerSearch()');
        }
    }

    // 6. Save as index_merged.html for review
    fs.writeFileSync('index_merged.html', $smartmap.html());
    console.log("Merge completed successfully into index_merged.html");

} catch (error) {
    console.error("Error during merge:", error);
}
