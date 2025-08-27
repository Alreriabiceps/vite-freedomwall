import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  BarChart3,
} from "lucide-react";
import PostCard from "../components/PostCard";
import PollCard from "../components/PollCard";
import AnnouncementCard from "../components/AnnouncementCard";
import { getUserIdentifier } from "../utils/userIdentifier";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPolls, setShowPolls] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchPolls();
    fetchAnnouncements();

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

  const fetchPolls = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.POLLS_TRENDING);
      if (response.ok) {
        const data = await response.json();
        setPolls(data);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS);
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handlePollVoteSubmitted = (updatedPoll) => {
    // Update the poll in the local state
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll._id === updatedPoll._id ? updatedPoll : poll
      )
    );
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

      {/* Main Content */}
      <div className="mb-8">
        {/* Announcements Section */}
        {announcements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS'] flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id}
                  announcement={announcement}
                />
              ))}
            </div>
          </div>
        )}

        {/* Polls Section */}
        {polls.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS'] flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                Active Polls
              </h2>
              <button
                onClick={() => setShowPolls(!showPolls)}
                className="text-purple-600 hover:text-purple-700 font-medium font-['Comic_Sans_MS']"
              >
                {showPolls ? "Hide" : "Show"} Polls
              </button>
            </div>

            {showPolls && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {polls.map((poll) => (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    onVoteSubmitted={handlePollVoteSubmitted}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        {posts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 font-['Comic_Sans_MS'] text-lg">
              No posts yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onReport={handleReport}
              />
            ))}
          </div>
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/create"
              className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl transition-colors transform hover:scale-105 inline-flex items-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
            >
              Write a Post
            </a>
            <a
              href="/create-poll"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors transform hover:scale-105 inline-flex items-center gap-2 font-['Comic_Sans_MS'] font-semibold text-sm md:text-base"
            >
              <BarChart3 size={18} />
              Create Poll
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
