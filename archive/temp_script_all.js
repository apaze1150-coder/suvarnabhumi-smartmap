


        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface-variant": "#44474d",
                        "inverse-surface": "#2e3132",
                        "on-background": "#191c1e",
                        "surface-container-low": "#f3f4f6",
                        "on-tertiary-fixed": "#1c1b1b",
                        "secondary": "#725c10",
                        "primary-fixed-dim": "#bac7e2",
                        "secondary-container": "#ffe088",
                        "on-secondary-container": "#786216",
                        "background": "#f8f9fb",
                        "surface-container-highest": "#e1e2e4",
                        "surface-bright": "#f8f9fb",
                        "on-primary-fixed-variant": "#3b475d",
                        "surface-container-high": "#e7e8ea",
                        "surface-tint": "#525f76",
                        "primary-fixed": "#d6e3ff",
                        "on-tertiary": "#ffffff",
                        "surface": "#f8f9fb",
                        "error-container": "#ffdad6",
                        "outline": "#75777d",
                        "primary-container": "#0f1c30",
                        "on-primary-fixed": "#0f1c30",
                        "surface-variant": "#e1e2e4",
                        "tertiary-container": "#1c1b1b",
                        "on-tertiary-container": "#858383",
                        "surface-container-lowest": "#ffffff",
                        "surface-container": "#edeef0",
                        "tertiary-fixed": "#e5e2e1",
                        "on-secondary-fixed": "#241a00",
                        "on-primary": "#ffffff",
                        "error": "#ba1a1a",
                        "on-secondary": "#ffffff",
                        "tertiary-fixed-dim": "#c8c6c5",
                        "tertiary": "#000000",
                        "status-gold": "#735C00",
                        "secondary-fixed-dim": "#e1c46f",
                        "on-surface": "#191c1e",
                        "on-primary-container": "#78849d",
                        "outline-variant": "#c5c6cd",
                        "on-secondary-fixed-variant": "#574500",
                        "inverse-primary": "#bac7e2",
                        "secondary-fixed": "#ffe088",
                        "on-tertiary-fixed-variant": "#474746",
                        "surface-dim": "#d9dadc",
                        "inverse-on-surface": "#f0f1f3",
                        "on-error": "#ffffff",
                        "charcoal-surface": "#1A1A1A",
                        "on-error-container": "#93000a",
                        "primary": "#000000",
                        "navy-luxury": "#000a1e"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "lg": "24px",
                        "baseline": "4px",
                        "sm": "8px",
                        "xs": "4px",
                        "md": "16px",
                        "gutter": "16px",
                        "xl": "32px",
                        "margin-mobile": "16px",
                        "margin-desktop": "32px"
                    },
                    "fontFamily": {
                        "headline": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "label": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-lg": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-xl": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "label-md": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body-sm": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body-md": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "body-lg": ["Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-md": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "label-sm": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                        "headline-xl-mobile": ["Manrope", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"]
                    },
                    "fontSize": {
                        "headline-lg": ["28px", {"lineHeight": "34px", "fontWeight": "700"}],
                        "headline-xl": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "label-md": ["14px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "700"}],
                        "label-sm": ["12px", {"lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "headline-xl-mobile": ["32px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                }
            }
        }
    

    // Anti-flicker for boutique navigation
    if (window.location.search.includes('boutiqueStore=')) {
        document.write('<style id="anti-flicker">#home-view { display: none !important; }</style>');
    }


        function toggleMainSidebar() {
            const sidebar = document.getElementById('main-sidebar');
            const backdrop = document.getElementById('main-sidebar-backdrop');
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                backdrop.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                backdrop.classList.add('hidden');
            }
        }

        function toggleBoutiqueSidebar() {
            const sidebar = document.getElementById('boutique-sidebar');
            const backdrop = document.getElementById('boutique-sidebar-backdrop');
            if (sidebar && backdrop) {
                if (sidebar.classList.contains('-translate-x-full')) {
                    sidebar.classList.remove('-translate-x-full');
                    backdrop.classList.remove('hidden');
                } else {
                    sidebar.classList.add('-translate-x-full');
                    backdrop.classList.add('hidden');
                }
            }
        }
    



        let mapPanzoom;
        let globalInterval;
        let activeStores = [];
        let isAdminMode = false;
        let selectedShopNumber = null;
        let activeGateNodeId = 'Node_Gate_D4';
        let currentFloor = 4;
        const FLOOR_4_MAP = "/uploads/4.svg";
        const FLOOR_3_MAP = "/uploads/3.svg";
        const SAT1_MAP = "/uploads/5.svg";

        function switchFloor(floor) {
            currentFloor = floor;
            const img = document.getElementById('currentMapSvg') || document.getElementById('map-image-element');
            const btn3 = document.getElementById('floor-3-btn');
            const btn4 = document.getElementById('floor-4-btn');
            const btnSat = document.getElementById('floor-sat-btn');
            const trainLayer = document.getElementById('train-animation-layer');
            if (!img) return;
            
            // Toggle Escalator icons visibility based on floor
            document.querySelectorAll('.escalator-anim').forEach(el => {
                el.style.display = (floor === 3 || floor === '3') ? '' : 'none';
            });
            
            // Toggle Thai Pavilion icons visibility based on floor
            document.querySelectorAll('.thai-pavilion-icon').forEach(el => {
                el.style.display = (floor === 4 || floor === '4' || floor === undefined) ? '' : 'none';
            });

            // Toggle dynamic map pins based on floor attribute
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => {
                const pinFloor = pin.getAttribute('data-floor');
                if (pinFloor) {
                    let pinFloorMap = '';
                    if (pinFloor === 'FL.4') pinFloorMap = '4';
                    else if (pinFloor === 'FL.3') pinFloorMap = '3';
                    else if (pinFloor === 'SAT1') pinFloorMap = 'SAT-1';
                    
                    if (pinFloorMap) {
                        const floorStr = floor.toString();
                        pin.style.display = (floorStr === pinFloorMap) ? '' : 'none';
                    }
                }
            });

            [btn3, btn4, btnSat].forEach(b => {
                if (b) {
                    b.classList.remove('bg-primary', 'bg-[#000a1e]', 'text-white', 'shadow-sm');
                    b.classList.add('text-primary', 'hover:bg-black/5');
                }
            });
            
            const isSatFloor = (floor === 'SAT-1' || floor === 'SAT' || floor === 5 || floor === '5');

            // Toggle Gate D overlay visibility
            const gateDOverlay = document.getElementById('gate-d-overlay-svg');

            if (floor === 3 || floor === '3') {
                img.src = FLOOR_3_MAP;
                if (btn3) {
                    btn3.classList.add('bg-[#000a1e]', 'text-white', 'shadow-sm');
                    btn3.classList.remove('text-primary', 'hover:bg-black/5');
                }
                if (gateDOverlay) gateDOverlay.style.display = '';
                if (document.getElementById('d5-shuttle-overlay')) document.getElementById('d5-shuttle-overlay').style.display = 'flex';
            } else if (isSatFloor) {
                img.src = SAT1_MAP;
                if (btnSat) {
                    btnSat.classList.add('bg-[#000a1e]', 'text-white', 'shadow-sm');
                    btnSat.classList.remove('text-primary', 'hover:bg-black/5');
                }
                if (gateDOverlay) gateDOverlay.style.display = 'none';
                if (document.getElementById('d5-shuttle-overlay')) document.getElementById('d5-shuttle-overlay').style.display = 'none';
            } else {
                img.src = FLOOR_4_MAP;
                if (btn4) {
                    btn4.classList.add('bg-[#000a1e]', 'text-white', 'shadow-sm');
                    btn4.classList.remove('text-primary', 'hover:bg-black/5');
                }
                if (gateDOverlay) gateDOverlay.style.display = 'none';
                if (document.getElementById('d5-shuttle-overlay')) document.getElementById('d5-shuttle-overlay').style.display = 'none';
            }

            // Train animation layer only shows and moves on SAT-1 floor
            if (trainLayer) {
                if (isSatFloor) {
                    trainLayer.style.display = 'flex';
                    trainLayer.classList.remove('hidden');
                    const trainIcon = trainLayer.querySelector('.train-icon');
                    if (trainIcon) trainIcon.style.animation = 'trainMove 4s infinite cubic-bezier(0.4, 0, 0.2, 1)';
                } else {
                    trainLayer.style.display = 'none';
                    trainLayer.classList.add('hidden');
                    const trainIcon = trainLayer.querySelector('.train-icon');
                    if (trainIcon) trainIcon.style.animation = 'none';
                }
            }
        }

        function getSGateCoords(gateCode) {
            if (!gateCode) return null;
            const clean = gateCode.toUpperCase().replace(/^GATE\s*/i, '').replace(/\s+/g, '');
            const match = clean.match(/^S(\d{3})/);
            if (!match) return null;
            
            const num = parseInt(match[1], 10);
            let targetX = 500;
            let targetY = 250;
            
            if (num >= 101 && num <= 112) {
                targetX = 500 - ((113 - num) * 35);
            } else if (num >= 113 && num <= 128) {
                targetX = 500 + ((num - 112) * 35);
            }
            
            targetX = Math.max(100, Math.min(900, targetX));
            return { x: targetX, y: targetY };
        }

        function getDGateCoords(gateCode) {
            if (!gateCode) return null;
            const clean = gateCode.toUpperCase().replace(/^GATE\s*/i, '').replace(/\s+/g, '');
            const match = clean.match(/^D([1-8])/);
            if (!match) return null;
            
            const num = parseInt(match[1], 10);
            const xCoords = {
                1: 337,
                2: 371,
                3: 415,
                4: 454,
                5: 500,
                6: 550,
                7: 598,
                8: 648
            };
            return {
                x: xCoords[num] || 454,
                y: 177
            };
        }

        function fitMapToScreen() {
            if (!mapPanzoom) return;
            const container = document.getElementById('panzoom-wrapper');
            if (!container) return;
            const wrapperWidth = container.clientWidth || window.innerWidth;
            const targetWidth = 1000;
            let fitScale = (wrapperWidth - 32) / targetWidth;
            if (fitScale < 0.5) fitScale = 0.5;
            if (fitScale > 3.0) fitScale = 3.0;
            
            mapPanzoom.zoom(fitScale, { animate: false });
            mapPanzoom.pan(0, 0, { animate: false });
        }

        window.onload = function () {
            const mapElem = document.getElementById('map-image-container');
            mapPanzoom = Panzoom(mapElem, { maxScale: 5, minScale: 0.3, contain: false, step: 0.3 });
            mapElem.parentElement.addEventListener('wheel', mapPanzoom.zoomWithWheel);

            document.getElementById('zoom-in').addEventListener('click', mapPanzoom.zoomIn);
            document.getElementById('zoom-out').addEventListener('click', mapPanzoom.zoomOut);
            document.getElementById('zoom-reset').addEventListener('click', () => fitMapToScreen());

            fitMapToScreen();
            window.addEventListener('resize', fitMapToScreen);

            trackFlightLive("TG679");

            // Restore previous orders and show bubble if exists
            let savedOrders = localStorage.getItem('myOrders');
            if (!savedOrders) {
                const oldOrder = localStorage.getItem('myLastOrder');
                if (oldOrder) savedOrders = JSON.stringify([oldOrder]);
            }
            if (savedOrders) {
                try {
                    const ordersArray = JSON.parse(savedOrders);
                    if (ordersArray.length > 0) {
                        lastCompletedOrderNumber = ordersArray[ordersArray.length - 1];
                        const floatBtn = document.getElementById('floating-track-btn');
                        if (floatBtn) floatBtn.classList.remove('hidden');
                        
                        renderOrderHistory(ordersArray);
                    }
                } catch(e) {}
            }
        };

        // --- 1. LIVE API เที่ยวบินและการนับถอยหลัง ---
        async function trackFlightLive(forcedFlightId = null, isUserAction = false) {
            const inputVal = forcedFlightId || document.getElementById('flight-input').value.trim().toUpperCase();
            if (!inputVal) return;

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
                activeGateNodeId = data.gate_node_id || null;

                const badge = document.getElementById('flight-status-badge');
                if (data.gate === 'TBD' || !activeGateNodeId) {
                    badge.classList.add('hidden');
                    document.getElementById('navigate-gate-btn-container').classList.add('hidden');
                } else {
                    badge.classList.remove('hidden');
                    badge.className = `px-3 py-1 rounded-full flex items-center gap-1.5 border bg-[#B59115]/20 border-[#B59115]`;
                    document.getElementById('flight-status-text').className = "text-[10px] font-bold text-white uppercase tracking-wider";
                    document.getElementById('flight-status-text').innerText = `${data.walk_time_mins} Min Walk`;
                    document.getElementById('navigate-gate-btn-container').classList.remove('hidden');
                }
                startCountdownLive(data.boarding_time);

            } catch (error) {
                console.error("Backend Offline - ใช้ข้อมูลสำรองสำหรับเดโม:", error);
                document.getElementById('flight-number-display').innerText = inputVal;
                document.getElementById('flight-route-display').innerText = "International Flight Journey";
                document.getElementById('flight-gate-display').innerText = "TBD";
                activeGateNodeId = null;
                document.getElementById('flight-status-badge').classList.add('hidden');
                document.getElementById('navigate-gate-btn-container').classList.add('hidden');
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
                activeGateNodeId = data.gate_node_id || null;

                const badge = document.getElementById('flight-status-badge');
                if (data.gate === 'TBD' || !activeGateNodeId) {
                    badge.classList.add('hidden');
                    document.getElementById('navigate-gate-btn-container').classList.add('hidden');
                } else {
                    badge.classList.remove('hidden');
                    badge.className = `px-3 py-1 rounded-full flex items-center gap-1.5 border bg-[#B59115]/20 border-[#B59115]`;
                    document.getElementById('flight-status-text').className = "text-[10px] font-bold text-white uppercase tracking-wider";
                    document.getElementById('flight-status-text').innerText = `${data.walk_time_mins} Min Walk`;
                    document.getElementById('navigate-gate-btn-container').classList.remove('hidden');
                }

            } catch (err) {
                console.error("Error updating manual gate:", err);
                alert("Failed to update gate with server.");
            }
        }

        // --- 2. DYNAMIC PATH AND PIN RENDERING ---
        function renderStoreRoutes(results) {
            const svg = document.getElementById('route-path-svg');
            const mapContainer = document.getElementById('map-image-container');
            const currentMapImg = document.getElementById('currentMapSvg');
            
            // Clear previous paths & pins
            svg.innerHTML = '';
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
            document.querySelectorAll('.escalator-anim').forEach(el => el.remove());

            // Reset Map to Level 4 by default
            switchFloor(4);

            if (!results || results.length === 0) return;

            results.forEach(s => {
                const isHidden = selectedShopNumber !== null && selectedShopNumber !== s.shop_number;
                const isSelected = selectedShopNumber === s.shop_number;
                // 1. Draw Path ONLY if this specific shop is selected
                const isFloor3 = s.shop_name.toLowerCase().includes('fl.3') || 
                                 s.shop_name.includes('ชั้น 3') || 
                                 s.shop_name.toLowerCase().includes('level 3') ||
                                 s.shop_name.includes('Fl.3') ||
                                 /D[1-8]/i.test(s.shop_name) ||
                                 (s.category && s.category.toLowerCase().includes('fl.3')) ||
                                 (s.category && s.category.includes('ชั้น 3')) ||
                                 (s.tags && s.tags.includes('ชั้น 3'));

                const isSat = s.shop_name.toLowerCase().includes('sat') || 
                              s.shop_name.toLowerCase().includes('satellite') || 
                              /S\d{3}/i.test(s.shop_name) ||
                              (s.brands_available && s.brands_available.toLowerCase().includes('sat'));

                if (isSelected) {
                    // Update Map Background based on Floor using switchFloor to update UI
                    if (isSat) {
                        switchFloor('SAT-1');
                    } else if (isFloor3) {
                        switchFloor(3);
                    } else {
                        switchFloor(4);
                    }

                    let startX = 489;
                    let startY = 227;
                    
                    if (isSat) {
                        // Start point for SAT map (e.g., Shuttle Train Arrival)
                        startX = 500;
                        startY = 250;
                    }

                    // Target coordinates from Store Matrix Column G (x) and Column H (y)
                    const targetX = (s.coordinates && s.coordinates.x !== undefined && !isNaN(parseFloat(s.coordinates.x))) ? parseFloat(s.coordinates.x) : 489;
                    const targetY = (s.coordinates && s.coordinates.y !== undefined && !isNaN(parseFloat(s.coordinates.y))) ? parseFloat(s.coordinates.y) : 227;

                    const dx = targetX - startX;
                    const dy = targetY - startY;
                    let d = "";

                    if (Math.abs(dx) < 5) {
                        d = `M ${startX} ${startY} L ${targetX} ${targetY}`;
                    } else {
                        const dirX = dx > 0 ? 1 : -1;
                        const dirY = dy > 0 ? 1 : -1;
                        const R = Math.min(6, Math.abs(dx) * 0.2, Math.abs(dy) * 0.2);

                        const turnX = targetX - dirX * R;
                        const turnY = startY + dirY * R;

                        d = `M ${startX} ${startY} L ${turnX} ${startY} Q ${targetX} ${startY} ${targetX} ${turnY} L ${targetX} ${targetY}`;
                    }

                    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    pathElement.setAttribute('d', d);
                    pathElement.setAttribute('fill', 'none');
                    pathElement.setAttribute('stroke', '#0ea5e9'); // Green path line
                    pathElement.setAttribute('stroke-width', '2');
                    pathElement.setAttribute('stroke-dasharray', '6 6');
                    pathElement.setAttribute('stroke-linecap', 'round');
                    pathElement.setAttribute('stroke-linejoin', 'round');
                    pathElement.setAttribute('class', 'path-animated transition-all duration-300');
                    pathElement.id = `path-shop-${s.shop_number}`;
                    if (!isFloor3) {
                        svg.appendChild(pathElement);
    
                        // Start Dot Animation (Pulse)
                        const startDotGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        startDotGlow.setAttribute('cx', startX);
                        startDotGlow.setAttribute('cy', startY);
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
                        startDot.setAttribute('cx', startX);
                        startDot.setAttribute('cy', startY);
                        startDot.setAttribute('r', '7');
                        startDot.setAttribute('fill', '#0ea5e9'); // Blue color
                        startDot.setAttribute('stroke', '#ffffff');
                        startDot.setAttribute('stroke-width', '2.5');
                        svg.appendChild(startDot);
                    } else {
                        // FLOOR 3 RENDERING
                        const createEscalator = (x, y, flip = false) => {
                            const escIcon = document.createElement('div');
                            escIcon.className = 'escalator-icon-container escalator-anim absolute z-10 filter drop-shadow-md';
                            escIcon.style.left = `${x}px`;
                            escIcon.style.top = `${y}px`;
                            escIcon.style.transform = 'translate(-50%, -50%)'; // Center on the exact coordinates
                            const flipStyle = flip ? 'transform: scaleX(-1);' : '';
                            escIcon.innerHTML = `<img src="/uploads/escalator-svgrepo-com.svg" style="width: 28px; height: 28px; ${flipStyle}" />`;
                            mapContainer.appendChild(escIcon);
                        };
        
                        createEscalator(309, 178, true); // West side (flipped)
                        createEscalator(681, 178); // East side
                    }
                }

                // 2. Draw Map Pin (Teardrop Location Pin with Sharp Tip at Target Coordinates)
                if (!isHidden) {
                    const pin = document.createElement('div');
                    pin.className = `dynamic-map-pin absolute z-10 transition-all duration-300 flex flex-col items-center select-none ${isAdminMode ? 'cursor-grab' : 'cursor-pointer'}`;
                    pin.id = `pin-shop-${s.shop_number}`;
                    if (s.floor) pin.setAttribute('data-floor', s.floor);
                    const targetX = (s.coordinates && s.coordinates.x !== undefined && !isNaN(parseFloat(s.coordinates.x))) ? parseFloat(s.coordinates.x) : 489;
                    const targetY = (s.coordinates && s.coordinates.y !== undefined && !isNaN(parseFloat(s.coordinates.y))) ? parseFloat(s.coordinates.y) : 227;
                    pin.style.left = `${targetX}px`;
                    pin.style.top = `${targetY}px`;
                    pin.style.transform = 'translate(-50%, -100%)';

                    if (isAdminMode) {
                        makePinDraggable(pin, s.shop_number, mapContainer);
                    } else {
                        pin.onclick = () => selectStoreCard(s.shop_number);
                    }

                    if (s.is_amenity_node) {
                        let iconName = s.icon;
                        if (['vat_refund', 'restaurant', 'wc', 'bank_transfer', 'lounge', 'Pharmacy', 'prayer-room', 'smoking-area', 'exchange-rate', 'information'].includes(iconName)) {
                            let imgSrc = '';
                            let borderColor = 'border-blue-700';
                            
                            if (iconName === 'vat_refund') { imgSrc = '/uploads/vat_refund.png'; }
                            else if (iconName === 'restaurant') { imgSrc = '/uploads/cutlery.png'; borderColor = 'border-orange-500'; }
                            else if (iconName === 'wc') { imgSrc = '/uploads/toilet-.png'; borderColor = 'border-red-600'; }
                            else if (iconName === 'bank_transfer') { imgSrc = '/uploads/bank-transfer.png'; borderColor = 'border-emerald-500'; }
                            else if (iconName === 'lounge') { imgSrc = '/uploads/lounge.png'; borderColor = 'border-purple-500'; }
                            else if (iconName === 'Pharmacy') { imgSrc = '/uploads/medicine.png'; borderColor = 'border-emerald-600'; }
                            else if (iconName === 'prayer-room') { imgSrc = '/uploads/prayer-room.png'; borderColor = 'border-indigo-500'; }
                            else if (iconName === 'smoking-area') { imgSrc = '/uploads/smoking-area.png'; borderColor = 'border-gray-500'; }
                            else if (iconName === 'exchange-rate') { imgSrc = '/uploads/exchange-rate.png'; borderColor = 'border-green-600'; }
                            else if (iconName === 'information') { imgSrc = '/uploads/information.png'; borderColor = 'border-blue-500'; }

                            pin.innerHTML = `
                                <div class="animate-pulse flex flex-col items-center pb-1">
                                    <div class="bg-white shadow-lg border-2 ${borderColor} flex items-center justify-center overflow-hidden" style="width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);">
                                        <img src="${imgSrc}" onerror="this.src='/uploads/default.jpg'" alt="${iconName}" style="width: 14px; height: 14px; transform: rotate(45deg); object-fit: contain;" />
                                    </div>
                                </div>
                                <div class="w-2 h-2 bg-black/30 rounded-full blur-[2px]"></div>
                            `;
                        } else if (iconName && iconName.trim() !== '') {
                            let bgColor = "bg-blue-600";
                            if (iconName === "account_balance") bgColor = "bg-emerald-500";
                            else if (iconName === "shopping_cart") bgColor = "bg-blue-500";
                            
                            pin.innerHTML = `
                                <div class="animate-pulse flex flex-col items-center">
                                    <div class="${bgColor} text-white rounded-full p-2 shadow-lg border-2 border-white mb-1 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-[16px]">${iconName}</span>
                                    </div>
                                    <div class="w-3 h-3 ${bgColor} rotate-45 transform -mt-2.5 border-r-2 border-b-2 border-white shadow-lg"></div>
                                </div>
                                <div class="w-2 h-2 bg-black/30 rounded-full blur-[2px] mt-1"></div>
                            `;
                        } else {
                            pin.innerHTML = `
                                <div class="relative w-3.5 h-5 flex items-center justify-center filter drop-shadow-sm">
                                    <svg viewBox="0 0 24 32" class="w-3.5 h-5 text-indigo-600">
                                        <path fill="currentColor" stroke="#FFFFFF" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"/>
                                        <circle cx="12" cy="11" r="4.5" fill="#FFFFFF"/>
                                    </svg>
                                </div>
                            `;
                        }
                    } else {
                        pin.innerHTML = `
                            <div class="bg-[#dc2626] text-[7.5px] font-black text-white px-1 py-0.25 rounded shadow-sm mb-0.5 whitespace-nowrap border border-white/40 select-none">
                                SHOP ${s.shop_number}
                            </div>
                            <div class="relative w-3.5 h-5 flex items-center justify-center filter drop-shadow-sm">
                                <svg viewBox="0 0 24 32" class="w-3.5 h-5 text-[#ef4444]">
                                    <path fill="currentColor" stroke="#FFFFFF" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"/>
                                    <circle cx="12" cy="11" r="4.5" fill="#FFFFFF"/>
                                </svg>
                            </div>
                        `;
                    }
                    mapContainer.appendChild(pin);
                    // Auto-zoom logic for selected route
                    if (isSelected && typeof mapPanzoom !== 'undefined' && mapPanzoom) {
                        setTimeout(() => {
                            const startX = 489;
                            const startY = 227;
                            const targetX = (s.coordinates && s.coordinates.x !== undefined && !isNaN(parseFloat(s.coordinates.x))) ? parseFloat(s.coordinates.x) : 489;
                            const targetY = (s.coordinates && s.coordinates.y !== undefined && !isNaN(parseFloat(s.coordinates.y))) ? parseFloat(s.coordinates.y) : 227;
                            
                            // Calculate bounding box center
                            const centerX = (startX + targetX) / 2;
                            const centerY = (startY + targetY) / 2;
                            
                            // Calculate distance to determine zoom level
                            const dx = Math.abs(targetX - startX);
                            const dy = Math.abs(targetY - startY);
                            const distance = Math.max(dx, dy);
                            
                            let targetScale = 2; // Default scale for short routes
                            if (distance > 400) targetScale = 0.8;
                            else if (distance > 250) targetScale = 1.2;
                            else if (distance > 100) targetScale = 1.5;
                            
                            // Container size for centering adjustment
                            // Since the 1000x500 SVG is naturally centered, pan(0,0) centers it on 500,250.
                            const panX = 500 - centerX;
                            const panY = 250 - centerY;
                            
                            mapPanzoom.pan(panX, panY, { animate: true, relative: false });
                            mapPanzoom.zoom(targetScale, { animate: true });
                        }, 100);
                    }
                }
            });
        }

        // --- 3. STORE SEARCH AND CATEGORY FILTERS ---
        function toggleCategoryPanel(forceState = null) {
            const panel = document.getElementById('category-panel-content');
            const toggleBtn = document.getElementById('toggle-sidebar');
            if (!panel) return;

            const isHidden = panel.classList.contains('hidden');
            const shouldOpen = forceState !== null ? forceState : isHidden;

            if (shouldOpen) {
                panel.classList.remove('hidden');
                requestAnimationFrame(() => {
                    panel.classList.remove('opacity-0', 'scale-95');
                    panel.classList.add('opacity-100', 'scale-100');
                });
                if (toggleBtn) {
                    toggleBtn.classList.add('bg-primary', 'text-white');
                    toggleBtn.classList.remove('bg-white/95', 'text-primary');
                }
            } else {
                panel.classList.remove('opacity-100', 'scale-100');
                panel.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    panel.classList.add('hidden');
                }, 250);
                if (toggleBtn) {
                    toggleBtn.classList.remove('bg-primary', 'text-white');
                    toggleBtn.classList.add('bg-white/95', 'text-primary');
                }
            }
        }

        function selectCategoryFilter(categoryName) {
            if (categoryName === 'all') {
                clearSearch();
            } else {
                searchByCategory(categoryName);
            }
            toggleCategoryPanel(false);
        }

        async function searchByCategory(categoryName) {
            document.querySelectorAll('.category-btn').forEach(btn => {
                const btnCat = btn.getAttribute('data-category');
                if (btnCat && btnCat.toLowerCase() === categoryName.toLowerCase()) {
                    btn.classList.add('bg-primary', 'text-white');
                    btn.classList.remove('bg-surface-container-low');
                } else {
                    btn.classList.remove('bg-primary', 'text-white');
                    btn.classList.add('bg-surface-container-low');
                }
            });

            document.getElementById('map-search-input').value = categoryName;
            document.getElementById('clear-search-btn').classList.remove('hidden');
            await searchMapLive(categoryName);
        }

        async function searchMapLive(overrideQuery = null) {
            let queryText = overrideQuery || document.getElementById('map-search-input').value.trim();
            if (!queryText) return;

            // --- AI Keyword Synonym Mapping (Smart Search Enhancement) ---
            const qLower = queryText.toLowerCase();
            if (['food', 'ของกิน', 'ร้านอาหาร', 'ข้าว', 'หิว'].some(k => qLower.includes(k))) {
                queryText = 'restaurant';
            } else if (['pharmacy', 'ร้านขายยา', 'ยา', 'medicine', 'ป่วย'].some(k => qLower.includes(k))) {
                queryText = 'Pharmacy';
            } else if (['ห้องน้ำ', 'สุขา', 'wc', 'toilet', 'restroom', 'ปวดฉี่'].some(k => qLower.includes(k))) {
                queryText = 'restroom';
            } else if (['สูบบุหรี่', 'smoking', 'ที่สูบบุหรี่', 'บุหรี่'].some(k => qLower.includes(k))) {
                queryText = 'smoking-area';
            } else if (['vat refund', 'ขอคืนภาษี', 'คืนภาษี', 'vat'].some(k => qLower.includes(k))) {
                queryText = 'vat_refund';
            } else if (['แลกเงิน', 'exchange', 'เงิน', 'currency', 'ธนาคาร', 'bank'].some(k => qLower.includes(k))) {
                queryText = 'exchange-rate';
            } else if (['ติดต่อสอบถาม', 'information', 'info', 'ข้อมูล', 'สอบถาม', 'ประชาสัมพันธ์'].some(k => qLower.includes(k))) {
                queryText = 'information';
            }

            const isSatQuery = queryText.toLowerCase().includes('sat') || /S\d{3}/i.test(queryText);
            if (isSatQuery) {
                switchFloor('SAT-1');
            } else {
                switchFloor(4);
            }

            // Panpuri popup special deal
            if (queryText.toLowerCase().includes('panpuri')) {
                setTimeout(() => {
                    // alert(`✨ พบแบรนด์ Pañpuri บนเส้นทางเดินของคุณ! \n\n🔥 สินค้าขายดีแนะนำ:\n1. Perfume Oil\n2. Hand Cream\n\n🎟️ รับสิทธิ์พิเศษเฉพาะคุณ: Get 10% Off สำหรับลูกค้า King Power`);
                }, 300);
            }

            try {
                // 1. Try to search for a Gate/Node first
                const nodeRes = await fetch(`/api/search-node?q=${encodeURIComponent(queryText)}`);
                const nodeData = await nodeRes.json();
                
                let nodes = nodeData.nodes || [];

                // SAT Gate Fallback
                const satMatch = queryText.match(/^(?:GATE\s+)?(S\d{3}[A-Z]?)$/i);
                if (nodes.length === 0 && satMatch) {
                    nodes = [{
                        name: `Gate ${satMatch[1].toUpperCase()}`,
                        node_id: `Node_Gate_${satMatch[1].toUpperCase()}`,
                        type: 'gate',
                        concourse: 'SAT',
                        icon: 'flight_takeoff',
                        x: 520, // approximate center for SAT
                        y: 300
                    }];
                    nodeData.success = true;
                }
                
                if (nodeData.success && nodes && nodes.length > 0) {
                    // Always show results cards, even for a single result (matches Store Matrix behavior)
                    const dummyStores = nodes.map(node => ({
                        shop_name: node.name,
                        shop_number: node.node_id,
                        category: node.type || "Facility",
                        brands_available: node.concourse ? `Concourse ${node.concourse}` : "Airport Facility",
                        shop_image: node.image_url || (node.type === 'restroom' ? 'restroom.jpg' : 'default.jpg'),
                        x: node.x,
                        y: node.y,
                        coordinates: { x: node.x, y: node.y },
                        graph_node_id: node.node_id,
                        icon: node.icon,
                        is_amenity_node: true
                    }));
                    activeStores = dummyStores;
                    selectedShopNumber = dummyStores.length === 1 ? dummyStores[0].shop_number : null;

                    const legacyGateRoute = document.getElementById('route-gate-c');
                    if (legacyGateRoute) legacyGateRoute.classList.add('hidden');

                    renderResultsCards(activeStores);
                    renderStoreRoutes(activeStores);
                    document.getElementById('results-container').classList.remove('hidden');
                    if (window.innerWidth < 768) {
                        document.getElementById('panzoom-wrapper').style.bottom = '45vh';
                    }
                    document.getElementById('clear-search-btn').classList.remove('hidden');

                    // Top cancel banner hidden for store search as per request
                    return;
                }
            } catch (e) {
                console.error("Node search error in searchMapLive:", e);
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
                    selectedShopNumber = null; // Do not auto-select store until user selects one

                    // Hide legacy flight path overlay
                    const legacyGateRoute = document.getElementById('route-gate-c');
                    if (legacyGateRoute) legacyGateRoute.classList.add('hidden');

                    renderResultsCards(activeStores);
                    renderStoreRoutes(activeStores);
                    document.getElementById('results-container').classList.remove('hidden');
                    if (window.innerWidth < 768) {
                        document.getElementById('panzoom-wrapper').style.bottom = '45vh';
                    }
                    document.getElementById('clear-search-btn').classList.remove('hidden');

                    // Top cancel banner hidden for store search as per request

                    // Center the panzoom on passport control/center area
                    fitMapToScreen();
                } else {
                    alert("ไม่พบแบรนด์ดังกล่าวในแผนผังร้านค้า 1-49");
                    document.getElementById('results-container').classList.add('hidden');
                    document.getElementById('route-path-svg').innerHTML = '';
                    document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
                }
            } catch (error) {
                console.error("Search failed:", error);
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์หลังบ้าน: " + error.message);
            }
        }

        function handleMapSearchEnter(e) { if (e.key === 'Enter') searchMapLive(); }

        function cancelNavigationWithConfirm() {
            const modal = document.getElementById('cancel-nav-modal');
            const backdrop = document.getElementById('cancel-nav-backdrop');
            const content = document.getElementById('cancel-nav-content');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                requestAnimationFrame(() => {
                    backdrop.classList.remove('opacity-0');
                    content.classList.remove('scale-95', 'opacity-0');
                    content.classList.add('scale-100', 'opacity-100');
                });
            } else {
                if (confirm('คุณต้องการยกเลิกการNavigateใช่หรือไม่?')) {
                    clearSearch();
                }
            }
        }

        function closeCancelNavModal() {
            const modal = document.getElementById('cancel-nav-modal');
            const backdrop = document.getElementById('cancel-nav-backdrop');
            const content = document.getElementById('cancel-nav-content');
            if (!modal) return;
            
            backdrop.classList.add('opacity-0');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        function confirmCancelNavigation() {
            closeCancelNavModal();
            clearSearch();
        }

        // Clear Search / Cancel Navigation Function
        function clearSearch() {
            document.getElementById('map-search-input').value = '';
            document.getElementById('clear-search-btn').classList.add('hidden');
            
            // Reset active category buttons
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-surface-container-low');
            });

            // Reset menubar and results container positioning
            const menuBar = document.getElementById('main-mobile-menubar');
            const resultsContainer = document.getElementById('results-container');
            if (menuBar) menuBar.classList.remove('translate-y-[150%]');
            if (resultsContainer) {
                resultsContainer.classList.add('md:bottom-28', 'pb-[120px]');
                resultsContainer.classList.remove('md:bottom-4', 'pb-4');
                resultsContainer.classList.add('hidden');
            }
            if (window.innerWidth < 768) {
                document.getElementById('panzoom-wrapper').style.bottom = '0';
            }

            // Hide results container, gate path, and clear SVG paths/pins
            document.getElementById('route-path-svg').innerHTML = '';
            const routeGateC = document.getElementById('route-gate-c');
            if (routeGateC) routeGateC.classList.add('hidden');

            document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
            
            // Hide train animation layer
            const trainLayer = document.getElementById('train-animation-layer');
            if (trainLayer) {
                trainLayer.style.display = 'none';
                trainLayer.classList.add('hidden');
                const trainIcon = trainLayer.querySelector('.train-icon');
                if (trainIcon) trainIcon.style.animation = 'none';
            }

            // Hide cancel banner
            const cancelBanner = document.getElementById('cancel-route-banner');
            if (cancelBanner) cancelBanner.classList.add('hidden');

            activeStores = [];
            selectedShopNumber = null;
            
            // Zoom back to fit screen when cancelling
            fitMapToScreen();
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

            // Check if there's a pending AI search query from index.html
            const aiQuery = localStorage.getItem('aiSearchQuery');
            if (aiQuery) {
                localStorage.removeItem('aiSearchQuery');
                openAIModal();
                setTimeout(() => {
                    performVisualAiSearch(aiQuery);
                }, 1000); // Give modal time to open before showing visual recommendations
            }
        });

        // --- 4. CARDS RENDERING AND HIGHLIGHTING ---
        function renderResultsCards(stores) {
            const container = document.getElementById('results-container');
            container.innerHTML = '';

            const displayStores = selectedShopNumber 
                ? stores.filter(s => s.shop_number === selectedShopNumber)
                : stores;

            if (displayStores && displayStores.length > 0) {
                if (!selectedShopNumber) {
                    const headerCard = document.createElement('div');
                    headerCard.className = 'pointer-events-auto bg-[#000a1e]/90 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-md flex items-center justify-between text-white text-xs font-bold border border-white/10 mb-1';
                    headerCard.innerHTML = `
                        <span class="flex items-center gap-1.5 text-amber-400 font-extrabold">
                            <span class="material-symbols-outlined text-sm">search</span>
                            Search Results (${displayStores.length} ${displayStores.length > 1 ? 'stores' : 'store'})
                        </span>
                    `;
                    container.appendChild(headerCard);
                }
            }

            displayStores.forEach(s => {
                const isSelected = selectedShopNumber === s.shop_number;
                const card = document.createElement('div');
                card.className = `store-card pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border-2 transition-all duration-200 flex flex-col ${isSelected ? 'border-[#B59115] scale-[1.02] bg-white' : 'border-transparent hover:border-[#B59115]/30 active:scale-[0.98]'}`;
                card.onclick = () => selectStoreCard(s.shop_number);
                const imgUrl = (s.shop_image && (s.shop_image.startsWith('http://') || s.shop_image.startsWith('https://') || s.shop_image.startsWith('/uploads/') || s.shop_image.startsWith('uploads/'))) 
                    ? s.shop_image 
                    : `/uploads/${s.shop_image || 'default.jpg'}`;

                let productsHTML = '';
                if (isSelected && s.products && s.products.length > 0) {
                    let productCards = s.products.map(p => {
                        let pImgUrl = (p.PRODUCT_IMAGE_FILENAME && (p.PRODUCT_IMAGE_FILENAME.startsWith('http') || p.PRODUCT_IMAGE_FILENAME.startsWith('/uploads/'))) 
                            ? p.PRODUCT_IMAGE_FILENAME 
                            : `/uploads/${p.PRODUCT_IMAGE_FILENAME || 'default_product.jpg'}`;
                            
                        return `
                            <div class="min-w-[120px] w-[120px] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden shrink-0 flex flex-col cursor-pointer active:scale-95 transition-all snap-start">
                                <div class="h-[100px] w-full bg-slate-50 relative">
                                    <img src="${pImgUrl}" onclick="event.stopPropagation(); openImagePreview('${pImgUrl}')" class="w-full h-full object-cover" />
                                    ${p.IS_TOP_SELLER === 'true' ? '<div class="absolute top-1 left-1 bg-amber-400 text-amber-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">Top Seller</div>' : ''}
                                </div>
                                <div class="p-2.5 flex flex-col justify-between flex-grow">
                                    <div class="font-bold text-[11px] text-slate-800 leading-tight line-clamp-2">${p.PRODUCT_NAME}</div>
                                    <div class="mt-2 flex items-center justify-between">
                                        <div class="text-[11px] font-black text-[#B59115]">฿${p.PRICE_THB}</div>
                                        <button onclick="event.stopPropagation();" class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                            <span class="material-symbols-outlined text-[12px]">shopping_bag</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');

                    productsHTML = `
                        <div class="mt-4 pt-3 border-t border-slate-100 w-full" onclick="event.stopPropagation()">
                            <div class="flex items-center justify-between mb-3 px-1">
                                <h5 class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5"><span class="material-symbols-outlined text-sm text-[#B59115]">star</span> Top Recommendations</h5>
                                <span class="text-[9px] font-bold text-[#B59115] bg-[#B59115]/10 px-2 py-0.5 rounded-full">${s.products.length} Items</span>
                            </div>
                            <div class="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide px-1" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
                                ${productCards}
                            </div>
                        </div>
                    `;
                }

                let cancelBtnHTML = '';
                if (isSelected) {
                    cancelBtnHTML = `
                        <button onclick="event.stopPropagation(); cancelNavigationWithConfirm()" class="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
                            <span class="material-symbols-outlined text-sm">close</span>
                            Cancel Navigation
                        </button>
                    `;
                }

                let cardInner = '';
                
                if (s.is_amenity_node) {
                    // Amenity Node Card (Restroom, Gate, etc.)
                    const defaultIcon = 'place';
                    cardInner = `
                        <div class="flex gap-4 items-center w-full cursor-pointer">
                            <div class="w-16 h-16 rounded-xl bg-indigo-50 shrink-0 overflow-hidden border border-indigo-100 flex items-center justify-center text-indigo-400">
                                ${s.shop_image ? `<img src="${imgUrl}" onclick="event.stopPropagation(); openImagePreview('${imgUrl}')" class="w-full h-full object-cover" />` : `<span class="material-symbols-outlined text-3xl">${s.icon || defaultIcon}</span>`}
                            </div>
                            <div class="flex-grow min-w-0">
                                <div class="flex justify-between items-start">
                                    <span class="bg-indigo-100 text-indigo-600 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">${s.category || 'Facility'}</span>
                                    <span class="text-[11px] font-black text-secondary whitespace-nowrap">${s.walk_time_mins} min walk</span>
                                </div>
                                <h4 class="font-bold text-primary text-sm mt-1 truncate leading-tight">${s.shop_name}</h4>
                                <p class="text-[10px] text-on-surface-variant/80 mt-1 font-medium flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px]">directions_walk</span> ${s.distance_meters} meters away
                                </p>
                            </div>
                        </div>
                        ${cancelBtnHTML}
                    `;
                } else {
                    // Regular Store Card
                    cardInner = `
                        <div class="flex gap-4 items-center w-full cursor-pointer">
                            <div class="w-16 h-16 rounded-xl bg-surface-container-high shrink-0 overflow-hidden border border-outline-variant/30 flex items-center justify-center">
                                <img src="${imgUrl}" onclick="event.stopPropagation(); openImagePreview('${imgUrl}')" class="w-full h-full object-cover" onerror="this.outerHTML='<span class=\'material-symbols-outlined text-3xl text-primary/30\'>storefront</span>'" />
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
                        </div>
                        ${productsHTML}
                        ${cancelBtnHTML}
                    `;
                }

                card.innerHTML = cardInner;
                container.appendChild(card);
            });
        }

        function selectStoreCard(shopNumber) {
            if (selectedShopNumber === shopNumber) {
                selectedShopNumber = null;
            } else {
                selectedShopNumber = shopNumber;
            }

            // Toggle menubar visibility
            const menuBar = document.getElementById('main-mobile-menubar');
            const resultsContainer = document.getElementById('results-container');
            if (selectedShopNumber) {
                if (menuBar) menuBar.classList.add('translate-y-[150%]');
                if (resultsContainer) {
                    resultsContainer.classList.remove('md:bottom-28', 'pb-[120px]');
                    resultsContainer.classList.add('md:bottom-4', 'pb-4');
                }
            } else {
                if (menuBar) menuBar.classList.remove('translate-y-[150%]');
                if (resultsContainer) {
                    resultsContainer.classList.add('md:bottom-28', 'pb-[120px]');
                    resultsContainer.classList.remove('md:bottom-4', 'pb-4');
                }
            }

            renderResultsCards(activeStores);
            renderStoreRoutes(activeStores);
        }


        // --- 5. UI PAGE NAVIGATION UTILITIES ---
        function showPage(pageId) {
            // Update URL so refreshing works correctly without reloading the whole page
            if (pageId === 'home-view') {
                window.history.pushState(null, '', window.location.pathname);
            } else if (pageId === 'map-view') {
                window.history.pushState(null, '', window.location.pathname + '?view=map');
            }

            document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');

            const bottomNavBar = document.getElementById('bottom-nav-bar');
            if (bottomNavBar) {
                if (pageId === 'view-panpuri-boutique') {
                    bottomNavBar.classList.add('hidden');
                    bottomNavBar.classList.remove('flex');
                } else {
                    bottomNavBar.classList.remove('hidden');
                    bottomNavBar.classList.add('flex');
                }
            }

            const navHome = document.getElementById('nav-home');
            const navMap = document.getElementById('nav-map');
            const navPreorder = document.getElementById('nav-preorder');
            const navAi = document.getElementById('nav-ai');

                        [navHome, navMap, navPreorder, navAi].forEach(btn => {
                if(!btn) return;
                btn.classList.remove('text-[#001a3d]');
                btn.classList.add('text-gray-400');
                
                // Clean up hardcoded active colors from inner spans (like Home originally had)
                const spans = btn.querySelectorAll('span');
                spans.forEach(span => {
                    span.classList.remove('text-[#001a3d]');
                    if(span.classList.contains('material-symbols-outlined')) {
                         span.style.fontVariationSettings = "'FILL' 0";
                    }
                });
            });

            if (pageId === 'home-view' && navHome) {
                navHome.classList.remove('text-gray-400');
                navHome.classList.add('text-[#001a3d]');
                const span = navHome.querySelector('.material-symbols-outlined');
                if (span) span.style.fontVariationSettings = "'FILL' 1";
            } else if (pageId === 'map-view' && navMap) {
                navMap.classList.remove('text-gray-400');
                navMap.classList.add('text-[#001a3d]');
                const span = navMap.querySelector('.material-symbols-outlined');
                if (span) span.style.fontVariationSettings = "'FILL' 1";
                setTimeout(() => fitMapToScreen(), 50);
            } else if (pageId === 'page-preorder' || pageId === 'view-panpuri-boutique') {
                if (navPreorder) {
                    navPreorder.classList.remove('text-gray-400');
                    navPreorder.classList.add('text-[#001a3d]');
                    const span = navPreorder.querySelector('.material-symbols-outlined');
                    if (span) span.style.fontVariationSettings = "'FILL' 1";
                }
            }
        }

        async function searchAndNavigateToGate(searchQuery) {
            if (!searchQuery) return;
            try {
                const response = await fetch(`/api/search-node?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                
                let nodes = data.nodes || [];
                const satMatch = searchQuery.trim().match(/^(?:GATE\s+)?(S\d{3}[A-Z]?)$/i);
                if (nodes.length === 0 && satMatch) {
                    nodes = [{
                        name: `Gate ${satMatch[1].toUpperCase()}`,
                        node_id: `Node_Gate_${satMatch[1].toUpperCase()}`,
                        type: 'gate',
                        concourse: 'SAT',
                        icon: 'flight_takeoff',
                        x: 520,
                        y: 300
                    }];
                    data.success = true;
                }
                
                if (data.success && nodes && nodes.length > 0) {
                    const matchedGateNode = nodes[0]; // just navigate to the first one
                    // 2. Extract X, Y coordinates
                    const targetX = matchedGateNode.x;
                    const targetY = matchedGateNode.y;
                    
                    // 3. Pan/Zoom to the coordinate and draw a line
                    const cancelBanner = document.getElementById('cancel-route-banner');
                    if (cancelBanner) cancelBanner.classList.remove('hidden');
                    navigateToCoordinate(targetX, targetY, matchedGateNode.name, matchedGateNode.node_id, matchedGateNode.icon);
                } else {
                    alert('Gate or Node not found.');
                }
            } catch (error) {
                console.error('Error searching for node:', error);
                alert('An error occurred while searching.');
            }
        }

        async function navigateToCoordinate(x, y, name, nodeId, iconName = null) {
            // Determine Floor
            const isGateD = (name && name.toUpperCase().includes('GATE D')) || (nodeId && nodeId.toUpperCase().includes('_GATE_D'));
            const isSat = (name && name.toUpperCase().includes('SAT')) || 
                          (nodeId && nodeId.toUpperCase().includes('SAT')) ||
                          (name && /S\d{3}/i.test(name));

            if (isSat) {
                switchFloor('SAT-1');
            } else if (isGateD) {
                switchFloor(3);
            } else {
                switchFloor(4);
            }

            // Switch to Map View
            showPage('map-view');
            closeAIModal();
            
            // Wait for map to be visible
            setTimeout(async () => {
                if (typeof mapPanzoom !== 'undefined' && mapPanzoom) {
                    // Zoom to point
                    const container = document.getElementById('panzoom-wrapper');
                    
                    // Panzoom centering calculation
                    // The map container is 1000x500. Its center is (500, 250).
                    // Panzoom's pan coordinates are unscaled, so we just use the difference.
                    const targetScale = 2.5; 
                    const panX = 500 - x;
                    const panY = 250 - y;
                    
                    mapPanzoom.pan(panX, panY, { animate: true, relative: false });
                    mapPanzoom.zoom(targetScale, { animate: true });
                }

                // Add a dynamic pin for the destination
                document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
                const pin = document.createElement('div');
                pin.className = 'absolute transform -translate-x-1/2 -translate-y-full z-30 flex flex-col items-center cursor-pointer dynamic-map-pin';
                pin.style.left = `${x}px`;
                pin.style.top = `${y}px`;
                if (['vat_refund', 'restaurant', 'wc', 'bank_transfer', 'lounge', 'Pharmacy', 'prayer-room', 'smoking-area'].includes(iconName)) {
                    let imgSrc = '';
                    let borderColor = 'border-blue-700';
                    let pointerBgColor = 'bg-blue-700';
                    
                    if (iconName === 'vat_refund') { imgSrc = '/uploads/vat_refund.png'; }
                    else if (iconName === 'restaurant') { imgSrc = '/uploads/cutlery.png'; borderColor = 'border-orange-500'; pointerBgColor = 'bg-orange-500'; }
                    else if (iconName === 'wc') { imgSrc = '/uploads/toilet-.png'; borderColor = 'border-red-600'; pointerBgColor = 'bg-red-600'; }
                    else if (iconName === 'bank_transfer') { imgSrc = '/uploads/bank-transfer.png'; borderColor = 'border-emerald-500'; pointerBgColor = 'bg-emerald-500'; }
                    else if (iconName === 'lounge') { imgSrc = '/uploads/lounge.png'; borderColor = 'border-purple-500'; pointerBgColor = 'bg-purple-500'; }
                    else if (iconName === 'Pharmacy') { imgSrc = '/uploads/medicine.png'; borderColor = 'border-emerald-600'; pointerBgColor = 'bg-emerald-600'; }
                    else if (iconName === 'prayer-room') { imgSrc = '/uploads/prayer-room.png'; borderColor = 'border-indigo-500'; pointerBgColor = 'bg-indigo-500'; }
                    else if (iconName === 'smoking-area') { imgSrc = '/uploads/smoking-area.png'; borderColor = 'border-gray-500'; pointerBgColor = 'bg-gray-500'; }

                    pin.innerHTML = `
                        <div class="animate-pulse flex flex-col items-center pb-1">
                            <div class="bg-white shadow-lg border-2 ${borderColor} flex items-center justify-center overflow-hidden" style="width: 18px; height: 18px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);">
                                <img src="${imgSrc}" onerror="this.src='/uploads/default.jpg'" alt="${iconName}" style="width: 10px; height: 10px; transform: rotate(45deg); object-fit: contain;" />
                            </div>
                        </div>
                        <div class="w-2 h-2 bg-black/30 rounded-full blur-[2px]"></div>
                    `;
                } else if (iconName && iconName.trim() !== '') {
                    let bgColor = "bg-blue-600";
                    if (iconName === "account_balance") bgColor = "bg-emerald-500";
                    else if (iconName === "shopping_cart") bgColor = "bg-blue-500";
                    
                    pin.innerHTML = `
                        <div class="animate-pulse flex flex-col items-center">
                            <div class="${bgColor} text-white rounded-full p-2 shadow-lg border-2 border-white mb-1 flex items-center justify-center">
                                <span class="material-symbols-outlined text-lg">${iconName}</span>
                            </div>
                            <div class="w-3 h-3 ${bgColor} rotate-45 transform -mt-2.5 border-r-2 border-b-2 border-white shadow-lg"></div>
                        </div>
                        <div class="w-2 h-2 bg-black/30 rounded-full blur-[2px] mt-1"></div>
                    `;
                } else {
                    pin.innerHTML = `
                        <div class="animate-pulse flex flex-col items-center">
                            <div class="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border-2 border-white mb-1">
                                ${name || 'Destination'}
                            </div>
                            <div class="w-4 h-4 bg-blue-600 rotate-45 transform -mt-3 border-r-2 border-b-2 border-white shadow-lg"></div>
                        </div>
                        <div class="w-2 h-2 bg-black/30 rounded-full blur-[2px] mt-1"></div>
                    `;
                }
                
                const mapContainer = document.getElementById('map-image-container');
                mapContainer.appendChild(pin);

                if (typeof makePinDraggable === 'function') {
                    makePinDraggable(pin, nodeId || name, mapContainer);
                }

                // Add escalators if it's floor 3
                if (isGateD) {
                    const createEscalator = (ex, ey, flip = false) => {
                        const escIcon = document.createElement('div');
                        escIcon.className = 'escalator-icon-container escalator-anim absolute z-10 filter drop-shadow-md panzoom-exclude';
                        escIcon.style.left = `${ex}px`;
                        escIcon.style.top = `${ey}px`;
                        escIcon.style.transform = 'translate(-50%, -50%)';
                        const flipStyle = flip ? 'transform: scaleX(-1);' : '';
                        escIcon.innerHTML = `<img src="/uploads/escalator-svgrepo-com.svg" style="width: 28px; height: 28px; ${flipStyle}" />`;
                        mapContainer.appendChild(escIcon);
                    };
                    createEscalator(309, 178, true);
                    createEscalator(681, 178);
                }

                // Show cancel button is now suppressed here as it's handled differently

                // Clear any existing path
                const svg = document.getElementById('route-path-svg');
                if (svg) svg.innerHTML = '';
                
                const isGateC = (name && name.toUpperCase().includes('GATE C')) || (nodeId && nodeId.toUpperCase().includes('_GATE_C'));
                if (isGateC) {
                    document.getElementById('route-gate-c')?.classList.remove('hidden');
                } else {
                    document.getElementById('route-gate-c')?.classList.add('hidden');
                }

            }, 300);
        }

        async function navigateToGate() {
            // Read gate text BEFORE switching pages, or use textContent which is not layout-dependent
            const gateText = (document.getElementById('flight-gate-display')?.textContent || 'D4').trim();
            
            showPage('map-view');
            
            // clear previous paths & pins
            const svg = document.getElementById('route-path-svg');
            if (svg) svg.innerHTML = '';
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => pin.remove());
            const legacyGateC = document.getElementById('route-gate-c');
            if (legacyGateC) legacyGateC.classList.add('hidden');

            const cancelBanner = document.getElementById('cancel-route-banner');
            if (cancelBanner) cancelBanner.classList.remove('hidden');

            const cleanGate = gateText.toUpperCase().replace(/^GATE\s*/i, '').replace(/\s+/g, '');
            const dMatch = cleanGate.match(/^D([1-8])/);
            const sMatch = cleanGate.startsWith('S');
            
            // 1. Switch Floor Map
            if (sMatch) {
                switchFloor('SAT-1');
            } else if (dMatch) {
                switchFloor(3);
            } else {
                switchFloor(4);
            }
            
            // 2. Handle APM Express Train animation layer for SAT-1
            let trainLayer = document.getElementById('train-animation-layer');
            if (!trainLayer) {
                trainLayer = document.createElement('div');
                trainLayer.id = 'train-animation-layer';
                trainLayer.className = 'absolute inset-0 z-30 pointer-events-none flex items-center justify-center hidden';
                trainLayer.innerHTML = `
                    <div class="absolute w-[4px] bg-blue-500/40 h-[50%] bottom-0 left-1/2 transform -translate-x-1/2 border-dashed border-2 border-blue-500"></div>
                    <div class="train-icon bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-blue-100 absolute bottom-0 left-1/2 transform -translate-x-1/2 font-bold flex flex-col items-center gap-1.5 select-none transition-all">
                        <div class="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border border-blue-200/60 shadow-xs">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                            <span>APM Express Shuttle</span>
                        </div>
                        <div class="relative w-14 h-10 flex items-center justify-center filter drop-shadow-sm my-0.5">
                            <svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-14 h-10">
                                <defs>
                                    <linearGradient id="trainBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#0f2b5c"/>
                                        <stop offset="100%" stop-color="#1e40af"/>
                                    </linearGradient>
                                    <linearGradient id="trainGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stop-color="#7dd3fc"/>
                                        <stop offset="100%" stop-color="#0284c7"/>
                                    </linearGradient>
                                    <linearGradient id="trainStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stop-color="#3b82f6"/>
                                        <stop offset="100%" stop-color="#60a5fa"/>
                                    </linearGradient>
                                </defs>
                                <rect x="6" y="3" width="36" height="26" rx="10" fill="url(#trainBodyGrad)" stroke="#1d4ed8" stroke-width="1.5"/>
                                <path d="M 12 8 C 12 6, 36 6, 36 8 L 34 16 C 34 17, 14 17, 14 16 Z" fill="url(#trainGlassGrad)"/>
                                <rect x="10" y="19" width="28" height="2.5" rx="1.2" fill="url(#trainStripe)"/>
                                <circle cx="14" cy="24" r="2" fill="#fef08a"/>
                                <circle cx="14" cy="24" r="3.5" fill="#fef08a" opacity="0.4"/>
                                <circle cx="34" cy="24" r="2" fill="#fef08a"/>
                                <circle cx="34" cy="24" r="3.5" fill="#fef08a" opacity="0.4"/>
                                <rect x="12" y="29" width="7" height="3" rx="1.5" fill="#475569"/>
                                <rect x="29" y="29" width="7" height="3" rx="1.5" fill="#475569"/>
                            </svg>
                        </div>
                        <div class="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1.5">
                            <span>Take Train from Main Terminal</span>
                            <span class="text-blue-400 font-extrabold">➔ SAT-1</span>
                        </div>
                    </div>
                `;
                document.getElementById('map-image-container').appendChild(trainLayer);
            }
            
            if (sMatch) {
                trainLayer.style.display = 'flex';
                trainLayer.classList.remove('hidden');
                const trainIcon = trainLayer.querySelector('.train-icon');
                if (trainIcon) trainIcon.style.animation = 'trainMove 4s infinite cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                trainLayer.style.display = 'none';
                trainLayer.classList.add('hidden');
            }

            // 3. Determine Coordinates for Destination Pin
            let targetX = 489;
            let targetY = 227;

            if (sMatch) {
                const sCoords = getSGateCoords(cleanGate);
                targetX = sCoords ? sCoords.x : 500;
                targetY = sCoords ? sCoords.y : 250;
            } else if (dMatch) {
                const dCoords = getDGateCoords(cleanGate);
                targetX = dCoords ? dCoords.x : 454;
                targetY = dCoords ? dCoords.y : 177;
            } else {
                try {
                    const targetNodeId = activeGateNodeId || (`Node_Gate_${cleanGate}`);
                    const response = await fetch(`/api/navigation-path?from_node=Node_Passport_Control&to_node=${targetNodeId}`);
                    const data = await response.json();
                    if (data && data.path && data.path.length > 0) {
                        const endNode = data.path[data.path.length - 1];
                        targetX = endNode.x;
                        targetY = endNode.y;
                    }
                } catch (e) {
                    console.log("Failed to fetch path API, using fallback coords:", e);
                }
            }

            let startX = sMatch ? 500 : 489;
            let startY = sMatch ? 250 : 227;

            // 4. Draw Path Line (Green dashed line) for D, C, E, F, G gates
            if (svg) {
                let pathD = `M ${startX} ${startY}`;

                if (Math.abs(targetX - startX) > Math.abs(targetY - startY)) {
                    pathD += ` L ${targetX} ${startY} L ${targetX} ${targetY}`;
                } else {
                    pathD += ` L ${startX} ${targetY} L ${targetX} ${targetY}`;
                }

                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', pathD);
                pathElement.setAttribute('fill', 'none');
                pathElement.setAttribute('stroke', '#0ea5e9');
                pathElement.setAttribute('stroke-width', '2.5');
                pathElement.setAttribute('stroke-dasharray', '6 6');
                pathElement.setAttribute('class', 'path-animated transition-all duration-300');
                svg.appendChild(pathElement);

                // Start Dot Glow (Pulse)
                const startDotGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                startDotGlow.setAttribute('cx', startX);
                startDotGlow.setAttribute('cy', startY);
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

                // Start Dot (Blue)
                const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                startDot.setAttribute('cx', startX);
                startDot.setAttribute('cy', startY);
                startDot.setAttribute('r', '7');
                startDot.setAttribute('fill', '#0ea5e9');
                startDot.setAttribute('stroke', '#ffffff');
                startDot.setAttribute('stroke-width', '2.5');
                svg.appendChild(startDot);
            }

            // 5. Draw Destination Pin (Red Teardrop Pin)
            const pin = document.createElement('div');
            pin.className = `dynamic-map-pin absolute z-10 transition-all duration-300 flex flex-col items-center select-none cursor-pointer map-pulse`;
            pin.style.left = `${targetX}px`;
            pin.style.top = `${targetY}px`;
            pin.style.transform = 'translate(-50%, -100%)';
            pin.innerHTML = `
                <div class="bg-[#dc2626] text-[8px] font-black text-white px-1.5 py-0.5 rounded shadow-sm mb-0.5 whitespace-nowrap border border-white/40 select-none uppercase">
                    GATE ${cleanGate}
                </div>
                <div class="relative w-4 h-6 flex items-center justify-center filter drop-shadow-sm">
                    <svg viewBox="0 0 24 32" class="w-4 h-6 text-[#ef4444]">
                        <path fill="currentColor" stroke="#FFFFFF" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z"/>
                        <circle cx="12" cy="11" r="4.5" fill="#FFFFFF"/>
                    </svg>
                </div>
            `;
            document.getElementById('map-image-container').appendChild(pin);

            // Zoom and Pan to show both start and target locations
            if (mapPanzoom) {
                setTimeout(() => {
                    // Calculate distance between points in the 1000x500 map coordinate system
                    const dx = Math.abs(targetX - startX);
                    const dy = Math.abs(targetY - startY);
                    
                    // Determine responsive zoom scale based on user's actual screen size
                    const sw = window.innerWidth;
                    const sh = window.innerHeight;

                    // Minimum distance prevents dividing by near-zero and over-zooming on close points
                    const minDx = Math.max(dx, 200); 
                    const minDy = Math.max(dy, 200);

                    let scaleX = sw / minDx;
                    let scaleY = sh / minDy;

                    // Target scale so the path fits within 70% of the screen (0.7 padding)
                    let targetScale = Math.min(scaleX, scaleY) * 0.7;

                    // Constraints for extreme cases
                    if (targetScale > 2.5) targetScale = 2.5;
                    if (targetScale < 0.4) targetScale = 0.4;

                    // Pan to the midpoint between start and target
                    const midX = (startX + targetX) / 2;
                    const midY = (startY + targetY) / 2;
                    const panX = 500 - midX;
                    const panY = 250 - midY;
                    
                    mapPanzoom.pan(panX, panY, { animate: true, relative: false });
                    mapPanzoom.zoom(targetScale, { animate: true });
                }, 100);
            }
        }

        function closeRouteCard() {
            document.getElementById('route-gate-c').classList.add('hidden');
        }

        function triggerHomeAISearch(query) {
            if (!query || query.trim() === '') return;
            openAIModal();
            document.getElementById('ai-modal-input').value = query;
            processAiSearch(query);
        }

        function openAIModal() { 
            document.getElementById('ai-modal').classList.remove('hidden');
            document.getElementById('ai-modal').classList.add('flex');
            document.getElementById('ai-welcome-state').classList.remove('hidden');
            document.getElementById('ai-search-results').classList.add('hidden');
        }
        function closeAIModal() { 
            document.getElementById('ai-modal').classList.add('hidden'); 
            document.getElementById('ai-modal').classList.remove('flex');
        }

        async function processAiSearch(query) {
            if (!query || query.trim() === '') return;
            
            document.getElementById('ai-modal-input').value = query;
            document.getElementById('ai-welcome-state').classList.add('hidden');
            document.getElementById('ai-search-results').classList.remove('hidden');
            
            const overviewText = document.getElementById('ai-overview-text');
            const knowledgeCard = document.getElementById('ai-knowledge-card');
            const recommendationsSection = document.getElementById('ai-recommendations-section');
            const recommendationsList = document.getElementById('ai-recommendations-list');
            
            // Loading state
            overviewText.innerHTML = '<div class="flex items-center gap-2"><div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> Generating insights...</div>';
            knowledgeCard.classList.add('hidden');
            recommendationsSection.classList.add('hidden');
            
            // Simple keyword matching for airport knowledge
            const qLower = query.toLowerCase();
            let knowledgeFound = false;
            if (qLower.includes('vat') || qLower.includes('refund') || qLower.includes('tax')) {
                document.getElementById('ai-knowledge-title').innerText = 'VAT Refund for Tourists';
                document.getElementById('ai-knowledge-text').innerText = 'VAT Refund Counters are located at Level 4 (Departures) before Passport Control (Gate U) and after Passport Control (Concourses D).';
                knowledgeFound = true;
            } else if (qLower.includes('duty free') || qLower.includes('pick up') || qLower.includes('pickup')) {
                document.getElementById('ai-knowledge-title').innerText = 'Duty Free Pick-up';
                document.getElementById('ai-knowledge-text').innerText = 'King Power Pick-up Counters are located at both East and West wings of Level 4 after passport control.';
                knowledgeFound = true;
            } else if (qLower.includes('currency') || qLower.includes('exchange') || qLower.includes('money')) {
                document.getElementById('ai-knowledge-title').innerText = 'Currency Exchange';
                document.getElementById('ai-knowledge-text').innerText = 'Currency exchange booths (Superrich, Kasikorn, SCB) are available throughout the terminal, with best rates typically found at the Basement (B) level near the Airport Rail Link.';
                knowledgeFound = true;
            } else if (qLower.includes('gate') || qLower.includes('boarding') || qLower.match(/gates*[a-z]/i)) {
                document.getElementById('ai-knowledge-title').innerText = 'Boarding Gates';
                document.getElementById('ai-knowledge-text').innerText = 'Gates A-G are on Level 4. Please allow 15-20 minutes walking time to reach gates at the far end of the concourses.';
                knowledgeFound = true;
            }
            
            // Check for specific node search (e.g., Gate D4)
            let nodeFound = null;
            try {
                const nodeRes = await fetch(`/api/search-node?q=${encodeURIComponent(query)}`);
                const nodeData = await nodeRes.json();
                if (nodeData.success && nodeData.node) {
                    nodeFound = nodeData.node;
                    document.getElementById('ai-knowledge-title').innerText = `Location: ${nodeFound.name}`;
                    document.getElementById('ai-knowledge-text').innerHTML = `
                        We found ${nodeFound.name} on the map.
                        <button onclick="searchAndNavigateToGate('${query}')" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 w-full justify-center">
                            <span class="material-symbols-outlined">explore</span> Navigate to ${nodeFound.name}
                        </button>
                    `;
                    knowledgeFound = true;
                }
            } catch (e) {
                console.error("Node search error:", e);
            }
            
            if (knowledgeFound) {
                knowledgeCard.classList.remove('hidden');
            }

            try {
                // We use the existing endpoint to find products/stores
                const response = await fetch(`/api/search-store?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                const stores = data.results || [];
                
                let allProducts = [];
                let matchedStores = [];
                stores.forEach(s => {
                    matchedStores.push(s.shop_name || s.brand_name || s.shop_number);
                    if (s.products && s.products.length > 0) {
                        allProducts = allProducts.concat(s.products.map(p => ({...p, store: s})));
                    }
                });

                // Generate conversational answer
                if (stores.length > 0 || knowledgeFound) {
                    let summary = `Based on your query "${query}", `;
                    if (matchedStores.length > 0) {
                        const uniqueStores = [...new Set(matchedStores)];
                        summary += `I found relevant items at ${uniqueStores.join(', ')}.`;
                        if (allProducts.length > 0) {
                            summary += ` Take a look at the recommended products below.`;
                        } else {
                            summary += ` Take a look at the recommended stores below.`;
                        }
                    } else if (knowledgeFound) {
                        summary += `I've provided the airport information you requested below. If you're also looking to shop, try searching for a brand or category!`;
                    }
                    overviewText.innerText = summary;
                } else {
                    overviewText.innerText = `I couldn't find specific products or stores matching "${query}". Try asking for "Best Thai Souvenirs" or a specific brand.`;
                }

                // Render product cards
                if (allProducts.length > 0) {
                    recommendationsSection.classList.remove('hidden');
                    recommendationsList.innerHTML = allProducts.slice(0, 10).map(p => {
                        let pImgUrl = (p.PRODUCT_IMAGE_FILENAME && (p.PRODUCT_IMAGE_FILENAME.startsWith('http') || p.PRODUCT_IMAGE_FILENAME.startsWith('/uploads/'))) 
                            ? p.PRODUCT_IMAGE_FILENAME 
                            : `/uploads/${p.PRODUCT_IMAGE_FILENAME || 'default_product.jpg'}`;
                        
                        return `
                            <div class="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center gap-4">
                                <div class="w-32 h-32 bg-slate-50 rounded-lg shrink-0 overflow-hidden border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity" onclick="showImagePopup('${pImgUrl}')">
                                    <img src="${pImgUrl}" class="w-full h-full object-cover" onerror="this.src='/uploads/default_product.jpg'" />
                                </div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="font-bold text-base text-slate-800 line-clamp-2 mb-1">${p.PRODUCT_NAME || 'Product'}</h5>
                                    <p class="text-sm text-slate-500 mb-2 flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[16px]">storefront</span> 
                                        ${p.store.shop_name || p.store.brand_name || 'Store'} ${p.store.shop_number ? '(Unit ' + p.store.shop_number + ')' : ''}
                                    </p>
                                </div>
                                <button onclick="closeAIModal(); showPage('map-view'); document.getElementById('map-search-input').value = '${p.SHOP_NUMBER || p.store.shop_number}'; setTimeout(()=>searchMapLive(),100);" class="shrink-0 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors shadow-sm active:scale-95">
                                    <span class="material-symbols-outlined text-xl mb-1">navigation</span>
                                    <span class="text-[10px] font-bold">MAP</span>
                                </button>
                            </div>
                        `;
                    }).join('');
                } else if (stores.length > 0) {
                    // Render store cards if no products
                    recommendationsSection.classList.remove('hidden');
                    recommendationsList.innerHTML = stores.slice(0, 10).map(s => {
                        let imgUrl = (s.shop_image && (s.shop_image.startsWith('http') || s.shop_image.startsWith('/uploads/')))
                            ? s.shop_image : `/uploads/${s.shop_image || 'default_store.jpg'}`;
                        return `
                            <div class="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center gap-4">
                                <div class="w-32 h-32 bg-slate-50 rounded-lg shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" onclick="showImagePopup('${imgUrl}')">
                                    ${imgUrl.includes('default_store') ? '<span class="material-symbols-outlined text-slate-300 text-5xl">store</span>' : `<img src="${imgUrl}" class="w-full h-full object-cover" onerror="this.src='/uploads/default_store.jpg'" />`}
                                </div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="font-bold text-base text-slate-800 truncate mb-1">${s.shop_name || s.brand_name || 'Store'}</h5>
                                    <p class="text-sm text-slate-500 mb-2 flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[16px]">storefront</span> 
                                        Unit ${s.shop_number || 'N/A'}
                                    </p>
                                </div>
                                <button onclick="closeAIModal(); showPage('map-view'); document.getElementById('map-search-input').value = '${s.shop_number || s.store_id}'; setTimeout(()=>searchMapLive(),100);" class="shrink-0 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors shadow-sm active:scale-95">
                                    <span class="material-symbols-outlined text-xl mb-1">navigation</span>
                                    <span class="text-[10px] font-bold">MAP</span>
                                </button>
                            </div>
                        `;
                    }).join('');
                }
            } catch (err) {
                console.error('AI search error:', err);
                overviewText.innerText = 'Sorry, there was an error processing your request. Please try again.';
                knowledgeCard.classList.add('hidden');
                recommendationsSection.classList.add('hidden');
            }
        }
        // --- ADMIN MODE ---
        function toggleAdminMode() {
            if (!isAdminMode) {
                const pin = prompt("กรุณาใส่รหัสผ่าน Admin:");
                if (pin !== "6515") {
                    alert("รหัสผ่านไม่ถูกต้อง");
                    return;
                }
            }
            isAdminMode = !isAdminMode;
            if (isAdminMode) {
                document.getElementById('admin-status-bar').classList.remove('hidden');
                document.getElementById('admin-status-bar').classList.add('flex');
                alert("โหมด Admin เปิดใช้งานแล้ว\nคลิกค้างที่หมุดเพื่อลากไปยังตำแหน่งที่ต้องการ แล้วปล่อยเมาส์เพื่อดูพิกัด!");
                
                // Add draggable class to any existing pins
                document.querySelectorAll('.dynamic-map-pin').forEach(pin => {
                    pin.classList.add('cursor-grab');
                    pin.classList.remove('cursor-pointer');
                    // makePinDraggable is applied when pins are created, or we can just let them search again.
                });
            } else {
                exitAdminMode();
            }
        }

        function exitAdminMode() {
            isAdminMode = false;
            document.getElementById('admin-status-bar').classList.add('hidden');
            document.getElementById('admin-status-bar').classList.remove('flex');
            document.querySelectorAll('.dynamic-map-pin').forEach(pin => {
                pin.classList.remove('cursor-grab');
                pin.classList.add('cursor-pointer');
            });
        }

        function makePinDraggable(pinElement, identifier, container) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            
            // Add panzoom-exclude class so Panzoom ignores this element
            pinElement.classList.add('panzoom-exclude');

            pinElement.addEventListener('pointerdown', (e) => {
                if (!isAdminMode) return;
                isDragging = true;
                pinElement.classList.add('cursor-grabbing');
                pinElement.classList.remove('cursor-grab');
                
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = parseFloat(pinElement.style.left) || 0;
                initialTop = parseFloat(pinElement.style.top) || 0;
                
                // Stop event from propagating to Panzoom
                e.stopPropagation();
                // Capture pointer so even if we move off the element, it keeps dragging
                pinElement.setPointerCapture(e.pointerId);
            });

            pinElement.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const rect = container.getBoundingClientRect();
                
                // Calculate scale factors using the panzoom container's actual scale
                let currentScale = 1;
                if (typeof mapPanzoom !== 'undefined' && mapPanzoom.getScale) {
                    currentScale = mapPanzoom.getScale();
                }

                // If map is scaled, delta needs to be divided by scale to match SVG coordinates
                const deltaX = (e.clientX - startX) / currentScale;
                const deltaY = (e.clientY - startY) / currentScale;

                pinElement.style.left = `${initialLeft + deltaX}px`;
                pinElement.style.top = `${initialTop + deltaY}px`;
            });

            pinElement.addEventListener('pointerup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                pinElement.classList.remove('cursor-grabbing');
                pinElement.classList.add('cursor-grab');
                pinElement.releasePointerCapture(e.pointerId);
                
                const finalX = Math.round(parseFloat(pinElement.style.left));
                const finalY = Math.round(parseFloat(pinElement.style.top));
                
                // Slight delay so the user sees it dropped
                setTimeout(() => {
                    alert(`[${identifier}] พิกัดใหม่ที่ถูกลากไปคือ: X=${finalX}, Y=${finalY}\n\nคุณสามารถคัดลอกพิกัดนี้เพื่อนำไปแก้ไขในโค้ดได้เลยครับ`);
                }, 50);
            });
        }

        // Allow clicking on map to get exact coordinates
        document.getElementById('map-image-container').addEventListener('click', function(e) {
            if (!isAdminMode) return;
            // Prevent if clicking on a pin or button
            if (e.target.closest('.dynamic-map-pin') || e.target.closest('button')) return;

            const rect = this.getBoundingClientRect();
            // Calculate coordinates relative to the 1000x500 SVG coordinate system
            const scaleX = 1000 / rect.width;
            const scaleY = 500 / rect.height;
            
            const x = Math.round((e.clientX - rect.left) * scaleX);
            const y = Math.round((e.clientY - rect.top) * scaleY);
            
            alert(`พิกัดที่คลิก: X=${x}, Y=${y}\nคุณสามารถคัดลอกพิกัดนี้เพื่อนำไปแก้ไขในโค้ดได้`);
        });

        // =============================================
        // PANPURI PRE-ORDER SYSTEM
        // =============================================
        let preorderCart = {};
        let allProducts = [];
        let preorderStoreId = '';
        let preorderStoreName = '';
        let currentProductCategory = 'all';
        let currentProductSubCategory = null;
        let lastCompletedOrderNumber = '';

        async function initPreorder() {
            preorderCart = {};
            preorderStoreId = '';
            preorderStoreName = '';
            currentProductCategory = 'all';
            currentProductSubCategory = null;
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
                    { id: 'TE3', name: 'PANPURI Concourse D East', sub: 'บริเวณ Gate D1-D4', icon: 'location_on' },
                    { id: 'TE1', name: 'PANPURI Concourse D East 2', sub: 'บริเวณ Gate D1-D2', icon: 'location_on' },
                    { id: 'TW4', name: 'PANPURI Concourse D West', sub: 'บริเวณ Gate D5-D8', icon: 'location_on' }
                ];
                container.innerHTML = stores.map(s => {
                    const isOpen = data.settings[s.id]?.accepting_orders !== false;
                    return `<div class="store-card haptic-btn flex items-center justify-between p-4 bg-white rounded-2xl ${isOpen ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}" ${isOpen ? `onclick="selectPreorderStore('${s.id}','${s.name}')"` : ''}>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-[#fff8e1] rounded-xl flex items-center justify-center">
                                <svg class="h-6 w-6 text-[#b0892c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-[#000a1e]">${s.name}</h4>
                                <p class="text-xs text-gray-400">${s.sub}</p>
                            </div>
                        </div>
                        ${isOpen ? '<span class="bg-[#e6f4ea] text-[#1e7e34] text-[10px] font-bold px-2.5 py-1 rounded-md">เปิดรับ</span>' : '<span class="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-md">ปิดรับ</span>'}
                    </div>`;
                }).join('');
            } catch(e) {
                container.innerHTML = '<div class="text-center text-red-500 text-sm py-8">ไม่สามารถโหลดข้อมูลร้านได้</div>';
            }
        }

        async function selectPreorderStore(storeId, name) {
            try {
                preorderStoreId = storeId;
                preorderStoreName = name;
                const storeLabel = document.getElementById('boutique-store-name');
                if (storeLabel) {
    let imgHtml = '';
    if (typeof stores !== 'undefined') {
        const storeObj = stores.find(s => s.id === storeId || s.shop_number === storeId);
        if (storeObj && storeObj.shop_image) {
            let imgUrl = (storeObj.shop_image.startsWith('http') || storeObj.shop_image.startsWith('/uploads/'))
                ? storeObj.shop_image : '/uploads/' + storeObj.shop_image;
            imgHtml = '<br><img src="' + imgUrl + '" onerror="this.style.display=\'none\'" class="w-full h-32 mt-3 rounded-lg shadow-sm object-cover" alt="Store Image" />';
        }
    }
    storeLabel.innerHTML = '📍 ' + name + imgHtml;
}
                preorderCart = {};
                await loadProducts();
                filterProducts('all'); // Initialize UI highlight state and render
                showPage('view-panpuri-boutique');
            } catch (e) {
                alert("Error in selectPreorderStore: " + e.message + "\n" + e.stack);
            }
        }

        function confirmExitToStoreSelection() {
            const modal = document.getElementById('exit-store-modal');
            const backdrop = document.getElementById('exit-store-backdrop');
            const content = document.getElementById('exit-store-content');
            
            if (!modal) return;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            setTimeout(() => {
                backdrop.classList.remove('opacity-0');
                backdrop.classList.add('opacity-100');
                content.classList.remove('opacity-0', 'scale-95');
                content.classList.add('opacity-100', 'scale-100');
            }, 10);
        }

        function closeExitStoreModal() {
            const modal = document.getElementById('exit-store-modal');
            const backdrop = document.getElementById('exit-store-backdrop');
            const content = document.getElementById('exit-store-content');
            
            if (!modal) return;
            
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            content.classList.remove('opacity-100', 'scale-100');
            content.classList.add('opacity-0', 'scale-95');
            
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        function proceedExitStore() {
            window.location.href = 'store_selection.html';
        }

        async function loadProducts() {
            const grid = document.getElementById('product-grid');
            if (grid) grid.innerHTML = '<div class="col-span-2 text-center text-gray-400 text-sm py-8">กำลังโหลดสินค้า...</div>';
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                allProducts = (data.products || []).map(p => ({
                    ...p,
                    product_id: p.Code || p.product_id,
                    category: p.Category || p.category,
                    sub_category: p['Sub-Category'] || p.sub_category,
                    scent: p.Scent || p.scent,
                    description: p.Description || p.description,
                    size: p.Size || p.size,
                    price: p.Price || p.price,
                    image: p.Image || p.image,
                    qty_te3: p.Qty_Branch1 || p.qty_te3,
                    qty_te1: p.Qty_Branch2 || p.qty_te1,
                    qty_tw4: p.Qty_Branch3 || p.qty_tw4
                }));
                renderCategoriesUI();
                // We don't renderProductGrid() here because filterProducts('all') will handle it.
            } catch(e) {
                if (grid) grid.innerHTML = '<div class="col-span-2 text-center text-red-500 text-sm py-8">ไม่สามารถโหลดสินค้าได้</div>';
            }
        }

        function renderCategoriesUI() {
            // Find unique categories and sub-categories
            const catMap = {};
            allProducts.forEach(p => {
                if (!p.category) return;
                const cat = p.category.trim();
                if (!cat) return;
                const upperCat = cat.toUpperCase();
                if (!catMap[upperCat]) catMap[upperCat] = { originalName: cat, subs: new Set() };
                if (p.sub_category) catMap[upperCat].subs.add(p.sub_category.trim());
            });

            // 1. Render Top Pills
            const pillsContainer = document.getElementById('boutique-category-pills');
            if (pillsContainer) {
                let pillsHTML = `<button onclick="filterProducts('all')" class="boutique-cat-btn px-6 py-2 bg-primary text-on-primary border border-transparent rounded-full font-label-md text-label-md whitespace-nowrap" data-cat="all">All Items</button>`;
                Object.values(catMap).forEach(catData => {
                    pillsHTML += `<button onclick="filterProducts('${catData.originalName}')" class="boutique-cat-btn px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap" data-cat="${catData.originalName}">${catData.originalName}</button>`;
                });
                pillsContainer.innerHTML = pillsHTML;
            }

            // 2. Render Sidebar
            const sidebarContainer = document.getElementById('boutique-sidebar-categories');
            if (sidebarContainer) {
                let sidebarHTML = `
                <!-- ALL ITEMS -->
                <div class="group px-4 py-3 cursor-pointer rounded-lg transition-all sidebar-cat-btn ${currentProductCategory === 'all' ? 'bg-secondary-container text-navy-luxury shadow-sm' : 'text-navy-luxury hover:bg-surface-container'}" data-cat="all" onclick="filterProducts('all')">
                    <span class="font-label-md text-label-md tracking-wider uppercase">All Items</span>
                </div>
                `;
                Object.values(catMap).forEach(catData => {
                    const isActive = currentProductCategory === catData.originalName;
                    const baseClass = "group px-4 py-3 cursor-pointer rounded-lg transition-all sidebar-cat-btn flex items-center justify-between";
                    const activeClass = isActive ? "bg-secondary-container text-navy-luxury shadow-sm" : "text-navy-luxury hover:bg-surface-container";
                    
                    if (catData.subs.size > 0) {
                        sidebarHTML += `
                        <details class="group" ${isActive ? 'open' : ''}>
                            <summary class="${baseClass} ${activeClass} list-none" data-cat="${catData.originalName}" onclick="filterProducts('${catData.originalName}')">
                                <span class="font-label-md text-label-md tracking-wider uppercase">${catData.originalName}</span>
                                <span class="material-symbols-outlined text-[20px] group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div class="flex flex-col gap-1 pl-6 pr-4 py-2">
                                ${Array.from(catData.subs).map(sub => `
                                    <a class="text-body-sm text-on-surface-variant hover:text-navy-luxury py-2 pl-3" href="#" onclick="event.preventDefault(); filterProducts('${catData.originalName}', '${sub}')">${sub}</a>
                                `).join('')}
                            </div>
                        </details>
                        `;
                    } else {
                        sidebarHTML += `
                        <div class="${baseClass} ${activeClass}" data-cat="${catData.originalName}" onclick="filterProducts('${catData.originalName}')">
                            <span class="font-label-md text-label-md tracking-wider uppercase transition-colors">${catData.originalName}</span>
                        </div>
                        `;
                    }
                });
                sidebarContainer.innerHTML = sidebarHTML;
            }
        }

        function filterProducts(cat, subCat = null) {
            currentProductCategory = cat;
            currentProductSubCategory = subCat;
            
            // Sync top bar pills
            document.querySelectorAll('.boutique-cat-btn').forEach(btn => {
                const btnCat = btn.getAttribute('data-cat');
                if (btnCat === cat) {
                    btn.className = "boutique-cat-btn px-6 py-2 bg-primary text-on-primary border border-transparent rounded-full font-label-md text-label-md whitespace-nowrap";
                } else {
                    btn.className = "boutique-cat-btn px-6 py-2 border border-outline-variant text-on-surface hover:bg-surface-container rounded-full font-label-md text-label-md transition-all whitespace-nowrap";
                }
            });
            
            // Sync side bar menus
            document.querySelectorAll('.sidebar-cat-btn').forEach(btn => {
                const btnCat = btn.getAttribute('data-cat');
                if (btnCat === cat) {
                    btn.classList.add('bg-secondary-container', 'text-navy-luxury', 'shadow-sm');
                    btn.classList.remove('hover:bg-surface-container');
                    
                    // Also open the details element if it is one
                    const parentDetails = btn.closest('details');
                    if (parentDetails) parentDetails.open = true;
                } else {
                    btn.classList.remove('bg-secondary-container', 'shadow-sm');
                    btn.classList.add('hover:bg-surface-container');
                }
            });

            // Also sync the older #pcat tabs if they exist
            document.querySelectorAll('[id^="pcat-"]').forEach(b => {
                b.classList.remove('bg-amber-600', 'text-white');
                b.classList.add('bg-white', 'border', 'border-gray-200', 'text-gray-600');
            });
            const activeBtn = document.getElementById(`pcat-${cat === 'all' ? 'all' : cat === 'Bath & Body' ? 'bath' : cat === 'Face' ? 'face' : cat === 'Hair Care' ? 'hair' : 'gift'}`);
            if (activeBtn) { activeBtn.classList.add('bg-amber-600', 'text-white'); activeBtn.classList.remove('bg-white', 'border', 'border-gray-200', 'text-gray-600'); }
            
            renderProductGrid();
        }

        function renderProductGrid() {
            const boutiqueGrid = document.getElementById('boutique-product-grid');
            const oldGrid = document.getElementById('product-grid');
            
            let filtered = allProducts;
            if (currentProductCategory !== 'all') {
                filtered = filtered.filter(p => p.category && p.category.trim().toUpperCase() === currentProductCategory.toUpperCase());
            }
            if (currentProductSubCategory) {
                filtered = filtered.filter(p => p.sub_category && p.sub_category.trim() === currentProductSubCategory);
            }

            // Determine which QTY field to use based on preorderStoreId
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_te3';

            const emptyHTML = '<div class="col-span-full text-center text-on-surface-variant py-8 font-body-lg">No products found in this category.</div>';
            
            if (filtered.length === 0) {
                if (boutiqueGrid) boutiqueGrid.innerHTML = emptyHTML;
                if (oldGrid) oldGrid.innerHTML = emptyHTML;
                return;
            }

            const boutiqueHTML = filtered.map(p => {
                const cartQty = preorderCart[p.product_id]?.qty || 0;
                const stockQty = parseInt(p[qtyField]) || 0;
                const outOfStock = stockQty <= 0;
                const imgUrl = p.image || '';

                return `<div class="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden cursor-pointer haptic-active shadow-sm transition-all ${outOfStock ? 'opacity-60 grayscale-[0.2]' : 'hover:shadow-md'}" onclick="openBoutiqueDrawer('${p.product_id}')">
                    <div class="relative aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden">
                        ${imgUrl ? `<img class="w-full h-full object-cover ${outOfStock ? '' : 'group-hover:scale-105'} transition-transform duration-500" src="${imgUrl}" onerror="this.src='https://placehold.co/400x400/ffffff/1e293b?text=Image+Not+Found'"/>` : `<span class="material-symbols-outlined text-4xl text-outline">image</span>`}
                        ${p.is_bestseller ? `<div class="absolute top-4 left-4 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container text-label-sm font-bold">BESTSELLER</div>` : ''}
                        ${outOfStock ? `<div class="absolute top-4 right-4 bg-error text-on-error px-3 py-1 rounded-full text-label-sm font-bold shadow-sm uppercase">Out of Stock</div>` : ''}
                    </div>
                    <div class="p-md flex flex-col h-40">
                        <p class="text-[10px] text-secondary uppercase tracking-widest mb-1 truncate">${(p.sub_category || p['Sub-Category']) && (p.sub_category || p['Sub-Category']) !== '-' ? (p.sub_category || p['Sub-Category']) : 'Information not available'}</p>
                        <h3 class="font-bold text-sm text-primary mb-1 line-clamp-2">${(p.scent || p.Scent) && (p.scent || p.Scent) !== '-' ? (p.scent || p.Scent) : 'Information not available'}</h3>
                        <div class="flex items-center justify-between mt-auto">
                            <div>
                                <span class="text-base font-bold text-pink-600 block">฿${parseFloat(p.price).toLocaleString()}</span>
                                <span class="text-xs ${stockQty - cartQty <= 5 ? 'text-red-500' : 'text-gray-500'} font-bold">คงเหลือ: ${stockQty - cartQty}</span>
                            </div>
                            ${outOfStock ? `<button disabled class="bg-surface-variant text-on-surface-variant w-8 h-8 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"><span class="material-symbols-outlined text-[18px]">add</span></button>` : (cartQty === 0 
                                ? `<button onclick="event.stopPropagation(); addToBoutiqueCart('${p.product_id}')" class="bg-secondary text-secondary-container w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[18px]">add</span></button>` 
                                : `<div class="flex items-center bg-secondary-container rounded-full px-1 py-1" onclick="event.stopPropagation()">
                                    <button onclick="changeBoutiqueCartQty('${p.product_id}', -1)" class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"><span class="material-symbols-outlined text-[16px]">remove</span></button>
                                    <span class="w-4 text-center font-bold text-on-secondary-container text-xs">${cartQty}</span>
                                    <button onclick="changeBoutiqueCartQty('${p.product_id}', 1)" ${cartQty >= stockQty ? 'disabled class="w-6 h-6 rounded-full flex items-center justify-center opacity-50"' : 'class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"'}><span class="material-symbols-outlined text-[16px]">add</span></button>
                                   </div>`
                            )}
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            const oldHTML = filtered.map(p => {
                const cartQty = preorderCart[p.product_id]?.qty || 0;
                const stockQty = parseInt(p[qtyField]) || 0;
                const outOfStock = stockQty <= 0;
                return `<div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col h-full ${outOfStock ? 'opacity-50' : ''}">
                    <div class="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden">
                        ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover"/>` : `<div class="w-full h-full flex items-center justify-center"><span class="material-symbols-outlined text-gray-300 text-4xl">image</span></div>`}
                    </div>
                    <div class="flex-1 flex flex-col">
                        <p class="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1 line-clamp-1">${(p.sub_category || p['Sub-Category']) && (p.sub_category || p['Sub-Category']) !== '-' ? (p.sub_category || p['Sub-Category']) : 'Information not available'}</p>
                        <h3 class="text-xs font-bold text-gray-800 line-clamp-2 mb-2 leading-snug">${(p.scent || p.Scent) && (p.scent || p.Scent) !== '-' ? (p.scent || p.Scent) : 'Information not available'}</h3>
                        <div class="mt-auto">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-black text-gray-900 text-sm">฿${parseFloat(p.price).toLocaleString()}</span>
                                <span class="text-[10px] font-bold ${stockQty - cartQty <= 5 ? 'text-red-500' : 'text-gray-400'}">เหลือ ${stockQty - cartQty}</span>
                            </div>
                            ${outOfStock ? `<button disabled class="w-full bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-bold">Out of Stock</button>` : (cartQty === 0
                                ? `<button onclick="addToCart('${p.product_id}')" class="w-full bg-amber-50 text-amber-600 border border-amber-200 py-2 rounded-xl text-xs font-black active:bg-amber-100 transition-colors">เพิ่มลงตะกร้า</button>`
                                : `<div class="flex items-center justify-between bg-amber-50 rounded-xl px-2 py-1">
                                    <button onclick="changeQty('${p.product_id}', -1)" class="w-8 h-8 flex items-center justify-center text-amber-700 active:scale-90"><span class="material-symbols-outlined text-sm">remove</span></button>
                                    <span class="font-black text-amber-700 text-sm">${cartQty}</span>
                                    <button onclick="changeQty('${p.product_id}', 1)" ${cartQty >= stockQty ? 'disabled class="w-8 h-8 flex items-center justify-center text-amber-300"' : 'class="w-8 h-8 flex items-center justify-center text-amber-700 active:scale-90"'}><span class="material-symbols-outlined text-sm">add</span></button>
                                   </div>`
                            )}
                        </div>
                    </div>
                </div>`;
            }).join('');

            if (boutiqueGrid) boutiqueGrid.innerHTML = boutiqueHTML;
            if (oldGrid) oldGrid.innerHTML = oldHTML;
            
            updateBoutiqueCartUI();
        }

        function addToCart(productId) {
            const p = allProducts.find(x => x.product_id === productId);
            if (!p) return;
            if (!preorderCart[productId]) preorderCart[productId] = { qty: 0, product: p };
            preorderCart[productId].qty++;
            renderProductGrid();
        }

        function changeQty(productId, delta) {
            if (!preorderCart[productId]) return;
            preorderCart[productId].qty += delta;
            if (preorderCart[productId].qty <= 0) delete preorderCart[productId];
            renderProductGrid();
            renderCartSummary();
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
            document.getElementById('cart-store-name').textContent = preorderStoreName;
            
            if (items.length === 0) {
                document.getElementById('cart-summary').innerHTML = '<p class="text-gray-400 text-sm text-center py-8">ตะกร้าว่างเปล่า</p>';
                document.getElementById('cart-total-qty').textContent = 'Total (0 items)';
                document.getElementById('cart-total-price').textContent = '฿0';
                return 0;
            }
            let total = 0;
            let totalQty = 0;
            const rows = items.map(i => {
                const subtotal = parseFloat(i.product.price) * i.qty;
                total += subtotal;
                totalQty += i.qty;
                
                // Fallback image if product image is empty
                const imgSrc = i.product.image || 'https://via.placeholder.com/150?text=No+Image';
                
                const subcat = i.product.sub_category || i.product['Sub-Category'];
                const subcatHtml = (subcat && subcat !== '-') ? `<p class="text-[10px] uppercase tracking-widest mb-1" style="color: #c4a46d; font-weight: 700;">${subcat}</p>` : '';
                const sizeHtml = i.product.size ? `<div class="mt-2 pt-2 border-t border-gray-100"><span class="text-[10px] text-gray-400 uppercase mr-2">SIZE</span><span class="font-bold text-sm text-[#000a1e]">${i.product.size}</span></div>` : '';
                const titleText = i.product.scent && i.product.scent.trim() !== '' ? i.product.scent : i.product.product_name;

                return `<div class="p-4 flex flex-col md:flex-row md:items-center gap-4 group border-b border-gray-100 last:border-0">
                    <div onclick="showImagePopup('${imgSrc}')" class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100 cursor-pointer hover:border-[#000a1e]/30 hover:shadow-sm transition-all">
                        <img alt="Product" class="w-full h-full object-contain" src="${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
                    </div>
                    <div class="flex-grow space-y-1">
                        ${subcatHtml}
                        <h3 class="font-black text-[16px] text-[#000a1e] leading-tight line-clamp-2 uppercase">${titleText}</h3>
                        <p class="text-xs font-bold text-gray-500 tracking-widest mt-1">SKU: ${i.product.product_code || ''}</p>
                        ${sizeHtml}
                    </div>
                    <div class="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0">
                        <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-white">
                            <button onclick="changeQty('${i.product.product_id}', -1)" class="w-9 h-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"><span class="material-symbols-outlined text-[18px]">remove</span></button>
                            <span class="w-10 text-center font-bold text-[#000a1e] text-sm">${i.qty}</span>
                            <button onclick="changeQty('${i.product.product_id}', 1)" class="w-9 h-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"><span class="material-symbols-outlined text-[18px]">add</span></button>
                        </div>
                        <div class="w-28 text-right shrink-0">
                            <span class="font-black text-[16px] text-[#000a1e]">฿${subtotal.toLocaleString()}</span>
                        </div>
                        <button onclick="changeQty('${i.product.product_id}', -9999)" class="material-symbols-outlined text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0">delete</button>
                    </div>
                </div>`;
            }).join('');
            
            document.getElementById('cart-summary').innerHTML = rows;
            document.getElementById('cart-total-qty').textContent = `Total (${totalQty} items)`;
            document.getElementById('cart-total-price').textContent = `฿${total.toLocaleString()}`;
            
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
                let data;
                let rawText = '';
                try {
                    rawText = await res.text();
                    data = JSON.parse(rawText);
                } catch(err) {
                    throw new Error('NON-JSON: ' + rawText.substring(0, 100));
                }
                if (data.success) {
                    lastCompletedOrderNumber = data.order_number;
                    
                    let ordersArray = [];
                    try {
                        if (localStorage.getItem('myOrders')) {
                            ordersArray = JSON.parse(localStorage.getItem('myOrders'));
                        } else if (localStorage.getItem('myLastOrder')) {
                            ordersArray = [localStorage.getItem('myLastOrder')];
                        }
                    } catch(e) {}
                    if (!ordersArray.includes(data.order_number)) {
                        ordersArray.push(data.order_number);
                        localStorage.setItem('myOrders', JSON.stringify(ordersArray));
                    }
                    
                    renderOrderHistory(ordersArray);

                    document.getElementById('done-order-number').textContent = data.order_number;
                    document.getElementById('track-order-input').value = data.order_number;
                    showPreorderStep('done');
                    const floatBtn = document.getElementById('floating-track-btn');
                    if (floatBtn) floatBtn.classList.remove('hidden');
                } else {
                    errEl.textContent = data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
                    errEl.classList.remove('hidden');
                }
            } catch(e) {
                console.error("Order error", e);
                errEl.textContent = 'Error: ' + (e.message || 'Unable to connect to server');
                errEl.classList.remove('hidden');
            }
            btn.disabled = false;
            btn.textContent = 'âœ… Confirm Pre-order';
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
                    pending: { label: 'Pending', icon: 'pending', color: 'yellow', desc: 'The store has received your order and is processing it' },
                    confirmed: { label: 'Confirmed', icon: 'check_circle', color: 'blue', desc: 'Staff has confirmed your order' },
                    preparing: { label: 'Preparing', icon: 'inventory_2', color: 'amber', desc: 'Staff is preparing your items' },
                    ready: { label: 'Ready', icon: 'shopping_bag', color: 'green', desc: 'Items are ready! Please pick up at the store' },
                    cancelled: { label: 'Cancelled', icon: 'cancel', color: 'red', desc: 'This order has been cancelled' },
                    out_of_stock: { label: 'Out of Stock', icon: 'warning', color: 'orange', desc: 'Some items are out of stock. Please contact the store' }
                };
                const sm = statusMap[o.status] || { label: o.status, icon: 'info', color: 'gray', desc: '' };
                const colorClasses = { yellow: 'bg-yellow-100 text-yellow-700', blue: 'bg-blue-100 text-blue-700', amber: 'bg-amber-100 text-amber-700', green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', orange: 'bg-orange-100 text-orange-700', gray: 'bg-gray-100 text-gray-700' };
                const storesMap = { 'TE3': 'PANPURI Concourse D East', 'TE1': 'PANPURI Concourse D East 2', 'TW4': 'PANPURI Concourse D West' };
                const items = Array.isArray(o.items) ? o.items : [];
                const staffNote = o.staff_note ? `<div class="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700 font-semibold">💬 Note from store: ${o.staff_note}</div>` : '';

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
                            <span class="text-xs font-black text-gray-900">Total</span>
                            <span class="font-black text-amber-700">฿${parseFloat(o.total_price).toLocaleString()}</span>
                        </div>
                        <p class="text-[10px] text-gray-400 mt-3 mb-2">Customer: ${o.customer_name} • Flight: ${o.flight_number}</p>
                        <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <div class="text-[10px] text-gray-400">Pick up at store</div>
                                <div class="text-xs font-bold text-gray-800">${storesMap[o.store_id] || o.store_id}</div>
                            </div>
                            <button onclick="closeAIModal(); showPage('map-view'); document.getElementById('map-search-input').value = '${o.store_id}'; setTimeout(()=>searchMapLive(),100);" class="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100 transition-all active:scale-95 shadow-sm">
                                <span class="material-symbols-outlined text-xs">near_me</span> Navigate
                            </button>
                        </div>
                        ${o.status === 'pending' ? `
                        <div class="mt-4 pt-3 border-t border-gray-100 text-center">
                            <button onclick="cancelCustomerOrder('${o.order_number}')" class="text-[10px] font-bold text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all active:scale-95 inline-block">Cancel this order</button>
                        </div>
                        ` : ''}
                    </div>`;
            } catch(e) {
                resultEl.innerHTML = '<div class="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-semibold text-center">Unable to connect</div>';
            }
        }

        function showPreorderStep(step) {
            // Update background based on step
            const pagePreorder = document.getElementById('page-preorder');
            if (pagePreorder) {
                const bgLayer = pagePreorder.querySelector('.fixed.inset-0.z-0');
                if (bgLayer) {
                    if (step === 'select-store' || step === 'store') {
                        bgLayer.style.display = 'block';
                        pagePreorder.style.backgroundColor = 'transparent';
                    } else {
                        bgLayer.style.display = 'none';
                        pagePreorder.style.backgroundColor = '#f8fafc'; // White/light-gray background
                    }
                }
            }

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


        function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'th', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google_translate_element');
        }
        
        function setLang(langCode) {
            const dropdown = document.getElementById('lang-dropdown'); if (dropdown) dropdown.classList.add('hidden');
            const selectField = document.querySelector(".goog-te-combo");
            if (selectField) {
                selectField.value = langCode;
                if (typeof window.Event === 'function') {
                    selectField.dispatchEvent(new window.Event('change', { bubbles: true }));
                } else {
                    const event = document.createEvent('HTMLEvents');
                    event.initEvent('change', true, false);
                    selectField.dispatchEvent(event);
                }
            } else {
                // Fallback: Set cookie directly if script isn't fully loaded
                document.cookie = `googtrans=/auto/${langCode}; path=/;`;
                window.location.reload();
            }
        }
        
        function showOtherLang() {
            document.getElementById('lang-dropdown').classList.add('hidden');
            document.getElementById('google-translate-wrapper').classList.add('show');
        }
        
        // Close dropdowns on outside click
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.relative')) {
                document.getElementById('lang-dropdown')?.classList.add('hidden');
                document.getElementById('google-translate-wrapper')?.classList.remove('show');
            }
        });

        // Boutique Logic
        function openBoutiqueDrawer(productId) {
            const p = allProducts.find(x => x.product_id === productId);
            if(!p) return;
            const drawer = document.getElementById('productDrawer');
            const panel = document.getElementById('drawerPanel');
            const backdrop = document.getElementById('drawerBackdrop');
            
            document.getElementById('drawerTitle').innerText = (p.scent || p.Scent) && (p.scent || p.Scent) !== '-' ? (p.scent || p.Scent) : 'Information not available';
            document.getElementById('drawerCategory').innerText = (p.sub_category || p['Sub-Category']) && (p.sub_category || p['Sub-Category']) !== '-' ? (p.sub_category || p['Sub-Category']) : 'Information not available';
            const drawerSizeEl = document.getElementById('drawerSize');
            if (drawerSizeEl) drawerSizeEl.innerText = p.size || 'N/A';
            document.getElementById('drawerPrice').innerText = '฿' + parseFloat(p.price).toLocaleString();
            
            const drawerSkuEl = document.getElementById('drawerSKU');
            if (drawerSkuEl) drawerSkuEl.innerText = p.product_code || p.Code || 'N/A';
            
            const descCustomerEl = document.getElementById('drawerDescCustomer');
            if (descCustomerEl) {
                const val = p.description_customer || p.Description_Customer;
                descCustomerEl.innerHTML = (!val || val === '-') ? 'Information not available' : val;
            }
            
            const howToUseEl = document.getElementById('drawerHowToUse');
            if (howToUseEl) {
                const val = p.how_to_use || p.How_to_Use;
                howToUseEl.innerHTML = (!val || val === '-') ? 'Information not available' : val;
            }

            const scentNotesEl = document.getElementById('drawerScentNotes');
            if (scentNotesEl) {
                const val = p.scent_notes || p.Scent_Notes;
                scentNotesEl.innerHTML = (!val || val === '-') ? 'Information not available' : val;
            }
            
            const imgElem = document.getElementById('drawerImage');
            if (p.image) {
                imgElem.src = p.image;
            } else {
                imgElem.src = 'https://placehold.co/800x800/ffffff/1e293b?text=Image+Not+Found';
            }
            
            // Set qty logic in drawer
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_te3';
            const stockQty = parseInt(p[qtyField]) || 0;
            const cartQty = preorderCart[productId]?.qty || 0;
            const remainingStock = stockQty - cartQty;
            const outOfStock = remainingStock <= 0;
            
            const stockEl = document.getElementById('drawerStock');
            if (stockEl) {
                stockEl.innerText = `คงเหลือ: ${remainingStock}`;
                stockEl.className = remainingStock <= 5 ? 'text-sm font-bold text-red-500' : 'text-sm font-bold text-gray-500';
            }
            
            window.currentDrawerProductId = productId;
            window.currentDrawerQty = outOfStock ? 0 : 1;
            
            if (document.getElementById('drawerQtyDisplay')) {
                document.getElementById('drawerQtyDisplay').innerText = window.currentDrawerQty;
            }
            
            updateDrawerAddToCartBtn(outOfStock, p);
            
            drawer.classList.remove('invisible');
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
                backdrop.classList.add('opacity-100');
            }, 10);
        }

        function updateDrawerAddToCartBtn(outOfStock, p) {
            const btnContainer = document.getElementById('drawerCartBtnContainer');
            if(!btnContainer) {
                // inject container if not exists
                const btn = document.querySelector('#drawerPanel .border-t.bg-surface-container-lowest button');
                if(btn) {
                    btn.outerHTML = '<div id="drawerCartBtnContainer"></div>';
                }
            }
            if (outOfStock || window.currentDrawerQty <= 0) {
                document.getElementById('drawerCartBtnContainer').innerHTML = '<button disabled class="w-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md py-5 rounded-full flex items-center justify-center gap-3">OUT OF STOCK</button>';
            } else {
                document.getElementById('drawerCartBtnContainer').innerHTML = `<button onclick="addToBoutiqueCart('${p.product_id}', ${window.currentDrawerQty}); closeDrawer()" class="w-full bg-primary text-on-primary font-label-md text-label-md py-5 rounded-full haptic-active flex items-center justify-center gap-3 shadow-xl"><span class="material-symbols-outlined">shopping_cart</span> ADD TO CART</button>`;
            }
        }

        function changeDrawerQty(delta) {
            if (!window.currentDrawerProductId) return;
            const p = allProducts.find(x => x.product_id === window.currentDrawerProductId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_te3';
            const stockQty = parseInt(p[qtyField]) || 0;
            const cartQty = preorderCart[p.product_id]?.qty || 0;
            const remainingStock = stockQty - cartQty;
            
            let newQty = window.currentDrawerQty + delta;
            if (newQty < 1) newQty = 1;
            if (newQty > remainingStock) newQty = remainingStock;
            
            window.currentDrawerQty = newQty;
            if (document.getElementById('drawerQtyDisplay')) {
                document.getElementById('drawerQtyDisplay').innerText = window.currentDrawerQty;
            }
            updateDrawerAddToCartBtn(remainingStock <= 0, p);
        }

        function closeDrawer() {
            const drawer = document.getElementById('productDrawer');
            const panel = document.getElementById('drawerPanel');
            const backdrop = document.getElementById('drawerBackdrop');
            
            panel.classList.add('translate-x-full');
            backdrop.classList.remove('opacity-100');
            
            setTimeout(() => {
                drawer.classList.add('invisible');
            }, 300);
        }

        function addToBoutiqueCart(productId, qtyToAdd = 1) {
            const p = allProducts.find(x => x.product_id === productId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_te3';
            const stockQty = parseInt(p[qtyField]) || 0;
            
            if (!preorderCart[productId]) preorderCart[productId] = { qty: 0, product: p };
            
            if (preorderCart[productId].qty + qtyToAdd > stockQty) {
                alert('Insufficient stock');
                return;
            }
            preorderCart[productId].qty += qtyToAdd;
            updateBoutiqueCartUI();
            renderProductGrid();
        }

        function changeBoutiqueCartQty(productId, delta) {
            const p = allProducts.find(x => x.product_id === productId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_te3';
            const stockQty = parseInt(p[qtyField]) || 0;

            if (!preorderCart[productId]) return;
            
            if (preorderCart[productId].qty + delta > stockQty) {
                alert('Insufficient stock');
                return;
            }
            
            preorderCart[productId].qty += delta;
            if (preorderCart[productId].qty <= 0) delete preorderCart[productId];
            updateBoutiqueCartUI();
            renderProductGrid();
        }

        function updateBoutiqueCartUI() {
            const totalItems = Object.values(preorderCart).reduce((s, i) => s + i.qty, 0);
            const badges = document.querySelectorAll('.boutique-cart-badge');
            badges.forEach(b => {
                if(totalItems > 0) {
                    b.classList.remove('hidden');
                    b.textContent = totalItems;
                } else {
                    b.classList.add('hidden');
                }
            });
        }
        
        function checkoutBoutique() {
            if(Object.keys(preorderCart).length === 0) {
                alert('Your cart is empty');
                return;
            }
            // Transition back to confirm step
            showPage('page-preorder');
            showPreorderStep('confirm');
            renderCartSummary();
        }
        
        function exitBoutique() {
            showPage('home-view');
        }

        function showImagePopup(src) {
            const modal = document.getElementById('image-popup-modal');
            const img = document.getElementById('image-popup-img');
            if(modal && img) {
                img.src = src;
                modal.classList.remove('hidden');
                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0');
                    const inner = modal.querySelector('div');
                    if(inner) {
                        inner.classList.remove('scale-95');
                        inner.classList.add('scale-100');
                    }
                });
            }
        }

        function closeImagePopup() {
            const modal = document.getElementById('image-popup-modal');
            if(modal) {
                modal.classList.add('opacity-0');
                const inner = modal.querySelector('div');
                if(inner) {
                    inner.classList.remove('scale-100');
                    inner.classList.add('scale-95');
                }
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }
    


        let orderToCancel = null;

        function closeCancelOrderModal() {
            const modal = document.getElementById('cancel-order-modal');
            const backdrop = document.getElementById('cancel-order-backdrop');
            const content = document.getElementById('cancel-order-content');
            if (!modal) return;
            
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        function cancelCustomerOrder(orderNum) {
            orderToCancel = orderNum;
            const modal = document.getElementById('cancel-order-modal');
            const backdrop = document.getElementById('cancel-order-backdrop');
            const content = document.getElementById('cancel-order-content');
            if (!modal) return;
            
            document.getElementById('confirm-cancel-order-btn').onclick = () => proceedCancelOrder();
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            setTimeout(() => {
                backdrop.classList.remove('opacity-0');
                backdrop.classList.add('opacity-100');
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        async function proceedCancelOrder() {
            if (!orderToCancel) return;
            const orderNum = orderToCancel;
            closeCancelOrderModal();
            try {
                const res = await fetch(`/api/orders/customer-cancel/${orderNum}`, { method: 'POST' });
                const data = await res.json();
                if(data.success) {
                    showToast('Order cancelled successfully', 'success');
                    trackOrder();
                } else {
                    showToast(data.error || 'Unable to cancel', 'error');
                }
            } catch(e) {
                showToast('Unable to connect to server', 'error');
            }
        }

        function closeClearHistoryModal() {
            const modal = document.getElementById('clear-history-modal');
            const backdrop = document.getElementById('clear-history-backdrop');
            const content = document.getElementById('clear-history-content');
            if (!modal) return;
            
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        function clearOrderHistory() {
            const modal = document.getElementById('clear-history-modal');
            const backdrop = document.getElementById('clear-history-backdrop');
            const content = document.getElementById('clear-history-content');
            if (!modal) return;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            setTimeout(() => {
                backdrop.classList.remove('opacity-0');
                backdrop.classList.add('opacity-100');
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function proceedClearHistory() {
                        closeClearHistoryModal();
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');
            renderOrderHistory([]);
            document.getElementById('track-order-input').value = '';
            document.getElementById('track-result').classList.add('hidden');
            const floatBtn = document.getElementById('floating-track-btn');
            if(floatBtn) floatBtn.classList.add('hidden');
            if (typeof showToast === 'function') showToast('Order history cleared', 'success');
        }

        function openImagePreview(url) {
            const lightbox = document.getElementById('image-lightbox');
            document.getElementById('lightbox-img').src = url;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
            }, 10);
        }

        function closeImagePreview() {
            const lightbox = document.getElementById('image-lightbox');
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
                document.getElementById('lightbox-img').src = '';
            }, 300);
        }
        function renderOrderHistory(ordersArray) {
            const historyList = document.getElementById('order-history-list');
            if (!historyList) return;
            if (!ordersArray || ordersArray.length === 0) {
                historyList.innerHTML = '';
                return;
            }
            historyList.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <div class="text-xs font-bold text-gray-400">Your recent order history:</div>
                    <button onclick="clearOrderHistory()" class="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors underline">Clear history</button>
                </div>
            ` + [...ordersArray].reverse().map(orderId => `
                <button onclick="document.getElementById('track-order-input').value='${orderId}'; trackOrder();" class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 hover:border-amber-400 hover:bg-amber-50 active:scale-95 transition-all shadow-sm">
                    <span>${orderId}</span>
                    <span class="material-symbols-outlined text-amber-500 text-sm">chevron_right</span>
                </button>
            `).join('');
        }

        
    

        function executeHomeAISearch() {
            const input = document.getElementById('home-ai-search-input');
            if (input && input.value.trim() !== '') {
                const val = input.value;
                // Switch to map view
                showPage('map-view');
                // Set the value in the map's search box
                const mapInput = document.getElementById('map-search-input');
                if (mapInput) {
                    mapInput.value = val;
                }
                // Trigger the searches
                setTimeout(() => {
                    if (typeof searchMapLive === 'function') searchMapLive();
                    if (typeof triggerMapAISearch === 'function') triggerMapAISearch(val);
                }, 300);
            }
        }
    

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
        


        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchStoreParam = urlParams.get('searchStore');
            const boutiqueStoreParam = urlParams.get('boutiqueStore');
            const viewParam = urlParams.get('view');
            
            if (viewParam === 'map') {
                setTimeout(() => {
                    if (typeof showPage === 'function') {
                        showPage('map-view');
                    }
                }, 100);
            } else if (viewParam === 'ai') {
                setTimeout(() => {
                    if (typeof openAIModal === 'function') {
                        openAIModal();
                    }
                }, 100);
            }
            
            if (boutiqueStoreParam) {
                const storeMap = { 'TE3': 'PANPURI Concourse D East', 'TE1': 'PANPURI Concourse D East 2', 'TW4': 'PANPURI Concourse D West' };
                const storeName = storeMap[boutiqueStoreParam] || 'PANPURI';
                if (typeof selectPreorderStore === 'function') {
                    selectPreorderStore(boutiqueStoreParam, storeName);
                }
            } else if (searchStoreParam) {
                setTimeout(() => {
                    if (typeof showPage === 'function') showPage('map-view');
                    const searchInput = document.getElementById('map-search-input');
                    if (searchInput) searchInput.value = searchStoreParam;
                    if (typeof searchMapLive === 'function') searchMapLive();
                }, 500);
            }
        });
        
