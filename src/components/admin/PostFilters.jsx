import React from "react";

const PostFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
}) => {
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "newest";

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search posts by content or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS'] text-sm"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 md:gap-4">
        {/* Status Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
          >
            <option value="all">All Status</option>
            <option value="flagged">Flagged</option>
            <option value="hidden">Hidden</option>
            <option value="reported">Reported</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
            Type:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
          >
            <option value="all">All Types</option>
            <option value="withComments">With Comments</option>
            <option value="withLikes">With Likes</option>
            <option value="withReports">With Reports</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
            Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostCommented">Most Commented</option>
            <option value="mostReported">Most Reported</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Comic_Sans_MS']"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default PostFilters;
