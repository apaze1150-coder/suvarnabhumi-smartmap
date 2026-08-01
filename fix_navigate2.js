const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const badBlock = `            <!-- Home -->
            <div id="nav-home" class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('home-view')">
                <span class="material-symbols-outlined text-[#001a3d] hover:text-[#d8aa3d] transition-colors">home</span>
                <span class="text-[9px] uppercase font-bold text-[#001a3d] hover:text-[#d8aa3d] tracking-tight transition-colors">Home</span>
            </div>

                <span class="material-symbols-outlined">map</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">Navigate</span>
            </div>`;

const goodBlock = `            <!-- Home -->
            <div id="nav-home" class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('home-view')">
                <span class="material-symbols-outlined text-[#001a3d] hover:text-[#d8aa3d] transition-colors">home</span>
                <span class="text-[9px] uppercase font-bold text-[#001a3d] hover:text-[#d8aa3d] tracking-tight transition-colors">Home</span>
            </div>
            <!-- Navigate -->
            <div id="nav-map" class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('map-view')">
                <span class="material-symbols-outlined">map</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">Navigate</span>
            </div>`;

if (content.includes(badBlock)) {
    content = content.replace(badBlock, goodBlock);
    console.log("Fixed Navigate properly.");
} else {
    console.log("Bad block not found. Regex attempt...");
    const regex = /<span class="text-\[9px\] uppercase font-bold text-\[#001a3d\] hover:text-\[#d8aa3d\] tracking-tight transition-colors">Home<\/span>\s*<\/div>\s*<span class="material-symbols-outlined">map<\/span>\s*<span class="text-\[9px\] uppercase font-bold tracking-tight">Navigate<\/span>\s*<\/div>/s;
    if (regex.test(content)) {
        content = content.replace(regex, `<span class="text-[9px] uppercase font-bold text-[#001a3d] hover:text-[#d8aa3d] tracking-tight transition-colors">Home</span>
            </div>
            <!-- Navigate -->
            <div id="nav-map" class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('map-view')">
                <span class="material-symbols-outlined">map</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">Navigate</span>
            </div>`);
        console.log("Fixed Navigate via regex.");
    }
}

fs.writeFileSync('index.html', content);
