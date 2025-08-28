import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, Smartphone, Monitor, Zap } from "lucide-react";
import {
  shouldShowNotificationPrompt,
  getNotificationPromptMessage,
  requestNotificationPermission,
  markNotificationPermissionAsked,
  isMobileDevice,
} from "../utils/notifications";
import "./NotificationPrompt.css";

function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestResult, setRequestResult] = useState(null);
  const [promptMessage, setPromptMessage] = useState(null);

  useEffect(() => {
    // Check if we should show the prompt
    if (shouldShowNotificationPrompt()) {
      setPromptMessage(getNotificationPromptMessage());
      setShowPrompt(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const permission = await requestNotificationPermission();
      setRequestResult(permission);

      if (permission === "granted") {
        // Show success message briefly, then hide
        setTimeout(() => {
          setShowPrompt(false);
        }, 2000);
      } else {
        // Show denied message briefly, then hide
        setTimeout(() => {
          setShowPrompt(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setRequestResult("error");
      setTimeout(() => {
        setShowPrompt(false);
      }, 3000);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    markNotificationPermissionAsked();
    setShowPrompt(false);
  };

  const handleLater = () => {
    // Mark as asked but don't hide - user can still enable later
    markNotificationPermissionAsked();
    setShowPrompt(false);
  };

  if (!showPrompt || !promptMessage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bell size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Comic_Sans_MS']">
                  {promptMessage.title}
                </h2>
                <p className="text-blue-100 text-sm font-['Comic_Sans_MS']">
                  {isMobileDevice()
                    ? "Mobile Experience"
                    : "Desktop Experience"}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-6 font-['Comic_Sans_MS']">
            {promptMessage.message}
          </p>

          {/* Benefits list */}
          <div className="space-y-3 mb-6">
            {promptMessage.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600 text-sm font-['Comic_Sans_MS']">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Device-specific icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              {isMobileDevice() ? (
                <Smartphone size={32} className="text-blue-600" />
              ) : (
                <Monitor size={32} className="text-purple-600" />
              )}
            </div>
          </div>

          {/* Action buttons */}
          {requestResult === null && (
            <div className="space-y-3">
              <button
                onClick={handleEnableNotifications}
                disabled={isRequesting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-['Comic_Sans_MS'] flex items-center justify-center gap-2"
              >
                {isRequesting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Requesting...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    {promptMessage.buttonText}
                  </>
                )}
              </button>

              <button
                onClick={handleLater}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors font-['Comic_Sans_MS']"
              >
                Maybe Later
              </button>
            </div>
          )}

          {/* Result messages */}
          {requestResult === "granted" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Comic_Sans_MS']">
                Notifications Enabled! 🎉
              </h3>
              <p className="text-green-700 text-sm font-['Comic_Sans_MS']">
                You'll now receive updates about new posts and activities!
              </p>
            </div>
          )}

          {requestResult === "denied" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2 font-['Comic_Sans_MS']">
                Notifications Disabled
              </h3>
              <p className="text-yellow-700 text-sm font-['Comic_Sans_MS']">
                You can enable them later in your browser settings.
              </p>
            </div>
          )}

          {requestResult === "error" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <X size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2 font-['Comic_Sans_MS']">
                Something went wrong
              </h3>
              <p className="text-red-700 text-sm font-['Comic_Sans_MS']">
                Please try again or check your browser settings.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-xs text-gray-500 font-['Comic_Sans_MS']">
            You can change this anytime in your browser settings
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotificationPrompt;
