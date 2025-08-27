import { useState } from "react";
import { Heart, MessageSquare, Flag, MoreHorizontal } from "lucide-react";
import PostModal from "./PostModal";

function PostCard({ post, onLike, onReport, onUpdate, isAdmin = false }) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMessagePreview = (message) => {
    if (message.length <= 120) return message;
    return message.substring(0, 120) + "...";
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (onLike) {
        await onLike(post._id);
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

  return (
    <>
      {/* Instagram/Facebook Style Card */}
      <div className="post-card group">
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
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {post.name || "Anonymous"}
              </h3>
              <span className="text-xs text-gray-500">
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
        <div className="post-card-content px-4 pb-3">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
            {getMessagePreview(post.message)}
          </p>

          {/* Show "Read more" if message is truncated */}
          {post.message.length > 120 && (
            <button
              onClick={openPostModal}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 transition-colors"
            >
              Read more
            </button>
          )}
        </div>

        {/* Card Footer */}
        <div className="post-card-footer px-4 pb-4">
          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart size={14} className="text-red-500" />
                {post.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} className="text-blue-500" />
                {post.comments ? post.comments.length : 0}
              </span>
            </div>

            {post.reportCount > 0 && (
              <span className="flex items-center gap-1 text-orange-600">
                <Flag size={12} />
                {post.reportCount}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 border-t border-gray-100 pt-3">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                post.userLiked
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Heart
                size={18}
                className={post.userLiked ? "fill-current" : ""}
              />
              {post.userLiked ? "Liked" : "Like"}
            </button>

            <button
              onClick={openPostModal}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            >
              <MessageSquare size={18} />
              Comment
            </button>

            <button
              onClick={openPostModal}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            >
              <Flag size={18} />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <PostModal
        post={post}
        isOpen={showPostModal}
        onClose={closePostModal}
        onLike={onLike}
        onReport={onReport}
        onUpdate={onUpdate}
        isAdmin={isAdmin}
      />
    </>
  );
}

export default PostCard;
