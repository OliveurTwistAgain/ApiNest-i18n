// src/utils/rss/generate-feed.js : Création du flux RSS

const cheerio = require(`cheerio`);

const getOptimizedImageUrl = (originalUrl, width = 300) => {
    return originalUrl.replace(
        /\/content\/images\/(?!size\/)/,
        `/content/images/size/w${width}/`
    );
};

const generateItem = (siteUrl, post) => {
    const itemUrl = post.canonical_url || `${siteUrl}/${post.slug}/`;
    const maxLength = 300;

    // Limiter l'extrait à 300 caractères, avec ajout de "…" si coupé
    const excerpt =
        post.excerpt && post.excerpt.length > maxLength
            ? post.excerpt.slice(0, maxLength).trim() + '…'
            : post.excerpt;

    const html = post.html;
    const htmlContent = cheerio.load(html, {
        decodeEntities: false,
        xmlMode: true,
    });

    const item = {
        title: post.title,
        description: excerpt,
        guid: post.id,
        url: itemUrl,
        date: post.published_at,
        categories: post.tags
            .filter((tag) => tag.visibility === "public")
            .map((tag) => tag.name),
        author: post.primary_author ? post.primary_author.name : null,
        custom_elements: [],
    };

    // Supprimer toutes les images (figure ou img) dans le contenu HTML pour éviter doublons
    htmlContent("figure.kg-card.kg-image-card").remove();
    htmlContent("img").remove();

    // Ajouter uniquement une image optimisée en haut (si elle existe)
    if (post.feature_image) {
        const optimizedImage = getOptimizedImageUrl(post.feature_image, 300);

        item.custom_elements.push({
            "media:content": {
                _attr: {
                    url: optimizedImage,
                    medium: `image`,
                },
            },
        });

        htmlContent("p")
            .first()
            .before(`<img src="${optimizedImage}" alt="${post.title}" width="300" />`);
    }

    item.custom_elements.push({
        "content:encoded": {
            _cdata: htmlContent.html(),
        },
    });

    return item;
};

const generateRSSFeed = (siteConfig) => {
    return {
        title: `No title`,
        serialize: ({ query: { allGhostPost } }) =>
            allGhostPost.edges.map((edge) =>
                Object.assign({}, generateItem(siteConfig.siteUrl, edge.node))
            ),
        setup: ({ query: { allGhostSettings } }) => {
            const siteTitle = allGhostSettings.edges[0].node.title || `No Title`;
            const siteDescription =
                allGhostSettings.edges[0].node.description || `No Description`;
            return {
                title: siteTitle,
                description: siteDescription,
                generator: `Ghost 2.9`,
                feed_url: `${siteConfig.siteUrl}/rss/`,
                site_url: `${siteConfig.siteUrl}/`,
                image_url: `${siteConfig.siteUrl}/${siteConfig.siteIcon}`,
                ttl: `60`,
                custom_namespaces: {
                    content: `http://purl.org/rss/1.0/modules/content/`,
                    media: `http://search.yahoo.com/mrss/`,
                },
            };
        },
        query: `
        {
            allGhostPost(sort: {order: DESC, fields: published_at}) {
                edges {
                    node {
                        id
                        title
                        slug
                        featured
                        feature_image
                        created_at
                        published_at
                        updated_at
                        excerpt
                        meta_title
                        meta_description
                        authors { name }
                        primary_author { name }
                        tags { name visibility }
                        html
                        url
                        canonical_url
                    }
                }
            }
        }
        `,
        output: `/rss.xml`,
    };
};

module.exports = generateRSSFeed;
