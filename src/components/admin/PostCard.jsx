import React from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  Flag,
  Shield,
  Heart,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "../../utils/adminUtils";
import CommentSection from "./CommentSection";

const PostCard = ({
  post,
  expandedComments,
  toggleComments,
  onModerate,
  onDeleteComment,
}) => {
  return (
    <div
      className={`border border-gray-200 rounded-xl p-4 md:p-6 ${
        post.isHidden ? "bg-gray-50 opacity-75" : "bg-white"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS'] text-base">
              {post.name || "Anonymous"}
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 font-['Comic_Sans_MS']">
              {formatDate(post.createdAt)}
            </span>
            {post.isFlagged && (
              <span className="flex items-center gap-1 text-orange-600 text-xs sm:text-sm">
                <Flag size={14} />
                Flagged ({post.reportCount} reports)
              </span>
            )}
            {post.isHidden && (
              <span className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                <EyeOff size={14} />
                Hidden
              </span>
            )}
          </div>
          <p className="text-gray-700 font-['Comic_Sans_MS'] mb-3 text-base md:text-lg">
            {post.message}
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs sm:text-sm text-gray-500 font-['Comic_Sans_MS']">
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {post.likes} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={14} />
              {post.comments.length} comments
            </span>
            {post.reportCount > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <Flag size={14} />
                {post.reportCount} reports
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-4">
          {post.isHidden ? (
            <button
              onClick={() => onModerate(post._id, "unhide")}
              className="p-2 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Unhide post"
            >
              <Eye size={16} />
            </button>
          ) : (
            <button
              onClick={() => onModerate(post._id, "hide")}
              className="p-2 md:p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Hide post"
            >
              <EyeOff size={16} />
            </button>
          )}
          {post.isFlagged && (
            <button
              onClick={() => onModerate(post._id, "unflag")}
              className="p-2 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Unflag post"
            >
              <Shield size={16} />
            </button>
          )}
          <button
            onClick={() => onModerate(post._id, "delete")}
            className="p-2 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <CommentSection
        post={post}
        expandedComments={expandedComments}
        toggleComments={toggleComments}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
};

export default PostCard;
