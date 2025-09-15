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
  AlertCircle,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function AIInsightsReport() {
  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: reportService.getAIInsights,
  });

  // Get additional data for context
  const { data: salesData } = useQuery({
    queryKey: ["sales-report-context"],
    queryFn: () =>
      reportService.getSalesReport({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      }),
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory-report-context"],
    queryFn: reportService.getInventoryReport,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const insights = aiInsights?.data?.insights || [];
  const salesForecast = aiInsights?.data?.salesForecast || {};
  const sales = salesData?.data || {};
  const inventory = inventoryData?.data || {};

  // Generate insights based on actual data
  const generateInsights = () => {
    const dynamicInsights = [];

    // Sales forecasting insight
    if (sales.totalSales > 0) {
      dynamicInsights.push({
        category: "Sales Forecasting",
        title: "Revenue Analysis",
        insight: `Based on your current sales data, you've generated ${formatCurrency(
          sales.totalSales
        )} in revenue from ${
          sales.invoiceCount || 0
        } orders. Your average order value is ${formatCurrency(
          sales.totalSales / (sales.invoiceCount || 1)
        )}.`,
        confidence: 88,
        action: "Continue monitoring sales trends and customer patterns",
        impact: "Medium",
        icon: TrendingUp,
        color: "green",
      });
    }

    // Inventory insights
    if (inventory.lowStockProducts && inventory.lowStockProducts.length > 0) {
      dynamicInsights.push({
        category: "Inventory Optimization",
        title: "Stock Level Alert",
        insight: `You have ${
          inventory.lowStockProducts.length
        } products below minimum stock levels. Total inventory value is ${formatCurrency(
          inventory.stockValuation || 0
        )}.`,
        confidence: 95,
        action: "Reorder low stock items to prevent stockouts",
        impact: "High",
        icon: AlertCircle,
        color: "red",
      });
    } else if (inventory.totalProducts > 0) {
      dynamicInsights.push({
        category: "Inventory Optimization",
        title: "Inventory Health",
        insight: `Your inventory is well-stocked with ${
          inventory.totalProducts
        } products valued at ${formatCurrency(
          inventory.stockValuation || 0
        )}. All items are above minimum levels.`,
        confidence: 92,
        action: "Monitor sales velocity to optimize reorder timing",
        impact: "Low",
        icon: Target,
        color: "green",
      });
    }

    // Customer analysis
    if (sales.salesByCustomer && sales.salesByCustomer.length > 0) {
      const topCustomer = sales.salesByCustomer[0];
      dynamicInsights.push({
        category: "Customer Analytics",
        title: "Top Customer Analysis",
        insight: `Your top customer "${
          topCustomer.customerName || "Customer"
        }" has generated ${formatCurrency(topCustomer.totalSales)} from ${
          topCustomer.invoiceCount
        } orders.`,
        confidence: 85,
        action:
          "Strengthen relationships with top customers through loyalty programs",
        impact: "High",
        icon: Target,
        color: "blue",
      });
    }

    // Product performance
    if (sales.salesByProduct && sales.salesByProduct.length > 0) {
      const topProduct = sales.salesByProduct[0];
      dynamicInsights.push({
        category: "Product Performance",
        title: "Best Selling Product",
        insight: `"${
          topProduct._id
        }" is your top performer with ${formatCurrency(
          topProduct.totalSales
        )} in sales and ${topProduct.totalQuantitySold} units sold.`,
        confidence: 90,
        action: "Consider expanding inventory or similar products",
        impact: "Medium",
        icon: Sparkles,
        color: "purple",
      });
    }

    // Business growth insight
    if (sales.totalSales > 0 && sales.invoiceCount > 0) {
      const avgOrderValue = sales.totalSales / sales.invoiceCount;
      if (avgOrderValue > 1000) {
        dynamicInsights.push({
          category: "Business Growth",
          title: "High-Value Orders",
          insight: `Your average order value of ${formatCurrency(
            avgOrderValue
          )} indicates strong customer purchasing power and business positioning.`,
          confidence: 87,
          action: "Focus on premium products and upselling strategies",
          impact: "High",
          icon: DollarSign,
          color: "indigo",
        });
      }
    }

    // General business insight
    if (dynamicInsights.length === 0) {
      dynamicInsights.push({
        category: "Business Analytics",
        title: "Getting Started",
        insight:
          "Start tracking your sales, inventory, and expenses to unlock powerful AI insights for your business growth.",
        confidence: 100,
        action: "Begin recording business transactions and inventory data",
        impact: "High",
        icon: Lightbulb,
        color: "blue",
      });
    }

    return dynamicInsights;
  };

  const finalInsights = insights.length > 0 ? insights : generateInsights();

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

  // Calculate summary metrics
  const totalSalesValue = sales.totalSales || 0;
  const totalProducts = inventory.totalProducts || 0;
  const averageConfidence =
    finalInsights.length > 0
      ? Math.round(
          finalInsights.reduce(
            (sum, insight) => sum + (insight.confidence || 0),
            0
          ) / finalInsights.length
        )
      : 0;
  const highImpactInsights = finalInsights.filter(
    (insight) => insight.impact === "High"
  ).length;

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
              Intelligent insights powered by your business data
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">
              {finalInsights.length}
            </div>
            <div className="text-blue-100">Active Insights</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">{averageConfidence}%</div>
            <div className="text-blue-100">Average Confidence</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(totalSalesValue)}
            </div>
            <div className="text-blue-100">Sales Revenue</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold mb-1">{highImpactInsights}</div>
            <div className="text-blue-100">High Impact Items</div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {finalInsights.map((insight, index) => (
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
            <span>Business Summary & Next Steps</span>
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Total Revenue: {formatCurrency(totalSalesValue)}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Products in Inventory: {totalProducts}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    AI Insights Generated: {finalInsights.length}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Next Actions</h4>
              <div className="space-y-2">
                {finalInsights
                  .filter((insight) => insight.impact === "High")
                  .slice(0, 3)
                  .map((insight, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">
                        {insight.category}:
                      </span>
                      <span className="font-medium text-gray-900 ml-2">
                        {insight.impact} Priority
                      </span>
                    </div>
                  ))}
                {finalInsights.filter((insight) => insight.impact === "High")
                  .length === 0 && (
                  <div className="text-sm text-gray-600">
                    Continue monitoring business metrics for new insights
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* No Data State */}
      {finalInsights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card text-center py-12"
        >
          <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Insights Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            As you record more sales, inventory, and business data, our AI will
            generate personalized insights to help grow your business.
          </p>
          <div className="flex justify-center space-x-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full">
              Continue Adding Data
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AIInsightsReport;
