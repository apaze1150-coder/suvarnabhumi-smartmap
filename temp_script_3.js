
        let mapPanzoom;
        let globalInterval;
        let activeStores = [];
        let selectedShopNumber = null;
        let activeGateNodeId = 'Node_Gate_D4';
        let currentFloor = 4;
        const FLOOR_4_MAP = "/uploads/4.svg";
        const FLOOR_3_MAP = "/uploads/3.svg";
        const SAT1_MAP = "/uploads/5.svg";

        function switchFloor(floor) {
            currentFloor = floor;
            const img = document.getElementById('map-image-element');
            const btn3 = document.getElementById('floor-3-btn');
            const btn4 = document.getElementById('floor-4-btn');
            const btnSat = document.getElementById('floor-sat-btn');
            if (!img || !btn3 || !btn4 || !btnSat) return;
            
            [btn3, btn4, btnSat].forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-sm');
                b.classList.add('text-primary', 'hover:bg-black/5');
            });
            
            if (floor === 3) {
                img.src = FLOOR_3_MAP;
                btn3.classList.add('bg-primary', 'text-white', 'shadow-sm');
                btn3.classList.remove('text-primary', 'hover:bg-black/5');
            } else if (floor === 'SAT-1') {
                img.src = SAT1_MAP;
                btnSat.classList.add('bg-primary', 'text-white', 'shadow-sm');
                btnSat.classList.remove('text-primary', 'hover:bg-black/5');
            } else {
                img.src = FLOOR_4_MAP;
                btn4.classList.add('bg-primary', 'text-white', 'shadow-sm');
                btn4.classList.remove('text-primary', 'hover:bg-black/5');
            }
        }

        function getDGateCoords(gateCode) {
            const clean = gateCode.toUpperCase().replace(/\s+/g, '');
            const match = clean.match(/^D([1-8])/);
            if (!match) return null;
            
            const num = parseInt(match[1], 10);
            const xCoords = {
                1: 220,
                2: 300,
                3: 380,
                4: 460,
                5: 540,
                6: 620,
                7: 700,
                8: 780
            };
            return {
                x: xCoords[num] || 460,
                y: 247
            };
        }

        window.onload = function () {
            const mapElem = document.getElementById('map-image-container');
            mapPanzoom = Panzoom(mapElem, { maxScale: 5, minScale: 0.5, contain: false, step: 0.3 });
            mapElem.parentElement.addEventListener('wheel', mapPanzoom.zoomWithWheel);

            document.getElementById('zoom-in').addEventListener('click', mapPanzoom.zoomIn);
            document.getElementById('zoom-out').addEventListener('click', mapPanzoom.zoomOut);
            document.getElementById('zoom-reset').addEventListener('click', () => mapPanzoom.reset());

            trackFlightLive("TG679");
        };

        // --- 1. LIVE API เที่ยวบินและการนับถอยหลัง ---
        async function trackFlightLive(forcedFlightId = null, isUserAction = false) {
            const inputVal = forcedFlightId || document.getElementById('flight-input').value.trim().toUpperCase();
            if (!inputVal) return;

            if (isUserAction) {
                window.open(`https://www.google.com/search?q=flight+${inputVal}`, '_blank');
            }

            try {
                const response = await fetch(`/api/flight-status?flight_id=${inputVal}`);
                const data = await response.json();

                if (!data || !data.gate) {
                    alert("ไม่พบข้อมูลเที่ยวบินระหว่างประเทศดังกล่าว");
                    return;
                }

                document.getElementById('flight-number-display').innerText = data.flight_id;
                document.getElementById('flight-route-display').innerText = `${data.status} • Flight Journey`;
                document.getElementById('flight-gate-display').innerText = data.gate;
                activeGateNodeId = data.gate_node_id || 'Node_Gate_D4';

                const badge = document.getElementById('flight-status-badge');
                badge.className = `px-3 py-1 rounded-full flex items-center gap-1.5 border bg-[#B59115]/20 border-[#B59115]`;
                document.getElementById('flight-status-text').className = "text-[10px] font-bold text-white uppercase tracking-wider";
                document.getElementById('flight-status-text').innerText = `${data.walk_time_mins} Min Walk`;

                document.getElementById('navigate-gate-btn-container').classList.remove('hidden');
                startCountdownLive(data.boarding_time);

            } catch (error) {
                console.error("Backend Offline - ใช้ข้อมูลสำรองสำหรับเดโม:", error);
                document.getElementById('flight-number-display').innerText = inputVal;
                document.getElementById('flight-route-display').innerText = "International Flight Journey";
                document.getElementById('flight-gate-display').innerText = "D4";
                activeGateNodeId = 'Node_Gate_D4';
                document.getElementById('navigate-gate-btn-container').classList.remove('hidden');
            }
        }

        function startCountdownLive(targetString) {
            const display = document.getElementById('flight-boarding-display');
            if (!targetString) {
                display.innerText = "--:--:--";
                return;
            }

            let targetTime;
            if (targetString.includes(':') && !targetString.includes('-') && !targetString.includes('T')) {
                // targetString is in HH:MM format
                const parts = targetString.split(':');
                const hours = parseInt(parts[0], 10);
                const minutes = parseInt(parts[1], 10);
                const seconds = parts[2] ? parseInt(parts[2], 10) : 0;

                const now = new Date();
                const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
                targetTime = targetDate.getTime();
            } else {
                let safeIso = targetString;
                if (safeIso && !safeIso.includes('Z') && !safeIso.includes('+')) {
                    safeIso = safeIso.replace(' ', 'T') + 'Z';
                }
                targetTime = new Date(safeIso).getTime();
            }

            if (globalInterval) clearInterval(globalInterval);

            globalInterval = setInterval(() => {
                const now = new Date().getTime();
                const diff = targetTime - now;
                if (isNaN(targetTime)) {
                    clearInterval(globalInterval);
                    display.innerText = targetString;
                    return;
                }
                if (diff <= 0) {
                    clearInterval(globalInterval);
                    display.innerText = "BOARDING";
                    return;
                }
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                const fmt = (n) => String(n).padStart(2, '0');
                display.innerText = `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`;
            }, 1000);
        }

        function handleFlightEnter(e) { if (e.key === 'Enter') trackFlightLive(null, true); }

        function openGoogleFlight() {
            const flightId = document.getElementById('flight-number-display').innerText;
            if (flightId && flightId !== '---') {
                window.open(`https://www.google.com/search?q=flight+${flightId}`, '_blank');
            }
        }

        async function editGateManual() {
            const currentGate = document.getElementById('flight-gate-display').innerText;
            const newGate = prompt("Enter Departure Gate (e.g. C5, E2, S101):", currentGate === '--' ? '' : currentGate);
            if (newGate === null) return;

            const cleanGate = newGate.trim().toUpperCase();
            if (!cleanGate) return;

            const flightId = document.getElementById('flight-number-display').innerText;
            if (flightId === '---') return;

            try {
                const response = await fetch(`/api/flight-status?flight_id=${flightId}&custom_gate=${cleanGate}`);
                const data = await response.json();

                if (!data || !data.gate) {
                    alert("Invalid Gate or Flight Number.");
                    return;
                }

                // Update UI elements
                document.getElementById('flight-gate-display').innerText = data.gate;
                activeGateNodeId = data.gate_node_id || 'Node_Gate_D4';

                const badge = document.getElementById('flight-status-badge');
                badge.className = `px-3 py-1 rounded-full flex items-center gap-1.5 border bg-[#B59115]/20 border-[#B59115]`;
                document.getElementById('flight-status-text').className = "text-[10px] font-bold text-white uppercase tracking-wider";
                document.getElementById('flight-status-text').innerText = `${data.walk_time_mins} Min Walk`;

            } catch (err) {
                console.error("Error updating manual gate:", err);
                alert("Failed to update gate with server.");
            }
        }

        // --- 2. DYNAMIC PATH AND PIN RENDERING ---
        function renderStoreRoutes(results) {
            const svg = document.getElementById('route-path-svg');
            const mapContainer = document.getElementById('map-image-container');
            
            // Clear previous paths & pins
            svg.innerHTML = '';
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());

            if (!results || results.length === 0) return;

            results.forEach(s => {
                const isHidden = selectedShopNumber !== null && selectedShopNumber !== s.shop_number;
                const isSelected = selectedShopNumber === s.shop_number;

                // 1. Draw Path ONLY if this specific shop is selected
                if (s.path && s.path.length > 0 && isSelected) {
                    let d = `M ${s.path[0].x} ${s.path[0].y}`;
                    for (let i = 1; i < s.path.length; i++) {
                        let prevX = s.path[i-1].x;
                        let prevY = s.path[i-1].y;
                        let currX = s.path[i].x;
                        let currY = s.path[i].y;
                        
                        // Orthogonal routing (90-degree angles)
                        if (currX !== prevX && currY !== prevY) {
                            if (Math.abs(currX - prevX) > Math.abs(currY - prevY)) {
                                d += ` L ${currX} ${prevY} L ${currX} ${currY}`;
                            } else {
                                d += ` L ${prevX} ${currY} L ${currX} ${currY}`;
                            }
                        } else {
                            d += ` L ${currX} ${currY}`;
                        }
                    }

                    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    pathElement.setAttribute('d', d);
                    pathElement.setAttribute('fill', 'none');
                    pathElement.setAttribute('stroke', '#22c55e'); // Green path line
                    pathElement.setAttribute('stroke-width', '4');
                    pathElement.setAttribute('stroke-dasharray', '8 8');
                    pathElement.setAttribute('class', 'path-animated transition-all duration-300');
                    pathElement.id = `path-shop-${s.shop_number}`;
                    svg.appendChild(pathElement);

                    // Start Dot Animation (Pulse)
                    const startDotGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    startDotGlow.setAttribute('cx', s.path[0].x);
                    startDotGlow.setAttribute('cy', s.path[0].y);
                    startDotGlow.setAttribute('r', '6');
                    startDotGlow.setAttribute('fill', '#0ea5e9'); // Light blue glow
                    
                    const animR = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                    animR.setAttribute('attributeName', 'r');
                    animR.setAttribute('values', '6;20;6');
                    animR.setAttribute('dur', '1.5s');
                    animR.setAttribute('repeatCount', 'indefinite');
                    startDotGlow.appendChild(animR);

                    const animOp = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                    animOp.setAttribute('attributeName', 'opacity');
                    animOp.setAttribute('values', '0.8;0;0.8');
                    animOp.setAttribute('dur', '1.5s');
                    animOp.setAttribute('repeatCount', 'indefinite');
                    startDotGlow.appendChild(animOp);
                    
                    svg.appendChild(startDotGlow);

                    // Start Dot (Blue)
                    const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    startDot.setAttribute('cx', s.path[0].x);
                    startDot.setAttribute('cy', s.path[0].y);
                    startDot.setAttribute('r', '7');
                    startDot.setAttribute('fill', '#0ea5e9'); // Blue color
                    startDot.setAttribute('stroke', '#ffffff');
                    startDot.setAttribute('stroke-width', '2.5');
                    svg.appendChild(startDot);
                }

                // 2. Draw Map Pin
                if (!isHidden) {
                    const pin = document.createElement('div');
                    pin.className = `dynamic-map-pin absolute w-16 h-12 bg-secondary/20 border border-secondary rounded-lg map-pulse flex items-center justify-center z-10 transition-all duration-300 ${isAdminMode ? 'cursor-grab' : 'cursor-pointer'}`;
                    pin.id = `pin-shop-${s.shop_number}`;
                    pin.style.left = `${s.coordinates.x}px`;
                    pin.style.top = `${s.coordinates.y}px`;
                    pin.style.transform = 'translate(-50%, -50%)';

                    if (isAdminMode) {
                        makePinDraggable(pin, s.shop_number, mapContainer);
                    } else {
                        pin.onclick = () => selectStoreCard(s.shop_number);
                    }

                    pin.innerHTML = `
                        <div class="bg-[#B59115] text-[9px] font-black text-white px-2 py-0.5 rounded absolute -top-5 whitespace-nowrap shadow-md select-none">
                            SHOP ${s.shop_number}
                        </div>
                        <div class="w-2.5 h-2.5 bg-[#B59115] rounded-full border border-white"></div>
                    `;
                    mapContainer.appendChild(pin);
                }
            });
        }

        // --- 3. STORE SEARCH AND CATEGORY FILTERS ---
        async function searchByCategory(categoryName) {
            document.querySelectorAll('.category-btn').forEach(btn => {
                if (btn.innerText.includes(categoryName)) {
                    btn.classList.add('bg-primary', 'text-white');
                    btn.classList.remove('bg-white/95', 'text-primary');
                } else {
                    btn.classList.remove('bg-primary', 'text-white');
                    btn.classList.add('bg-white/95', 'text-primary');
                }
            });

            document.getElementById('map-search-input').value = categoryName;
            document.getElementById('clear-search-btn').classList.remove('hidden');
            await searchMapLive(categoryName);
        }

        async function searchMapLive(overrideQuery = null) {
            const queryText = overrideQuery || document.getElementById('map-search-input').value.trim();
            if (!queryText) return;

            // Automatically switch to Floor 4 map since all shops are on Floor 4
            switchFloor(4);

            // Panpuri popup special deal
            if (queryText.toLowerCase().includes('panpuri')) {
                setTimeout(() => {
                    alert(`✨ พบแบรนด์ Pañpuri บนเส้นทางเดินของคุณ! \n\n🔥 สินค้าขายดีแนะนำ:\n1. Perfume Oil\n2. Hand Cream\n\n🎟️ รับสิทธิ์พิเศษเฉพาะคุณ: Get 10% Off สำหรับลูกค้า King Power`);
                }, 300);
            }

            try {
                const response = await fetch('/api/search-store', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: queryText, from_node: "Node_Intersection_D" })
                });
                const result = await response.json();

                if (result && result.results && result.results.length > 0) {
                    activeStores = result.results;
                    selectedShopNumber = null; // reset

                    renderResultsCards(activeStores);
                    renderStoreRoutes(activeStores);
                    document.getElementById('results-container').classList.remove('hidden');
                    document.getElementById('clear-search-btn').classList.remove('hidden');

                    // Center the panzoom on passport control/center area
                    if (mapPanzoom) {
                        mapPanzoom.reset();
                    }
                } else {
                    alert("ไม่พบแบรนด์ดังกล่าวในแผนผังร้านค้า 1-49");
                    document.getElementById('results-container').classList.add('hidden');
                    document.getElementById('route-path-svg').innerHTML = '';
                    document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
                }
            } catch (error) {
                console.error("Search failed:", error);
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์หลังบ้าน");
            }
        }

        function handleMapSearchEnter(e) { if (e.key === 'Enter') searchMapLive(); }

        // Clear Search Function
        function clearSearch() {
            document.getElementById('map-search-input').value = '';
            document.getElementById('clear-search-btn').classList.add('hidden');
            
            // Reset active category buttons
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white/95', 'text-primary');
            });

            // Hide results container and clear paths/pins
            document.getElementById('results-container').classList.add('hidden');
            document.getElementById('route-path-svg').innerHTML = '';
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
            
            activeStores = [];
            selectedShopNumber = null;
        }

        // Listen to input changes to show/hide clear button
        document.addEventListener('DOMContentLoaded', () => {
            const inputField = document.getElementById('map-search-input');
            if (inputField) {
                inputField.addEventListener('input', (e) => {
                    const clearBtn = document.getElementById('clear-search-btn');
                    if (e.target.value.trim().length > 0) {
                        clearBtn.classList.remove('hidden');
                    } else {
                        clearBtn.classList.add('hidden');
                    }
                });
            }
        });

        // --- 4. CARDS RENDERING AND HIGHLIGHTING ---
        function renderResultsCards(stores) {
            const container = document.getElementById('results-container');
            container.innerHTML = '';

            stores.forEach(s => {
                const isSelected = selectedShopNumber === s.shop_number;
                const card = document.createElement('div');
                card.className = `store-card pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border-2 transition-all duration-200 cursor-pointer flex gap-4 items-center ${isSelected ? 'border-[#B59115] scale-[1.02] bg-white' : 'border-transparent hover:border-[#B59115]/30 active:scale-[0.98]'}`;
                card.onclick = () => selectStoreCard(s.shop_number);
                const imgUrl = (s.shop_image && (s.shop_image.startsWith('http://') || s.shop_image.startsWith('https://') || s.shop_image.startsWith('/uploads/') || s.shop_image.startsWith('uploads/'))) 
                    ? s.shop_image 
                    : `/uploads/${s.shop_image || 'default.jpg'}`;

                card.innerHTML = `
                    <div class="w-16 h-16 rounded-xl bg-surface-container-high shrink-0 overflow-hidden border border-outline-variant/30 flex items-center justify-center">
                        <img src="${imgUrl}" class="w-full h-full object-cover" onerror="this.outerHTML='<span class=\'material-symbols-outlined text-3xl text-primary/30\'>storefront</span>'" />
                    </div>
                    <div class="flex-grow min-w-0">
                        <div class="flex justify-between items-start">
                            <span class="bg-[#B59115]/10 text-[#B59115] font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Shop ${s.shop_number} • ${s.category}</span>
                            <span class="text-[11px] font-black text-secondary whitespace-nowrap">${s.walk_time_mins} min walk</span>
                        </div>
                        <h4 class="font-bold text-primary text-sm mt-1 truncate leading-tight">${s.shop_name}</h4>
                        <p class="text-[10px] text-on-surface-variant/80 truncate mt-0.5 font-medium">Brands: ${s.brands_available}</p>
                        <p class="text-[10px] text-[#B59115] font-bold mt-1 flex items-center gap-1 truncate">
                            <span class="material-symbols-outlined text-xs shrink-0">local_activity</span>
                            ${s.promotions ? s.promotions[0] : 'Special Tourist Offer'}
                        </p>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function selectStoreCard(shopNumber) {
            if (selectedShopNumber === shopNumber) {
                selectedShopNumber = null;
            } else {
                selectedShopNumber = shopNumber;
            }
            renderResultsCards(activeStores);
            renderStoreRoutes(activeStores);
        }

        // --- 5. UI PAGE NAVIGATION UTILITIES ---
        function showPage(pageId) {
            document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');

            const navHome = document.getElementById('nav-home');
            const navMap = document.getElementById('nav-map');
            const navAi = document.getElementById('nav-ai');

            [navHome, navMap, navAi].forEach(btn => {
                btn.classList.remove('text-[#00ffff]', 'bg-white/5');
                btn.classList.add('text-white/40');
                btn.querySelector('span').style.fontVariationSettings = "'FILL' 0";
            });

            if (pageId === 'home-view') {
                navHome.classList.add('text-[#00ffff]', 'bg-white/5');
                navHome.querySelector('span').style.fontVariationSettings = "'FILL' 1";
            } else if (pageId === 'map-view') {
                navMap.classList.add('text-[#00ffff]', 'bg-white/5');
                navMap.querySelector('span').style.fontVariationSettings = "'FILL' 1";
                if (mapPanzoom) setTimeout(() => mapPanzoom.reset(), 50);
            }
        }

        async function navigateToGate() {
            showPage('map-view');
            
            // clear previous paths & pins
            const svg = document.getElementById('route-path-svg');
            svg.innerHTML = '';
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
            document.getElementById('route-gate-c').classList.add('hidden'); // hide legacy static path
            const gateText = document.getElementById('flight-gate-display').innerText;
            const cleanGate = gateText.toUpperCase().replace(/\s+/g, '');
            const dMatch = cleanGate.match(/^D([1-8])/);
            const sMatch = cleanGate.startsWith('S');
            
            if (sMatch) {
                switchFloor('SAT-1');
            } else if (dMatch) {
                switchFloor(3);
            } else {
                switchFloor(4);
            }
            
            // Handle train animation layer for SAT-1
            let trainLayer = document.getElementById('train-animation-layer');
            if (!trainLayer) {
                trainLayer = document.createElement('div');
                trainLayer.id = 'train-animation-layer';
                trainLayer.className = 'absolute inset-0 z-30 pointer-events-none flex items-center justify-center hidden';
                trainLayer.innerHTML = `
                    <div class="absolute w-[4px] bg-green-500/50 h-[50%] bottom-0 left-1/2 transform -translate-x-1/2 border-dashed border-2"></div>
                    <div class="train-icon bg-white text-primary rounded-full p-3 shadow-2xl absolute bottom-0 left-1/2 transform -translate-x-1/2 font-bold flex flex-col items-center">
                        <span class="material-symbols-outlined text-4xl text-green-600">train</span>
                        <span class="text-[10px] mt-1 whitespace-nowrap bg-gray-900 text-white px-2 py-0.5 rounded-full shadow-md">Take Train from Main Terminal</span>
                    </div>
                `;
                document.getElementById('map-image-container').appendChild(trainLayer);
            }
            
            if (sMatch) {
                trainLayer.classList.remove('hidden');
                trainLayer.querySelector('.train-icon').style.animation = 'trainMove 4s infinite cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                trainLayer.classList.add('hidden');
            }

            try {
                const response = await fetch(`/api/navigation-path?from_node=Node_Passport_Control&to_node=${activeGateNodeId}`);
                const data = await response.json();
                
                if (data && data.path && data.path.length > 0) {
                    // Render path line only if it is NOT a Floor 3 D1-D8 gate and NOT an S gate
                    if (!dMatch && !sMatch) {
                        let d = `M ${data.path[0].x} ${data.path[0].y}`;
                        for (let i = 1; i < data.path.length; i++) {
                            let prevX = data.path[i-1].x;
                            let prevY = data.path[i-1].y;
                            let currX = data.path[i].x;
                            let currY = data.path[i].y;
                            
                            // Orthogonal routing (90-degree angles)
                            if (currX !== prevX && currY !== prevY) {
                                if (Math.abs(currX - prevX) > Math.abs(currY - prevY)) {
                                    d += ` L ${currX} ${prevY} L ${currX} ${currY}`;
                                } else {
                                    d += ` L ${prevX} ${currY} L ${currX} ${currY}`;
                                }
                            } else {
                                d += ` L ${currX} ${currY}`;
                            }
                        }

                        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        pathElement.setAttribute('d', d);
                        pathElement.setAttribute('fill', 'none');
                        pathElement.setAttribute('stroke', '#22c55e'); // Green path line
                        pathElement.setAttribute('stroke-width', '4');
                        pathElement.setAttribute('stroke-dasharray', '8 8');
                        pathElement.setAttribute('class', 'path-animated transition-all duration-300');
                        svg.appendChild(pathElement);

                        // Start Dot Animation (Pulse)
                        const startDotGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        startDotGlow.setAttribute('cx', data.path[0].x);
                        startDotGlow.setAttribute('cy', data.path[0].y);
                        startDotGlow.setAttribute('r', '6');
                        startDotGlow.setAttribute('fill', '#0ea5e9'); // Light blue glow
                        
                        const animR = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                        animR.setAttribute('attributeName', 'r');
                        animR.setAttribute('values', '6;20;6');
                        animR.setAttribute('dur', '1.5s');
                        animR.setAttribute('repeatCount', 'indefinite');
                        startDotGlow.appendChild(animR);

                        const animOp = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                        animOp.setAttribute('attributeName', 'opacity');
                        animOp.setAttribute('values', '0.8;0;0.8');
                        animOp.setAttribute('dur', '1.5s');
                        animOp.setAttribute('repeatCount', 'indefinite');
                        startDotGlow.appendChild(animOp);
                        
                        svg.appendChild(startDotGlow);

                        // Start Dot (Blue)
                        const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        startDot.setAttribute('cx', data.path[0].x);
                        startDot.setAttribute('cy', data.path[0].y);
                        startDot.setAttribute('r', '7');
                        startDot.setAttribute('fill', '#0ea5e9'); // Blue color
                        startDot.setAttribute('stroke', '#ffffff');
                        startDot.setAttribute('stroke-width', '2.5');
                        svg.appendChild(startDot);
                    }

                    // End Gate Pin
                    let endNode = data.path[data.path.length - 1];
                    if (dMatch) {
                        const dCoords = getDGateCoords(gateText);
                        if (dCoords) {
                            endNode = dCoords;
                        }
                    }

                    const pin = document.createElement('div');
                    pin.className = `dynamic-map-pin absolute w-16 h-12 bg-green-500/20 border border-green-500 rounded-lg map-pulse flex items-center justify-center z-10 transition-all duration-300 cursor-pointer`;
                    pin.style.left = `${endNode.x}px`;
                    pin.style.top = `${endNode.y}px`;
                    pin.style.transform = 'translate(-50%, -50%)';
                    pin.innerHTML = `
                        <div class="bg-green-600 text-[9px] font-black text-white px-2 py-0.5 rounded absolute -top-5 whitespace-nowrap shadow-md select-none">
                            GATE ${document.getElementById('flight-gate-display').innerText}
                        </div>
                        <div class="w-2.5 h-2.5 bg-green-600 rounded-full border border-white"></div>
                    `;
                    document.getElementById('map-image-container').appendChild(pin);

                    if (mapPanzoom) {
                        mapPanzoom.reset();
                    }
                }
            } catch (err) {
                console.error("Gate navigation error:", err);
                document.getElementById('route-gate-c').classList.remove('hidden');
            }
        }

        function closeRouteCard() {
            document.getElementById('route-gate-c').classList.add('hidden');
        }

        function openAIModal() { document.getElementById('ai-modal').classList.remove('hidden'); }
        function closeAIModal() { document.getElementById('ai-modal').classList.add('hidden'); }

        // --- ADMIN MODE & COORDINATES MAPPING ---
        let isAdminMode = false;
        let adminPassword = "";

        function toggleAdminMode() {
            if (isAdminMode) {
                exitAdminMode();
                return;
            }

            const pass = prompt("Enter Admin Password:");
            if (pass === "6515") {
                isAdminMode = true;
                adminPassword = pass;
                document.getElementById('admin-status-bar').classList.remove('hidden');
                document.getElementById('admin-toggle-btn').classList.add('bg-red-600', 'text-white');
                document.getElementById('admin-toggle-btn').classList.remove('bg-white/90', 'text-primary');
                document.getElementById('admin-toggle-btn').querySelector('span').innerText = "lock_open";
                document.getElementById('map-image-container').style.cursor = 'crosshair';
                alert("Admin Mode activated! \n\n👉 Click and drag any Shop Pin on the map to reposition it! \n👉 Or click anywhere on the empty map to place a new pin.");
            } else if (pass !== null) {
                alert("Incorrect password.");
            }
        }

        function exitAdminMode() {
            isAdminMode = false;
            adminPassword = "";
            document.getElementById('admin-status-bar').classList.add('hidden');
            document.getElementById('admin-toggle-btn').classList.remove('bg-red-600', 'text-white');
            document.getElementById('admin-toggle-btn').classList.add('bg-white/90', 'text-primary');
            document.getElementById('admin-toggle-btn').querySelector('span').innerText = "lock";
            document.getElementById('map-image-container').style.cursor = '';
            
            // Re-render pins without drag handles
            if (activeStores.length > 0) {
                renderStoreRoutes(activeStores);
            }
        }

        // Show all 49 pins for easy mapping
        async function adminShowAllPins() {
            try {
                const response = await fetch('/api/search-store', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: "", from_node: "Node_Intersection_D" })
                });
                const result = await response.json();

                if (result && result.results && result.results.length > 0) {
                    activeStores = result.results;
                    selectedShopNumber = null;

                    renderResultsCards(activeStores);
                    renderStoreRoutes(activeStores);
                    document.getElementById('results-container').classList.remove('hidden');
                }
            } catch (error) {
                console.error("Failed to show all pins:", error);
                alert("Failed to load shop pins.");
            }
        }

        // Mouse/Touch dragging logic for Shop Pins using Pointer Events
        function makePinDraggable(pin, shopNumber, container) {
            let active = false;

            pin.addEventListener("pointerdown", dragStart);
            document.addEventListener("pointerup", dragEnd);
            document.addEventListener("pointermove", drag);

            function dragStart(e) {
                if (!isAdminMode) return;
                
                // CRITICAL: Stop propagation of pointerdown so Panzoom doesn't receive it!
                e.stopPropagation();
                // Prevent text highlight / browser default dragging
                e.preventDefault();

                // Set pointer capture to ensure we receive events even if cursor leaves the pin
                pin.setPointerCapture(e.pointerId);

                // Temporarily disable panzoom
                if (mapPanzoom) {
                    mapPanzoom.destroy();
                    mapPanzoom = null;
                }

                active = true;
                pin.classList.add('cursor-grabbing');
            }

            function dragEnd(e) {
                if (!active) return;
                active = false;
                pin.classList.remove('cursor-grabbing');

                try {
                    pin.releasePointerCapture(e.pointerId);
                } catch(err) {}

                // Re-enable panzoom
                const mapElem = document.getElementById('map-image-container');
                if (!mapPanzoom) {
                    mapPanzoom = Panzoom(mapElem, { maxScale: 5, minScale: 0.5, contain: false, step: 0.3 });
                    mapElem.parentElement.addEventListener('wheel', mapPanzoom.zoomWithWheel);
                }

                // Calculate final coordinates relative to 1000x500 container
                const rect = container.getBoundingClientRect();
                const finalX = Math.round((e.clientX - rect.left) / (rect.width / 1000));
                const finalY = Math.round((e.clientY - rect.top) / (rect.height / 500));

                if (finalX >= 0 && finalX <= 1000 && finalY >= 0 && finalY <= 500) {
                    const confirmSave = confirm(`Move Shop ${shopNumber} to coordinates (${finalX}, ${finalY})?`);
                    if (confirmSave) {
                        saveShopCoordinates(shopNumber, finalX, finalY);
                    } else {
                        // Reset pin back to its original position
                        const store = activeStores.find(s => s.shop_number === shopNumber);
                        if (store) {
                            pin.style.left = `${store.coordinates.x}px`;
                            pin.style.top = `${store.coordinates.y}px`;
                        }
                    }
                }
            }

            function drag(e) {
                if (!active) return;
                e.preventDefault();
                e.stopPropagation();

                const rect = container.getBoundingClientRect();
                const posX = e.clientX - rect.left;
                const posY = e.clientY - rect.top;

                // Scale it back to container dimensions so style.left matches pixels
                const pctX = (posX / rect.width) * 1000;
                const pctY = (posY / rect.height) * 500;

                pin.style.left = `${Math.round(pctX)}px`;
                pin.style.top = `${Math.round(pctY)}px`;
            }
        }

        // Click handler on map-image-container for mapping coordinate directly by clicking empty space
        document.addEventListener('DOMContentLoaded', () => {
            const mapContainer = document.getElementById('map-image-container');
            if (mapContainer) {
                mapContainer.addEventListener('click', (e) => {
                    if (!isAdminMode) return;
                    
                    // ONLY trigger if they click directly on the container background (not a pin or SVG path)
                    if (e.target !== mapContainer) return;

                    const rect = mapContainer.getBoundingClientRect();
                    const clickX = Math.round((e.clientX - rect.left) / (rect.width / 1000));
                    const clickY = Math.round((e.clientY - rect.top) / (rect.height / 500));

                    if (clickX < 0 || clickX > 1000 || clickY < 0 || clickY > 500) return;

                    const shopNum = (prompt(`Selected coordinates: (${clickX}, ${clickY})\nEnter Shop Number (e.g. DE1, DW1) to map to this point:`) || '').trim();
                    if (shopNum) {
                        saveShopCoordinates(shopNum, clickX, clickY);
                    }
                });
            }
        });

        async function saveShopCoordinates(shopNumber, x, y) {
            try {
                const response = await fetch('/api/admin/update-coordinates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: adminPassword, shop_number: shopNumber, x: x, y: y })
                });
                const result = await response.json();
                if (result.success) {
                    alert(`Successfully mapped Shop ${shopNumber} to coordinates (${x}, ${y})!`);
                    
                    // Dynamically update active search result pins if currently displayed
                    const storeIdx = activeStores.findIndex(s => s.shop_number === shopNumber);
                    if (storeIdx !== -1) {
                        activeStores[storeIdx].coordinates.x = x;
                        activeStores[storeIdx].coordinates.y = y;
                    }
                    
                    // Re-render pins in new position
                    renderResultsCards(activeStores);
                    renderStoreRoutes(activeStores);
                } else {
                    alert("Error: " + result.error);
                }
            } catch (err) {
                console.error("Save coordinate error:", err);
                alert("Failed to save coordinates to database.");
            }
        }

        // =============================================
        // PANPURI PRE-ORDER SYSTEM
        // =============================================
        let preorderCart = {};
        let allProducts = [];
        let preorderStoreId = '';
        let preorderStoreName = '';
        let currentProductCategory = 'all';
        let lastCompletedOrderNumber = '';

        async function initPreorder() {
            preorderCart = {};
            preorderStoreId = '';
            preorderStoreName = '';
            currentProductCategory = 'all';
            showPreorderStep('store');
            await loadStoreList();
        }

        async function loadStoreList() {
            const container = document.getElementById('preorder-store-list');
            container.innerHTML = '<div class="text-center text-gray-400 text-sm py-8">กำลังโหลด...</div>';
            try {
                const res = await fetch('/api/store/settings');
                const data = await res.json();
                const stores = [
                    { id: 'DE40', name: 'PANPURI Concourse D East', sub: 'บริเวณ Gate D1-D4', icon: 'location_on' },
                    { id: 'DE12', name: 'PANPURI Concourse D East 2', sub: 'บริเวณ Gate D1-D2', icon: 'location_on' },
                    { id: 'DW41', name: 'PANPURI Concourse D West', sub: 'บริเวณ Gate D5-D8', icon: 'location_on' }
                ];
                container.innerHTML = stores.map(s => {
                    const isOpen = data.settings[s.id]?.accepting_orders !== false;
                    return `<button onclick="selectPreorderStore('${s.id}','${s.name}')" ${!isOpen ? 'disabled' : ''} class="w-full text-left bg-white rounded-2xl p-4 shadow-sm border-2 ${isOpen ? 'border-transparent hover:border-amber-400 active:scale-[0.98] transition-all cursor-pointer' : 'border-gray-100 opacity-50 cursor-not-allowed'}">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl ${isOpen ? 'bg-amber-100' : 'bg-gray-100'} flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined ${isOpen ? 'text-amber-700' : 'text-gray-400'}">${s.icon}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-black text-gray-900 text-sm">${s.name}</p>
                                <p class="text-xs text-gray-500 mt-0.5">${s.sub}</p>
                            </div>
                            <div class="shrink-0">
                                ${isOpen
                                    ? '<span class="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">เปิดรับ</span>'
                                    : '<span class="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">ปิดรับ</span>'}
                            </div>
                        </div>
                    </button>`;
                }).join('');
            } catch(e) {
                container.innerHTML = '<div class="text-center text-red-500 text-sm py-8">ไม่สามารถโหลดข้อมูลร้านได้</div>';
            }
        }

        async function selectPreorderStore(storeId, name) {
            preorderStoreId = storeId;
            preorderStoreName = name;
            // document.getElementById('preorder-selected-store-label').textContent = '📍 ' + name;
            preorderCart = {};
            currentProductCategory = 'all';
            await loadProducts();
            showPage('view-panpuri-boutique');
        }

        async function loadProducts() {
            const grid = document.getElementById('product-grid');
            grid.innerHTML = '<div class="col-span-2 text-center text-gray-400 text-sm py-8">กำลังโหลดสินค้า...</div>';
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                allProducts = data.products || [];
                renderProductGrid();
            } catch(e) {
                grid.innerHTML = '<div class="col-span-2 text-center text-red-500 text-sm py-8">ไม่สามารถโหลดสินค้าได้</div>';
            }
        }

        function filterProducts(cat) {
            currentProductCategory = cat;
            document.querySelectorAll('[id^="pcat-"]').forEach(b => {
                b.classList.remove('bg-amber-600', 'text-white');
                b.classList.add('bg-white', 'border', 'border-gray-200', 'text-gray-600');
            });
            const activeBtn = document.getElementById(`pcat-${cat === 'all' ? 'all' : cat === 'Bath & Body' ? 'bath' : cat === 'Face' ? 'face' : cat === 'Hair Care' ? 'hair' : 'gift'}`);
            if (activeBtn) { activeBtn.classList.add('bg-amber-600', 'text-white'); activeBtn.classList.remove('bg-white', 'border', 'border-gray-200', 'text-gray-600'); }
            renderProductGrid();
        }

        function renderProductGrid() {
            const grid = document.getElementById('boutique-product-grid');
            if(!grid) return;
            const filtered = currentProductCategory === 'all'
                ? allProducts
                : allProducts.filter(p => p.category === currentProductCategory || p.category.startsWith(currentProductCategory));

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center text-on-surface-variant py-8 font-body-lg">No products found in this category.</div>';
                return;
            }

            // Determine which QTY field to use based on preorderStoreId
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';

            grid.innerHTML = filtered.map(p => {
                const cartQty = preorderCart[p.product_id]?.qty || 0;
                const stockQty = parseInt(p[qtyField]) || 0;
                const outOfStock = stockQty <= 0;
                const imgUrl = p.image || '';

                return `<div class="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden cursor-pointer haptic-active shadow-sm hover:shadow-md transition-all" onclick="openBoutiqueDrawer('${p.product_id}')">
                    <div class="relative aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden">
                        ${imgUrl ? `<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${imgUrl}" onerror="this.src='https://placehold.co/400x400/ffffff/1e293b?text=Image+Not+Found'"/>` : `<span class="material-symbols-outlined text-4xl text-outline">image</span>`}
                        ${p.is_bestseller ? `<div class="absolute top-4 left-4 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container text-label-sm font-bold">BESTSELLER</div>` : ''}
                        ${outOfStock ? `<div class="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center"><span class="bg-error text-on-error px-4 py-2 rounded-full font-label-md">OUT OF STOCK</span></div>` : ''}
                    </div>
                    <div class="p-md flex flex-col h-40">
                        <p class="text-label-sm text-secondary uppercase tracking-widest mb-1 truncate">${p.category || 'Product'}</p>
                        <h3 class="font-headline-md text-headline-md text-primary mb-1 line-clamp-2">${p.product_name}</h3>
                        <div class="flex items-center justify-between mt-auto">
                            <span class="font-headline-md text-headline-md text-primary">฿${parseFloat(p.price).toLocaleString()}</span>
                            ${outOfStock ? '' : (cartQty === 0 
                                ? `<button onclick="event.stopPropagation(); addToBoutiqueCart('${p.product_id}')" class="bg-secondary text-secondary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><span class="material-symbols-outlined">add</span></button>` 
                                : `<div class="flex items-center bg-secondary-container rounded-full px-1 py-1" onclick="event.stopPropagation()">
                                    <button onclick="changeBoutiqueCartQty('${p.product_id}', -1)" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button>
                                    <span class="w-6 text-center font-bold text-on-secondary-container text-sm">${cartQty}</span>
                                    <button onclick="changeBoutiqueCartQty('${p.product_id}', 1)" ${cartQty >= stockQty ? 'disabled class="w-8 h-8 rounded-full flex items-center justify-center opacity-50"' : 'class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"'} onclick="changeBoutiqueCartQty('${p.product_id}', 1)"><span class="material-symbols-outlined text-sm">add</span></button>
                                   </div>`
                            )}
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            updateBoutiqueCartUI();
        }

        function addToCart(productId) {
            const p = allProducts.find(x => x.product_id === productId);
            if (!p) return;
            if (!preorderCart[productId]) preorderCart[productId] = { qty: 0, product: p };
            preorderCart[productId].qty++;
            renderProductGrid();
        }

        function changeCartQty(productId, delta) {
            if (!preorderCart[productId]) return;
            preorderCart[productId].qty += delta;
            if (preorderCart[productId].qty <= 0) delete preorderCart[productId];
            renderProductGrid();
        }

        function updateCartButton() {
            const totalItems = Object.values(preorderCart).reduce((s, i) => s + i.qty, 0);
            const btn = document.getElementById('preorder-goto-cart-btn');
            const counter = document.getElementById('cart-count');
            if (totalItems > 0) {
                btn.classList.remove('hidden');
                counter.textContent = totalItems;
            } else {
                btn.classList.add('hidden');
            }
        }

        function renderCartSummary() {
            const items = Object.values(preorderCart);
            if (items.length === 0) {
                document.getElementById('cart-summary').innerHTML = '<p class="text-gray-400 text-sm text-center py-4">ตะกร้าว่างเปล่า</p>';
                return 0;
            }
            let total = 0;
            const rows = items.map(i => {
                const subtotal = parseFloat(i.product.price) * i.qty;
                total += subtotal;
                return `<div class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-black text-gray-900 leading-tight">${i.product.product_name}</p>
                        <p class="text-[10px] text-gray-400">${i.product.product_code} • ฿${parseFloat(i.product.price).toLocaleString()} × ${i.qty}</p>
                    </div>
                    <span class="font-black text-gray-900 text-sm shrink-0">฿${subtotal.toLocaleString()}</span>
                </div>`;
            }).join('');
            document.getElementById('cart-summary').innerHTML = `
                <h3 class="font-black text-gray-900 text-sm mb-3">รายการสินค้า — ${preorderStoreName}</h3>
                ${rows}
                <div class="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                    <span class="font-black text-gray-900">ยอดรวมทั้งหมด</span>
                    <span class="font-black text-amber-700 text-lg">฿${total.toLocaleString()}</span>
                </div>`;
            return total;
        }

        async function submitPreorder() {
            const name = document.getElementById('order-customer-name').value.trim();
            const flight = document.getElementById('order-flight-number').value.trim();
            const errEl = document.getElementById('order-error-msg');
            errEl.classList.add('hidden');

            if (!name) { errEl.textContent = 'กรุณากรอกชื่อ-สกุล'; errEl.classList.remove('hidden'); return; }
            if (!flight) { errEl.textContent = 'กรุณากรอกหมายเลขเที่ยวบิน'; errEl.classList.remove('hidden'); return; }
            if (Object.keys(preorderCart).length === 0) { errEl.textContent = 'กรุณาเลือกสินค้าอย่างน้อย 1 รายการ'; errEl.classList.remove('hidden'); return; }

            const items = Object.values(preorderCart).map(i => ({
                product_id: i.product.product_id,
                product_code: i.product.product_code,
                name: i.product.product_name,
                price: i.product.price,
                qty: i.qty
            }));

            const btn = document.getElementById('submit-order-btn');
            btn.disabled = true;
            btn.textContent = 'กำลังส่ง Order...';

            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ store_id: preorderStoreId, customer_name: name, flight_number: flight, items })
                });
                const data = await res.json();
                if (data.success) {
                    lastCompletedOrderNumber = data.order_number;
                    document.getElementById('done-order-number').textContent = data.order_number;
                    document.getElementById('track-order-input').value = data.order_number;
                    showPreorderStep('done');
                } else {
                    errEl.textContent = data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
                    errEl.classList.remove('hidden');
                }
            } catch(e) {
                errEl.textContent = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
                errEl.classList.remove('hidden');
            }
            btn.disabled = false;
            btn.textContent = '✅ ยืนยันการสั่งจอง';
        }

        async function trackOrder() {
            const orderNum = document.getElementById('track-order-input').value.trim().toUpperCase();
            const resultEl = document.getElementById('track-result');
            if (!orderNum) return;
            resultEl.innerHTML = '<div class="text-center text-gray-400 text-sm py-6">กำลังค้นหา...</div>';
            resultEl.classList.remove('hidden');
            try {
                const res = await fetch(`/api/orders/track/${orderNum}`);
                const data = await res.json();
                if (!data.success) {
                    resultEl.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-semibold text-center">${data.error}</div>`;
                    return;
                }
                const o = data.order;
                const statusMap = {
                    pending: { label: 'รอรับ Order', icon: 'pending', color: 'yellow', desc: 'ร้านค้าได้รับ Order ของท่านแล้ว กำลังตรวจสอบ' },
                    confirmed: { label: 'รับ Order แล้ว', icon: 'check_circle', color: 'blue', desc: 'พนักงานรับ Order เรียบร้อยแล้ว' },
                    preparing: { label: 'กำลังจัดสินค้า', icon: 'inventory_2', color: 'amber', desc: 'พนักงานกำลังจัดเตรียมสินค้าของท่าน' },
                    ready: { label: 'พร้อมรับสินค้า', icon: 'shopping_bag', color: 'green', desc: 'สินค้าพร้อมแล้ว! กรุณามารับที่ร้าน' },
                    cancelled: { label: 'ยกเลิก', icon: 'cancel', color: 'red', desc: 'Order นี้ถูกยกเลิก' },
                    out_of_stock: { label: 'สินค้าหมด', icon: 'warning', color: 'orange', desc: 'สินค้าบางรายการหมดสต็อก กรุณาติดต่อร้านค้า' }
                };
                const sm = statusMap[o.status] || { label: o.status, icon: 'info', color: 'gray', desc: '' };
                const colorClasses = { yellow: 'bg-yellow-100 text-yellow-700', blue: 'bg-blue-100 text-blue-700', amber: 'bg-amber-100 text-amber-700', green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', orange: 'bg-orange-100 text-orange-700', gray: 'bg-gray-100 text-gray-700' };
                const items = Array.isArray(o.items) ? o.items : [];
                const staffNote = o.staff_note ? `<div class="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700 font-semibold">💬 หมายเหตุจากร้านค้า: ${o.staff_note}</div>` : '';

                resultEl.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <div class="flex items-center justify-between mb-4">
                            <span class="font-black text-gray-900">${o.order_number}</span>
                            <span class="${colorClasses[sm.color]} text-xs font-black px-3 py-1 rounded-full">
                                <span class="material-symbols-outlined text-xs mr-1">${sm.icon}</span>${sm.label}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">${sm.desc}</p>
                        ${staffNote}
                        <div class="border-t border-gray-100 pt-3 mt-3 space-y-1.5">
                            ${items.map(i => `<div class="flex justify-between text-xs"><span class="font-semibold text-gray-700">${i.name} × ${i.qty}</span><span class="font-bold text-gray-900">฿${(parseFloat(i.price)*parseInt(i.qty)).toLocaleString()}</span></div>`).join('')}
                        </div>
                        <div class="flex justify-between mt-3 pt-3 border-t border-gray-100">
                            <span class="text-xs font-black text-gray-900">ยอดรวม</span>
                            <span class="font-black text-amber-700">฿${parseFloat(o.total_price).toLocaleString()}</span>
                        </div>
                        <p class="text-[10px] text-gray-400 mt-3">ลูกค้า: ${o.customer_name} • ไฟลท์: ${o.flight_number}</p>
                    </div>`;
            } catch(e) {
                resultEl.innerHTML = '<div class="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-semibold text-center">ไม่สามารถเชื่อมต่อได้</div>';
            }
        }

        function showPreorderStep(step) {
            const steps = ['select-store','products','confirm','done','track'];
            steps.forEach(s => {
                const el = document.getElementById(`preorder-step-${s === 'store' ? 'select-store' : s}`);
                if (el) el.classList.add('hidden');
            });
            const target = step === 'store' ? 'preorder-step-select-store' : `preorder-step-${step}`;
            const el = document.getElementById(target);
            if (el) el.classList.remove('hidden');

            if (step === 'confirm') renderCartSummary();
        }
    
