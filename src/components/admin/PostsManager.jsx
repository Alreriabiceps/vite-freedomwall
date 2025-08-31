import React, { useState, useMemo } from "react";
import PostFilters from "./PostFilters";
import PostCard from "./PostCard";

const PostsManager = ({
  posts,
  expandedComments,
  onModerate,
  onDeleteComment,
  toggleComments,
}) => {
  // Search and filter states for posts
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Tab-based filtering (this will be handled by the parent component)
    // We keep the filters here for additional filtering within the posts view

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "flagged") {
        filtered = filtered.filter((post) => post.isFlagged);
      } else if (statusFilter === "hidden") {
        filtered = filtered.filter((post) => post.isHidden);
      } else if (statusFilter === "reported") {
        filtered = filtered.filter((post) => post.reportCount > 0);
      }
    }

    // Type filter (posts with comments, likes, etc.)
    if (typeFilter !== "all") {
      if (typeFilter === "withComments") {
        filtered = filtered.filter((post) => post.comments.length > 0);
      } else if (typeFilter === "withLikes") {
        filtered = filtered.filter((post) => post.likes > 0);
      } else if (typeFilter === "withReports") {
        filtered = filtered.filter((post) => post.reportCount > 0);
      }
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "mostLiked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "mostCommented":
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
      case "mostReported":
        filtered.sort((a, b) => b.reportCount - a.reportCount);
        break;
      default:
        break;
    }

    return filtered;
  }, [posts, searchTerm, statusFilter, typeFilter, sortBy]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
          Posts Management
        </h2>
        <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
          {filteredPosts.length} posts
        </span>
      </div>

      <PostFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
          No posts found
        </p>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              expandedComments={expandedComments}
              toggleComments={toggleComments}
              onModerate={onModerate}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsManager;
