import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "../config/api";

export const useStats = (isAuthenticated) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    flaggedPosts: 0,
    hiddenPosts: 0,
    pinnedPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalReports: 0,
    totalContacts: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        credentials: "include", // Include session cookies
      });
      if (response.ok) {
        const data = await response.json();

        const totalComments = data.reduce(
          (sum, post) => sum + post.comments.length,
          0
        );
        const totalLikes = data.reduce((sum, post) => sum + post.likes, 0);
        const totalReports = data.filter((post) => post.reportCount > 0).length;

        setStats((prev) => ({
          ...prev,
          totalPosts: data.length,
          flaggedPosts: data.filter((post) => post.isFlagged).length,
          hiddenPosts: data.filter((post) => post.isHidden).length,
          pinnedPosts: data.filter((post) => post.isPinned).length,
          totalComments,
          totalLikes,
          totalReports,
        }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateContactCount = useCallback((count) => {
    setStats((prev) => ({
      ...prev,
      totalContacts: count,
    }));
  }, []);

  const updatePollCount = useCallback((count) => {
    setStats((prev) => ({
      ...prev,
      totalPolls: count,
    }));
  }, []);

  const updateAnnouncementCount = useCallback((count) => {
    setStats((prev) => ({
      ...prev,
      totalAnnouncements: count,
    }));
  }, []);

  // Fetch stats when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  return {
    stats,
    loading,
    fetchStats,
    updateContactCount,
    updatePollCount,
    updateAnnouncementCount,
  };
};
