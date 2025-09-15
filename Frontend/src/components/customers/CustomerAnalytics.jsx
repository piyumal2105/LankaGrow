import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  BarChart3,
  PieChart as PieChartIcon,
  Award,
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
} from "recharts";
import { customerService } from "../../services/customerService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function CustomerAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["customer-analytics"],
    queryFn: customerService.getCustomerAnalytics,
  });

  const { data: topCustomers } = useQuery({
    queryKey: ["top-customers"],
    queryFn: customerService.getTopCustomers,
  });

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
    { segment: "VIP (Rs 100K+)", count: 15, percentage: 12, color: "#EF4444" },
    {
      segment: "Premium (Rs 50K+)",
      count: 28,
      percentage: 22,
      color: "#F59E0B",
    },
    {
      segment: "Standard (Rs 10K+)",
      count: 45,
      percentage: 36,
      color: "#10B981",
    },
    { segment: "New (< Rs 10K)", count: 38, percentage: 30, color: "#3B82F6" },
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "segments", name: "Segments", icon: PieChartIcon },
    { id: "insights", name: "AI Insights", icon: Target },
  ];

  return (
    <div className="space-y-6 max-h-[80vh] overflow-hidden">
      {/* Summary Stats - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs">Total Customers</p>
              <p className="text-2xl font-bold">
                {statsData?.totalCustomers || 126}
              </p>
              <p className="text-blue-100 text-xs">+12% this month</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs">Active Customers</p>
              <p className="text-2xl font-bold">112</p>
              <p className="text-green-100 text-xs">89% of total</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs">Avg. Purchase</p>
              <p className="text-2xl font-bold">Rs 25.5K</p>
              <p className="text-purple-100 text-xs">+8% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-xs">Retention</p>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-yellow-100 text-xs">Above industry avg</p>
            </div>
            <Target className="w-8 h-8 text-yellow-200" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content - Fixed height with scrolling */}
      <div className="h-96 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Monthly New Customers - Larger */}
            <div className="lg:col-span-2 card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Monthly New Customers
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyNewCustomers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={14} />
                    <YAxis fontSize={14} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Types - Larger */}
            <div className="card">
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
            </div>

            {/* Top Customers - Larger cards */}
            <div className="lg:col-span-3 card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top 5 Customers by Revenue
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {(Array.isArray(topCustomers?.data) ? topCustomers.data : [])
                  .slice(0, 5)
                  .map((customer, index) => (
                    <div
                      key={customer._id}
                      className="bg-gray-50 rounded-lg p-6 text-center"
                    >
                      <div className="flex justify-center mb-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            customer.customerType === "business"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {customer.customerType === "business" ? (
                            <Building className="w-6 h-6" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 text-base truncate">
                        {customer.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {customer.customerType}
                      </p>
                      <p className="font-bold text-green-600 text-lg">
                        {formatCurrency(customer.totalPurchases || 0)}
                      </p>
                      {customer.totalPurchases > 100000 && (
                        <div className="flex items-center justify-center space-x-1 text-yellow-600 mt-2">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">VIP</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "segments" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Customer Segments Chart - Larger */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Segments
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="percentage"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Segment Details - Larger */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Segment Breakdown
                </h3>
              </div>
              <div className="space-y-6">
                {customerSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900 text-base">
                          {segment.segment}
                        </p>
                        <p className="text-sm text-gray-500">
                          {segment.count} customers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {segment.percentage}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${segment.percentage}%`,
                            backgroundColor: segment.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-purple-100">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h4 className="font-medium text-gray-900 text-lg">
                  Retention Opportunity
                </h4>
              </div>
              <p className="text-base text-gray-600 mb-4">
                15 customers haven't purchased in 60+ days. Consider reaching
                out with personalized offers.
              </p>
              <div className="mt-4 bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-700">
                  Recommended Action
                </p>
                <p className="text-sm text-purple-600">
                  Send targeted re-engagement campaign
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-100">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h4 className="font-medium text-gray-900 text-lg">
                  Upsell Potential
                </h4>
              </div>
              <p className="text-base text-gray-600 mb-4">
                VIP customers show 30% higher purchase frequency. Target them
                with premium products.
              </p>
              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700">
                  Recommended Action
                </p>
                <p className="text-sm text-green-600">
                  Launch premium product campaign
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-6 h-6 text-blue-600" />
                <h4 className="font-medium text-gray-900 text-lg">
                  Growth Trend
                </h4>
              </div>
              <p className="text-base text-gray-600 mb-4">
                Business customers generate 2.5x more revenue than individual
                customers on average.
              </p>
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-700">
                  Recommended Action
                </p>
                <p className="text-sm text-blue-600">
                  Focus B2B acquisition efforts
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-yellow-100">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-6 h-6 text-yellow-600" />
                <h4 className="font-medium text-gray-900 text-lg">
                  Payment Patterns
                </h4>
              </div>
              <p className="text-base text-gray-600 mb-4">
                78% of customers pay within payment terms. Consider early
                payment discounts.
              </p>
              <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-700">
                  Recommended Action
                </p>
                <p className="text-sm text-yellow-600">
                  Implement early payment incentives
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerAnalytics;
