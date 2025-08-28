// WebSocket service for real-time notifications
class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.listeners = new Map();
    this.userId = null;
    this.notificationSettings = {};
  }

  // Connect to WebSocket server
  connect(userId = null, settings = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.userId = userId;
    this.notificationSettings = settings;

    try {
      // Get the current hostname and port from the current URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname;

      // For development (localhost), use port 5000
      // For production (real domain), use the same host without port
      let wsUrl;
      if (host === "localhost" || host === "127.0.0.1") {
        wsUrl = `${protocol}//${host}:5000`;
      } else {
        // Production: use same host, backend should be on same domain
        wsUrl = `${protocol}//${host}`;
      }

      console.log("Connecting to WebSocket:", wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected successfully");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;

        // Subscribe to notifications
        this.subscribe();

        // Start ping interval to keep connection alive
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        this.isConnected = false;
        this.stopPingInterval();

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnected = false;
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.attemptReconnect();
    }
  }

  // Subscribe to notifications
  subscribe() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: "subscribe",
        userId: this.userId,
        settings: this.notificationSettings,
      };

      this.ws.send(JSON.stringify(message));
      console.log(
        "Subscribed to notifications with settings:",
        this.notificationSettings
      );
    }
  }

  // Update notification settings
  updateSettings(settings) {
    this.notificationSettings = { ...this.notificationSettings, ...settings };

    if (this.isConnected) {
      this.subscribe(); // Re-subscribe with new settings
    }
  }

  // Handle incoming WebSocket messages
  handleMessage(data) {
    console.log("=== WebSocket Message Received ===");
    console.log("Message data:", data);
    console.log("Message type:", data.type);

    switch (data.type) {
      case "connection":
        console.log("WebSocket connection established:", data.message);
        break;

      case "pong":
        // Ping-pong response, connection is alive
        break;

      case "newPost":
      case "newComment":
      case "newPoll":
      case "pollResults":
      case "newAnnouncement":
      case "postLike":
      case "postReport":
      case "commentReaction":
      case "system":
      case "test":
        console.log("=== NOTIFICATION RECEIVED ===");
        console.log("Notification type:", data.type);
        console.log("Notification title:", data.title);
        console.log("Notification body:", data.body);
        console.log("Notification data:", data.data);

        // These are notifications - show them as browser notifications
        this.showBrowserNotification(data);

        // Emit them to listeners
        this.emitNotification(data);
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  }

  // Emit notification to all listeners
  emitNotification(notification) {
    // Check if user has enabled this type of notification
    if (this.notificationSettings[notification.type] !== false) {
      // Show browser notification if permission is granted
      this.showBrowserNotification(notification);

      // Emit to any registered listeners
      this.listeners.forEach((callback) => {
        try {
          callback(notification);
        } catch (error) {
          console.error("Error in notification listener:", error);
        }
      });
    }
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: "/image.png",
        badge: "/image.png",
        tag: `notification-${notification.type}`,
        requireInteraction: false,
        data: notification.data,
      });

      // Auto-close after 8 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 8000);

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();

        // Navigate to relevant content based on notification type
        this.handleNotificationClick(notification);
      };
    } catch (error) {
      console.error("Error showing browser notification:", error);
    }
  }

  // Handle notification click
  handleNotificationClick(notification) {
    switch (notification.type) {
      case "newPost":
      case "newComment":
        // Navigate to the post
        if (notification.data.postId) {
          window.location.href = `/?scrollTo=${notification.data.postId}`;
        }
        break;

      case "newPoll":
      case "pollResults":
        // Navigate to polls section
        window.location.href = "/create-poll";
        break;

      case "newAnnouncement":
        // Could show announcements modal or navigate to announcements
        break;

      case "postLike":
      case "postReport":
      case "commentReaction":
        // Navigate to the post
        if (notification.data.postId) {
          window.location.href = `/?scrollTo=${notification.data.postId}`;
        }
        break;

      default:
        // Default behavior - just focus the window
        break;
    }
  }

  // Start ping interval to keep connection alive
  startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  // Stop ping interval
  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    setTimeout(() => {
      this.connect(this.userId, this.notificationSettings);
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  // Add notification listener
  addListener(callback) {
    const id = Date.now() + Math.random();
    this.listeners.set(id, callback);
    return id;
  }

  // Remove notification listener
  removeListener(id) {
    this.listeners.delete(id);
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.stopPingInterval();
      this.ws.close(1000, "User initiated disconnect");
      this.ws = null;
    }
    this.isConnected = false;
    this.listeners.clear();
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.ws ? this.ws.readyState : null,
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
