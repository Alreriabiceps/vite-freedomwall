import { useState } from "react";
import { X, Send, User, MessageSquare } from "lucide-react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function CommentModal({ post, isOpen, onClose, onCommentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
            Add Comment
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Post Preview */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2 font-['Comic_Sans_MS'] text-sm sm:text-base">
              Commenting on:
            </h4>
            <p className="text-gray-700 text-sm font-['Comic_Sans_MS']">
              {post?.message && post.message.length > 100
                ? post.message.substring(0, 100) + "..."
                : post?.message || "Post content"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="commentName"
                className="block text-sm font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
              >
                <div className="flex items-center gap-2">
                  <User size={16} />
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
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-base"
                maxLength={100}
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="commentMessage"
                className="block text-sm font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Your Comment
                </div>
              </label>
              <textarea
                id="commentMessage"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Share your thoughts..."
                rows={4}
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 resize-none font-['Comic_Sans_MS'] text-base"
                maxLength={1000}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                  {formData.message.length}/1000 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !formData.message.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Comic_Sans_MS'] font-semibold touch-manipulation"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Adding Comment...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Add Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
