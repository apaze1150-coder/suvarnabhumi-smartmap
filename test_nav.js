const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        await page.goto('http://localhost:3000/index.html?boutiqueStore=TE3', {waitUntil: 'networkidle0'});
        const url = page.url();
        console.log('Final URL:', url);
        const activePage = await page.evaluate(() => {
            const active = document.querySelector('.page-section.active');
            return active ? active.id : null;
        });
        console.log('Active page ID:', activePage);
        await browser.close();
    } catch(e) {
        console.error('Script Error:', e);
    }
})();
