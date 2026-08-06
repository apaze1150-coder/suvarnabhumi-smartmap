import re
import shutil

file_path = 'index.html'
backup_path = 'index_backup_premium.html'

shutil.copyfile(file_path, backup_path)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Outfit font
font_link = '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">'
content = re.sub(
    r'<link href="https://fonts\.googleapis\.com/css2\?family=Manrope:.*?" rel="stylesheet">',
    font_link,
    content
)

# 2. Update Tailwind Config to use Outfit instead of Manrope
content = content.replace('"Manrope"', '"Outfit"')

# 3. Inject Premium CSS
premium_css = """
    <!-- Premium UI Upgrades -->
    <style>
        /* Smooth interactions for all interactive elements */
        button, a, input, select {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        button:active {
            transform: scale(0.97);
        }

        /* Glassmorphism for panels */
        .bg-surface-container, .bg-white, .bg-surface-container-lowest {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }
        
        /* Specific overrides for floating panels to ensure they look premium */
        .fixed.z-50, .absolute.z-40, .sticky {
            background-color: rgba(255, 255, 255, 0.85) !important;
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.03) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }
        
        .dark .fixed.z-50, .dark .absolute.z-40, .dark .sticky {
            background-color: rgba(25, 28, 30, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5) !important;
        }

        /* Refined scrollbars */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(150, 150, 150, 0.3);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(150, 150, 150, 0.5);
        }
    </style>
"""

# Insert right before </head>
if premium_css not in content:
    content = content.replace('</head>', f'{premium_css}\n</head>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Premium UI upgrades applied to index.html successfully.")
