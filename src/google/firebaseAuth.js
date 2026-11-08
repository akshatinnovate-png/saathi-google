import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AuthError } from '../accounts/errors.js';

const IDT = 'https://identitytoolkit.googleapis.com/v1';
const JWKS = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const FIREBASE_ERRORS = {
  EMAIL_EXISTS: ['exists', 'An account with this email already exists. Try logging in.'],
  EMAIL_NOT_FOUND: ['credentials', 'That email and password do not match.'],
  INVALID_PASSWORD: ['credentials', 'That email and password do not match.'],
  INVALID_LOGIN_CREDENTIALS: ['credentials', 'That email and password do not match.'],
  USER_DISABLED: ['credentials', 'This account is switched off. Ask the household owner for help.'],
  WEAK_PASSWORD: ['password', 'Use at least 10 characters, with letters and a number.'],
  TOO_MANY_ATTEMPTS_TRY_LATER: ['limit', 'Too many attempts. Please wait a few minutes.'],
  OPERATION_NOT_ALLOWED: ['credentials', 'Email sign-in is not switched on in Firebase Authentication.'],
};

export function firebaseError(message) {
  const key = String(message ?? '').split(/[\s:]/)[0];
  const known = FIREBASE_ERRORS[key];
  return known ? new AuthError(known[0], known[1]) : new Error(`Firebase Authentication: ${message}`);
}

export function createFirebaseAuth({ apiKey, projectId, publicUrl = null, fetchImpl = fetch, jwks = null }) {
  const keys = jwks ?? createRemoteJWKSet(new URL(JWKS));
  const issuer = `https://securetoken.google.com/${projectId}`;

  async function call(path, body) {
    const res = await fetchImpl(`${IDT}/${path}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw firebaseError(json.error?.message ?? res.status);
    return json;
  }

  async function verifyIdToken(idToken) {
    const { payload } = await jwtVerify(idToken, keys, { issuer, audience: projectId });
    return { sub: payload.sub, email: String(payload.email ?? '').toLowerCase(), name: payload.name ?? null, emailVerified: payload.email_verified === true };
  }

  return {
    kind: 'firebase',
    verifyIdToken,
    async signUp({ email, password, name }) {
      const out = await call('accounts:signUp', { email, password, returnSecureToken: true });
      if (name) await call('accounts:update', { idToken: out.idToken, displayName: name, returnSecureToken: false }).catch(() => {});
      await call('accounts:sendOobCode', { requestType: 'VERIFY_EMAIL', idToken: out.idToken, ...(publicUrl ? { continueUrl: `${publicUrl}/login.html` } : {}) }).catch(() => {});
      const identity = await verifyIdToken(out.idToken);
      return { ...identity, name: name ?? identity.name };
    },
    async login({ email, password }) {
      const out = await call('accounts:signInWithPassword', { email, password, returnSecureToken: true });
      return verifyIdToken(out.idToken);
    },
    async sendPasswordReset(email) {
      await call('accounts:sendOobCode', { requestType: 'PASSWORD_RESET', email, ...(publicUrl ? { continueUrl: `${publicUrl}/login.html` } : {}) });
    },
  };
}
