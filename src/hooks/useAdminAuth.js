import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if already authenticated via session
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.POSTS_ADMIN}/auth-check`, {
        method: "GET",
        credentials: "include", // Include cookies for session
      });

      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Silent fail - user is not authenticated
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Login via secure endpoint that sets session cookie
      const response = await fetch(`${API_ENDPOINTS.POSTS_ADMIN}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ adminKey }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setAdminKey(""); // Clear the input field for security
      } else {
        setError("Invalid admin key");
      }
    } catch {
      setError("Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Logout via secure endpoint that clears session
      await fetch(`${API_ENDPOINTS.POSTS_ADMIN}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setAdminKey("");
    }
  };

  return {
    isAuthenticated,
    adminKey,
    setAdminKey,
    loading,
    error,
    handleLogin,
    handleLogout,
  };
};
