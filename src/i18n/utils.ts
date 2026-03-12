import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang]?.[key] || ui[defaultLang][key];
  }
}

// Para uso en componentes de React que pasen el lang actual prop
export function getTranslationFunctionForLang(lang: 'es' | 'en') {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang]?.[key] || ui[defaultLang][key];
  }
}
