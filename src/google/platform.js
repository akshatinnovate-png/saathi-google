import { googleJson } from './auth.js';

export const EVENT_SOURCE = 'saathi.companion';

export function createPubSubEventBus({ auth, projectId, topic, fetchImpl = fetch, local } = {}) {
  const url = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topic}:publish`;
  return {
    kind: 'google-pubsub',
    async publish(detailType, detail) {
      const data = Buffer.from(JSON.stringify({ source: EVENT_SOURCE, 'detail-type': detailType, detail })).toString('base64');
      const out = await googleJson(fetchImpl, auth, url, {
        body: { messages: [{ data, attributes: { type: detailType, ...(detail?.householdId ? { household: String(detail.householdId) } : {}) } }] },
      });
      local?.publish(detailType, detail, { mirrorOnly: true });
      return out.messageIds?.[0];
    },
    subscribe: (...args) => local?.subscribe(...args),
  };
}

export function createCloudStorageMedia({ bucket, storage = null, ttlSeconds = 3600 } = {}) {
  let client = storage;
  const bucketOf = async () => {
    if (!client) {
      const { Storage } = await import('@google-cloud/storage');
      client = new Storage();
    }
    return client.bucket(bucket);
  };
  return {
    kind: 'google-cloud-storage',
    async save(key, body, contentType) {
      await (await bucketOf()).file(key).save(body, { contentType, resumable: false, metadata: { cacheControl: 'private, max-age=0' } });
      return `gs://${bucket}/${key}`;
    },
    async playbackUrl(ref, expiresIn = ttlSeconds) {
      const match = /^gs:\/\/([^/]+)\/(.+)$/.exec(ref ?? '');
      if (!match) return ref;
      const [url] = await (await bucketOf()).file(match[2]).getSignedUrl({ version: 'v4', action: 'read', expires: Date.now() + expiresIn * 1000 });
      return url;
    },
  };
}
