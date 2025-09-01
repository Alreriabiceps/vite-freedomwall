import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";
import { confirmAction } from "../utils/adminUtils";

export const useContacts = (isAuthenticated) => {
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContactMessages = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CONTACT_ADMIN, {
        credentials: "include",
      });

      if (response.ok) {
        const contacts = await response.json();
        setContactMessages(contacts);
        return contacts.length; // Return count for stats update
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      setError("Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
    return 0;
  }, [isAuthenticated]);

  const handleContactStatus = async (contactId, action, value = null) => {
    try {
      let body = {};

      if (action === "read") {
        body = {
          isRead: !contactMessages.find((c) => c._id === contactId)?.isRead,
        };
      } else if (action === "status") {
        body = { status: value };
      }

      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.CONTACT, `/${contactId}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        await fetchContactMessages();
        return true;
      } else {
        setError("Failed to update contact status");
        return false;
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      setError("Error updating contact status");
      return false;
    }
  };

  const handleContactDelete = async (contactId) => {
    if (!confirmAction("Are you sure you want to delete this message?")) {
      return false;
    }

    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.CONTACT, `/${contactId}`),
        {
          method: "DELETE",
          headers: {},
        }
      );

      if (response.ok) {
        await fetchContactMessages();
        return true;
      } else {
        setError("Failed to delete contact message");
        return false;
      }
    } catch (error) {
      console.error("Error deleting contact message:", error);
      setError("Error deleting contact message");
      return false;
    }
  };

  // Fetch contact messages when adminKey changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchContactMessages();
    }
  }, [adminKey, fetchContactMessages]);

  return {
    contactMessages,
    loading,
    error,
    fetchContactMessages,
    handleContactStatus,
    handleContactDelete,
  };
};
