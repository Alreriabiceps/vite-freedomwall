import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

// Custom hooks
import { useAdminAuth } from "../hooks/useAdminAuth";
import { usePosts } from "../hooks/usePosts";
import { useStats } from "../hooks/useStats";
import { usePolls } from "../hooks/usePolls";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useContacts } from "../hooks/useContacts";
import { useWordBan } from "../hooks/useWordBan";

// Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import Dashboard from "../components/admin/Dashboard";
import PostsManager from "../components/admin/PostsManager";
import WordBanManager from "../components/admin/WordBanManager";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Custom hooks
  const {
    isAuthenticated,
    adminKey,
    setAdminKey,
    loading: authLoading,
    error: authError,
    handleLogin,
    handleLogout,
  } = useAdminAuth();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    expandedComments,
    fetchPosts,
    handleModerate,
    handleDeleteComment,
    toggleComments,
  } = usePosts(adminKey);
  const {
    stats,
    loading: statsLoading,
    fetchStats,
    updateContactCount,
    updatePollCount,
    updateAnnouncementCount,
  } = useStats(adminKey);
  const {
    polls,
    loading: pollsLoading,
    error: pollsError,
    fetchPolls,
    handlePollStatus,
    handleDeletePoll,
  } = usePolls(adminKey);
  const {
    announcements,
    loading: announcementsLoading,
    error: announcementsError,
    showCreateForm,
    newAnnouncement,
    setShowCreateForm,
    fetchAnnouncements,
    handleAnnouncementStatus,
    handleDeleteAnnouncement,
    handleCreateAnnouncement,
    handleInputChange,
    resetForm,
  } = useAnnouncements(adminKey);
  const {
    contactMessages,
    loading: contactsLoading,
    error: contactsError,
    fetchContactMessages,
    handleContactStatus,
    handleContactDelete,
  } = useContacts(adminKey);

  const {
    bannedWords,
    loading: wordBanLoading,
    error: wordBanError,
    showAddForm: showWordAddForm,
    newWord,
    setShowAddForm: setShowWordAddForm,
    fetchBannedWords,
    handleAddWord,
    handleDeleteWord,
    handleUpdateWord,
    handleInputChange: handleWordInputChange,
    resetForm: resetWordForm,
  } = useWordBan(adminKey);

  // Update stats when data changes
  useEffect(() => {
    if (isAuthenticated && adminKey) {
      // Fetch all data and update stats
      const fetchAllData = async () => {
        await Promise.all([
          fetchPosts(),
          fetchStats(),
          fetchContactMessages(),
          fetchPolls(),
          fetchAnnouncements(),
          fetchBannedWords(),
        ]);
      };
      fetchAllData();
    }
  }, [
    isAuthenticated,
    adminKey,
    fetchPosts,
    fetchStats,
    fetchContactMessages,
    fetchPolls,
    fetchAnnouncements,
    fetchBannedWords,
  ]);

  // Update stats counts when data changes
  useEffect(() => {
    if (contactMessages.length > 0) {
      updateContactCount(contactMessages.length);
    }
  }, [contactMessages]);

  useEffect(() => {
    if (polls.length > 0) {
      updatePollCount(polls.length);
    }
  }, [polls]);

  useEffect(() => {
    if (announcements.length > 0) {
      updateAnnouncementCount(announcements.length);
    }
  }, [announcements]);

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    let filtered = [...posts];

    // Tab-based filtering
    switch (activeTab) {
      case "reported":
        filtered = filtered.filter((post) => post.reportCount > 0);
        break;
      case "hidden":
        filtered = filtered.filter((post) => post.isHidden);
        break;
      case "flagged":
        filtered = filtered.filter((post) => post.isFlagged);
        break;
      default:
        break;
    }

    return filtered;
  };

  // Filter and search functions for polls
  const getFilteredPolls = () => {
    let filtered = [...polls];
    // Add any additional filtering logic here if needed
    return filtered;
  };

  // Filter and search functions for announcements
  const getFilteredAnnouncements = () => {
    let filtered = [...announcements];
    // Add any additional filtering logic here if needed
    return filtered;
  };

  // Filter and search functions for contact messages
  const getFilteredContacts = () => {
    let filtered = [...contactMessages];
    // Add any additional filtering logic here if needed
    return filtered;
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              Admin Access
            </h1>
            <p className="text-gray-600 font-['Comic_Sans_MS']">
              Enter your admin key to access the management panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="adminKey"
                className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']"
              >
                Admin Key
              </label>
              <input
                type="password"
                id="adminKey"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 text-gray-900 font-['Comic_Sans_MS']"
                placeholder="Enter admin key"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-['Comic_Sans_MS']">
                  {authError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold font-['Comic_Sans_MS']"
            >
              {authLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredPosts = getFilteredPosts();
  const filteredPolls = getFilteredPolls();
  const filteredAnnouncements = getFilteredAnnouncements();
  const filteredContacts = getFilteredContacts();

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        polls={polls}
        announcements={announcements}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 pb-20 lg:pb-6">
          <AdminHeader activeTab={activeTab} />

          {activeTab === "dashboard" && (
            <Dashboard
              stats={stats}
              polls={polls}
              announcements={announcements}
              bannedWords={bannedWords}
            />
          )}

          <div>
            {activeTab !== "contact-messages" &&
              activeTab !== "polls" &&
              activeTab !== "announcements" &&
              activeTab !== "word-banning" && (
                <PostsManager
                  posts={filteredPosts}
                  expandedComments={expandedComments}
                  onModerate={handleModerate}
                  onDeleteComment={handleDeleteComment}
                  toggleComments={toggleComments}
                />
              )}

            {activeTab === "word-banning" && (
              <WordBanManager
                bannedWords={bannedWords}
                showAddForm={showWordAddForm}
                onAddWord={handleAddWord}
                onDeleteWord={handleDeleteWord}
                onUpdateWord={handleUpdateWord}
                setShowAddForm={setShowWordAddForm}
              />
            )}

            {activeTab === "announcements" && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Announcements
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold touch-manipulation"
                  >
                    Create Announcement
                  </button>
                </div>

                {/* Search and Filter Controls for Announcements */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search announcements by title or message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-['Comic_Sans_MS']"
                      />
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {/* Type Filter */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Type:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm">
                        <option value="all">All Types</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Status:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Sort:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">By Title</option>
                      </select>
                    </div>
                  </div>
                </div>

                {showCreateForm && (
                  <div className="mb-8 p-4 md:p-6 bg-orange-50 border border-orange-200 rounded-xl">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-4">
                      Create New Announcement
                    </h3>
                    <form
                      onSubmit={handleCreateAnnouncement}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={newAnnouncement.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            placeholder="Announcement title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                            Type
                          </label>
                          <select
                            value={newAnnouncement.type}
                            onChange={(e) =>
                              handleInputChange("type", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="success">Success</option>
                            <option value="error">Error</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                          Expires At (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={newAnnouncement.expiresAt}
                          onChange={(e) =>
                            handleInputChange("expiresAt", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                          Message *
                        </label>
                        <textarea
                          value={newAnnouncement.message}
                          onChange={(e) =>
                            handleInputChange("message", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Announcement message"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-['Comic_Sans_MS']">
                          Admin Notes (Optional)
                        </label>
                        <textarea
                          value={newAnnouncement.adminNotes}
                          onChange={(e) =>
                            handleInputChange("adminNotes", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Internal notes for admins"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold touch-manipulation"
                        >
                          Create Announcement
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold touch-manipulation"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {filteredAnnouncements.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No announcements found
                  </p>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {filteredAnnouncements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className={`border border-gray-200 rounded-xl p-4 md:p-6 ${
                          announcement.isActive ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS'] text-base md:text-lg">
                                {announcement.title}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {announcement.createdAt}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  announcement.isActive
                                    ? "bg-green-200 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                } font-['Comic_Sans_MS']`}
                              >
                                {announcement.isActive ? "Active" : "Inactive"}
                              </span>

                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  announcement.type === "warning"
                                    ? "bg-yellow-200 text-yellow-700"
                                    : announcement.type === "success"
                                    ? "bg-green-200 text-green-700"
                                    : announcement.type === "error"
                                    ? "bg-red-200 text-red-700"
                                    : "bg-blue-200 text-blue-700"
                                } font-['Comic_Sans_MS']`}
                              >
                                {announcement.type}
                              </span>
                            </div>
                            <p className="text-gray-700 font-['Comic_Sans_MS'] mb-3 text-base md:text-lg">
                              {announcement.message}
                            </p>
                            {announcement.expiresAt && (
                              <div className="text-sm text-orange-600 font-['Comic_Sans_MS'] mb-3">
                                Expires: {announcement.expiresAt}
                              </div>
                            )}
                            {announcement.adminNotes && (
                              <div className="text-sm text-gray-500 font-['Comic_Sans_MS'] mb-3 p-3 bg-gray-100 rounded-lg">
                                <strong>Admin Notes:</strong>{" "}
                                {announcement.adminNotes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 flex-wrap">
                          <button
                            onClick={() =>
                              handleAnnouncementStatus(
                                announcement._id,
                                !announcement.isActive
                              )
                            }
                            className={`p-2 rounded-lg transition-colors touch-manipulation ${
                              announcement.isActive
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            title={
                              announcement.isActive
                                ? "Deactivate announcement"
                                : "Activate announcement"
                            }
                          >
                            {announcement.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAnnouncement(announcement._id)
                            }
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors touch-manipulation"
                            title="Delete announcement"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "polls" && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Polls
                  </h2>
                  <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                    {filteredPolls.length} polls
                  </span>
                </div>

                {/* Search and Filter Controls for Polls */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search polls by question or creator..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                      />
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {/* Status Filter */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Status:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Sort:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="mostVotes">Most Votes</option>
                        <option value="mostOptions">Most Options</option>
                      </select>
                    </div>
                  </div>
                </div>

                {filteredPolls.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No polls found
                  </p>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {filteredPolls.map((poll) => (
                      <div
                        key={poll._id}
                        className={`border border-gray-200 rounded-xl p-4 md:p-6 ${
                          poll.isActive ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS'] text-base md:text-lg">
                                {poll.question}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {poll.createdAt}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  poll.isActive
                                    ? "bg-green-200 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                } font-['Comic_Sans_MS']`}
                              >
                                {poll.isActive ? "Active" : "Inactive"}
                              </span>
                              <span className="text-sm px-2 py-1 rounded-full bg-purple-200 text-purple-700 font-['Comic_Sans_MS']">
                                {poll.totalVotes || 0} votes
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 font-['Comic_Sans_MS'] mb-3">
                              <span className="flex items-center gap-1">
                                {poll.options.length} options
                              </span>
                              {poll.expiresAt && (
                                <span className="flex items-center gap-1">
                                  Expires: {poll.expiresAt}
                                </span>
                              )}
                            </div>
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-800 font-['Comic_Sans_MS'] mb-2">
                                Options:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {poll.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className="text-sm text-gray-700 font-['Comic_Sans_MS']"
                                  >
                                    • {option.text} ({option.votes || 0} votes)
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 flex-wrap">
                          <button
                            onClick={() =>
                              handlePollStatus(poll._id, !poll.isActive)
                            }
                            className={`p-2 rounded-lg transition-colors touch-manipulation ${
                              poll.isActive
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            title={
                              poll.isActive
                                ? "Deactivate poll"
                                : "Activate poll"
                            }
                          >
                            {poll.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeletePoll(poll._id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors touch-manipulation"
                            title="Delete poll"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "contact-messages" && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Contact Messages
                  </h2>
                  <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                    {filteredContacts.length} messages
                  </span>
                </div>

                {/* Search and Filter Controls for Contact Messages */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search messages by name, subject, or content..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                      />
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {/* Status Filter */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Status:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']">
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Sort:
                      </label>
                      <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">By Name</option>
                        <option value="subject">By Subject</option>
                      </select>
                    </div>
                  </div>
                </div>

                {filteredContacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No contact messages found
                  </p>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact._id}
                        className={`border border-gray-200 rounded-xl p-4 md:p-6 ${
                          contact.isRead ? "bg-gray-50" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex flex-col gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS'] text-base md:text-lg">
                                {contact.name}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {contact.createdAt}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  contact.isRead
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-blue-200 text-blue-700"
                                } font-['Comic_Sans_MS']`}
                              >
                                {contact.isRead ? "Read" : "New"}
                              </span>
                              <span
                                className={`text-sm px-2 py-1 rounded-full capitalize ${
                                  contact.status === "new"
                                    ? "bg-green-200 text-green-700"
                                    : contact.status === "in-progress"
                                    ? "bg-yellow-200 text-yellow-700"
                                    : contact.status === "resolved"
                                    ? "bg-blue-200 text-blue-700"
                                    : "bg-gray-200 text-gray-700"
                                } font-['Comic_Sans_MS']`}
                              >
                                {contact.status.replace("-", " ")}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 font-['Comic_Sans_MS'] mb-3">
                              <span className="flex items-center gap-1">
                                From: {contact.name}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-800 font-['Comic_Sans_MS'] mb-2">
                              {contact.subject}
                            </h4>
                            <p className="text-gray-700 font-['Comic_Sans_MS'] mb-3 text-base md:text-lg">
                              {contact.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 flex-wrap">
                          <button
                            onClick={() =>
                              handleContactStatus(contact._id, "read")
                            }
                            className={`p-2 rounded-lg transition-colors touch-manipulation ${
                              contact.isRead
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            title={
                              contact.isRead ? "Mark as unread" : "Mark as read"
                            }
                          >
                            {contact.isRead ? "Mark Unread" : "Mark Read"}
                          </button>

                          <select
                            value={contact.status}
                            onChange={(e) =>
                              handleContactStatus(
                                contact._id,
                                "status",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Comic_Sans_MS']"
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>

                          <button
                            onClick={() => handleContactDelete(contact._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                            title="Delete message"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
