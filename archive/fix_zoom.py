import sys
content = open('index.html', 'r', encoding='utf-8').read()
target = '''            // Zoom and Pan to the target location
            if (mapPanzoom) {
                setTimeout(() => {
                    const targetScale = 2.0; 
                    const panX = 500 - targetX;
                    const panY = 250 - targetY;
                    
                    mapPanzoom.pan(panX, panY, { animate: true, relative: false });
                    mapPanzoom.zoom(targetScale, { animate: true });
                }, 100);
            }'''
replace = '''            // Zoom and Pan to show both start and target locations
            if (mapPanzoom) {
                setTimeout(() => {
                    // Calculate bounding box between start and target
                    const dx = Math.abs(targetX - startX);
                    const dy = Math.abs(targetY - startY);
                    
                    // Determine zoom scale to fit both points (with padding)
                    // Map viewport is 1000x500. 
                    let scaleX = 1000 / (dx || 100); // avoid div by 0
                    let scaleY = 500 / (dy || 100);
                    // scale factor: allow max 2.5, min 1.2
                    let targetScale = Math.min(scaleX, scaleY) * 0.6; // 0.6 padding factor
                    if (targetScale > 2.5) targetScale = 2.5;
                    if (targetScale < 1.2) targetScale = 1.2;

                    // Pan to the midpoint between start and target
                    const midX = (startX + targetX) / 2;
                    const midY = (startY + targetY) / 2;
                    const panX = 500 - midX;
                    const panY = 250 - midY;
                    
                    mapPanzoom.pan(panX, panY, { animate: true, relative: false });
                    mapPanzoom.zoom(targetScale, { animate: true });
                }, 100);
            }'''
content = content.replace(target, replace)
open('index.html', 'w', encoding='utf-8').write(content)
print('Done')
