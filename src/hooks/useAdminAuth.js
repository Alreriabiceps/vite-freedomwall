import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if already authenticated
  useEffect(() => {
    const savedKey = localStorage.getItem("adminKey");
    if (savedKey) {
      setIsAuthenticated(true);
      setAdminKey(savedKey);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Test admin access by fetching admin posts
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        headers: {
          "admin-key": adminKey,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("adminKey", adminKey);
      } else {
        setError("Invalid admin key");
      }
    } catch {
      setError("Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminKey");
    setAdminKey("");
  };

  const getCurrentAdminKey = () => {
    return localStorage.getItem("adminKey");
  };

  return {
    isAuthenticated,
    adminKey,
    setAdminKey,
    loading,
    error,
    handleLogin,
    handleLogout,
    getCurrentAdminKey,
  };
};
