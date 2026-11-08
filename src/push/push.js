import { createHash } from 'node:crypto';

const hash = (s) => createHash('sha256').update(String(s)).digest('hex');
const AUDIENCES_FOR = { owner: ['family', 'everyone'], family: ['family', 'everyone'], member: ['family', 'everyone'], neighbour: ['neighbour', 'everyone'] };

export function createPush({ store, fcm, clock = () => new Date() }) {
  const enabled = Boolean(fcm);

  async function deliver(rows, message) {
    let sent = 0;
    for (const row of rows) {
      const out = await fcm.send(row.token, message);
      if (out.ok) sent += 1;
      else if (out.gone) await store.remove('pushTokens', row.id);
    }
    return sent;
  }

  return {
    enabled,
    async register({ token, householdId = null, memberId = null, role = null, didiId = null }) {
      if (!enabled) throw Object.assign(new Error('Notifications are not set up on this Saathi.'), { status: 400 });
      if (typeof token !== 'string' || token.length < 20 || token.length > 4096) throw Object.assign(new Error('That notification token is not valid.'), { status: 400 });
      const row = { id: hash(token), token, householdId, memberId, didiId, audiences: didiId ? ['didi'] : AUDIENCES_FOR[role] ?? ['family', 'everyone'], createdAt: clock().toISOString() };
      await store.put('pushTokens', row);
      return { ok: true };
    },
    async unregister(token) {
      if (typeof token === 'string') await store.remove('pushTokens', hash(token));
      return { ok: true };
    },
    async toHousehold(n) {
      if (!enabled || !n?.householdId) return 0;
      const rows = (await store.list('pushTokens')).filter((r) => r.householdId === n.householdId && r.audiences.includes(n.audience ?? 'family') && (!n.recipientId || !r.memberId || r.memberId === n.recipientId));
      return deliver(rows, { title: n.subject, body: n.message, link: '/family.html', tag: n.alertId ?? null, urgent: ['critical', 'high'].includes(n.severity) });
    },
    async toDidis(didiIds, message) {
      if (!enabled || !didiIds.length) return 0;
      const rows = (await store.list('pushTokens')).filter((r) => r.didiId && didiIds.includes(r.didiId));
      return deliver(rows, { link: '/didi.html', ...message });
    },
  };
}
