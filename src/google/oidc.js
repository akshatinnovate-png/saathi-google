import { createRemoteJWKSet, jwtVerify } from 'jose';

const GOOGLE_JWKS = 'https://www.googleapis.com/oauth2/v3/certs';

export function createOidcVerifier({ audience, serviceAccount, jwks = null }) {
  const keys = jwks ?? createRemoteJWKSet(new URL(GOOGLE_JWKS));
  return async function verify(authorization) {
    const token = String(authorization ?? '').replace(/^Bearer\s+/i, '');
    if (!token || !audience || !serviceAccount) return false;
    try {
      const { payload } = await jwtVerify(token, keys, { issuer: ['https://accounts.google.com', 'accounts.google.com'], audience });
      return payload.email === serviceAccount && payload.email_verified === true;
    } catch {
      return false;
    }
  };
}
