import { useState } from "react";
import { X, Send, User, MessageSquare } from "lucide-react";

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
        `http://localhost:5000/api/v1/posts/${post._id}/comment`,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
            Add Comment
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Post Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2 font-['Comic_Sans_MS']">
              Commenting on:
            </h4>
            <p className="text-gray-700 text-sm font-['Comic_Sans_MS']">
              {post.message.length > 100
                ? post.message.substring(0, 100) + "..."
                : post.message}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS']"
                maxLength={50}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 resize-none font-['Comic_Sans_MS']"
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                  {formData.message.length}/500 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !formData.message.trim()}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-['Comic_Sans_MS'] font-semibold"
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
