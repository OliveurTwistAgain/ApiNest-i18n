// src/components/common/PostCard.js

import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

/**
 * Tronquer un texte à un nombre de mots maximum
 * Évite les coupures au milieu d’un mot ou d’un emoji
 */
function truncateWords(text, wordLimit) {
    if (!text || typeof text !== "string") return "";
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(" ") + "…"
        : text;
}

/**
 * Composant PostCard
 * S’adapte au type de carte : hero, medium, small
 */
const PostCard = ({ post, hero, medium, small }) => {
    const url = `/${post.slug}/`;

    // Extrait tronqué à 30 mots max
    const excerpt = truncateWords(post.excerpt, 30);

    // Classes dynamiques selon le type
    const cardClass = [
        "post-card",
        hero && "post-card-hero",
        medium && "post-card-medium",
        small && "post-card-small",
    ].filter(Boolean).join(" ");

    return (
        <Link to={url} className={cardClass}>
            {post.feature_image && (
                <div
                    className="post-card-image"
                    style={{ backgroundImage: `url(${post.feature_image})` }}
                    role="img"
                    aria-label={post.title}
                />
            )}

            <header className="post-card-header">
                <h2 className="post-card-title">{post.title}</h2>
            </header>

            <section className="post-card-excerpt">
                {excerpt}
            </section>
        </Link>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        feature_image: PropTypes.string,
        featured: PropTypes.bool,
        excerpt: PropTypes.string.isRequired,
        primary_author: PropTypes.shape({
            name: PropTypes.string.isRequired,
            profile_image: PropTypes.string,
        }),
    }).isRequired,

    // Props logiques (hero, medium, small)
    hero: PropTypes.bool,
    medium: PropTypes.bool,
    small: PropTypes.bool,
};

export default PostCard;
