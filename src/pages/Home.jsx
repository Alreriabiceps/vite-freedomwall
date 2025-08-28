import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  BarChart3,
  TrendingUp,
  Clock,
  Coffee,
} from "lucide-react";
import PostCard from "../components/PostCard";
import PollCard from "../components/PollCard";

import {
  getUserIdentifier,
  markPostAsLiked,
  markPostAsUnliked,
  hasUserLikedPost,
} from "../utils/userIdentifier";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";
import { PostSkeleton, PollSkeleton } from "../components/SkeletonLoading";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SlideIn,
} from "../components/AnimatedComponents";
import TextType from "../components/TextAnimations/TextType/TextType";
import AdSense from "../components/AdSense";

function Home() {
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPolls, setShowPolls] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // New: sorting state

  // Infinite scroll states
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    fetchPosts();
    fetchPolls();

    // Listen for posts modification events
    const handlePostsModified = () => {
      fetchPosts();
    };

    window.addEventListener("postsModified", handlePostsModified);
    return () =>
      window.removeEventListener("postsModified", handlePostsModified);
  }, []);

  // Refetch posts when sort changes
  useEffect(() => {
    if (posts.length > 0) {
      console.log(`Sorting changed to: ${sortBy}, refetching posts...`);
      setPosts([]);
      setPage(1);
      setHasMorePosts(true);
      fetchPosts();
    }
  }, [sortBy]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasMorePosts && !loadingMore && !loading) {
          fetchPosts(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMorePosts, loadingMore, loading, page]);

  const fetchPosts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentPage = isLoadMore ? page + 1 : 1;
      const userId = getUserIdentifier();
      const url = new URL(
        `${API_ENDPOINTS.POSTS}?page=${currentPage}&limit=${POSTS_PER_PAGE}`
      );
      if (userId) {
        url.searchParams.set("userId", userId);
      }
      // Add sort parameter if not default
      if (sortBy !== "default") {
        url.searchParams.set("sort", sortBy);
        console.log(`Fetching posts with sort: ${sortBy}`);
      } else {
        console.log("Fetching posts with default sort (popular first)");
      }

      const response = await fetch(url, {
        headers: {
          "user-id": userId,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Use userLiked status from backend if available, otherwise check local storage
        const postsWithUserLiked = data.posts.map((post) => ({
          ...post,
          userLiked:
            post.userLiked !== undefined
              ? post.userLiked
              : hasUserLikedPost(post._id),
        }));

        if (isLoadMore) {
          setPosts((prevPosts) => [...prevPosts, ...postsWithUserLiked]);
          setPage(currentPage);
          setHasMorePosts(data.posts.length === POSTS_PER_PAGE);
        } else {
          setPosts(postsWithUserLiked);
          setPage(1);
          setHasMorePosts(data.posts.length === POSTS_PER_PAGE);
        }
      } else {
        console.error("Failed to fetch posts:", response.status);
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Error fetching posts");
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
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

        // Update local storage based on like status
        if (result.liked) {
          markPostAsLiked(postId);
        } else {
          markPostAsUnliked(postId);
        }

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
        // Update local post state instead of refetching all posts
        // This prevents the page refresh behavior
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, reportCount: (post.reportCount || 0) + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
          <div className="mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-3 md:mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-8">
          {/* Polls Skeleton */}
          <div className="space-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <PollSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Posts Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          </div>
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
      <FadeIn delay={0.2} className="text-center mb-8 md:mb-12 px-4 md:px-0">
        <div className="mb-4 md:mb-6 mt-8 md:mt-12">
          <img
            src="/image.png"
            alt="IS Logo"
            className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full shadow-xl"
          />
        </div>
        <SlideIn direction="up" delay={0.4}>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-['Comic_Sans_MS']">
            IS Freedom Wall
          </h1>
        </SlideIn>
        <SlideIn direction="up" delay={0.6}>
          <div className="text-sm md:text-lg text-gray-600 font-['Comic_Sans_MS'] max-w-2xl md:max-w-3xl mx-auto px-4 md:px-0">
            <TextType
              text={[
                "A simple, anonymous space for students to express their thoughts freely.",
                "Share your voice without fear. Every thought matters here.",
                "Your secrets are safe with us. Speak your truth anonymously.",
                "Freedom of expression starts here. What's on your mind?",
                "Anonymous thoughts, real conversations. Join the discussion.",
                "No judgment, just honesty. Share what you really think.",
                "Your voice matters. Express yourself freely and anonymously.",
                "Breaking the silence, one anonymous post at a time.",
                "Freedom to speak, freedom to be heard. Start sharing now.",
                "Anonymous expression, genuine connection. Share your story.",
              ]}
              typingSpeed={60}
              deletingSpeed={40}
              pauseDuration={2500}
              className="text-gray-600 font-['Comic_Sans_MS']"
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-blue-500"
              loop={true}
            />
          </div>
        </SlideIn>

        {/* Total Messages Count */}
        <SlideIn direction="up" delay={0.7}>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg inline-block shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-blue-700 font-['Comic_Sans_MS']">
              <MessageSquare size={18} className="text-blue-600" />
              <span className="text-sm font-semibold">
                <span className="text-blue-800 font-bold transition-all duration-300">
                  {loading ? "..." : posts.length}
                </span>{" "}
                Secret Message{posts.length !== 1 ? "s" : ""} Found
                {sortBy !== "default" && (
                  <span className="text-blue-600 ml-2">
                    (sorted by {sortBy === "recent" ? "recent" : "popular"})
                  </span>
                )}
              </span>
            </div>
          </div>
        </SlideIn>
      </FadeIn>

      {/* Main Content */}
      <StaggerContainer className="mb-8">
        {/* Polls Section */}
        {polls.length > 0 && (
          <StaggerItem className="mb-8">
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
                  <StaggerItem key={poll._id}>
                    <PollCard
                      poll={poll}
                      onVoteSubmitted={handlePollVoteSubmitted}
                    />
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerItem>
        )}

        {/* Posts Section */}
        <StaggerItem className="mb-6">
          {/* Sort Filter */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="text-sm text-gray-600 font-['Comic_Sans_MS']">
              Currently showing:{" "}
              <span className="font-semibold text-gray-800">
                {sortBy === "default"
                  ? "Popular posts first, then recent"
                  : "Most recent posts first"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setSortBy("default")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 font-['Comic_Sans_MS'] flex items-center gap-2 ${
                  sortBy === "default"
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <TrendingUp size={16} />
                Popular First
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 font-['Comic_Sans_MS'] flex items-center gap-2 ${
                  sortBy === "recent"
                    ? "bg-green-500 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <Clock size={16} />
                Recent First
              </button>
            </div>
          </div>
        </StaggerItem>

        {posts.length === 0 ? (
          <StaggerItem className="text-center py-12 md:py-16">
            <p className="text-gray-500 font-['Comic_Sans_MS'] text-lg">
              No posts yet. Be the first to share your thoughts!
            </p>
          </StaggerItem>
        ) : (
          <div className="post-grid">
            {posts.map((post, index) => (
              <StaggerItem key={post._id}>
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onReport={handleReport}
                />

                {/* Inline Ad every 3 posts */}
                {index > 0 && (index + 1) % 3 === 0 && (
                  <div className="col-span-full my-6">
                    <AdSense
                      adSlot={`inline-${Math.floor(index / 3)}`}
                      adFormat="auto"
                      className="w-full"
                      style={{ minHeight: "250px" }}
                    />
                  </div>
                )}
              </StaggerItem>
            ))}

            {/* Infinite Scroll Loading Indicator */}
            {loadingMore && (
              <div className="col-span-full space-y-6">
                {[1, 2].map((i) => (
                  <PostSkeleton key={`loading-${i}`} />
                ))}
              </div>
            )}

            {/* End of Posts Indicator */}
            {!hasMorePosts && posts.length > 0 && (
              <div className="col-span-full text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 font-['Comic_Sans_MS'] text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  You've reached the end of all posts
                </div>
              </div>
            )}
          </div>
        )}
      </StaggerContainer>

      {/* Call to Action */}
      <FadeIn delay={0.8} className="text-center mt-8 md:mt-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-xl">
          <SlideIn direction="up" delay={1.0}>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 font-['Comic_Sans_MS']">
              Ready to express yourself?
            </h3>
          </SlideIn>
          <SlideIn direction="up" delay={1.2}>
            <p className="text-gray-300 mb-4 md:mb-6 font-['Comic_Sans_MS'] text-sm md:text-base max-w-2xl mx-auto px-4 md:px-0">
              Start sharing your thoughts anonymously with your school
              community!
            </p>
          </SlideIn>
          <SlideIn direction="up" delay={1.4}>
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
          </SlideIn>

          <SlideIn direction="up" delay={1.6}>
            <div className="text-center mt-6">
              <a
                href="/buy-me-a-coffee"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium font-['Comic_Sans_MS'] transition-colors hover:underline"
              >
                <Coffee size={16} />
                Support the project
              </a>
            </div>
          </SlideIn>
        </div>
      </FadeIn>
    </div>
  );
}

export default Home;
