import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import LoadingSpinner from "../common/LoadingSpinner";

function AIInsights() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: reportService.getAIInsights,
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const aiInsightsData = [
    {
      type: "forecast",
      title: "Sales Prediction",
      insight:
        "Your sales are predicted to increase by 15% next month based on seasonal trends.",
      confidence: 85,
      action: "Prepare additional inventory",
      icon: TrendingUp,
      color: "green",
    },
    {
      type: "inventory",
      title: "Stock Optimization",
      insight:
        "Consider reordering iPhone 15 cases - stock will run out in 5 days based on current sales.",
      confidence: 92,
      action: "Reorder 50 units",
      icon: Target,
      color: "blue",
    },
    {
      type: "customer",
      title: "Customer Behavior",
      insight:
        "Premium customers show 30% higher purchase frequency during weekends.",
      confidence: 78,
      action: "Launch weekend promotions",
      icon: Lightbulb,
      color: "purple",
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              AI Business Insights
            </h2>
            <p className="text-sm text-gray-600">
              Intelligent recommendations for your business
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered</span>
        </div>
      </div>

      <div className="space-y-4">
        {aiInsightsData.map((insight, index) => (
          <motion.div
            key={insight.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  insight.color === "green"
                    ? "bg-green-100 text-green-600"
                    : insight.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                <insight.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{insight.insight}</p>
                <button
                  className={`inline-flex items-center space-x-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    insight.color === "green"
                      ? "text-green-700 bg-green-50 hover:bg-green-100"
                      : insight.color === "blue"
                      ? "text-blue-700 bg-blue-50 hover:bg-blue-100"
                      : "text-purple-700 bg-purple-50 hover:bg-purple-100"
                  }`}
                >
                  <span>{insight.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-700 font-medium">
          <span>View All AI Insights</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AIInsights;
