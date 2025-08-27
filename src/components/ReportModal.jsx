import { useState } from "react";
import { X, Flag, AlertTriangle, Send } from "lucide-react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function ReportModal({ post, isOpen, onClose, onReportSubmitted }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Inappropriate content",
    "Hate speech or discrimination",
    "Bullying or harassment",
    "Spam or irrelevant content",
    "Personal information exposure",
    "Violence or threats",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    // If "Other" is selected, require custom reason
    if (reason === "Other" && !customReason.trim()) return;

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("userId") || "anonymous";
      const finalReason =
        reason === "Other" ? customReason.trim() : reason.trim();

      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POSTS, `/${post._id}/report`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            reason: finalReason,
          }),
        }
      );

      if (response.ok) {
        setReason("");
        setCustomReason("");
        onReportSubmitted();
        onClose();
      }
    } catch (error) {
      console.error("Error reporting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen || !post) return null;

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
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Warning Message */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-yellow-600 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1 font-['Comic_Sans_MS'] text-base">
                  Report Inappropriate Content
                </h4>
                <p className="text-yellow-700 text-base font-['Comic_Sans_MS']">
                  Please only report posts that violate our community
                  guidelines. False reports may result in action against your
                  account.
                </p>
              </div>
            </div>
          </div>

          {/* Post Preview */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2 font-['Comic_Sans_MS'] text-base">
              Reporting this post:
            </h4>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-gray-600"
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
                <p className="text-gray-700 text-base font-['Comic_Sans_MS']">
                  {post?.message && post.message.length > 100
                    ? post.message.substring(0, 100) + "..."
                    : post?.message || "Post content"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason Selection */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3 font-['Comic_Sans_MS']">
                Reason for reporting:
              </label>
              <div className="space-y-3">
                {reportReasons.map((reportReason) => (
                  <label
                    key={reportReason}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation"
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

            {/* Custom Reason (if "Other" is selected) */}
            {reason === "Other" && (
              <div>
                <label
                  htmlFor="customReason"
                  className="block text-base font-semibold text-gray-700 mb-2 font-['Comic_Sans_MS']"
                >
                  Please specify:
                </label>
                <textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please describe the issue..."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 resize-none font-['Comic_Sans_MS'] text-base"
                  maxLength={200}
                  required
                />
                <div className="flex justify-end mt-1">
                  <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                    {customReason.length}/200 characters
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Comic_Sans_MS'] font-medium touch-manipulation text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !reason.trim() ||
                  (reason === "Other" && !customReason.trim())
                }
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 sm:px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Comic_Sans_MS'] font-semibold touch-manipulation text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Reporting...
                  </>
                ) : (
                  <>
                    <Flag size={16} />
                    Report Post
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
