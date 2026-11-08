import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, exportJWK, SignJWT, createLocalJWKSet } from 'jose';
import { createApp } from '../src/http/app.js';
import { createAlexaSimulator } from '../src/agent/alexaSimulator.js';
import { createStaticVerifier } from '../src/auth/verifier.js';
import { createSpeechToText } from '../src/google/speech.js';
import { createLiveTokens, LIVE_SOCKET } from '../src/google/live.js';
import { createFcm } from '../src/google/fcm.js';
import { createWorkflowsEscalation } from '../src/google/workflows.js';
import { createGeminiImage } from '../src/google/image.js';
import { createOidcVerifier } from '../src/google/oidc.js';
import { createPush } from '../src/push/push.js';
import { createImpact } from '../src/domain/impact.js';
import { createDidis, LESSONS, cardSvg, VISIT_MINUTES } from '../src/didis/didis.js';
import { contentSecurityPolicy } from '../src/security/headers.js';
import { testServices, testConfig, fixedClock } from './helpers.js';

const fakeAuth = { headers: async () => ({ authorization: 'Bearer t' }) };
const recorder = (respond) => {
  const sent = [];
  const fetchImpl = async (url, init) => {
    const body = init.body ? JSON.parse(init.body) : null;
    sent.push({ url, body, headers: init.headers });
    const out = await respond(url, body);
    return { ok: (out.status ?? 200) < 400, status: out.status ?? 200, statusText: 'x', json: async () => out.json ?? out };
  };
  return { sent, fetchImpl };
};
const sunita = { name: 'Sunita Pawar', phone: '+91 98220 11111', city: 'Pune', area: 'Kothrud', languages: ['mr', 'hi'], skills: ['escort', 'visit'], rates: { escort: 400, visit: 250 }, upiId: 'sunita@okaxis', partnerCode: 'SEWA-PUNE', safetyContact: { name: 'Lata (SHG)', phone: '9822099999' } };
const readyDidi = async (didis, input) => {
  const { didi, token } = await didis.signUp(input);
  for (const l of LESSONS) await didis.answerLesson(await didis.byToken(token), l.id, l.answer);
  return { didi, token, me: await didis.byToken(token) };
};

test('Speech-to-Text transcribes a Marathi voice note and refuses bad audio', async () => {
  const r = recorder((url, body) => ({ results: [{ alternatives: [{ transcript: 'आजींनी जेवण केलं' }], languageCode: 'mr-in' }, { alternatives: [{ transcript: ' गोळी घेतली ' }] }], echo: body }));
  const stt = createSpeechToText({ auth: fakeAuth, fetchImpl: r.fetchImpl });
  const out = await stt.transcribe(Buffer.from('opus'), { language: 'mr', contentType: 'audio/webm;codecs=opus' });
  assert.deepEqual(out, { text: 'आजींनी जेवण केलं गोळी घेतली', language: 'mr' });
  assert.equal(r.sent[0].url, 'https://speech.googleapis.com/v1/speech:recognize');
  assert.deepEqual([r.sent[0].body.config.encoding, r.sent[0].body.config.languageCode], ['WEBM_OPUS', 'mr-IN']);
  assert.ok(!r.sent[0].body.config.alternativeLanguageCodes.includes('mr-IN'));
  assert.equal((await stt.transcribe(Buffer.from('x'), { language: 'zz', contentType: 'audio/ogg' })).language, 'mr');
  await assert.rejects(stt.transcribe(Buffer.from('x'), { contentType: 'audio/wav' }), /format/);
  await assert.rejects(stt.transcribe(Buffer.alloc(0)), /one minute/);
  const empty = createSpeechToText({ auth: fakeAuth, fetchImpl: recorder(() => ({})).fetchImpl });
  assert.deepEqual(await empty.transcribe(Buffer.from('x'), { language: 'hi' }), { text: '', language: 'hi' });
});

