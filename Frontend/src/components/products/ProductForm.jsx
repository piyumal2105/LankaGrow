import React, { useState } from "react";
import { X, Brain, Barcode } from "lucide-react";
import api from "../../services/api";

const ProductForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    barcode: "",
    category: "",
    subCategory: "",
    brand: "",
    unit: "",
    purchasePrice: "",
    sellingPrice: "",
    minStockLevel: "",
    currentStock: "",
    location: "",
    expiryDate: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profitMargin, setProfitMargin] = useState(0);

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Books & Media",
    "Home & Garden",
    "Health & Beauty",
    "Sports & Fitness",
    "Automotive",
    "Office Supplies",
    "Toys & Games",
  ];

  const units = [
    { value: "pieces", label: "Pieces" },
    { value: "kg", label: "Kilograms" },
    { value: "liters", label: "Liters" },
    { value: "meters", label: "Meters" },
    { value: "boxes", label: "Boxes" },
    { value: "packs", label: "Packs" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        currentStock: parseInt(formData.currentStock),
        minStockLevel: parseInt(formData.minStockLevel),
        profitMargin: profitMargin,
      };

      await api.createProduct(productData);
      onSuccess();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProfitMargin = (selling, purchase) => {
    if (selling && purchase && selling > 0) {
      const margin = ((selling - purchase) / selling) * 100;
      setProfitMargin(margin);
      return margin;
    }
    setProfitMargin(0);
    return 0;
  };

  const handlePriceChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (field === "sellingPrice") {
      calculateProfitMargin(
        parseFloat(value),
        parseFloat(formData.purchasePrice)
      );
    } else if (field === "purchasePrice") {
      calculateProfitMargin(
        parseFloat(formData.sellingPrice),
        parseFloat(value)
      );
    }
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    const sku = `SKU-${timestamp}-${randomStr}`.toUpperCase();
    setFormData({ ...formData, sku });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Add New Product</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the product features and specifications"
                />
              </div>
            </div>

            {/* Product Identification */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Product Identification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      SKU *
                    </label>
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Generate SKU
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Enter SKU or generate one"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      placeholder="Enter barcode number"
                    />
                    <Barcode
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Categorization
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subCategory: e.target.value })
                    }
                    placeholder="Enter sub-category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Pricing Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      handlePriceChange("purchasePrice", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      handlePriceChange("sellingPrice", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profit Margin
                  </label>
                  <div className="flex items-center">
                    <div
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center font-medium ${
                        profitMargin > 30
                          ? "text-green-600"
                          : profitMargin > 15
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {profitMargin.toFixed(1)}%
                    </div>
                    <Brain className="ml-2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>
              {profitMargin > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Profit per unit: LKR{" "}
                  {(
                    parseFloat(formData.sellingPrice || 0) -
                    parseFloat(formData.purchasePrice || 0)
                  ).toFixed(2)}
                </div>
              )}
            </div>

            {/* Inventory */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Inventory Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.currentStock}
                    onChange={(e) =>
                      setFormData({ ...formData, currentStock: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Stock Level *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.minStockLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minStockLevel: e.target.value,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Warehouse A, Shelf 1"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Additional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any additional notes about this product"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
