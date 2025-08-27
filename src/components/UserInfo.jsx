import { useState } from "react";
import { User, RefreshCw, Shield, Info } from "lucide-react";
import {
  getUserIdentifier,
  getDeviceId,
  getUserLikeHistory,
  clearUserData,
  isNewSession,
} from "../utils/userIdentifier";

const UserInfo = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const userId = getUserIdentifier();
  const deviceId = getDeviceId();
  const likeHistory = getUserLikeHistory();
  const newSession = isNewSession();

  // Extract readable parts from user ID
  const deviceIdShort = deviceId ? deviceId.substring(0, 8) : "Unknown";
  const sessionId = userId.split("_")[2]?.substring(0, 8) || "Unknown";

  const handleResetData = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset your data? This will clear your like history and create a new session."
      )
    ) {
      setIsResetting(true);

      // Clear data
      clearUserData();

      // Reload page to reset everything
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-['Comic_Sans_MS']">
            Your Session
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Info size={20} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield size={16} />
          <span className="font-['Comic_Sans_MS']">
            Device ID:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {deviceIdShort}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw size={16} />
          <span className="font-['Comic_Sans_MS']">
            Session:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {sessionId}
            </span>
            {newSession && (
              <span className="ml-2 text-blue-600 font-semibold">(New)</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-lg">❤️</span>
          <span className="font-['Comic_Sans_MS']">
            Posts liked:{" "}
            <span className="font-semibold">{likeHistory.length}</span>
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="text-xs text-gray-500 font-['Comic_Sans_MS']">
            <p className="mb-2">
              <strong>How it works:</strong> We use your device's unique
              characteristics (browser, screen size, etc.) to create a
              fingerprint that helps prevent spam while keeping you anonymous.
            </p>
            <p className="mb-2">
              <strong>Privacy:</strong> No personal information is collected.
              Your device ID is stored locally and only sent to our servers when
              you like posts.
            </p>
            <p>
              <strong>Security:</strong> Each device can only like a post once,
              preventing abuse while maintaining fairness.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors text-sm font-['Comic_Sans_MS'] disabled:opacity-50"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Reset My Data
                </>
              )}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors text-sm font-['Comic_Sans_MS']"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
