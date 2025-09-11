import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

function CategorySuggestions() {
  const suggestions = [
    {
      category: "Office Supplies",
      trend: "+15%",
      description: "Increase in office supply expenses this month",
      color: "blue",
      action: "Review suppliers for better rates",
    },
    {
      category: "Marketing",
      trend: "+28%",
      description: "Marketing spend showing good ROI",
      color: "green",
      action: "Consider increasing budget",
    },
    {
      category: "Travel",
      trend: "-12%",
      description: "Travel expenses decreased significantly",
      color: "purple",
      action: "Reallocate budget to other areas",
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Expense Insights
          </h3>
          <p className="text-gray-600 mb-4">
            Smart analysis of your expense patterns and optimization suggestions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {suggestion.category}
                  </h4>
                  <div
                    className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full bg-gradient-to-r ${
                      colorClasses[suggestion.color]
                    } text-white`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>{suggestion.trend}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {suggestion.description}
                </p>
                <button className="inline-flex items-center space-x-1 text-sm font-medium text-purple-600 hover:text-purple-700">
                  <span>{suggestion.action}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySuggestions;
