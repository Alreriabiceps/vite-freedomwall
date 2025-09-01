import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Edit2 } from "lucide-react";
import { io } from "socket.io-client";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
} from "../components/AnimatedComponents";
import { API_ENDPOINTS, getBackendURL } from "../config/api";

const WorldChat = () => {
  const [penName, setPenName] = useState("");
  const [showPenNameModal, setShowPenNameModal] = useState(true);
  const [newPenName, setNewPenName] = useState("");
  const [showChangePenNameModal, setShowChangePenNameModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Check for cached pen name on component mount
  useEffect(() => {
    const cachedPenName = localStorage.getItem("worldChatPenName");
    if (cachedPenName) {
      setPenName(cachedPenName);
      setShowPenNameModal(false);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection when pen name is set
  useEffect(() => {
    console.log("useEffect triggered - penName:", penName, "socket:", socket);
    if (penName && (!socket || (socket && !socket.connected))) {
      console.log("🔄 Creating new socket connection...");
      // Always connect to the backend for Socket.io
      const socketURL = getBackendURL();

      console.log("Attempting to connect to socket at:", socketURL);
      console.log("Pen name:", penName);

      const newSocket = io(socketURL, {
        query: { penName },
        timeout: 3000, // Reduced from 10s to 3s for faster connection
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: 5, // More attempts for reliability
        reconnectionDelay: 100, // Much faster reconnection (100ms)
        reconnectionDelayMax: 1000, // Shorter max delay (1s)
        autoConnect: true,
        transports: ["websocket"], // WebSocket only for speed
        upgrade: false, // Disable upgrade to prevent delays
        rememberUpgrade: false,
        maxReconnectionAttempts: 5,
        // Faster ping settings
        pingTimeout: 5000, // 5s ping timeout
        pingInterval: 2500, // 2.5s ping interval
      });

      console.log("Socket created:", newSocket);
      console.log("Socket connected:", newSocket.connected);
      console.log("Socket ID:", newSocket.id);
      console.log("Socket readyState:", newSocket.readyState);

      // Set initial connection status
      setConnectionStatus("connecting");

      // Check if socket is actually connected after a short delay
      setTimeout(() => {
        console.log("🔍 Socket state after 1 second:");
        console.log("Socket connected:", newSocket.connected);
        console.log("Socket ID:", newSocket.id);
        console.log("Socket readyState:", newSocket.readyState);
      }, 1000);

      newSocket.on("connect", () => {
        console.log("🎉 CONNECT EVENT FIRED!");
        setIsConnected(true);
        setConnectionStatus("connected");
        console.log("Connected to world chat successfully!");
        console.log("Socket ID:", newSocket.id);
        console.log("Socket connected state:", newSocket.connected);
      });

      newSocket.on("connecting", () => {
        console.log("Socket is connecting...");
        setConnectionStatus("connecting");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        console.error("Error details:", {
          message: error.message,
          description: error.description,
          context: error.context,
          type: error.type,
        });
        setIsConnected(false);
        setConnectionStatus("error");
      });

      newSocket.on("error", (error) => {
        console.error("Socket general error:", error);
        setIsConnected(false);
        setConnectionStatus("error");
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        setConnectionStatus("disconnected");
        console.log("Disconnected from world chat");
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log("Reconnected to server after", attemptNumber, "attempts");
        setIsConnected(true);
        setConnectionStatus("connected");
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log("Attempting to reconnect... (attempt", attemptNumber, ")");
        setConnectionStatus("connecting");
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("Reconnection error:", error);
        setConnectionStatus("error");
      });

      newSocket.on("reconnect_failed", () => {
        console.error("Failed to reconnect after all attempts");
        setIsConnected(false);
        setConnectionStatus("error");
      });

      // Set up event listeners
      newSocket.on("message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("userJoined", (user) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "system",
            content: `${user.penName} joined the chat`,
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      newSocket.on("userLeft", (user) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "system",
            content: `${user.penName} left the chat`,
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      newSocket.on("typingStart", (user) => {
        setTypingUsers((prev) => [
          ...prev.filter((u) => u.id !== user.id),
          user,
        ]);
      });

      newSocket.on("typingStop", (user) => {
        setTypingUsers((prev) => prev.filter((u) => u.id !== user.id));
      });

      newSocket.on("messageHistory", (history) => {
        setMessages(history);
      });

      console.log("🔗 Setting socket in state...");
      setSocket(newSocket);

      // Don't return cleanup function here - let it persist
    } else if (penName && socket && socket.connected) {
      console.log("✅ Socket already connected, skipping creation");
    }
  }, [penName]); // Only depend on penName, not socket

  // Cleanup socket when component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("🧹 Component unmounting - cleaning up socket...");
        socket.disconnect();
      }
    };
  }, [socket]);

  const handlePenNameSubmit = async (e) => {
    e.preventDefault();
    if (penName.trim()) {
      try {
        // Check if pen name is available
        const response = await fetch(API_ENDPOINTS.CHAT_CHECK_PENNAME, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ penName: penName.trim() }),
        });

        const data = await response.json();

        if (data.available) {
          setShowPenNameModal(false);
          localStorage.setItem("worldChatPenName", penName.trim());
        } else {
          alert(data.message || "Pen name is not available");
        }
      } catch (error) {
        console.error("Error checking pen name:", error);

        // Better error handling
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          alert(
            "Cannot connect to server. Please check if the backend is running or try again later."
          );
        } else if (error.message.includes("Failed to fetch")) {
          alert(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          alert("Error checking pen name availability. Please try again.");
        }
      }
    }
  };

  const handleChangePenName = async (e) => {
    e.preventDefault();
    if (newPenName.trim() && newPenName.trim() !== penName) {
      try {
        // Check if new pen name is available
        const response = await fetch(API_ENDPOINTS.CHAT_CHECK_PENNAME, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ penName: newPenName.trim() }),
        });

        const data = await response.json();

        if (data.available) {
          // Disconnect current socket
          if (socket) {
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
            setConnectionStatus("disconnected");
          }

          // Update pen name
          setPenName(newPenName.trim());
          localStorage.setItem("worldChatPenName", newPenName.trim());
          setShowChangePenNameModal(false);
          setNewPenName("");

          // Clear messages for new user
          setMessages([]);
        } else {
          alert(data.message || "Pen name is not available");
        }
      } catch (error) {
        console.error("Error checking pen name:", error);

        // Better error handling
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          alert(
            "Cannot connect to server. Please check if the backend is running or try again later."
          );
        } else if (error.message.includes("Failed to fetch")) {
          alert(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          alert("Error checking pen name availability. Please try again.");
        }
      }
    }
  };

  const openChangePenNameModal = () => {
    setNewPenName(penName); // Pre-fill with current pen name
    setShowChangePenNameModal(true);
  };

  const handleLogout = () => {
    // Disconnect socket
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    // Clear localStorage and reset state
    localStorage.removeItem("worldChatPenName");
    setPenName("");
    setShowPenNameModal(true);
    setMessages([]);
    setIsConnected(false);
    setConnectionStatus("disconnected");

    // Show confirmation
    alert("Logged out successfully! You can now choose a new pen name.");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && isConnected) {
      const message = {
        id: Date.now(),
        penName,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", message);
      setNewMessage("");

      // Stop typing indicator
      socket.emit("typingStop");
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit("typingStart");
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("typingStop");
        setIsTyping(false);
      }
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showPenNameModal) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <FadeIn className="w-full max-w-sm sm:max-w-md">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-2">
                  Join World Chat
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-['Comic_Sans_MS']">
                  Choose your pen name to start chatting with the world!
                </p>
              </div>

              <form onSubmit={handlePenNameSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="penName"
                    className="block text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] mb-2"
                  >
                    Your Pen Name
                  </label>
                  <input
                    type="text"
                    id="penName"
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Comic_Sans_MS'] text-base"
                    placeholder="Enter your pen name..."
                    maxLength={20}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 font-['Comic_Sans_MS']">
                    Choose a unique name (max 20 characters)
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold font-['Comic_Sans_MS'] text-base hover:bg-blue-600 transition-colors duration-200"
                >
                  Enter Chat Room
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-6">
      {/* Simple Title */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-2">
          World Chat
        </h1>
        <p className="text-gray-600 font-['Comic_Sans_MS']">
          Chat with the world using your pen name:{" "}
          <button
            onClick={openChangePenNameModal}
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 mx-auto mt-1 group"
          >
            <span>{penName}</span>
            <Edit2
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : connectionStatus === "error"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600 font-['Comic_Sans_MS']">
              {connectionStatus === "connected" && "Connected"}
              {connectionStatus === "connecting" && "Connecting..."}
              {connectionStatus === "disconnected" && "Disconnected"}
              {connectionStatus === "error" && "Connection Error"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 hover:underline font-['Comic_Sans_MS']"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Chat Messages */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[500px] md:h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            <StaggerContainer>
              {messages.map((message, index) => (
                <StaggerItem key={message.id || index} delay={index * 0.1}>
                  {message.type === "system" ? (
                    <div className="text-center">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2.5 sm:px-3 py-1 sm:py-1 rounded-full text-xs sm:text-sm font-['Comic_Sans_MS']">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex ${
                        message.penName === penName
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[280px] sm:max-w-xs lg:max-w-md ${
                          message.penName === penName
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        } rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs sm:text-sm font-semibold font-['Comic_Sans_MS'] ${
                              message.penName === penName
                                ? "text-blue-100"
                                : "text-gray-600"
                            }`}
                          >
                            {message.penName}
                          </span>
                          <span
                            className={`text-xs ${
                              message.penName === penName
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p
                          className={`font-['Comic_Sans_MS'] text-sm sm:text-base ${
                            message.penName === penName
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {message.content}
                        </p>
                      </div>
                    </div>
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Typing Indicators */}
            {typingUsers.length > 0 && (
              <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-600 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-['Comic_Sans_MS']">
                  {typingUsers.map((u) => u.penName).join(", ")}{" "}
                  {typingUsers.length === 1 ? "is" : "are"} typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-3 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Comic_Sans_MS'] text-sm sm:text-base"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="bg-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold font-['Comic_Sans_MS'] hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Change Pen Name Modal */}
      {showChangePenNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 max-w-sm sm:max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-['Comic_Sans_MS'] mb-2">
                Change Pen Name
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-['Comic_Sans_MS']">
                Choose a new pen name for your chat identity
              </p>
              <p className="text-sm text-gray-500 mt-2 font-['Comic_Sans_MS']">
                Current pen name:{" "}
                <span className="font-semibold text-blue-600">{penName}</span>
              </p>
            </div>

            <form onSubmit={handleChangePenName} className="space-y-4">
              <div>
                <label
                  htmlFor="newPenName"
                  className="block text-sm font-medium text-gray-700 font-['Comic_Sans_MS'] mb-2"
                >
                  New Pen Name
                </label>
                <input
                  type="text"
                  id="newPenName"
                  value={newPenName}
                  onChange={(e) => setNewPenName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Comic_Sans_MS'] text-base"
                  placeholder="Enter new pen name..."
                  maxLength={20}
                  required
                />
                <p className="text-xs text-gray-500 mt-1 font-['Comic_Sans_MS']">
                  Choose a unique name (max 20 characters)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePenNameModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold font-['Comic_Sans_MS'] text-base hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold font-['Comic_Sans_MS'] text-base hover:bg-blue-600 transition-colors duration-200"
                >
                  Change Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldChat;
