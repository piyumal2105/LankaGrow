import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { Package, AlertCircle } from "lucide-react";

function ProductList({ products, isLoading, onEdit, onRefresh }) {
  // Debug logging to help identify the issue
  console.log("ProductList received products:", products);
  console.log("Type of products:", typeof products);
  console.log("Is products an array?", Array.isArray(products));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Handle case where products is not an array
  if (!products || !Array.isArray(products)) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Data Error</h3>
        <p className="text-gray-500 mb-6">
          Unable to load products. The data format is incorrect.
        </p>
        <p className="text-sm text-gray-400 mb-4">
          Expected: Array, Received: {typeof products}
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by adding your first product to the inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product._id || product.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProductCard
            product={product}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default ProductList;
