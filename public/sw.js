// Service Worker for IS Freedom Wall
// Handles push notifications and background sync

const CACHE_NAME = "freedom-wall-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/image.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Push event - handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || "New notification from Freedom Wall",
        icon: "/image.png",
        badge: "/image.png",
        tag: data.tag || "freedom-wall-notification",
        requireInteraction: false,
        data: data.data || {},
        actions: [
          {
            action: "view",
            title: "View",
            icon: "/image.png",
          },
          {
            action: "dismiss",
            title: "Dismiss",
            icon: "/image.png",
          },
        ],
      };

      event.waitUntil(
        self.registration.showNotification(
          data.title || "Freedom Wall",
          options
        )
      );
    } catch (error) {
      console.error("Error parsing push data:", error);

      // Fallback notification
      const options = {
        body: "New notification from Freedom Wall",
        icon: "/image.png",
        badge: "/image.png",
      };

      event.waitUntil(
        self.registration.showNotification("Freedom Wall", options)
      );
    }
  }
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "view") {
    // Open the app
    event.waitUntil(clients.openWindow("/"));
  } else if (event.action === "dismiss") {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Background sync event
self.addEventListener("sync", (event) => {
  console.log("Background sync event:", event);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks
      console.log("Performing background sync...")
    );
  }
});

// Message event - handle messages from main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker received message:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
