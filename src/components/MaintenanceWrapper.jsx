import { isMaintenanceMode } from "../config/maintenance";
import MaintenanceMode from "./MaintenanceMode";

function MaintenanceWrapper({ children }) {
  // Check if maintenance mode is enabled
  if (isMaintenanceMode()) {
    return <MaintenanceMode />;
  }

  // If maintenance mode is disabled, show the normal app
  return children;
}

export default MaintenanceWrapper;
