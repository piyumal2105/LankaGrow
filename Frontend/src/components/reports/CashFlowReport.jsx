import React from "react";
import { useQuery } from "react-query";
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
} from "recharts";
import { reportService } from "../../services/reportService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function CashFlowReport({ dateRange }) {
  const { data: cashFlowData, isLoading } = useQuery(
    ["cashflow-report", dateRange],
    () => reportService.getCashFlowReport(dateRange)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Sample data
  const data = cashFlowData?.data || {
    totalInflows: 945000,
    totalOutflows: 425000,
    netCashFlow: 520000,
  };

  const monthlyFlow = [
    { month: "Jan", inflow: 125000, outflow: 85000, net: 40000 },
    { month: "Feb", inflow: 145000, outflow: 92000, net: 53000 },
    { month: "Mar", inflow: 135000, outflow: 88000, net: 47000 },
    { month: "Apr", inflow: 165000, outflow: 95000, net: 70000 },
    { month: "May", inflow: 155000, outflow: 90000, net: 65000 },
    { month: "Jun", inflow: 175000, outflow: 98000, net: 77000 },
  ];

  const projectedFlow = [
    { month: "Jul", projected: 185000, actual: null },
    { month: "Aug", projected: 190000, actual: null },
    { month: "Sep", projected: 195000, actual: null },
    { month: "Oct", projected: 200000, actual: null },
    { month: "Nov", projected: 210000, actual: null },
    { month: "Dec", projected: 220000, actual: null },
  ];

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
                {formatCurrency(data.totalInflows)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+18.2%</span>
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
                {formatCurrency(data.totalOutflows)}
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
                Net Cash Flow
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.netCashFlow)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+28.7%</span>
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
                Cash Runway
              </h3>
              <p className="text-2xl font-bold text-purple-600">14 months</p>
              <p className="text-sm text-gray-500">At current burn rate</p>
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
            Monthly Cash Flow Trend
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
        </div>
      </motion.div>

      {/* Projected vs Actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            6-Month Cash Flow Projection
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectedFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="projected" fill="#8B5CF6" name="Projected" />
            </BarChart>
          </ResponsiveContainer>
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
                <p className="text-sm text-gray-500">85% of total inflow</p>
              </div>
              <p className="font-bold text-green-600">
                {formatCurrency(803250)}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Investment Income</p>
                <p className="text-sm text-gray-500">10% of total inflow</p>
              </div>
              <p className="font-bold text-green-600">
                {formatCurrency(94500)}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Other Income</p>
                <p className="text-sm text-gray-500">5% of total inflow</p>
              </div>
              <p className="font-bold text-green-600">
                {formatCurrency(47250)}
              </p>
            </div>
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
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Operating Expenses</p>
                <p className="text-sm text-gray-500">65% of total outflow</p>
              </div>
              <p className="font-bold text-red-600">{formatCurrency(276250)}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Inventory Purchases</p>
                <p className="text-sm text-gray-500">25% of total outflow</p>
              </div>
              <p className="font-bold text-red-600">{formatCurrency(106250)}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Capital Expenditure</p>
                <p className="text-sm text-gray-500">10% of total outflow</p>
              </div>
              <p className="font-bold text-red-600">{formatCurrency(42500)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CashFlowReport;
