import { useState } from "react";
import { BarChart3, Users, Hash, MessageSquare, Flag } from "lucide-react";
import { getUserIdentifier } from "../utils/userIdentifier";

function PollCard({ poll }) {
  const [showResults, setShowResults] = useState(false);
  const [pollData] = useState(poll);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const hasUserVoted = () => {
    const userId = getUserIdentifier();
    return pollData.options.some((option) => option.voters.includes(userId));
  };

  const getOptionPercentage = (votes) => {
    if (pollData.totalVotes === 0) return 0;
    return Math.round((votes / pollData.totalVotes) * 100);
  };

  const isExpired = () => {
    if (!pollData.expiresAt) return false;
    return new Date() > new Date(pollData.expiresAt);
  };

  const getMessagePreview = (question) => {
    if (question.length <= 120) return question;
    return question.substring(0, 120) + "...";
  };

  return (
    <div className="post-card group relative">
      {/* Poll Badge */}
      <div className="absolute top-3 right-3 z-10 bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 font-['Comic_Sans_MS']">
        <BarChart3 size={12} />
        Poll
      </div>

      {/* Card Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
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

          {/* User Info */}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-base font-['Comic_Sans_MS'] truncate">
              {pollData.createdBy || "Anonymous"}
            </h3>
            <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
              {formatDate(pollData.createdAt)}
            </span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {isExpired() && (
            <div
              className="w-2 h-2 bg-red-500 rounded-full"
              title="Expired"
            ></div>
          )}
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
            <Flag size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="post-card-content px-4 pb-3">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap line-clamp-4 font-['Comic_Sans_MS']">
          {getMessagePreview(pollData.question)}
        </p>

        {/* Show "View poll" if question is truncated */}
        {pollData.question.length > 120 && (
          <button
            onClick={() => setShowResults(!showResults)}
            className="text-blue-600 hover:text-blue-700 text-base font-medium mt-2 transition-colors font-['Comic_Sans_MS']"
          >
            View poll
          </button>
        )}

        {/* Poll Options Preview */}
        {!showResults && (
          <div className="mt-3 space-y-2">
            {pollData.options.slice(0, 3).map((option, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 font-['Comic_Sans_MS']"
              >
                • {option.text}
              </div>
            ))}
            {pollData.options.length > 3 && (
              <div className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                +{pollData.options.length - 3} more options
              </div>
            )}
          </div>
        )}

        {/* Poll Results (when expanded) */}
        {showResults && (
          <div className="mt-3 space-y-2">
            {pollData.options.map((option, index) => {
              const percentage = getOptionPercentage(option.votes);
              const hasVoted = option.voters.includes(getUserIdentifier());

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-['Comic_Sans_MS']">
                      {option.text}
                    </span>
                    <span className="text-gray-500 font-['Comic_Sans_MS']">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        hasVoted ? "bg-purple-500" : "bg-blue-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{option.votes} votes</span>
                    {hasVoted && (
                      <span className="text-purple-600 font-semibold">
                        ✓ Your vote
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="post-card-footer px-4 pb-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users size={16} className="text-purple-500" />
              {pollData.totalVotes || 0}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 size={16} className="text-blue-500" />
              {pollData.options.length} options
            </span>
          </div>

          {pollData.topics && pollData.topics.length > 0 && (
            <span className="flex items-center gap-1 text-purple-600">
              <Hash size={14} />
              {pollData.topics[0]}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 border-t border-gray-100 pt-3">
          {!showResults && !hasUserVoted() && !isExpired() ? (
            // Voting Interface
            <>
              <button
                onClick={() => setShowResults(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-base text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-['Comic_Sans_MS']"
              >
                <BarChart3 size={18} />
                Vote
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-base text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-['Comic_Sans_MS']"
              >
                <MessageSquare size={18} />
                View
              </button>
            </>
          ) : (
            // Results Interface
            <>
              <button
                onClick={() => setShowResults(!showResults)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-base text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-['Comic_Sans_MS']"
              >
                <BarChart3 size={18} />
                {showResults ? "Hide" : "Results"}
              </button>
              <button
                onClick={() => setShowResults(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200 font-medium text-base text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-['Comic_Sans_MS']"
              >
                <MessageSquare size={18} />
                Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PollCard;
