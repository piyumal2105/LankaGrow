import React from "react";
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const BusinessInsights = ({ insights }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle size={20} className="text-red-600" />;
      case "medium":
        return <TrendingUp size={20} className="text-yellow-600" />;
      default:
        return <CheckCircle size={20} className="text-green-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 border-red-200",
      medium: "bg-yellow-100 border-yellow-200",
      low: "bg-green-100 border-green-200",
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="space-y-4">
      {insights?.map((insight, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg border ${getPriorityColor(
            insight.priority
          )}`}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-white">
              {getPriorityIcon(insight.priority)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.priority === "high"
                      ? "bg-red-200 text-red-800"
                      : insight.priority === "medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {insight.priority} priority
                </span>
              </div>
              <p className="text-gray-900 mb-3 leading-relaxed">
                {insight.insight}
              </p>
              <div className="bg-white bg-opacity-70 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Recommended Action:
                </p>
                <p className="text-sm text-gray-600">{insight.action}</p>
              </div>
            </div>
          </div>
        </div>
      )) || (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No insights available at the moment</p>
        </div>
      )}
    </div>
  );
};

export default BusinessInsights;
