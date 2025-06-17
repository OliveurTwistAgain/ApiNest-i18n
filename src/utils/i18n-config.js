// traductions fixes pour le site web ApiNest

const i18n = {
  defaultLanguage: "fr",
  languages: ["fr", "en"],
  defaultPath: "/", // Racine pour langue par défaut
  translations: {
    fr: {
      siteTitle: "ApiNest — Miel Artisanal",
      siteDescription: "Miel local et artisanal récolté avec passion dans la Sarthe.",
      navigation: {
        home: "Accueil",
        about: "À propos",
        contact: "Contact",
      },
      footer: {
        legal: "Mentions légales",
      },
      sloganFixed: "Du nectar à l'authenticité — votre miel local.",
    },
    en: {
      siteTitle: "ApiNest — Artisan Honey",
      siteDescription: "Local, handcrafted honey made with passion in Sarthe, France.",
      navigation: {
        home: "Home",
        about: "About",
        contact: "Contact",
      },
      footer: {
        legal: "Legal Notice",
      },
      sloganFixed: "From nectar to nature — your local honey.",
    },
  },
};

module.exports = i18n;
