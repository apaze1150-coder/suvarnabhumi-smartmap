import sys
content = open('store.html', 'r', encoding='utf-8').read()
content = content.replace('? ', '? ')
open('store.html', 'w', encoding='utf-8').write(content)
print('Done')
