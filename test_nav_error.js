const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:3000/#');
    await new Promise(r => setTimeout(r, 2000));
    
    // Evaluate to click the Navigate to Gate button
    await page.evaluate(() => {
        if(typeof navigateToGate === 'function') {
            console.log("Found navigateToGate, calling it...");
            navigateToGate().catch(e => console.error("Error in navigateToGate: " + e));
        } else {
            console.error("navigateToGate not found");
        }
    });
    
    await new Promise(r => setTimeout(r, 2000)); // wait for animation
    
    await browser.close();
})();
