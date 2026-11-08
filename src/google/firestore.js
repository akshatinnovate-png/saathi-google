const clean = (value) => JSON.parse(JSON.stringify(value ?? null));
const docId = (id) => encodeURIComponent(String(id)).replace(/\./g, '%2E');

export function createFirestoreStore({ projectId = undefined, databaseId = undefined, prefix = 'saathi', db = null } = {}) {
  let client = db;
  const fs = async () => {
    if (!client) {
      const { Firestore } = await import('@google-cloud/firestore');
      client = new Firestore({ ...(projectId ? { projectId } : {}), ...(databaseId ? { databaseId } : {}), ignoreUndefinedProperties: true });
    }
    return client;
  };
  const col = async (collection) => (await fs()).collection(`${prefix}`).doc(docId(collection)).collection('items');
  const ref = async (collection, id) => (await col(collection)).doc(docId(id));

  return {
    kind: 'firestore',
    async list(collection) {
      const snap = await (await col(collection)).get();
      return snap.docs.map((d) => d.data());
    },
    async get(collection, id) {
      const snap = await (await ref(collection, id)).get();
      return snap.exists ? snap.data() : null;
    },
    async put(collection, item) {
      await (await ref(collection, item.id)).set(clean(item));
      return item;
    },
    async update(collection, id, patch) {
      const r = await ref(collection, id);
      const db = await fs();
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(r);
        if (!snap.exists) return null;
        const next = clean({ ...snap.data(), ...patch });
        tx.set(r, next);
        return next;
      });
    },
    async remove(collection, id) {
      await (await ref(collection, id)).delete();
      return true;
    },
    async reset(data) {
      const db = await fs();
      for (const [collection, items] of Object.entries(data)) {
        for (let i = 0; i < items.length; i += 400) {
          const batch = db.batch();
          for (const item of items.slice(i, i + 400)) batch.set(await ref(collection, item.id), clean(item));
          await batch.commit();
        }
      }
    },
  };
}
