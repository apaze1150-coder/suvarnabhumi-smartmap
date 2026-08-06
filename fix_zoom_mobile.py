import sys
content = open('index.html', 'r', encoding='utf-8').read()
target = '''                    // Calculate bounding box between start and target
                    const dx = Math.abs(targetX - startX);
                    const dy = Math.abs(targetY - startY);
                    
                    // Determine zoom scale to fit both points (with padding)
                    // Map viewport is 1000x500. 
                    let scaleX = 1000 / (dx || 100); // avoid div by 0
                    let scaleY = 500 / (dy || 100);
                    // scale factor: allow max 2.5, min 1.2
                    let targetScale = Math.min(scaleX, scaleY) * 0.6; // 0.6 padding factor
                    if (targetScale > 2.5) targetScale = 2.5;
                    if (targetScale < 1.2) targetScale = 1.2;'''
replace = '''                    // Calculate distance between points in the 1000x500 map coordinate system
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
                    if (targetScale < 0.4) targetScale = 0.4;'''
content = content.replace(target, replace)
open('index.html', 'w', encoding='utf-8').write(content)
print('Done index.html')

content = open('smartmap.html', 'r', encoding='utf-8').read()
content = content.replace(target, replace)
open('smartmap.html', 'w', encoding='utf-8').write(content)
print('Done smartmap.html')

