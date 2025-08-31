import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

export const usePublicBannedWords = () => {
  const [bannedWords, setBannedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBannedWords = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.BANNED_WORDS);
      if (response.ok) {
        const data = await response.json();
        setBannedWords(data);
      } else {
        setError("Failed to fetch banned words");
      }
    } catch (error) {
      console.error("Error fetching banned words:", error);
      setError("Failed to fetch banned words");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannedWords();
  }, []);

  return {
    bannedWords,
    loading,
    error,
    refetch: fetchBannedWords,
  };
};
