import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";
import { confirmAction } from "../utils/adminUtils";

export const useAnnouncements = (isAuthenticated) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "info",
    expiresAt: "",
    adminNotes: "",
  });

  const fetchAnnouncements = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS_ADMIN, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleAnnouncementStatus = async (announcementId, isActive) => {
    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.ANNOUNCEMENTS, `/${announcementId}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (response.ok) {
        // Update local state
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement._id === announcementId
              ? { ...announcement, isActive }
              : announcement
          )
        );
        return true;
      } else {
        setError("Failed to update announcement status");
        return false;
      }
    } catch (error) {
      console.error("Error updating announcement status:", error);
      setError("Error updating announcement status");
      return false;
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirmAction("Are you sure you want to delete this announcement?")) {
      return false;
    }

    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.ANNOUNCEMENTS, `/${announcementId}`),
        {
          method: "DELETE",
          headers: {},
        }
      );

      if (response.ok) {
        // Remove from local state
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (announcement) => announcement._id !== announcementId
          )
        );
        return true;
      } else {
        setError("Failed to delete announcement");
        return false;
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setError("Error deleting announcement");
      return false;
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAnnouncement,
          expiresAt: newAnnouncement.expiresAt || null,
        }),
      });

      if (response.ok) {
        const newAnnouncementData = await response.json();
        setAnnouncements((prev) => [newAnnouncementData, ...prev]);
        setNewAnnouncement({
          title: "",
          message: "",
          type: "info",
          expiresAt: "",
          adminNotes: "",
        });
        setShowCreateForm(false);
        return true;
      } else {
        setError("Failed to create announcement");
        return false;
      }
    } catch (error) {
      setError("Error creating announcement");
      console.error("Error creating announcement:", error);
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setNewAnnouncement((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNewAnnouncement({
      title: "",
      message: "",
      type: "info",
      expiresAt: "",
      adminNotes: "",
    });
    setShowCreateForm(false);
  };

  // Fetch announcements when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnnouncements();
    }
  }, [isAuthenticated, fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    showCreateForm,
    newAnnouncement,
    setShowCreateForm,
    fetchAnnouncements,
    handleAnnouncementStatus,
    handleDeleteAnnouncement,
    handleCreateAnnouncement,
    handleInputChange,
    resetForm,
  };
};
