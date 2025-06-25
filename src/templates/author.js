// src/templates/author.js

import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/common/Layout";
import PostCard from "../components/common/PostCard";

const AuthorPage = ({ data, location }) => {
  const author = data?.allGhostAuthor?.edges?.[0]?.node;

  if (!author) {
    return (
      <Layout location={location}>
        <main className="site-main">
          <h1 className="author-name">Auteur introuvable</h1>
          <p>Ce profil d’auteur est introuvable ou ne contient aucun article publié.</p>
        </main>
      </Layout>
    );
  }

  const posts = data.allGhostPost.edges.map(edge => edge.node);

  return (
    <Layout location={location}>
      <main className="site-main">
        <div className="author-profile">
          {author.profile_image && <img src={author.profile_image} alt={author.name} />}
          <h1 className="author-name">{author.name}</h1>
          {author.bio && <p>{author.bio}</p>}
        </div>

        <div className="post-feed archive">
          {posts.map(post => (
            <PostCard key={post.id} post={post} small />
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default AuthorPage;

export const pageQuery = graphql`
  query AuthorPage($authorSlug: String!) {
    allGhostAuthor(filter: { slug: { eq: $authorSlug } }) {
      edges {
        node {
          name
          slug
          bio
          profile_image
        }
      }
    }
    allGhostPost(
      sort: { order: DESC, fields: [published_at] }
      filter: { primary_author: { slug: { eq: $authorSlug } } }
    ) {
      edges {
        node {
          id
          slug
          title
          excerpt
          feature_image
        }
      }
    }
  }
`;
