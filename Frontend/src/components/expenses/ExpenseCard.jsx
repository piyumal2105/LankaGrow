import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Receipt,
  Calendar,
  CreditCard,
  Building,
  Sparkles,
  Eye,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { expenseService } from "../../services/expenseService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";

function ExpenseCard({ expense, onEdit, onRefresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(expenseService.deleteExpense, {
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries("expenses");
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(expense._id);
    setShowDeleteConfirm(false);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return "💵";
      case "card":
        return "💳";
      case "bank_transfer":
        return "🏦";
      case "cheque":
        return "📄";
      default:
        return "💰";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Office Supplies": "bg-blue-100 text-blue-800",
      Travel: "bg-green-100 text-green-800",
      Marketing: "bg-purple-100 text-purple-800",
      Utilities: "bg-yellow-100 text-yellow-800",
      Equipment: "bg-red-100 text-red-800",
      "Professional Services": "bg-indigo-100 text-indigo-800",
      Inventory: "bg-pink-100 text-pink-800",
      Maintenance: "bg-orange-100 text-orange-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="card group relative overflow-hidden"
      >
        {/* AI Badge */}
        {expense.aiCategory && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>AI {Math.round(expense.aiConfidence * 100)}%</span>
            </div>
          </div>
        )}

        {/* Expense Icon */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {expense.description}
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(expense.amount)}
            </p>
          </div>
        </div>

        {/* Expense Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span
              className={`badge text-xs ${getCategoryColor(expense.category)}`}
            >
              {expense.category}
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>{getPaymentMethodIcon(expense.paymentMethod)}</span>
              <span className="capitalize">
                {expense.paymentMethod.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(expense.date, "MMM d, yyyy")}</span>
          </div>

          {expense.vendor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span className="truncate">{expense.vendor}</span>
            </div>
          )}

          {expense.taxDeductible && (
            <div className="inline-flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <span>Tax Deductible</span>
            </div>
          )}
        </div>

        {/* Receipt Preview */}
        {expense.receipt && (
          <div className="mb-4">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">View Receipt</span>
            </button>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`badge text-xs ${
              expense.status === "approved"
                ? "badge-success"
                : expense.status === "rejected"
                ? "badge-error"
                : "badge-warning"
            }`}
          >
            {expense.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(expense)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Expense"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete this expense?
          </h3>
          <p className="text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete the
            expense record.
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

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Receipt"
        size="md"
      >
        <div className="text-center">
          {expense.receipt ? (
            <img
              src={expense.receipt}
              alt="Receipt"
              className="max-w-full h-auto rounded-lg"
            />
          ) : (
            <div className="py-8">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No receipt available</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default ExpenseCard;
