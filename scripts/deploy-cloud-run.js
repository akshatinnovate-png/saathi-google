import { execFileSync } from 'node:child_process';
import { argv, env, exit } from 'node:process';

const arg = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : env[`SAATHI_DEPLOY_${name.toUpperCase().replace(/-/g, '_')}`] ?? fallback;
};
const project = arg('project', env.GOOGLE_CLOUD_PROJECT);
const region = arg('region', 'asia-south1');
const service = arg('service', 'saathi');
const bucket = arg('bucket', project ? `${project}-saathi-media` : undefined);
const dryRun = argv.includes('--dry-run');
const demo = argv.includes('--demo');
if (!project) {
  console.error('Usage: npm run deploy -- --project=YOUR_PROJECT [--region=asia-south1] [--service=saathi] [--dry-run]');
  exit(1);
}

const runner = `${service}-runner@${project}.iam.gserviceaccount.com`;
const gcloud = (args, { soft = false } = {}) => {
  console.log(`$ gcloud ${args.join(' ')}`);
  if (dryRun) return '';
  try {
    return execFileSync('gcloud', [...args, `--project=${project}`, '--quiet'], { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' });
  } catch (err) {
    if (soft) return '';
    throw err;
  }
};
const secretExists = (name) => Boolean(gcloud(['secrets', 'describe', name, '--format=value(name)'], { soft: true }).trim());

gcloud(['services', 'enable', 'run.googleapis.com', 'cloudbuild.googleapis.com', 'artifactregistry.googleapis.com', 'firestore.googleapis.com', 'storage.googleapis.com', 'pubsub.googleapis.com', 'translate.googleapis.com', 'language.googleapis.com', 'texttospeech.googleapis.com', 'secretmanager.googleapis.com', 'generativelanguage.googleapis.com', 'aiplatform.googleapis.com', 'routes.googleapis.com', 'identitytoolkit.googleapis.com', 'speech.googleapis.com', 'fcm.googleapis.com', 'workflows.googleapis.com', 'workflowexecutions.googleapis.com', 'bigquery.googleapis.com']);
gcloud(['firestore', 'databases', 'create', `--location=${region}`, '--type=firestore-native'], { soft: true });
gcloud(['storage', 'buckets', 'create', `gs://${bucket}`, `--location=${region}`, '--uniform-bucket-level-access', '--public-access-prevention'], { soft: true });
gcloud(['pubsub', 'topics', 'create', 'saathi-events'], { soft: true });
const projectNumber = gcloud(['projects', 'describe', project, '--format=value(projectNumber)'], { soft: true }).trim();
console.log(`$ bq mk --dataset ${project}:saathi && bq mk --table ${project}:saathi.care_events (Pub/Sub subscription schema)`);
if (!dryRun) {
  try {
    execFileSync('bq', ['--project_id', project, 'mk', '--dataset', '--location', region, `${project}:saathi`], { stdio: 'ignore' });
  } catch { }
  try {
    execFileSync('bq', ['--project_id', project, 'mk', '--table', '--time_partitioning_field', 'publish_time', `${project}:saathi.care_events`, 'subscription_name:STRING,message_id:STRING,publish_time:TIMESTAMP,data:STRING,attributes:STRING'], { stdio: 'ignore' });
  } catch { }
}
if (projectNumber) gcloud(['projects', 'add-iam-policy-binding', project, `--member=serviceAccount:service-${projectNumber}@gcp-sa-pubsub.iam.gserviceaccount.com`, '--role=roles/bigquery.dataEditor', '--condition=None'], { soft: true });
gcloud(['pubsub', 'subscriptions', 'create', 'saathi-events-to-bigquery', '--topic=saathi-events', `--bigquery-table=${project}:saathi.care_events`, '--write-metadata'], { soft: true });
gcloud(['iam', 'service-accounts', 'create', `${service}-runner`, '--display-name=Saathi on Cloud Run'], { soft: true });
for (const role of ['roles/aiplatform.user', 'roles/workflows.invoker', 'roles/firebasecloudmessaging.admin', 'roles/logging.logWriter', 'roles/datastore.user', 'roles/pubsub.publisher', 'roles/cloudtranslate.user', 'roles/secretmanager.secretAccessor', 'roles/serviceusage.serviceUsageConsumer']) {
  gcloud(['projects', 'add-iam-policy-binding', project, `--member=serviceAccount:${runner}`, `--role=${role}`, '--condition=None'], { soft: true });
}
gcloud(['storage', 'buckets', 'add-iam-policy-binding', `gs://${bucket}`, `--member=serviceAccount:${runner}`, '--role=roles/storage.objectAdmin'], { soft: true });
gcloud(['iam', 'service-accounts', 'add-iam-policy-binding', runner, `--member=serviceAccount:${runner}`, '--role=roles/iam.serviceAccountTokenCreator'], { soft: true });

const SECRETS = ['SAATHI_SESSION_SECRET', 'SAATHI_GOOGLE_CLIENT_SECRET', 'SAATHI_MAPS_API_KEY', 'SAATHI_FIREBASE_API_KEY', 'SAATHI_DIDI_PARTNER_CODES', 'SAATHI_RING_WEBHOOK_SECRET', 'GEMINI_API_KEY', 'SAATHI_FIREBASE_WEB_CONFIG', 'SAATHI_FCM_VAPID_KEY'];
const present = dryRun ? SECRETS : SECRETS.filter(secretExists);
const missing = SECRETS.filter((s) => !present.includes(s));
if (missing.length) {
  console.log(`\nAdd these in Secret Manager (Console > Security > Secret Manager > Create secret), then run this again to use them:\n  ${missing.join('\n  ')}\n`);
}

const vars = {
  SAATHI_USE_GOOGLE: 'true', SAATHI_VERTEX: 'true', GOOGLE_CLOUD_PROJECT: project, SAATHI_MEDIA_BUCKET: bucket, SAATHI_PUBSUB_TOPIC: 'saathi-events',
  SAATHI_REQUIRE_LOGIN: 'true', SAATHI_EGRESS: 'on', SAATHI_RUNNER_SERVICE_ACCOUNT: runner,
  ...(env.SAATHI_PUBLIC_URL ? { SAATHI_WORKFLOWS: 'true', SAATHI_WORKFLOWS_LOCATION: region } : {}),
  ...(demo ? { SAATHI_DEMO: 'true', SAATHI_FIRESTORE: 'false' } : {}),
  ...(env.SAATHI_PUBLIC_URL ? { SAATHI_PUBLIC_URL: env.SAATHI_PUBLIC_URL } : {}),
  ...Object.fromEntries(['SAATHI_GEMMA_MODEL_URL', 'SAATHI_GEMMA_MODEL_SHA256', 'SAATHI_GEMMA_MODEL_BYTES', 'SAATHI_GEMMA_MODEL_NAME'].filter((k) => env[k]).map((k) => [k, env[k]])),
  ...(env.SAATHI_GOOGLE_CLIENT_ID ? { SAATHI_GOOGLE_CLIENT_ID: env.SAATHI_GOOGLE_CLIENT_ID } : {}),
};
gcloud([
  'run', 'deploy', service, '--source=.', `--region=${region}`, `--service-account=${runner}`,
  '--allow-unauthenticated', '--min-instances=1', '--max-instances=3', '--no-cpu-throttling', '--cpu=1', '--memory=1Gi', '--concurrency=80',
  `--set-env-vars=${Object.entries(vars).map(([k, v]) => `${k}=${v}`).join(',')}`,
  ...(present.length ? [`--set-secrets=${present.map((s) => `${s}=${s}:latest`).join(',')}`] : []),
]);
gcloud(['workflows', 'deploy', 'saathi-escalation', '--source=workflows/escalation.yaml', `--location=${region}`, `--service-account=${runner}`, '--description=Saathi help escalation: family, then neighbour, then emergency guidance']);
const url = gcloud(['run', 'services', 'describe', service, `--region=${region}`, '--format=value(status.url)'], { soft: true }).trim();
console.log(`\nSaathi is on Cloud Run${url ? ` at ${url}` : ''}.`);
console.log('Set SAATHI_PUBLIC_URL to that address (and add it as an authorised redirect URI for Google sign-in), then run this once more: escalations then run on Cloud Workflows.');
console.log('Care events stream to BigQuery (dataset "saathi", table "care_events"); open it in Looker Studio for charts.');
if (demo) console.log('This is a public demo: sign in as riya@saathi.demo with the password saathi-demo-2026. Its data resets when the service restarts.');