test('Gemini Live tokens are short-lived, single-use and never expose the API key', async () => {
  assert.equal(createLiveTokens({}), null);
  const r = recorder(() => ({ name: 'auth_tokens/abc' }));
  const live = createLiveTokens({ apiKey: 'secret-key', fetchImpl: r.fetchImpl, clock: () => Date.parse('2026-11-08T00:00:00Z') });
  const out = await live.mint();
  assert.deepEqual(out, { token: 'auth_tokens/abc', model: 'models/gemini-live-2.5-flash-preview', socket: LIVE_SOCKET, expiresAt: '2026-11-08T00:30:00.000Z' });
  assert.equal(r.sent[0].headers['x-goog-api-key'], 'secret-key');
  assert.equal(r.sent[0].body.uses, 1);
  assert.ok(!JSON.stringify(out).includes('secret-key'));
  const down = createLiveTokens({ apiKey: 'k', fetchImpl: recorder(() => ({ status: 403, json: { error: { message: 'denied' } } })).fetchImpl });
  await assert.rejects(down.mint(), (e) => e.status === 503 && /denied/.test(e.message));
});

test('Firebase Cloud Messaging, Cloud Workflows and Gemini images speak their REST APIs', async () => {
  assert.equal(createFcm({}), null);
  let reply = {};
  const f = recorder(() => reply);
  const fcm = createFcm({ auth: fakeAuth, projectId: 'proj', fetchImpl: f.fetchImpl });
  assert.deepEqual(await fcm.send('tok', { title: 'Help', body: 'Aaji asked for help', urgent: true, tag: 'a1' }), { ok: true });
  assert.equal(f.sent[0].url, 'https://fcm.googleapis.com/v1/projects/proj/messages:send');
  assert.deepEqual([f.sent[0].body.message.token, f.sent[0].body.message.webpush.headers.Urgency, f.sent[0].body.message.android.priority], ['tok', 'high', 'HIGH']);
  reply = { status: 404, json: { error: { message: 'Requested entity was not found.' } } };
  assert.deepEqual(await fcm.send('old', { title: 'x', body: 'y' }), { ok: false, gone: true });
  reply = { status: 500, json: { error: { message: 'boom' } } };
  assert.equal((await fcm.send('t', { title: 'x', body: 'y' })).ok, false);

  const w = recorder(() => ({ name: 'projects/p/locations/asia-south1/workflows/saathi-escalation/executions/e1' }));
  const wf = createWorkflowsEscalation({ auth: fakeAuth, projectId: 'p', location: 'asia-south1', callbackUrl: 'https://saathi.example', fetchImpl: w.fetchImpl });
  assert.match(await wf.start({ alertId: 'a1', householdId: 'h1' }), /executions\/e1$/);
  assert.equal(w.sent[0].url, 'https://workflowexecutions.googleapis.com/v1/projects/p/locations/asia-south1/workflows/saathi-escalation/executions');
  assert.deepEqual(JSON.parse(w.sent[0].body.argument), { alertId: 'a1', householdId: 'h1', callbackUrl: 'https://saathi.example' });

  assert.equal(createGeminiImage({}), null);
  let img = { candidates: [{ content: { parts: [{ text: 'here' }, { inlineData: { data: Buffer.from('PNG').toString('base64'), mimeType: 'image/png' } }] } }] };
  const g = recorder(() => img);
  const images = createGeminiImage({ apiKey: 'k', fetchImpl: g.fetchImpl });
  const out = await images.generate('a card');
  assert.deepEqual([out.data.toString(), out.contentType], ['PNG', 'image/png']);
  assert.deepEqual(g.sent[0].body.generationConfig.responseModalities, ['IMAGE']);
  img = { candidates: [] };
  assert.equal(await images.generate('x'), null);
  img = { status: 429, json: { error: { message: 'quota' } } };
  await assert.rejects(images.generate('x'), /quota/);
});

