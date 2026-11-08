const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export function createGeminiImage({ apiKey, model = 'gemini-2.5-flash-image', fetchImpl = fetch } = {}) {
  if (!apiKey) return null;
  return {
    model,
    async generate(prompt) {
      const res = await fetchImpl(`${BASE}/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:5' } } }),
        signal: AbortSignal.timeout(60_000),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(json.error?.message ?? `Gemini answered ${res.status}`), { status: res.status });
      const part = (json.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData?.data);
      if (!part) return null;
      return { data: Buffer.from(part.inlineData.data, 'base64'), contentType: part.inlineData.mimeType ?? 'image/png' };
    },
  };
}
