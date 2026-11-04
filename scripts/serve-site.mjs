import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeBase } from './build-site.mjs';

const root = process.env.SITE_OUTPUT_DIR ? path.resolve(process.env.SITE_OUTPUT_DIR) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.site-dist');
const basePath = normalizeBase(process.env.SITE_BASE_PATH || '/Notes/');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === basePath.slice(0, -1)) { response.writeHead(302, { location: basePath }); response.end(); return; }
    if (!url.pathname.startsWith(basePath)) throw new Error('Outside base path');
    const relative = decodeURIComponent(url.pathname.slice(basePath.length)) || 'index.html';
    const filename = path.resolve(root, relative);
    const actual = await fs.realpath(filename);
    const location = path.relative(root, actual);
    if (location.startsWith('..') || path.isAbsolute(location) || !(await fs.stat(actual)).isFile()) throw new Error('Invalid path');
    const content = await fs.readFile(actual);
    response.writeHead(200, { 'Content-Type': types[path.extname(actual)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Notes preview: http://127.0.0.1:${port}${basePath}#/`));
