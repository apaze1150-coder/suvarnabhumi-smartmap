const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldFuncRegex = /function clearOrderHistory\(\) \{\s*if\(!confirm\('ต้องการClear historyการสั่งจองในเครื่องนี้หรือไม่\? \(จะทำให้สัญลักษณ์รถเข็นหายไป\)'\)\) return;\s*localStorage\.removeItem\('myOrders'\);\s*localStorage\.removeItem\('myLastOrder'\);\s*renderOrderHistory\(\[\]\);\s*document\.getElementById\('track-order-input'\)\.value = '';\s*document\.getElementById\('track-result'\)\.classList\.add\('hidden'\);\s*const floatBtn = document\.getElementById\('floating-track-btn'\);\s*if\(floatBtn\) floatBtn\.classList\.add\('hidden'\);\s*\}/g;

let matches = content.match(oldFuncRegex);
if (matches && matches.length > 0) {
    content = content.replace(oldFuncRegex, '');
    fs.writeFileSync('index.html', content);
    console.log("Removed duplicate function!");
} else {
    console.log("Not found.");
}
