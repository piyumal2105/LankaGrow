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
import Button from "../common/Button";
import Modal from "../common/Modal";

function ExpenseCard({ expense, onEdit, onRefresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const queryClient = useQueryClient();

  // Fixed useMutation syntax for TanStack Query v5
  const deleteMutation = useMutation({
    mutationFn: (expenseId) => expenseService.deleteExpense(expenseId),
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
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

  const formatCurrency = (amount) => {
    return `Rs ${amount?.toLocaleString() || "0.00"}`;
  };

  const formatDate = (dateString, format = "MMM d, yyyy") => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
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
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                expense.category
              )}`}
            >
              {expense.category}
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>{getPaymentMethodIcon(expense.paymentMethod)}</span>
              <span className="capitalize">
                {expense.paymentMethod?.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(expense.date)}</span>
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
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              expense.status === "approved"
                ? "bg-green-100 text-green-800"
                : expense.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {expense.status}
          </span>
        </div>

        {/* Actions - ALWAYS VISIBLE (removed hover) */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailsModal(true)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
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

      {/* Simple Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Expense Details"
        size="lg"
      >
        <div className="space-y-4">
          <div className="text-center border-b pb-4 mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {expense.description}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(expense.amount)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Date
              </label>
              <p className="mt-1">{formatDate(expense.date)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Category
              </label>
              <p className="mt-1">{expense.category}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Payment Method
              </label>
              <p className="mt-1 capitalize">
                {expense.paymentMethod?.replace("_", " ")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="mt-1 capitalize">{expense.status}</p>
            </div>
            {expense.vendor && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Vendor
                </label>
                <p className="mt-1">{expense.vendor}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Tax Deductible
              </label>
              <p className="mt-1">{expense.taxDeductible ? "Yes" : "No"}</p>
            </div>
          </div>

          {expense.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Notes
              </label>
              <p className="mt-1 bg-gray-50 p-3 rounded">{expense.notes}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowDetailsModal(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowDetailsModal(false);
                onEdit(expense);
              }}
              className="flex-1"
            >
              Edit
            </Button>
          </div>
        </div>
      </Modal>

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
              loading={deleteMutation.isPending}
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
