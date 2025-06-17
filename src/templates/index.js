import * as React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import { Layout, PostCard, Pagination } from "../components/common";
import { MetaData } from "../components/common/meta";

// map section
import { MapSection } from "../components/common";

/**
 * Main index page (home page)
 *
 * Loads all posts from Ghost and uses pagination to navigate through them.
 * The number of posts that should appear per page can be setup
 * in /utils/siteConfig.js under `postsPerPage`.
 *
 */
const Index = ({ data, location, pageContext }) => {
    const lang = pageContext.lang || 'fr'; // Défaut : FR
    const posts = data.allGhostPost.edges
        .map(edge => edge.node)
        .filter(post => {
            return lang === 'en'
                ? post.slug.startsWith('en-')
                : !post.slug.startsWith('en-');
        });

    return (
        <>
            <MetaData location={location} />
            <Layout isHome={true}>
                <div className="container">
                    <section className="post-feed">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </div>
                {/* Map section et carte OSM en bas de page */
                <MapSection />}
            </Layout>
        </>
    );
};


Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
};

export default Index;

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
    query GhostPostQuery($limit: Int!, $skip: Int!) {
        allGhostPost(
            sort: { order: DESC, fields: [published_at] }
            limit: $limit
            skip: $skip
        ) {
            edges {
                node {
                    ...GhostPostFields
                }
            }
        }
    }
`;
