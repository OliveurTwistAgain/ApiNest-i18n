import React from "react";
import PostCard from "./PostCard";

const SimilarPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="similar-posts">
      <h3>Articles similaires</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default SimilarPosts;
