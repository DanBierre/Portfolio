// Lighthouse budgets for every page (spec §8). Usage: npm run build && node scripts/lighthouse.mjs
// Launches Chromium through Playwright (chrome-launcher can't spawn Chrome in some sandboxes)
// and serves dist/ gzip-compressed like production.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const DIST = path.resolve('dist');
const PAGES = ['/', '/ja', '/work/shoji', '/work/case-study-one', '/lab', '/lab/enso', '/lab/kanji'];
const MIN_SCORE = 0.95;
const MAX_LCP_MS = 2000;
const MAX_BYTES = 1_000_000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = [url, `${url}.html`, path.join(url, 'index.html')].map((p) => path.join(DIST, p))
    .find((p) => p.startsWith(DIST) && fs.existsSync(p) && fs.statSync(p).isFile());
  if (!file) return res.writeHead(404).end();
  const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
  const body = fs.readFileSync(file);
  const compressible = /text|javascript|svg|xml/.test(type);
  res.writeHead(200, { 'content-type': type, 'cache-control': 'public, max-age=31536000', ...(compressible && { 'content-encoding': 'gzip' }) });
  res.end(compressible ? zlib.gzipSync(body) : body);
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ args: ['--remote-debugging-port=9333'] });
let failed = false;
for (const p of PAGES) {
  const { lhr } = await lighthouse(`${origin}${p}`, { port: 9333, output: 'json', logLevel: 'error' });
  const scores = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, v.score]));
  const lcp = lhr.audits['largest-contentful-paint'].numericValue;
  const bytes = lhr.audits['total-byte-weight'].numericValue;
  const problems = [
    ...Object.entries(scores).filter(([, s]) => s < MIN_SCORE).map(([k, s]) => `${k} ${s}`),
    ...(lcp > MAX_LCP_MS ? [`LCP ${Math.round(lcp)}ms`] : []),
    ...(bytes > MAX_BYTES ? [`weight ${Math.round(bytes / 1024)}KB`] : []),
  ];
  failed ||= problems.length > 0;
  console.log(`${problems.length ? 'FAIL' : 'PASS'} ${p}  ${JSON.stringify(scores)}  LCP ${Math.round(lcp)}ms  ${Math.round(bytes / 1024)}KB  ${problems.join(', ')}`);
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
