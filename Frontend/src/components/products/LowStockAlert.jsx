import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function LowStockAlert({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Low Stock Alert
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            {products.length} product{products.length > 1 ? "s" : ""} running
            low on stock
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {products.slice(0, 3).map((product) => (
              <div
                key={product._id}
                className="inline-flex items-center space-x-2 bg-white rounded-lg px-3 py-1 border border-yellow-200"
              >
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  {product.name}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.currentStock} left)
                </span>
              </div>
            ))}
            {products.length > 3 && (
              <div className="inline-flex items-center space-x-1 text-sm text-yellow-700">
                <span>+{products.length - 3} more</span>
              </div>
            )}
          </div>
          <Link
            to="/products?filter=low-stock"
            className="inline-flex items-center space-x-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
          >
            <span>View all low stock products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default LowStockAlert;
