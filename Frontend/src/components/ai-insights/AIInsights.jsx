import React, { useState, useEffect } from "react";
import {
  Zap,
  TrendingUp,
  Brain,
  Target,
  DollarSign,
  Users,
  Package,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../services/api";

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await api.getAIInsights();
      setInsights(response.data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setError("Failed to load AI insights. Showing demo data.");
      // Set demo data when API fails
      setInsights({
        salesForecast: {
          predicted_amount: 125000,
          confidence: 0.87,
          trend: "increasing",
          insights:
            "Based on seasonal patterns and recent growth, next month shows strong potential for increased sales.",
        },
        insights: [
          {
            insight:
              "Your inventory turnover rate has improved by 23% this month, indicating better stock management.",
            priority: "high",
            action:
              "Continue monitoring fast-moving items and consider increasing stock for top performers.",
          },
          {
            insight:
              "Customer acquisition cost has decreased while customer lifetime value increased by 15%.",
            priority: "medium",
            action:
              "Focus on retention strategies and expand successful marketing channels.",
          },
          {
            insight:
              "Peak sales hours are between 2-4 PM and 7-9 PM on weekdays.",
            priority: "low",
            action:
              "Schedule promotional activities during these high-traffic periods.",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const forecastData = [
    { month: "Last Month", actual: 98000, predicted: null },
    { month: "This Month", actual: 112000, predicted: null },
    {
      month: "Next Month",
      actual: null,
      predicted: insights?.salesForecast?.predicted_amount || 125000,
    },
  ];

  const performanceMetrics = [
    { name: "Revenue Growth", value: 12.5, color: "#10B981" },
    { name: "Customer Satisfaction", value: 87, color: "#3B82F6" },
    { name: "Inventory Efficiency", value: 94, color: "#F59E0B" },
    { name: "Profit Margin", value: 23.4, color: "#EF4444" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Business Insights</h1>
            <p className="text-blue-100">
              Powered by advanced machine learning algorithms
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Sales Forecast */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={24} />
          <h2 className="text-xl font-semibold">Sales Forecast</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-green-100">Predicted Next Month</p>
            <p className="text-3xl font-bold">
              LKR{" "}
              {insights?.salesForecast?.predicted_amount?.toLocaleString() ||
                "125,000"}
            </p>
            <p className="text-green-100 text-sm mt-1">
              +12.5% from this month
            </p>
          </div>
          <div className="text-center">
            <p className="text-green-100">AI Confidence</p>
            <p className="text-3xl font-bold">
              {Math.round((insights?.salesForecast?.confidence || 0.87) * 100)}%
            </p>
            <div className="w-full bg-green-400 bg-opacity-30 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    (insights?.salesForecast?.confidence || 0.87) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-green-100">Market Trend</p>
            <p className="text-3xl font-bold capitalize">
              {insights?.salesForecast?.trend || "Increasing"}
            </p>
            <p className="text-green-100 text-sm mt-1">Strong growth signals</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
          <p className="text-green-100 text-sm font-medium mb-1">
            AI Analysis:
          </p>
          <p className="text-white">
            {insights?.salesForecast?.insights ||
              "Analyzing your sales patterns to provide accurate forecasts..."}
          </p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">
          Sales Forecast Visualization
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Actual Sales"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Predicted Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">
          AI-Powered Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg
                  className="w-20 h-20 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="2"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="2"
                    strokeDasharray={`${metric.value}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {metric.value}%
                  </span>
                </div>
              </div>
              <p className="font-medium text-gray-900">{metric.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights?.insights?.map((insight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full flex-shrink-0 ${
                  insight.priority === "high"
                    ? "bg-red-100"
                    : insight.priority === "medium"
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}
              >
                <Lightbulb
                  size={20}
                  className={
                    insight.priority === "high"
                      ? "text-red-600"
                      : insight.priority === "medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      insight.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : insight.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {insight.priority} priority
                  </span>
                </div>
                <p className="text-gray-900 mb-4 leading-relaxed">
                  {insight.insight}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Recommended Action:
                  </p>
                  <p className="text-sm text-gray-600">{insight.action}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI-Powered Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">AI-Powered Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="text-center">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-600" />
              <p className="font-semibold text-gray-900 mb-1">
                Optimize Inventory
              </p>
              <p className="text-sm text-gray-600">
                AI-suggested reorder levels based on sales patterns
              </p>
            </div>
          </button>
          <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-purple-600" />
              <p className="font-semibold text-gray-900 mb-1">
                Customer Insights
              </p>
              <p className="text-sm text-gray-600">
                Identify high-value customers and retention opportunities
              </p>
            </div>
          </button>
          <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-green-600" />
              <p className="font-semibold text-gray-900 mb-1">
                Price Optimization
              </p>
              <p className="text-sm text-gray-600">
                AI-recommended pricing for maximum profitability
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
