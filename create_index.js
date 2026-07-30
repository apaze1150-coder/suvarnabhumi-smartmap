const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>King Power - Royal Horizon Concierge Dashboard</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Google Fonts: Manrope for Minimalist Luxury & Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
<script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            royalNavy: '#001a3d',
            royalGold: '#d8aa3d',
            kingpower: {
              navy: '#002147',
              accent: '#263b59',
              gold: '#d9a05b',
            }
          },
          fontFamily: {
            sans: ['Manrope', 'sans-serif'],
          }
        }
      }
    }
</script>
<style>
    body {
        background-color: #f3f4f6; /* Light gray background matching screenshot */
        -webkit-font-smoothing: antialiased;
    }
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .glass-effect {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    }
</style>
</head>
<body class="font-sans text-gray-800 pb-28">

<!-- Header -->
<header class="bg-[#001a3d] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
    <!-- Left: Logo -->
    <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-[#d8aa3d] flex items-center justify-center text-[#001a3d] font-bold text-xs">
            KP
        </div>
        <h1 class="text-base font-bold tracking-widest">KING POWER</h1>
    </div>
    
    <!-- Right: Lang & Staff Mode -->
    <div class="flex items-center gap-3">
        <!-- Language Switcher -->
        <div class="flex items-center gap-1 bg-[#1a3355] rounded-full px-2 py-1 text-xs font-semibold">
            <span class="cursor-pointer text-[#d8aa3d]">EN</span>
            <span class="text-white/30">|</span>
            <span class="cursor-pointer hover:text-[#d8aa3d] transition-colors">TH</span>
            <span class="text-white/30">|</span>
            <span class="cursor-pointer hover:text-[#d8aa3d] transition-colors">ZH</span>
        </div>
        
        <!-- Staff Mode -->
        <button onclick="window.location.href='panpuri_staff.html'" class="border border-white/20 bg-[#1a3355] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider hover:bg-white/10 transition-colors">
            STAFF MODE
        </button>
    </div>
</header>

<main class="w-full">
    <!-- Hero Image -->
    <div class="w-full relative">
        <img alt="Suvarnabhumi Airport" class="w-full h-auto object-cover max-h-[280px]" src="uploads/kingpower%20suvarnabhumi-airport.png" onerror="this.src='https://www.kingpower.com/images/default-image.jpg'"/>
    </div>

    <div class="w-full max-w-5xl mx-auto px-5 pt-6 space-y-6">
        
        <!-- Greeting & Concierge -->
        <div class="flex justify-between items-start">
            <div>
                <p class="text-[#d8aa3d] text-[10px] font-bold uppercase tracking-widest mb-1">Your Private Concierge</p>
                <h2 class="text-3xl font-extrabold leading-tight text-[#001a3d] tracking-tight">
                    SUVARNABHUMI<br/>
                    <span class="text-gray-500 font-light">AIRPORT</span>
                </h2>
            </div>
            <button class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <span class="material-symbols-outlined text-[#001a3d]">chat</span>
            </button>
        </div>

        <!-- Ask AI Search Bar -->
        <div class="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 flex items-center">
            <div class="pl-3 pr-2 flex items-center justify-center">
                <span class="material-symbols-outlined text-[#d8aa3d] text-xl">auto_awesome</span>
            </div>
            <input type="text" class="flex-grow bg-transparent border-none py-2 text-sm focus:ring-0 outline-none text-gray-700" placeholder="Ask AI: Find Thai luxury gifts...">
            <button class="bg-[#001a3d] text-white p-3 rounded-2xl shadow-md flex items-center justify-center" onclick="window.location.href='smartmap.html'">
                <span class="material-symbols-outlined text-sm">search</span>
            </button>
        </div>

        <!-- Current Journey -->
        <div class="bg-[#001a3d] rounded-[2rem] p-5 shadow-xl relative overflow-hidden" onclick="window.location.href='smartmap.html'">
            <div class="flex justify-between items-start mb-5">
                <div>
                    <p class="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Current Journey</p>
                    <h3 class="text-white text-4xl font-extrabold tracking-tight">TG679</h3>
                </div>
                <div class="text-right">
                    <div class="flex items-center gap-2 justify-end mb-1">
                        <span class="w-1.5 h-1.5 bg-[#d8aa3d] rounded-full animate-pulse"></span>
                        <h4 class="text-[#d8aa3d] text-xs font-bold uppercase tracking-widest italic">Boarding</h4>
                    </div>
                    <p class="text-white/50 text-[10px] uppercase tracking-wider">Gate D4</p>
                </div>
            </div>
            
            <div class="bg-[#1a3355] rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#2d4669] rounded-xl flex items-center justify-center shadow-inner">
                        <span class="material-symbols-outlined text-[#d8aa3d] text-lg font-bold">navigation</span>
                    </div>
                    <div>
                        <p class="text-white text-[11px] font-bold uppercase tracking-wider">Navigate to Gate</p>
                        <p class="text-white/60 text-[10px] mt-0.5">4 Min Walk from here</p>
                    </div>
                </div>
                <button class="bg-[#d8aa3d] text-[#001a3d] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform" onclick="window.location.href='smartmap.html'">Start</button>
            </div>
        </div>

        <!-- Track Another Flight -->
        <div class="bg-white rounded-[1.5rem] p-4 flex flex-col gap-3 shadow-sm">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-400 text-lg">warning</span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-700">Track Another Flight</span>
            </div>
            <div class="flex gap-2">
                <input class="flex-grow bg-[#f3f4f6] border-none rounded-xl py-3 px-4 text-xs font-bold tracking-tight focus:ring-1 focus:ring-[#001a3d] outline-none" placeholder="E.G. TG679" type="text"/>
                <button class="bg-[#001a3d] text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase shadow-md active:scale-95 transition-transform">Track</button>
            </div>
        </div>

        <!-- 4 Grid Cards -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Shops -->
            <div class="relative bg-gray-200 rounded-2xl h-32 overflow-hidden shadow-sm group cursor-pointer" onclick="window.location.href='smartmap.html'">
                <img src="uploads/preview-1.jpg" onerror="this.src='https://www.kingpower.com/images/default-image.jpg'" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Shops">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h4 class="absolute bottom-3 left-4 text-white text-xs font-bold uppercase tracking-widest">Shops</h4>
            </div>
            <!-- Dining -->
            <div class="relative bg-gray-200 rounded-2xl h-32 overflow-hidden shadow-sm group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Dining">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h4 class="absolute bottom-3 left-4 text-white text-xs font-bold uppercase tracking-widest">Dining</h4>
            </div>
            <!-- Currency -->
            <div class="relative bg-gray-200 rounded-2xl h-32 overflow-hidden shadow-sm group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1580519542036-ed47f3e42214?auto=format&fit=crop&q=80&w=500" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Currency">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h4 class="absolute bottom-3 left-4 text-white text-xs font-bold uppercase tracking-widest">Currency</h4>
            </div>
            <!-- Explore Map -->
            <div class="bg-[#d8aa3d] rounded-2xl h-32 p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-[#c99a2c] transition-colors" onclick="window.location.href='smartmap.html'">
                <span class="material-symbols-outlined text-[#001a3d] text-3xl mb-2">location_on</span>
                <h4 class="text-[#001a3d] text-xs font-bold uppercase tracking-widest">Explore Map</h4>
            </div>
        </div>

        <!-- PANPURI Pre-order -->
        <div class="bg-[#001a3d] rounded-[2rem] p-5 shadow-xl border border-white/5 flex flex-col gap-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-white text-xl font-bold tracking-[0.2em]">PAÑPURI</h3>
                    <p class="text-[#d8aa3d] text-[10px] mt-2 mb-2 font-light">สั่งจองสินค้าล่วงหน้า รับสินค้าได้ที่ร้านก่อนขึ้นเครื่อง</p>
                </div>
                <span class="border border-[#d8aa3d]/40 text-[#d8aa3d] text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">Pre-Order</span>
            </div>
            
            <div class="relative rounded-xl overflow-hidden h-32 group">
                <img src="uploads/panpuri_Banner.jpg" onerror="this.src='https://panpuri.com/wp-content/uploads/2023/10/Siamese-Water-Extract-Perfume-Oil_50ml_1-1050x1050.jpg'" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Panpuri Products">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 flex items-center justify-center px-4 text-center">
                    <p class="text-white text-xs font-bold tracking-widest uppercase">Explore the wellness collection</p>
                </div>
            </div>

            <button onclick="window.location.href='store_selection.html'" class="w-full bg-[#d8aa3d] text-[#001a3d] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#c99a2c] active:scale-95 transition-all shadow-md">
                <span class="material-symbols-outlined text-sm">shopping_bag</span>
                สั่งจองสินค้า PANPURI
            </button>
        </div>

    </div>
</main>

<!-- Bottom Navigation Bar (Oval style) -->
<div class="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
    <div class="bg-white px-6 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] w-full pointer-events-auto border border-gray-100 flex items-center justify-between relative max-w-5xl mx-auto">
        <!-- Home -->
        <div class="flex flex-col items-center gap-1 cursor-pointer" onclick="window.location.href='index.html'">
            <span class="material-symbols-outlined text-[#001a3d]">home</span>
            <span class="text-[9px] uppercase font-bold text-[#001a3d] tracking-tight">Home</span>
        </div>
        <!-- Navigate -->
        <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-colors" onclick="window.location.href='smartmap.html'">
            <span class="material-symbols-outlined">map</span>
            <span class="text-[9px] uppercase font-bold tracking-tight">Navigate</span>
        </div>
        <!-- Center Floating Pre-Order button -->
        <div class="relative w-14 flex justify-center cursor-pointer" onclick="window.location.href='store_selection.html'">
            <div class="absolute -top-10 w-14 h-14 bg-[#d8aa3d] rounded-full shadow-lg border-4 border-white flex items-center justify-center hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-[#001a3d] font-bold text-xl">add</span>
            </div>
            <span class="text-[9px] uppercase font-bold text-gray-400 tracking-tight mt-6">Pre-Order</span>
        </div>
        <!-- AI Assist -->
        <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-colors" onclick="window.location.href='smartmap.html'">
            <span class="material-symbols-outlined">auto_awesome</span>
            <span class="text-[9px] uppercase font-bold tracking-tight">AI Assist</span>
        </div>
        <!-- Profile -->
        <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-colors">
            <span class="material-symbols-outlined">person</span>
            <span class="text-[9px] uppercase font-bold tracking-tight">Profile</span>
        </div>
    </div>
</div>

</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('index.html successfully updated to match the requested design.');
