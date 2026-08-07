import sys
content = open('index.html', 'r', encoding='utf-8').read()
target = '''            } catch (e) {
                console.error(\"Order error:\", e);
                errEl.textContent = 'Unable to connect to server';
                errEl.classList.remove('hidden');
            }'''
replace = '''            } catch (e) {
                console.error(\"Order error:\", e);
                errEl.textContent = 'Error: ' + (e.message || 'Unable to connect to server');
                errEl.classList.remove('hidden');
            }'''
content = content.replace(target, replace)
open('index.html', 'w', encoding='utf-8').write(content)
print('Done index.html')

