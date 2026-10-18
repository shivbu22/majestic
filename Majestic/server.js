const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:' + PORT}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 301 Redirect for legacy /about matching .htaccess
    if (pathname === '/about' || pathname === '/about.html') {
      res.writeHead(301, { 'Location': '/ourstory' });
      return res.end();
    }

    // Strip trailing slash for clean URLs (e.g. /ourstory/ -> /ourstory)
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const cleanPath = pathname.replace(/\/+$/, '');
      res.writeHead(301, { 'Location': cleanPath });
      return res.end();
    }

    // Root to index.html
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    let filePath = path.join(PUBLIC_DIR, pathname);

    // Check if direct file exists
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      // Check if pathname + .html exists (clean URLs like /ourstory -> /ourstory.html)
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(PUBLIC_DIR, '404.html'))) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8', 'Cache-Control': 'no-cache' });
        return fs.createReadStream(path.join(PUBLIC_DIR, '404.html')).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        return res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#0E0A05;color:#F5ECD7;font-family:sans-serif;text-align:center;padding:5rem;"><h1>404 — Page Not Found</h1><p><a href="/" style="color:#C4860B;">Return to Majestic Essence Home</a></p></body></html>');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Server Error: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌿 Majestic Essence Dev Server Active`);
  console.log(`   Local URL:    http://localhost:${PORT}/`);
  console.log(`   Our Story:    http://localhost:${PORT}/ourstory`);
  console.log(`   Spices:       http://localhost:${PORT}/spices`);
  console.log(`   Shipping:     http://localhost:${PORT}/shipping`);
  console.log(`======================================================\n`);
});
