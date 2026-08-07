const fs = require('fs');
let content = fs.readFileSync('smartmap.html', 'utf8');

content = content.replace(
    '        <span class="text-[10px] uppercase font-bold tracking-tight">AI Assist</span>\n</nav>',
    '        <span class="text-[10px] uppercase font-bold tracking-tight">AI Assist</span>\n    </div>\n</nav>'
);
content = content.replace(
    '        <span class="text-[10px] uppercase font-bold tracking-tight">AI Assist</span>\r\n</nav>',
    '        <span class="text-[10px] uppercase font-bold tracking-tight">AI Assist</span>\r\n    </div>\r\n</nav>'
);

content = content.replace('const FLOOR_4_MAP = "https://corporate.kingpower.com/wp-content/uploads/2023/09/0-4-scaled.jpg";', 'const FLOOR_4_MAP = "/uploads/4.svg";');
content = content.replace('const FLOOR_3_MAP = "https://corporate.kingpower.com/wp-content/uploads/2023/09/0-3-scaled.jpg";', 'const FLOOR_3_MAP = "/uploads/3.svg";');
content = content.replace('const SAT1_MAP = "https://corporate.kingpower.com/wp-content/uploads/2023/10/new-draft-SVB-%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%993-SAT-1-copy.jpg";', 'const SAT1_MAP = "/uploads/5.svg";');

fs.writeFileSync('smartmap.html', content);
console.log("Done");
