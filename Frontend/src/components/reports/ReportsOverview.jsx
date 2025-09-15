import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  FileText,
  Calendar,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { reportService } from "../../services/reportService";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function ReportsOverview({ dateRange }) {
  const { data: dashboardStats, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: reportService.getDashboardStats,
  });

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ["sales-report", dateRange],
    queryFn: () => reportService.getSalesReport(dateRange),
  });

  const { data: profitLossData, isLoading: profitLossLoading } = useQuery({
    queryKey: ["profit-loss-report", dateRange],
    queryFn: () => reportService.getProfitLossReport(dateRange),
  });

  const isLoading = dashboardLoading || salesLoading || profitLossLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const stats = dashboardStats?.data;
  const sales = salesData?.data;
  const profitLoss = profitLossData?.data;

  const kpis = [
    {
      title: "Total Revenue",
      value: formatCurrency(profitLoss?.totalRevenue || 0),
      change: "+12.5%", // You can calculate this from historical data
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Total Sales",
      value: formatCurrency(sales?.totalSales || 0),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Products in Stock",
      value: stats?.totalProducts || 0,
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "purple",
    },
    {
      title: "Net Profit",
      value: formatCurrency(profitLoss?.netProfit || 0),
      change: "+3.2%",
      trend: "up",
      icon: FileText,
      color: "yellow",
    },
  ];

  // Process expense breakdown for pie chart
  const expenseCategories = profitLoss?.expenseBreakdown || [];
  const categoryData = expenseCategories.slice(0, 5).map((expense, index) => ({
    name: expense._id,
    value: expense.total,
    color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][index],
  }));

  // Process sales by product for chart data
  const productSales = sales?.salesByProduct || [];
  const monthlyRevenue = productSales.slice(0, 6).map((product, index) => ({
    month: product._id.substring(0, 10), // Use product name as month for now
    revenue: product.totalSales,
    expenses: 0, // You'd calculate this from expense data
    profit: product.totalSales * 0.3, // Rough profit margin
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-${kpi.color}-100 flex items-center justify-center`}
              >
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend - using product sales data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Product Sales
            </h3>
          </div>
          <div className="h-80">
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar
                    dataKey="revenue"
                    fill="#3B82F6"
                    name="Sales"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No sales data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Breakdown
            </h3>
          </div>
          <div className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No expense data available
              </div>
            )}
          </div>
          {categoryData.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Quick Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Revenue</h4>
            <p className="text-sm text-gray-600">
              Total revenue: {formatCurrency(profitLoss?.totalRevenue || 0)}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Profit Margin</h4>
            <p className="text-sm text-gray-600">
              {formatPercentage(profitLoss?.profitMargin || 0)} profit margin
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Total Products</h4>
            <p className="text-sm text-gray-600">
              {stats?.totalProducts || 0} products in inventory
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ReportsOverview;
