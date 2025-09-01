const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/api/v1/posts`,
  POSTS_ADMIN: `${API_BASE_URL}/api/v1/posts/admin`,
  POLLS: `${API_BASE_URL}/api/v1/polls`,
  POLLS_ADMIN: `${API_BASE_URL}/api/v1/polls/admin`,
  POLLS_TRENDING: `${API_BASE_URL}/api/v1/polls/trending`,
  CONTACT: `${API_BASE_URL}/api/v1/contact`,
  CONTACT_ADMIN: `${API_BASE_URL}/api/v1/contact/admin`,
  ANNOUNCEMENTS: `${API_BASE_URL}/api/v1/announcements`,
  ANNOUNCEMENTS_ADMIN: `${API_BASE_URL}/api/v1/announcements/admin`,
  BANNED_WORDS: `${API_BASE_URL}/api/v1/banned-words`,
  BANNED_WORDS_ADMIN: `${API_BASE_URL}/api/v1/banned-words/admin`,
  CHAT: `${API_BASE_URL}/api/v1/chat`,
  CHAT_CHECK_PENNAME: `${API_BASE_URL}/api/v1/chat/check-penname`,
};

export const buildEndpoint = (base, path) => `${base}${path}`;

// Get the backend URL for Socket.io connections
export const getBackendURL = () => {
  // In development, use localhost:5000
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  // In production, use the API base URL from environment variable
  // This should be set in Vercel as VITE_API_BASE_URL=https://your-render-backend.onrender.com
  return API_BASE_URL;
};

export default API_BASE_URL;
