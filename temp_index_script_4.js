
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
    