test('Workflows callbacks need a Google-signed token from Saathi\'s own service account', async () => {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwks = createLocalJWKSet({ keys: [{ ...(await exportJWK(publicKey)), kid: 'k', alg: 'RS256' }] });
  const verify = createOidcVerifier({ audience: 'https://saathi.example', serviceAccount: 'saathi-runner@p.iam.gserviceaccount.com', jwks });
  const mint = (claims, aud = 'https://saathi.example') => new SignJWT({ email: 'saathi-runner@p.iam.gserviceaccount.com', email_verified: true, ...claims })
    .setProtectedHeader({ alg: 'RS256', kid: 'k' }).setIssuer('https://accounts.google.com').setAudience(aud).setExpirationTime('5m').sign(privateKey);
  assert.equal(await verify(`Bearer ${await mint({})}`), true);
  assert.equal(await verify(`Bearer ${await mint({ email: 'someone@else.com' })}`), false);
  assert.equal(await verify(`Bearer ${await mint({}, 'https://other.example')}`), false);
  assert.equal(await verify(''), false);
  assert.equal(await createOidcVerifier({ audience: null, serviceAccount: 'x', jwks })(`Bearer ${await mint({})}`), false);
});

test('push notifications reach the right family members and Didis, and forget dead phones', async () => {
  const services = testServices();
  assert.equal(createPush({ store: services.store }).enabled, false);
  await assert.rejects(createPush({ store: services.store }).register({ token: 'x'.repeat(30) }), /not set up/);
  const sent = [];
  const fcm = { send: async (token, msg) => { sent.push({ token, msg }); return token.startsWith('dead') ? { ok: false, gone: true } : { ok: true }; } };
  const push = createPush({ store: services.store, fcm, clock: fixedClock });
  await assert.rejects(push.register({ token: 'short' }), /not valid/);
  await push.register({ token: `riya-${'x'.repeat(30)}`, householdId: 'default', memberId: 'riya', role: 'family' });
  await push.register({ token: `meera-${'x'.repeat(30)}`, householdId: 'default', memberId: 'meera', role: 'neighbour' });
  await push.register({ token: `dead-${'x'.repeat(30)}`, householdId: 'default', memberId: 'anand', role: 'owner' });
  await push.register({ token: `didi-${'x'.repeat(30)}`, didiId: 'didi-1' });
  assert.equal(await push.toHousehold({ householdId: 'default', audience: 'family', severity: 'high', subject: 'Help', message: 'Aaji', recipientId: 'riya' }), 1);
  assert.equal(sent[0].msg.urgent, true);
  assert.equal(await push.toHousehold({ householdId: 'default', audience: 'everyone', severity: 'critical', subject: 's', message: 'm' }), 2);
  assert.equal((await services.store.list('pushTokens')).some((r) => r.token.startsWith('dead')), false, 'a dead token is removed');
  assert.equal(await push.toHousehold({ householdId: 'default', audience: 'neighbour', subject: 's', message: 'm' }), 1);
  assert.equal(await push.toHousehold({}), 0);
  assert.equal(await push.toDidis(['didi-1'], { title: 'New request', body: 'x' }), 1);
  assert.equal(sent.at(-1).msg.link, '/didi.html');
  assert.equal(await push.toDidis([], {}), 0);
  await push.unregister(`riya-${'x'.repeat(30)}`);
  assert.equal(await push.toHousehold({ householdId: 'default', audience: 'family', subject: 's', message: 'm', recipientId: 'riya' }), 0);
});

