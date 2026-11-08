import express from 'express';
import { rateLimit } from 'express-rate-limit';

const STAGES = ['family-notified', 'neighbour-notified', 'emergency-guidance-sent', 'resolved'];
const AUDIENCES = ['family', 'neighbour', 'everyone'];
const SEVERITIES = ['info', 'high', 'critical'];
const ALERTS_KEY = /^(alerts|hh#[a-z0-9-]{1,64}#alerts)$/;

export function mountInternal(app, { verify, store, notifier, bus }) {
  const r = express.Router();
  r.use(rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
  r.use(async (req, res, next) => {
    if (!(await verify(req.get('authorization')))) return res.status(401).json({ error: 'Not allowed.' });
    next();
  });
  r.post('/escalation', async (req, res, next) => {
    try {
      const b = req.body ?? {};
      if (b.op === 'notify') {
        if (!AUDIENCES.includes(b.audience) || !SEVERITIES.includes(b.severity) || typeof b.householdId !== 'string') return res.status(400).json({ error: 'Bad notify.' });
        const id = await notifier.notify({ householdId: b.householdId, audience: b.audience, severity: b.severity, subject: String(b.subject ?? '').slice(0, 200), message: String(b.message ?? '').slice(0, 2000) });
        return res.json({ id });
      }
      if (!ALERTS_KEY.test(String(b.alertsKey)) || typeof b.alertId !== 'string') return res.status(400).json({ error: 'Bad alert.' });
      if (b.op === 'ack') {
        const alert = await store.get(b.alertsKey, b.alertId);
        return res.json({ acknowledged: Boolean(alert?.acknowledged), stage: alert?.escalationStage ?? null });
      }
      if (b.op === 'stage' && STAGES.includes(b.stage)) {
        await store.update(b.alertsKey, b.alertId, { escalationStage: b.stage });
        const householdId = b.alertsKey === 'alerts' ? 'default' : b.alertsKey.split('#')[1];
        await bus.publish(b.stage === 'resolved' || b.stage === 'emergency-guidance-sent' ? 'EscalationFinished' : 'EscalationStep', { householdId, alertId: b.alertId, state: b.stage, status: b.stage === 'resolved' ? 'SUCCEEDED' : undefined });
        return res.json({ ok: true });
      }
      res.status(400).json({ error: 'Unknown step.' });
    } catch (err) { next(err); }
  });
  app.use('/internal', r);
}
