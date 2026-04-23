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
        content: [
          {type: 'text', text: 'What is in this image?'},
          {type: 'image_url', image_url: {url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png'}}
        ]
      }
    ]
  })
})
.then(r => {
  if (!r.ok) return r.text().then(t => {throw new Error(t)});
  return r.json();
})
.then(data => {
  console.log("Response:", data);
})
.catch(console.error);
