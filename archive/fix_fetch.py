import sys
content = open('index.html', 'r', encoding='utf-8').read()
target = '''                const data = await res.json();
                if (data.success) {'''
replace = '''                let data;
                let rawText = '';
                try {
                    rawText = await res.text();
                    data = JSON.parse(rawText);
                } catch(err) {
                    throw new Error('NON-JSON: ' + rawText.substring(0, 100));
                }
                if (data.success) {'''
content = content.replace(target, replace)
open('index.html', 'w', encoding='utf-8').write(content)
print('Done index.html')

