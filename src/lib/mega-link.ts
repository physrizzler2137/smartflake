export function generateMegaProxyUrl(megaUrl: string): string {
  if (!megaUrl) {
    return '';
  }
  // Use btoa for Base64 encoding on the client-side.
  const encodedUrl = btoa(megaUrl);
  // Local Vite dev server proxy (replaces the dead mega.wldbs.workers.dev worker)
  return `/api/mega/download?url=${encodedUrl}`;
}
