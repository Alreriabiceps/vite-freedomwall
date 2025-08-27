import { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Flag,
  Trash2,
  BarChart3,
  Users,
  MessageSquare,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { getUserIdentifier } from "../utils/userIdentifier";

const AdminDashboard = ({ onModerate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    flaggedPosts: 0,
    hiddenPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalReports: 0,
  });

  useEffect(() => {
    // Check if admin key is stored
    const storedKey = localStorage.getItem("eca_admin_key");
    if (storedKey) {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
      fetchAdminPosts();
    }
  }, []);

  const fetchAdminPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/v1/posts/admin");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
      calculateStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (postsData) => {
    const stats = {
      totalPosts: postsData.length,
      flaggedPosts: postsData.filter((p) => p.isFlagged).length,
      hiddenPosts: postsData.filter((p) => p.isHidden).length,
      totalComments: postsData.reduce(
        (sum, p) => sum + (p.comments?.length || 0),
        0
      ),
      totalLikes: postsData.reduce((sum, p) => sum + (p.likes || 0), 0),
      totalReports: postsData.reduce((sum, p) => sum + (p.reportCount || 0), 0),
    };
    setStats(stats);
  };

  const handleAuthenticate = () => {
    if (adminKey.trim()) {
      localStorage.setItem("eca_admin_key", adminKey);
      setIsAuthenticated(true);
      fetchAdminPosts();
    }
  };

  const handleModerate = async (postId, action) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/posts/${postId}/moderate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, adminKey }),
        }
      );

      if (response.ok) {
        // Refresh posts after moderation
        fetchAdminPosts();
        if (onModerate) {
          onModerate(postId, action);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error moderating post:", error);
      alert("Error moderating post");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eca_admin_key");
    setIsAuthenticated(false);
    setAdminKey("");
    setPosts([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
        <div className="text-center mb-6">
          <Shield className="text-blue-600 mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Comic_Sans_MS']">
            Admin Access
          </h3>
          <p className="text-gray-600 font-['Comic_Sans_MS']">
            Enter admin key to access moderation tools
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500 font-['Comic_Sans_MS']"
          />
          <button
            onClick={handleAuthenticate}
            disabled={!adminKey.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Comic_Sans_MS']"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-xl font-['Comic_Sans_MS']">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-800 text-lg mb-6 font-['Comic_Sans_MS']">
            Error: {error}
          </p>
          <button
            onClick={fetchAdminPosts}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-['Comic_Sans_MS']"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 text-xl font-['Comic_Sans_MS']">
            Moderate posts and view analytics
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-['Comic_Sans_MS']"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                Total Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                {stats.totalPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flag className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                Flagged Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                {stats.flaggedPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <EyeOff className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                Hidden Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                {stats.hiddenPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                Total Comments
              </p>
              <p className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                {stats.totalComments}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="text-pink-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                Total Likes
              </p>
              <p className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                {stats.totalLikes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                Total Reports
              </p>
              <p className="text-2xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                {stats.totalReports}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-['Comic_Sans_MS']">
          All Posts ({posts.length})
        </h3>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-['Comic_Sans_MS']">
              No posts found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 font-['Comic_Sans_MS']">
                        {post.name || "Anonymous"}
                      </h4>
                      <span className="text-sm text-gray-500 font-['Comic_Sans_MS']">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.isFlagged && (
                        <span className="flex items-center gap-1 text-orange-600 text-sm">
                          <Flag size={14} />
                          Flagged ({post.reportCount})
                        </span>
                      )}
                      {post.isHidden && (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <EyeOff size={14} />
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 font-['Comic_Sans_MS'] mb-2">
                      {post.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-['Comic_Sans_MS']">
                      <span>❤️ {post.likes || 0} likes</span>
                      <span>💬 {post.comments?.length || 0} comments</span>
                      {post.reportCount > 0 && (
                        <span>🚨 {post.reportCount} reports</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isHidden ? (
                      <button
                        onClick={() => handleModerate(post._id, "unhide")}
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
                        onClick={() => handleModerate(post._id, "unflag")}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
