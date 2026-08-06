import sys
lines = open('index.html', 'r', encoding='utf-8').readlines()
lines[2106] = '                            Cancel Navigation\n'
open('index.html', 'w', encoding='utf-8').writelines(lines)
print('Done index.html')

