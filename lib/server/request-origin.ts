// NextURL normaliza las direcciones de loopback a localhost. Host conserva
// el destino solicitado por el navegador; no se confía en X-Forwarded-Host.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host');
    const target = host ? new URL(`${url.protocol}//${host}`) : url;
    if (target.username || target.password || (host && (target.pathname !== '/' || target.search || target.hash))) return false;
    return origin === target.origin;
  } catch { return false; }
}
