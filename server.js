import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log(' [STARTUP] Node.js process initialized');
console.log(` [STARTUP] Working dir: ${process.cwd()}`);
console.log(` [STARTUP] Node version: ${process.version}`);
console.log(` [STARTUP] Available ENV:`);
console.log(`   - process.env.PORT: ${process.env.PORT || 'undefined'}`);
console.log(`   - process.env.SERVER_PORT: ${process.env.SERVER_PORT || 'undefined'}`);
console.log(`   - process.env.APP_PORT: ${process.env.APP_PORT || 'undefined'}`);
console.log(`   - process.env.NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log('====================================================');

const app = express();

// Trust reverse proxies (Cloudflare, Pterodactyl, nginx, etc.)
app.set('trust proxy', true);

// Ultra-detailed logger for every connection and request
app.use((req, res, next) => {
  const start = Date.now();
  const clientIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`>>> [HTTP REQUEST] ${req.method} ${req.url}`);
  console.log(`    Host: ${req.headers.host || 'none'}`);
  console.log(`    Client IP: ${clientIp}`);
  console.log(`    User-Agent: ${req.headers['user-agent'] || 'none'}`);
  console.log(`    Cloudflare Ray: ${req.headers['cf-ray'] || 'direct (no cloudflare)'}`);

  res.on('finish', () => {
    console.log(`<<< [HTTP RESPONSE] ${req.method} ${req.url} -> Status: ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Port prioritization:
// 1. Pterodactyl SERVER_PORT (standard in pterodactyl wings/eggs)
// 2. Default target allocation 20042 (if running standalone or port 8080/container port)
// 3. Fallback to process.env.PORT
const rawPort = process.env.SERVER_PORT || 20042 || process.env.PORT;
const PORT = Number(rawPort);
const HOST = '0.0.0.0';

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log(`[Diagnostic] Dist folder exists: ${fs.existsSync(distPath)}`);
console.log(`[Diagnostic] index.html exists: ${fs.existsSync(indexPath)}`);
if (fs.existsSync(distPath)) {
  console.log(`[Diagnostic] Dist contents: ${fs.readdirSync(distPath).join(', ')}`);
}

// Serve static assets from dist
app.use(
  express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// Diagnostic test endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    host: HOST,
    distExists: fs.existsSync(indexPath),
  });
});

// Quick root test endpoint in case dist is somehow failing
app.get('/api/ping', (req, res) => {
  res.send('PONG from Node.js server!');
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[CRITICAL] Unhandled rejection:', reason);
});

// SPA fallback: return index.html for all non-asset routes
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('[ERROR] dist/index.html not found when trying to serve route:', req.url);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Build required</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #111; color: #fff;">
          <h2>dist/index.html not found</h2>
          <p>Please run <code>npm run build</code> before starting the server.</p>
        </body>
      </html>
    `);
  }
});

// Start listening with explicit error handler and connection counter
const server = app.listen(PORT, HOST, () => {
  console.log('----------------------------------------------------');
  console.log(` [PTERODACTYL SERVER READY]`);
  console.log(` Listening on: http://${HOST}:${PORT}`);
  console.log(` Listening port number: ${PORT}`);
  console.log(` Direct test URL: http://c10.play2go.cloud:${PORT}/api/ping`);
  console.log('----------------------------------------------------');
});

server.on('connection', (socket) => {
  console.log(`[TCP] Incoming raw socket connection from ${socket.remoteAddress}:${socket.remotePort}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server Error] Port ${PORT} is ALREADY IN USE! Another process or zombie node is holding it.`);
  } else {
    console.error('[Server Error]', err);
  }
  process.exit(1);
});


