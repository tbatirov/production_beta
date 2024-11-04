import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import { translationListener } from './translationListener';

// Initialize i18next with the translation listener
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      // This will trigger the missingKey event that our listener watches
      i18next.emit('missingKey', lng, ns, key, fallbackValue);
    },
    interpolation: {
      escapeValue: false
    }
  });

// export { translationListener };
export default i18next;