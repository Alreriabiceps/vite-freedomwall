// Admin utility functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status, type = "default") => {
  const colorMap = {
    default: {
      active: "bg-green-200 text-green-700",
      inactive: "bg-gray-200 text-gray-700",
      new: "bg-green-200 text-green-700",
      "in-progress": "bg-yellow-200 text-yellow-700",
      resolved: "bg-blue-200 text-blue-700",
      archived: "bg-gray-200 text-gray-700",
      read: "bg-gray-200 text-gray-700",
      unread: "bg-blue-200 text-blue-700",
    },
    announcement: {
      info: "bg-blue-200 text-blue-700",
      warning: "bg-yellow-200 text-yellow-700",
      success: "bg-green-200 text-green-700",
      error: "bg-red-200 text-red-700",
    },
  };

  return (
    colorMap[type]?.[status] ||
    colorMap.default[status] ||
    "bg-gray-200 text-gray-700"
  );
};

export const getWarningLevel = (foulLanguageCount) => {
  if (foulLanguageCount === 0) return "none";
  if (foulLanguageCount <= 2) return "low";
  if (foulLanguageCount <= 5) return "medium";
  return "high";
};

export const getWarningColor = (level) => {
  switch (level) {
    case "low":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "medium":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getWarningMessage = (level) => {
  switch (level) {
    case "low":
      return "Mild language detected - will be censored";
    case "medium":
      return "Multiple foul words detected - content will be heavily censored";
    case "high":
      return "Heavy foul language detected - consider rewriting your message";
    default:
      return "Content looks good!";
  }
};

export const confirmAction = (message) => {
  return window.confirm(message);
};

export const buildEndpoint = (baseEndpoint, path) => {
  return `${baseEndpoint}${path}`;
};
