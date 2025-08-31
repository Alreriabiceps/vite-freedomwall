import { useState } from "react";
import {
  X,
  Flag,
  AlertTriangle,
  CheckCircle,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function ReportModal({ post, isOpen, onClose, onReportSubmitted }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportReasons = [
    {
      value: "inappropriate",
      label: "Inappropriate content",
      description: "Profanity, adult content, or unsuitable material",
      icon: Shield,
      color: "text-red-600",
    },
    {
      value: "harassment",
      label: "Harassment or bullying",
      description: "Targeted attacks, threats, or intimidation",
      icon: Users,
      color: "text-orange-600",
    },
    {
      value: "violence",
      label: "Violence or threats",
      description: "Violent content, threats, or dangerous behavior",
      icon: AlertTriangle,
      color: "text-red-700",
    },
    {
      value: "spam",
      label: "Spam or misleading",
      description: "Repetitive posts, false information, or scams",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      value: "copyright",
      label: "Copyright violation",
      description: "Unauthorized use of someone else's content",
      icon: Flag,
      color: "text-purple-600",
    },
    {
      value: "other",
      label: "Other violation",
      description: "Other community guideline violations",
      icon: AlertTriangle,
      color: "text-gray-600",
    },
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
    if (!reason) return;

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
            details: details,
            reportTimestamp: new Date().toISOString(),
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
              Thank you for helping keep our community safe. We'll review your
              report and take appropriate action.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                Report Post
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-['Comic_Sans_MS']">
                Help us maintain a safe community
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors touch-manipulation"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20 sm:pb-6">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Post Preview */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-medium text-blue-600">
                    U
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 font-['Comic_Sans_MS']">
                      Anonymous User
                    </span>
                    <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 font-['Comic_Sans_MS'] leading-relaxed">
                    {post.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3 font-['Comic_Sans_MS']">
                  Why are you reporting this post? *
                </label>
                <div className="grid gap-2 sm:gap-3">
                  {reportReasons.map((reportReason) => (
                    <label
                      key={reportReason.value}
                      className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all touch-manipulation ${
                        reason === reportReason.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reportReason.value}
                        checked={reason === reportReason.value}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <reportReason.icon
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${reportReason.color}`}
                          />
                          <span className="font-medium text-gray-900 text-sm sm:text-base font-['Comic_Sans_MS']">
                            {reportReason.label}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 font-['Comic_Sans_MS']">
                          {reportReason.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 font-['Comic_Sans_MS']">
                  Additional details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  placeholder="Please provide any additional context that will help us understand your report..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-['Comic_Sans_MS'] text-sm"
                />
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1 font-['Comic_Sans_MS'] text-sm sm:text-base">
                      Important Reminder
                    </h4>
                    <p className="text-xs sm:text-sm text-yellow-700 font-['Comic_Sans_MS']">
                      Only report posts that violate our community guidelines.
                      False reports may result in account restrictions. If
                      you're unsure, please review our{" "}
                      <a
                        href="/community-guidelines"
                        className="underline font-medium"
                      >
                        Community Guidelines
                      </a>{" "}
                      first.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 sm:p-4 md:p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium font-['Comic_Sans_MS'] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium font-['Comic_Sans_MS'] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 touch-manipulation text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
