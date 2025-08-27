import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CommentModal from "./CommentModal";
import ReportModal from "./ReportModal";

function PostCard({ post, onLike, onReport, onUpdate, isAdmin = false }) {
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
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

  const openReportModal = () => {
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  const handleReportSubmitted = () => {
    // Trigger refresh of posts to show updated report count
    if (onReport) {
      onReport(post._id);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleCommentAdded = () => {
    // Trigger refresh of posts to show new comment
    window.dispatchEvent(new Event("postsModified"));
  };

  const getMessagePreview = () => {
    if (post.message.length <= 150 || expanded) {
      return post.message;
    }
    return post.message.substring(0, 150) + "...";
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${
          post.isHidden ? "opacity-75" : ""
        }`}
      >
        {/* Post Header */}
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base font-['Comic_Sans_MS']">
                  {post.name || "Anonymous"}
                </h3>
                <span className="text-xs md:text-sm text-gray-500 font-['Comic_Sans_MS']">
                  {formatDate(post.createdAt)}
                </span>
                {post.isFlagged && (
                  <span className="flex items-center gap-1 text-orange-600 text-xs md:text-sm">
                    <Flag size={12} className="md:w-3.5 md:h-3.5" />
                    <span className="hidden sm:inline">Flagged</span>
                    <span className="sm:hidden">!</span>
                  </span>
                )}
                {post.isHidden && (
                  <span className="flex items-center gap-1 text-red-600 text-xs md:text-sm">
                    <EyeOff size={12} className="md:w-3.5 md:h-3.5" />
                    <span className="hidden sm:inline">Hidden</span>
                    <span className="sm:hidden">H</span>
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="mb-3 md:mb-4">
                <p className="text-gray-700 text-sm md:text-base font-['Comic_Sans_MS'] leading-relaxed">
                  {getMessagePreview()}
                </p>
                {post.message.length > 150 && (
                  <button
                    onClick={toggleExpanded}
                    className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium mt-2 font-['Comic_Sans_MS']"
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 font-['Comic_Sans_MS']">
                <span className="flex items-center gap-1">
                  <Heart size={12} className="md:w-3.5 md:h-3.5" />
                  {post.likes || 0}{" "}
                  <span className="hidden sm:inline">likes</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} className="md:w-3.5 md:h-3.5" />
                  {post.comments ? post.comments.length : 0}{" "}
                  <span className="hidden sm:inline">comments</span>
                </span>
                {post.reportCount > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <Flag size={12} className="md:w-3.5 md:h-3.5" />
                    {post.reportCount}{" "}
                    <span className="hidden sm:inline">reports</span>
                  </span>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex items-center gap-1 md:gap-2 ml-2 md:ml-4 flex-shrink-0">
                {post.isHidden ? (
                  <button
                    onClick={() => onUpdate(post._id, "unhide")}
                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Unhide post"
                  >
                    <Eye size={14} className="md:w-4 md:h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdate(post._id, "hide")}
                    className="p-1.5 md:p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Hide post"
                  >
                    <EyeOff size={14} className="md:w-4 md:h-4" />
                  </button>
                )}

                {post.isFlagged && (
                  <button
                    onClick={() => onUpdate(post._id, "unflag")}
                    className="p-1.5 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Unflag post"
                  >
                    <Shield size={14} className="md:w-4 md:h-4" />
                  </button>
                )}

                <button
                  onClick={() => onUpdate(post._id, "delete")}
                  className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 size={14} className="md:w-4 md:h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isAdmin && (
            <div className="flex items-center gap-2 md:gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 md:gap-2 px-3 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium font-['Comic_Sans_MS'] ${
                  post.userLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Like</span>
              </button>

              <button
                onClick={openCommentModal}
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-xs md:text-sm font-medium font-['Comic_Sans_MS']"
              >
                <MessageSquare size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Comment</span>
                <span className="sm:hidden">
                  ({post.comments ? post.comments.length : 0})
                </span>
              </button>

              <button
                onClick={openReportModal}
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-xs md:text-sm font-medium font-['Comic_Sans_MS']"
              >
                <Flag size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {post.comments && post.comments.length > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={toggleComments}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 font-['Comic_Sans_MS']">
                  Comments ({post.comments.length})
                </span>
                {showComments ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </div>
            </button>

            {showComments && (
              <div className="px-4 pb-4 space-y-3">
                {post.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-xs md:text-sm font-['Comic_Sans_MS']">
                            {comment.name || "Anonymous"}
                          </span>
                          <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs md:text-sm font-['Comic_Sans_MS']">
                          {comment.message}
                        </p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() =>
                            onUpdate(post._id, "deleteComment", index)
                          }
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2 flex-shrink-0"
                          title="Delete comment"
                        >
                          <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        post={post}
        isOpen={showCommentModal}
        onClose={closeCommentModal}
        onCommentAdded={handleCommentAdded}
      />

      {/* Report Modal */}
      <ReportModal
        post={post}
        isOpen={showReportModal}
        onClose={closeReportModal}
        onReportSubmitted={handleReportSubmitted}
      />
    </>
  );
}

export default PostCard;
