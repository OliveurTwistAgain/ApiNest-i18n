import * as React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import _ from "lodash";
import { StaticQuery, graphql } from "gatsby";
import url from "url";

import ImageMeta from "./ImageMeta";
import config from "../../../utils/siteConfig";

const WebsiteMeta = ({ data, canonical, title, description, image, type }) => {
    const settings = data?.allGhostSettings?.edges?.[0]?.node || {};

    const publisherLogo = url.resolve(
        config.siteUrl,
        settings.logo || config.siteIcon
    );
    let shareImage = image || _.get(data, "feature_image") || settings.cover_image;

    shareImage = shareImage ? url.resolve(config.siteUrl, shareImage) : null;

    const metaDescription =
        description ||
        data?.meta_description ||
        data?.description ||
        config.siteDescriptionMeta ||
        settings.description;

    const metaTitle = `${
        title || data?.meta_title || data?.name || data?.title || ""
    } - ${settings.title || config.siteTitleMeta}`;

    const jsonLd = {
        "@context": `https://schema.org/`,
        "@type": type,
        url: canonical,
        image: shareImage
            ? {
                  "@type": `ImageObject`,
                  url: shareImage,
                  width: config.shareImageWidth,
                  height: config.shareImageHeight,
              }
            : undefined,
        publisher: {
            "@type": `Organization`,
            name: settings.title || config.siteTitleMeta,
            logo: {
                "@type": `ImageObject`,
                url: publisherLogo,
                width: 60,
                height: 60,
            },
        },
        mainEntityOfPage: {
            "@type": `WebPage`,
            "@id": config.siteUrl,
        },
        description: metaDescription,
    };

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonical} />
                <meta property="og:site_name" content={settings.title} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={canonical} />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:url" content={canonical} />
                {settings.twitter && (
                    <meta
                        name="twitter:site"
                        content={`https://twitter.com/${settings.twitter.replace(
                            /^@/,
                            ""
                        )}/`}
                    />
                )}
                {settings.twitter && (
                    <meta name="twitter:creator" content={settings.twitter} />
                )}
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd, undefined, 4)}
                </script>
            </Helmet>
            <ImageMeta image={shareImage} />
        </>
    );
};

WebsiteMeta.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string,
        meta_title: PropTypes.string,
        meta_description: PropTypes.string,
        name: PropTypes.string,
        feature_image: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    canonical: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    type: PropTypes.oneOf([`WebSite`, `Series`]).isRequired,
};

const WebsiteMetaQuery = (props) => (
    <StaticQuery
        query={graphql`
            query GhostSettingsWebsiteMeta {
                allGhostSettings {
                    edges {
                        node {
                            title
                            description
                            logo
                            twitter
                            cover_image
                        }
                    }
                }
            }
        `}
        render={(data) => <WebsiteMeta data={data} {...props} />}
    />
);

export default WebsiteMetaQuery;
