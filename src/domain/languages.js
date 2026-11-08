export const LANGUAGES = {
  en: { name: 'English', native: 'English', bcp47: 'en-IN', ttsLanguage: 'en-IN', ttsVoice: null },
  hi: { name: 'Hindi', native: 'हिन्दी', bcp47: 'hi-IN', ttsLanguage: 'hi-IN', ttsVoice: null },
  mr: { name: 'Marathi', native: 'मराठी', bcp47: 'mr-IN', ttsLanguage: 'mr-IN', ttsVoice: null },
  ta: { name: 'Tamil', native: 'தமிழ்', bcp47: 'ta-IN', ttsLanguage: 'ta-IN', ttsVoice: null },
  bn: { name: 'Bengali', native: 'বাংলা', bcp47: 'bn-IN', ttsLanguage: 'bn-IN', ttsVoice: null },
  es: { name: 'Spanish', native: 'Español', bcp47: 'es-US', ttsLanguage: 'es-US', ttsVoice: null },
  fr: { name: 'French', native: 'Français', bcp47: 'fr-FR', ttsLanguage: 'fr-FR', ttsVoice: null },
  ar: { name: 'Arabic', native: 'العربية', bcp47: 'ar-AE', ttsLanguage: 'ar-XA', ttsVoice: null },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES);

export function languageName(code) {
  return LANGUAGES[code]?.name ?? code;
}
