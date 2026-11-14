import { createInterface } from 'node:readline';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const envFile = process.env.SAATHI_ENV_FILE ?? fileURLToPath(new URL('../.env', import.meta.url));
const current = existsSync(envFile)
  ? Object.fromEntries(readFileSync(envFile, 'utf8').split(/\r?\n/).filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"(.*)"$/, '$1')]))
  : {};
const values = { ...current };
const tty = Boolean(process.stdin.isTTY);

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: tty });
let muted = false;
rl._writeToOutput = function write(text) { rl.output.write(muted && !/[\r\n]/.test(text) && !text.includes(rl.getPrompt()) ? '*'.repeat(text.length) : text); };
const queue = [];
const waiting = [];
rl.on('line', (line) => { muted = false; if (waiting.length) waiting.shift()(line); else queue.push(line); });
let closed = false;
rl.on('close', () => { closed = true; while (waiting.length) waiting.shift()(''); });
const nextLine = () => (queue.length ? Promise.resolve(queue.shift()) : closed ? Promise.resolve('') : new Promise((resolve) => waiting.push(resolve)));
const ask = async (q, { secret = false, fallback = '' } = {}) => {
  const prompt = `${q}${fallback && !secret ? ` [${fallback}]` : ''}: `;
  if (tty) { rl.setPrompt(prompt); rl.prompt(); } else process.stdout.write(prompt);
  muted = secret && tty;
  const answer = (await nextLine()).trim();
  if (!tty) process.stdout.write(secret ? '\n' : `${answer}\n`);
  return answer || fallback;
};
const choose = async (q, options) => {
  console.log(`\n${q}`);
  options.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
  const n = Number(await ask('Type a number and press Enter', { fallback: '1' }));
  return Number.isInteger(n) && n >= 1 && n <= options.length ? n : 1;
};
const unset = (...keys) => keys.forEach((k) => delete values[k]);
const port = values.PORT ?? process.env.PORT ?? '8787';
const site = () => values.SAATHI_PUBLIC_URL ?? `http://localhost:${port}`;

console.log('\n  Saathi setup. Press Enter to keep what is shown in [brackets].');
console.log('  You do this once. Your family never sees any of it: they just tap "Continue with Google".\n');

const hasGoogle = Boolean(current.SAATHI_GOOGLE_CLIENT_ID && current.SAATHI_GOOGLE_CLIENT_SECRET);
const google = await choose('Sign in with Google (and send email from Gmail, with no passwords)?', [
  hasGoogle ? 'Keep my Google setup' : 'Yes, set it up now (about 5 minutes, once)',
  hasGoogle ? 'Change it' : 'Not now',
]);
if ((hasGoogle && google === 2) || (!hasGoogle && google === 1)) {
  console.log(`
  Open each link, signed in to your Google account:

  1. https://console.cloud.google.com/projectcreate
       Project name: Saathi  ->  Create

  2. https://console.cloud.google.com/apis/library/gmail.googleapis.com
       Enable   (this lets Saathi send invites and alerts from Gmail)

  3. https://console.cloud.google.com/auth/overview
       Get started  ->  App name: Saathi, your email  ->  Audience: External  ->  Create
       Then "Audience"  ->  Publish app  (so anyone in your family can sign in)

  4. https://console.cloud.google.com/auth/clients
       Create client  ->  Application type: Web application
       Authorized redirect URIs  ->  Add URI:  ${site()}/auth/google/callback
       Create, then copy the Client ID and Client secret below.
`);
  values.SAATHI_GOOGLE_CLIENT_ID = await ask('Client ID', { fallback: current.SAATHI_GOOGLE_CLIENT_ID ?? '' });
  const secret = await ask('Client secret (hidden)', { secret: true });
  if (secret) values.SAATHI_GOOGLE_CLIENT_SECRET = secret;
}
const googleOn = Boolean(values.SAATHI_GOOGLE_CLIENT_ID && values.SAATHI_GOOGLE_CLIENT_SECRET);

const mail = await choose('How should Saathi send email (invites and alerts)?', [
  googleOn ? "From the Gmail of whoever sets up the family (nothing to type: they tap 'Connect Gmail')" : 'Not now (invites can be shared on WhatsApp, alerts show in the app)',
  'From one Gmail account with an app password',
  'Another email provider (SMTP)',
]);
if (mail === 1) {
  unset('SAATHI_MAIL', 'SAATHI_SMTP_URL', 'SAATHI_GMAIL_USER', 'SAATHI_GMAIL_APP_PASSWORD');
} else if (mail === 2) {
  console.log('\n  Turn on 2-Step Verification, then make an app password at https://myaccount.google.com/apppasswords (name it "Saathi").\n');
  unset('SAATHI_MAIL', 'SAATHI_SMTP_URL');
  values.SAATHI_GMAIL_USER = await ask('Gmail address', { fallback: current.SAATHI_GMAIL_USER ?? '' });
  const pass = await ask('App password (hidden)', { secret: true });
  if (pass) values.SAATHI_GMAIL_APP_PASSWORD = pass.replace(/\s+/g, '');
} else {
  unset('SAATHI_GMAIL_USER', 'SAATHI_GMAIL_APP_PASSWORD', 'SAATHI_MAIL');
  console.log('\n  Example: smtps://user:password@smtp.example.com:465');
  const url = await ask('SMTP URL (hidden)', { secret: true });
  if (url) values.SAATHI_SMTP_URL = url;
  values.SAATHI_MAIL_FROM = await ask('Send from', { fallback: current.SAATHI_MAIL_FROM ?? '' });
}

const brain = await choose('Gemini (understanding, planning and translation)?', [
  current.GEMINI_API_KEY ? 'Keep my current key' : 'Not now (Saathi uses its offline planner; messages stay in the language they were written in)',
  'Gemini API key (free tier)',
  'Google Cloud (Gemini plus Cloud Translation, Natural Language and Text-to-Speech, using this computer\'s gcloud login)',
]);
if (brain === 2 || brain === 3) {
  console.log('\n  Get a free key at https://aistudio.google.com/apikey\n');
  const key = await ask('Gemini API key (hidden)', { secret: true });
  if (key) values.GEMINI_API_KEY = key;
}
if (brain === 3) {
  console.log('\n  Run "gcloud auth application-default login" once, and enable the Cloud Translation, Cloud Natural Language and Cloud Text-to-Speech APIs in your project.');
  values.GOOGLE_CLOUD_PROJECT = await ask('Google Cloud project ID', { fallback: current.GOOGLE_CLOUD_PROJECT ?? '' });
  Object.assign(values, { SAATHI_GOOGLE_TRANSLATE: 'true', SAATHI_GOOGLE_LANGUAGE: 'true', SAATHI_GOOGLE_TTS: 'true' });
}

const windowsApp = process.env.SAATHI_PAUSE === '1';
const lines = ['# Written by npm run setup. Keep this file private.', ...Object.entries(values).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${/[\s#"'=]/.test(v) ? `"${v.replace(/"/g, '\\"')}"` : v}`)];
writeFileSync(envFile, `${lines.join('\n')}\n`, { mode: 0o600 });
if (windowsApp) {
  console.log('\n  Saved. Saathi stops now so it can pick up the new settings.');
  console.log('  Open Saathi again from the Start menu and it will use them.\n');
  await ask('  Press Enter to close this window');
} else {
  console.log(`\n  Saved. Now run:  npm start`);
  console.log(`  Then open ${site()} and tap "Continue with Google".\n`);
}
rl.close();
