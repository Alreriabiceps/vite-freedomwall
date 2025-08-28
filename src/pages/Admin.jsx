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
  Megaphone,
  User,
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
  const [announcements, setAnnouncements] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "info",
    expiresAt: "",
    adminNotes: "",
  });

  // Search and filter states for posts
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Search and filter states for polls
  const [pollSearchTerm, setPollSearchTerm] = useState("");
  const [pollStatusFilter, setPollStatusFilter] = useState("all");
  const [pollSortBy, setPollSortBy] = useState("newest");

  // Search and filter states for announcements
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState("");
  const [announcementTypeFilter, setAnnouncementTypeFilter] = useState("all");
  const [announcementStatusFilter, setAnnouncementStatusFilter] =
    useState("all");
  const [announcementSortBy, setAnnouncementSortBy] = useState("newest");

  // Search and filter states for contact messages
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [contactSortBy, setContactSortBy] = useState("newest");

  // Hide user navigation elements when admin page loads
  useEffect(() => {
    // Hide navigation elements
    const navbar = document.querySelector("[data-navbar]");
    const bottomNav = document.querySelector("[data-bottom-nav]");
    const footer = document.querySelector("[data-footer]");
    const ads = document.querySelectorAll("[data-ad-container]");

    if (navbar) navbar.style.display = "none";
    if (bottomNav) bottomNav.style.display = "none";
    if (footer) footer.style.display = "none";
    ads.forEach((ad) => (ad.style.display = "none"));

    // Cleanup function to restore navigation when component unmounts
    return () => {
      if (navbar) navbar.style.display = "";
      if (bottomNav) bottomNav.style.display = "";
      if (footer) footer.style.display = "";
      ads.forEach((ad) => (ad.style.display = ""));
    };
  }, []);

  // Check if already authenticated
  useEffect(() => {
    const savedKey = localStorage.getItem("adminKey");
    if (savedKey) {
      setIsAuthenticated(true);
      fetchPosts(savedKey);
      fetchStats(savedKey);
      fetchContactMessages(savedKey);
      fetchPolls(savedKey);
      fetchAnnouncements(savedKey);
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
          "admin-key": adminKey,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("adminKey", adminKey);
        fetchPosts(adminKey);
        fetchStats(adminKey);
        fetchContactMessages(adminKey);
        fetchPolls(adminKey);
        fetchAnnouncements(adminKey);
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
    setAnnouncements([]);
    setExpandedComments({});
  };

  const fetchPosts = async (key) => {
    try {
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        headers: {
          "admin-key": key,
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
          "admin-key": key,
        },
      });
      if (response.ok) {
        const data = await response.json();

        const totalComments = data.reduce(
          (sum, post) => sum + post.comments.length,
          0
        );
        const totalLikes = data.reduce((sum, post) => sum + post.likes, 0);
        const totalReports = data.filter((post) => post.reportCount > 0).length;

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
          "admin-key": key,
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
          "admin-key": key,
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

  const fetchAnnouncements = async (key) => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS_ADMIN, {
        headers: {
          "admin-key": key,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch {
      console.error("Error fetching announcements");
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
            "admin-key": key,
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
            "admin-key": key,
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

  const handleAnnouncementStatus = async (announcementId, isActive) => {
    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.ANNOUNCEMENTS, `/${announcementId}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "admin-key": key,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (response.ok) {
        // Update local state
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement._id === announcementId
              ? { ...announcement, isActive }
              : announcement
          )
        );
      }
    } catch (error) {
      console.error("Error updating announcement status:", error);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.ANNOUNCEMENTS, `/${announcementId}`),
        {
          method: "DELETE",
          headers: {
            "admin-key": key,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (announcement) => announcement._id !== announcementId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();

    try {
      const key = localStorage.getItem("adminKey");
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-key": key,
        },
        body: JSON.stringify({
          ...newAnnouncement,
          expiresAt: newAnnouncement.expiresAt || null,
        }),
      });

      if (response.ok) {
        const newAnnouncementData = await response.json();
        setAnnouncements((prev) => [newAnnouncementData, ...prev]);
        setNewAnnouncement({
          title: "",
          message: "",
          type: "info",
          expiresAt: "",
          adminNotes: "",
        });
        setShowCreateForm(false);
        setActiveTab("announcements");
      } else {
        setError("Failed to create announcement");
      }
    } catch (error) {
      setError("Error creating announcement");
      console.error("Error creating announcement:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewAnnouncement((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            "admin-key": key,
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
            "admin-key": key,
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
              "admin-key": key,
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
              "admin-key": key,
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
            "admin-key": key,
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
  };

  // Filter and search functions for polls
  const getFilteredPolls = () => {
    let filtered = [...polls];

    // Search filter
    if (pollSearchTerm) {
      filtered = filtered.filter(
        (poll) =>
          poll.question.toLowerCase().includes(pollSearchTerm.toLowerCase()) ||
          poll.createdBy.toLowerCase().includes(pollSearchTerm.toLowerCase())
      );
    }

    // Status filter
    if (pollStatusFilter !== "all") {
      if (pollStatusFilter === "active") {
        filtered = filtered.filter((poll) => poll.isActive);
      } else if (pollStatusFilter === "inactive") {
        filtered = filtered.filter((poll) => !poll.isActive);
      }
    }

    // Sorting
    switch (pollSortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "mostVotes":
        filtered.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
        break;
      case "mostOptions":
        filtered.sort((a, b) => b.options.length - a.options.length);
        break;
      default:
        break;
    }

    return filtered;
  };

  // Filter and search functions for announcements
  const getFilteredAnnouncements = () => {
    let filtered = [...announcements];

    // Search filter
    if (announcementSearchTerm) {
      filtered = filtered.filter(
        (announcement) =>
          announcement.title
            .toLowerCase()
            .includes(announcementSearchTerm.toLowerCase()) ||
          announcement.message
            .toLowerCase()
            .includes(announcementSearchTerm.toLowerCase())
      );
    }

    // Type filter
    if (announcementTypeFilter !== "all") {
      filtered = filtered.filter(
        (announcement) => announcement.type === announcementTypeFilter
      );
    }

    // Status filter
    if (announcementStatusFilter !== "all") {
      if (announcementStatusFilter === "active") {
        filtered = filtered.filter((announcement) => announcement.isActive);
      } else if (announcementStatusFilter === "inactive") {
        filtered = filtered.filter((announcement) => !announcement.isActive);
      }
    }

    // Sorting
    switch (announcementSortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Filter and search functions for contact messages
  const getFilteredContacts = () => {
    let filtered = [...contactMessages];

    // Search filter
    if (contactSearchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name
            .toLowerCase()
            .includes(contactSearchTerm.toLowerCase()) ||
          contact.subject
            .toLowerCase()
            .includes(contactSearchTerm.toLowerCase()) ||
          contact.message
            .toLowerCase()
            .includes(contactSearchTerm.toLowerCase())
      );
    }

    // Status filter
    if (contactStatusFilter !== "all") {
      filtered = filtered.filter(
        (contact) => contact.status === contactStatusFilter
      );
    }

    // Sorting
    switch (contactSortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "subject":
        filtered.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      default:
        break;
    }

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
  const filteredPolls = getFilteredPolls();
  const filteredAnnouncements = getFilteredAnnouncements();
  const filteredContacts = getFilteredContacts();

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 touch-manipulation"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 sm:w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Admin Panel
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 font-['Comic_Sans_MS']">
                    IS Freedom Wall
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-3 md:p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] text-sm md:text-base ${
                activeTab === "dashboard"
                  ? "bg-red-100 text-red-700 border-r-2 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 size={18} />
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
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] ${
                activeTab === "announcements"
                  ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                  : "text-orange-700 hover:bg-orange-50"
              }`}
            >
              <Megaphone size={20} />
              <span>Announcements</span>
              {announcements.length > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {announcements.length}
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

          <div className="p-3 md:p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 pb-20 lg:pb-6">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 font-['Comic_Sans_MS']">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "all-posts" && "All Posts"}
              {activeTab === "reported" && "Reported Posts"}
              {activeTab === "flagged" && "Flagged Posts"}
              {activeTab === "hidden" && "Hidden Posts"}
              {activeTab === "polls" && "Polls"}
              {activeTab === "announcements" && "Announcements"}
              {activeTab === "contact-messages" && "Contact Messages"}
            </h1>
            <p className="text-gray-600 text-base md:text-lg font-['Comic_Sans_MS']">
              {activeTab === "dashboard" && "Overview and statistics"}
              {activeTab === "all-posts" && "Manage all posts and comments"}
              {activeTab === "reported" &&
                "Posts that have been reported by users"}
              {activeTab === "flagged" && "Posts flagged for moderation"}
              {activeTab === "hidden" && "Posts currently hidden from users"}
              {activeTab === "polls" && "Manage all polls and voting"}
              {activeTab === "announcements" &&
                "Create and manage announcements"}
              {activeTab === "contact-messages" &&
                "Messages from users via contact form"}
            </p>
          </div>

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Posts
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                      {filteredPosts.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-blue-600" size={20} />
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
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Total Announcements
                    </p>
                    <p className="text-3xl font-bold text-orange-600 font-['Comic_Sans_MS']">
                      {announcements.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Megaphone className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            {activeTab !== "contact-messages" &&
              activeTab !== "polls" &&
              activeTab !== "announcements" && (
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

                  {/* Search and Filter Controls */}
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
                      {(searchTerm ||
                        statusFilter !== "all" ||
                        typeFilter !== "all" ||
                        sortBy !== "newest") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setTypeFilter("all");
                            setSortBy("newest");
                          }}
                          className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Comic_Sans_MS']"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredPosts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                      No posts found
                    </p>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      {filteredPosts.map((post) => (
                        <div
                          key={post._id}
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
                                  onClick={() =>
                                    handleModerate(post._id, "unhide")
                                  }
                                  className="p-2 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Unhide post"
                                >
                                  <Eye size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleModerate(post._id, "hide")
                                  }
                                  className="p-2 md:p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
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
                                  className="p-2 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Unflag post"
                                >
                                  <Shield size={16} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleModerate(post._id, "delete")
                                }
                                className="p-2 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                        onClick={() =>
                                          handleDeleteComment(post._id, index)
                                        }
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
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {activeTab === "announcements" && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                    Announcements
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
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
                        value={announcementSearchTerm}
                        onChange={(e) =>
                          setAnnouncementSearchTerm(e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-['Comic_Sans_MS']"
                      />
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 md:gap-4">
                    {/* Type Filter */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] whitespace-nowrap">
                        Type:
                      </label>
                      <select
                        value={announcementTypeFilter}
                        onChange={(e) =>
                          setAnnouncementTypeFilter(e.target.value)
                        }
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
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
                      <select
                        value={announcementStatusFilter}
                        onChange={(e) =>
                          setAnnouncementStatusFilter(e.target.value)
                        }
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
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
                      <select
                        value={announcementSortBy}
                        onChange={(e) => setAnnouncementSortBy(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">By Title</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(announcementSearchTerm ||
                      announcementTypeFilter !== "all" ||
                      announcementStatusFilter !== "all" ||
                      announcementSortBy !== "newest") && (
                      <button
                        onClick={() => {
                          setAnnouncementSearchTerm("");
                          setAnnouncementTypeFilter("all");
                          setAnnouncementStatusFilter("all");
                          setAnnouncementSortBy("newest");
                        }}
                        className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Comic_Sans_MS']"
                      >
                        Clear Filters
                      </button>
                    )}
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
                          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
                        >
                          Create Announcement
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-['Comic_Sans_MS'] font-semibold"
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
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 font-['Comic_Sans_MS']">
                                {announcement.title}
                              </h3>
                              <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                                {formatDate(announcement.createdAt)}
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
                            <p className="text-gray-700 font-['Comic_Sans_MS'] mb-3 text-lg">
                              {announcement.message}
                            </p>
                            {announcement.expiresAt && (
                              <div className="text-sm text-orange-600 font-['Comic_Sans_MS'] mb-3">
                                <AlertTriangle
                                  size={14}
                                  className="inline mr-1"
                                />
                                Expires: {formatDate(announcement.expiresAt)}
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

                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <button
                            onClick={() =>
                              handleAnnouncementStatus(
                                announcement._id,
                                !announcement.isActive
                              )
                            }
                            className={`p-2 rounded-lg transition-colors ${
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
                            {announcement.isActive ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAnnouncement(announcement._id)
                            }
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Delete announcement"
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

            {activeTab === "polls" && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
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
                        value={pollSearchTerm}
                        onChange={(e) => setPollSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                      />
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS']">
                        Status:
                      </label>
                      <select
                        value={pollStatusFilter}
                        onChange={(e) => setPollStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS']">
                        Sort:
                      </label>
                      <select
                        value={pollSortBy}
                        onChange={(e) => setPollSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="mostVotes">Most Votes</option>
                        <option value="mostOptions">Most Options</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(pollSearchTerm ||
                      pollStatusFilter !== "all" ||
                      pollSortBy !== "newest") && (
                      <button
                        onClick={() => {
                          setPollSearchTerm("");
                          setPollStatusFilter("all");
                          setPollSortBy("newest");
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Comic_Sans_MS']"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {filteredPolls.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No polls found
                  </p>
                ) : (
                  <div className="space-y-6">
                    {filteredPolls.map((poll) => (
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
                        value={contactSearchTerm}
                        onChange={(e) => setContactSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-['Comic_Sans_MS']"
                      />
                    </div>
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS']">
                        Status:
                      </label>
                      <select
                        value={contactStatusFilter}
                        onChange={(e) => setContactStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
                      >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 font-['Comic_Sans_MS']">
                        Sort:
                      </label>
                      <select
                        value={contactSortBy}
                        onChange={(e) => setContactSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-['Comic_Sans_MS']"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">By Name</option>
                        <option value="subject">By Subject</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(contactSearchTerm ||
                      contactStatusFilter !== "all" ||
                      contactSortBy !== "newest") && (
                      <button
                        onClick={() => {
                          setContactSearchTerm("");
                          setContactStatusFilter("all");
                          setContactSortBy("newest");
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Comic_Sans_MS']"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {filteredContacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 font-['Comic_Sans_MS']">
                    No contact messages found
                  </p>
                ) : (
                  <div className="space-y-6">
                    {filteredContacts.map((contact) => (
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
                                <User size={14} />
                                From: {contact.name}
                              </span>
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
