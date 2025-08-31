import React from "react";

const AdminHeader = ({ activeTab }) => {
  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Dashboard",
          description: "Overview and statistics",
        };
      case "all-posts":
        return {
          title: "All Posts",
          description: "Manage all posts and comments",
        };
      case "reported":
        return {
          title: "Reported Posts",
          description: "Posts that have been reported by users",
        };
      case "flagged":
        return {
          title: "Flagged Posts",
          description: "Posts flagged for moderation",
        };
      case "hidden":
        return {
          title: "Hidden Posts",
          description: "Posts currently hidden from users",
        };
      case "word-banning":
        return {
          title: "Word Banning",
          description: "Manage banned words and content filtering",
        };
      case "polls":
        return {
          title: "Polls",
          description: "Manage all polls and voting",
        };
      case "announcements":
        return {
          title: "Announcements",
          description: "Create and manage announcements",
        };
      case "contact-messages":
        return {
          title: "Contact Messages",
          description: "Messages from users via contact form",
        };
      default:
        return {
          title: "Admin Panel",
          description: "Management dashboard",
        };
    }
  };

  const { title, description } = getPageInfo();

  return (
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 font-['Comic_Sans_MS']">
        {title}
      </h1>
      <p className="text-gray-600 text-base md:text-lg font-['Comic_Sans_MS']">
        {description}
      </p>
    </div>
  );
};

export default AdminHeader;
