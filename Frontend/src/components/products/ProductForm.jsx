import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Sparkles, Package, DollarSign, Hash } from "lucide-react";
import { productService } from "../../services/productService";
import { generateSKU } from "../../utils/helpers";
import { validateAmount, validateSKU } from "../../utils/validators";
import Button from "../common/Button";

function ProductForm({ product, onClose, onSuccess }) {
  const isEditing = !!product;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: product || {
      status: "active",
      unit: "pieces",
      minStockLevel: 10,
      currentStock: 0,
    },
  });

  const watchSellingPrice = watch("sellingPrice");
  const watchPurchasePrice = watch("purchasePrice");

  // Calculate profit margin
  const profitMargin =
    watchSellingPrice && watchPurchasePrice
      ? ((watchSellingPrice - watchPurchasePrice) / watchSellingPrice) * 100
      : 0;

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const createMutation = useMutation(productService.createProduct, {
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries("products");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation(
    (data) => productService.updateProduct(product._id, data),
    {
      onSuccess: () => {
        toast.success("Product updated successfully");
        queryClient.invalidateQueries("products");
        onSuccess();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to update product"
        );
      },
    }
  );

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleGenerateSKU = () => {
    setValue("sku", generateSKU());
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverage",
    "Books",
    "Home & Garden",
    "Sports",
    "Automotive",
    "Health & Beauty",
    "Office Supplies",
    "Toys & Games",
    "Other",
  ];

  const units = [
    "pieces",
    "kg",
    "grams",
    "liters",
    "ml",
    "meters",
    "cm",
    "boxes",
    "packs",
    "pairs",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <Package className="w-5 h-5 text-blue-600" />
          <span>Basic Information</span>
        </h3>

        {/* Product Name */}
        <div>
          <label className="label">Product Name *</label>
          <input
            {...register("name", { required: "Product name is required" })}
            type="text"
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input resize-none"
            placeholder="Enter product description"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="label">SKU *</label>
          <div className="flex space-x-2">
            <input
              {...register("sku", {
                required: "SKU is required",
                validate: (value) => validateSKU(value) || "Invalid SKU format",
              })}
              type="text"
              className={`input flex-1 ${errors.sku ? "input-error" : ""}`}
              placeholder="SKU-XXXX-XXXX"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleGenerateSKU}
              className="whitespace-nowrap"
            >
              <Hash className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>
          {errors.sku && <p className="error-text">{errors.sku.message}</p>}
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`input ${errors.category ? "input-error" : ""}`}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="error-text">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="label">Brand</label>
            <input
              {...register("brand")}
              type="text"
              className="input"
              placeholder="Enter brand name"
            />
          </div>
        </div>

        {/* Unit */}
        <div>
          <label className="label">Unit *</label>
          <select
            {...register("unit", { required: "Unit is required" })}
            className={`input ${errors.unit ? "input-error" : ""}`}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && <p className="error-text">{errors.unit.message}</p>}
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>Pricing</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label className="label">Purchase Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rs
              </span>
              <input
                {...register("purchasePrice", {
                  required: "Purchase price is required",
                  validate: (value) =>
                    validateAmount(value) || "Invalid amount",
                })}
                type="number"
                step="0.01"
                min="0"
                className={`input pl-10 ${
                  errors.purchasePrice ? "input-error" : ""
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.purchasePrice && (
              <p className="error-text">{errors.purchasePrice.message}</p>
            )}
          </div>

          {/* Selling Price */}
          <div>
            <label className="label">Selling Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rs
              </span>
              <input
                {...register("sellingPrice", {
                  required: "Selling price is required",
                  validate: (value) =>
                    validateAmount(value) || "Invalid amount",
                })}
                type="number"
                step="0.01"
                min="0"
                className={`input pl-10 ${
                  errors.sellingPrice ? "input-error" : ""
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.sellingPrice && (
              <p className="error-text">{errors.sellingPrice.message}</p>
            )}
          </div>
        </div>

        {/* Profit Margin Display */}
        {watchSellingPrice && watchPurchasePrice && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">
                Profit Margin
              </span>
              <span className="text-lg font-bold text-green-800">
                {profitMargin.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Profit: Rs {(watchSellingPrice - watchPurchasePrice).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <Package className="w-5 h-5 text-purple-600" />
          <span>Inventory</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Stock */}
          <div>
            <label className="label">Current Stock</label>
            <input
              {...register("currentStock", {
                validate: (value) => validateAmount(value) || "Invalid amount",
              })}
              type="number"
              min="0"
              className={`input ${errors.currentStock ? "input-error" : ""}`}
              placeholder="0"
            />
            {errors.currentStock && (
              <p className="error-text">{errors.currentStock.message}</p>
            )}
          </div>

          {/* Minimum Stock Level */}
          <div>
            <label className="label">Minimum Stock Level *</label>
            <input
              {...register("minStockLevel", {
                required: "Minimum stock level is required",
                validate: (value) => validateAmount(value) || "Invalid amount",
              })}
              type="number"
              min="0"
              className={`input ${errors.minStockLevel ? "input-error" : ""}`}
              placeholder="10"
            />
            {errors.minStockLevel && (
              <p className="error-text">{errors.minStockLevel.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="label">Storage Location</label>
          <input
            {...register("location")}
            type="text"
            className="input"
            placeholder="e.g., Warehouse A, Shelf B-1"
          />
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select {...register("status")} className="input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* AI Enhancement Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-purple-800">
              AI Enhancement
            </h4>
            <p className="text-sm text-purple-600 mt-1">
              Our AI will automatically generate relevant tags, suggest optimal
              pricing based on market data, and provide reorder recommendations
              once this product is saved.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
