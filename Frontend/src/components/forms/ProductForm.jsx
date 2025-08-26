import React from "react";
import { Package, DollarSign, Hash, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useForm } from "../../hooks/useForm";
import { useNotification } from "../../context/NotificationContext";
import { required, positiveNumber } from "../../utils/validation";
import { PRODUCT_UNITS } from "../../utils/constants";

const ProductForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = "create", // 'create' or 'edit'
}) => {
  const { showSuccess, showError } = useNotification();

  const unitOptions = PRODUCT_UNITS.map((unit) => ({
    value: unit,
    label: unit,
  }));

  const categoryOptions = [
    { value: "Electronics", label: "Electronics" },
    { value: "Clothing", label: "Clothing" },
    { value: "Food & Beverages", label: "Food & Beverages" },
    { value: "Home & Garden", label: "Home & Garden" },
    { value: "Sports & Outdoors", label: "Sports & Outdoors" },
    { value: "Health & Beauty", label: "Health & Beauty" },
    { value: "Books & Media", label: "Books & Media" },
    { value: "Automotive", label: "Automotive" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Other", label: "Other" },
  ];

  const { values, errors, handleChange, handleBlur, handleSubmit, setValue } =
    useForm(
      {
        name: "",
        description: "",
        category: "",
        unit: "pieces",
        purchasePrice: "",
        sellingPrice: "",
        currentStock: "",
        minStockLevel: "10",
        location: "",
        expiryDate: "",
        ...initialData,
      },
      {
        name: [required],
        category: [required],
        unit: [required],
        purchasePrice: [required, positiveNumber],
        sellingPrice: [required, positiveNumber],
        currentStock: [required, positiveNumber],
        minStockLevel: [required, positiveNumber],
      }
    );

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      showSuccess(
        `Product ${mode === "create" ? "created" : "updated"} successfully!`
      );
    } catch (error) {
      showError(error.message || `Failed to ${mode} product`);
    }
  };

  const profitMargin =
    values.sellingPrice && values.purchasePrice
      ? (
          ((values.sellingPrice - values.purchasePrice) / values.sellingPrice) *
          100
        ).toFixed(1)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(handleFormSubmit);
            }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Product Name"
                  placeholder="Enter product name"
                  leftIcon={Package}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  required
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  value={values.category}
                  onChange={(value) => setValue("category", value)}
                  placeholder="Select category"
                  error={errors.category}
                />
              </div>

              <Textarea
                name="description"
                label="Description"
                placeholder="Describe your product..."
                rows={3}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Pricing & Unit
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="purchasePrice"
                  label="Purchase Price (LKR)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  leftIcon={DollarSign}
                  value={values.purchasePrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.purchasePrice}
                  required
                />

                <Input
                  name="sellingPrice"
                  label="Selling Price (LKR)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  leftIcon={DollarSign}
                  value={values.sellingPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sellingPrice}
                  required
                />

                <Select
                  label="Unit"
                  options={unitOptions}
                  value={values.unit}
                  onChange={(value) => setValue("unit", value)}
                  error={errors.unit}
                />
              </div>

              {profitMargin > 0 && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                  <p className="text-sm text-success-700">
                    <strong>Profit Margin: {profitMargin}%</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="currentStock"
                  label="Current Stock"
                  type="number"
                  placeholder="0"
                  leftIcon={Hash}
                  value={values.currentStock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.currentStock}
                  required
                />

                <Input
                  name="minStockLevel"
                  label="Minimum Stock Level"
                  type="number"
                  placeholder="10"
                  leftIcon={Hash}
                  value={values.minStockLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.minStockLevel}
                  helperText="Alert when stock falls below this level"
                  required
                />

                <Input
                  name="location"
                  label="Storage Location"
                  placeholder="Warehouse A, Shelf 1"
                  leftIcon={MapPin}
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.location}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                  leftIcon={Calendar}
                  value={values.expiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.expiryDate}
                  helperText="Leave blank if product doesn't expire"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {mode === "create" ? "Add Product" : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductForm;
