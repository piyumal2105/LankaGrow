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
  const { data: profitLossData, isLoading } = useQuery(
    ["profit-loss-report", dateRange],
    () => reportService.getProfitLossReport(dateRange)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Sample data
  const data = profitLossData?.data || {
    totalRevenue: 875000,
    totalExpenses: 425000,
    netProfit: 450000,
    profitMargin: 51.4,
    expenseBreakdown: [
      { _id: "Office Supplies", total: 85000, count: 45 },
      { _id: "Marketing", total: 125000, count: 32 },
      { _id: "Utilities", total: 45000, count: 12 },
      { _id: "Equipment", total: 95000, count: 8 },
      { _id: "Professional Services", total: 75000, count: 15 },
    ],
  };

  const monthlyPL = [
    { month: "Jan", revenue: 125000, expenses: 65000, profit: 60000 },
    { month: "Feb", revenue: 145000, expenses: 75000, profit: 70000 },
    { month: "Mar", revenue: 135000, expenses: 68000, profit: 67000 },
    { month: "Apr", revenue: 165000, expenses: 85000, profit: 80000 },
    { month: "May", revenue: 155000, expenses: 72000, profit: 83000 },
    { month: "Jun", revenue: 175000, expenses: 82000, profit: 93000 },
  ];

  const expenseColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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
                {formatCurrency(data.totalRevenue)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+15.2%</span>
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
                {formatCurrency(data.totalExpenses)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+8.5%</span>
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
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.netProfit)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+22.8%</span>
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
              <p className="text-2xl font-bold text-purple-600">
                {formatPercentage(data.profitMargin)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">+3.2%</span>
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
            Monthly Profit & Loss Trend
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPL}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
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
              Expense Breakdown
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.expenseBreakdown.map((item, index) => ({
                    ...item,
                    color: expenseColors[index % expenseColors.length],
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="total"
                >
                  {data.expenseBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={expenseColors[index % expenseColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {data.expenseBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        expenseColors[index % expenseColors.length],
                    }}
                  ></div>
                  <span className="text-sm text-gray-600">{item._id}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
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
            {data.expenseBreakdown.map((expense, index) => {
              const percentage = (expense.total / data.totalExpenses) * 100;
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
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfitLossReport;
