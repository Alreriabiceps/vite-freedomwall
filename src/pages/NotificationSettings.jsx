import { useState } from "react";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import {
  hasNotificationPermission,
  requestNotificationPermission,
  showNotification,
} from "../utils/notifications";

function NotificationSettings() {
  const [hasPermission, setHasPermission] = useState(
    hasNotificationPermission()
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const permission = await requestNotificationPermission();
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
      showNotification("Test Notification", {
        body: "This is a test notification from IS Freedom Wall! 🎉",
        tag: "test-notification",
      });
      setTestResult("success");
      setTimeout(() => setTestResult(null), 3000);
    } catch (err) {
      console.error("Test notification failed:", err);
      setTestResult("error");
      setTimeout(() => setTestResult(null), 3000);
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
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                hasPermission
                  ? "text-green-600 bg-green-100"
                  : "text-yellow-600 bg-yellow-100"
              }`}
            >
              {hasPermission ? "Enabled" : "Not Set"}
            </div>
          </div>

          <div className="space-y-4">
            {!hasPermission ? (
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
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm font-['Comic_Sans_MS'] mb-3">
                  ✅ Notifications are enabled! You'll receive updates about new
                  posts and activities.
                </p>
                <button
                  onClick={handleTestNotification}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors font-['Comic_Sans_MS'] flex items-center gap-2"
                >
                  <Bell size={16} />
                  Test Notification
                </button>
              </div>
            )}

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
        </div>

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
