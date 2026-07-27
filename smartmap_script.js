// smartmap_script.js
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
        1: 395,
        2: 420,
        3: 445,
        4: 470,
        5: 495,
        6: 520,
        7: 545,
        8: 570
    };
    return {
        x: xCoords[num] || 460,
        y: 160
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
    
    svg.innerHTML = '';
    document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());

    if (!results || results.length === 0) return;

    results.forEach(s => {
        const isHidden = selectedShopNumber !== null && selectedShopNumber !== s.shop_number;
        const isSelected = selectedShopNumber === s.shop_number;

        const isFloor3 = s.shop_name.toLowerCase().includes('fl.3') || 
                         s.shop_name.includes('ชั้น 3') || 
                         s.shop_name.toLowerCase().includes('level 3') ||
                         s.shop_name.includes('Fl.3') ||
                         /D[1-8]/i.test(s.shop_name) ||
                         (s.category && s.category.toLowerCase().includes('fl.3')) ||
                         (s.category && s.category.includes('ชั้น 3')) ||
                         (s.tags && s.tags.includes('ชั้น 3'));

        if (s.path && s.path.length > 0 && isSelected) {
            if (!isFloor3) {
                // NORMAL ROUTE RENDERING
                let d = `M ${s.path[0].x} ${s.path[0].y}`;
                for (let i = 1; i < s.path.length; i++) {
                    let prevX = s.path[i-1].x;
                    let prevY = s.path[i-1].y;
                    let currX = s.path[i].x;
                    let currY = s.path[i].y;
                    
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
                pathElement.setAttribute('stroke-width', '2');
                pathElement.setAttribute('stroke-dasharray', '6 6');
                pathElement.setAttribute('stroke-linecap', 'round');
                pathElement.setAttribute('stroke-linejoin', 'round');
                pathElement.setAttribute('class', 'path-animated transition-all duration-300');
                pathElement.id = `path-shop-${s.shop_number}`;
                svg.appendChild(pathElement);

                const startDotGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                startDotGlow.setAttribute('cx', s.path[0].x);
                startDotGlow.setAttribute('cy', s.path[0].y);
                startDotGlow.setAttribute('r', '6');
                startDotGlow.setAttribute('fill', '#0ea5e9');
                
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

                const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                startDot.setAttribute('cx', s.path[0].x);
                startDot.setAttribute('cy', s.path[0].y);
                startDot.setAttribute('r', '7');
                startDot.setAttribute('fill', '#0ea5e9');
                startDot.setAttribute('stroke', '#ffffff');
                startDot.setAttribute('stroke-width', '2.5');
                svg.appendChild(startDot);
            } else {
                // FLOOR 3 RENDERING
                // Create Animated Escalators
                const createEscalator = (x, y) => {
                    const escIcon = document.createElement('div');
                    escIcon.className = 'escalator-icon-container escalator-anim';
                    escIcon.style.left = `${x}px`;
                    escIcon.style.top = `${y}px`;
                    escIcon.innerHTML = `<img src="/uploads/escalator-svgrepo-com.svg" style="width: 24px; height: 24px;" />`;
                    mapContainer.appendChild(escIcon);
                };

                // Draw East (Right) and West (Left) escalators
                createEscalator(337, 247); // West side
                createEscalator(663, 247); // East side
            }
        }

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

            if (s.is_amenity_node) {
                pin.innerHTML = `
                    <div class="bg-indigo-600 text-[10px] font-black text-white px-2 py-0.5 rounded absolute -top-5 whitespace-nowrap shadow-md select-none flex items-center gap-1">
                        ${s.icon ? `<span class="material-symbols-outlined text-[12px]">${s.icon}</span>` : ''}
                        ${s.shop_name}
                    </div>
                    <div class="w-3 h-3 bg-indigo-600 rounded-full border border-white flex items-center justify-center"></div>
                `;
            } else {
                pin.innerHTML = `
                    <div class="bg-[#B59115] text-[9px] font-black text-white px-2 py-0.5 rounded absolute -top-5 whitespace-nowrap shadow-md select-none">
                        SHOP ${s.shop_number}
                    </div>
                    <div class="w-2.5 h-2.5 bg-[#B59115] rounded-full border border-white"></div>
                `;
            }
            mapContainer.appendChild(pin);
        }
    });
}

// ==========================================
// AI SEARCH INTEGRATION
// ==========================================
function triggerHomeAISearch(query) {
    if (!query || query.trim() === '') return;
    openAIModal();
    // Fetch products based on the query to display as a visual overlay in the AI modal
    setTimeout(() => {
        if (typeof performVisualAiSearch === 'function') {
            performVisualAiSearch(query);
        }
    }, 500);
}

function triggerMapAISearch(query) {
    if (!query || query.trim() === '') return;
    
    // Simulate AI Summary Response
    let summaryBox = document.getElementById('map-ai-summary-box');
    
    if (summaryBox) {
        const summaryContent = document.getElementById('map-ai-summary-content');
        if (summaryContent) {
            summaryContent.innerHTML = `<span class="material-symbols-outlined text-[#B59115] align-middle text-sm">smart_toy</span> <b>AI Match for "${query}":</b> PANPURI (3 mins away). Highlight: Best-selling Thai Souvenirs.`;
        }
        summaryBox.classList.remove('hidden');
    }
}