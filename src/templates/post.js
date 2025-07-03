// src/templates/post.js

import * as React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Layout } from "../components/common";
import { MetaData } from "../components/common/meta";
import SimilarPosts from "../components/common/SimilarPosts";

/**
 * Single post view (/:slug or /en/:slug)
 */
const Post = ({ data, location }) => {
  const post = data?.allGhostPost?.nodes?.[0] || null;
  const similarPosts = data?.similarPosts?.nodes || [];

  if (!post) {
    return (
      <Layout>
        <div className="container">
          <h1>Erreur : article introuvable</h1>
          <p>Vérifie que le slug est correct.</p>
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
                <img src={post.feature_image} alt={post.title} />
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

          {similarPosts.length > 0 && <SimilarPosts posts={similarPosts} />}
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
    }),
    similarPosts: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          slug: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          feature_image: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  location: PropTypes.object.isRequired,
};

export default Post;

// Requête GraphQL avec filtrage par slug ET par langue
export const postQuery = graphql`
  query GhostPostBySlug($slug: String!, $lang: String!) {
    allGhostPost(
      filter: {
        slug: { eq: $slug }
        fields: { lang: { eq: $lang } }
      }
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

    similarPosts: allGhostPost(
      filter: {
        slug: { ne: $slug }
        fields: { lang: { eq: $lang } }
      }
    ) {
      nodes {
        slug
        title
        feature_image
      }
    }
  }
`;
