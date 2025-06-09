# ApiNest

ApiNest est un site statique généré avec Gatsby, propulsé par un CMS headless Ghost pour le contenu hébergé sur Pikapods.

## 🚀 Démo

https://dev-apinest-72.netlify.app

## 🔧 Stack

-   [Ghost CMS](https://pikapods.com) – CMS headless pour le contenu
-   [Gatsby.js](https://www.gatsbyjs.com/) – générateur statique React
-   [Netlify](https://www.netlify.com/) – déploiement automatique

## 📦 Installation rapide

```bash
git clone https://github.com/OliveurTwistAgain/ApiNest.git
cd ApiNest
yarn install
gatsby develop
```

## 🚀 Commandes utiles

```bash
gatsby develop       # Développement local
gatsby build         # Construire le site statique
gatsby clean         # Nettoyage du cache
gatsby serve         # Serveur local
```

## ⚠️ Prérequis

-   Node.js >= 18
-   Yarn

## 🧩 Intégration avec Ghost Content API

Ce site utilise la **Ghost Content API** pour récupérer dynamiquement les articles, images et métadonnées depuis un CMS Ghost hébergé sur Pikapods. L’API Ghost est accessible sur votre instance Ghost hébergée (ex. : https://votre-pod.pikapod.net).

Avantages :

-   Accès direct aux données de contenu
-   Accès direct aux images
-   Accès direct aux métadonnées des articles
-   Accès direct aux tags et auteurs

```bash
https://pikapods.com
```

## 🗂️ Structure

```bash

- `/src` — Composants React, pages, styles
- `/content` — Contenu statique ou mock
- `/gatsby-config.js` — Configuration Gatsby (plugins, Ghost API, etc.)
- `netlify.toml` — Configuration du build/deploy Netlify

```

## 📄 Licence

MIT
