const fs = require('fs');

const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const newCSS = `        .stagger-1 { animation-delay: 50ms; }
        .stagger-2 { animation-delay: 100ms; }
        .stagger-3 { animation-delay: 150ms; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
    </style>`;

content = content.replace('    </style>', newCSS);
fs.writeFileSync(file, content, 'utf8');
console.log('Added CSS');
