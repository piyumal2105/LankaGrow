import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
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
import { reportService } from "../../services/reportService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function CashFlowReport({ dateRange }) {
  const { data: cashFlowData, isLoading } = useQuery({
    queryKey: ["cashflow-report", dateRange],
    queryFn: () => reportService.getCashFlowReport(dateRange),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const data = cashFlowData?.data || {};
  const totalInflows = data.totalInflows || 0;
  const totalOutflows = data.totalOutflows || 0;
  const netCashFlow = data.netCashFlow || 0;
  const outflowBreakdown = data.outflowBreakdown || [];

  // Calculate cash runway (simplified - assuming current burn rate)
  const monthlyBurnRate = totalOutflows; // This is for the selected period
  const cashRunway =
    totalInflows > 0 && monthlyBurnRate > 0
      ? Math.round(totalInflows / monthlyBurnRate)
      : 0;

  // Create chart data for outflow breakdown
  const outflowChartData = outflowBreakdown.map((outflow) => ({
    category: outflow._id,
    amount: outflow.total,
    count: outflow.count,
  }));

  // Create pie chart data for expense categories
  const expenseColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];
  const expensePieData = outflowBreakdown.slice(0, 6).map((expense, index) => ({
    name: expense._id,
    value: expense.total,
    color: expenseColors[index % expenseColors.length],
  }));

  // Create monthly flow data (you might want to enhance this with actual monthly breakdown)
  const monthlyFlow = outflowBreakdown.slice(0, 6).map((outflow, index) => ({
    month: outflow._id,
    inflow: totalInflows / outflowBreakdown.length, // Distribute evenly for demo
    outflow: outflow.total,
    net: totalInflows / outflowBreakdown.length - outflow.total,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Total Inflows
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalInflows)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Cash Inflows</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Total Outflows
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalOutflows)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">Cash Outflows</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Net Cash Flow
              </h3>
              <p
                className={`text-2xl font-bold ${
                  netCashFlow >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatCurrency(netCashFlow)}
              </p>
              <div className="flex items-center mt-1">
                {netCashFlow >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm ${
                    netCashFlow >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {netCashFlow >= 0 ? "Positive" : "Negative"}
                </span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Cash Position
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {cashRunway > 0 ? `${cashRunway} periods` : "N/A"}
              </p>
              <p className="text-sm text-gray-500">Based on current flow</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Cash Flow Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Cash Flow by Category
          </h3>
        </div>
        <div className="h-80">
          {monthlyFlow.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="inflow"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Cash Inflow"
                />
                <Line
                  type="monotone"
                  dataKey="outflow"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Cash Outflow"
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Net Cash Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No cash flow data available for the selected period
            </div>
          )}
        </div>
      </motion.div>

      {/* Outflow Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Cash Outflow by Category
          </h3>
        </div>
        <div className="h-80">
          {outflowChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outflowChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#EF4444" name="Outflow Amount" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No outflow data available
            </div>
          )}
        </div>
      </motion.div>

      {/* Cash Flow Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Cash Inflow Sources
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sales Revenue</p>
                <p className="text-sm text-gray-500">Primary income source</p>
              </div>
              <p className="font-bold text-green-600">
                {formatCurrency(totalInflows)}
              </p>
            </div>
            {totalInflows === 0 && (
              <div className="text-center py-8 text-gray-500">
                No cash inflow data available for the selected period
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Cash Outflow Categories
            </h3>
          </div>
          <div className="space-y-4">
            {outflowBreakdown.length > 0 ? (
              outflowBreakdown.slice(0, 5).map((outflow, index) => {
                const percentage =
                  totalOutflows > 0 ? (outflow.total / totalOutflows) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{outflow._id}</p>
                      <p className="text-sm text-gray-500">
                        {outflow.count} transactions • {percentage.toFixed(1)}%
                        of total
                      </p>
                    </div>
                    <p className="font-bold text-red-600">
                      {formatCurrency(outflow.total)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No cash outflow data available for the selected period
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Expense Distribution Pie Chart */}
      {expensePieData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Distribution
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {expensePieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Cash Flow Summary */}
      {(totalInflows > 0 || totalOutflows > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card bg-gradient-to-r from-blue-50 to-green-50"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Cash Flow Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalInflows)}
              </p>
              <p className="text-sm text-gray-600">Total Inflows</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalOutflows)}
              </p>
              <p className="text-sm text-gray-600">Total Outflows</p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${
                  netCashFlow >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatCurrency(netCashFlow)}
              </p>
              <p className="text-sm text-gray-600">Net Cash Flow</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {outflowBreakdown.length}
              </p>
              <p className="text-sm text-gray-600">Expense Categories</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cash Flow Health Alert */}
      {netCashFlow < 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card border-l-4 border-red-500 bg-red-50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <TrendingDown className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">
              Negative Cash Flow Alert
            </h3>
          </div>
          <p className="text-red-700 mb-3">
            Your cash outflows exceed inflows by{" "}
            {formatCurrency(Math.abs(netCashFlow))}. Consider reviewing expenses
            and increasing revenue to improve cash position.
          </p>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              Negative Cash Flow
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CashFlowReport;
