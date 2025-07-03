// src/utils/useTranslation.js

import { useLanguage } from './languageContext';
import messages from './messages';

const useTranslation = () => {
  const { language } = useLanguage();

  const t = (keyPath) => {
    return keyPath
      .split('.')
      .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), messages[language]);
  };

  return { t, language };
};

export default useTranslation;
