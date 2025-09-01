import React, { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveAnnouncement();
  }, []);

  const fetchActiveAnnouncement = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS);
      const data = await response.json();

      if (data && data.length > 0) {
        // Get the most recent active announcement
        const activeAnnouncement = data.find((ann) => ann.isActive) || data[0];
        setAnnouncement(activeAnnouncement);
        setIsVisible(true);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isLoading || !announcement || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Megaphone className="w-5 h-5 text-yellow-300 animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium font-['Comic_Sans_MS'] leading-tight">
                <span className="font-bold text-yellow-300">ANNOUNCEMENT:</span>{" "}
                {announcement.message}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-4 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
