import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Parses raw .env content into key-value pairs without external dependency issues
 */
function parseEnvContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    const equalsIdx = line.indexOf('=');
    if (equalsIdx <= 0) continue;

    const key = line.slice(0, equalsIdx).trim();
    let value = line.slice(equalsIdx + 1).trim();

    // Remove wrapping quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Loads environment variables from .env.local, .env, .env.production, .env.example
 * Prioritizes actual .env over .env.example
 */
export function loadEnvironment(): void {
  const searchDirs: string[] = [process.cwd()];

  try {
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
    searchDirs.push(currentDir);
    searchDirs.push(path.resolve(currentDir, '..'));
    searchDirs.push(path.resolve(currentDir, '..', '..'));
  } catch {
    // ignore
  }

  const uniqueDirs = Array.from(new Set(searchDirs));

  const envFileNames = [
    '.env.local',
    '.env.development.local',
    '.env.production.local',
    '.env',
    '.env.production',
    '.env.development',
    '.env.example',
  ];

  const loadedFiles: string[] = [];

  for (const dir of uniqueDirs) {
    for (const fileName of envFileNames) {
      const fullPath = path.join(dir, fileName);
      if (fs.existsSync(fullPath) && !loadedFiles.includes(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const parsed = parseEnvContent(content);
          for (const [k, v] of Object.entries(parsed)) {
            // Set if not defined in process.env or empty
            if (process.env[k] === undefined || process.env[k] === '') {
              process.env[k] = v;
            }
          }
          loadedFiles.push(fullPath);
        } catch (err) {
          console.warn(`[Env] Failed to read ${fullPath}:`, err);
        }
      }
    }
  }

  if (loadedFiles.length > 0) {
    console.log(`[Env] Loaded environment from: ${loadedFiles.map((f) => path.basename(f)).join(', ')}`);
  }
}

/**
 * Resolves the server port with SERVER_PORT taking top priority over PORT
 */
export function getServerPort(): number {
  loadEnvironment();

  // 1. Explicit SERVER_PORT
  const serverPortRaw =
    process.env.SERVER_PORT ||
    process.env.server_port ||
    process.env.SERVERPORT ||
    process.env.ServerPort;

  if (serverPortRaw && String(serverPortRaw).trim() !== '') {
    const parsed = parseInt(String(serverPortRaw).trim(), 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  // 2. Generic PORT
  const portRaw = process.env.PORT || process.env.port;
  if (portRaw && String(portRaw).trim() !== '') {
    const parsed = parseInt(String(portRaw).trim(), 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 3000;
}

// Immediately load upon import
loadEnvironment();
