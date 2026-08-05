// Mock JWT implementation for frontend-only auth demonstration

interface JWTPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
  const padded = str + '==='.slice((str.length + 3) % 4);
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
}

export function createMockJWT(username: string, expiresInSeconds: number = 300): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: '1',
      username,
      iat: now,
      exp: now + expiresInSeconds,
    })
  );
  // Mock signature
  const signature = base64UrlEncode(`mock-signature-${username}-${now}`);
  return `${header}.${payload}.${signature}`;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JWTPayload;
    return payload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export function getTimeUntilExpiry(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) return 0;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}
