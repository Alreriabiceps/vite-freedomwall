import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getBackendURL } from "../config/api";

const useRealtimeNotifications = () => {
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  const socketRef = useRef(null);
  const notificationPermissionRef = useRef(null);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  };

  // Show browser notification
  const showNotification = (title, options = {}) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/image.png",
        badge: "/image.png",
        tag: "freedom-wall-notification",
        requireInteraction: false,
        silent: false,
        ...options,
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  };

  // Initialize Socket.io connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const socketURL = getBackendURL();
        console.log("Connecting to Socket.io server:", socketURL);

        socketRef.current = io(socketURL, {
          transports: ["websocket", "polling"],
          timeout: 10000,
          forceNew: true,
        });

        const socket = socketRef.current;

        // Connection events
        socket.on("connect", () => {
          console.log("Connected to real-time notifications");
          setIsConnected(true);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from real-time notifications");
          setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          setIsConnected(false);
        });

        // Listen for new posts
        socket.on("newPost", (postData) => {
          console.log("New post received:", postData);

          // Update notification count
          setNewPostsCount((prev) => prev + 1);

          // Store last notification
          setLastNotification({
            type: "post",
            data: postData,
            timestamp: new Date(),
          });

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            showNotification("New Post on Freedom Wall", {
              body: `${postData.name}: ${postData.message.substring(0, 100)}${
                postData.message.length > 100 ? "..." : ""
              }`,
              data: { type: "post", postId: postData.id },
            });
          }
        });

        // Listen for new chat messages
        socket.on("message", (messageData) => {
          console.log("New message received:", messageData);

          // Update notification count
          setNewMessagesCount((prev) => prev + 1);

          // Store last notification
          setLastNotification({
            type: "message",
            data: messageData,
            timestamp: new Date(),
          });

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            showNotification("New Message in World Chat", {
              body: `${messageData.penName}: ${messageData.content.substring(
                0,
                100
              )}${messageData.content.length > 100 ? "..." : ""}`,
              data: { type: "message", messageId: messageData.id },
            });
          }
        });

        // Request notification permission
        notificationPermissionRef.current =
          await requestNotificationPermission();
        if (notificationPermissionRef.current) {
          console.log("Notification permission granted");
        } else {
          console.log("Notification permission denied or not available");
        }
      } catch (error) {
        console.error("Error initializing Socket.io:", error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Mark notifications as read
  const markAsRead = (type = "all") => {
    if (type === "all" || type === "posts") {
      setNewPostsCount(0);
    }
    if (type === "all" || type === "messages") {
      setNewMessagesCount(0);
    }
    setLastNotification(null);
  };

  // Get total notifications
  const totalNotifications = newPostsCount + newMessagesCount;

  // Check if notifications are supported
  const isNotificationSupported = "Notification" in window;
  const hasNotificationPermission = Notification.permission === "granted";

  return {
    newPostsCount,
    newMessagesCount,
    totalNotifications,
    isConnected,
    lastNotification,
    markAsRead,
    showNotification,
    isNotificationSupported,
    hasNotificationPermission,
    requestNotificationPermission: async () => {
      notificationPermissionRef.current = await requestNotificationPermission();
      return notificationPermissionRef.current;
    },
  };
};

export default useRealtimeNotifications;
