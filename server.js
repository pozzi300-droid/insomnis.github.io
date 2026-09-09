import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
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

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// 1. AUTO-BUILD STEP: If dist or index.html is missing, run build automatically!
if (!fs.existsSync(indexPath)) {
  console.log('[AUTO-BUILD] dist/index.html is missing!');
  console.log('[AUTO-BUILD] Attempting automatic build via "npm run build" or "npx vite build"...');
  try {
    const buildOutput = execSync('npm run build', {
      cwd: __dirname,
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 120000,
    });
    console.log('[AUTO-BUILD SUCCESS]');
    console.log(buildOutput);
  } catch (err) {
    console.warn('[AUTO-BUILD WARNING] "npm run build" failed, trying "npx vite build"...', err.message);
    try {
      const viteOutput = execSync('npx vite build', {
        cwd: __dirname,
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: 120000,
      });
      console.log('[AUTO-BUILD (VITE) SUCCESS]');
      console.log(viteOutput);
    } catch (vErr) {
      console.error('[AUTO-BUILD ERROR] Could not build automatically:', vErr.message);
    }
  }
}

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
// 2. Default target allocation 20042
// 3. Fallback to process.env.PORT
const rawPort = process.env.SERVER_PORT || 20042 || process.env.PORT;
const PORT = Number(rawPort);
const HOST = '0.0.0.0';

console.log(`[Diagnostic] Dist folder exists: ${fs.existsSync(distPath)}`);
console.log(`[Diagnostic] index.html exists: ${fs.existsSync(indexPath)}`);
if (fs.existsSync(distPath)) {
  console.log(`[Diagnostic] Dist contents: ${fs.readdirSync(distPath).join(', ')}`);
}

// Serve static assets from dist if available
if (fs.existsSync(distPath)) {
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
}

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

// Quick root test endpoint
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
    console.log(`[HTTP SERVE] Serving index.html for URL: ${req.url}`);
    res.sendFile(indexPath);
  } else {
    console.error('[ERROR] dist/index.html still missing when accessing:', req.url);
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="utf-8" />
          <title>Insomnis - Подготовка файлов</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; max-width: 540px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h1 { font-size: 24px; margin-top: 0; color: #38bdf8; }
            p { color: #94a3b8; line-height: 1.6; }
            code { background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #f43f5e; font-size: 14px; }
            .btn { display: inline-block; margin-top: 16px; background: #0284c7; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Сервер работает! 🚀</h1>
            <p>Node.js успешно принимает запросы на порту <b>${PORT}</b>.</p>
            <p>Папка <code>dist/</code> еще не собрана. Выполните в панели хостинга:</p>
            <p><code>npm run build</code></p>
            <p>После сборки обновите эту страницу.</p>
          </div>
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

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server Error] Port ${PORT} is ALREADY IN USE! Another process or zombie node is holding it.`);
  } else {
    console.error('[Server Error]', err);
  }
  process.exit(1);
});


