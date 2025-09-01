import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, buildEndpoint } from "../config/api";
import { confirmAction } from "../utils/adminUtils";

export const usePosts = (isAuthenticated) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  const fetchPosts = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.POSTS_ADMIN, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleModerate = async (postId, action) => {
    try {
      let response;

      if (action === "delete") {
        if (
          !confirmAction(
            "Are you sure you want to permanently delete this post?"
          )
        ) {
          return false;
        }

        response = await fetch(
          buildEndpoint(API_ENDPOINTS.POSTS, `/${postId}`),
          {
            method: "DELETE",
            headers: {},
          }
        );
      } else {
        // For hide/unhide/flag/pin actions, use the status endpoint
        const body = {};
        if (action === "hide") body.isHidden = true;
        if (action === "unhide") body.isHidden = false;
        if (action === "flag") body.isFlagged = true;
        if (action === "unflag") body.isFlagged = false;
        if (action === "pin") body.isPinned = true;
        if (action === "unpin") body.isPinned = false;

        response = await fetch(
          buildEndpoint(API_ENDPOINTS.POSTS, `/${postId}/status`),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      }

      if (response.ok) {
        if (action === "delete") {
          // Remove from local state
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== postId)
          );
        } else {
          // Refresh posts to get updated status
          await fetchPosts();
        }

        // Trigger events for other components
        localStorage.setItem("postsLastModified", Date.now().toString());
        window.dispatchEvent(new CustomEvent("postsModified"));
        return true;
      } else {
        setError("Failed to moderate post");
        return false;
      }
    } catch (error) {
      console.error("Error moderating post:", error);
      setError("Error moderating post");
      return false;
    }
  };

  const handleDeleteComment = async (postId, commentIndex) => {
    if (!confirmAction("Are you sure you want to delete this comment?")) {
      return false;
    }

    try {
      const response = await fetch(
        buildEndpoint(
          API_ENDPOINTS.POSTS,
          `/${postId}/comment/${commentIndex}`
        ),
        {
          method: "DELETE",
          headers: {},
        }
      );

      if (response.ok) {
        await fetchPosts();
        localStorage.setItem("postsLastModified", Date.now().toString());
        window.dispatchEvent(new CustomEvent("postsModified"));
        return true;
      } else {
        setError("Failed to delete comment");
        return false;
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Error deleting comment");
      return false;
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Fetch posts when adminKey changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [adminKey, fetchPosts]);

  return {
    posts,
    loading,
    error,
    expandedComments,
    fetchPosts,
    handleModerate,
    handleDeleteComment,
    toggleComments,
  };
};
