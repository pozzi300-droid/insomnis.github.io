import { getServerPort } from './src/server/env';
import express from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes';

async function startServer() {
  const app = express();
  const PORT = getServerPort();
  const HOST = '0.0.0.0';

  app.set('trust proxy', true);
  app.use(compression());

  // CORS & Security Headers allowing insomnis.fun and any authorized client
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Crypto-Pay-API-Signature, X-Requested-With');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // Mount backend API routes FIRST
  app.use('/api', apiRouter);

  // Development: Vite middleware with allowedHosts enabled
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: ['insomnis.fun', '.insomnis.fun', 'localhost', '127.0.0.1'],
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static built files
    const distPath = path.join(process.cwd(), 'dist');
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
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.get('*', (_req, res) => {
        res.status(200).send(`
          <!DOCTYPE html>
          <html lang="ru">
            <head>
              <meta charset="utf-8" />
              <title>Insomnis</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <style>
                body { background: #000000; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
                .card { background: #07090e; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px; max-width: 500px; width: 100%; text-align: center; }
                h1 { font-size: 22px; margin-top: 0; color: #38bdf8; }
                p { color: #94a3b8; font-size: 15px; line-height: 1.5; }
                code { background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 6px; color: #7dd3fc; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Сервер Insomnis</h1>
                <p>Выполните сборку проекта:</p>
                <p><code>npm run build</code></p>
              </div>
            </body>
          </html>
        `);
      });
    }
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Insomnis] Server running on http://${HOST}:${PORT} (port resolved from SERVER_PORT/PORT/env)`);
  });
}

startServer();
