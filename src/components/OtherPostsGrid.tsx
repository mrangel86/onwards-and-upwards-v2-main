
import React from "react";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import { format } from "date-fns";

type Post = {
  id: string;
  title: string;
  author: string | null;
  hero_image_url: string | null;
  excerpt: string | null;
  content?: string | null;
  created_at: string;
  slug: string;
  published?: boolean;
};

type OtherPostsGridProps = {
  posts: Post[];
};

const OtherPostsGrid: React.FC<OtherPostsGridProps> = ({ posts = [] }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Function to create excerpt from post content
  const createExcerpt = (post: Post) => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content) {
      // Strip HTML tags and limit to ~120 chars
      const strippedContent = post.content.replace(/<[^>]*>/g, '');
      return strippedContent.length > 120 
        ? `${strippedContent.substring(0, 120)}...` 
        : strippedContent;
    }
    
    return "Click to see more about this adventure...";
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-playfair text-2xl font-bold mb-8 text-primary">Other Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link to={`/posts/${post.slug}`} key={post.id} className="no-underline">
            <BlogCard
              title={post.title}
              author={post.author || "Anonymous"}
              image={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80"}
              excerpt={createExcerpt(post)}
              date={formatDate(post.created_at)}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OtherPostsGrid;
