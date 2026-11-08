const ROUTES = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';

export function createMaps({ apiKey, fetchImpl = fetch, cacheSize = 500 } = {}) {
  if (!apiKey) return null;
  const cache = new Map();
  return {
    kind: 'google-maps-routes',
    async travelMinutes(origins, destination, { mode = 'TWO_WHEELER' } = {}) {
      const list = origins.map((o) => String(o ?? '').trim());
      const dest = String(destination ?? '').trim();
      const result = list.map((o) => cache.get(`${mode}|${o}|${dest}`));
      const missing = list.map((o, i) => (result[i] === undefined && o ? i : -1)).filter((i) => i >= 0);
      if (missing.length && dest) {
        const res = await fetchImpl(ROUTES, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey, 'x-goog-fieldmask': 'originIndex,destinationIndex,duration,condition' },
          body: JSON.stringify({
            origins: missing.map((i) => ({ waypoint: { address: list[i] } })),
            destinations: [{ waypoint: { address: dest } }],
            travelMode: mode,
            regionCode: 'IN',
          }),
          signal: AbortSignal.timeout(15_000),
        });
        if (!res.ok) throw new Error(`Google Maps answered ${res.status}`);
        const rows = await res.json();
        for (const row of Array.isArray(rows) ? rows : []) {
          const i = missing[row.originIndex ?? 0];
          const minutes = row.condition === 'ROUTE_EXISTS' && row.duration ? Math.round(parseInt(row.duration, 10) / 60) : null;
          result[i] = minutes;
          if (cache.size >= cacheSize) cache.delete(cache.keys().next().value);
          cache.set(`${mode}|${list[i]}|${dest}`, minutes);
        }
      }
      return result.map((m) => (m === undefined ? null : m));
    },
  };
}
