const fs = require('fs');
let content = fs.readFileSync('smartmap.html', 'utf8');

const startIdx = content.indexOf('<!-- TopAppBar (ถอดปุ่ม Staff Mode ออกแล้ว) -->');
const endIdx = content.indexOf('<span class="material-symbols-outlined text-[18px]">language</span>');

const newHeader = `<!-- TopAppBar (ถอดปุ่ม Staff Mode ออกแล้ว) -->
    <header class="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-[#3B465A] z-50 shadow-md">
        <div class="flex items-center gap-4">
            <button
                class="text-white hover:bg-white/10 transition-colors p-2 rounded-full active:scale-95 duration-200">
                <span class="material-symbols-outlined">menu</span>
            </button>
            <img src="https://www.kingpower.com/images/logo-kingpower.svg" alt="KING POWER" class="h-5 ml-2" />
        </div>
        <div class="flex items-center gap-2">
            <!-- Custom Lang Dropdown -->
            <div class="relative">
                <button onclick="document.getElementById('lang-dropdown').classList.toggle('hidden'); document.getElementById('google-translate-wrapper').classList.remove('show');" class="flex items-center gap-1 text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95">
                    `;

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newHeader + content.substring(endIdx);
    fs.writeFileSync('smartmap.html', content);
    console.log('Fixed Header');
} else {
    console.log('Could not find boundaries');
}
