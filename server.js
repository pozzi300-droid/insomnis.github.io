import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Automatically build the project if dist/index.html is missing
if (!fs.existsSync(indexPath)) {
  console.log('📦 Папка сборки dist не найдена. Запуск автоматической сборки (npm run build)...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Сборка успешно завершена!');
  } catch (err) {
    console.error('❌ Ошибка сборки проекта:', err);
  }
}

// Serve static assets from dist
app.use(
  express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      // Don't cache HTML files to ensure immediate updates
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// SPA fallback: return index.html for all non-asset routes
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Ошибка: index.html не найден. Пожалуйста, выполните команду `npm run build`.');
  }
});

// Start listening
app.listen(PORT, HOST, () => {
  console.log(`🚀 Сервер сайта Insomnis успешно запущен!`);
  console.log(`🌐 Локальный адрес: http://localhost:${PORT}`);
  console.log(`📁 Обслуживаемая папка: ${distPath}`);
});
