import { googleJson } from './auth.js';

export function createFcm({ auth, projectId, fetchImpl = fetch } = {}) {
  if (!auth || !projectId) return null;
  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
  return {
    kind: 'firebase-cloud-messaging',
    async send(token, { title, body, link = '/', tag = null, urgent = false }) {
      try {
        await googleJson(fetchImpl, auth, url, {
          body: {
            message: {
              token,
              notification: { title: String(title).slice(0, 120), body: String(body).slice(0, 400) },
              webpush: { headers: { Urgency: urgent ? 'high' : 'normal', TTL: urgent ? '3600' : '86400' }, fcm_options: { link }, notification: { ...(tag ? { tag } : {}), requireInteraction: urgent } },
              android: { priority: urgent ? 'HIGH' : 'NORMAL' },
            },
          },
        });
        return { ok: true };
      } catch (err) {
        if (err.status === 404 || /UNREGISTERED|registration-token-not-registered/i.test(err.message)) return { ok: false, gone: true };
        return { ok: false, error: err.message };
      }
    },
  };
}
