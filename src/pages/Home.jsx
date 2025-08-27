import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Search,
  Filter,
  TrendingUp,
  Clock,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import PostCard from "../components/PostCard";
import { getUserIdentifier } from "../utils/userIdentifier";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("engagement"); // engagement, recent, likes, comments
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    // Apply filters and search whenever posts, searchTerm, or activeFilter changes
    applyFiltersAndSearch();
  }, [posts, searchTerm, activeFilter]);

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

  const applyFiltersAndSearch = () => {
    let filtered = [...posts];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((post) => {
        const searchLower = searchTerm.toLowerCase();
        const message = post.message?.toLowerCase() || "";
        const name = post.name?.toLowerCase() || "";
        return message.includes(searchLower) || name.includes(searchLower);
      });
    }

    // Apply sorting filter
    switch (activeFilter) {
      case "engagement":
        filtered.sort((a, b) => {
          const scoreA = (a.likes || 0) + (a.comments?.length || 0) * 2;
          const scoreB = (b.likes || 0) + (b.comments?.length || 0) * 2;
          return scoreB - scoreA;
        });
        break;
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "likes":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "comments":
        filtered.sort(
          (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
        );
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
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

  const getFilterButtonClass = (filterType) => {
    return `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm font-['Comic_Sans_MS'] ${
      activeFilter === filterType
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
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
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center py-12">
          <p className="text-red-600 font-['Comic_Sans_MS']">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
        <div className="mb-4 md:mb-6">
          <img
            src="/image.png"
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

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts by content or author name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['Comic_Sans_MS']"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm font-['Comic_Sans_MS'] ${
              showFilters
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter size={16} />
            Filters
          </button>

          {showFilters && (
            <>
              <button
                onClick={() => setActiveFilter("engagement")}
                className={getFilterButtonClass("engagement")}
              >
                <TrendingUp size={16} />
                Most Popular
              </button>
              <button
                onClick={() => setActiveFilter("recent")}
                className={getFilterButtonClass("recent")}
              >
                <Clock size={16} />
                Recent
              </button>
              <button
                onClick={() => setActiveFilter("likes")}
                className={getFilterButtonClass("likes")}
              >
                <ThumbsUp size={16} />
                Most Liked
              </button>
              <button
                onClick={() => setActiveFilter("comments")}
                className={getFilterButtonClass("comments")}
              >
                <MessageCircle size={16} />
                Most Discussed
              </button>
            </>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 font-['Comic_Sans_MS']">
          Showing {filteredPosts.length} of {posts.length} posts
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>

      {/* Posts Section */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 md:py-16">
          {searchTerm ? (
            <div>
              <p className="text-gray-500 font-['Comic_Sans_MS'] text-lg mb-2">
                No posts found matching "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 hover:text-blue-700 font-medium font-['Comic_Sans_MS']"
              >
                Clear search
              </button>
            </div>
          ) : (
            <p className="text-gray-500 font-['Comic_Sans_MS'] text-lg">
              No posts yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      ) : (
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onReport={handleReport}
            />
          ))}
        </div>
      )}

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
