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
import {
  InteractiveCard,
  AnimatedLikeButton,
  AnimatedCommentButton,
} from "./InteractiveElements";
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

  const getMessagePreview = (message) => {
    if (message.length <= 120) return message;
    return message.substring(0, 120) + "...";
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

        {/* Card Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
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

            {/* User Info */}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base font-['Comic_Sans_MS'] truncate">
                {post.name || "Anonymous"}
              </h3>
              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            {post.isFlagged && (
              <div
                className="w-2 h-2 bg-orange-500 rounded-full"
                title="Flagged"
              ></div>
            )}
            {post.isHidden && (
              <div
                className="w-2 h-2 bg-red-500 rounded-full"
                title="Hidden"
              ></div>
            )}
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <LazyContent>
          <div className="post-card-content px-3 py-2 h-[100px] flex flex-col justify-center">
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap line-clamp-4 font-['Comic_Sans_MS']">
              {getMessagePreview(post.message)}
            </p>

            {/* Show "Read more" if message is truncated */}
            {post.message.length > 120 && (
              <button
                onClick={openPostModal}
                className="text-blue-600 hover:text-blue-700 text-base font-medium mt-1 transition-colors font-['Comic_Sans_MS'] hover:underline"
              >
                Read more
              </button>
            )}
          </div>
        </LazyContent>

        {/* Engagement Stats - Compact height */}
        <div className="px-3 py-1 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-gray-50/80">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                <Heart size={14} className="text-red-500" />
                <span className="font-medium">{post.likes || 0}</span>
              </span>
              <span className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                <MessageSquare size={14} className="text-blue-500" />
                <span className="font-medium">{post.comments ? post.comments.length : 0}</span>
              </span>
            </div>

            {post.reportCount > 0 && (
              <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs">
                <Flag size={12} />
                {post.reportCount}
              </span>
            )}
          </div>
        </div>

        {/* Comment Section - Fixed height for consistency */}
        <div className="border-t border-gray-100 h-[80px] flex flex-col">
          {post.comments && post.comments.length > 0 ? (
            /* Show comment preview if comments exist */
            <button
              onClick={openPostModal}
              className="w-full h-full text-left px-3 py-2 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 cursor-pointer flex flex-col justify-center group"
            >
              <div className="pt-0">
                {/* Comment header with icon */}
                <div className="flex items-center gap-1 mb-2 text-xs text-gray-500 font-['Comic_Sans_MS']">
                  <MessageSquare size={12} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Comments</span>
                </div>
                
                {/* Show the most recent comment */}
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg
                      className="w-2 h-2 text-blue-600"
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
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-medium text-gray-700 font-['Comic_Sans_MS']">
                        {post.comments[0].name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                        {formatDate(post.comments[0].createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-['Comic_Sans_MS'] line-clamp-2 leading-relaxed">
                      {post.comments[0].message}
                    </p>
                  </div>
                </div>
                
                {/* Show "View all comments" if there are more than 1 comment */}
                {post.comments.length > 1 && (
                  <div className="text-blue-600 hover:text-blue-700 text-xs font-medium mt-2 transition-colors font-['Comic_Sans_MS'] hover:underline flex items-center gap-1">
                    <span>View all {post.comments.length} comments</span>
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ) : (
            /* Show placeholder when no comments exist - same height as comment section */
            <div className="w-full h-full px-3 py-2 bg-gradient-to-r from-gray-50/30 to-gray-50/50 flex flex-col justify-center">
              <div className="flex items-center gap-1 text-xs text-gray-400 font-['Comic_Sans_MS'] mb-2">
                <MessageSquare size={12} className="text-gray-300" />
                <span>No comments yet</span>
              </div>
              {/* Add some spacing to fill the height */}
              <div className="mt-2">
                <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto opacity-40 shadow-sm">
                  <svg
                    className="w-2 h-2 text-gray-400"
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
                <div className="mt-1 text-xs text-gray-300 font-['Comic_Sans_MS'] text-center">
                  Be the first to comment!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer - Action Buttons with better styling */}
        <div className="post-card-footer px-3 py-2 bg-gradient-to-r from-gray-50/40 to-gray-50/60 border-t border-gray-200">
          <div className="flex items-center justify-center gap-3">
            <AnimatedLikeButton
              isLiked={post.userLiked}
              onClick={handleLike}
              size="md"
              className="flex-1 hover:scale-105 transition-transform"
            />

            <AnimatedCommentButton
              onClick={openPostModal}
              size="md"
              className="flex-1 hover:scale-105 transition-transform"
            />

            <button
              onClick={openPostModal}
              className="flex-1 flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-sm"
            >
              <Flag size={16} className="text-orange-500" />
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
