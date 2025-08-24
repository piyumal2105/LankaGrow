import React from "react";

const StatsCard = ({ title, value, icon: Icon, color, change, changeType }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
