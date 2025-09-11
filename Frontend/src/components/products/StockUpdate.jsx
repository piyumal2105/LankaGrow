import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Minus, Package } from "lucide-react";
import { productService } from "../../services/productService";
import { validateAmount } from "../../utils/validators";
import Button from "../common/Button";

function StockUpdate({ product, onClose, onSuccess }) {
  const [updateType, setUpdateType] = useState("add");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      quantity: 1,
      type: "add",
    },
  });

  const watchQuantity = watch("quantity");

  const newStock =
    updateType === "add"
      ? product.currentStock + (parseInt(watchQuantity) || 0)
      : Math.max(0, product.currentStock - (parseInt(watchQuantity) || 0));

  const updateStockMutation = useMutation(
    (data) => productService.updateStock(product._id, data),
    {
      onSuccess: (response) => {
        if (response.data.aiSuggestion) {
          toast.success(
            `Stock updated! AI suggests reordering ${response.data.aiSuggestion.suggested_quantity} units.`,
            { duration: 6000 }
          );
        } else {
          toast.success("Stock updated successfully");
        }
        queryClient.invalidateQueries("products");
        queryClient.invalidateQueries("low-stock-products");
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update stock");
      },
    }
  );

  const onSubmit = (data) => {
    updateStockMutation.mutate({
      ...data,
      type: updateType,
    });
  };

  const isLowStock = newStock <= product.minStockLevel;
  const isOutOfStock = newStock === 0;

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">
              Current Stock: {product.currentStock} {product.unit}
            </p>
            <p className="text-sm text-gray-500">
              Min Level: {product.minStockLevel} {product.unit}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Update Type */}
        <div>
          <label className="label">Update Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUpdateType("add")}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                updateType === "add"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Add Stock</span>
            </button>
            <button
              type="button"
              onClick={() => setUpdateType("subtract")}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                updateType === "subtract"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Minus className="w-5 h-5" />
              <span>Remove Stock</span>
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="label">Quantity</label>
          <input
            {...register("quantity", {
              required: "Quantity is required",
              validate: (value) => {
                if (!validateAmount(value)) return "Invalid quantity";
                if (parseInt(value) <= 0)
                  return "Quantity must be greater than 0";
                if (
                  updateType === "subtract" &&
                  parseInt(value) > product.currentStock
                ) {
                  return "Cannot remove more stock than available";
                }
                return true;
              },
            })}
            type="number"
            min="1"
            className={`input ${errors.quantity ? "input-error" : ""}`}
            placeholder="Enter quantity"
          />
          {errors.quantity && (
            <p className="error-text">{errors.quantity.message}</p>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current Stock:</span>
            <span className="font-medium">
              {product.currentStock} {product.unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {updateType === "add" ? "Adding:" : "Removing:"}
            </span>
            <span
              className={`font-medium ${
                updateType === "add" ? "text-green-600" : "text-red-600"
              }`}
            >
              {updateType === "add" ? "+" : "-"}
              {watchQuantity || 0} {product.unit}
            </span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium">New Stock:</span>
              <span
                className={`font-bold text-lg ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {newStock} {product.unit}
              </span>
            </div>
          </div>

          {/* Stock warnings */}
          {isOutOfStock && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ⚠️ This will result in zero stock!
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
              ⚠️ This will result in low stock (below minimum level)
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="flex-1"
            variant={updateType === "add" ? "success" : "warning"}
          >
            {updateType === "add" ? "Add Stock" : "Remove Stock"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StockUpdate;
