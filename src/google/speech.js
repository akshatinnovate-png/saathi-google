import { googleJson } from './auth.js';

const BCP47 = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', bn: 'bn-IN', es: 'es-US', fr: 'fr-FR', ar: 'ar-AE' };
const ENCODINGS = { 'audio/webm': ['WEBM_OPUS', 48000], 'audio/ogg': ['OGG_OPUS', 48000] };

export function createSpeechToText({ auth, fetchImpl = fetch, maxBytes = 900_000 } = {}) {
  return {
    kind: 'google-speech-to-text',
    async transcribe(audio, { language = 'en', contentType = 'audio/webm' } = {}) {
      const type = String(contentType).split(';')[0].trim();
      const encoding = ENCODINGS[type];
      if (!encoding) throw Object.assign(new Error('Record the note again: that audio format is not supported.'), { status: 400 });
      if (!audio?.length || audio.length > maxBytes) throw Object.assign(new Error('Keep the voice note under one minute.'), { status: 400 });
      const primary = BCP47[language] ?? 'en-IN';
      const out = await googleJson(fetchImpl, auth, 'https://speech.googleapis.com/v1/speech:recognize', {
        body: {
          config: {
            encoding: encoding[0], sampleRateHertz: encoding[1], languageCode: primary,
            alternativeLanguageCodes: ['mr-IN', 'hi-IN', 'en-IN'].filter((l) => l !== primary).slice(0, 3),
            enableAutomaticPunctuation: true, model: 'latest_long',
          },
          audio: { content: Buffer.from(audio).toString('base64') },
        },
      });
      const results = out.results ?? [];
      const text = results.map((r) => r.alternatives?.[0]?.transcript ?? '').join(' ').replace(/\s+/g, ' ').trim();
      const detected = results.find((r) => r.languageCode)?.languageCode?.slice(0, 2).toLowerCase() ?? language;
      return { text, language: Object.keys(BCP47).includes(detected) ? detected : language };
    },
  };
}
