import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  MoreHorizontal,
  Star,
  TrendingUp,
} from "lucide-react";
import PostModal from "./PostModal";
import LazyContent from "./LazyContent";
import { InteractiveCard } from "./InteractiveElements";
import { getUserIdentifier } from "../utils/userIdentifier";

function PostCard({ post, onLike, onReport, onUpdate, isAdmin = false }) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If less than 1 minute ago
    if (diffMinutes < 1) return "Just now";

    // If less than 1 hour ago
    if (diffMinutes < 60) {
      if (diffMinutes === 1) return "1 minute ago";
      return `${diffMinutes} minutes ago`;
    }

    // If less than 24 hours ago
    if (diffHours < 24) {
      if (diffHours === 1) return "1 hour ago";
      return `${diffHours} hours ago`;
    }

    // If less than 7 days ago
    if (diffDays <= 7) {
      if (diffDays === 1) return "Yesterday";
      return `${diffDays - 1} days ago`;
    }

    // If more than 7 days ago, show full date and time
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Calculate engagement score and determine popularity
  const getEngagementScore = () => {
    const likes = post.likes || 0;
    const comments = post.comments ? post.comments.length : 0;
    return likes + comments * 2;
  };

  const getPopularityLevel = () => {
    const score = getEngagementScore();
    if (score >= 20) return "viral"; // Very popular
    if (score >= 10) return "trending"; // Trending
    if (score >= 5) return "popular"; // Popular
    return "normal"; // Normal
  };

  const getCardStyles = () => {
    const popularity = getPopularityLevel();

    switch (popularity) {
      case "viral":
        return {
          border:
            "border-2 border-gradient-to-r from-purple-500 via-pink-500 to-red-500",
          shadow: "shadow-lg shadow-purple-200",
          badge: {
            icon: Star,
            color: "text-purple-600",
            bg: "bg-purple-100",
            text: "Viral",
          },
        };
      case "trending":
        return {
          border: "border-2 border-gradient-to-r from-orange-400 to-red-500",
          shadow: "shadow-md shadow-orange-200",
          badge: {
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-100",
            text: "Trending",
          },
        };
      case "popular":
        return {
          border: "border-2 border-blue-400",
          shadow: "shadow-md shadow-blue-200",
          badge: {
            icon: Heart,
            color: "text-blue-600",
            bg: "bg-blue-100",
            text: "Popular",
          },
        };
      default:
        return {
          border: "border border-gray-100",
          shadow: "shadow-sm",
          badge: null,
        };
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (onLike) {
        await onLike(post._id, getUserIdentifier());
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const openPostModal = () => {
    setShowPostModal(true);
  };

  const closePostModal = () => {
    setShowPostModal(false);
  };

  const styles = getCardStyles();

  return (
    <>
      {/* Instagram/Facebook Style Card with Popularity Indicators */}
      <InteractiveCard
        className={`post-card group relative ${styles.border} ${styles.shadow}`}
      >
        {/* Popularity Badge */}
        {styles.badge && (
          <div
            className={`absolute top-3 right-3 z-10 ${styles.badge.bg} ${styles.badge.color} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 font-['Comic_Sans_MS']`}
          >
            <styles.badge.icon size={12} />
            {styles.badge.text}
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl font-['Arial'] sm:font-['Comic_Sans_MS']">
                  {post.name || "Anonymous"}
                </h3>
                <span className="text-base sm:text-lg text-gray-500 font-['Arial'] sm:font-['Comic_Sans_MS']">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content - Fixed height for consistency */}
        <div className="post-card-content p-4 min-h-[120px] flex flex-col justify-center">
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed line-clamp-4 font-['Arial'] sm:font-['Comic_Sans_MS']">
            {post.message}
          </p>
          {post.message.length > 150 && (
            <button
              onClick={openPostModal}
              className="text-blue-600 hover:text-blue-700 text-lg sm:text-xl font-medium mt-2 hover:underline font-['Arial'] sm:font-['Comic_Sans_MS']"
            >
              Read more
            </button>
          )}
        </div>

        {/* Comment Preview Section - Fixed height for consistency */}
        <div className="px-4 py-3 border-t border-gray-100 min-h-[80px] flex flex-col justify-center">
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-2">
              {/* Recent Comment */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base sm:text-lg font-medium text-gray-700 font-['Arial'] sm:font-['Comic_Sans_MS']">
                      {post.comments[0].name || "Anonymous"}
                    </span>
                    <span className="text-base sm:text-lg text-gray-500 font-['Arial'] sm:font-['Comic_Sans_MS']">
                      {formatDate(post.comments[0].createdAt)}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-gray-600 line-clamp-2 leading-relaxed font-['Arial'] sm:font-['Comic_Sans_MS']">
                    {post.comments[0].message}
                  </p>
                </div>
              </div>

              {/* View all comments button */}
              {post.comments.length > 1 && (
                <button
                  onClick={openPostModal}
                  className="text-blue-600 hover:text-blue-700 text-base sm:text-lg font-medium hover:underline flex items-center gap-1 font-['Arial'] sm:font-['Comic_Sans_MS']"
                >
                  View all {post.comments.length} comments
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                <MessageSquare size={12} />
                <span className="text-base sm:text-lg font-['Arial'] sm:font-['Comic_Sans_MS']">
                  No comments yet
                </span>
              </div>
              <p className="text-base sm:text-lg text-gray-300 font-['Arial'] sm:font-['Comic_Sans_MS']">
                Be the first to comment!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="post-card-footer p-4 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1 text-lg sm:text-xl text-gray-500 font-['Arial'] sm:font-['Comic_Sans_MS']">
              <Heart size={18} className="text-red-500" />
              {post.likes || 0}
            </span>
            <span className="flex items-center gap-1 text-lg sm:text-xl text-gray-500 font-['Arial'] sm:font-['Comic_Sans_MS']">
              <MessageSquare size={18} className="text-blue-500" />
              {post.comments ? post.comments.length : 0}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart
                size={20}
                className={
                  post.userLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                }
              />
              <span className="text-lg sm:text-xl text-gray-600 font-['Arial'] sm:font-['Comic_Sans_MS']">
                Like
              </span>
            </button>
            <button
              onClick={openPostModal}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare size={20} className="text-gray-400" />
              <span className="text-lg sm:text-xl text-gray-600 font-['Arial'] sm:font-['Comic_Sans_MS']">
                Comment
              </span>
            </button>
            <button
              onClick={openPostModal}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Flag size={20} className="text-gray-400" />
              <span className="text-lg sm:text-xl text-gray-600 font-['Arial'] sm:font-['Comic_Sans_MS']">
                Report
              </span>
            </button>
          </div>
        </div>
      </InteractiveCard>

      {/* Post Modal */}
      <PostModal
        post={post}
        isOpen={showPostModal}
        onClose={closePostModal}
        onLike={onLike}
        onReport={onReport}
        onUpdate={onUpdate}
        onCommentAdded={(updatedPost) => {
          // Update the local post state with the actual comment data from backend
          // This ensures the comment appears immediately with correct data
          if (updatedPost && updatedPost.comments) {
            post.comments = updatedPost.comments;
          }
        }}
        isAdmin={isAdmin}
      />
    </>
  );
}

export default PostCard;
