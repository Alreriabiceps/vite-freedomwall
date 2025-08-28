import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SimpleNavbar from "./components/SimpleNavbar";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";
import AdSense from "./components/AdSense";
import NotificationPrompt from "./components/NotificationPrompt";
import Home from "./pages/Home";
import Create from "./pages/Create";
import CreatePoll from "./pages/CreatePoll";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import BuyMeACoffee from "./pages/BuyMeACoffee";
import NotificationSettings from "./pages/NotificationSettings";
import Admin from "./pages/Admin";
import "./App.css";
import { useEffect, useState } from "react";
import websocketService from "./services/websocketService";
import { getUserIdentifier } from "./utils/userIdentifier";
import {
  hasNotificationPermission,
  showNotification,
} from "./utils/notifications";

function App() {
  const [notifications, setNotifications] = useState([]);

  // Initialize WebSocket connection when app loads
  useEffect(() => {
    // Check if user has notification permission
    if (hasNotificationPermission()) {
      const userId = getUserIdentifier();

      // Connect to WebSocket for real-time notifications
      websocketService.connect(userId, {
        enabled: true,
        newPosts: true,
        comments: true,
        polls: true,
        announcements: true,
        postLike: true,
        commentReactions: true,
      });

      // Listen for incoming notifications
      const listenerId = websocketService.addListener((notification) => {
        console.log("Received notification:", notification);

        // Show browser notification
        if (notification.title && notification.body) {
          showNotification(notification.title, {
            body: notification.body,
            tag: notification.type || "freedom-wall",
          });
        }

        // Add to notifications list
        setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
      });

      console.log(
        "WebSocket connection initialized for real-time notifications"
      );

      return () => {
        websocketService.removeListener(listenerId);
      };
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <SimpleNavbar />

        {/* Notification Permission Prompt */}
        <NotificationPrompt />

        {/* Live Notifications Display */}
        {notifications.length > 0 && (
          <div className="fixed top-20 left-4 z-40 space-y-2">
            {notifications.map((notification, index) => (
              <div
                key={`${notification.timestamp || Date.now()}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-sm animate-in slide-in-from-left-2 duration-300"
              >
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {notification.title || "New Update"}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">
                      {notification.body ||
                        "Something new happened on Freedom Wall!"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(
                          notification.timestamp || Date.now()
                        ).toLocaleTimeString()}
                      </span>
                      {notification.type && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {notification.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top Banner Ad */}
        <div className="w-full bg-white border-b border-gray-200">
          <AdSense
            adSlot="1234567890"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: "90px" }}
          />
        </div>

        <main className="pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/create-poll" element={<CreatePoll />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route
                path="/community-guidelines"
                element={<CommunityGuidelines />}
              />
              <Route path="/buy-me-a-coffee" element={<BuyMeACoffee />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Bottom Banner Ad */}
        <div className="w-full bg-white border-t border-gray-200">
          <AdSense
            adSlot="0987654321"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: "90px" }}
          />
        </div>

        <Footer />
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
