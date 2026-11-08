import { timingSafeEqual } from 'node:crypto';
import { InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { ALL_SCOPES, SCOPES } from './scopes.js';
import { DEFAULT_HOUSEHOLD } from '../households/scope.js';

export function createVerifier(auth) {
  switch (auth.mode) {
    case 'none':
      return null;
    case 'static':
      return createStaticVerifier(auth);
    default:
      throw new Error(`Unknown auth mode ${auth.mode}`);
  }
}

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function createStaticVerifier({ elderToken, familyToken }) {
  const entries = [
    elderToken && { token: elderToken, clientId: 'elder-device', scopes: ALL_SCOPES },
    familyToken && { token: familyToken, clientId: 'family-device', scopes: [SCOPES.family] },
  ].filter(Boolean);
  return {
    async verifyAccessToken(token) {
      const match = entries.find((e) => safeEqual(token, e.token));
      if (!match) throw new InvalidTokenError('Unknown token');
      return { token, clientId: match.clientId, scopes: match.scopes, expiresAt: Math.floor(Date.now() / 1000) + 3600 };
    },
  };
}

export function createHouseholdVerifier({ base, accounts }) {
  return {
    async verifyAccessToken(token) {
      const device = await accounts?.verifyDeviceToken(token);
      if (device) {
        return {
          token, clientId: `device:${device.label}`, scopes: device.scopes,
          expiresAt: Math.floor(Date.now() / 1000) + 3600, extra: { householdId: device.householdId, internal: Boolean(device.internal), label: device.label },
        };
      }
      if (!base) throw new InvalidTokenError('Unknown token');
      const info = await base.verifyAccessToken(token);
      let householdId = DEFAULT_HOUSEHOLD;
      if (info.extra?.username && accounts) {
        const account = await accounts.bySub(info.extra.sub);
        if (account?.householdId) householdId = account.householdId;
      }
      return { ...info, extra: { ...info.extra, householdId } };
    },
  };
}
