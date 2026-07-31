
  function selectStore(storeId) {
      // Navigate to the main page (index.html) and open the Boutique view
      window.location.href = 'index.html?boutiqueStore=' + encodeURIComponent(storeId);
  }
