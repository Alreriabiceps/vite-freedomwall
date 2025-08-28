import { useState, useEffect } from "react";
import { Wrench, ArrowRight } from "lucide-react";
import { getMaintenanceMessage } from "../config/maintenance";

function MaintenancePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get maintenance settings
    const maintenanceMessage = getMaintenanceMessage();
    setMessage(maintenanceMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Wrench className="text-white" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
            Under Maintenance
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-['Comic_Sans_MS']">
            We'll be back soon!
          </p>
        </div>

        {/* Simple Message Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="text-blue-600" size={32} />
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-700 font-['Comic_Sans_MS'] leading-relaxed">
                {message}
              </p>

              <p className="text-base text-gray-600 font-['Comic_Sans_MS']">
                We're improving our Freedom Wall for you! 🚀
              </p>

              <p className="text-base text-gray-600 font-['Comic_Sans_MS']">
                We want to create a safer place for you. 💕
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 font-['Comic_Sans_MS']">
            Thank you for your patience! 💕
          </p>
          <p className="text-gray-500 font-['Comic_Sans_MS'] mt-2">
            We're working hard to make your experience even better.
          </p>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-['Comic_Sans_MS']"
          >
            <ArrowRight size={20} />
            Check if we're back
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
