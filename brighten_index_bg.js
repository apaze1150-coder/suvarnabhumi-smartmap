const fs = require('fs');
const indexPath = 'index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

// Update video opacity from 35 to 60, and gradient to be lighter
const target = `<video src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_flowers.mp4" playsinline muted loop autoplay class="w-full h-full object-cover object-bottom opacity-35 bg-[#000000]"></video>
                <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90"></div>`;

const replace = `<video src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_flowers.mp4" playsinline muted loop autoplay class="w-full h-full object-cover object-bottom opacity-60 bg-[#000000]"></video>
                <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log('Successfully brightened background in index.html');
} else {
    console.log('Target not found in index.html');
}
