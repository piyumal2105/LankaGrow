import React from "react";
import { FileText } from "lucide-react";

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                activity.type === "success"
                  ? "bg-green-100 text-green-800"
                  : activity.type === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
