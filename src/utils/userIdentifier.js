// Utility to generate and manage unique user identifiers
// This helps prevent like spam without requiring user accounts

// Generate a unique user identifier based on device and session
export const getUserIdentifier = () => {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    // Generate a new user ID
    const deviceId = generateDeviceId();
    const sessionId = generateSessionId();
    userId = `user_${deviceId}_${sessionId}`;
    localStorage.setItem("userId", userId);

    // Also store in sessionStorage as backup
    sessionStorage.setItem("userId", userId);
  }

  return userId;
};

// Generate a device identifier using multiple browser characteristics
const generateDeviceId = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("Device fingerprint", 2, 2);

  const fingerprint = canvas.toDataURL();

  // Combine multiple identifiers for more uniqueness
  const screenInfo = `${screen.width}x${screen.height}x${screen.colorDepth}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const platform = navigator.platform;

  const combined = `${fingerprint}_${screenInfo}_${timezone}_${language}_${platform}`;
  return btoa(combined).substring(0, 16);
};

// Generate a session identifier
const generateSessionId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Check if user has liked a specific post
export const hasUserLikedPost = (postId) => {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  return likedPosts.includes(postId);
};

// Mark a post as liked by the user
export const markPostAsLiked = (postId) => {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  if (!likedPosts.includes(postId)) {
    likedPosts.push(postId);
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    // Also store in sessionStorage as backup
    sessionStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }
};

// Mark a post as unliked by the user
export const markPostAsUnliked = (postId) => {
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  const updatedLikedPosts = likedPosts.filter((id) => id !== postId);
  localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
  // Also update sessionStorage
  sessionStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
};

// Clear all user data (for testing or logout)
export const clearUserData = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("likedPosts");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("likedPosts");
};

// Check if this is a new device/browser session
export const isNewSession = () => {
  const sessionKey = "eca_freedom_wall_session_start";
  const sessionStart = localStorage.getItem(sessionKey);

  if (!sessionStart) {
    localStorage.setItem(sessionKey, Date.now().toString());
    return true;
  }

  // Consider it a new session if more than 24 hours have passed
  const hoursSinceStart =
    (Date.now() - parseInt(sessionStart)) / (1000 * 60 * 60);
  return hoursSinceStart > 24;
};

// Get a more persistent identifier that's harder to change
export const getPersistentIdentifier = () => {
  const userId = getUserIdentifier();
  const sessionStart =
    localStorage.getItem("eca_freedom_wall_session_start") ||
    Date.now().toString();

  // Create a hash-like identifier that includes session start time
  const persistentId = btoa(`${userId}_${sessionStart}`).substring(0, 24);
  return persistentId;
};
