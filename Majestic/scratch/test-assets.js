const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('ourstory.html', 'utf8');
const regex = /(?:src|href)=["']([^"']+)["']/g;
let match;
const assets = new Set();
while ((match = regex.exec(html)) !== null) {
  const url = match[1];
  if (!url.startsWith('http') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('javascript:')) {
    assets.add(url);
  }
}

async function checkUrl(path) {
  const fullPath = path.startsWith('/') ? path : '/' + path;
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'majestic-essence.com',
      port: 443,
      path: fullPath,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Range': 'bytes=0-50'
      }
    }, (res) => {
      resolve({ path, status: res.statusCode, contentType: res.headers['content-type'], location: res.headers['location'] });
    });
    req.on('error', (err) => resolve({ path, error: err.message }));
    req.end();
  });
}

(async () => {
  console.log(`Checking ${assets.size} assets from ourstory.html...`);
  for (const asset of assets) {
    const res = await checkUrl(asset);
    console.log(`${res.status || 'ERR'} | ${asset} | ${res.contentType || ''} ${res.location ? '-> ' + res.location : ''}`);
  }
})();
