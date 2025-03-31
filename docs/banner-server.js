const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Serve the banner HTML
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'banner.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading banner.html: ${err.message}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Open this URL in your browser to view the banner');
  console.log('Take a screenshot of the banner to use in your project');
});
