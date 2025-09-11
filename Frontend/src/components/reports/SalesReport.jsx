import React from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { reportService } from "../../services/reportService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function SalesReport({ dateRange }) {
  const { data: salesData, isLoading } = useQuery(
    ["sales-report", dateRange],
    () => reportService.getSalesReport(dateRange)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Sample data
  const monthlySales = [
    { month: "Jan", sales: 125000, orders: 45 },
    { month: "Feb", sales: 145000, orders: 52 },
    { month: "Mar", sales: 135000, orders: 48 },
    { month: "Apr", sales: 165000, orders: 58 },
    { month: "May", sales: 155000, orders: 55 },
    { month: "Jun", sales: 175000, orders: 62 },
  ];

  const topProducts = [
    { name: "iPhone 15", sales: 45000, quantity: 15 },
    { name: "Samsung Galaxy S24", sales: 38000, quantity: 12 },
    { name: "MacBook Air", sales: 35000, quantity: 8 },
    { name: "iPad Pro", sales: 28000, quantity: 10 },
    { name: "AirPods Pro", sales: 22000, quantity: 25 },
  ];

  const topCustomers = [
    { name: "TechCorp Solutions", sales: 85000, orders: 12 },
    { name: "Digital Enterprises", sales: 72000, orders: 8 },
    { name: "Innovation Labs", sales: 68000, orders: 10 },
    { name: "Future Systems", sales: 55000, orders: 7 },
    { name: "Smart Solutions", sales: 48000, orders: 6 },
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Sales
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(salesData?.data?.totalSales || 945000)}
          </p>
          <p className="text-sm text-gray-500">+18% from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {salesData?.data?.invoiceCount || 320}
          </p>
          <p className="text-sm text-gray-500">+12% from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Average Order
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(2953)}
          </p>
          <p className="text-sm text-gray-500">+5% from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conversion Rate
          </h3>
          <p className="text-3xl font-bold text-yellow-600">24.5%</p>
          <p className="text-sm text-gray-500">+2.1% from last period</p>
        </motion.div>
      </div>

      {/* Sales Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Sales Trend
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "sales" ? formatCurrency(value) : value,
                  name === "sales" ? "Sales" : "Orders",
                ]}
              />
              <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Products and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.quantity} units sold
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {formatCurrency(product.sales)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Customers
            </h3>
          </div>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {customer.orders} orders
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {formatCurrency(customer.sales)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SalesReport;
