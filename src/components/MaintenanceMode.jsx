import { Wrench, Clock, Heart, Shield } from "lucide-react";
import {
  getMaintenanceConfig,
  formatEstimatedEndTime,
} from "../config/maintenance";

function MaintenanceMode() {
  const config = getMaintenanceConfig();
  const estimatedEndTime = formatEstimatedEndTime(config.estimatedEndTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Wrench className="text-white" size={48} />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Comic_Sans_MS']">
          Under Maintenance
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-6 font-['Comic_Sans_MS']">
          {config.customMessage}
        </p>

        {/* Status Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="text-orange-400" size={24} />
            <span className="text-orange-400 font-semibold text-lg font-['Comic_Sans_MS']">
              Back Soon
            </span>
          </div>
          <p className="text-gray-300 text-sm font-['Comic_Sans_MS']">
            Our team is performing essential updates to make the Freedom Wall
            even better. Thank you for your patience!
          </p>

          {/* Estimated End Time */}
          {estimatedEndTime && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-gray-300 text-xs font-['Comic_Sans_MS']">
                Estimated completion:{" "}
                <span className="text-orange-400 font-semibold">
                  {estimatedEndTime}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Admin Bypass Info */}
        {config.allowAdminBypass && (
          <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="text-blue-400" size={20} />
              <span className="text-blue-400 text-sm font-semibold font-['Comic_Sans_MS']">
                Admin Access
              </span>
            </div>
            <p className="text-blue-300 text-xs font-['Comic_Sans_MS']">
              Administrators can still access the system using their admin
              credentials.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-['Comic_Sans_MS']">
          <Heart className="text-red-400" size={16} />
          <span>Made with love for our community</span>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceMode;
