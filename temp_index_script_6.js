

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
                const storeMap = { 'DE40': 'PANPURI Concourse D East', 'DE12': 'PANPURI Concourse D East 2', 'DW41': 'PANPURI Concourse D West' };
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
        
