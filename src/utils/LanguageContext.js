// src/utils/LanguageContext.js : Fournisseur de langue et gestionnaire de langue

import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "./i18n-config";

// Création et export du contexte de langue
export const LanguageContext = createContext(undefined);

// Fournisseur du contexte
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.defaultLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Détecter la langue depuis l'URL (ex : /en/ ou /fr/)
      const pathLang = window.location.pathname.split("/")[1];
      if (i18n.languages.includes(pathLang)) {
        setLanguage(pathLang);
      } else {
        setLanguage(i18n.defaultLanguage);
      }
    }
  }, []);

  // Fonction pour changer la langue manuellement
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

// Hook personnalisé sécurisé pour utiliser le contexte de langue
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn("useLanguage() doit être utilisé dans un <LanguageProvider />");
    // Retour par défaut si contexte non trouvé (prévenir crash)
    return {
      language: i18n.defaultLanguage,
      setLanguage: () => {},
      switchLanguage: () => {},
    };
  }
  return context;
};
