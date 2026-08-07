
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
        