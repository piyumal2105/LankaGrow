import React from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { Package, AlertTriangle, TrendingDown, BarChart3 } from "lucide-react";
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

function InventoryReport() {
  const { data: inventoryData, isLoading } = useQuery(
    "inventory-report",
    reportService.getInventoryReport
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Sample data
  const data = inventoryData?.data || {
    totalProducts: 1250,
    lowStockProducts: [],
    stockValuation: 2850000,
  };

  const categoryStock = [
    { category: "Electronics", products: 425, value: 1250000 },
    { category: "Clothing", products: 380, value: 680000 },
    { category: "Food & Beverage", products: 220, value: 450000 },
    { category: "Books", products: 125, value: 285000 },
    { category: "Home & Garden", products: 100, value: 185000 },
  ];

  const stockMovement = [
    { month: "Jan", inbound: 450, outbound: 380, net: 70 },
    { month: "Feb", inbound: 520, outbound: 420, net: 100 },
    { month: "Mar", inbound: 380, outbound: 450, net: -70 },
    { month: "Apr", inbound: 680, outbound: 520, net: 160 },
    { month: "May", inbound: 590, outbound: 480, net: 110 },
    { month: "Jun", inbound: 720, outbound: 580, net: 140 },
  ];

  const lowStockItems = [
    {
      name: "iPhone 15 Pro",
      currentStock: 3,
      minLevel: 5,
      category: "Electronics",
    },
    {
      name: "Samsung Galaxy S24",
      currentStock: 2,
      minLevel: 5,
      category: "Electronics",
    },
    {
      name: "MacBook Air M2",
      currentStock: 1,
      minLevel: 3,
      category: "Electronics",
    },
    {
      name: 'iPad Pro 12.9"',
      currentStock: 4,
      minLevel: 8,
      category: "Electronics",
    },
    {
      name: "AirPods Pro 2",
      currentStock: 6,
      minLevel: 10,
      category: "Electronics",
    },
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
                Total Products
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {data.totalProducts}
              </p>
              <p className="text-sm text-gray-500">+45 this month</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
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
                Low Stock Items
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {lowStockItems.length}
              </p>
              <p className="text-sm text-gray-500">Needs attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
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
                Stock Valuation
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.stockValuation)}
              </p>
              <p className="text-sm text-gray-500">+12.5% vs last month</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
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
                Turnover Rate
              </h3>
              <p className="text-2xl font-bold text-purple-600">4.2x</p>
              <p className="text-sm text-gray-500">Annual turnover</p>
            </div>
            <TrendingDown className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Stock Movement Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Stock Movement Trend
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockMovement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inbound" fill="#10B981" name="Inbound" />
              <Bar dataKey="outbound" fill="#EF4444" name="Outbound" />
              <Bar dataKey="net" fill="#3B82F6" name="Net Change" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory by Category
            </h3>
          </div>
          <div className="space-y-4">
            {categoryStock.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {category.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {category.products} products
                  </p>
                </div>
                <p className="font-bold text-gray-900">
                  {formatCurrency(category.value)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Low Stock Alert</span>
            </h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {item.currentStock}/{item.minLevel}
                  </p>
                  <p className="text-xs text-red-500">Min level</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InventoryReport;
