// Maintenance mode configuration
export const isMaintenanceMode = () => {
  try {
    const maintenance = localStorage.getItem("maintenanceMode");
    if (maintenance) {
      const config = JSON.parse(maintenance);
      return config.enabled || false;
    }
    return false;
  } catch {
    return false;
  }
};

export const getMaintenanceConfig = () => {
  try {
    const maintenance = localStorage.getItem("maintenanceMode");
    if (maintenance) {
      return JSON.parse(maintenance);
    }
    return null;
  } catch {
    return null;
  }
};

export const getMaintenanceMessage = () => {
  try {
    const maintenance = localStorage.getItem("maintenanceMode");
    if (maintenance) {
      const config = JSON.parse(maintenance);
      return config.message || "We're working hard to improve your experience!";
    }
    return "We're working hard to improve your experience!";
  } catch {
    return "We're working hard to improve your experience!";
  }
};

export const getMaintenanceEndTime = () => {
  try {
    const maintenance = localStorage.getItem("maintenanceMode");
    if (maintenance) {
      const config = JSON.parse(maintenance);
      return config.endTime || null;
    }
    return null;
  } catch {
    return null;
  }
};
