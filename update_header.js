const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 1. Fix the Language Switcher
    const langContainer = $('header').first().find('div:contains("EN")').last().parent();
    
    // Add google_translate_element if not exists
    if ($('#google_translate_element').length === 0) {
        langContainer.before('<div id="google_translate_element" class="hidden"></div>');
    }
    
    // Bind the spans
    const enSpan = langContainer.find('span:contains("EN")');
    enSpan.attr('onclick', "setLang('en')");
    enSpan.removeClass('text-[#d8aa3d]').addClass('hover:text-[#d8aa3d] transition-colors');
    // For active state we can't easily do it without JS, so just add hover state

    const thSpan = langContainer.find('span:contains("TH")');
    thSpan.attr('onclick', "setLang('th')");
    
    const zhSpan = langContainer.find('span:contains("ZH")');
    zhSpan.attr('onclick', "setLang('zh-CN')");

    // 2. Fix the Hamburger Sidebar
    // Remove the old side-menu dropdown
    $('#side-menu').remove();
    
    // Change the hamburger button to toggle the sidebar
    const hamburgerBtn = $('header').first().find('button:has(span:contains("menu"))');
    hamburgerBtn.attr('onclick', "toggleMainSidebar()");

    // 3. Update the main-sidebar
    const sidebar = $('#main-sidebar');
    if (sidebar.length) {
        // Change title
        sidebar.find('h2:contains("Menu")').text('Menu');
        
        // Remove old Staff Login link
        sidebar.find('a:contains("Staff Login")').remove();
        
        // Add Staff Mode button at the bottom
        const bottomSection = sidebar.find('.border-t.mt-auto');
        bottomSection.html(`
            <button onclick="showAdminModal()" class="w-full flex items-center gap-3 p-4 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-bold text-left">
                <span class="material-symbols-outlined text-[#d8aa3d] text-xl">admin_panel_settings</span>
                Staff Mode
            </button>
        `);
    }

    // 4. Add the Admin Modal (similar to the image)
    const adminModalHTML = `
    <div id="admin-password-modal" class="fixed inset-0 bg-[#3B465A]/80 z-[200] hidden flex-col items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 opacity-0">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative transform scale-95 transition-transform duration-300" id="admin-modal-content">
            <button onclick="closeAdminModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="text-center mb-6">
                <div class="w-12 h-12 rounded-full border-2 border-[#d8aa3d] flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-[#d8aa3d]">lock</span>
                </div>
                <h3 class="text-sm font-black text-[#000a1e] uppercase tracking-widest mb-2">ENTER ADMIN PASSWORD</h3>
                <p class="text-[10px] text-gray-500 font-medium leading-relaxed">To modify database logs and store positions, please enter the administrator access password.</p>
            </div>
            <input type="password" id="admin-password-input" class="w-full h-12 text-center text-xl tracking-[1em] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000a1e] focus:border-[#000a1e] outline-none mb-4 transition-all" placeholder="....">
            <div id="admin-error-msg" class="text-red-500 text-xs font-bold text-center mb-4 hidden">Incorrect Password</div>
            <button onclick="checkAdminPassword()" class="w-full bg-[#000a1e] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all">
                Unlock Console
            </button>
        </div>
    </div>
    <script>
        function showAdminModal() {
            toggleMainSidebar(); // close sidebar
            const modal = document.getElementById('admin-password-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                document.getElementById('admin-modal-content').classList.remove('scale-95');
                document.getElementById('admin-modal-content').classList.add('scale-100');
                document.getElementById('admin-password-input').focus();
            }, 10);
        }
        function closeAdminModal() {
            const modal = document.getElementById('admin-password-modal');
            modal.classList.add('opacity-0');
            document.getElementById('admin-modal-content').classList.remove('scale-100');
            document.getElementById('admin-modal-content').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.getElementById('admin-password-input').value = '';
                document.getElementById('admin-error-msg').classList.add('hidden');
            }, 300);
        }
        function checkAdminPassword() {
            const pwd = document.getElementById('admin-password-input').value;
            // The image doesn't say what the password is, let's use 'admin1234' or just '1234' for now.
            if (pwd === '1234' || pwd === 'admin1234') {
                window.location.href = '/admin';
            } else {
                document.getElementById('admin-error-msg').classList.remove('hidden');
                document.getElementById('admin-password-input').value = '';
                document.getElementById('admin-password-input').focus();
            }
        }
        // Handle enter key
        document.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('admin-password-input');
            if(input) {
                input.addEventListener('keyup', function(event) {
                    if (event.key === 'Enter') checkAdminPassword();
                });
            }
        });
    </script>
    `;

    $('body').append(adminModalHTML);

    fs.writeFileSync(indexPath, $.html());
    console.log("Header UI and Admin Modal updated successfully.");

} catch (error) {
    console.error("Error during update:", error);
}
