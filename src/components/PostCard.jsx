import { useState } from "react";
import { Heart, MessageSquare, Flag, MoreHorizontal } from "lucide-react";
import PostModal from "./PostModal";
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

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays <= 7) return `${diffDays - 1}d ago`;
    
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
        await onLike(post._id, getUserIdentifier());
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const openPostModal = () => setShowPostModal(true);
  const closePostModal = () => setShowPostModal(false);

  return (
    <>
      <div className="post-card">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                {post.name || "Anonymous"}
              </h3>
                <span className="text-sm text-gray-500">
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
          <p className="text-gray-800 text-sm leading-relaxed line-clamp-4">
            {post.message}
          </p>
            {post.message.length > 150 && (
              <button
                onClick={openPostModal}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 hover:underline"
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
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">
                        {post.comments[0].name || "Anonymous"}
                      </span>
                    <span className="text-xs text-gray-500">
                        {formatDate(post.comments[0].createdAt)}
                      </span>
                    </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {post.comments[0].message}
                    </p>
                  </div>
                </div>
                
              {/* View all comments button */}
                {post.comments.length > 1 && (
                <button
                  onClick={openPostModal}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline flex items-center gap-1"
                >
                  View all {post.comments.length} comments
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                )}
              </div>
          ) : (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                <MessageSquare size={12} />
                <span className="text-xs">No comments yet</span>
              </div>
              <p className="text-xs text-gray-300">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="post-card-footer p-4 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Heart size={14} className="text-red-500" />
              {post.likes || 0}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MessageSquare size={14} className="text-blue-500" />
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
                size={16} 
                className={post.userLiked ? "text-red-500 fill-red-500" : "text-gray-400"} 
              />
              <span className="text-sm text-gray-600">Like</span>
            </button>
            <button
              onClick={openPostModal}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">Comment</span>
            </button>
            <button
              onClick={openPostModal}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Flag size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">Report</span>
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
        onCommentAdded={(updatedPost) => {
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
