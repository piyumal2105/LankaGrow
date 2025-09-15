import React from "react";
import { useQuery } from "@tanstack/react-query";
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
  const { data: salesData, isLoading } = useQuery({
    queryKey: ["sales-report", dateRange],
    queryFn: () => reportService.getSalesReport(dateRange),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const data = salesData?.data || {};
  const totalSales = data.totalSales || 0;
  const invoiceCount = data.invoiceCount || 0;
  const averageOrderValue = invoiceCount > 0 ? totalSales / invoiceCount : 0;

  // Process sales by product data for chart
  const productSalesChart = (data.salesByProduct || []).map((product) => ({
    month: product._id,
    sales: product.totalSales,
    orders: product.totalQuantitySold,
  }));

  // Top customers data
  const topCustomers = data.salesByCustomer || [];

  // Top products data
  const topProducts = data.salesByProduct || [];

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
            {formatCurrency(totalSales)}
          </p>
          <p className="text-sm text-gray-500">Total revenue from sales</p>
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
          <p className="text-3xl font-bold text-blue-600">{invoiceCount}</p>
          <p className="text-sm text-gray-500">Number of completed orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Average Order Value
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(averageOrderValue)}
          </p>
          <p className="text-sm text-gray-500">Average per order</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Products Sold
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {topProducts.reduce(
              (sum, product) => sum + (product.totalQuantitySold || 0),
              0
            )}
          </p>
          <p className="text-sm text-gray-500">Total units sold</p>
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
            Sales by Product
          </h3>
        </div>
        <div className="h-80">
          {productSalesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSalesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "sales" ? formatCurrency(value) : value,
                    name === "sales" ? "Sales" : "Quantity",
                  ]}
                />
                <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No sales data available for the selected period
            </div>
          )}
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
            {topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product._id}</p>
                    <p className="text-sm text-gray-500">
                      {product.totalQuantitySold} units sold
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(product.totalSales)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No product sales data available
              </div>
            )}
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
            {topCustomers.length > 0 ? (
              topCustomers.slice(0, 5).map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {customer.customerName ||
                        `Customer #${customer.customerId}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.invoiceCount} orders
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(customer.totalSales)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No customer sales data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sales Summary */}
      {totalSales > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-gradient-to-r from-blue-50 to-green-50"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalSales)}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {invoiceCount}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {topProducts.length}
              </p>
              <p className="text-sm text-gray-600">Products Sold</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SalesReport;
