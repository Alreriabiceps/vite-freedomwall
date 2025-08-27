import { useState } from "react";
import {
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  X,
  Clock,
} from "lucide-react";
import LazyContent from "./LazyContent";

function AnnouncementCard({ announcement, onClose, isAdmin = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="text-yellow-600" size={20} />;
      case "success":
        return <CheckCircle className="text-green-600" size={20} />;
      case "error":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const formatExpiry = (expiryString) => {
    if (!expiryString) return "No expiration";
    const expiry = new Date(expiryString);
    const now = new Date();
    const diffInMinutes = Math.floor((expiry - now) / (1000 * 60));

    if (diffInMinutes < 0) return "Expired";
    if (diffInMinutes < 60) return `Expires in ${diffInMinutes} minutes`;
    if (diffInMinutes < 1440)
      return `Expires in ${Math.floor(diffInMinutes / 60)} hours`;
    return expiry.toLocaleDateString();
  };

  return (
    <div
      className={`announcement-card border-2 rounded-xl p-4 mb-4 ${getTypeColor(
        announcement.type
      )}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {getTypeIcon(announcement.type)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 font-['Comic_Sans_MS'] text-lg">
                {announcement.title}
              </h3>
            </div>

            <div className="text-sm text-gray-600 mb-2 font-['Comic_Sans_MS']">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(announcement.createdAt)}
                </span>
                {announcement.expiresAt && (
                  <span className="text-orange-600">
                    {formatExpiry(announcement.expiresAt)}
                  </span>
                )}
              </div>
            </div>

            <LazyContent>
              {isExpanded ? (
                <div className="text-gray-800 font-['Comic_Sans_MS']">
                  {announcement.message}
                </div>
              ) : (
                <div className="text-gray-800 font-['Comic_Sans_MS']">
                  {announcement.message.length > 150
                    ? `${announcement.message.substring(0, 150)}...`
                    : announcement.message}
                </div>
              )}
            </LazyContent>

            {announcement.message.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 font-['Comic_Sans_MS']"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isAdmin && announcement.adminNotes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-['Comic_Sans_MS']">
            <strong>Admin Notes:</strong> {announcement.adminNotes}
          </p>
        </div>
      )}
    </div>
  );
}

export default AnnouncementCard;
