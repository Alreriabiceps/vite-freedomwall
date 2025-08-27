import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

function TestAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAnnouncements = async () => {
      try {
        setLoading(true);
        console.log("Testing announcements API...");
        console.log("API endpoint:", API_ENDPOINTS.ANNOUNCEMENTS);

        const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (response.ok) {
          const data = await response.json();
          console.log("Announcements data:", data);
          setAnnouncements(data);
          setError(null);
        } else {
          const errorText = await response.text();
          console.error("API error:", response.status, errorText);
          setError(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    testAnnouncements();
  }, []);

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Announcement System Test</h3>

      {loading && (
        <div className="text-blue-600">Testing announcements API...</div>
      )}

      {error && (
        <div className="text-red-600 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="text-green-600 mb-4">
          <strong>Success!</strong> API is working
        </div>
      )}

      <div className="text-sm text-gray-600">
        <div>
          <strong>API Endpoint:</strong> {API_ENDPOINTS.ANNOUNCEMENTS}
        </div>
        <div>
          <strong>Announcements Count:</strong> {announcements.length}
        </div>
        <div>
          <strong>Active Announcements:</strong>{" "}
          {announcements.filter((a) => a.isActive).length}
        </div>
      </div>

      {announcements.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Announcements:</h4>
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="text-xs p-2 bg-white rounded border"
              >
                <div>
                  <strong>Title:</strong> {announcement.title}
                </div>
                <div>
                  <strong>Active:</strong>{" "}
                  {announcement.isActive ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Type:</strong> {announcement.type}
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  {new Date(announcement.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestAnnouncement;
