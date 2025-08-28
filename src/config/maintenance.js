// Maintenance Mode Configuration
export const MAINTENANCE_CONFIG = {
  // Set to true to enable maintenance mode
  enabled: false,

  // Optional: Set a specific date when maintenance will end
  // Format: "YYYY-MM-DD HH:MM:SS" (24-hour format)
  // Leave as null if you don't want to show an estimated end time
  estimatedEndTime: "2024-01-15 20:00:00",

  // Optional: Custom message to display during maintenance
  customMessage: "Demo: System under maintenance - Back soon!",

  // Optional: Show admin bypass option (only works if user has admin access)
  allowAdminBypass: true,

  // Optional: Maintenance reason (for admin reference)
  reason: "System updates and improvements",
};

// Helper function to check if maintenance mode is enabled
export const isMaintenanceMode = () => {
  return MAINTENANCE_CONFIG.enabled;
};

// Helper function to get maintenance config
export const getMaintenanceConfig = () => {
  return MAINTENANCE_CONFIG;
};

// Helper function to format estimated end time
export const formatEstimatedEndTime = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting maintenance end time:", error);
    return null;
  }
};
