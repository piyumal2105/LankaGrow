import React from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Building,
  User,
  Calendar,
  DollarSign,
  Target,
  Star,
} from "lucide-react";
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
  LineChart,
  Line,
} from "recharts";
import { customerService } from "../../services/customerService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function CustomerAnalytics() {
  const { data: analytics, isLoading } = useQuery(
    "customer-analytics",
    customerService.getCustomerAnalytics
  );

  const { data: topCustomers } = useQuery(
    "top-customers",
    customerService.getTopCustomers
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const statsData = analytics?.data;

  // Sample data for charts (replace with real data)
  const monthlyNewCustomers = statsData?.monthlyNewCustomers || [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 19 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 23 },
    { month: "May", count: 18 },
    { month: "Jun", count: 28 },
  ];

  const customerTypeData = statsData?.customerTypes || [
    { name: "Individual", value: 65, color: "#3B82F6" },
    { name: "Business", value: 35, color: "#10B981" },
  ];

  const customerSegments = [
    { segment: "VIP (Rs 100K+)", count: 15, percentage: 12 },
    { segment: "Premium (Rs 50K+)", count: 28, percentage: 22 },
    { segment: "Standard (Rs 10K+)", count: 45, percentage: 36 },
    { segment: "New (< Rs 10K)", count: 38, percentage: 30 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Customers</p>
              <p className="text-3xl font-bold">
                {statsData?.totalCustomers || 126}
              </p>
              <p className="text-blue-100 text-sm">+12% this month</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Customers</p>
              <p className="text-3xl font-bold">112</p>
              <p className="text-green-100 text-sm">89% of total</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg. Purchase Value</p>
              <p className="text-3xl font-bold">Rs 25.5K</p>
              <p className="text-purple-100 text-sm">+8% from last month</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Customer Retention</p>
              <p className="text-3xl font-bold">78%</p>
              <p className="text-yellow-100 text-sm">Above industry avg</p>
            </div>
            <Target className="w-12 h-12 text-yellow-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly New Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly New Customers
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyNewCustomers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Customer Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Types
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {customerTypeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Customer Segments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Segments
          </h3>
        </div>
        <div className="space-y-4">
          {customerSegments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">{segment.segment}</p>
                  <p className="text-sm text-gray-500">
                    {segment.count} customers
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {segment.percentage}%
                </p>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${segment.percentage}%`,
                      backgroundColor: COLORS[index],
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Customers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Customers by Revenue
          </h3>
        </div>
        <div className="space-y-4">
          {topCustomers?.data?.slice(0, 5).map((customer, index) => (
            <div
              key={customer._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      customer.customerType === "business"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {customer.customerType === "business" ? (
                      <Building className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">
                      {customer.customerType}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {formatCurrency(customer.totalPurchases || 0)}
                </p>
                {customer.totalPurchases > 100000 && (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">VIP</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Customer Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-gray-900 mb-2">
                  Retention Opportunity
                </h4>
                <p className="text-sm text-gray-600">
                  15 customers haven't purchased in 60+ days. Consider reaching
                  out with personalized offers.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-gray-900 mb-2">
                  Upsell Potential
                </h4>
                <p className="text-sm text-gray-600">
                  VIP customers show 30% higher purchase frequency. Target them
                  with premium products.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-gray-900 mb-2">Growth Trend</h4>
                <p className="text-sm text-gray-600">
                  Business customers generate 2.5x more revenue than individual
                  customers on average.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-gray-900 mb-2">
                  Payment Patterns
                </h4>
                <p className="text-sm text-gray-600">
                  78% of customers pay within payment terms. Consider early
                  payment discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CustomerAnalytics;
