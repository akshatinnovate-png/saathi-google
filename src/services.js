import { fileURLToPath } from 'node:url';
import { createFileStore } from './local/fileStore.js';
import { seedData } from './domain/seed.js';
import { createFirestoreStore } from './google/firestore.js';
import { createGoogleAuth } from './google/auth.js';
import { createGoogleTranslator, createGoogleSentiment, createGoogleSpeech } from './google/language.js';
import { createPubSubEventBus, createCloudStorageMedia } from './google/platform.js';
import { createMetrics } from './google/metrics.js';
import { createLocalTranslator, createLocalSentiment, createModelSentiment, createLocalSpeech } from './local/language.js';
import { createLocalEventBus, createLocalNotifier, createLocalMedia } from './local/platform.js';
import { createLocalEscalation } from './escalation/localEscalation.js';
import { createSaathi } from './domain/saathi.js';
import { DEFAULT_HOUSEHOLD, isHouseholdId, scopeStore, scopeEvents, scopeNotifier } from './households/scope.js';
import { sealRecords } from './security/sealed.js';

export function createServices(config, overrides = {}) {
  const { google: g, resources, projectId } = config;
  const localBus = overrides.localBus ?? createLocalEventBus();
  const metrics = overrides.metrics ?? createMetrics({ enabled: process.env.SAATHI_METRICS !== 'off' });
  const needsAuth = g.translate || g.language || g.tts || g.pubsub;
  const auth = overrides.googleAuth ?? (needsAuth ? createGoogleAuth({ projectId }) : null);

  const store = overrides.store ?? (g.firestore
    ? createFirestoreStore({ projectId, databaseId: resources.firestoreDatabase, prefix: resources.firestorePrefix })
    : createFileStore({ file: config.dataFile, seed: config.demo ? () => seedData() : () => ({}), key: overrides.storeKey ?? null, keyring: overrides.keyring ?? null }));

  const translator = overrides.translator ?? (g.translate
    ? createGoogleTranslator({ auth })
    : createLocalTranslator({ llmTranslate: overrides.llmTranslate }));

  const sentiment = overrides.sentiment ?? (g.language ? createGoogleSentiment({ auth, translator }) : overrides.llmMood ? createModelSentiment({ mood: overrides.llmMood }) : createLocalSentiment());
  const speech = overrides.speech ?? (g.tts ? createGoogleSpeech({ auth }) : createLocalSpeech());

  const events = overrides.events ?? (g.pubsub && projectId
    ? createPubSubEventBus({ auth, projectId, topic: resources.eventTopic, local: localBus })
    : localBus);

  const baseNotifier = overrides.notifier ?? createLocalNotifier({ bus: localBus });
  let emailing = null;
  const notifier = {
    get kind() { return (emailing ?? baseNotifier).kind; },
    notify: (n) => (emailing ?? baseNotifier).notify(n),
    subscribe: (subscription) => baseNotifier.subscribe?.(subscription),
  };
  function attachMail(familyMail) {
    emailing = familyMail.wrapNotifier(baseNotifier);
  }

  const media = overrides.media ?? (g.storage && resources.mediaBucket
    ? createCloudStorageMedia({ bucket: resources.mediaBucket })
    : createLocalMedia({ dir: config.mediaDir ?? fileURLToPath(new URL('../data/media', import.meta.url)), signingKey: overrides.mediaSigningKey ?? null, encryptionKey: overrides.mediaEncryptionKey ?? null, keyring: overrides.keyring ?? null }));

  const escalation = overrides.escalation ?? createLocalEscalation({ store, notifier, bus: localBus, sleep: overrides.sleep });

  localBus.subscribe((event) => {
    if (event['detail-type'] === 'HelpRequested' && (!event.mirrorOnly || events !== localBus)) {
      escalation.start(event.detail.escalation).catch((err) => console.error('escalation failed to start', err));
    }
  });

  const householdStore = (householdId) => sealRecords(scopeStore(store, householdId), { keyring: overrides.keyring ?? null, householdId });
  const saathi = createSaathi({ store: householdStore(DEFAULT_HOUSEHOLD), translator, sentiment, speech, events, notifier, media, metrics, config, clock: overrides.clock, householdId: DEFAULT_HOUSEHOLD });
  const households = new Map([[DEFAULT_HOUSEHOLD, saathi]]);

  function forHousehold(householdId = DEFAULT_HOUSEHOLD) {
    if (!isHouseholdId(householdId)) throw new Error(`Invalid household ${householdId}`);
    if (!households.has(householdId)) {
      households.set(householdId, createSaathi({
        store: householdStore(householdId),
        translator, sentiment, speech, metrics, config, clock: overrides.clock, householdId,
        media: scopeMedia(media, householdId),
        events: scopeEvents(events, householdId),
        notifier: scopeNotifier(notifier, householdId),
      }));
    }
    return households.get(householdId);
  }

  async function resetDemo(seed) {
    for (const [collection, items] of Object.entries(seed)) {
      for (const old of await store.list(collection)) await store.remove(collection, old.id);
      for (const item of items) await store.put(collection, item);
    }
  }

  async function sealHouseholds() {
    let sealed = 0;
    for (const householdId of await householdIds()) sealed += (await householdStore(householdId).migrate?.()) ?? 0;
    return sealed;
  }

  async function householdIds() {
    return [DEFAULT_HOUSEHOLD, ...(await store.list('households')).map((h) => h.id).filter((id) => id !== DEFAULT_HOUSEHOLD)];
  }

  return {
    saathi, forHousehold, householdIds, sealHouseholds, resetDemo, attachMail, store, translator, sentiment, speech, events, localBus, notifier, media, escalation, metrics,
    describe: () => ({
      store: store.kind, translate: translator.kind, sentiment: sentiment.kind, speech: speech.kind,
      events: events.kind, notifications: notifier.kind, media: media.kind, escalation: escalation.kind,
    }),
  };
}

function scopeMedia(media, householdId) {
  return {
    ...media,
    kind: media.kind,
    save: (key, body, contentType) => media.save(`${householdId}/${key}`, body, contentType),
    playbackUrl: (ref) => media.playbackUrl?.(ref) ?? ref,
  };
}