test('Didi safety: SOS, overdue visits, rating families, blocking, phone sign-in and the profile card', async () => {
  const services = testServices();
  const notes = [];
  services.localBus.subscribe((e) => e['detail-type'] === 'NotificationSent' && notes.push(e.detail));
  const events = [];
  let now = fixedClock();
  const images = { generate: async () => { throw new Error('quota'); } };
  const didis = createDidis({ store: services.store, services, images, onEvent: async (type, p) => { events.push([type, p]); }, clock: () => now, partnerCodes: ['SEWA-PUNE'] });
  await assert.rejects(didis.signUp({ ...sunita, safetyContact: { phone: '12' } }), /safety contact/);
  const { me } = await readyDidi(didis, sunita);
  assert.deepEqual(me.safetyContact, { name: 'Lata (SHG)', phone: '9822099999' });
  assert.equal(me.phoneVerified, false);

  const b = await didis.book('default', { kind: 'escort', at: '2026-10-24T10:00', didiId: me.id }, 'riya');
  assert.deepEqual(events.at(-1)[1].didiIds, [me.id]);
  const open = await didis.book('default', { kind: 'visit', at: '2026-10-25T10:00' }, 'riya');
  assert.deepEqual(events.at(-1)[1].didiIds, [me.id], 'nearby ready Didis hear about open requests');
  await assert.rejects(didis.sos(me, b.id), /accepted visit/);
  await didis.accept(me, b.id);
  const sos = await didis.sos(me, b.id, { note: 'मला मदत हवी', language: 'mr' });
  assert.deepEqual(sos.call.map((c) => c.number), ['112', '9822099999']);
  const alert = notes.find((n) => /needs help/.test(n.subject));
  assert.equal(alert.severity, 'critical');
  assert.match(alert.message, /Lata \(SHG\) on 9822099999/);
  assert.equal(events.find(([t]) => t === 'sos')[1].bookingId, b.id);

  await didis.checkIn(me, b.id);
  assert.equal(await didis.sweepOverdue(), 0);
  now = new Date(fixedClock().getTime() + (VISIT_MINUTES.escort + 1) * 60_000);
  assert.equal(await didis.sweepOverdue(), 1);
  assert.ok(notes.some((n) => /has not finished the visit/.test(n.subject)));
  assert.deepEqual(events.at(-1)[0], 'overdue');
  assert.equal(await didis.sweepOverdue(), 0, 'told once');

  await assert.rejects(didis.rateFamily(me, b.id, { stars: 5 }), /after the visit/);
  await didis.checkOut(me, b.id, { note: 'All good' });
  await assert.rejects(didis.rateFamily(me, b.id, { stars: 0 }), /1 to 5/);
  assert.deepEqual(await didis.rateFamily(me, b.id, { stars: 2, note: 'Rude', block: true }), { rated: 2, blocked: true });
  await assert.rejects(didis.rateFamily(me, b.id, { stars: 3 }), /already rated/);
  const fresh = await services.store.get('didis', me.id);
  assert.deepEqual(fresh.blockedHouseholds, ['default']);
  assert.ok(!(await didis.offers(fresh)).some((o) => o.id === open.id), 'a blocked family\'s requests no longer reach her');
  const other = (await readyDidi(didis, { ...sunita, name: 'Asha', phone: '9822033333', safetyContact: null })).me;
  const offer = (await didis.offers(other)).find((o) => o.id === open.id);
  assert.deepEqual(offer.familyRating, { stars: 2, count: 1 });
  assert.deepEqual((await didis.sos(other, b.id).catch((e) => e.message)), 'That booking is not yours.');

  assert.equal((await didis.byPhone('+919822011111')).id, me.id);
  assert.equal((await didis.byPhone('98220 11111')).id, me.id);
  assert.equal(await didis.byPhone(''), null);
  const token = await didis.newToken(fresh);
  assert.equal((await didis.byToken(token)).phoneVerified, true);
  await assert.rejects(didis.updateSafety(fresh, { phone: '1' }), /safety contact/);
  assert.deepEqual(await didis.updateSafety(fresh, { name: '', phone: '' }), { safetyContact: null });

  const card = await didis.card(await services.store.get('didis', me.id));
  assert.equal(card.contentType, 'image/svg+xml');
  assert.match(card.data.toString(), /Sunita Pawar/);
  assert.match(card.data.toString(), /Verified/);
  assert.match(cardSvg({ name: '<b>', area: '', skills: '', languages: '', visits: 0 }), /&lt;b&gt;/);
  const withImages = createDidis({ store: services.store, services, images: { generate: async (prompt) => ({ data: Buffer.from(prompt), contentType: 'image/png' }) } });
  const png = await withImages.card(await services.store.get('didis', me.id));
  assert.equal(png.contentType, 'image/png');
  assert.match(png.data.toString(), /Speaks Marathi, Hindi/);
});

