// API Configuration for Freedom Wall
// This file centralizes all API endpoints and makes them environment-aware

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/api/v1/posts`,
  POSTS_ADMIN: `${API_BASE_URL}/api/v1/posts/admin`,
  CONTACT: `${API_BASE_URL}/api/v1/contact`,
  CONTACT_ADMIN: `${API_BASE_URL}/api/v1/contact/admin`,
};

// Helper function to build dynamic endpoints
export const buildEndpoint = (base, path) => `${base}${path}`;

export default API_BASE_URL;
