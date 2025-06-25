// gatsby-node.js

const path = require(`path`);
const { postsPerPage } = require(`./src/utils/siteConfig`);
const { paginate } = require(`gatsby-awesome-pagination`);

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

  // ⚠️ Templates d'archives séparés par langue
  const archiveFrTemplate = path.resolve(`./src/templates/archive-fr.js`);
  const archiveEnTemplate = path.resolve(`./src/templates/archive-en.js`);

  const getLangFromSlug = (slug) => (slug.startsWith('en-') ? 'en' : 'fr');
  const getLocalizedPath = (slug) => `/${slug}/`;

  // Pages CMS
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

  // Posts
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

  // Tags (pagination)
  tags.forEach(({ node }) => {
    const lang = getLangFromSlug(node.slug);
    const url = `/${node.slug}/`;

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

  // Authors (sans pagination, et sans filtrage de langue)
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


  // Home FR (pagination)
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

  // Home EN (pagination)
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

  // Archives FR (avec template dédié)
  paginate({
    createPage,
    items: posts.filter(({ node }) => !node.slug.startsWith('en-')),
    itemsPerPage: postsPerPage,
    component: archiveFrTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/archives/` : `/archives/page/${pageNumber + 1}/`,
    context: {
      language: 'fr',
    },
  });

  // Archives EN (avec template dédié)
  paginate({
    createPage,
    items: posts.filter(({ node }) => node.slug.startsWith('en-')),
    itemsPerPage: postsPerPage,
    component: archiveEnTemplate,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? `/en-archives/` : `/en-archives/page/${pageNumber + 1}/`,
    context: {
      language: 'en',
    },
  });
};

// Webpack fallback pour 'url' (nécessaire pour certains packages)
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: { url: require.resolve("url/") },
    },
  });
};
