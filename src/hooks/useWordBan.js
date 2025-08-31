import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";
import { confirmAction } from "../utils/adminUtils";

export const useWordBan = (adminKey) => {
  const [bannedWords, setBannedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    word: "",
    reason: "",
  });

  const fetchBannedWords = useCallback(async () => {
    if (!adminKey) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.BANNED_WORDS_ADMIN, {
        headers: {
          "admin-key": adminKey,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBannedWords(data);
      }
    } catch (error) {
      console.error("Error fetching banned words:", error);
      setError("Failed to fetch banned words");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const handleAddWord = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.BANNED_WORDS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-key": adminKey,
        },
        body: JSON.stringify({
          ...newWord,
          word: newWord.word.toLowerCase().trim(),
        }),
      });

      if (response.ok) {
        const newWordData = await response.json();
        setBannedWords((prev) => [newWordData, ...prev]);
        setNewWord({
          word: "",
          reason: "",
        });
        setShowAddForm(false);
        return true;
      } else {
        setError("Failed to add banned word");
        return false;
      }
    } catch (error) {
      setError("Error adding banned word");
      console.error("Error adding banned word:", error);
      return false;
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (
      !confirmAction(
        "Are you sure you want to remove this word from the banned list?"
      )
    ) {
      return false;
    }

    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.BANNED_WORDS, `/${wordId}`),
        {
          method: "DELETE",
          headers: {
            "admin-key": adminKey,
          },
        }
      );

      if (response.ok) {
        setBannedWords((prev) => prev.filter((word) => word._id !== wordId));
        return true;
      } else {
        setError("Failed to delete banned word");
        return false;
      }
    } catch (error) {
      console.error("Error deleting banned word:", error);
      setError("Error deleting banned word");
      return false;
    }
  };

  const handleUpdateWord = async (wordId, updates) => {
    try {
      const response = await fetch(
        buildEndpoint(API_ENDPOINTS.BANNED_WORDS, `/${wordId}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "admin-key": adminKey,
          },
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        setBannedWords((prev) =>
          prev.map((word) =>
            word._id === wordId ? { ...word, ...updates } : word
          )
        );
        return true;
      } else {
        setError("Failed to update banned word");
        return false;
      }
    } catch (error) {
      console.error("Error updating banned word:", error);
      setError("Error updating banned word");
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setNewWord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNewWord({
      word: "",
      reason: "",
    });
    setShowAddForm(false);
  };

  // Fetch banned words when adminKey changes
  useEffect(() => {
    if (adminKey) {
      fetchBannedWords();
    }
  }, [adminKey, fetchBannedWords]);

  return {
    bannedWords,
    loading,
    error,
    showAddForm,
    newWord,
    setShowAddForm,
    fetchBannedWords,
    handleAddWord,
    handleDeleteWord,
    handleUpdateWord,
    handleInputChange,
    resetForm,
  };
};
