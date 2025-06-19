// src/utils/navigation-config.js : Configuration de navigation en FR et EN et menus adaptés à chaque langue

const navigation = {
    fr: [
        { label: "Accueil", path: "/" },
        { label: "À propos", path: "/a-propos" },
        { label: "Galerie", path: "/galerie" },
        { label: "Contact", path: "/contact" }
    ],
    en: [
        { label: "Home", path: "/en" },
        { label: "About", path: "/en/about" },
        { label: "Gallery", path: "/en/gallery" },
        { label: "Contact", path: "/en/contact" }
    ]
};

export default navigation;
