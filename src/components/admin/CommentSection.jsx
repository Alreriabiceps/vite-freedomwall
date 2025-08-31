import React from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/adminUtils";

const CommentSection = ({
  post,
  expandedComments,
  toggleComments,
  onDeleteComment,
}) => {
  if (!post.comments || post.comments.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 pt-4">
      <button
        onClick={() => toggleComments(post._id)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors font-['Comic_Sans_MS'] mb-3"
      >
        {expandedComments[post._id] ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
        Comments ({post.comments.length})
      </button>

      {expandedComments[post._id] && (
        <div className="space-y-3">
          {post.comments.map((comment, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between bg-gray-50 rounded-lg p-3 gap-2"
            >
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm font-['Comic_Sans_MS']">
                    {comment.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-['Comic_Sans_MS']">
                  {comment.message}
                </p>
              </div>
              <button
                onClick={() => onDeleteComment(post._id, index)}
                className="self-end sm:self-auto p-1 text-red-500 hover:bg-red-50 rounded transition-colors sm:ml-2"
                title="Delete comment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
