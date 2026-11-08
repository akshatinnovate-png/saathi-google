import { languageName } from '../domain/languages.js';

export class ModelError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message, { cause });
    this.name = 'ModelError';
    this.status = status;
  }
}

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const UNSUPPORTED_SCHEMA_KEYS = new Set(['$schema', 'additionalProperties', '$ref', '$defs', 'definitions', 'default', 'examples', 'const', 'exclusiveMinimum', 'exclusiveMaximum', 'pattern', 'format']);

export function toGeminiSchema(schema) {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (!schema || typeof schema !== 'object') return schema;
  const out = {};
  for (const [k, v] of Object.entries(schema)) {
    if (UNSUPPORTED_SCHEMA_KEYS.has(k)) continue;
    if (k === 'type' && Array.isArray(v)) {
      const real = v.filter((t) => t !== 'null');
      out.type = real[0] ?? 'string';
      if (real.length < v.length) out.nullable = true;
      continue;
    }
    if (k === 'anyOf' || k === 'oneOf') {
      const real = v.filter((s) => s?.type !== 'null');
      if (real.length === 1) Object.assign(out, toGeminiSchema(real[0]), real.length < v.length ? { nullable: true } : {});
      else out.anyOf = real.map(toGeminiSchema);
      continue;
    }
    out[k] = typeof v === 'object' ? toGeminiSchema(v) : v;
  }
  if (out.type === 'object' && out.properties && !Object.keys(out.properties).length) delete out.properties;
  return out;
}

export function toGeminiContents(messages) {
  const names = new Map();
  const contents = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const blocks = typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : m.content;
    const parts = [];
    for (const b of blocks) {
      if (b.type === 'text' && b.text) parts.push({ text: b.text });
      else if (b.type === 'media' && b.data) parts.push({ inlineData: { mimeType: b.mimeType, data: b.data } });
      else if (b.type === 'tool_use') {
        names.set(b.id, b.name);
        parts.push({ functionCall: { name: b.name, args: b.input ?? {} }, ...(b.signature ? { thoughtSignature: b.signature } : {}) });
      } else if (b.type === 'tool_result') {
        const raw = typeof b.content === 'string' ? b.content : Array.isArray(b.content) ? b.content.filter((x) => x.type === 'text').map((x) => x.text).join('\n') : JSON.stringify(b.content);
        let response;
        try { response = JSON.parse(raw); } catch { response = { result: raw }; }
        if (!response || typeof response !== 'object' || Array.isArray(response)) response = { result: response };
        parts.push({ functionResponse: { name: names.get(b.tool_use_id) ?? 'tool', response } });
      }
    }
    if (parts.length) contents.push({ role, parts });
  }
  return contents;
}

export function fromGeminiCandidate(candidate, promptFeedback) {
  if (!candidate) return { content: [], stop_reason: promptFeedback?.blockReason ? 'refusal' : 'end_turn' };
  const content = [];
  let n = 0;
  for (const p of candidate.content?.parts ?? []) {
    if (p.thought) continue;
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.functionCall) content.push({ type: 'tool_use', id: `call_${Date.now().toString(36)}_${n++}`, name: p.functionCall.name, input: p.functionCall.args ?? {}, ...(p.thoughtSignature ? { signature: p.thoughtSignature } : {}) });
  }
  const blocked = ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII', 'RECITATION'].includes(candidate.finishReason);
  const stop = content.some((b) => b.type === 'tool_use') ? 'tool_use' : blocked ? 'refusal' : 'end_turn';
  return { content, stop_reason: stop };
}

export function createGeminiClient({ apiKey = null, model, fetchImpl = fetch, timeoutMs = 30_000, base = GEMINI_BASE, authHeaders = null }) {
  return async function create({ system, tools, messages, max_tokens: maxTokens = 2048, json = false }) {
    const body = {
      contents: toGeminiContents(messages),
      ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
      ...(tools?.length ? { tools: [{ functionDeclarations: tools.map((t) => ({ name: t.name, description: t.description, parameters: toGeminiSchema(t.input_schema ?? { type: 'object' }) })) }], toolConfig: { functionCallingConfig: { mode: 'AUTO' } } } : {}),
      generationConfig: { maxOutputTokens: maxTokens, temperature: json ? 0.1 : 0.3, ...(json ? { responseMimeType: 'application/json' } : {}) },
    };
    let res;
    try {
      res = await fetchImpl(`${base}/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { ...(authHeaders ? await authHeaders() : { 'x-goog-api-key': apiKey }), 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      throw new ModelError(`Gemini could not be reached: ${err.message}`, { cause: err });
    }
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new ModelError(out.error?.message ?? `Gemini answered ${res.status}`, { status: res.status });
    return fromGeminiCandidate(out.candidates?.[0], out.promptFeedback);
  };
}

export function vertexBase(projectId, location) {
  const host = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
  return `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google`;
}

export function createLlm(agentConfig, { projectId = null, auth = null } = {}) {
  if (agentConfig.provider === 'vertex' && projectId && auth) {
    const create = createGeminiClient({ model: agentConfig.geminiModel, base: vertexBase(projectId, agentConfig.vertexLocation ?? 'global'), authHeaders: () => auth.headers(), fetchImpl: agentConfig.fetchImpl });
    return withHelpers({ provider: 'gemini-vertex-ai', model: agentConfig.geminiModel, create });
  }
  if (agentConfig.provider !== 'gemini' || !agentConfig.geminiKey) return null;
  const create = createGeminiClient({ apiKey: agentConfig.geminiKey, model: agentConfig.geminiModel, fetchImpl: agentConfig.fetchImpl });
  return withHelpers({ provider: 'gemini', model: agentConfig.geminiModel, create });
}

export function withHelpers({ provider, model, create }) {
  async function translate(text, { from, to }) {
    const response = await create({
      system: 'You translate short personal messages between family members. Keep the warmth, names and terms of endearment (Aaji, Nani, beta and so on). Output only the translation.',
      messages: [{ role: 'user', content: `Translate from ${from === 'auto' ? 'the detected language' : languageName(from)} to ${languageName(to)}:\n\n${text}` }],
    });
    if (response.stop_reason === 'refusal') return null;
    return response.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim() || null;
  }

  async function mood(text) {
    const response = await create({
      system: 'You read how an older person says they feel. Reply with only a JSON object: {"sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED", "positive": 0-1, "negative": 0-1, "neutral": 0-1, "mixed": 0-1}. Scores add up to 1. Judge the feeling, not the topic; any language.',
      messages: [{ role: 'user', content: text }],
    });
    const raw = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    const json = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
    if (!['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'].includes(json.sentiment)) return null;
    const n = (v) => Math.max(0, Math.min(1, Number(v) || 0));
    return { sentiment: json.sentiment, scores: { positive: n(json.positive), negative: n(json.negative), neutral: n(json.neutral), mixed: n(json.mixed) } };
  }

  async function understand({ system, prompt, media = [], maxTokens = 2048 }) {
    const response = await create({
      system, json: true, max_tokens: maxTokens,
      messages: [{ role: 'user', content: [...media.map((m) => ({ type: 'media', mimeType: m.mimeType, data: m.data })), { type: 'text', text: prompt }] }],
    });
    if (response.stop_reason === 'refusal') return null;
    const raw = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    try {
      return JSON.parse(raw.slice(raw.search(/[[{]/), Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']')) + 1));
    } catch {
      return null;
    }
  }

  return { provider, model, create, translate, mood, understand };
}
