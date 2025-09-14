import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Sparkles,
  Package,
  DollarSign,
  Hash,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { productService } from "../../services/productService";
import { generateSKU } from "../../utils/helpers";
import { validateAmount, validateSKU } from "../../utils/validators";
import Button from "../common/Button";

function ProductForm({ product, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const isEditing = !!product;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
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

  // TanStack Query mutations
  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => productService.updateProduct(product._id, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });

  const handleGenerateSKU = () => {
    setValue("sku", generateSKU());
  };

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      icon: Package,
      fields: ["name", "description", "sku", "category", "brand", "unit"],
    },
    {
      id: 2,
      title: "Pricing",
      icon: DollarSign,
      fields: ["purchasePrice", "sellingPrice"],
    },
    {
      id: 3,
      title: "Inventory",
      icon: Package,
      fields: ["currentStock", "minStockLevel", "location", "status"],
    },
  ];

  const validateStep = async (stepNumber) => {
    const stepFields = steps[stepNumber - 1].fields;
    const result = await trigger(stepFields);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle the final submit button click
  const handleFinalSubmit = () => {
    handleSubmit(onSubmit)();
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="label">Product Name *</label>
              <input
                {...register("name", { required: "Product name is required" })}
                type="text"
                className={`input ${errors.name ? "input-error" : ""}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="error-text">{errors.name.message}</p>
              )}
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
                    validate: (value) =>
                      validateSKU(value) || "Invalid SKU format",
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
                  {...register("category", {
                    required: "Category is required",
                  })}
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
              {errors.unit && (
                <p className="error-text">{errors.unit.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Profit Margin
                  </span>
                  <span className="text-lg font-bold text-green-800">
                    {profitMargin.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Profit: Rs{" "}
                  {(watchSellingPrice - watchPurchasePrice).toFixed(2)}
                </p>
              </div>
            )}

            {/* Pricing Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Pricing Tips
                  </h4>
                  <ul className="text-sm text-blue-600 mt-1 space-y-1">
                    <li>
                      • Ensure selling price covers costs and desired margin
                    </li>
                    <li>• Consider competitor pricing in your market</li>
                    <li>• Factor in overhead costs and business expenses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Stock */}
              <div>
                <label className="label">Current Stock</label>
                <input
                  {...register("currentStock", {
                    validate: (value) =>
                      validateAmount(value) || "Invalid amount",
                  })}
                  type="number"
                  min="0"
                  className={`input ${
                    errors.currentStock ? "input-error" : ""
                  }`}
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
                    validate: (value) =>
                      validateAmount(value) || "Invalid amount",
                  })}
                  type="number"
                  min="0"
                  className={`input ${
                    errors.minStockLevel ? "input-error" : ""
                  }`}
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

            {/* AI Enhancement Notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-purple-800">
                    AI Enhancement
                  </h4>
                  <p className="text-sm text-purple-600 mt-1">
                    Our AI will automatically generate relevant tags, suggest
                    optimal pricing based on market data, and provide reorder
                    recommendations once this product is saved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    Step {step.id}
                  </p>
                  <p
                    className={`text-xs ${
                      isCurrent ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden md:block w-20 h-0.5 mx-4 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, {
              className: "w-5 h-5 text-blue-600",
            })}
            <span>{steps[currentStep - 1].title}</span>
          </h3>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
          )}
        </div>

        <div className="flex space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              className="flex items-center space-x-2"
            >
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
