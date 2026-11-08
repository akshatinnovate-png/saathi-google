const AUTH_TOKENS = 'https://generativelanguage.googleapis.com/v1alpha/auth_tokens';
export const LIVE_SOCKET = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained';

export function createLiveTokens({ apiKey, model = 'gemini-live-2.5-flash-preview', fetchImpl = fetch, clock = () => Date.now() } = {}) {
  if (!apiKey) return null;
  return {
    model,
    async mint() {
      const now = clock();
      const res = await fetchImpl(AUTH_TOKENS, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ uses: 1, expireTime: new Date(now + 30 * 60_000).toISOString(), newSessionExpireTime: new Date(now + 60_000).toISOString() }),
        signal: AbortSignal.timeout(15_000),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.name) throw Object.assign(new Error(`Gemini Live is not available right now (${json.error?.message ?? res.status}).`), { status: 503 });
      return { token: json.name, model: `models/${model}`, socket: LIVE_SOCKET, expiresAt: new Date(now + 30 * 60_000).toISOString() };
    },
  };
}
