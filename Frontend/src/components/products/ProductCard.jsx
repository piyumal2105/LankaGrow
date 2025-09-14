import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Eye,
  Plus,
  Minus,
  MapPin,
  Tag,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";
import StockUpdate from "./StockUpdate";

function ProductCard({ product, onEdit, onRefresh }) {
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const queryClient = useQueryClient();

  // Fixed TanStack Query v5 syntax
  const deleteMutation = useMutation({
    mutationFn: (productId) => productService.deleteProduct(productId),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      // Fixed invalidateQueries syntax for v5
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-products"] });
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(product._id);
    setShowDeleteConfirm(false);
  };

  const isLowStock = product.currentStock <= product.minStockLevel;
  const profitMargin =
    ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) *
    100;

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="card group relative overflow-hidden"
      >
        {/* Stock status indicator */}
        {isLowStock && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Low Stock</span>
            </div>
          </div>
        )}

        {/* Product image placeholder */}
        <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Package className="w-16 h-16 text-gray-300" />
          )}
        </div>

        {/* Product info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(product.sellingPrice)}
            </span>
            <span className="text-sm text-green-600 font-medium">
              {profitMargin.toFixed(1)}% margin
            </span>
          </div>

          {/* Stock info */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              <span className="text-gray-500">Stock: </span>
              <span
                className={`font-medium ${
                  isLowStock ? "text-red-600" : "text-gray-900"
                }`}
              >
                {product.currentStock} {product.unit}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowStockUpdate(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Add Stock"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowStockUpdate(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Remove Stock"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category and status */}
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-gray text-xs">{product.category}</span>
            <span
              className={`badge text-xs ${
                product.status === "active" ? "badge-success" : "badge-gray"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        {/* Actions - Single horizontal line */}
        <div className="flex items-center justify-between space-x-2 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowViewDetails(true)}
              className="flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span className="text-xs">View</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span className="text-xs">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStockUpdate(true)}
              className="flex items-center space-x-1"
            >
              <Package className="w-4 h-4" />
              <span className="text-xs">Stock</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* View Details Modal */}
      <Modal
        isOpen={showViewDetails}
        onClose={() => setShowViewDetails(false)}
        title="Product Details"
        size="xl"
      >
        <ProductDetailsView
          product={product}
          onEdit={() => {
            setShowViewDetails(false);
            onEdit(product);
          }}
        />
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showStockUpdate}
        onClose={() => setShowStockUpdate(false)}
        title="Update Stock"
        size="sm"
      >
        <StockUpdate
          product={product}
          onClose={() => setShowStockUpdate(false)}
          onSuccess={() => {
            setShowStockUpdate(false);
            onRefresh();
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete {product.name}?
          </h3>
          <p className="text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete the
            product and all associated data.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Product Details View Component
function ProductDetailsView({ product, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");
  const profitMargin =
    ((product.sellingPrice - product.purchasePrice) / product.sellingPrice) *
    100;
  const isLowStock = product.currentStock <= product.minStockLevel;
  const totalValue = product.currentStock * product.purchasePrice;

  const tabs = [
    { id: "overview", name: "Overview", icon: Eye },
    { id: "inventory", name: "Stock & Pricing", icon: BarChart3 },
    { id: "details", name: "Details", icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Package className="w-10 h-10 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm mb-3">
            {product.description || "No description available"}
          </p>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.status === "active" ? "Available" : "Unavailable"}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {product.category}
            </span>
            {isLowStock && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Running Low</span>
              </span>
            )}
          </div>
        </div>
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

      {/* Tab Content */}
      <div className="h-96 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(product.sellingPrice)}
                </div>
                <div className="text-sm text-gray-500">Price</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div
                  className={`text-2xl font-bold ${
                    isLowStock ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {product.currentStock}
                </div>
                <div className="text-sm text-gray-500">In Stock</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profitMargin.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Profit</div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Code</span>
                    <span className="font-medium font-mono text-sm">
                      {product.sku}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">
                      {product.brand || "No brand"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit Type</span>
                    <span className="font-medium capitalize">
                      {product.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">
                      {product.location || "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-4">
            {/* Stock Status - Compact Layout */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Stock Status</h3>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      isLowStock ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {product.currentStock}
                  </div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-700 mb-1">
                    {product.minStockLevel}
                  </div>
                  <div className="text-xs text-gray-500">Minimum</div>
                </div>

                <div className="text-center">
                  <div
                    className={`text-xl font-semibold mb-1 ${
                      isLowStock ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isLowStock ? "Low" : "Good"}
                  </div>
                  <div className="text-xs text-gray-500">Status</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600 mb-1">
                    {formatCurrency(totalValue)}
                  </div>
                  <div className="text-xs text-gray-500">Total Value</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Stock Level</span>
                  <span>
                    {product.currentStock} / {product.minStockLevel * 2}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isLowStock ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (product.currentStock / (product.minStockLevel * 2)) *
                          100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown - Compact Layout */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Pricing Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">
                    Cost Price (per unit)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(product.purchasePrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">
                    Selling Price (per unit)
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(product.sellingPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">
                    Profit (per unit)
                  </span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(
                      product.sellingPrice - product.purchasePrice
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Profit Margin</span>
                  <span className="font-bold text-purple-600 text-lg">
                    {profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            {/* Technical Details - Compact Layout */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Technical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Code
                    </label>
                    <div className="mt-1 font-mono text-sm font-semibold text-gray-900 bg-gray-50 p-2 rounded">
                      {product.sku}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {product.brand || "Not specified"}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </label>
                    <div className="mt-1 text-sm text-gray-900 capitalize">
                      {product.unit}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {product.location || "Not specified"}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status === "active"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {product.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps - Compact Layout */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Record History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Product</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
