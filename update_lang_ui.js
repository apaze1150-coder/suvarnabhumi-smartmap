const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // Find the current language switcher div
    const oldSwitcher = $('div.flex.items-center.gap-1\\.5.bg-\\[\\#1a3355\\]').first();
    
    if (oldSwitcher.length > 0) {
        const newDropdown = `
        <div class="relative inline-block text-left" id="lang-dropdown-container">
          <div>
            <button type="button" class="inline-flex w-full justify-center items-center gap-x-1.5 rounded-full bg-[#1a3355] px-3 py-1.5 text-xs font-semibold text-white shadow-sm border border-white/5 hover:bg-[#1a3355]/80 focus:outline-none transition-all" id="lang-menu-button" aria-expanded="true" aria-haspopup="true" onclick="document.getElementById('lang-dropdown-menu').classList.toggle('hidden')">
              <img id="current-lang-flag" src="https://flagcdn.com/w20/us.png" alt="English" class="w-4 h-3 object-cover rounded-sm">
              <span id="current-lang-text">English</span>
              <span class="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>
          <div id="lang-dropdown-menu" class="hidden absolute right-0 z-[100] mt-2 w-32 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden" role="menu" aria-orientation="vertical" aria-labelledby="lang-menu-button" tabindex="-1">
            <div class="py-1" role="none">
              <a href="#" class="text-[#001a3d] block px-4 py-2.5 text-xs font-bold hover:bg-gray-100 flex items-center gap-3 transition-colors" role="menuitem" tabindex="-1" onclick="setLangAndUpdateUI('en', 'English', 'https://flagcdn.com/w20/us.png'); event.preventDefault();">
                <img src="https://flagcdn.com/w20/us.png" alt="English" class="w-4 h-3 object-cover rounded-sm shadow-sm"> English
              </a>
              <a href="#" class="text-[#001a3d] block px-4 py-2.5 text-xs font-bold hover:bg-gray-100 flex items-center gap-3 transition-colors" role="menuitem" tabindex="-1" onclick="setLangAndUpdateUI('zh-CN', '中文', 'https://flagcdn.com/w20/cn.png'); event.preventDefault();">
                <img src="https://flagcdn.com/w20/cn.png" alt="Chinese" class="w-4 h-3 object-cover rounded-sm shadow-sm"> 中文
              </a>
            </div>
          </div>
        </div>
        `;
        
        oldSwitcher.replaceWith(newDropdown);
        
        // Add the JS logic
        $('body').append(`
        <script>
            function setLangAndUpdateUI(lang, text, flagUrl) {
                const textEl = document.getElementById('current-lang-text');
                const flagEl = document.getElementById('current-lang-flag');
                if (textEl) textEl.innerText = text;
                if (flagEl) flagEl.src = flagUrl;
                
                const menu = document.getElementById('lang-dropdown-menu');
                if (menu) menu.classList.add('hidden');
                
                if (typeof setLang === 'function') {
                    setLang(lang);
                }
            }
            
            document.addEventListener('click', function(event) {
                const dropdown = document.getElementById('lang-dropdown-container');
                const menu = document.getElementById('lang-dropdown-menu');
                if (dropdown && menu && !dropdown.contains(event.target)) {
                    menu.classList.add('hidden');
                }
            });
        </script>
        `);
        
        fs.writeFileSync(indexPath, $.html());
        console.log("Language switcher converted to dropdown successfully.");
    } else {
        console.log("Old switcher not found.");
    }

} catch (error) {
    console.error("Error during update:", error);
}
