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
  Eye,
  Calendar,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { customerService } from "../../services/customerService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";

function CustomerCard({ customer, onEdit, onRefresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries(["customers"]);
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

        {/* Actions - Always visible, no hover effect */}
        <div className="flex items-center justify-between space-x-2 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowViewDetails(true)}
              className="flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span className="text-xs">View</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(customer)}
              className="flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span className="text-xs">Edit</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* View Details Modal */}
      <Modal
        isOpen={showViewDetails}
        onClose={() => setShowViewDetails(false)}
        title="Customer Details"
        size="xl"
      >
        <CustomerDetailsView
          customer={customer}
          onEdit={() => {
            setShowViewDetails(false);
            onEdit(customer);
          }}
        />
      </Modal>

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
              loading={deleteMutation.isPending}
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

// Customer Details View Component
function CustomerDetailsView({ customer, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");
  const isVIPCustomer = customer.totalPurchases > 100000;
  const riskLevel = customer.aiInsights?.riskLevel || "low";

  const tabs = [
    { id: "overview", name: "Overview", icon: Eye },
    { id: "business", name: "Business Terms", icon: CreditCard },
    { id: "details", name: "Details", icon: User },
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
          {customer.customerType === "business" ? (
            <Building className="w-10 h-10 text-blue-600" />
          ) : (
            <User className="w-10 h-10 text-purple-600" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {customer.name}
          </h2>
          {customer.businessName && (
            <p className="text-gray-600 text-sm mb-1">
              {customer.businessName}
            </p>
          )}
          <p className="text-gray-500 text-sm mb-3">
            {customer.email || "No email address"}
          </p>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                customer.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {customer.status === "active" ? "Active" : "Inactive"}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {customer.customerType === "business" ? "Business" : "Individual"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                riskLevel
              )}`}
            >
              {riskLevel} risk
            </span>
            {isVIPCustomer && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>VIP Customer</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="h-96 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(customer.totalPurchases || 0)}
                </div>
                <div className="text-sm text-gray-500">Total Purchases</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {customer.loyaltyPoints || 0}
                </div>
                <div className="text-sm text-gray-500">Loyalty Points</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {customer.paymentTerms || 30}
                </div>
                <div className="text-sm text-gray-500">
                  Payment Terms (days)
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.email || "Not provided"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.phone || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.address?.street && customer.address?.city
                          ? `${customer.address.street}, ${customer.address.city}`
                          : customer.address?.city || "Not provided"}
                      </div>
                    </div>
                  </div>
                  {customer.customerType === "business" && customer.taxId && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax ID
                        </div>
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {customer.taxId}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {customer.aiInsights?.purchasePattern && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>AI Insights</span>
                </h3>
                <p className="text-gray-700">
                  {customer.aiInsights.purchasePattern}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "business" && (
          <div className="space-y-4">
            {/* Credit & Payment Terms */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Credit & Payment Terms
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Credit Limit
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(customer.creditLimit || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Payment Terms
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {customer.paymentTerms || 30} days
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase History Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Purchase History
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Purchases</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(customer.totalPurchases || 0)}
                  </span>
                </div>
                {customer.lastPurchase && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Last Purchase</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(customer.lastPurchase, "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Loyalty Points</span>
                  <span className="font-bold text-purple-600 text-lg">
                    {customer.loyaltyPoints || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {customer.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </div>
                  {customer.businessName && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Name
                      </label>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {customer.businessName}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Type
                    </label>
                    <div className="mt-1 text-sm font-medium text-gray-900 capitalize">
                      {customer.customerType}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  {customer.taxId && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tax ID / VAT
                      </label>
                      <div className="mt-1 text-sm font-medium text-gray-900 font-mono">
                        {customer.taxId}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Street Address
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {customer.address?.street || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {customer.address?.city || "Not provided"}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {customer.address?.province || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Postal Code
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {customer.address?.postalCode || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Record History */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Record History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.updatedAt
                        ? new Date(customer.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Customer</span>
        </button>
      </div>
    </div>
  );
}

export default CustomerCard;
