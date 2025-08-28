import { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  Settings,
  TestTube,
  Smartphone,
  Monitor,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  getNotificationSettings,
  updateNotificationSettings,
  hasNotificationPermission,
  requestNotificationPermission,
  showTestNotification,
  isMobileDevice,
  getNotificationPermission,
} from "../utils/notifications";
import websocketService from "../services/websocketService";
import { getUserIdentifier } from "../utils/userIdentifier";

function NotificationSettings() {
  const [settings, setSettings] = useState(getNotificationSettings());
  const [hasPermission, setHasPermission] = useState(
    hasNotificationPermission()
  );
  const [permissionStatus, setPermissionStatus] = useState(
    getNotificationPermission()
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [wsStatus, setWsStatus] = useState(websocketService.getStatus());
  const [realTimeNotifications, setRealTimeNotifications] = useState([]);

  useEffect(() => {
    setIsMobile(isMobileDevice());

    // Connect to WebSocket if user has permission
    if (hasPermission) {
      const userId = getUserIdentifier();
      websocketService.connect(userId, settings);

      // Add listener for real-time notifications
      const listenerId = websocketService.addListener((notification) => {
        setRealTimeNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Keep last 10
      });

      // Update WebSocket status
      const updateStatus = () => setWsStatus(websocketService.getStatus());
      updateStatus();

      // Check status every 2 seconds
      const statusInterval = setInterval(updateStatus, 2000);

      return () => {
        websocketService.removeListener(listenerId);
        clearInterval(statusInterval);
      };
    }
  }, [hasPermission, settings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);

    // Update WebSocket settings
    websocketService.updateSettings(newSettings);
  };

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const permission = await requestNotificationPermission();
      setPermissionStatus(permission);
      setHasPermission(permission === "granted");
    } catch (error) {
      console.error("Error requesting permission:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = () => {
    if (!hasPermission) {
      setTestResult("no-permission");
      return;
    }

    try {
      showTestNotification("Test Notification", {
        body: "This is a test notification from IS Freedom Wall! 🎉",
        tag: "test-notification",
      });
      setTestResult("success");
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      setTestResult("error");
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case "granted":
        return "text-green-600 bg-green-100";
      case "denied":
        return "text-red-600 bg-red-100";
      case "default":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case "granted":
        return "Enabled";
      case "denied":
        return "Blocked";
      case "default":
        return "Not Set";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-['Comic_Sans_MS']">
            Notification Settings
          </h1>
          <p className="text-gray-600 font-['Comic_Sans_MS']">
            Manage how you receive updates from IS Freedom Wall
          </p>
        </div>

        {/* Permission Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 font-['Comic_Sans_MS']">
              Browser Permission Status
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionStatusColor()}`}
            >
              {getPermissionStatusText()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {isMobile ? (
                <Smartphone size={20} className="text-blue-600" />
              ) : (
                <Monitor size={20} className="text-purple-600" />
              )}
              <span className="text-gray-700 font-['Comic_Sans_MS']">
                {isMobile ? "Mobile Device" : "Desktop Device"} detected
              </span>
            </div>

            {permissionStatus === "default" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm font-['Comic_Sans_MS'] mb-3">
                  Enable browser notifications to stay updated with new posts,
                  comments, and activities on the Freedom Wall.
                </p>
                <button
                  onClick={handleRequestPermission}
                  disabled={isRequesting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 font-['Comic_Sans_MS'] flex items-center gap-2"
                >
                  {isRequesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Bell size={16} />
                      Enable Notifications
                    </>
                  )}
                </button>
              </div>
            )}

            {permissionStatus === "denied" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-['Comic_Sans_MS'] mb-3">
                  Notifications are currently blocked. To enable them, you'll
                  need to change your browser settings.
                </p>
                <div className="text-xs text-red-700 font-['Comic_Sans_MS']">
                  <p>
                    <strong>Chrome/Edge:</strong> Click the lock icon in the
                    address bar → Site settings → Notifications
                  </p>
                  <p>
                    <strong>Firefox:</strong> Click the shield icon → Site
                    permissions → Notifications
                  </p>
                  <p>
                    <strong>Safari:</strong> Safari → Preferences → Websites →
                    Notifications
                  </p>
                </div>
              </div>
            )}

            {permissionStatus === "granted" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm font-['Comic_Sans_MS'] mb-3">
                  ✅ Notifications are enabled! You'll receive updates about new
                  posts and activities.
                </p>
                <button
                  onClick={handleTestNotification}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors font-['Comic_Sans_MS'] flex items-center gap-2"
                >
                  <TestTube size={16} />
                  Test Browser Notification
                </button>

                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        "/api/v1/posts/test-notification",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            userId: getUserIdentifier(),
                          }),
                        }
                      );

                      if (response.ok) {
                        setTestResult("success");
                        setTimeout(() => setTestResult(null), 3000);
                      } else {
                        setTestResult("error");
                        setTimeout(() => setTestResult(null), 3000);
                      }
                    } catch (error) {
                      console.error(
                        "Error testing real-time notification:",
                        error
                      );
                      setTestResult("error");
                      setTimeout(() => setTestResult(null), 3000);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors font-['Comic_Sans_MS'] flex items-center gap-2 ml-3"
                >
                  <Wifi size={16} />
                  Test Real-time Notification
                </button>
              </div>
            )}
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                testResult === "success"
                  ? "bg-green-100 border border-green-200"
                  : "bg-red-100 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult === "success" ? (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-800 text-sm font-['Comic_Sans_MS']">
                      Test notification sent successfully!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-600" />
                    <span className="text-red-800 text-sm font-['Comic_Sans_MS']">
                      {testResult === "no-permission"
                        ? "No permission to send notifications"
                        : "Failed to send test notification"}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* WebSocket Connection Status */}
          {hasPermission && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                  Real-time Connection Status
                </h3>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    wsStatus.isConnected
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {wsStatus.isConnected ? (
                    <>
                      <Wifi size={16} />
                      Connected
                    </>
                  ) : (
                    <>
                      <WifiOff size={16} />
                      Disconnected
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                {wsStatus.isConnected
                  ? "Real-time notifications are active. You'll receive instant updates for new posts, comments, and activities."
                  : "Connecting to real-time notification service..."}
              </p>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        {hasPermission && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Notification Preferences
            </h2>
            <p className="text-gray-600 text-sm mb-6 font-['Comic_Sans_MS']">
              Choose what types of notifications you want to receive
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                      New Posts
                    </h3>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Get notified when new anonymous posts are shared
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.newPosts}
                    onChange={(e) =>
                      handleSettingChange("newPosts", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                      Comments
                    </h3>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Receive updates when posts get new comments
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.comments}
                    onChange={(e) =>
                      handleSettingChange("comments", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                      Polls
                    </h3>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Get notified about new polls and voting results
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.polls}
                    onChange={(e) =>
                      handleSettingChange("polls", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                      Announcements
                    </h3>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Receive important school announcements and updates
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcements}
                    onChange={(e) =>
                      handleSettingChange("announcements", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                      Post Likes
                    </h3>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Get notified when posts receive likes
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.postLike}
                    onChange={(e) =>
                      handleSettingChange("postLike", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 font-['Comic_Sans_MS']">
                      Comment Reactions
                    </h3>
                    <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                      Get notified when comments receive reactions
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.commentReactions}
                    onChange={(e) =>
                      handleSettingChange("commentReactions", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-['Comic_Sans_MS']">
            About Notifications
          </h2>
          <div className="space-y-3 text-sm text-gray-600 font-['Comic_Sans_MS']">
            <p>
              • Notifications are sent directly to your device and don't require
              you to keep the website open
            </p>
            <p>• You can change these settings at any time</p>
            <p>
              • Notifications are completely anonymous and don't reveal your
              identity
            </p>
            <p>
              • You can disable notifications in your browser settings if needed
            </p>
          </div>
        </div>

        {/* Real-time Notifications Display */}
        {hasPermission && wsStatus.isConnected && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              Live Notifications
            </h2>
            <p className="text-gray-600 text-sm mb-6 font-['Comic_Sans_MS']">
              Recent real-time notifications from the Freedom Wall
            </p>

            {realTimeNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-['Comic_Sans_MS']">
                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">
                  Notifications will appear here as they happen
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {realTimeNotifications.map((notification, index) => (
                  <div
                    key={`${notification.timestamp}-${index}`}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm font-['Comic_Sans_MS']">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-xs font-['Comic_Sans_MS'] mt-1">
                          {notification.body}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 font-['Comic_Sans_MS']">
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString()}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-['Comic_Sans_MS']">
                            {notification.type}
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
  );
}

export default NotificationSettings;
