import { useState } from "react";
import { X, User, MessageSquare } from "lucide-react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function CommentModal({ post, isOpen, onClose, onCommentAdded }) {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POSTS, `/${post._id}/comment`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setFormData({ name: "", message: "" });
        onCommentAdded();
        onClose();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
            Add Comment
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-6">
          {/* Post Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS'] text-base">
              Commenting on:
            </h4>
            <p className="text-gray-700 text-base font-['Comic_Sans_MS'] leading-relaxed">
              {post?.message && post.message.length > 100
                ? post.message.substring(0, 100) + "..."
                : post?.message || "Post content"}
            </p>
            <div className="mt-3 text-sm text-gray-500 font-['Comic_Sans_MS'] flex items-center gap-2">
              <span>Posted {formatDate(post.createdAt)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="commentName"
                className="block text-base font-semibold text-gray-700 mb-3 font-['Comic_Sans_MS']"
              >
                <div className="flex items-center gap-2">
                  <User size={18} />
                  Your Name (Optional)
                </div>
              </label>
              <input
                type="text"
                id="commentName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Anonymous or your name"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-base transition-all duration-200"
                maxLength={100}
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="commentMessage"
                className="block text-base font-semibold text-gray-700 mb-3 font-['Comic_Sans_MS']"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  Your Comment
                </div>
              </label>
              <textarea
                id="commentMessage"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Share your thoughts..."
                rows={6}
                required
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-base resize-none transition-all duration-200"
                maxLength={500}
              />
              <div className="mt-2 text-sm text-gray-500 text-right">
                {formData.message.length}/500
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation text-base font-['Comic_Sans_MS'] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <MessageSquare size={18} />
                  Post Comment
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;


