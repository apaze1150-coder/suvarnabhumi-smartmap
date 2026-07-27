const fs = require('fs');
let smartmap = fs.readFileSync('d:/apaze/Smartindoormap/smartmap.html', 'utf8');
let reference = fs.readFileSync('d:/apaze/Smartindoormap/reference.html', 'utf8');

const refStart = reference.indexOf('<!-- Desktop SideNavBar -->');
const refEnd = reference.indexOf('<script>');
const boutiqueHtml = reference.substring(refStart, refEnd).trim();

const wrapperHtml = `\n        <!-- PANPURI BOUTIQUE VIEW -->\n        <div id="view-panpuri-boutique" class="page-section absolute inset-0 z-[100] bg-background text-on-background font-body-md overflow-hidden">\n${boutiqueHtml}\n        </div>\n`;

const targetAnchor = '        <!-- 2. MAP VIEW -->';
if (smartmap.includes(targetAnchor)) {
    smartmap = smartmap.replace(targetAnchor, wrapperHtml + '\n' + targetAnchor);
    fs.writeFileSync('d:/apaze/Smartindoormap/smartmap.html', smartmap);
    console.log('Injected successfully.');
} else {
    console.log('Anchor not found.');
}
