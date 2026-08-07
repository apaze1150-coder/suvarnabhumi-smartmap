import codecs

file_path = "d:/apaze/Smartindoormap/server.js"

with codecs.open(file_path, "r", "utf-8") as f:
    content = f.read()

# Fix JSON parsing for Postgres JSONB columns
content = content.replace(
    "try { items = JSON.parse(o.items_json || '[]'); } catch(e) {}", 
    "try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : (o.items_json || []); } catch(e) {}"
)
content = content.replace(
    "try { itemsParsed = JSON.parse(order.items_json); } catch(e) {}", 
    "try { itemsParsed = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : (order.items_json || []); } catch(e) {}"
)
content = content.replace(
    "try { items = JSON.parse(o.items_json); } catch(e) {}", 
    "try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json) : (o.items_json || []); } catch(e) {}"
)
content = content.replace(
    "try { itemsParsed = JSON.parse(orders[idx].items_json); } catch(e) {}", 
    "try { itemsParsed = typeof orders[idx].items_json === 'string' ? JSON.parse(orders[idx].items_json) : (orders[idx].items_json || []); } catch(e) {}"
)

with codecs.open(file_path, "w", "utf-8") as f:
    f.write(content)

print("Patched server.js JSON.parse")