test('the impact numbers count care, safety and Didi earnings without personal details', async () => {
  const services = testServices();
  const didis = createDidis({ store: services.store, services, clock: fixedClock, partnerCodes: ['SEWA-PUNE'] });
  const { me } = await readyDidi(didis, sunita);
  const b = await didis.book('default', { kind: 'visit', at: '2026-10-24T10:00', didiId: me.id });
  await didis.accept(me, b.id);
  await didis.checkIn(me, b.id);
  await didis.checkOut(me, b.id, { note: 'ok' });
  await didis.markPaid('default', b.id);
  await didis.rate('default', b.id, { stars: 5 });
  await services.saathi.requestHelp({ reason: 'fell', urgency: 'critical' });
  const impact = createImpact({ services, store: services.store, includeDemo: true, clock: fixedClock });
  const out = await impact.get();
  assert.equal(out.elders, 1);
  assert.equal(out.safety.helpRequests, 1);
  assert.deepEqual([out.didis.visits, out.didis.earned, out.didis.paid, out.didis.rating, out.didis.verified], [1, 250, 250, 5, 1]);
  assert.deepEqual(out.didis.byMonth, [{ month: '2026-10', visits: 1, earned: 250 }]);
  assert.deepEqual(out.didis.thisMonth, { visits: 1, earned: 250 });
  assert.ok(!JSON.stringify(out).includes('Sunita'), 'no names');
  assert.equal(await impact.get(), out, 'cached');
  const real = await createImpact({ services, store: services.store, clock: fixedClock }).get();
  assert.deepEqual([real.elders, real.didis.visits], [0, 0], 'the demo family is left out of real numbers');
});

test('the strict page policy relaxes only for Google sign-in, notifications and Gemini Live pages', () => {
  const strict = contentSecurityPolicy({});
  assert.match(strict, /trusted-types saathi/);
  assert.match(strict, /connect-src 'self';/);
  const google = contentSecurityPolicy({ googleWeb: true });
  assert.doesNotMatch(google, /trusted-types/);
  assert.match(google, /wss:\/\/generativelanguage\.googleapis\.com/);
  assert.match(google, /script-src 'self' https:\/\/www\.gstatic\.com/);
});

let server;
let base;
let simulator;
let services;
let didisRef;
const pushed = [];
const ELDER = 'elder-token-extras';

