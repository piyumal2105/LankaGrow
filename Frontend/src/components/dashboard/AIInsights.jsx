// src/components/dashboard/AIInsights.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  DollarSign,
  Package,
  Users,
  BarChart3,
} from "lucide-react";
import aiService from "../../services/aiService";

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [salesForecast, setSalesForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const [insightsData, forecastData] = await Promise.all([
        aiService.getBusinessInsights(),
        aiService.getSalesForecasting(),
      ]);

      setInsights(insightsData.data || []);
      setSalesForecast(forecastData.data || null);
    } catch (error) {
      console.error("Error fetching AI data:", error);
      // Fallback data
      setInsights([
        {
          insight: "Your sales are trending upward this month",
          priority: "high",
          action: "Consider increasing inventory for top-selling products",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAIData();
    setRefreshing(false);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Brain className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
            Live
          </span>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw
            className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Sales Forecast Card */}
      {salesForecast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Sales Forecast</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Predicted Amount</p>
              <p className="text-lg font-bold text-gray-900">
                LKR {salesForecast.predicted_amount?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Confidence</p>
              <p className="text-lg font-bold text-green-600">
                {(salesForecast.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trend</p>
              <div className="flex items-center gap-1">
                {salesForecast.trend === "increasing" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : salesForecast.trend === "decreasing" ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm font-medium capitalize">
                  {salesForecast.trend}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Month</p>
              <p className="text-lg font-bold text-purple-600">
                {new Date(
                  new Date().setMonth(new Date().getMonth() + 1)
                ).toLocaleDateString("en-US", { month: "short" })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <div className="space-y-4">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getPriorityColor(
                insight.priority
              )} relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <Sparkles className="w-full h-full" />
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getPriorityIcon(insight.priority)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-2">
                      {insight.insight}
                    </p>
                    {insight.action && (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {insight.action}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {insight.priority} priority
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {insights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No AI insights available yet.</p>
            <p className="text-sm text-gray-400">
              Add more data to get personalized insights.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center gap-2 p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700">Sales Report</span>
          </button>
          <button className="flex items-center gap-2 p-3 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Package className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Inventory</span>
          </button>
          <button className="flex items-center gap-2 p-3 text-sm bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700">Customers</span>
          </button>
          <button className="flex items-center gap-2 p-3 text-sm bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <BarChart3 className="w-4 h-4 text-orange-600" />
            <span className="text-orange-700">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
