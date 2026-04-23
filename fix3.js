const fs = require('fs');
let t = fs.readFileSync('src/App.tsx', 'utf8');
t = t.replace(/\\`\\\${/g, '`${');
t = t.replace(/}%\`/g, '}%`');
fs.writeFileSync('src/App.tsx', t);
