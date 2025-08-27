import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  PenTool,
  BarChart3,
  Info,
  Mail,
  Bell,
} from "lucide-react";

function SimpleNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/announcements"
        );
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
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
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAnnouncements, isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

          {/* Desktop Navigation */}
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

              {/* Announcement Dropdown */}
              {showAnnouncements && (
                <div className="announcement-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Announcements
                    </h3>
                  </div>
                  {getActiveAnnouncements().length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">
                      No active announcements
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {getActiveAnnouncements().map((announcement) => (
                        <div
                          key={announcement._id}
                          className={`p-3 rounded-lg border-l-4 ${
                            announcement.type === "warning"
                              ? "border-yellow-400 bg-yellow-50"
                              : announcement.type === "success"
                              ? "border-green-400 bg-green-50"
                              : announcement.type === "error"
                              ? "border-red-400 bg-red-50"
                              : "border-blue-400 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                {announcement.title}
                              </h4>
                              <p className="text-gray-700 text-sm">
                                {announcement.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <div className="px-4 py-2 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 ${
                    location.pathname === item.to
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Announcement Button */}
            <button
              onClick={() => {
                toggleAnnouncements();
                closeMobileMenu();
              }}
              className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              <Bell size={20} />
              Announcements
              {getActiveAnnouncements().length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getActiveAnnouncements().length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default SimpleNavbar;
