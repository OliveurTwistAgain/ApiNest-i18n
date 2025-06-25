// src/templates/archive-fr.js

import React from "react"
import Layout from "../components/common/Layout"
import PostCard from "../components/common/PostCard"
import { graphql } from "gatsby"

const ArchivePage = ({ data, location }) => {
  const posts = data.allGhostPost.edges

  return (
    <Layout location={location}>
      <section className="post-feed archive">
        <h1 className="page-title">Archives</h1>
        {posts.length === 0 ? (
          <p>Aucun article trouvé.</p>
        ) : (
          <div className="post-grid">
            {posts.map(({ node }) => (
              <PostCard key={node.slug} post={node} size="small" />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}

export default ArchivePage

export const pageQuery = graphql`
  query ArchiveFrQuery($skip: Int!, $limit: Int!) {
    allGhostPost(
      sort: { order: DESC, fields: [published_at] }
      limit: $limit
      skip: $skip
      filter: { slug: { regex: "/^(?!en-)/" } }
    ) {
      edges {
        node {
          title
          slug
          excerpt
          feature_image
          published_at
          primary_author {
            name
            slug
          }
        }
      }
    }
  }
`
