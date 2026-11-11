import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/http/app.js';
import { createAccounts } from '../src/accounts/accounts.js';
import { createSessions } from '../src/accounts/sessions.js';
import { createHouseholdVerifier } from '../src/auth/verifier.js';
import { createMailer } from '../src/mail/mailer.js';
import { createFamilyMail } from '../src/mail/familyMail.js';
import { testServices, testConfig } from './helpers.js';

const OLD = 'old garden walk 1952';
const NEW = 'new tea on the balcony 7';

test('a reset link works once, expires after 30 minutes, and never says whether an email has an account', async () => {
  const services = testServices();
  let now = new Date('2026-11-11T10:00:00Z');
  const accounts = createAccounts({ store: services.store, services, clock: () => now });
  await accounts.signUp({ email: 'Kamala@Example.com', password: OLD, name: 'Kamala' });

  assert.equal(await accounts.startPasswordReset('nobody@example.com'), null);
  assert.equal(await accounts.startPasswordReset('not an email'), null);
  const first = await accounts.startPasswordReset(' KAMALA@example.com ');
  assert.equal(first.email, 'kamala@example.com');
  assert.equal(first.minutes, 30);
  assert.ok(first.token.length >= 40);
  const stored = await services.store.list('passwordResets');
  assert.equal(stored.length, 1);
  assert.ok(!JSON.stringify(stored).includes(first.token), 'only a hash of the token is stored');

  const second = await accounts.startPasswordReset('kamala@example.com');
  assert.equal((await services.store.list('passwordResets')).length, 1, 'a new request replaces the old link');
  await assert.rejects(accounts.finishPasswordReset(first.token, NEW), /expired or was already used/);

  await assert.rejects(accounts.finishPasswordReset(second.token, 'short'), (e) => e.code === 'password');
  const done = await accounts.finishPasswordReset(second.token, NEW);
  assert.equal(done.email, 'kamala@example.com');
  await assert.rejects(accounts.login({ email: 'kamala@example.com', password: OLD }), /do not match/);
  assert.equal((await accounts.login({ email: 'kamala@example.com', password: NEW })).email, 'kamala@example.com');
  await assert.rejects(accounts.finishPasswordReset(second.token, 'another fine password 8'), /expired or was already used/);
  await assert.rejects(accounts.finishPasswordReset('', NEW), /expired/);

  const late = await accounts.startPasswordReset('kamala@example.com');
  now = new Date(now.getTime() + 31 * 60_000);
  await assert.rejects(accounts.finishPasswordReset(late.token, 'yet another fine password 9'), /expired/);
  assert.equal((await services.store.list('passwordResets')).length, 0, 'an expired link is cleaned up');
});

test('demo and Google-only accounts get no reset link', async () => {
  const services = testServices();
  const accounts = createAccounts({ store: services.store, services, demo: true });
  await accounts.ensureDemo();
  assert.equal(await accounts.startPasswordReset('riya@saathi.demo'), null);
  await accounts.socialLogin({ email: 'g@example.com', name: 'G', sub: 'google-1' });
  assert.equal(await accounts.startPasswordReset('g@example.com'), null);
});

let server;
let base;
const sent = [];

before(async () => {
  const services = testServices();
  const accounts = createAccounts({ store: services.store, services });
  await accounts.signUp({ email: 'kamala@saathi.test', password: OLD, name: 'Kamala' });
  const mailer = createMailer({ transport: { kind: 'test', from: 'saathi@test', send: async (m) => { sent.push(m); return 'id'; } } });
  const familyMail = createFamilyMail({ store: services.store, mailer, publicUrl: 'https://saathi.example' });
  const app = createApp({
    config: testConfig({ host: '127.0.0.1', web: { requireLogin: true } }), services,
    accounts, sessions: createSessions('test-secret'), optionalVerifier: createHouseholdVerifier({ base: null, accounts }), familyMail,
  });
  await new Promise((resolve) => { server = app.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

const post = async (path, body, cookie) => {
  const res = await fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json().catch(() => null), cookie: res.headers.get('set-cookie')?.split(';')[0] };
};

test('over HTTP: the email carries a one-time link, the new password works, and every old session is signed out', async () => {
  const login = await post('/auth/login', { email: 'kamala@saathi.test', password: OLD });
  assert.equal(login.status, 200);
  const before = await fetch(`${base}/api/session`, { headers: { cookie: login.cookie } }).then((r) => r.json());
  assert.equal(before.user.email, 'kamala@saathi.test');

  assert.deepEqual((await post('/auth/forgot', { email: 'nobody@example.com' })).body, { sent: true });
  assert.equal(sent.length, 0, 'no email for an unknown address, but the same answer');
  assert.deepEqual((await post('/auth/forgot', { email: 'kamala@saathi.test' })).body, { sent: true });
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'kamala@saathi.test');
  assert.equal(sent[0].subject, 'Reset your Saathi password');
  const link = sent[0].text.match(/https:\/\/saathi\.example\/login\.html\?reset=([\w-]+)/);
  assert.ok(link, 'the email links to the reset page');

  assert.equal((await post('/auth/reset', { token: 'wrong', password: NEW })).status, 400);
  const done = await post('/auth/reset', { token: link[1], password: NEW });
  assert.deepEqual(done.body, { reset: true, email: 'kamala@saathi.test' });
  const after = await fetch(`${base}/api/session`, { headers: { cookie: login.cookie } }).then((r) => r.json());
  assert.equal(after.user, null, 'the old session was signed out');
  assert.equal((await post('/auth/reset', { token: link[1], password: 'something else entirely 10' })).status, 400);
  assert.equal((await post('/auth/login', { email: 'kamala@saathi.test', password: NEW })).status, 200);
  assert.equal((await post('/auth/login', { email: 'kamala@saathi.test', password: OLD })).status, 400);
});
