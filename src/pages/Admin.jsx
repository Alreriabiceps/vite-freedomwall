import { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Trash2,
  Flag,
  Users,
  MessageCircle,
  Heart,
  BarChart3,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from "lucide-react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [stats, setStats] = useState({
    totalPosts: 0,
    flaggedPosts: 0,
    hiddenPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalReports: 0,
    totalContacts: 0,
  });
  const [contactMessages, setContactMessages] = useState([]);
  const [polls, setPolls] = useState([]);

  // Check if already authenticated
  useEffect(() => {
    const savedKey = localStorage.getItem("adminKey");
    if (savedKey) {
      setIsAuthenticated(true);
      fetchPosts(savedKey);
      fetchStats(savedKey);
      fetchContactMessages(savedKey);
      fetchPolls(savedKey);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Test admin access by fetching admin posts
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        headers: {
          "Admin-Key": adminKey,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("adminKey", adminKey);
        fetchPosts(adminKey);
        fetchStats(adminKey);
        fetchContactMessages(adminKey);
        fetchPolls(adminKey);
      } else {
        setError("Invalid admin key");
      }
    } catch {
      setError("Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminKey");
    setPosts([]);
    setStats({
      totalPosts: 0,
      flaggedPosts: 0,
      hiddenPosts: 0,
      totalComments: 0,
      totalLikes: 0,
      totalReports: 0,
      totalContacts: 0,
    });
    setContactMessages([]);
    setPolls([]);
    setExpandedComments({});
  };

  const fetchPosts = async (key) => {
    try {
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        headers: {
          "Admin-Key": key,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch {
      console.error("Error fetching posts");
    }
  };

  const fetchStats = async (key) => {
    try {
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        headers: {
          "Admin-Key": key,
        },
      });
      if (response.ok) {
        const data = await response.json();

        const totalComments = data.reduce(
          (sum, post) => sum + post.comments.length,
          0
        );
        const totalLikes = data.reduce((sum, post) => sum + post.likes, 0);
        const totalReports = data.reduce(
          (sum, post) => sum + post.reportCount,
          0
        );

        setStats((prev) => ({
          ...prev,
          totalPosts: data.length,
          flaggedPosts: data.filter((post) => post.isFlagged).length,
          hiddenPosts: data.filter((post) => post.isHidden).length,
          totalComments,
          totalLikes,
          totalReports,
        }));
      }
    } catch {
      console.error("Error fetching stats");
    }
  };

  const fetchContactMessages = async (key) => {
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_ADMIN, {
        headers: {
          "Admin-Key": key,
        },
      });

      if (response.ok) {
        const contacts = await response.json();
        setContactMessages(contacts);
        setStats((prev) => ({
          ...prev,
          totalContacts: contacts.length,
        }));
      }
    } catch {
      console.error("Error fetching contact messages");
    }
  };

  const fetchPolls = async (key) => {
    try {
      const response = await fetch(API_ENDPOINTS.POLLS_ADMIN, {
        headers: {
          "Admin-Key": key,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPolls(data);
      }
    } catch {
      console.error("Error fetching polls");
    }
  };

  const handlePollStatus = async (pollId, isActive) => {
    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POLLS, `/${pollId}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Admin-Key": key,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (response.ok) {
        // Update local state
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll._id === pollId ? { ...poll, isActive } : poll
          )
        );
      }
    } catch (error) {
      console.error("Error updating poll status:", error);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;

    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POLLS, `/${pollId}`),
        {
          method: "DELETE",
          headers: {
            "Admin-Key": key,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setPolls((prevPolls) =>
          prevPolls.filter((poll) => poll._id !== pollId)
        );
      }
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const handleContactStatus = async (contactId, action, value = null) => {
    try {
      const key = localStorage.getItem("adminKey");
      let body = {};

      if (action === "read") {
        body = {
          isRead: !contactMessages.find((c) => c._id === contactId)?.isRead,
        };
      } else if (action === "status") {
        body = { status: value };
      }

      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.CONTACT, `/${contactId}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Admin-Key": key,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        fetchContactMessages(key);
      } else {
        setError("Failed to update contact status");
      }
    } catch {
      setError("Error updating contact status");
    }
  };

  const handleContactDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.CONTACT, `/${contactId}`),
        {
          method: "DELETE",
          headers: {
            "Admin-Key": key,
          },
        }
      );

      if (response.ok) {
        fetchContactMessages(key);
      } else {
        setError("Failed to delete contact message");
      }
    } catch {
      setError("Error deleting contact message");
    }
  };

  const handleModerate = async (postId, action) => {
    try {
      const key = localStorage.getItem("adminKey");
      let response;

      if (action === "delete") {
        if (
          !window.confirm(
            "Are you sure you want to permanently delete this post?"
          )
        ) {
          return;
        }

        response = await fetch(
          buildEndpoint(API_ENDPOINTS.POSTS, `/${postId}`),
          {
            method: "DELETE",
            headers: {
              "Admin-Key": key,
            },
          }
        );
      } else {
        // For hide/unhide/flag actions, use the status endpoint
        const body = {};
        if (action === "hide") body.isHidden = true;
        if (action === "unhide") body.isHidden = false;
        if (action === "flag") body.isFlagged = true;
        if (action === "unflag") body.isFlagged = false;

        response = await fetch(
          buildEndpoint(API_ENDPOINTS.POSTS, `/${postId}/status`),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Admin-Key": key,
            },
            body: JSON.stringify(body),
          }
        );
      }

      if (response.ok) {
        if (action === "delete") {
          // Remove from local state
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
        } else {
          // Refresh posts to get updated status
          fetchPosts(key);
        }
        fetchStats(key);
        localStorage.setItem("postsLastModified", Date.now().toString());
        window.dispatchEvent(new CustomEvent("postsModified"));
      } else {
        setError("Failed to moderate post");
      }
    } catch {
      setError("Error moderating post");
    }
  };

  const handleDeleteComment = async (postId, commentIndex) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(
        buildEndpoint(
          API_ENDPOINTS.POSTS,
          `/${postId}/comment/${commentIndex}`
        ),
        {
          method: "DELETE",
          headers: {
            "Admin-Key": key,
          },
        }
      );

      if (response.ok) {
        fetchPosts(key);
        fetchStats(key);
        localStorage.setItem("postsLastModified", Date.now().toString());
        window.dispatchEvent(new CustomEvent("postsModified"));
      } else {
        setError("Failed to delete comment");
      }
    } catch {
      setError("Error deleting comment");
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case "reported":
        return posts.filter((post) => post.reportCount > 0);
      case "hidden":
        return posts.filter((post) => post.isHidden);
      case "flagged":
        return posts.filter((post) => post.isFlagged);
      default:
        return posts;
    }
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

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-['Comic_Sans_MS']">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold font-['Comic_Sans_MS']"
            >
              {loading ? (
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-['Comic_Sans_MS']">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                  IS Freedom Wall
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "dashboard"
                  ? "bg-red-100 text-red-700 border-r-2 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("all-posts")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "all-posts"
                  ? "bg-red-100 text-red-700 border-r-2 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText size={20} />
              <span>All Posts</span>
            </button>
            <button
              onClick={() => setActiveTab("reported")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "reported"
                  ? "bg-red-100 text-red-700 border-r-2 border-red-500"
                  : "text-red-700 hover:bg-red-50"
              }`}
            >
              <Flag size={20} />
              <span>Reported Posts</span>
              {stats.totalReports > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.totalReports}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("flagged")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "flagged"
                  ? "bg-red-100 text-red-700 border-r-2 border-red-500"
                  : "text-orange-700 hover:bg-orange-50"
              }`}
            >
              <AlertTriangle size={20} />
              <span>Flagged Posts</span>
              {stats.flaggedPosts > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.flaggedPosts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("hidden")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "hidden"
                  ? "bg-red-100 text-red-700 border-r-2 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <EyeOff size={20} />
              <span>Hidden Posts</span>
              {stats.hiddenPosts > 0 && (
                <span className="ml-auto bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.hiddenPosts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("polls")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "polls"
                  ? "bg-purple-100 text-purple-700 border-r-2 border-purple-500"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              <BarChart3 size={20} />
              <span>Polls</span>
              {polls.length > 0 && (
                <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {polls.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("contact-messages")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "contact-messages"
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                  : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              <MessageSquare size={20} />
              <span>Contact Messages</span>
              {stats.totalContacts > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.totalContacts}
                </span>
              )}
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-['Comic_Sans_MS']"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "all-posts" && "All Posts"}
              {activeTab === "reported" && "Reported Posts"}
              {activeTab === "flagged" && "Flagged Posts"}
              {activeTab === "hidden" && "Hidden Posts"}
              {activeTab === "polls" && "Polls"}
              {activeTab === "contact-messages" && "Contact Messages"}
            </h1>
            <p className="text-gray-600 text-lg font-['Comic_Sans_MS']">
              {activeTab === "dashboard" && "Overview and statistics"}
              {activeTab === "all-posts" && "Manage all posts and comments"}
              {activeTab === "reported" &&
                "Posts that have been reported by users"}
              {activeTab === "flagged" && "Posts flagged for moderation"}
              {activeTab === "hidden" && "Posts currently hidden from users"}
              {activeTab === "polls" && "Manage all polls and voting"}
              {activeTab === "contact-messages" &&
                "Messages from users via contact form"}
            </p>
          </div>

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Posts
                    </p>
                    <p className="text-3xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                      {stats.totalPosts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Flagged Posts
                    </p>
                    <p className="text-3xl font-bold text-orange-600 font-['Comic_Sans_MS']">
                      {stats.flaggedPosts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flag className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Hidden Posts
                    </p>
                    <p className="text-3xl font-bold text-red-600 font-['Comic_Sans_MS']">
                      {stats.hiddenPosts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <EyeOff className="text-red-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Comments
                    </p>
                    <p className="text-3xl font-bold text-green-600 font-['Comic_Sans_MS']">
                      {stats.totalComments}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="text-green-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Likes
                    </p>
                    <p className="text-3xl font-bold text-pink-600 font-['Comic_Sans_MS']">
                      {stats.totalLikes}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="text-pink-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Reports
                    </p>
                    <p className="text-3xl font-bold text-purple-600 font-['Comic_Sans_MS']">
                      {stats.totalReports}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Contact Messages
                    </p>
                    <p className="text-3xl font-bold text-blue-600 font-['Comic_Sans_MS']">
                      {stats.totalContacts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Polls
                    </p>
                    <p className="text-3xl font-bold text-purple-600 font-['Comic_Sans_MS']">
                      {polls.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            {activeTab !== "contact-messages" && activeTab !== "polls" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    {activeTab === "dashboard" && "Recent Posts"}
                    {activeTab === "all-posts" && "All Posts"}
                    {activeTab === "reported" && "Reported Posts"}
                    {activeTab === "flagged" && "Flagged Posts"}
                    {activeTab === "hidden" && "Hidden Posts"}
                  </h2>
                  <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                    {filteredPosts.length} posts
                  </span>
                </div>

                {filteredPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No posts found
                  </p>
                ) : (
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <div
                        key={post._id}
                        className={`border border-gray-200 rounded-xl p-6 ${
                          post.isHidden ? "bg-gray-50 opacity-75" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS']">
                                {post.name || "Anonymous"}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {formatDate(post.createdAt)}
                              </span>
                              {post.isFlagged && (
                                <span className="flex items-center gap-1 text-orange-600 text-sm">
                                  <Flag size={14} />
                                  Flagged ({post.reportCount} reports)
                                </span>
                              )}
                              {post.isHidden && (
                                <span className="flex items-center gap-1 text-red-600 text-sm">
                                  <EyeOff size={14} />
                                  Hidden
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 font-['Comic_Sans_MS'] mb-3 text-lg">
                              {post.message}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-['Comic_Sans_MS']">
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

                          <div className="flex items-center gap-2 ml-4">
                            {post.isHidden ? (
                              <button
                                onClick={() =>
                                  handleModerate(post._id, "unhide")
                                }
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Unhide post"
                              >
                                <Eye size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleModerate(post._id, "hide")}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Hide post"
                              >
                                <EyeOff size={16} />
                              </button>
                            )}
                            {post.isFlagged && (
                              <button
                                onClick={() =>
                                  handleModerate(post._id, "unflag")
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Unflag post"
                              >
                                <Shield size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleModerate(post._id, "delete")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {post.comments && post.comments.length > 0 && (
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
                                    className="flex items-start justify-between bg-gray-50 rounded-lg p-3"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
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
                                      onClick={() =>
                                        handleDeleteComment(post._id, index)
                                      }
                                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                                      title="Delete comment"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "polls" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Polls
                  </h2>
                  <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                    {polls.length} polls
                  </span>
                </div>

                {polls.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No polls created yet
                  </p>
                ) : (
                  <div className="space-y-6">
                    {polls.map((poll) => (
                      <div
                        key={poll._id}
                        className={`border border-gray-200 rounded-xl p-6 ${
                          poll.isActive ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS']">
                                {poll.question}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {formatDate(poll.createdAt)}
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
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-['Comic_Sans_MS'] mb-3">
                              <span className="flex items-center gap-1">
                                <BarChart3 size={14} />
                                {poll.options.length} options
                              </span>
                              {poll.expiresAt && (
                                <span className="flex items-center gap-1">
                                  <AlertTriangle size={14} />
                                  Expires: {formatDate(poll.expiresAt)}
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

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() =>
                              handlePollStatus(poll._id, !poll.isActive)
                            }
                            className={`p-2 rounded-lg transition-colors ${
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
                            {poll.isActive ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeletePoll(poll._id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Delete poll"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "contact-messages" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Contact Messages
                  </h2>
                  <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                    {contactMessages.length} messages
                  </span>
                </div>

                {contactMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No contact messages yet
                  </p>
                ) : (
                  <div className="space-y-6">
                    {contactMessages.map((contact) => (
                      <div
                        key={contact._id}
                        className={`border border-gray-200 rounded-xl p-6 ${
                          contact.isRead ? "bg-gray-50" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS']">
                                {contact.name}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {formatDate(contact.createdAt)}
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
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-['Comic_Sans_MS'] mb-3">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {contact.email}
                              </span>
                              {contact.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={14} />
                                  {contact.phone}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-800 font-['Comic_Sans_MS'] mb-2">
                              {contact.subject}
                            </h4>
                            <p className="text-gray-700 font-['Comic_Sans_MS'] mb-3 text-lg">
                              {contact.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() =>
                              handleContactStatus(contact._id, "read")
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              contact.isRead
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            title={
                              contact.isRead ? "Mark as unread" : "Mark as read"
                            }
                          >
                            <Eye size={16} />
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
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete message"
                          >
                            <Trash2 size={16} />
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Admin;
