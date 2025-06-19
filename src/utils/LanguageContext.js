// src/utils/LanguageContext.js : Fournisseur de langue et gestionnaire de langue

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n-config';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.defaultLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathLang = window.location.pathname.split('/')[1];
      if (i18n.languages.includes(pathLang)) {
        setLanguage(pathLang);
      } else {
        setLanguage(i18n.defaultLanguage);
      }
    }
  }, []);

  const switchLanguage = (newLang) => {
    if (i18n.languages.includes(newLang)) {
      setLanguage(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
