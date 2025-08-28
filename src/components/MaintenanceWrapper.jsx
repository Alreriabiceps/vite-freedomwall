import { useState, useEffect } from "react";
import { isMaintenanceMode } from "../config/maintenance";
import MaintenancePage from "./MaintenancePage";

function MaintenanceWrapper({ children }) {
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check maintenance mode status
    const checkMaintenance = () => {
      const enabled = isMaintenanceMode();
      setMaintenanceEnabled(enabled);
      setIsLoading(false);
    };

    checkMaintenance();

    // Listen for storage changes (when admin toggles maintenance mode)
    const handleStorageChange = (e) => {
      if (e.key === "maintenanceMode") {
        checkMaintenance();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically
    const interval = setInterval(checkMaintenance, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-['Comic_Sans_MS']">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (maintenanceEnabled) {
    return <MaintenancePage />;
  }

  return children;
}

export default MaintenanceWrapper;
