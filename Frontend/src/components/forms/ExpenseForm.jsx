import React, { useState } from "react";
import {
  Receipt,
  Calendar,
  DollarSign,
  Tag,
  Upload,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useForm } from "../../hooks/useForm";
import { useNotification } from "../../context/NotificationContext";
import { expensesAPI } from "../../services/expenses";
import { required, positiveNumber } from "../../utils/validation";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../../utils/constants";

const ExpenseForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  mode = "create",
}) => {
  const { showSuccess, showError } = useNotification();
  const [aiCategorizing, setAiCategorizing] = useState(false);

  const categoryOptions = EXPENSE_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const { values, errors, handleChange, handleBlur, handleSubmit, setValue } =
    useForm(
      {
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        vendor: "",
        notes: "",
        taxDeductible: false,
        ...initialData,
      },
      {
        description: [required],
        amount: [required, positiveNumber],
        category: [required],
        date: [required],
        paymentMethod: [required],
      }
    );

  const handleAICategorize = async () => {
    if (!values.description || !values.amount) {
      showError("Please enter description and amount first");
      return;
    }

    setAiCategorizing(true);
    try {
      const response = await expensesAPI.categorize({
        description: values.description,
        amount: values.amount,
      });

      if (response.data.success) {
        setValue("category", response.data.data.category);
        showSuccess(`AI suggested category: ${response.data.data.category}`);
      }
    } catch (error) {
      showError("AI categorization failed");
    } finally {
      setAiCategorizing(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      showSuccess(
        `Expense ${mode === "create" ? "created" : "updated"} successfully!`
      );
    } catch (error) {
      showError(error.message || `Failed to ${mode} expense`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Receipt className="h-6 w-6 text-primary-600" />
            {mode === "create" ? "Add New Expense" : "Edit Expense"}
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
                Expense Details
              </h3>

              <Input
                name="description"
                label="Description"
                placeholder="Office supplies, travel expense, etc."
                leftIcon={Tag}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="amount"
                  label="Amount (LKR)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  leftIcon={DollarSign}
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.amount}
                  required
                />

                <Input
                  name="date"
                  label="Date"
                  type="date"
                  leftIcon={Calendar}
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.date}
                  required
                />
              </div>
            </div>

            {/* Category with AI */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Category
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAICategorize}
                  loading={aiCategorizing}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  AI Categorize
                </Button>
              </div>

              <Select
                label="Category"
                options={categoryOptions}
                value={values.category}
                onChange={(value) => setValue("category", value)}
                placeholder="Select or let AI categorize"
                error={errors.category}
              />
            </div>

            {/* Payment & Vendor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Payment Method"
                  options={PAYMENT_METHODS}
                  value={values.paymentMethod}
                  onChange={(value) => setValue("paymentMethod", value)}
                  error={errors.paymentMethod}
                />

                <Input
                  name="vendor"
                  label="Vendor/Supplier"
                  placeholder="Company or person paid to"
                  value={values.vendor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.vendor}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h3>

              <Textarea
                name="notes"
                label="Notes"
                placeholder="Additional details about this expense..."
                rows={3}
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.notes}
              />

              <div className="flex items-center">
                <input
                  id="taxDeductible"
                  name="taxDeductible"
                  type="checkbox"
                  checked={values.taxDeductible}
                  onChange={(e) => setValue("taxDeductible", e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="taxDeductible"
                  className="ml-2 block text-sm text-gray-900"
                >
                  This expense is tax deductible
                </label>
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Receipt</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload receipt image</p>
                <Button type="button" variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {mode === "create" ? "Add Expense" : "Update Expense"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpenseForm;
