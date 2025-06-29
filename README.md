# ApiNest-i18n

ApiNest-i18n est un site vitrine connecté à un CMS headless [Ghost](https://ghost.org/) hébergé sur [Pikapods](https://www.pikapods.com/) et propulsé par [Gatsby](https://www.gatsbyjs.com/) et [Netlify](https://www.netlify.com/).  
Ce projet inclut une gestion multilingue (FR/EN), une carte interactive, la météo en direct, un formulaire de contact (en cours), la navigation similaire sur les posts (en cours), un système de couvertures aléatoires à chaque chargement de page et un design responsive avec menu hamburger.

## 🚀 Démo

[dev-apinest-72.netlify.app](https://dev-apinest-72.netlify.app)

## ⚙️ Stack

-   Ghost CMS (Back headless, contenu via API)
-   Gatsby (Front, React + GraphQL)
-   Netlify (déploiement + formulaires)
-   Leaflet.js (carte interactive OpenStreetMap)
-   OpenWeather API (météo en direct)
-   Pikapod (hébergement Ghost auto-déployé)
-   Système i18n (multilingue FR/EN)

## 📦 Installation locale

```bash
git clone https://github.com/OliveurTwistAgain/ApiNest-i18n.git
cd ApiNest-i18n
npm install
npm develop
```

## 🔖 Commandes Gatsby utiles

```bash
# Démarre le site en mode développement (localhost:8000)
gatsby develop

# Génère un build de production dans le dossier public/
gatsby build

# Lance un serveur local pour prévisualiser le build (localhost:9000)
gatsby serve

# Nettoie le cache de Gatsby (utile si des erreurs persistent)
gatsby clean
```

## 🔐 Variables d’environnement

Un fichier `.env.example` est fourni pour guider.

Créez un fichier `.env` à la racine du projet en vous basant sur cet exemple. À compléter avec vos propres clés API.

## 🌍 Routes multilingues

Le site est disponible en deux langues :

-   🇫🇷 Français : `/` (page d’accueil par défaut)
-   🇬🇧 English : `/en/` (accès aux contenus en anglais)

Les slugs des articles anglais sont préfixés par `en-`.  
Exemples :

-   `/brillant/` → article en français
-   `/en-purple/` → article en anglais

## 🖼️ Couvertures aléatoires

À chaque chargement de page, une image de couverture est sélectionnée aléatoirement parmi un ensemble d’images locales (`/static/covers/`).  
Le système utilise `sessionStorage` pour mémoriser l'image de couverture pendant la navigation.

## 📄 Licence MIT

Copyright (c) 2025 - OliveurTwistAgain
