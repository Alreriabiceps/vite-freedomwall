import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
            {title}
          </p>
          <p
            className={`text-3xl font-bold ${textColor} font-['Comic_Sans_MS']`}
          >
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}
        >
          <Icon className={iconColor} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
