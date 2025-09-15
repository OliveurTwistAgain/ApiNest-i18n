// gatsby-config.js

require("dotenv").config({ path: `.env` });

const path = require("path");
const config = require("./src/utils/siteConfig");
const generateRSSFeed = require("./src/utils/rss/generate-feed");
const i18n = require("./src/utils/i18n-config");

const {
  GHOST_API_URL,
  GHOST_CONTENT_API_KEY,
  SITE_URL,
  SITE_URL_LOCAL,
} = process.env;

if (!GHOST_API_URL || !GHOST_CONTENT_API_KEY) {
  throw new Error(`GHOST_API_URL and GHOST_CONTENT_API_KEY must be set in your .env file.`);
}

if (process.env.NODE_ENV === "production" && config.siteUrl === "http://localhost:8000" && !SITE_URL) {
  throw new Error(
    `In production, siteUrl must not be localhost. Set SITE_URL in your .env file or fix siteConfig.`
  );
}

module.exports = {
  siteMetadata: {
    title: config.siteTitleMeta,
    description: config.siteDescriptionMeta,
    siteUrl:
      process.env.NODE_ENV === "development"
        ? SITE_URL_LOCAL
        : SITE_URL || config.siteUrl,
    language: i18n.defaultLang,
  },
  trailingSlash: "always",
  plugins: [
    // Filesystem
    {
      resolve: `gatsby-source-filesystem`,
      options: { path: path.join(__dirname, `src`, `pages`), name: `pages` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { path: path.join(__dirname, `src`, `images`), name: `images` },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,

    // Ghost CMS
    {
      resolve: `gatsby-source-ghost`,
      options: { apiUrl: GHOST_API_URL, contentApiKey: GHOST_CONTENT_API_KEY },
    },

    // Manifest
    {
      resolve: `gatsby-plugin-ghost-manifest`,
      options: {
        short_name: config.shortTitle,
        start_url: `/`,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: `minimal-ui`,
        icon: `static/${config.siteIcon}`,
        legacy: true,
        query: `
          { allGhostSettings { edges { node { title description } } } }
        `,
      },
    },

    // RSS
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `{ allGhostSettings { edges { node { title description } } } }`,
        feeds: [generateRSSFeed(config)],
      },
    },

    // Advanced Sitemap (tout contenu dans un seul sitemap)
    {
      resolve: `gatsby-plugin-advanced-sitemap`,
      options: {
        addUncaughtPages: true,
        createLinkInHead: true,
        output: "/sitemap-all.xml", // ← Sitemap unique
        sitemapIndexTitle: "Sitemap (pages + posts + tags + authors)",
        exclude: [
          "/dev-404-page",
          "/404",
          "/404.html",
          "/offline-plugin-app-shell-fallback",
        ],
        resolveSiteUrl: () =>
          process.env.NODE_ENV === "development"
            ? SITE_URL_LOCAL
            : SITE_URL || config.siteUrl,
        resolvePages: ({ allGhostPost, allGhostPage, allGhostTag, allGhostAuthor }) => {
          const mapNode = (node) => {
            const url = node?.url || node?.fields?.slug;
            if (!url) return null;
            return { path: url.replace(/^\/|\/$/, "") };
          };
          return [
            ...allGhostPost.edges.map(({ node }) => mapNode(node)).filter(Boolean),
            ...allGhostPage.edges.map(({ node }) => mapNode(node)).filter(Boolean),
            ...allGhostTag.edges.map(({ node }) => mapNode(node)).filter(Boolean),
            ...allGhostAuthor.edges.map(({ node }) => mapNode(node)).filter(Boolean),
          ];
        },
      },
    },

    `gatsby-plugin-catch-links`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-offline`,
  ],
};
