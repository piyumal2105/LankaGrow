import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { customerService } from "../../services/customerService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";

function CustomerCard({ customer, onEdit, onRefresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(customerService.deleteCustomer, {
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries("customers");
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(customer._id);
    setShowDeleteConfirm(false);
  };

  const isVIPCustomer = customer.totalPurchases > 100000; // Rs 100,000+
  const riskLevel = customer.aiInsights?.riskLevel || "low";

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="card group relative overflow-hidden"
      >
        {/* VIP Badge */}
        {isVIPCustomer && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>VIP</span>
            </div>
          </div>
        )}

        {/* Customer Avatar */}
        <div className="flex items-center space-x-4 mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              customer.customerType === "business"
                ? "bg-blue-100 text-blue-600"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            {customer.customerType === "business" ? (
              <Building className="w-8 h-8" />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {customer.name}
            </h3>
            {customer.businessName && (
              <p className="text-sm text-gray-500 truncate">
                {customer.businessName}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`badge text-xs ${
                  customer.customerType === "business"
                    ? "badge-primary"
                    : "badge-gray"
                }`}
              >
                {customer.customerType}
              </span>
              <span className={`badge text-xs ${getRiskColor(riskLevel)}`}>
                {riskLevel} risk
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {customer.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.address?.city && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{customer.address.city}</span>
            </div>
          )}
        </div>

        {/* Purchase Stats */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Purchases</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(customer.totalPurchases || 0)}
            </span>
          </div>
          {customer.lastPurchase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Last Purchase</span>
              <span className="text-sm text-gray-700">
                {formatDate(customer.lastPurchase, "MMM d, yyyy")}
              </span>
            </div>
          )}
          {customer.loyaltyPoints > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Loyalty Points</span>
              <span className="text-sm font-medium text-purple-600">
                {customer.loyaltyPoints}
              </span>
            </div>
          )}
        </div>

        {/* AI Insights Preview */}
        {customer.aiInsights?.purchasePattern && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-purple-800 mb-1">
                  AI Insight
                </h4>
                <p className="text-xs text-purple-700">
                  {customer.aiInsights.purchasePattern}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(customer)}
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
        title="Delete Customer"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete {customer.name}?
          </h3>
          <p className="text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete the
            customer and all associated invoices.
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

export default CustomerCard;
