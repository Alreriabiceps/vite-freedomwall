import { useState } from "react";
import { X, Flag, AlertTriangle, CheckCircle } from "lucide-react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function ReportModal({ post, isOpen, onClose, onReportSubmitted }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportReasons = [
    "Inappropriate content",
    "Spam or misleading",
    "Harassment or bullying",
    "Violence or threats",
    "False information",
    "Copyright violation",
    "Other",
  ];

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
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POSTS, `/${post._id}/report`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason,
            details: details.trim() || undefined,
          }),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onReportSubmitted();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error reporting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setReason("");
      setDetails("");
      onClose();
    }
  };

  if (!isOpen || !post) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-md overflow-hidden flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Report Submitted
            </h3>
            <p className="text-gray-600 text-base font-['Comic_Sans_MS'] leading-relaxed">
              Thank you for helping keep our community safe. We'll review your report and take appropriate action.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="text-red-600" size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              Report Post
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-6">
          {/* Warning Message */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-yellow-600 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2 font-['Comic_Sans_MS'] text-base">
                  Report Inappropriate Content
                </h4>
                <p className="text-yellow-700 text-base font-['Comic_Sans_MS'] leading-relaxed">
                  Please only report posts that violate our community guidelines. False reports may result in action against your account.
                </p>
              </div>
            </div>
          </div>

          {/* Post Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS'] text-base">
              Reporting this post:
            </h4>
            <div className="flex items-start gap-3">
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
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 text-base font-['Comic_Sans_MS'] leading-relaxed">
                  {post?.message && post.message.length > 100
                    ? post.message.substring(0, 100) + "..."
                    : post?.message || "Post content"}
                </p>
                <div className="mt-2 text-sm text-gray-500 font-['Comic_Sans_MS']">
                  Posted {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reason Selection */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3 font-['Comic_Sans_MS']">
                Reason for Report *
              </label>
              <div className="space-y-2">
                {reportReasons.map((reportReason) => (
                  <label
                    key={reportReason}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reportReason}
                      checked={reason === reportReason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="text-base text-gray-700 font-['Comic_Sans_MS']">
                      {reportReason}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label
                htmlFor="reportDetails"
                className="block text-base font-semibold text-gray-700 mb-3 font-['Comic_Sans_MS']"
              >
                Additional Details (Optional)
              </label>
              <textarea
                id="reportDetails"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please provide any additional context..."
                rows={4}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS'] text-base resize-none transition-all duration-200"
                maxLength={500}
              />
              <div className="mt-2 text-sm text-gray-500 text-right">
                {details.length}/500
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation text-base font-['Comic_Sans_MS']"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="flex-1 py-4 px-6 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation text-base font-['Comic_Sans_MS'] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag size={18} />
                    Submit Report
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

export default ReportModal;