before(async () => {
  services = testServices();
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwks = createLocalJWKSet({ keys: [{ ...(await exportJWK(publicKey)), kid: 'k', alg: 'RS256' }] });
  const idToken = (phone) => new SignJWT({ phone_number: phone }).setProtectedHeader({ alg: 'RS256', kid: 'k' }).setIssuer('https://securetoken.google.com/proj').setAudience('proj').setSubject('u1').setExpirationTime('5m').sign(privateKey);
  globalThis.mintPhoneToken = idToken;
  const firebase = { verifyIdToken: async (t) => { const { jwtVerify } = await import('jose'); const { payload } = await jwtVerify(t, jwks, { issuer: 'https://securetoken.google.com/proj', audience: 'proj' }); return { phone: payload.phone_number }; } };
  const push = createPush({ store: services.store, fcm: { send: async (token, msg) => { pushed.push({ token, msg }); return { ok: true }; } } });
  const didis = createDidis({ store: services.store, services, clock: fixedClock, partnerCodes: ['SEWA-PUNE'] });
  didisRef = didis;
  services.onNotify((n) => push.toHousehold(n));
  const stt = { transcribe: async (buf, { language }) => ({ text: `heard ${buf.length} bytes`, language }) };
  const live = { mint: async () => ({ token: 'auth_tokens/x', model: 'models/live', socket: LIVE_SOCKET, expiresAt: 'later' }) };
  const app = createApp({
    config: testConfig({ host: '127.0.0.1', web: { requireLogin: false } }), services, didis, push, stt, firebase, live,
    impact: createImpact({ services, store: services.store, includeDemo: true }),
    internalVerify: async (auth) => auth === 'Bearer good',
    webConfig: { firebase: { projectId: 'proj', apiKey: 'web' }, vapidKey: 'vapid' },
    verifier: createStaticVerifier({ elderToken: ELDER }),
    simulatorFor: async () => simulator,
  });
  await new Promise((resolve) => { server = app.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
  simulator = createAlexaSimulator({ mcpUrl: `${base}/mcp`, headers: { Authorization: `Bearer ${ELDER}` }, llm: null, translator: services.translator });
});

after(async () => {
  await simulator?.close();
  server?.close();
});

const call = async (method, path, body, headers = {}) => {
  const raw = Buffer.isBuffer(body);
  const res = await fetch(`${base}${path}`, { method, headers: { ...(raw ? {} : { 'content-type': 'application/json' }), ...headers }, body: body ? (raw ? body : JSON.stringify(body)) : undefined });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { }
  return { status: res.status, body: json, text, headers: res.headers, setCookie: res.headers.get('set-cookie') };
};

test('over HTTP: web config, impact, Gemini Live, push, Workflows callbacks and the Didi safety tools', async () => {
  const cfg = await call('GET', '/web-config');
  assert.deepEqual(cfg.body, { firebase: { projectId: 'proj', apiKey: 'web' }, vapidKey: 'vapid', push: true, live: true });
  assert.match(cfg.headers.get('content-security-policy'), /trusted-types/, 'API responses keep the strict policy');
  assert.match((await call('GET', '/didi.html')).headers.get('content-security-policy'), /gstatic/);
  assert.equal((await call('GET', '/impact-api')).body.elders, 1);
  assert.equal((await call('GET', '/impact.html')).status, 200);

  const session = await call('GET', '/api/live/session?language=mr');
  assert.equal(session.body.token, 'auth_tokens/x');
  assert.match(session.body.systemInstruction, /Marathi/);
  const names = session.body.tools[0].functionDeclarations.map((f) => f.name);
  assert.ok(names.includes('get_medication_schedule'));
  const tool = await call('POST', '/api/live/tool', { name: 'get_medication_schedule', args: { language: 'en' } });
  assert.equal(tool.body.isError, false);
  assert.match(tool.body.say, /\S/);
  assert.equal((await call('POST', '/api/live/tool', { name: 'nope' })).body.error, 'Unknown tool.');

  assert.equal((await call('POST', '/api/push/register', { token: 'short' })).status, 400);
  assert.equal((await call('POST', '/api/push/register', { token: `fam-${'x'.repeat(30)}` })).body.ok, true);

  assert.equal((await call('POST', '/internal/escalation', { op: 'ack', alertsKey: 'alerts', alertId: 'a' })).status, 401);
  const good = { authorization: 'Bearer good' };
  const help = await services.saathi.requestHelp({ reason: 'fell', urgency: 'critical' });
  assert.deepEqual((await call('POST', '/internal/escalation', { op: 'ack', alertsKey: 'alerts', alertId: help.alertId }, good)).body.acknowledged, false);
  assert.equal((await call('POST', '/internal/escalation', { op: 'stage', alertsKey: 'alerts', alertId: help.alertId, stage: 'neighbour-notified' }, good)).body.ok, true);
  assert.equal((await services.store.get('alerts', help.alertId)).escalationStage, 'neighbour-notified');
  assert.equal((await call('POST', '/internal/escalation', { op: 'stage', alertsKey: 'alerts', alertId: help.alertId, stage: 'resolved' }, good)).body.ok, true);
  assert.ok((await call('POST', '/internal/escalation', { op: 'notify', householdId: 'default', audience: 'family', severity: 'high', subject: 's', message: 'm' }, good)).body.id);
  assert.equal((await call('POST', '/internal/escalation', { op: 'notify', householdId: 'default', audience: 'everyone-else', severity: 'x' }, good)).status, 400);
  assert.equal((await call('POST', '/internal/escalation', { op: 'ack', alertsKey: 'users', alertId: 'a' }, good)).status, 400);
  assert.equal((await call('POST', '/internal/escalation', { op: 'stage', alertsKey: 'alerts', alertId: 'a', stage: 'hacked' }, good)).status, 400);

  const dcfg = await call('GET', '/didi-api/config');
  assert.deepEqual([dcfg.body.phoneSignIn, dcfg.body.voiceNotes, dcfg.body.push], [true, true, true]);
  assert.equal((await call('POST', '/didi-api/phone-login', { idToken: 'bad' })).status, 401);
  const newbie = await call('POST', '/didi-api/phone-login', { idToken: await globalThis.mintPhoneToken('+919822077777') });
  assert.deepEqual(newbie.body, { needsSignup: true, phone: '+919822077777' });
  const signed = await call('POST', '/didi-api/signup', { ...sunita, phone: '+919822077777', idToken: await globalThis.mintPhoneToken('+919822077777') });
  assert.equal(signed.status, 200);
  const didiCookie = { cookie: signed.setCookie.split(';')[0] };
  assert.equal((await call('GET', '/didi-api/me', null, didiCookie)).body.phoneVerified, true);
  const again = await call('POST', '/didi-api/phone-login', { idToken: await globalThis.mintPhoneToken('+919822077777') });
  assert.equal(again.body.name, 'Sunita Pawar');
  assert.match(again.setCookie, /saathi_didi=/);
  for (const l of LESSONS) await call('POST', `/didi-api/lessons/${l.id}`, { answer: l.answer }, didiCookie);
  assert.equal((await call('POST', '/didi-api/push', { token: `didi-${'y'.repeat(30)}` }, didiCookie)).body.ok, true);
  assert.equal((await call('PUT', '/didi-api/safety', { name: 'Lata', phone: '9822088888' }, didiCookie)).body.safetyContact.phone, '9822088888');
  const card = await call('GET', '/didi-api/card', null, didiCookie);
  assert.equal(card.headers.get('content-type'), 'image/svg+xml');

  const meId = (await call('GET', '/didi-api/me', null, didiCookie)).body.id;
  const booked = { body: await didisRef.book('default', { kind: 'visit', at: '2026-10-24T10:00', didiId: meId }, 'riya') };
  assert.equal((await call('POST', `/didi-api/bookings/${booked.body.id}/accept`, null, didiCookie)).body.status, 'accepted');
  assert.equal((await call('POST', `/didi-api/bookings/${booked.body.id}/voice-note`, Buffer.from('opus'), { ...didiCookie, 'content-type': 'audio/webm' })).status, 409);
  assert.equal((await call('POST', `/didi-api/bookings/${booked.body.id}/check-in`, null, didiCookie)).body.status, 'in-progress');
  const heard = await call('POST', `/didi-api/bookings/${booked.body.id}/voice-note?language=mr`, Buffer.from('opus-bytes'), { ...didiCookie, 'content-type': 'audio/webm' });
  assert.deepEqual(heard.body, { text: 'heard 10 bytes', language: 'mr' });
  const sos = await call('POST', `/didi-api/bookings/${booked.body.id}/sos`, { note: 'help' }, didiCookie);
  assert.deepEqual(sos.body.call.map((c) => c.number), ['112', '9822088888']);
  await new Promise((r) => setTimeout(r, 50));
  assert.ok(pushed.some((p) => p.token.startsWith('fam-') && p.msg.urgent), 'the family phone gets the SOS');
  await call('POST', `/didi-api/bookings/${booked.body.id}/check-out`, { note: heard.body.text }, didiCookie);
  assert.equal((await call('POST', `/didi-api/bookings/${booked.body.id}/rate-family`, { stars: 5 }, didiCookie)).body.rated, 5);
});
