export function generateMegaProxyUrl(megaUrl: string): string {
  if (!megaUrl) {
    return '';
  }
  // Use btoa for Base64 encoding on the client-side.
  const encodedUrl = btoa(megaUrl);
  return `https://mega.wldbs.workers.dev/download?url=${encodedUrl}`;
}
