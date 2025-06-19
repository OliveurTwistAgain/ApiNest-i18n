// src/components/common/meta/MetaData.js

import * as React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import url from "url";

import config from "../../../utils/siteConfig";
import ArticleMeta from "./ArticleMeta";
import WebsiteMeta from "./WebsiteMeta";
import AuthorMeta from "./AuthorMeta";

const MetaData = ({ data, settings, title, description, image, location }) => {
    const canonical = url.resolve(config.siteUrl, location.pathname);
    const { ghostPost, ghostTag, ghostAuthor, ghostPage } = data;

    // Vérifiez que settings et les propriétés imbriquées sont définies
    let siteSettings = {};
    if (settings.allGhostSettings && settings.allGhostSettings.edges && settings.allGhostSettings.edges[0]) {
        siteSettings = settings.allGhostSettings.edges[0].node;
    }

    if (ghostPost) {
        return <ArticleMeta data={ghostPost} canonical={canonical} />;
    } else if (ghostTag) {
        return <WebsiteMeta data={ghostTag} canonical={canonical} type="Series" />;
    } else if (ghostAuthor) {
        return <AuthorMeta data={ghostAuthor} canonical={canonical} />;
    } else if (ghostPage) {
        return <WebsiteMeta data={ghostPage} canonical={canonical} type="WebSite" />;
    } else {
        title = title || config.siteTitleMeta || siteSettings.title;
        description = description || config.siteDescriptionMeta || siteSettings.description;
        image = image || siteSettings.cover_image || null;

        image = image ? url.resolve(config.siteUrl, image) : null;

        return (
            <WebsiteMeta
                data={{}}
                canonical={canonical}
                title={title}
                description={description}
                image={image}
                type="WebSite"
            />
        );
    }
};

MetaData.defaultProps = {
    data: {},
    title: null,
    description: null,
    image: null,
};

MetaData.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.object,
        ghostTag: PropTypes.object,
        ghostAuthor: PropTypes.object,
        ghostPage: PropTypes.object,
    }).isRequired,
    settings: PropTypes.shape({
        allGhostSettings: PropTypes.shape({
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.object,
                })
            ),
        }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
};

const MetaDataQuery = (props) => (
    <StaticQuery
        query={graphql`
            query GhostSettingsMetaData {
                allGhostSettings {
                    edges {
                        node {
                            title
                            description
                            cover_image
                        }
                    }
                }
            }
        `}
        render={(data) => <MetaData settings={data} {...props} />}
    />
);

export default MetaDataQuery;
