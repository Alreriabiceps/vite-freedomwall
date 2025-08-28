// Notification utility for browser notifications
// Handles permission requests, custom prompts, and notification management

// Check if browser supports notifications
export const isNotificationSupported = () => {
  return "Notification" in window && "serviceWorker" in navigator;
};

// Get current notification permission status
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
};

// Check if user has already made a choice about notifications
export const hasUserDecidedNotifications = () => {
  return localStorage.getItem("notificationPermissionAsked") === "true";
};

// Mark that user has been asked about notifications
export const markNotificationPermissionAsked = () => {
  localStorage.setItem("notificationPermissionAsked", "true");
};

// Check if user has granted notification permission
export const hasNotificationPermission = () => {
  return getNotificationPermission() === "granted";
};

// Request notification permission from browser
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    throw new Error("Notifications not supported in this browser");
  }

  try {
    const permission = await Notification.requestPermission();
    markNotificationPermissionAsked();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    throw error;
  }
};

// Show a test notification
export const showTestNotification = (
  title = "Test Notification",
  options = {}
) => {
  if (!hasNotificationPermission()) {
    console.warn("Cannot show notification: permission not granted");
    return;
  }

  const defaultOptions = {
    body: "This is a test notification from IS Freedom Wall",
    icon: "/image.png",
    badge: "/image.png",
    tag: "test-notification",
    requireInteraction: false,
    ...options,
  };

  try {
    const notification = new Notification(title, defaultOptions);

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

// Show notification for new posts (when implemented)
export const showNewPostNotification = (postData) => {
  if (!hasNotificationPermission()) return;

  const notification = new Notification("New Post on Freedom Wall", {
    body: `${postData.name || "Anonymous"} just shared something new!`,
    icon: "/image.png",
    badge: "/image.png",
    tag: "new-post",
    requireInteraction: false,
    data: postData,
  });

  // Auto-close after 8 seconds
  setTimeout(() => {
    notification.close();
  }, 8000);

  return notification;
};

// Check if user is on mobile device
export const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
};

// Get notification settings from localStorage
export const getNotificationSettings = () => {
  const defaultSettings = {
    enabled: false,
    newPosts: true,
    comments: true,
    polls: true,
    announcements: true,
    postLike: true,
    commentReactions: true,
  };

  try {
    const stored = localStorage.getItem("notificationSettings");
    return stored
      ? { ...defaultSettings, ...JSON.parse(stored) }
      : defaultSettings;
  } catch (error) {
    console.error("Error reading notification settings:", error);
    return defaultSettings;
  }
};

// Save notification settings to localStorage
export const saveNotificationSettings = (settings) => {
  try {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving notification settings:", error);
  }
};

// Update notification settings
export const updateNotificationSettings = (updates) => {
  const currentSettings = getNotificationSettings();
  const newSettings = { ...currentSettings, ...updates };
  saveNotificationSettings(newSettings);
  return newSettings;
};

// Initialize notification system
export const initializeNotifications = async () => {
  if (!isNotificationSupported()) {
    console.log("Notifications not supported in this browser");
    return false;
  }

  // If user has already decided, return current status
  if (hasUserDecidedNotifications()) {
    return hasNotificationPermission();
  }

  // If permission is already granted, mark as asked
  if (hasNotificationPermission()) {
    markNotificationPermissionAsked();
    return true;
  }

  // If permission is denied, mark as asked
  if (getNotificationPermission() === "denied") {
    markNotificationPermissionAsked();
    return false;
  }

  // Permission not yet requested
  return null;
};

// Check if we should show the notification prompt
export const shouldShowNotificationPrompt = () => {
  if (!isNotificationSupported()) return false;
  if (hasUserDecidedNotifications()) return false;
  if (getNotificationPermission() !== "default") return false;
  return true;
};

// Get notification prompt message based on device
export const getNotificationPromptMessage = () => {
  if (isMobileDevice()) {
    return {
      title: "Stay Updated on Mobile! 📱",
      message:
        "Get notified about new posts, comments, and polls from your school community. Never miss what's happening on the Freedom Wall!",
      buttonText: "Enable Notifications",
      benefits: [
        "📝 New anonymous posts from classmates",
        "💬 Comments on posts you're following",
        "📊 New polls and voting updates",
        "📢 Important announcements",
      ],
    };
  } else {
    return {
      title: "Stay Connected! 💻",
      message:
        "Enable browser notifications to stay updated with new posts, comments, and activities on the IS Freedom Wall.",
      buttonText: "Enable Notifications",
      benefits: [
        "📝 Real-time updates on new posts",
        "💬 Comment notifications",
        "📊 Poll updates and results",
        "📢 School announcements",
      ],
    };
  }
};
