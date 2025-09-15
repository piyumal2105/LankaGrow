import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { reportService } from "../../services/reportService";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function ProfitLossReport({ dateRange }) {
  const { data: profitLossData, isLoading } = useQuery({
    queryKey: ["profit-loss-report", dateRange],
    queryFn: () => reportService.getProfitLossReport(dateRange),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const data = profitLossData?.data || {};
  const totalRevenue = data.totalRevenue || 0;
  const totalExpenses = data.totalExpenses || 0;
  const netProfit = data.netProfit || 0;
  const profitMargin = data.profitMargin || 0;
  const expenseBreakdown = data.expenseBreakdown || [];

  // Create chart data from expense breakdown
  const expenseChartData = expenseBreakdown.map((expense) => ({
    category: expense._id,
    amount: expense.total,
    count: expense.count,
  }));

  const expenseColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Pie chart data for expense breakdown
  const expensePieData = expenseBreakdown.slice(0, 5).map((expense, index) => ({
    ...expense,
    name: expense._id,
    value: expense.total,
    color: expenseColors[index % expenseColors.length],
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
                Total Revenue
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Revenue</span>
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
                Total Expenses
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">Expenses</span>
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
                Net Profit
              </h3>
              <p
                className={`text-2xl font-bold ${
                  netProfit >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatCurrency(netProfit)}
              </p>
              <div className="flex items-center mt-1">
                {netProfit >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm ${
                    netProfit >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {netProfit >= 0 ? "Profit" : "Loss"}
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
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
                Profit Margin
              </h3>
              <p
                className={`text-2xl font-bold ${
                  profitMargin >= 0 ? "text-purple-600" : "text-red-600"
                }`}
              >
                {formatPercentage(profitMargin)}
              </p>
              <div className="flex items-center mt-1">
                {profitMargin >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm ${
                    profitMargin >= 0 ? "text-purple-600" : "text-red-600"
                  }`}
                >
                  Margin
                </span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Profit & Loss Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Expense Breakdown by Category
          </h3>
        </div>
        <div className="h-80">
          {expenseChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No expense data available for the selected period
            </div>
          )}
        </div>
      </motion.div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Distribution
            </h3>
          </div>
          <div className="h-80">
            {expensePieData.length > 0 ? (
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
                      <Cell
                        key={`cell-${index}`}
                        fill={expenseColors[index % expenseColors.length]}
                      />
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
          {expensePieData.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mt-4">
              {expensePieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          expenseColors[index % expenseColors.length],
                      }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Categories
            </h3>
          </div>
          <div className="space-y-4">
            {expenseBreakdown.length > 0 ? (
              expenseBreakdown.map((expense, index) => {
                const percentage =
                  totalExpenses > 0 ? (expense.total / totalExpenses) * 100 : 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {expense._id}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(expense.total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            expenseColors[index % expenseColors.length],
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{expense.count} transactions</span>
                      <span>{formatPercentage(percentage, 1)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No expense categories found
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      {totalRevenue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-gradient-to-r from-gray-50 to-blue-50"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Financial Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-gray-600">Expenses</p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${
                  netProfit >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatCurrency(netProfit)}
              </p>
              <p className="text-sm text-gray-600">
                Net {netProfit >= 0 ? "Profit" : "Loss"}
              </p>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-bold ${
                  profitMargin >= 0 ? "text-purple-600" : "text-red-600"
                }`}
              >
                {formatPercentage(profitMargin)}
              </p>
              <p className="text-sm text-gray-600">Profit Margin</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ProfitLossReport;
