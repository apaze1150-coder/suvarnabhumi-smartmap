const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    const thSpan = $('header').first().find('span:contains("TH")').filter((i, el) => $(el).text() === 'TH');
    if (thSpan.length > 0) {
        // Remove the preceding or succeeding separator
        const nextSep = thSpan.next('span:contains("|")');
        const prevSep = thSpan.prev('span:contains("|")');
        
        if (nextSep.length > 0) {
            nextSep.remove();
        } else if (prevSep.length > 0) {
            prevSep.remove();
        }
        
        thSpan.remove();
    }
    
    fs.writeFileSync(indexPath, $.html());
    console.log("TH option removed from language switcher.");

} catch (error) {
    console.error("Error during update:", error);
}
