const fs = require('fs');
let s = fs.readFileSync('refactor2.js', 'utf8');
s = s.replace(/s\.replace\(readCsvOld, readCsvNew\);/g, 's = s.replace(readCsvOld, () => readCsvNew);');
s = s.replace(/s\.replace\(saveStoresOld, saveStoresNew\);/g, 's = s.replace(saveStoresOld, () => saveStoresNew);');
s = s.replace(/s\.replace\(saveNodesOld, saveNodesNew\);/g, 's = s.replace(saveNodesOld, () => saveNodesNew);');
s = s.replace(/s\.replace\(writeCsvOld, writeCsvNew\);/g, 's = s.replace(writeCsvOld, () => writeCsvNew);');
fs.writeFileSync('refactor2.js', s);
console.log('Fixed refactor2.js');
