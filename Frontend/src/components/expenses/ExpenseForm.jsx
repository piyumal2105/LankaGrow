import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Receipt,
  DollarSign,
  Calendar,
  CreditCard,
  Building,
  Sparkles,
} from "lucide-react";
import { expenseService } from "../../services/expenseService";
import { validateAmount } from "../../utils/validators";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../../utils/constants";
import Button from "../common/Button";

function ExpenseForm({ expense, onClose, onSuccess }) {
  const isEditing = !!expense;
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: expense || {
      paymentMethod: "card",
      taxDeductible: false,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const watchDescription = watch("description");
  const watchAmount = watch("amount");

  useEffect(() => {
    if (expense) {
      reset(expense);
    }
  }, [expense, reset]);

  // Get AI category suggestion
  useEffect(() => {
    const getAISuggestion = async () => {
      if (watchDescription && watchAmount && !isEditing) {
        try {
          const response = await expenseService.categorizeExpense({
            description: watchDescription,
            amount: watchAmount,
          });
          setAiSuggestion(response.data);
        } catch (error) {
          console.error("AI categorization failed:", error);
        }
      }
    };

    const timeoutId = setTimeout(getAISuggestion, 1000);
    return () => clearTimeout(timeoutId);
  }, [watchDescription, watchAmount, isEditing]);

  // Fixed useMutation syntax for TanStack Query v5
  const createMutation = useMutation({
    mutationFn: expenseService.createExpense,
    onSuccess: () => {
      toast.success("Expense created successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create expense");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => expenseService.updateExpense(expense._id, data),
    onSuccess: () => {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update expense");
    },
  });

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const applyAISuggestion = () => {
    if (aiSuggestion) {
      setValue("category", aiSuggestion.category);
      setValue("subCategory", aiSuggestion.subcategory);
      setAiSuggestion(null);
    }
  };

  // Default categories if EXPENSE_CATEGORIES is not available
  const expenseCategories = EXPENSE_CATEGORIES || [
    "Office Supplies",
    "Travel",
    "Marketing",
    "Utilities",
    "Equipment",
    "Professional Services",
    "Inventory",
    "Maintenance",
    "Insurance",
    "Rent",
    "Salaries",
    "Other",
  ];

  // Default payment methods if PAYMENT_METHODS is not available
  const paymentMethods = PAYMENT_METHODS || [
    "card",
    "cash",
    "bank_transfer",
    "check",
    "digital_wallet",
    "other",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          <span>Expense Details</span>
        </h3>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            {...register("description", {
              required: "Description is required",
            })}
            type="text"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="Enter expense description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Amount and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rs
              </span>
              <input
                {...register("amount", {
                  required: "Amount is required",
                  validate: (value) =>
                    validateAmount
                      ? validateAmount(value) || "Invalid amount"
                      : value > 0 || "Amount must be greater than 0",
                })}
                type="number"
                step="0.01"
                min="0"
                className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? "border-red-500" : ""
                }`}
                placeholder="0.00"
              />
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <div className="relative">
              <input
                {...register("date", { required: "Date is required" })}
                type="date"
                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? "border-red-500" : ""
                }`}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-purple-800 mb-1">
                  AI Suggestion
                </h4>
                <p className="text-sm text-purple-700 mb-3">
                  Suggested category: <strong>{aiSuggestion.category}</strong>
                  {aiSuggestion.subcategory && ` > ${aiSuggestion.subcategory}`}
                  <br />
                  Confidence: {Math.round(aiSuggestion.confidence * 100)}%
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={applyAISuggestion}
                >
                  Apply Suggestion
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? "border-red-500" : ""
              }`}
            >
              <option value="">Select category</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category
            </label>
            <input
              {...register("subCategory")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter sub category"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <div className="relative">
            <select
              {...register("paymentMethod", {
                required: "Payment method is required",
              })}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paymentMethod ? "border-red-500" : ""
              }`}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor/Supplier
          </label>
          <div className="relative">
            <input
              {...register("vendor")}
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter vendor name"
            />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Additional notes about this expense"
          />
        </div>

        {/* Tax Deductible */}
        <div className="flex items-center">
          <input
            {...register("taxDeductible")}
            id="taxDeductible"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="taxDeductible"
            className="ml-2 block text-sm text-gray-900"
          >
            This expense is tax deductible
          </label>
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
        <Button
          type="submit"
          loading={createMutation.isPending || updateMutation.isPending}
          className="flex-1"
        >
          {isEditing ? "Update Expense" : "Create Expense"}
        </Button>
      </div>
    </form>
  );
}

export default ExpenseForm;
