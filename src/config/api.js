const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/api/v1/posts`,
  POSTS_ADMIN: `${API_BASE_URL}/api/v1/posts/admin`,
  POLLS: `${API_BASE_URL}/api/v1/polls`,
  POLLS_ADMIN: `${API_BASE_URL}/api/v1/polls/admin`,
  POLLS_TRENDING: `${API_BASE_URL}/api/v1/polls/trending`,
  CONTACT: `${API_BASE_URL}/api/v1/contact`,
  CONTACT_ADMIN: `${API_BASE_URL}/api/v1/contact/admin`,
};

export const buildEndpoint = (base, path) => `${base}${path}`;

export default API_BASE_URL;
