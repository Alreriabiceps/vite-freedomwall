import React from "react";
import {
  Shield,
  BarChart3,
  FileText,
  Flag,
  AlertTriangle,
  EyeOff,
  MessageSquare,
  LogOut,
  X,
  Menu,
  Ban,
} from "lucide-react";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  stats,
  polls,
  announcements,
  onLogout,
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      color: "text-gray-700 hover:bg-gray-100",
      activeColor: "bg-red-100 text-red-700 border-r-2 border-red-500",
    },
    {
      id: "all-posts",
      label: "All Posts",
      icon: FileText,
      color: "text-gray-700 hover:bg-gray-100",
      activeColor: "bg-red-100 text-red-700 border-r-2 border-red-500",
    },
    {
      id: "reported",
      label: "Reported Posts",
      icon: Flag,
      color: "text-red-700 hover:bg-red-50",
      activeColor: "bg-red-100 text-red-700 border-r-2 border-red-500",
      badge: stats.totalReports > 0 ? stats.totalReports : null,
      badgeColor: "bg-red-500",
    },
    {
      id: "flagged",
      label: "Flagged Posts",
      icon: AlertTriangle,
      color: "text-orange-700 hover:bg-orange-50",
      activeColor: "bg-red-100 text-red-700 border-r-2 border-red-500",
      badge: stats.flaggedPosts > 0 ? stats.flaggedPosts : null,
      badgeColor: "bg-orange-500",
    },
    {
      id: "hidden",
      label: "Hidden Posts",
      icon: EyeOff,
      color: "text-gray-700 hover:bg-gray-100",
      activeColor: "bg-red-100 text-red-700 border-r-2 border-red-500",
      badge: stats.hiddenPosts > 0 ? stats.hiddenPosts : null,
      badgeColor: "bg-gray-500",
    },
    {
      id: "word-banning",
      label: "Word Banning",
      icon: Ban,
      color: "text-red-700 hover:bg-red-50",
      activeColor: "bg-red-100 text-red-700 border-r-2 border-red-500",
      badge: null,
      badgeColor: "bg-red-500",
    },
    {
      id: "polls",
      label: "Polls",
      icon: BarChart3,
      color: "text-purple-700 hover:bg-purple-50",
      activeColor: "bg-purple-100 text-purple-700 border-r-2 border-purple-500",
      badge: polls.length > 0 ? polls.length : null,
      badgeColor: "bg-purple-500",
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: MessageSquare,
      color: "text-orange-700 hover:bg-orange-50",
      activeColor: "bg-orange-100 text-orange-700 border-r-2 border-orange-500",
      badge: announcements.length > 0 ? announcements.length : null,
      badgeColor: "bg-orange-500",
    },
    {
      id: "contact-messages",
      label: "Contact Messages",
      icon: MessageSquare,
      color: "text-blue-700 hover:bg-blue-50",
      activeColor: "bg-blue-100 text-blue-700 border-r-2 border-blue-500",
      badge: stats.totalContacts > 0 ? stats.totalContacts : null,
      badgeColor: "bg-blue-500",
    },
  ];

  return (
    <>
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
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Close mobile sidebar
                }}
                className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-left transition-colors font-['Comic_Sans_MS'] text-sm md:text-base ${
                  activeTab === item.id ? item.activeColor : item.color
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto ${item.badgeColor} text-white text-xs px-2 py-1 rounded-full`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 md:p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-['Comic_Sans_MS'] text-sm md:text-base"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
