// src/templates/tag.js

import * as React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import { Layout, PostCard, Pagination } from "../components/common";
import { MetaData } from "../components/common/meta";

const Tag = ({ data, location, pageContext }) => {
    const tag = data.ghostTag;
    const posts = data.allGhostPost.edges.map(edge => edge.node); // ✅ Supprime le filtrage inutile

    return (
        <>
            <MetaData data={data} location={location} type="series" />
            <Layout>
                <div className="container">
                    <header className="tag-header">
                        <h1>{tag.name}</h1>
                        {tag.description && <p>{tag.description}</p>}
                    </header>
                    <section className="post-feed">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </div>
            </Layout>
        </>
    );
};

Tag.propTypes = {
    data: PropTypes.shape({
        ghostTag: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
        }),
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
};

export default Tag;

export const pageQuery = graphql`
    query GhostTagQuery($slug: String!, $limit: Int!, $skip: Int!) {
        ghostTag(slug: { eq: $slug }) {
            ...GhostTagFields
        }
        allGhostPost(
            sort: { order: DESC, fields: [published_at] }
            filter: { tags: { elemMatch: { slug: { eq: $slug } } } }
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
