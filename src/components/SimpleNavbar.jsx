import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PenTool, BarChart3, Info, Mail, Bell } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import { ScaleOnHover } from "./AnimatedComponents";

function SimpleNavbar() {
  const location = useLocation();
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(null);

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoadingAnnouncements(true);
        const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS);

        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
          setAnnouncementsError(null);
        } else {
          console.error(
            "Failed to fetch announcements:",
            response.status,
            response.statusText
          );
          setAnnouncementsError(
            `Failed to fetch announcements: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncementsError(`Error: ${error.message}`);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();

    // Refresh announcements every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Close announcement dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAnnouncements &&
        !event.target.closest(".announcement-dropdown")
      ) {
        setShowAnnouncements(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAnnouncements]);

  const toggleAnnouncements = () => {
    setShowAnnouncements(!showAnnouncements);
  };

  const getActiveAnnouncements = () => {
    return announcements.filter((announcement) => announcement.isActive);
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/create", label: "Create", icon: PenTool },
    { to: "/create-poll", label: "Polls", icon: BarChart3 },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/image.png"
                alt="IS Logo"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
              />
              <span className="text-lg md:text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
                IS Freedom Wall
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    location.pathname === item.to
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            {/* Announcement Icon */}
            <div className="relative">
              <ScaleOnHover>
                <button
                  onClick={toggleAnnouncements}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-gray-700 hover:bg-gray-100 relative"
                >
                  <Bell size={16} />
                  {getActiveAnnouncements().length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveAnnouncements().length}
                    </span>
                  )}
                </button>
              </ScaleOnHover>

              {/* Announcement Dropdown */}
              {showAnnouncements && (
                <div className="announcement-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">
                      Announcements
                    </h3>
                    <button
                      onClick={() => {
                        const fetchAnnouncements = async () => {
                          try {
                            setLoadingAnnouncements(true);
                            const response = await fetch(
                              API_ENDPOINTS.ANNOUNCEMENTS
                            );
                            if (response.ok) {
                              const data = await response.json();
                              setAnnouncements(data);
                            }
                          } catch (error) {
                            console.error(
                              "Error refreshing announcements:",
                              error
                            );
                          } finally {
                            setLoadingAnnouncements(false);
                          }
                        };
                        fetchAnnouncements();
                      }}
                      disabled={loadingAnnouncements}
                      className={`text-base font-semibold px-3 py-2 rounded-lg transition-colors ${
                        loadingAnnouncements
                          ? "text-gray-400 cursor-not-allowed bg-gray-100"
                          : "text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      {loadingAnnouncements ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                  {loadingAnnouncements ? (
                    <div className="p-4 text-gray-600 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mx-auto mb-2"></div>
                      <span className="text-base font-medium">
                        Loading announcements...
                      </span>
                    </div>
                  ) : announcementsError ? (
                    <div className="p-4 text-red-600 text-center">
                      <div className="text-base font-medium mb-3">
                        {announcementsError}
                      </div>
                      <button
                        onClick={() => {
                          const fetchAnnouncements = async () => {
                            try {
                              setLoadingAnnouncements(true);
                              setAnnouncementsError(null);
                              const response = await fetch(
                                API_ENDPOINTS.ANNOUNCEMENTS
                              );
                              if (response.ok) {
                                const data = await response.json();
                                setAnnouncements(data);
                              } else {
                                setAnnouncementsError(
                                  `Failed to fetch announcements: ${response.status}`
                                );
                              }
                            } catch (error) {
                              setAnnouncementsError(`Error: ${error.message}`);
                            } finally {
                              setLoadingAnnouncements(false);
                            }
                          };
                          fetchAnnouncements();
                        }}
                        className="text-blue-700 hover:text-blue-800 text-base font-semibold underline bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  ) : getActiveAnnouncements().length === 0 ? (
                    <div className="p-4 text-gray-600 text-center">
                      <span className="text-base font-medium">
                        No active announcements
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {getActiveAnnouncements().map((announcement) => (
                        <div
                          key={announcement._id}
                          className={`p-4 rounded-lg border-l-4 shadow-sm ${
                            announcement.type === "warning"
                              ? "border-yellow-500 bg-yellow-50"
                              : announcement.type === "success"
                              ? "border-green-500 bg-green-50"
                              : announcement.type === "error"
                              ? "border-red-500 bg-red-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base mb-2 leading-tight">
                                {announcement.title}
                              </h4>
                              <p className="text-gray-800 text-base leading-relaxed mb-3">
                                {announcement.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">
                                  {new Date(
                                    announcement.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Notification Icon - Only show on mobile */}
          <div className="md:hidden">
            <div className="relative">
              <button
                onClick={toggleAnnouncements}
                className="p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors relative bg-gray-50 hover:bg-gray-100"
              >
                <Bell size={24} />
                {getActiveAnnouncements().length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {getActiveAnnouncements().length}
                  </span>
                )}
              </button>

              {/* Mobile Announcement Dropdown */}
              {showAnnouncements && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-base">
                      Announcements
                    </h3>
                    <button
                      onClick={() => setShowAnnouncements(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {loadingAnnouncements ? (
                    <div className="p-3 text-gray-600 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600 mx-auto mb-2"></div>
                      <span className="text-sm font-medium">
                        Loading announcements...
                      </span>
                    </div>
                  ) : announcementsError ? (
                    <div className="p-3 text-red-600 text-center">
                      <div className="text-sm font-medium mb-2">
                        {announcementsError}
                      </div>
                      <button
                        onClick={() => {
                          const fetchAnnouncements = async () => {
                            try {
                              setLoadingAnnouncements(true);
                              setAnnouncementsError(null);
                              const response = await fetch(
                                API_ENDPOINTS.ANNOUNCEMENTS
                              );
                              if (response.ok) {
                                const data = await response.json();
                                setAnnouncements(data);
                              } else {
                                setAnnouncementsError(
                                  `Failed to fetch announcements: ${response.status}`
                                );
                              }
                            } catch (error) {
                              setAnnouncementsError(`Error: ${error.message}`);
                            } finally {
                              setLoadingAnnouncements(false);
                            }
                          };
                          fetchAnnouncements();
                        }}
                        className="text-blue-700 hover:text-blue-800 text-sm font-semibold underline bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  ) : getActiveAnnouncements().length === 0 ? (
                    <div className="p-3 text-gray-600 text-center">
                      <span className="text-sm font-medium">
                        No active announcements
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {getActiveAnnouncements().map((announcement) => (
                        <div
                          key={announcement._id}
                          className={`p-2.5 rounded-lg border-l-4 shadow-sm ${
                            announcement.type === "warning"
                              ? "border-yellow-500 bg-yellow-50"
                              : announcement.type === "success"
                              ? "border-green-500 bg-green-50"
                              : announcement.type === "error"
                              ? "border-red-500 bg-red-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight">
                                {announcement.title}
                              </h4>
                              <p className="text-gray-800 text-sm leading-relaxed mb-1.5">
                                {announcement.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 font-medium">
                                  {new Date(
                                    announcement.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
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
    </nav>
  );
}

export default SimpleNavbar;
