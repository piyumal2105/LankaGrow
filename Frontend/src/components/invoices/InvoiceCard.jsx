import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  FileText,
  Send,
  CheckCircle,
  Download,
  Copy,
  Calendar,
  User,
  DollarSign,
  Clock,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { invoiceService } from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";

function InvoiceCard({ invoice, onEdit, onRefresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(invoiceService.deleteInvoice, {
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      queryClient.invalidateQueries("invoices");
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    },
  });

  const sendMutation = useMutation(invoiceService.sendInvoice, {
    onSuccess: () => {
      toast.success("Invoice sent successfully");
      queryClient.invalidateQueries("invoices");
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send invoice");
    },
  });

  const markPaidMutation = useMutation(invoiceService.markAsPaid, {
    onSuccess: () => {
      toast.success("Invoice marked as paid");
      queryClient.invalidateQueries("invoices");
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to mark as paid");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(invoice._id);
    setShowDeleteConfirm(false);
  };

  const handleSend = () => {
    sendMutation.mutate(invoice._id);
  };

  const handleMarkPaid = () => {
    markPaidMutation.mutate(invoice._id);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await invoiceService.generatePDF(invoice._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "text-gray-600 bg-gray-100";
      case "sent":
        return "text-blue-600 bg-blue-100";
      case "paid":
        return "text-green-600 bg-green-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft":
        return Clock;
      case "sent":
        return Send;
      case "paid":
        return CheckCircle;
      case "overdue":
        return Calendar;
      case "cancelled":
        return Trash2;
      default:
        return FileText;
    }
  };

  const StatusIcon = getStatusIcon(invoice.status);
  const isOverdue =
    invoice.status === "overdue" ||
    (invoice.status === "sent" && new Date(invoice.dueDate) < new Date());

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className={`card group relative overflow-hidden border-l-4 ${
          isOverdue
            ? "border-l-red-500"
            : invoice.status === "paid"
            ? "border-l-green-500"
            : "border-l-blue-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Invoice Icon */}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isOverdue
                  ? "bg-red-100 text-red-600"
                  : invoice.status === "paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <StatusIcon className="w-6 h-6" />
            </div>

            {/* Invoice Info */}
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-semibold text-gray-900">
                  #{invoice.invoiceNumber}
                </h3>
                <span
                  className={`badge text-xs ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{invoice.customer?.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(invoice.dueDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(invoice.totalAmount)}
            </p>
            <p className="text-sm text-gray-500">
              {invoice.items?.length || 0} item
              {(invoice.items?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(invoice)}
              disabled={invoice.status === "paid"}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigator.clipboard.writeText(
                  `Invoice #${invoice.invoiceNumber} - ${formatCurrency(
                    invoice.totalAmount
                  )}`
                )
              }
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.status === "draft" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSend}
                loading={sendMutation.isLoading}
              >
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            )}
            {(invoice.status === "sent" || invoice.status === "overdue") && (
              <Button
                variant="success"
                size="sm"
                onClick={handleMarkPaid}
                loading={markPaidMutation.isLoading}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Paid
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Invoice"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Invoice #{invoice.invoiceNumber}?
          </h3>
          <p className="text-gray-500 mb-6">
            This action cannot be undone. This will permanently delete the
            invoice and restore the inventory.
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

export default InvoiceCard;
