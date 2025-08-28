// Simple notification utility - just the basics that work

// Check if browser supports notifications
export const isNotificationSupported = () => {
  return "Notification" in window;
};

// Get current notification permission status
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
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
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    throw error;
  }
};

// Show a simple notification
export const showNotification = (title, options = {}) => {
  if (!hasNotificationPermission()) {
    console.warn("Cannot show notification: permission not granted");
    return;
  }

  try {
    const notification = new Notification(title, {
      body: options.body || "New notification from Freedom Wall",
      icon: "/image.png",
      tag: options.tag || "freedom-wall",
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

// Check if we should show the notification prompt
export const shouldShowNotificationPrompt = () => {
  if (!isNotificationSupported()) return false;
  if (getNotificationPermission() !== "default") return false;
  return true;
};

// Get notification prompt message
export const getNotificationPromptMessage = () => {
  return {
    title: "Enable Notifications",
    message: "Get notified about new posts and activities on the Freedom Wall!",
    buttonText: "Enable Notifications",
    benefits: [
      "📝 New anonymous posts from classmates",
      "💬 Comments on posts you're following",
      "📊 New polls and voting updates",
      "📢 Important announcements",
    ],
  };
};
