import sys
content = open('airport_map_nodes.csv', 'r', encoding='utf-8').read()
content = content.replace('"C","gate","","","",""', '"C","gate","Node_Concourse_C:100","","",""')
open('airport_map_nodes.csv', 'w', encoding='utf-8').write(content)
print('Done')
