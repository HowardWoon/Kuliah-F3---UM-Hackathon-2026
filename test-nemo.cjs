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
    model: 'nemo-super',
    messages: [
      {
        role: 'user',
        content: [
          {type: 'image_url', image_url: {url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}},
          {type: 'text', text: 'Describe the image.'}
        ]
      }
    ]
  })
})
.then(r => r.json())
.then(data => {
  console.log("Response:", data);
})
.catch(console.error);
