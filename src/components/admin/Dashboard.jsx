import React from "react";
import {
  MessageCircle,
  Flag,
  EyeOff,
  Users,
  Heart,
  BarChart3,
  MessageSquare,
  Megaphone,
  Shield,
} from "lucide-react";
import StatCard from "./StatCard";

const Dashboard = ({ stats, polls, announcements, bannedWords }) => {
  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: MessageCircle,
      bgColor: "bg-blue-100",
      textColor: "text-gray-900",
      iconColor: "text-blue-600",
    },
    {
      title: "Flagged Posts",
      value: stats.flaggedPosts,
      icon: Flag,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      iconColor: "text-orange-600",
    },
    {
      title: "Hidden Posts",
      value: stats.hiddenPosts,
      icon: EyeOff,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      iconColor: "text-red-600",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: Users,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-600",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
      iconColor: "text-pink-600",
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: BarChart3,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      iconColor: "text-purple-600",
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts,
      icon: MessageSquare,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Polls",
      value: polls.length,
      icon: BarChart3,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Announcements",
      value: announcements.length,
      icon: Megaphone,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      iconColor: "text-orange-600",
    },
    {
      title: "Banned Words",
      value: bannedWords.length,
      icon: Shield,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default Dashboard;
