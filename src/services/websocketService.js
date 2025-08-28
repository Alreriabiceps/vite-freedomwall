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
      const port = "5000"; // Backend port
      const wsUrl = `${protocol}//${host}:${port}`;

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
    console.log("Received WebSocket message:", data);

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
        // These are notifications - show them as browser notifications
        this.showBrowserNotification(data);

        // Emit them to listeners
        this.emitNotification(data);
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  }

  // Show browser notification for WebSocket messages
  showBrowserNotification(data) {
    // Check if browser notifications are supported and permitted
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    try {
      // Create notification based on message type
      let title = "Freedom Wall Update";
      let body = "Something new happened on the Freedom Wall!";

      switch (data.type) {
        case "newPost":
          title = "New Post";
          body = data.body || "Someone just shared a new anonymous post!";
          break;
        case "newComment":
          title = "New Comment";
          body = data.body || "A post received a new comment!";
          break;
        case "newPoll":
          title = "New Poll";
          body = data.body || "A new poll has been created!";
          break;
        case "pollResults":
          title = "Poll Results";
          body = data.body || "Poll results are in!";
          break;
        case "newAnnouncement":
          title = "New Announcement";
          body = data.body || "Important announcement from the Freedom Wall!";
          break;
        case "postLike":
          title = "Post Liked";
          body = data.body || "Someone liked a post!";
          break;
        case "test":
          title = "Test Notification";
          body =
            data.body || "This is a test notification from the Freedom Wall!";
          break;
        default:
          title = data.title || title;
          body = data.body || body;
      }

      const notification = new Notification(title, {
        body: body,
        icon: "/image.png",
        tag: data.type || "freedom-wall",
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      console.log("Browser notification shown:", { title, body });
    } catch (error) {
      console.error("Error showing browser notification:", error);
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
