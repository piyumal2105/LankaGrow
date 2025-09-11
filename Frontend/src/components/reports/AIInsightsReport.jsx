import React from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import LoadingSpinner from "../common/LoadingSpinner";

function AIInsightsReport() {
  const { data: aiInsights, isLoading } = useQuery(
    "ai-insights",
    reportService.getAIInsights
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const insights = [
    {
      category: "Sales Forecasting",
      title: "Revenue Growth Prediction",
      insight:
        "Based on seasonal trends and customer behavior patterns, your revenue is projected to increase by 18% next month.",
      confidence: 92,
      action: "Prepare additional inventory for high-demand products",
      impact: "High",
      icon: TrendingUp,
      color: "green",
    },
    {
      category: "Customer Analytics",
      title: "Customer Retention Opportunity",
      insight:
        "15 VIP customers haven't made purchases in 45+ days. Historical data shows targeted outreach increases retention by 67%.",
      confidence: 85,
      action: "Launch personalized re-engagement campaign",
      impact: "High",
      icon: Target,
      color: "blue",
    },
    {
      category: "Inventory Optimization",
      title: "Stock Reorder Alert",
      insight:
        "8 products will reach critical stock levels within 2 weeks based on current sales velocity.",
      confidence: 89,
      action: "Schedule automated reorders for affected products",
      impact: "Medium",
      icon: AlertCircle,
      color: "yellow",
    },
    {
      category: "Pricing Strategy",
      title: "Price Optimization Opportunity",
      insight:
        "Electronics category shows 15% price elasticity. Small price adjustments could increase profit margin by 8%.",
      confidence: 78,
      action: "Test price optimization on select electronics",
      impact: "Medium",
      icon: Lightbulb,
      color: "purple",
    },
    {
      category: "Seasonal Trends",
      title: "Festival Season Preparation",
      insight:
        "Vesak and Poson seasons typically show 35% sales increase. Early preparation could capture additional 12% market share.",
      confidence: 95,
      action: "Increase marketing budget and inventory for festival season",
      impact: "High",
      icon: Sparkles,
      color: "indigo",
    },
    {
      category: "Cost Optimization",
      title: "Expense Pattern Analysis",
      insight:
        "Marketing expenses show diminishing returns after Rs 150K monthly spend. Reallocation could improve ROI by 25%.",
      confidence: 82,
      action: "Optimize marketing budget allocation across channels",
      impact: "Medium",
      icon: TrendingUp,
      color: "red",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      green:
        "from-green-500 to-green-600 text-green-600 bg-green-50 border-green-200",
      blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200",
      yellow:
        "from-yellow-500 to-yellow-600 text-yellow-600 bg-yellow-50 border-yellow-200",
      purple:
        "from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200",
      indigo:
        "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50 border-indigo-200",
      red: "from-red-500 to-red-600 text-red-600 bg-red-50 border-red-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Business Intelligence</h1>
            <p className="text-blue-100">
              Powered by advanced machine learning algorithms
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">6</div>
            <div className="text-blue-100">Active Insights</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">87%</div>
            <div className="text-blue-100">Average Confidence</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">Rs 2.5M</div>
            <div className="text-blue-100">Potential Revenue Impact</div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`card border-l-4 hover:shadow-lg transition-all duration-300 ${getColorClasses(
              insight.color
            )}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getColorClasses(
                    insight.color
                  )} flex items-center justify-center`}
                >
                  <insight.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {insight.category}
                  </span>
                  <h3 className="font-semibold text-gray-900">
                    {insight.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    insight.impact === "High"
                      ? "bg-red-100 text-red-800"
                      : insight.impact === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {insight.impact} Impact
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {insight.insight}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Confidence:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getColorClasses(
                        insight.color
                      )}`}
                      style={{ width: `${insight.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {insight.confidence}%
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border ${getColorClasses(
                insight.color
              )}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Recommended Action:
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-700 mt-1">{insight.action}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>AI Summary & Next Steps</span>
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Priority Actions
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Launch VIP customer re-engagement campaign
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Prepare inventory for 18% revenue increase
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Optimize festival season marketing strategy
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Expected Impact
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue Increase:</span>
                  <span className="font-medium text-green-600">
                    +Rs 2.5M (18%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost Savings:</span>
                  <span className="font-medium text-blue-600">
                    +Rs 450K (8%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer Retention:</span>
                  <span className="font-medium text-purple-600">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AIInsightsReport;
