import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

export const UNDELIVERABLE = /@(saathi\.demo|example\.(com|org|net))$/i;

const address = (name, email) => (name ? `"${String(name).replace(/["\\\r\n]/g, '')}" <${email}>` : email);

export function rfc822({ from, to, subject, html, text, replyTo }) {
  const boundary = `saathi-${randomUUID()}`;
  const b64 = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/.{76}/g, '$&\r\n');
  return [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(text),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(html),
    `--${boundary}--`,
    '',
  ].filter((line) => line !== null).join('\r\n');
}

function smtpTransport({ smtpUrl, gmailUser, gmailAppPassword, from }) {
  const transport = gmailUser
    ? nodemailer.createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailAppPassword.replace(/\s+/g, '') } })
    : nodemailer.createTransport(smtpUrl);
  const sender = from ?? gmailUser;
  return {
    kind: gmailUser ? 'gmail-smtp' : 'smtp',
    from: sender,
    async send({ to, subject, html, text, replyTo, fromName }) {
      const out = await transport.sendMail({ from: address(fromName ?? 'Saathi', sender), to, subject, html, text, replyTo });
      return out.messageId;
    },
  };
}

function outboxTransport({ dir, log = console.log }) {
  return {
    kind: 'outbox',
    from: 'saathi@localhost',
    async send({ to, subject, html, text }) {
      const id = randomUUID();
      if (dir) {
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${id.slice(0, 8)}.html`), `<!-- To: ${to} | Subject: ${subject} -->\n${html}`);
      }
      const link = text.match(/https?:\/\/\S+/)?.[0];
      log(`\n  ✉  Email not sent (no mail service set up). To: ${to}\n     ${subject}${link ? `\n     Link: ${link}` : ''}\n     Run "npm run setup" to send real email.\n`);
      return id;
    },
  };
}

export function createMailer({ mail, outboxDir, log, transport: custom } = {}) {
  let transport;
  if (custom) transport = custom;
  else if (mail?.gmailUser && mail?.gmailAppPassword) transport = smtpTransport({ gmailUser: mail.gmailUser, gmailAppPassword: mail.gmailAppPassword, from: mail.from });
  else if (mail?.smtpUrl) transport = smtpTransport({ smtpUrl: mail.smtpUrl, from: mail.from });
  else transport = outboxTransport({ dir: outboxDir, log });

  return {
    kind: transport.kind,
    from: transport.from,
    real: transport.kind !== 'outbox',
    async send(message, { via } = {}) {
      if (UNDELIVERABLE.test(message.to)) return { id: null, skipped: true, kind: 'skipped' };
      if (via) {
        try {
          return { id: await via.send(message), kind: via.kind };
        } catch (err) {
          console.error(`sending through ${via.kind} failed, falling back to ${transport.kind}:`, err.message);
        }
      }
      return { id: await transport.send(message), kind: transport.kind };
    },
  };
}
