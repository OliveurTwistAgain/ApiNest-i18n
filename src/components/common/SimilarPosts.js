// src/components/common/SimilarPosts.js

import React, { useContext } from "react";
import PropTypes from "prop-types";
import PostCard from "./PostCard";
import { useLanguage } from "../../utils/languageContext";
import i18n from "../../utils/i18n-config";

// Fonction de tirage aléatoire sans répétition (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SimilarPosts = ({ posts }) => {
  const { language } = useLanguage();
  const t = i18n.translations[language];

  if (!posts || posts.length === 0) return null;

  // Tirage aléatoire de 3 posts
  const randomPosts = shuffleArray(posts).slice(0, 3);

  return (
    <div className="similar-posts">
      <h3>{t.post.similar}</h3>
      <div className="similar-posts-grid">
        {randomPosts.map((post) => (
          <PostCard
            key={post.slug || post.id}
            post={{
              slug: post.slug,
              title: post.title || "(Sans titre)",
              feature_image: post.feature_image || null,
            }}
          />
        ))}
      </div>
    </div>
  );
};

SimilarPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
      feature_image: PropTypes.string,
    })
  ).isRequired,
};

export default SimilarPosts;
