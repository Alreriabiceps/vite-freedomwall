import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";
import { confirmAction } from "../utils/adminUtils";

export const usePolls = (adminKey) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolls = useCallback(async () => {
    if (!adminKey) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.POLLS_ADMIN, {
        headers: {
          "admin-key": adminKey,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPolls(data);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      setError("Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const handlePollStatus = async (pollId, isActive) => {
    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POLLS, `/${pollId}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "admin-key": adminKey,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (response.ok) {
        // Update local state
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll._id === pollId ? { ...poll, isActive } : poll
          )
        );
        return true;
      } else {
        setError("Failed to update poll status");
        return false;
      }
    } catch (error) {
      console.error("Error updating poll status:", error);
      setError("Error updating poll status");
      return false;
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!confirmAction("Are you sure you want to delete this poll?")) {
      return false;
    }

    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.POLLS, `/${pollId}`),
        {
          method: "DELETE",
          headers: {
            "admin-key": adminKey,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setPolls((prevPolls) =>
          prevPolls.filter((poll) => poll._id !== pollId)
        );
        return true;
      } else {
        setError("Failed to delete poll");
        return false;
      }
    } catch (error) {
      console.error("Error deleting poll:", error);
      setError("Error deleting poll");
      return false;
    }
  };

  // Fetch polls when adminKey changes
  useEffect(() => {
    if (adminKey) {
      fetchPolls();
    }
  }, [adminKey, fetchPolls]);

  return {
    polls,
    loading,
    error,
    fetchPolls,
    handlePollStatus,
    handleDeletePoll,
  };
};
