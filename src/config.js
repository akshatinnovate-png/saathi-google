import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const env = process.env;

const flag = (name, fallback = false) => {
  const v = env[name];
  if (v === undefined || v === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
};

const useGoogle = flag('SAATHI_USE_GOOGLE');
const demo = flag('SAATHI_DEMO');

export const config = {
  demo,
  port: Number(env.PORT ?? 8787),
  host: env.HOST ?? '127.0.0.1',
  projectId: env.GOOGLE_CLOUD_PROJECT ?? env.GCLOUD_PROJECT ?? undefined,
  dataFile: env.SAATHI_DATA_FILE ?? fileURLToPath(new URL('../data/saathi.json', import.meta.url)),
  mediaDir: env.SAATHI_MEDIA_DIR ?? join(dirname(env.SAATHI_DATA_FILE ?? fileURLToPath(new URL('../data/saathi.json', import.meta.url))), 'media'),
  timezone: env.SAATHI_TIMEZONE ?? Intl.DateTimeFormat().resolvedOptions().timeZone,

  google: {
    firestore: flag('SAATHI_FIRESTORE', useGoogle),
    translate: flag('SAATHI_GOOGLE_TRANSLATE', useGoogle),
    language: flag('SAATHI_GOOGLE_LANGUAGE', useGoogle),
    tts: flag('SAATHI_GOOGLE_TTS', useGoogle),
    pubsub: flag('SAATHI_PUBSUB', useGoogle),
    storage: flag('SAATHI_CLOUD_STORAGE', useGoogle),
    speech: flag('SAATHI_GOOGLE_SPEECH', useGoogle),
    fcm: flag('SAATHI_FCM', useGoogle),
    workflows: flag('SAATHI_WORKFLOWS', false),
    firebaseWebConfig: (() => { try { return env.SAATHI_FIREBASE_WEB_CONFIG ? JSON.parse(env.SAATHI_FIREBASE_WEB_CONFIG) : null; } catch { return null; } })(),
    vapidKey: env.SAATHI_FCM_VAPID_KEY || undefined,
    clientId: env.SAATHI_GOOGLE_CLIENT_ID || undefined,
    clientSecret: env.SAATHI_GOOGLE_CLIENT_SECRET || undefined,
    mapsKey: env.SAATHI_MAPS_API_KEY || undefined,
    firebaseApiKey: env.SAATHI_FIREBASE_API_KEY || undefined,
  },

  resources: {
    firestoreDatabase: env.SAATHI_FIRESTORE_DATABASE || undefined,
    firestorePrefix: env.SAATHI_FIRESTORE_PREFIX ?? 'saathi',
    eventTopic: env.SAATHI_PUBSUB_TOPIC ?? 'saathi-events',
    mediaBucket: env.SAATHI_MEDIA_BUCKET ?? '',
    workflowsLocation: env.SAATHI_WORKFLOWS_LOCATION ?? 'asia-south1',
    workflowName: env.SAATHI_WORKFLOW ?? 'saathi-escalation',
    runnerServiceAccount: env.SAATHI_RUNNER_SERVICE_ACCOUNT || undefined,
  },

  agent: {
    provider: env.SAATHI_AGENT_PROVIDER ?? (flag('SAATHI_VERTEX', false) ? 'vertex' : env.GEMINI_API_KEY ? 'gemini' : 'offline'),
    vertexLocation: env.SAATHI_VERTEX_LOCATION ?? 'global',
    geminiKey: env.GEMINI_API_KEY || undefined,
    geminiModel: env.SAATHI_GEMINI_MODEL ?? 'gemini-2.5-flash',
    liveModel: env.SAATHI_LIVE_MODEL ?? 'gemini-live-2.5-flash-preview',
    live: env.SAATHI_LIVE !== 'off',
    imageModel: env.SAATHI_IMAGE_MODEL ?? 'gemini-2.5-flash-image',
  },

  auth: {
    mode: env.SAATHI_AUTH_MODE ?? (env.SAATHI_MCP_TOKEN ? 'static' : 'none'),
    elderToken: env.SAATHI_MCP_TOKEN || undefined,
    familyToken: env.SAATHI_FAMILY_TOKEN || undefined,
    publicUrl: env.SAATHI_PUBLIC_URL || undefined,
  },

  web: {
    requireLogin: env.SAATHI_REQUIRE_LOGIN !== 'false',
    trustProxy: env.SAATHI_TRUST_PROXY ?? (env.K_SERVICE ? 1 : 'loopback'),
    sessionSecret: env.SAATHI_SESSION_SECRET || undefined,
    demoAccounts: demo && env.SAATHI_DEMO_ACCOUNTS !== 'false',
  },

  mail: {
    provider: env.SAATHI_MAIL || undefined,
    from: env.SAATHI_MAIL_FROM || undefined,
    smtpUrl: env.SAATHI_SMTP_URL || undefined,
    gmailUser: env.SAATHI_GMAIL_USER || undefined,
    gmailAppPassword: env.SAATHI_GMAIL_APP_PASSWORD || undefined,
  },

  ring: {
    webhookSecret: env.SAATHI_RING_WEBHOOK_SECRET || 'local-ring-simulator-secret',
  },

  escalation: {
    familyAckWaitSeconds: Number(env.SAATHI_FAMILY_ACK_WAIT ?? (demo ? 20 : 300)),
    neighbourAckWaitSeconds: Number(env.SAATHI_NEIGHBOUR_ACK_WAIT ?? (demo ? 20 : 300)),
  },
};
