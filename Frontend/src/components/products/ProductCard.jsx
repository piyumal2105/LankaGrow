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
} from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";
import StockUpdate from "./StockUpdate";

function ProductCard({ product, onEdit, onRefresh }) {
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(productService.deleteProduct, {
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries("products");
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
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowStockUpdate(true)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
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

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStockUpdate(true)}
            className="flex-1"
          >
            <Package className="w-4 h-4 mr-1" />
            Stock
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

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
              loading={deleteMutation.isLoading}
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

export default ProductCard;
