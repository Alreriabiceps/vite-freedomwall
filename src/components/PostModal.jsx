import { useState, useEffect } from "react";
import {
  X,
  Heart,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import CommentModal from "./CommentModal";
import ReportModal from "./ReportModal";
import { getUserIdentifier } from "../utils/userIdentifier";

function PostModal({
  post,
  isOpen,
  onClose,
  onLike,
  onReport,
  onUpdate,
  onCommentAdded,
  isAdmin = false,
}) {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentReactions, setCommentReactions] = useState({});

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Initialize comment reactions when post changes
  useEffect(() => {
    if (post?.comments) {
      const initialReactions = {};
      post.comments.forEach((comment, index) => {
        initialReactions[index] = {
          thumbsUp: comment.thumbsUp || 0,
          thumbsDown: comment.thumbsDown || 0,
          userThumbsUp: comment.userThumbsUp || false,
          userThumbsDown: comment.userThumbsDown || false,
        };
      });
      setCommentReactions(initialReactions);
    }
  }, [post]);

  const handleThumbsUp = (commentIndex) => {
    setCommentReactions(prev => {
      const current = prev[commentIndex] || { thumbsUp: 0, thumbsDown: 0, userThumbsUp: false, userThumbsDown: false };
      
      if (current.userThumbsUp) {
        // User already thumbs up, remove it
        return {
          ...prev,
          [commentIndex]: {
            ...current,
            thumbsUp: Math.max(0, current.thumbsUp - 1),
            userThumbsUp: false,
          }
        };
      } else {
        // Add thumbs up, remove thumbs down if exists
        return {
          ...prev,
          [commentIndex]: {
            ...current,
            thumbsUp: current.thumbsUp + 1,
            thumbsDown: current.userThumbsDown ? Math.max(0, current.thumbsDown - 1) : current.thumbsDown,
            userThumbsUp: true,
            userThumbsDown: false,
          }
        };
      }
    });
  };

  const handleThumbsDown = (commentIndex) => {
    setCommentReactions(prev => {
      const current = prev[commentIndex] || { thumbsUp: 0, thumbsDown: 0, userThumbsUp: false, userThumbsDown: false };
      
      if (current.userThumbsDown) {
        // User already thumbs down, remove it
        return {
          ...prev,
          [commentIndex]: {
            ...current,
            thumbsDown: Math.max(0, current.thumbsDown - 1),
            userThumbsDown: false,
          }
        };
      } else {
        // Add thumbs down, remove thumbs up if exists
        return {
          ...prev,
          [commentIndex]: {
            ...current,
            thumbsDown: current.thumbsDown + 1,
            thumbsUp: current.userThumbsUp ? Math.max(0, current.thumbsUp - 1) : current.thumbsUp,
            userThumbsDown: true,
            userThumbsUp: false,
          }
        };
      }
    });
  };

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

  const openReportModal = () => {
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  const handleReportSubmitted = () => {
    if (onReport) {
      onReport(post._id);
    }
  };

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleCommentAdded = (updatedPost) => {
    // Call the parent's onCommentAdded handler if provided
    if (onCommentAdded) {
      onCommentAdded(updatedPost);
    }
    // Close the comment modal
    closeCommentModal();

    // Update the local post state with the actual comment data from backend
    if (updatedPost && updatedPost.comments) {
      post.comments = updatedPost.comments;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile-First Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              Post Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Post Content */}
          <div className="flex-1 overflow-y-auto pb-20 sm:pb-6">
            <div className="p-4 sm:p-6">
              {/* Post Header with Avatar */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-lg font-['Comic_Sans_MS']">
                      {post.name || "Anonymous"}
                    </h3>
                    <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    {post.isFlagged && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                        <Flag size={10} />
                        Flagged
                      </span>
                    )}
                    {post.isHidden && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                        <EyeOff size={10} />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    {post.isHidden ? (
                      <button
                        onClick={() => onUpdate(post._id, "unhide")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors touch-manipulation"
                        title="Unhide post"
                      >
                        <Eye size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdate(post._id, "hide")}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors touch-manipulation"
                        title="Hide post"
                      >
                        <EyeOff size={16} />
                      </button>
                    )}

                    {post.isFlagged && (
                      <button
                        onClick={() => onUpdate(post._id, "unflag")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors touch-manipulation"
                        title="Unflag post"
                      >
                        <Shield size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => onUpdate(post._id, "delete")}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors touch-manipulation"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Full Message Content */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-['Comic_Sans_MS']">
                  {post.message}
                </p>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 sm:gap-6 text-base text-gray-500 mb-4 sm:mb-6">
                <span className="flex items-center gap-2">
                  <Heart size={16} className="text-red-500" />
                  {post.likes || 0} likes
                </span>
                <span className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-500" />
                  {post.comments ? post.comments.length : 0} comments
                </span>
                {post.reportCount > 0 && (
                  <span className="flex items-center gap-2 text-red-600">
                    <Flag size={16} />
                    {post.reportCount} reports
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-colors font-medium touch-manipulation text-base ${
                    post.userLiked
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    size={18}
                    className={post.userLiked ? "fill-current" : ""}
                  />
                  {post.userLiked ? "Liked" : "Like"}
                </button>

                <button
                  onClick={openCommentModal}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-colors font-medium touch-manipulation text-base"
                >
                  <MessageSquare size={18} />
                  Comment
                </button>

                <button
                  onClick={openReportModal}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-xl transition-colors font-medium touch-manipulation text-base"
                >
                  <Flag size={18} />
                  Report
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="p-4 sm:p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 font-['Comic_Sans_MS']">
                    Comments ({post.comments.length})
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {post.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-3 sm:p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900 text-base font-['Comic_Sans_MS']">
                                {comment.name || "Anonymous"}
                              </span>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-base font-['Comic_Sans_MS'] leading-relaxed whitespace-pre-wrap">
                              {comment.message}
                            </p>
                            
                            {/* Comment Reactions - Only Thumbs Up/Down */}
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                              <button 
                                onClick={() => handleThumbsUp(index)}
                                className={`flex items-center gap-1 text-sm transition-colors touch-manipulation ${
                                  commentReactions[index]?.userThumbsUp 
                                    ? 'text-green-600' 
                                    : 'text-gray-500 hover:text-green-500'
                                }`}
                              >
                                <ThumbsUp 
                                  size={16} 
                                  className={commentReactions[index]?.userThumbsUp ? 'fill-current' : ''}
                                />
                                <span>{commentReactions[index]?.thumbsUp || 0}</span>
                              </button>
                              <button 
                                onClick={() => handleThumbsDown(index)}
                                className={`flex items-center gap-1 text-sm transition-colors touch-manipulation ${
                                  commentReactions[index]?.userThumbsDown 
                                    ? 'text-orange-600' 
                                    : 'text-gray-500 hover:text-orange-500'
                                }`}
                              >
                                <ThumbsDown 
                                  size={16} 
                                  className={commentReactions[index]?.userThumbsDown ? 'fill-current' : ''}
                                />
                                <span>{commentReactions[index]?.thumbsDown || 0}</span>
                              </button>
                            </div>
                          </div>

                          {isAdmin && (
                            <button
                              onClick={() =>
                                onUpdate(post._id, "deleteComment", index)
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0 touch-manipulation"
                              title="Delete comment"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

export default PostModal;
