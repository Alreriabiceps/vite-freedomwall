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

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
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
                  Test Notification
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
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
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
      </div>
    </div>
  );
}

export default NotificationSettings;
