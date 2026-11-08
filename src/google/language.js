import { LANGUAGES } from '../domain/languages.js';
import { googleJson } from './auth.js';

const decode = (s) => String(s).replace(/&(#39|quot|amp|lt|gt);/g, (_m, c) => ({ '#39': "'", quot: '"', amp: '&', lt: '<', gt: '>' })[c]);

export function createGoogleTranslator({ auth, fetchImpl = fetch } = {}) {
  return {
    kind: 'google-cloud-translation',
    async translate(text, { to, from = 'auto' }) {
      if (!text || from === to) return { text, from, to, translated: false, engine: 'none' };
      const out = await googleJson(fetchImpl, auth, 'https://translation.googleapis.com/language/translate/v2', {
        body: { q: [text], target: to, ...(from !== 'auto' ? { source: from } : {}), format: 'text', model: 'nmt' },
      });
      const t = out.data?.translations?.[0] ?? {};
      const detected = t.detectedSourceLanguage ?? from;
      return { text: decode(t.translatedText ?? text), from: detected, to, translated: detected !== to, engine: 'google-cloud-translation' };
    },
  };
}

const NL_SENTIMENT_LANGS = new Set(['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'zh-TW', 'ar', 'hi', 'id', 'nl', 'pl', 'ru', 'th', 'tr', 'vi']);

export function sentimentFromScore(score = 0, magnitude = 0) {
  const s = Math.max(-1, Math.min(1, Number(score) || 0));
  const m = Math.max(0, Number(magnitude) || 0);
  const sentiment = s >= 0.25 ? 'POSITIVE' : s <= -0.25 ? 'NEGATIVE' : m >= 1.5 ? 'MIXED' : 'NEUTRAL';
  const positive = Math.max(0, s);
  const negative = Math.max(0, -s);
  const mixed = sentiment === 'MIXED' ? Math.min(1, m / 4) : 0;
  const neutral = Math.max(0, 1 - positive - negative - mixed);
  return { sentiment, scores: { positive, negative, neutral, mixed } };
}

export function createGoogleSentiment({ auth, translator, fetchImpl = fetch } = {}) {
  return {
    kind: 'google-natural-language',
    async analyze(text, language) {
      let analysed = text;
      let lang = language;
      if (!NL_SENTIMENT_LANGS.has(language)) {
        analysed = (await translator.translate(text, { from: language, to: 'en' })).text;
        lang = 'en';
      }
      const out = await googleJson(fetchImpl, auth, 'https://language.googleapis.com/v2/documents:analyzeSentiment', {
        body: { document: { type: 'PLAIN_TEXT', content: analysed, languageCode: lang }, encodingType: 'UTF8' },
      });
      const { sentiment, scores } = sentimentFromScore(out.documentSentiment?.score, out.documentSentiment?.magnitude);
      return { sentiment, scores, analysedLanguage: lang, engine: 'google-natural-language' };
    },
  };
}

export function createGoogleSpeech({ auth, fetchImpl = fetch } = {}) {
  return {
    kind: 'google-text-to-speech',
    async synthesize(text, language, { slow = false } = {}) {
      const lang = LANGUAGES[language];
      if (!lang?.ttsLanguage) return null;
      const out = await googleJson(fetchImpl, auth, 'https://texttospeech.googleapis.com/v1/text:synthesize', {
        body: {
          input: { text },
          voice: { languageCode: lang.ttsLanguage, ...(lang.ttsVoice ? { name: lang.ttsVoice } : { ssmlGender: 'FEMALE' }) },
          audioConfig: { audioEncoding: 'MP3', speakingRate: slow ? 0.85 : 1 },
        },
      });
      return { audio: Buffer.from(out.audioContent ?? '', 'base64'), contentType: 'audio/mpeg', voice: lang.ttsVoice ?? `${lang.ttsLanguage} (Google)` };
    },
  };
}
