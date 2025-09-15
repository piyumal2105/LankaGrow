import React from "react";
import { useQuery } from "@tanstack/react-query";
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
  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ["inventory-report"],
    queryFn: reportService.getInventoryReport,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const data = inventoryData?.data || {};
  const totalProducts = data.totalProducts || 0;
  const lowStockProducts = data.lowStockProducts || [];
  const stockValuation = data.stockValuation || 0;
  const products = data.products || [];

  // Group products by category for chart
  const categoryStock = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = {
        category,
        products: 0,
        value: 0,
        currentStock: 0,
      };
    }
    acc[category].products += 1;
    acc[category].value +=
      (product.currentStock || 0) * (product.unitPrice || 0);
    acc[category].currentStock += product.currentStock || 0;
    return acc;
  }, {});

  const categoryStockArray = Object.values(categoryStock);

  // Create stock movement data (you might want to enhance this with actual movement data)
  const stockMovement = products.slice(0, 6).map((product, index) => ({
    product:
      product.name.length > 15
        ? product.name.substring(0, 15) + "..."
        : product.name,
    current: product.currentStock || 0,
    minimum: product.minStockLevel || 0,
    status:
      (product.currentStock || 0) <= (product.minStockLevel || 0)
        ? "Low"
        : "OK",
  }));

  // Calculate average turnover rate
  const totalCurrentStock = products.reduce(
    (sum, product) => sum + (product.currentStock || 0),
    0
  );
  const averageStockValue =
    totalCurrentStock > 0 ? stockValuation / totalCurrentStock : 0;

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
                {totalProducts}
              </p>
              <p className="text-sm text-gray-500">Products in inventory</p>
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
                {lowStockProducts.length}
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
                {formatCurrency(stockValuation)}
              </p>
              <p className="text-sm text-gray-500">Total inventory value</p>
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
                Average Stock Value
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(averageStockValue)}
              </p>
              <p className="text-sm text-gray-500">Per unit average</p>
            </div>
            <TrendingDown className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Stock Level Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Stock Levels vs Minimum Stock
          </h3>
        </div>
        <div className="h-80">
          {stockMovement.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="product"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#10B981" name="Current Stock" />
                <Bar dataKey="minimum" fill="#EF4444" name="Minimum Level" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No inventory data available
            </div>
          )}
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
            {categoryStockArray.length > 0 ? (
              categoryStockArray.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {category.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.products} products • {category.currentStock}{" "}
                      units
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(category.value)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No category data available
              </div>
            )}
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
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Category: {item.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {item.currentStock}/{item.minStockLevel}
                    </p>
                    <p className="text-xs text-red-500">Current/Min level</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-green-500">
                <Package className="w-12 h-12 mx-auto mb-2" />
                <p>All products are adequately stocked!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Inventory Summary */}
      {totalProducts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-gradient-to-r from-blue-50 to-green-50"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {totalProducts}
              </p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stockValuation)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {lowStockProducts.length}
              </p>
              <p className="text-sm text-gray-600">Low Stock Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {categoryStockArray.length}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card border-l-4 border-red-500 bg-red-50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">
              Action Required
            </h3>
          </div>
          <p className="text-red-700 mb-3">
            You have {lowStockProducts.length} product(s) below minimum stock
            levels. Consider reordering these items to avoid stockouts.
          </p>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              {lowStockProducts.length} Items Need Attention
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default InventoryReport;
