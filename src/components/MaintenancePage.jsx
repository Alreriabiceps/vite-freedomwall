import { useState, useEffect } from "react";
import { Wrench, Clock, ArrowRight } from "lucide-react";
import {
  getMaintenanceMessage,
  getMaintenanceEndTime,
} from "../config/maintenance";

function MaintenancePage() {
  const [message, setMessage] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    // Get maintenance settings
    const maintenanceMessage = getMaintenanceMessage();
    const maintenanceEndTime = getMaintenanceEndTime();

    setMessage(maintenanceMessage);
    setEndTime(maintenanceEndTime);

    // Calculate time remaining if end time is set
    if (maintenanceEndTime) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const end = new Date(maintenanceEndTime);
        const diff = end - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m remaining`);
          } else {
            setTimeRemaining(`${minutes}m remaining`);
          }
        } else {
          setTimeRemaining("Completing soon...");
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, []);

  const formatEndTime = (dateString) => {
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
    } catch {
      return null;
    }
  };

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

        {/* Message Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
              What's happening?
            </h2>
            <p className="text-lg text-gray-700 mb-6 font-['Comic_Sans_MS'] leading-relaxed">
              {message}
            </p>

            {endTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                  <Clock size={20} />
                  <span className="font-semibold font-['Comic_Sans_MS']">
                    Estimated completion
                  </span>
                </div>
                <p className="text-blue-800 font-['Comic_Sans_MS']">
                  {formatEndTime(endTime)}
                </p>
                {timeRemaining && (
                  <p className="text-blue-600 text-sm mt-2 font-['Comic_Sans_MS']">
                    {timeRemaining}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Updates */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS'] text-center">
            What we're working on
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 font-['Comic_Sans_MS']">
                Upgrading our systems for better performance
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 font-['Comic_Sans_MS']">
                Adding new features to enhance your experience
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 font-['Comic_Sans_MS']">
                Ensuring everything runs smoothly
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 font-['Comic_Sans_MS']">
            Thank you for your patience!
          </p>
          <p className="text-gray-500 font-['Comic_Sans_MS'] mt-1">
            We're working hard to get you back online as soon as possible.
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
