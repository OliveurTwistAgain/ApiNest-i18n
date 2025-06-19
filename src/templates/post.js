// src/templates/post.js

import * as React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import { Layout } from "../components/common";
import { MetaData } from "../components/common/meta";

/**
 * Single post view (/:slug or /en/:slug)
 *
 * This file renders a single post and loads all the content.
 *
 */
const Post = ({ data, location, pageContext }) => {
    // On récupère le post (le premier node de la query)
    let post = data.allGhostPost.nodes[0];

    // Si pas de post (slug/lang incorrects)
    if (!post) {
        return (
            <Layout>
                <div className="container">
                    <h1>Erreur : article introuvable</h1>
                    <p>Vérifie que le slug et le tag de langue sont corrects.</p>
                </div>
            </Layout>
        );
    }

    // Optionnel : filtre côté front si nécessaire (en général côté query ça suffit)
    const lang = pageContext?.lang || 'fr';
    if (lang === 'en' && !post.slug.startsWith('en-')) {
        post = null;
    } else if (lang !== 'en' && post.slug.startsWith('en-')) {
        post = null;
    }
    if (!post) {
        return (
            <Layout>
                <div className="container">
                    <h1>Erreur : article introuvable (langue non correspondante)</h1>
                    <p>Vérifie que le slug et la langue dans l'URL sont corrects.</p>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <MetaData data={{ ghostPost: post }} location={location} type="article" />
            <Helmet>
                {post.codeinjection_styles && (
                    <style type="text/css">{post.codeinjection_styles}</style>
                )}
            </Helmet>
            <Layout>
                <div className="container">
                    <article className="content">
                        {post.feature_image && (
                            <figure className="post-feature-image">
                                <img
                                    src={post.feature_image}
                                    alt={post.title}
                                />
                            </figure>
                        )}
                        <section className="post-full-content">
                            <h1 className="content-title">{post.title}</h1>

                            <section
                                className="content-body load-external-scripts"
                                dangerouslySetInnerHTML={{ __html: post.html }}
                            />
                        </section>
                    </article>
                </div>
            </Layout>
        </>
    );
};

Post.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.shape({
            nodes: PropTypes.arrayOf(
                PropTypes.shape({
                    slug: PropTypes.string.isRequired,
                    codeinjection_styles: PropTypes.string,
                    title: PropTypes.string.isRequired,
                    html: PropTypes.string.isRequired,
                    feature_image: PropTypes.string,
                    tags: PropTypes.arrayOf(
                        PropTypes.shape({
                            name: PropTypes.string,
                            slug: PropTypes.string,
                        })
                    ),
                    primary_author: PropTypes.shape({
                        name: PropTypes.string,
                        slug: PropTypes.string,
                    }),
                })
            ),
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object,
};

export default Post;

export const postQuery = graphql`
    query GhostPostBySlug($slug: String!) {
        allGhostPost(
            filter: { slug: { eq: $slug } }
            limit: 1
        ) {
            nodes {
                slug
                title
                html
                feature_image
                codeinjection_styles
                tags {
                    name
                    slug
                }
                primary_author {
                    name
                    slug
                }
            }
        }
    }
`;
