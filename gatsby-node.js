// gatsby-node.js

const path = require(`path`);
const { postsPerPage } = require(`./src/utils/siteConfig`);
const { paginate } = require(`gatsby-awesome-pagination`);

/**
 * Crée dynamiquement les pages du site à partir du contenu Ghost :
 * posts, pages, tags, auteurs — avec support multilingue fr/en basé sur les slugs.
 */

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

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

  const tags = result.data.allGhostTag.edges;
  const authors = result.data.allGhostAuthor.edges;
  const pages = result.data.allGhostPage.edges;
  const posts = result.data.allGhostPost.edges;

  const indexTemplate = path.resolve(`./src/templates/index.js`);
  const tagsTemplate = path.resolve(`./src/templates/tag.js`);
  const authorTemplate = path.resolve(`./src/templates/author.js`);
  const pageTemplate = path.resolve(`./src/templates/page.js`);
  const postTemplate = path.resolve(`./src/templates/post.js`);

  // Détermine la langue d'après le slug : "en-" préfixe -> anglais, sinon français
  const getLangFromSlug = (slug) => slug.startsWith('en-') ? 'en' : 'fr';

  // IMPORTANT : on garde le slug tel quel (avec "en-" si anglais) pour construire l'URL,
  // car Ghost stocke les slugs avec tiret (ex: "en-honey") et non en dossiers "en/honey"
  const getLocalizedPath = (slug) => `/${slug}/`;

  // --- Création des pages (Ghost Pages) ---
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

  // --- Création des posts ---
  posts.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = getLocalizedPath(node.slug);

    createPage({
      path: url,
      component: postTemplate,
      context: {
        slug: node.slug,
        lang,
      },
    });
  });

  // --- Création des pages tag paginées ---
  tags.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = `/${node.slug}/`; // slug déjà avec "en-" si anglais

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

  // --- Création des pages author paginées ---
  authors.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = `/${node.slug}/`;

    paginate({
      createPage,
      items: Array.from({ length: node.postCount || 0 }),
      itemsPerPage: postsPerPage,
      component: authorTemplate,
      pathPrefix: ({ pageNumber }) =>
        pageNumber === 0 ? url : `${url}page/${pageNumber + 1}/`,
      context: {
        slug: node.slug,
        lang,
      },
    });
  });

  // --- Création de la page d'accueil FR avec pagination ---
  paginate({
    createPage,
    items: posts.filter(({ node }) => !node.slug.startsWith('en-')),
    itemsPerPage: postsPerPage,
    component: indexTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/` : `/page/${pageNumber + 1}/`,
    context: {
      lang: 'fr',
    },
  });

  // --- Création de la page d'accueil EN avec pagination ---
  paginate({
    createPage,
    items: posts.filter(({ node }) => node.slug.startsWith('en-')),
    itemsPerPage: postsPerPage,
    component: indexTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/en/` : `/en/page/${pageNumber + 1}/`,
    context: {
      lang: 'en',
    },
  });
};

// Netlify fallback pour "url" module (parfois requis)
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: { url: require.resolve("url/") },
    },
  });
};
