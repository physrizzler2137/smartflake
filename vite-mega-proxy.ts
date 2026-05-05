import { File } from 'megajs';
import type { Plugin } from 'vite';

/**
 * Vite plugin that acts as a local mega.nz proxy.
 * Replaces the dead `mega.wldbs.workers.dev` Cloudflare Worker.
 * 
 * Handles requests to `/api/mega/download?url=<base64-encoded-mega-url>`
 * Decrypts and streams mega.nz files back to the browser.
 */
export function megaProxyPlugin(): Plugin {
  // In-memory cache to avoid re-downloading the same file
  const cache = new Map<string, { data: Buffer; contentType: string }>();

  return {
    name: 'mega-proxy',
    configureServer(server) {
      server.middlewares.use('/api/mega/download', async (req, res) => {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const encodedUrl = url.searchParams.get('url');

          if (!encodedUrl) {
            res.statusCode = 400;
            res.end('Missing ?url= parameter');
            return;
          }

          const megaUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');

          if (!megaUrl.includes('mega.nz')) {
            res.statusCode = 400;
            res.end('Invalid mega.nz URL');
            return;
          }

          // Check cache first
          if (cache.has(megaUrl)) {
            const cached = cache.get(megaUrl)!;
            res.setHeader('Content-Type', cached.contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(cached.data);
            return;
          }

          console.log(`[mega-proxy] Downloading: ${megaUrl}`);

          const file = File.fromURL(megaUrl);
          await file.loadAttributes();

          const downloadStream = file.download({});
          const chunks: Buffer[] = [];

          downloadStream.on('data', (chunk: Buffer) => {
            chunks.push(Buffer.from(chunk));
          });

          await new Promise<void>((resolve, reject) => {
            downloadStream.on('end', resolve);
            downloadStream.on('error', reject);
          });

          const data = Buffer.concat(chunks);

          // Guess content type from filename
          const name = (file as any).name || '';
          let contentType = 'application/octet-stream';
          if (name.match(/\.(jpg|jpeg)$/i)) contentType = 'image/jpeg';
          else if (name.match(/\.png$/i)) contentType = 'image/png';
          else if (name.match(/\.gif$/i)) contentType = 'image/gif';
          else if (name.match(/\.webp$/i)) contentType = 'image/webp';
          else if (name.match(/\.svg$/i)) contentType = 'image/svg+xml';
          else if (name.match(/\.mp4$/i)) contentType = 'video/mp4';
          else if (name.match(/\.pdf$/i)) contentType = 'application/pdf';

          // Cache for future requests
          cache.set(megaUrl, { data, contentType });

          console.log(`[mega-proxy] Served: ${name} (${(data.length / 1024).toFixed(1)} KB)`);

          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Length', data.length.toString());
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 200;
          res.end(data);
        } catch (err: any) {
          console.error('[mega-proxy] Error:', err.message);
          res.statusCode = 500;
          res.end(`Mega proxy error: ${err.message}`);
        }
      });
    },
  };
}
