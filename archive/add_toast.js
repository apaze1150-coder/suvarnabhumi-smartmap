const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const toastScript = `
        function showToast(message, type = 'success') {
            let toastContainer = document.getElementById('toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                toastContainer.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4';
                document.body.appendChild(toastContainer);
            }
            
            const toast = document.createElement('div');
            const isError = type === 'error';
            toast.className = \`flex items-center gap-3 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform -translate-y-8 opacity-0 \${isError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-[#eaf5ee] border border-[#d3ebd9] text-[#2c7a3e]'}\`;
            
            const icon = isError ? 'error' : 'check_circle';
            const iconColor = isError ? 'text-red-500' : 'text-[#3cb371]';
            
            toast.innerHTML = \`
                <span class="material-symbols-outlined \${iconColor} text-2xl">\${icon}</span>
                <span class="font-bold text-sm">\${message}</span>
            \`;
            
            toastContainer.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.classList.remove('-translate-y-8', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100');
            }, 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('-translate-y-8', 'opacity-0');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }
`;

if (!c.includes('function showToast(')) {
    // Insert just before the closing script tag near the floating button
    c = c.replace('</script>\n    <!-- Floating Track Order Button -->', toastScript + '\n    </script>\n    <!-- Floating Track Order Button -->');
}

c = c.replace(/alert\('Order cancelled successfully'\);/g, "showToast('Order cancelled successfully', 'success');");
c = c.replace(/alert\(data\.error \|\| 'Unable to cancel'\);/g, "showToast(data.error || 'Unable to cancel', 'error');");
c = c.replace(/alert\('Unable to connect to server'\);/g, "showToast('Unable to connect to server', 'error');");

fs.writeFileSync('index.html', c);
console.log('Toast integrated');
