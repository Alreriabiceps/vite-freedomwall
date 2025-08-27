import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  Shield,
} from "lucide-react";
import PostCard from "../components/PostCard";
import { getUserIdentifier } from "../utils/userIdentifier";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();

    // Listen for posts modification events
    const handlePostsModified = () => {
      fetchPosts();
    };

    window.addEventListener("postsModified", handlePostsModified);
    return () =>
      window.removeEventListener("postsModified", handlePostsModified);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.POSTS);
      if (response.ok) {
        const data = await response.json();
        // Add userLiked property to each post
        const postsWithUserLiked = data.map((post) => ({
          ...post,
          userLiked: false, // This will be updated when we implement proper like tracking
        }));
        setPosts(postsWithUserLiked);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const userId = getUserIdentifier();
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POSTS, `/${postId}/like`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Update the post's like count and userLiked status
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: result.likes,
                  userLiked: result.liked,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleReport = async (postId) => {
    try {
      const userId = getUserIdentifier();
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POSTS, `/${postId}/report`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (response.ok) {
        // Refresh posts to show updated report count
        fetchPosts();
      }
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Comic_Sans_MS']">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 font-['Comic_Sans_MS']">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="mb-4 md:mb-6">
          <img
            src="/src/assets/image.png"
            alt="IS Logo"
            className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full shadow-xl"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
          IS Freedom Wall
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-['Comic_Sans_MS'] max-w-2xl md:max-w-3xl mx-auto px-4 md:px-0">
          A simple, anonymous space for students to express their thoughts
          freely.
        </p>
      </div>

      {/* Posts Section */}
      <div className="space-y-4 md:space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 font-['Comic_Sans_MS'] text-lg">
              No posts yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onReport={handleReport}
            />
          ))
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8 md:mt-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 font-['Comic_Sans_MS']">
            Ready to express yourself?
          </h3>
          <p className="text-gray-300 mb-4 md:mb-6 font-['Comic_Sans_MS'] text-sm md:text-base max-w-2xl mx-auto px-4 md:px-0">
            Start sharing your thoughts anonymously with your school community!
          </p>
          <a
            href="/create"
            className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl transition-colors transform hover:scale-105 inline-flex items-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
          >
            Write a Post
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
