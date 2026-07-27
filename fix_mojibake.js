const fs = require('fs');

function fixMojibakeFile(filename) {
    if (!fs.existsSync(filename)) return;
    let text = fs.readFileSync(filename, 'utf8');

    function fixMojibake(str) {
        let result = '';
        let i = 0;
        while(i < str.length) {
            if (str.charCodeAt(i) === 0xE0 && i + 2 < str.length) {
                let b1 = str.charCodeAt(i);
                let b2 = str.charCodeAt(i+1);
                let b3 = str.charCodeAt(i+2);
                
                let mapCharToByte = (c) => {
                    if (c <= 0xFF) return c;
                    let win1252 = {
                        0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
                        0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
                        0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
                        0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
                        0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
                        0x017E: 0x9E, 0x0178: 0x9F
                    };
                    return win1252[c] || c;
                };

                if ((b2 === 0xB8 || b2 === 0xB9)) {
                    let byte1 = b1;
                    let byte2 = b2;
                    let byte3 = mapCharToByte(b3);
                    
                    try {
                        let decoded = Buffer.from([byte1, byte2, byte3]).toString('utf8');
                        if (decoded.length === 1 && decoded.charCodeAt(0) >= 0x0E00 && decoded.charCodeAt(0) <= 0x0E7F) {
                            result += decoded;
                            i += 3;
                            continue;
                        }
                    } catch(e) {}
                }
            }
            result += str[i];
            i++;
        }
        return result;
    }

    const fixedText = fixMojibake(text);
    if (text !== fixedText) {
        fs.writeFileSync(filename, fixedText, 'utf8');
        console.log("Fixed mojibake in " + filename);
    } else {
        console.log("No replacements were made in " + filename);
    }
}

fixMojibakeFile('store_selection.html');
fixMojibakeFile('panpuri_admin.html');
fixMojibakeFile('panpuri_admin_spa.html');
