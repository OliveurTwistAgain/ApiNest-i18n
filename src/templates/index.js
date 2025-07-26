//src/templates/index.js

import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/common/Layout"
import PostCard from "../components/common/PostCard"
import SEO from "../components/common/SEO"
import MapSection from "../components/common/MapSection"

const IndexTemplate = ({ data, location, pageContext }) => {
  const posts = data.allGhostPost.edges
    .map(edge => edge.node)
    .filter(post => {
      // Langue FR ou EN selon le contexte (FR : pas de prefixe, EN : prefixe en-)
      if (pageContext.lang === "en") return post.slug.startsWith("en-")
      return !post.slug.startsWith("en-")
    })

  // Sélection du post vedette (featured) s'il existe
  const featuredPost = posts.find(post => post.featured) || posts[0]

  // Retirer le post vedette de la liste pour éviter les doublons
  const remainingPosts = posts.filter(p => p.id !== featuredPost.id)

  // Posts moyens (2 suivants) et petits (le reste jusqu'à 9)
  const mediumPosts = remainingPosts.slice(0, 2)
  const smallPosts = remainingPosts.slice(2, 11)

  return (
    <Layout location={location} showFooter={true} language={pageContext.lang}>
      <SEO title="" />
      <main className="post-feed">
        {/* Bloc vedette */}
        <section className="post-hero hero-grid">
          <PostCard post={featuredPost} type="hero" />
        </section>

        {/* Bloc moyens */}
        {mediumPosts.length > 0 && (
          <section className="post-medium medium-grid">
            {mediumPosts.map(post => (
              <PostCard key={post.id} post={post} type="medium" />
            ))}
          </section>
        )}

        {/* Bloc petits */}
        {smallPosts.length > 0 && (
          <section className="post-small small-grid">
            {smallPosts.map(post => (
              <PostCard key={post.id} post={post} type="small" />
            ))}
          </section>
        )}
      </main>
      {/* Section de la carte */}
      <MapSection lang={pageContext.lang} />
    </Layout>
  )
}

export default IndexTemplate

export const pageQuery = graphql`
  query GhostHomeQuery {
    allGhostPost(
      sort: { fields: [published_at], order: DESC }
      limit: 18
    ) {
      edges {
        node {
          id
          title
          slug
          featured
          feature_image
          excerpt
          published_at
          reading_time
          primary_tag {
            name
            slug
          }
          authors {
            name
            profile_image
          }
        }
      }
    }
  }
`
