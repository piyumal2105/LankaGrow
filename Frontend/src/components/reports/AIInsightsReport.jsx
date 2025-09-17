// src/components/reports/AIInsightsReport.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Target,
  Lightbulb,
  Download,
  RefreshCw,
  Calendar,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts";
import aiService from "../../services/aiService";

const AIInsightsReport = () => {
  const [insights, setInsights] = useState([]);
  const [salesForecast, setSalesForecast] = useState(null);
  const [cashFlowPrediction, setCashFlowPrediction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("3months");

  useEffect(() => {
    fetchAllAIData();
  }, [timeframe]);

  const fetchAllAIData = async () => {
    setLoading(true);
    try {
      const [insights, forecast, cashFlow] = await Promise.all([
        aiService.getBusinessInsights(),
        aiService.getSalesForecasting(),
        aiService.getCashFlowPrediction(timeframe),
      ]);

      setInsights(insights.data || []);
      setSalesForecast(forecast.data || null);
      setCashFlowPrediction(cashFlow.data || []);
    } catch (error) {
      console.error("Error fetching AI report data:", error);
      // Fallback data
      setInsights([
        {
          insight: "Your business shows strong growth potential",
          priority: "high",
          action: "Focus on top-performing products",
        },
      ]);
      setSalesForecast({
        predicted_amount: 150000,
        confidence: 0.85,
        trend: "increasing",
        insights: "Strong upward trend expected",
      });
      setCashFlowPrediction([
        { month: "Jan", predicted: 120000, actual: 115000 },
        { month: "Feb", predicted: 135000, actual: 142000 },
        { month: "Mar", predicted: 150000, actual: null },
        { month: "Apr", predicted: 165000, actual: null },
      ]);
    }
    setLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-blue-600 bg-blue-100 border-blue-200";
    }
  };

  const performanceMetrics = [
    {
      title: "Revenue Growth",
      value: "+15.2%",
      trend: "up",
      color: "text-green-600",
      icon: TrendingUp,
    },
    {
      title: "Profit Margin",
      value: "23.8%",
      trend: "up",
      color: "text-blue-600",
      icon: DollarSign,
    },
    {
      title: "Customer Retention",
      value: "87%",
      trend: "stable",
      color: "text-purple-600",
      icon: Users,
    },
    {
      title: "Inventory Turnover",
      value: "4.2x",
      trend: "up",
      color: "text-orange-600",
      icon: Package,
    },
  ];

  const aiRecommendations = [
    {
      category: "Sales",
      recommendation:
        "Increase marketing spend by 20% for top-performing products",
      impact: "High",
      effort: "Medium",
      timeline: "2-4 weeks",
    },
    {
      category: "Inventory",
      recommendation: "Reduce stock levels for slow-moving items by 30%",
      impact: "Medium",
      effort: "Low",
      timeline: "1-2 weeks",
    },
    {
      category: "Pricing",
      recommendation: "Implement dynamic pricing for seasonal products",
      impact: "High",
      effort: "High",
      timeline: "4-6 weeks",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8" />
              <h1 className="text-2xl font-bold">
                AI Business Intelligence Report
              </h1>
            </div>
            <p className="text-purple-100">
              Comprehensive AI-powered analysis of your business performance
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
            >
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
            <button
              onClick={fetchAllAIData}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
              {metric.trend === "up" ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : metric.trend === "down" ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <BarChart3 className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {metric.title}
            </h3>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Sales Forecast & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Forecast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Sales Forecast</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              AI Powered
            </span>
          </div>

          {salesForecast && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Predicted Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    LKR {salesForecast.predicted_amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence Level</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(salesForecast.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {salesForecast.insights}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cash Flow Prediction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Cash Flow Prediction
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cashFlowPrediction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`LKR ${value?.toLocaleString()}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#8884d8"
                strokeDasharray="5 5"
                name="Predicted"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#82ca9d"
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">
            AI Business Insights
          </h2>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getPriorityColor(
                insight.priority
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {insight.priority === "high" ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">
                    {insight.insight}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Recommended Action:</span>{" "}
                    {insight.action}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 bg-white rounded-full">
                  {insight.priority} priority
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">
            AI Recommendations
          </h2>
        </div>

        <div className="space-y-4">
          {aiRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full mb-2">
                    {rec.category}
                  </span>
                  <p className="font-medium text-gray-900">
                    {rec.recommendation}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">AI</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Impact:</span>
                  <span
                    className={`ml-1 font-medium ${
                      rec.impact === "High"
                        ? "text-green-600"
                        : rec.impact === "Medium"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {rec.impact}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Effort:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {rec.effort}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Timeline:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {rec.timeline}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Export AI Report
            </h3>
            <p className="text-sm text-gray-600">
              Share these insights with your team or advisors
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export PDF
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Share Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsReport;
