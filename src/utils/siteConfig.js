// src/utils/siteConfig.js : Configuration du site adaptée ApiNest

module.exports = {
    // Domaine principal
    siteUrl:
        process.env.NODE_ENV === `production`
            ? process.env.SITE_URL || `https://apinest-72.netlify.app/` // Domaine de production
            : process.env.SITE_URL_LOCAL || `http://localhost:8000`,   // Domaine local

    // Pagination
    postsPerPage: 12, // Articles par page

    // Titres et description pour SEO
    siteTitleMeta: `ApiNest - Le rucher du Grand Clos`, // Titre principal pour les balises meta
    siteDescriptionMeta: `Découvrez nos miels artisanaux et suivez le quotidien de notre rucher en Sarthe.`, // Description SEO

    // Taille des images partagées sur réseaux sociaux
    shareImageWidth: 1000,  // Largeur idéale pour réseaux sociaux
    shareImageHeight: 523,  // Ratio paysage standard

    // Manifest & favicon
    shortTitle: `ApiNest`,         // Nom court pour le manifest
    siteIcon: `favicon.png`,       // Logo pour SEO, RSS, manifest

    // Couleurs liées au thème (cohérence avec app.css)
    backgroundColor: `#f6f8f9`,    // Couleur de fond globale
    themeColor: `#3eb0ef`,         // Couleur principale (CTA, liens)
};
