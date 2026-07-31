
    // Anti-flicker for boutique navigation
    if (window.location.search.includes('boutiqueStore=')) {
        document.write('<style id="anti-flicker">#home-view { display: none !important; }</style>');
    }
