const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/VITE_ZAI_API_KEY=(.*)/)[1].trim();

fetch('https://api.ilmu.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + key,
  },
  body: JSON.stringify({
    model: 'ilmu-glm-5.1',
    messages: [
      {
        role: 'user',
        content: 'Analyze this image: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
      }
    ]
  })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(console.error);
