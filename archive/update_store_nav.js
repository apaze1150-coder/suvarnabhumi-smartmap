const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

try {
    const storeSelPath = path.join(__dirname, 'store_selection.html');
    let storeHtml = fs.readFileSync(storeSelPath, 'utf8');
    const $1 = cheerio.load(storeHtml);
    
    // Fix Menu 1 (Home)
    const homeBtn = $1('.flex.flex-col.items-center').filter(function() {
        return $1(this).find('span').text().trim().toLowerCase() === 'home';
    });
    if (homeBtn.length > 0) {
        homeBtn.attr('onclick', "window.location.href='index.html'");
    }

    // Fix Menu 2 (Navigate)
    const navBtn = $1('.flex.flex-col.items-center').filter(function() {
        return $1(this).find('span').text().trim().toLowerCase() === 'navigate';
    });
    if (navBtn.length > 0) {
        navBtn.attr('onclick', "window.location.href='index.html'");
    }

    // Write back
    fs.writeFileSync(storeSelPath, $1.html());
    console.log("Updated bottom nav in store_selection.html");

} catch (error) {
    console.error("Error updating files:", error);
}
