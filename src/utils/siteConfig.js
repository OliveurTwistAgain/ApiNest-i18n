// src/utils/siteConfig.js : Configuration du site

module.exports = {
    siteUrl:
        process.env.NODE_ENV === `production`
            ? process.env.SITE_URL || `https://dev-apinest-72.netlify.app/` // Site domain. No trailing slash! (e.g. https://www.example.com)
            : process.env.SITE_URL_LOCAL || `http://localhost:8000`, // Local dev domain. No trailing slash! (e.g. http://localhost:8000)

    postsPerPage: 12, // Number of posts shown on paginated pages (changes this requires sometimes to delete the cache)

    siteTitleMeta: `Ghost Gatsby Lab`, // This allows an alternative site title for meta data for pages.
    siteDescriptionMeta: `Un site fr/en genéré avec Ghost and Gatsby`, // This allows an alternative site description for meta data for pages.

    shareImageWidth: 1000, // Change to the width of your default share image
    shareImageHeight: 523, // Change to the height of your default share image

    shortTitle: `Ghost`, // Used for App manifest e.g. Mobile Home Screen
    siteIcon: `favicon.png`, // Logo in /static dir used for SEO, RSS, and App manifest
    backgroundColor: `#e9e9e9`, // Used for Offline Manifest
    themeColor: `#15171A`, // Used for Offline Manifest
};
