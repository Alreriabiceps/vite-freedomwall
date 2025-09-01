import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  PenTool,
  BarChart3,
  Info,
  Mail,
  Menu,
  X,
  Coffee,
  MessageSquare,
} from "lucide-react";
import useRealtimeNotifications from "../hooks/useRealtimeNotifications";

function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Real-time notification counts
  const { newPostsCount, newMessagesCount, markAsRead } =
    useRealtimeNotifications();

  // Hide/show navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: Home,
      color: "text-blue-600",
      notificationCount: newPostsCount,
    },
    { to: "/create", label: "Create", icon: PenTool, color: "text-green-600" },
    {
      to: "/create-poll",
      label: "Polls",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      to: "/world-chat",
      label: "Chat",
      icon: MessageSquare,
      color: "text-indigo-600",
      notificationCount: newMessagesCount,
      isNew: true, // Mark as new feature
    },
  ];

  const moreMenuItems = [
    { to: "/about", label: "About", icon: Info, color: "text-orange-600" },
    { to: "/contact", label: "Contact", icon: Mail, color: "text-red-600" },
    {
      to: "/buy-me-a-coffee",
      label: "Support",
      icon: Coffee,
      color: "text-amber-600",
    },
  ];

  const quickActions = moreMenuItems.map((item) => ({
    label: item.label,
    icon: item.icon,
    action: () => {
      // Use React Router navigation instead of window.location.href
      navigate(item.to);
    },
  }));

  return (
    <>
      {/* Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden"
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  // Mark notifications as read when visiting Home or World Chat
                  if (item.to === "/" || item.to === "/world-chat") {
                    markAsRead();
                  }
                }}
                className="flex flex-col items-center justify-center min-w-[60px] py-2 rounded-xl transition-all duration-200"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={24} />

                  {/* NEW badge */}
                  {item.isNew && (
                    <span
                      className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 new-badge-wiggle"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      NEW
                    </span>
                  )}

                  {/* Notification badge */}
                  {item.notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.notificationCount > 99
                        ? "99+"
                        : item.notificationCount}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 rounded-full transform -translate-x-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>

                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Quick Actions Button */}
          <motion.button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex flex-col items-center justify-center min-w-[60px] py-2 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className={`relative p-2 rounded-full transition-all duration-200 ${
                showQuickActions
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <AnimatePresence mode="wait">
                {showQuickActions ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span
              className={`text-xs mt-1 font-medium ${
                showQuickActions ? "text-purple-600" : "text-gray-500"
              }`}
            >
              More
            </span>
          </motion.button>
        </div>

        {/* Quick Actions Panel */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden bg-gray-50 border-t border-gray-200"
            >
              <div className="px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.label}
                        onClick={action.action}
                        className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Icon size={20} className="text-gray-600 mb-2" />
                        <span className="text-xs font-medium text-gray-700">
                          {action.label}
                        </span>
                        {action.label === "Support" && (
                          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            ♥
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Bottom safe area for devices with home indicators */}
      <div className="h-6 md:hidden" />
    </>
  );
}

export default BottomNavigation;
