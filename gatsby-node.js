// gatsby-node.js

/**
 * Ce fichier est utilisé pour générer dynamiquement les pages des articles, tags, auteurs et archives
 * en utilisant les APIs Node de Gatsby.
 * 
 * Il supporte un contenu bilingue en filtrant les articles selon le préfixe du slug :
 * - Les articles en anglais commencent par "en-"
 * - Les articles en français ne commencent pas par "en-"
 */


const path = require("path");
const { paginate } = require("gatsby-awesome-pagination");

// Ici on récupère la constante postsPerPage depuis siteConfig.js
const { postsPerPage } = require(`./src/utils/siteConfig`);

/**
 * Détermine la langue d'après le slug
 * @param {string} slug
 * @returns {'en'|'fr'}
 */
const getLangFromSlug = (slug) => (slug.startsWith("en-") ? "en" : "fr");

/**
 * Renvoie une regex permettant de filtrer par langue selon slug
 * @param {'en'|'fr'} lang
 * @returns {string} regex string pour GraphQL
 */
const getLangRegex = (lang) => {
  return lang === "en" ? "^en-" : "^(?!en-)";
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Récupération des données Ghost CMS
  const result = await graphql(`
    {
      allGhostPost(sort: { order: ASC, fields: published_at }) {
        edges {
          node {
            slug
          }
        }
      }
      allGhostTag(sort: { order: ASC, fields: name }) {
        edges {
          node {
            slug
            postCount
          }
        }
      }
      allGhostAuthor(sort: { order: ASC, fields: name }) {
        edges {
          node {
            slug
            postCount
          }
        }
      }
      allGhostPage(sort: { order: ASC, fields: published_at }) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const posts = result.data.allGhostPost.edges;
  const tags = result.data.allGhostTag.edges;
  const authors = result.data.allGhostAuthor.edges;
  const pages = result.data.allGhostPage.edges;

  // Résolution des chemins vers les templates
  const indexTemplate = path.resolve(`./src/templates/index.js`);
  const tagsTemplate = path.resolve(`./src/templates/tag.js`);
  const authorTemplate = path.resolve(`./src/templates/author.js`);
  const pageTemplate = path.resolve(`./src/templates/page.js`);
  const postTemplate = path.resolve(`./src/templates/post.js`);
  const archiveFrTemplate = path.resolve(`./src/templates/archive-fr.js`);
  const archiveEnTemplate = path.resolve(`./src/templates/archive-en.js`);

  // Fonction utilitaire pour construire le chemin URL complet
  const getLocalizedPath = (slug) => `/${slug}/`;

  // --- Création des pages CMS simples ---
  pages.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = getLocalizedPath(node.slug);

    createPage({
      path: url,
      component: pageTemplate,
      context: {
        slug: node.slug,
        lang,
      },
    });
  });

  // --- Création des pages de posts ---
  posts.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = getLocalizedPath(node.slug);
    const langRegex = getLangRegex(lang);

    createPage({
      path: url,
      component: postTemplate,
      context: {
        slug: node.slug,
        lang,
        langRegex,
      },
    });
  });

  // --- Création des pages de tags avec pagination ---
  tags.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = `/${node.slug}/`;

    // Ici on ne filtre pas par langue sur les posts liés au tag,
    // mais on peut filtrer dans la requête GraphQL dans tag.js via le slug/langue
    paginate({
      createPage,
      items: Array.from({ length: node.postCount || 0 }),
      itemsPerPage: postsPerPage,
      component: tagsTemplate,
      pathPrefix: ({ pageNumber }) =>
        pageNumber === 0 ? url : `${url}page/${pageNumber + 1}/`,
      context: {
        slug: node.slug,
        lang,
      },
    });
  });

  // --- Création des pages auteur (sans pagination ni filtre langue) ---
  authors.forEach(({ node }) => {
    const url = `/${node.slug}/`;

    createPage({
      path: url,
      component: authorTemplate,
      context: {
        slug: node.slug,
        authorSlug: node.slug,
      },
    });
  });

  // --- Pagination homepage FR ---
  paginate({
    createPage,
    items: posts.filter(({ node }) => !node.slug.startsWith("en-")),
    itemsPerPage: postsPerPage,
    component: indexTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/` : `/page/${pageNumber + 1}/`,
    context: {
      lang: "fr",
    },
  });

  // --- Pagination homepage EN ---
  paginate({
    createPage,
    items: posts.filter(({ node }) => node.slug.startsWith("en-")),
    itemsPerPage: postsPerPage,
    component: indexTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/en/` : `/en/page/${pageNumber + 1}/`,
    context: {
      lang: "en",
    },
  });

  // --- Pagination archives FR (template dédié) ---
  paginate({
    createPage,
    items: posts.filter(({ node }) => !node.slug.startsWith("en-")),
    itemsPerPage: postsPerPage,
    component: archiveFrTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/archives/` : `/archives/page/${pageNumber + 1}/`,
    context: {
      language: "fr",
    },
  });

  // --- Pagination archives EN (template dédié) ---
  paginate({
    createPage,
    items: posts.filter(({ node }) => node.slug.startsWith("en-")),
    itemsPerPage: postsPerPage,
    component: archiveEnTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/en-archives/` : `/en-archives/page/${pageNumber + 1}/`,
    context: {
      language: "en",
    },
  });
};

// Ajout champs "lang" et "random" aux nodes GhostPost et GhostPage pour simplifier les requêtes GraphQL
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  // Pour les posts : lang + random
  if (node.internal.type === "GhostPost") {
    const lang = node.slug.startsWith("en-") ? "en" : "fr";
    const random = Math.random();

    createNodeField({ node, name: "lang", value: lang });
    createNodeField({ node, name: "random", value: random });
  }

  // Pour les pages : lang uniquement
  if (node.internal.type === "GhostPage") {
    const lang = node.slug.startsWith("en-") ? "en" : "fr";
    createNodeField({ node, name: "lang", value: lang });
  }
};

// Fallback webpack pour certains packages
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        url: require.resolve("url/"),
      },
    },
  });
};
