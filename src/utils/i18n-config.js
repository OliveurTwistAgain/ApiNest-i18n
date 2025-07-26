// src/utils/i18n-config.js : Configuration des traductions fixes pour le site web ApiNest-i18n

const i18n = {
  defaultLanguage: "fr",
  languages: ["fr", "en"],
  defaultPath: "/", // Racine pour langue par défaut
  translations: {
    fr: {
      siteTitle: "Hooper Ghost Lab",
      siteDescription: "Le labo du testeur de miel. 🍯",
      navigation: {
        home: "Accueil",
        about: "À propos",
        contact: "Contact",
      },
      post: {
        similar: "Voir aussi",
      },
      footer: {
        legal: "Mentions légales",
      },
      sloganFixed: "Du nectar à l'authenticité — votre miel local.",
      map: {
        title: "Le rucher du Grand Clos — La douceur de la nature sarthoise",
      },
    },
    en: {
      siteTitle: "Hooper Ghost Lab (en)",
      siteDescription: "The Honey Tester Lab. 🍯",
      navigation: {
        home: "Home",
        about: "About",
        contact: "Contact",
      },
      post: {
        similar: "See also",
      },
      footer: {
        legal: "Legal Notice",
      },
      sloganFixed: "From nectar to nature — your local honey.",
      map: {
        title: "The Grand Clos Apiary — The gentle nature of Sarthe",
      },
    },
  },
};

module.exports = i18n;
