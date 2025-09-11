import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Send,
  CheckCircle,
  Edit,
  X,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Printer,
  Copy,
  ArrowLeft,
  DollarSign,
} from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { invoiceService } from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";

function InvoicePreview({ invoice, onClose, onEdit }) {
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showMarkPaidConfirm, setShowMarkPaidConfirm] = useState(false);
  const queryClient = useQueryClient();

  const sendMutation = useMutation(invoiceService.sendInvoice, {
    onSuccess: () => {
      toast.success("Invoice sent successfully");
      queryClient.invalidateQueries("invoices");
      setShowSendConfirm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send invoice");
    },
  });

  const markPaidMutation = useMutation(invoiceService.markAsPaid, {
    onSuccess: () => {
      toast.success("Invoice marked as paid");
      queryClient.invalidateQueries("invoices");
      setShowMarkPaidConfirm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to mark as paid");
    },
  });

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
      toast.success("Invoice PDF downloaded");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/invoices/${invoice._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Invoice link copied to clipboard");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue =
    new Date(invoice.dueDate) < new Date() && invoice.status !== "paid";
  const subtotal =
    invoice.items?.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice - (item.discount || 0));
    }, 0) || 0;
  const taxAmount = subtotal * ((invoice.taxRate || 0) / 100);
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header Actions */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              invoice.status
            )}`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {invoice.status === "draft" && (
            <Button
              onClick={onEdit}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}

          {(invoice.status === "draft" || invoice.status === "sent") && (
            <Button
              onClick={() => setShowSendConfirm(true)}
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
              loading={sendMutation.isLoading}
            >
              <Send className="w-4 h-4" />
              <span>{invoice.status === "draft" ? "Send" : "Resend"}</span>
            </Button>
          )}

          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <Button
              onClick={() => setShowMarkPaidConfirm(true)}
              variant="success"
              size="sm"
              className="flex items-center space-x-2"
              loading={markPaidMutation.isLoading}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Paid</span>
            </Button>
          )}

          <Button
            onClick={handleDownloadPDF}
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </Button>

          <Button
            onClick={handlePrint}
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Link</span>
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8">
        {/* Company Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                LankaGrow
              </h2>
              <p className="text-gray-600">Business Management Platform</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>123 Business Street</p>
                <p>Colombo, Sri Lanka</p>
                <p>contact@lankagrow.com</p>
                <p>+94 11 234 5678</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Invoice #:</span>{" "}
                  {invoice.invoiceNumber}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(invoice.createdAt, "MMM d, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Due Date:</span>{" "}
                  {formatDate(invoice.dueDate, "MMM d, yyyy")}
                </p>
                {isOverdue && (
                  <p className="text-red-600 font-medium">OVERDUE</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">Bill To:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">
              {invoice.customer?.name}
            </h5>
            <div className="text-sm text-gray-600 space-y-1">
              {invoice.customer?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{invoice.customer.email}</span>
                </div>
              )}
              {invoice.customer?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{invoice.customer.phone}</span>
                </div>
              )}
              {invoice.customer?.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{invoice.customer.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items?.map((item, index) => {
                  const itemTotal =
                    item.quantity * item.unitPrice - (item.discount || 0);
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          {item.product?.description && (
                            <p className="text-sm text-gray-500">
                              {item.product.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-900">
                        {item.discount ? formatCurrency(item.discount) : "-"}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(itemTotal)}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tax ({invoice.taxRate}%):
                  </span>
                  <span className="font-medium">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Notes:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          </div>
        )}

        {/* Payment Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Payment Instructions:
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Payment is due within 30 days of invoice date</p>
            <p>• Please include invoice number in payment reference</p>
            <p>• For any questions, contact us at billing@lankagrow.com</p>
          </div>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      <Modal
        isOpen={showSendConfirm}
        onClose={() => setShowSendConfirm(false)}
        title="Send Invoice"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to send this invoice to{" "}
            {invoice.customer?.name}?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowSendConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => sendMutation.mutate(invoice._id)}
              loading={sendMutation.isLoading}
            >
              Send Invoice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mark Paid Confirmation Modal */}
      <Modal
        isOpen={showMarkPaidConfirm}
        onClose={() => setShowMarkPaidConfirm(false)}
        title="Mark as Paid"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to mark this invoice as paid?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowMarkPaidConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => markPaidMutation.mutate(invoice._id)}
              loading={markPaidMutation.isLoading}
            >
              Mark as Paid
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default InvoicePreview;
