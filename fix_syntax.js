const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');
s = s.replace(/  \} catch\(e\) \{\n    console\.error\('Error saving stores to DB:', e\);\n  \}\n\}\);/g, "  } catch(e) {\n    console.error('Error saving stores to DB:', e);\n  }\n}");
s = s.replace(/  \} catch\(e\) \{\n    console\.error\('Error saving nodes to DB:', e\);\n  \}\n\}\);/g, "  } catch(e) {\n    console.error('Error saving nodes to DB:', e);\n  }\n}");
s = s.replace(/  \} catch\(e\) \{\n    console\.error\('Error writing to table ' \+ table, e\);\n  \}\n\}\);/g, "  } catch(e) {\n    console.error('Error writing to table ' + table, e);\n  }\n}");
fs.writeFileSync('server.js', s);
console.log('Fixed syntax errors.');
