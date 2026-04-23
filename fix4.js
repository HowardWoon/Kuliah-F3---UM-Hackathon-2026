const fs = require('fs');
let t = fs.readFileSync('src/App.tsx', 'utf8');
t = t.replace("width: `\\${Math", "width: `${Math");
t = t.replace("100))}%\`", "100))}%`");
t = t.replace("`\\${", "`${").replace("}%\\`", "}%`");
fs.writeFileSync('src/App.tsx', t);
