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
  Eye,
  Printer,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { invoiceService } from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../common/Button";
import Modal from "../common/Modal";

function InvoiceCard({ invoice, onEdit, onRefresh }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id) => invoiceService.sendInvoice(id),
    onSuccess: () => {
      toast.success("Invoice sent successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onRefresh();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send invoice");
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: (id) => invoiceService.markAsPaid(id),
    onSuccess: () => {
      toast.success("Invoice marked as paid");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
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

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    const printContent = generatePrintableInvoice(invoice);

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const generatePrintableInvoice = (invoice) => {
    const currentDate = new Date().toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name { 
              font-size: 2.5rem; 
              font-weight: bold; 
              color: #2563eb;
              margin-bottom: 5px;
            }
            .company-tagline { 
              font-size: 1.1rem; 
              color: #6b7280;
              font-style: italic;
            }
            .invoice-title { 
              font-size: 2rem; 
              font-weight: bold;
              margin: 30px 0 20px 0;
              text-align: center;
              color: #1f2937;
            }
            .invoice-details { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px;
              margin-bottom: 30px;
            }
            .detail-section h3 { 
              font-size: 1.1rem; 
              font-weight: bold;
              margin-bottom: 10px;
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .detail-section p { 
              margin-bottom: 5px;
              color: #6b7280;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse;
              margin: 30px 0;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .items-table th { 
              background: #f3f4f6; 
              padding: 12px; 
              text-align: left;
              font-weight: bold;
              border: 1px solid #e5e7eb;
              color: #374151;
            }
            .items-table td { 
              padding: 12px; 
              border: 1px solid #e5e7eb;
              color: #6b7280;
            }
            .items-table tr:nth-child(even) { background: #f9fafb; }
            .totals { 
              margin-top: 30px;
              text-align: right;
            }
            .totals table { 
              margin-left: auto;
              border-collapse: collapse;
            }
            .totals td { 
              padding: 8px 15px;
              border: none;
            }
            .total-row { 
              font-weight: bold;
              font-size: 1.2rem;
              border-top: 2px solid #2563eb !important;
              color: #1f2937;
            }
            .footer { 
              margin-top: 40px;
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 0.9rem;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.85rem;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-paid { background: #dcfce7; color: #166534; }
            .status-sent { background: #dbeafe; color: #1d4ed8; }
            .status-draft { background: #f3f4f6; color: #374151; }
            .status-overdue { background: #fee2e2; color: #dc2626; }
            @media print {
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">LankaGrow</div>
            <div class="company-tagline">AI-Powered Business Management Platform</div>
          </div>

          <div class="invoice-title">INVOICE</div>

          <div class="invoice-details">
            <div class="detail-section">
              <h3>Bill To:</h3>
              <p><strong>${invoice.customer?.name || "N/A"}</strong></p>
              <p>${invoice.customer?.email || ""}</p>
              <p>${invoice.customer?.phone || ""}</p>
              <p>${invoice.customer?.address || ""}</p>
            </div>
            <div class="detail-section">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice #:</strong> ${
                invoice.invoiceNumber || invoice._id
              }</p>
              <p><strong>Date:</strong> ${formatDate(
                invoice.createdAt || new Date()
              )}</p>
              <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
              <p><strong>Status:</strong> 
                <span class="status-badge status-${invoice.status}">${
      invoice.status
    }</span>
              </p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                invoice.items
                  ?.map(
                    (item) => `
                <tr>
                  <td>${item.productName || "N/A"}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td>${formatCurrency(item.discount || 0)}</td>
                  <td>${formatCurrency(
                    item.quantity * item.unitPrice - (item.discount || 0)
                  )}</td>
                </tr>
              `
                  )
                  .join("") || '<tr><td colspan="5">No items</td></tr>'
              }
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td>${formatCurrency(invoice.subtotal || 0)}</td>
              </tr>
              <tr>
                <td><strong>Tax (${invoice.taxRate || 0}%):</strong></td>
                <td>${formatCurrency(invoice.taxAmount || 0)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total:</strong></td>
                <td><strong>${formatCurrency(
                  invoice.totalAmount || 0
                )}</strong></td>
              </tr>
            </table>
          </div>

          ${
            invoice.notes
              ? `
            <div style="margin-top: 30px;">
              <h3>Notes:</h3>
              <p>${invoice.notes}</p>
            </div>
          `
              : ""
          }

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${currentDate} | LankaGrow Business Management Platform</p>
          </div>
        </body>
      </html>
    `;
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
        className={`card relative overflow-hidden border-l-4 ${
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

        {/* Actions - Always visible, no hover effect */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInvoicePreview(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(invoice)}
              disabled={invoice.status === "paid"}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrintInvoice}>
              <Printer className="w-4 h-4 mr-1" />
              Print
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
                loading={sendMutation.isPending}
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
                loading={markPaidMutation.isPending}
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

      {/* Invoice Preview Modal */}
      <Modal
        isOpen={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        title={`Invoice #${invoice.invoiceNumber}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-600">
              {invoice.businessName || "Your Business Name"}
            </h2>
            <p className="text-gray-600">
              {invoice.businessAddress || "Business Address"}
            </p>
            <p className="text-gray-600">
              {invoice.businessPhone && `Phone: ${invoice.businessPhone}`}
              {invoice.businessPhone && invoice.businessEmail && " | "}
              {invoice.businessEmail && `Email: ${invoice.businessEmail}`}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Powered by LankaGrow Platform
            </p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <p className="text-gray-600">{invoice.customer?.name}</p>
              <p className="text-gray-600">{invoice.customer?.email}</p>
              <p className="text-gray-600">{invoice.customer?.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Invoice Details:
              </h3>
              <p className="text-gray-600">
                Invoice #: {invoice.invoiceNumber}
              </p>
              <p className="text-gray-600">
                Date: {formatDate(invoice.createdAt)}
              </p>
              <p className="text-gray-600">
                Due Date: {formatDate(invoice.dueDate)}
              </p>
              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={`badge text-xs ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Items:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left">
                      Item
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left">
                      Qty
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left">
                      Price
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 px-4 py-2">
                        {item.productName}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {formatCurrency(
                          item.quantity * item.unitPrice - (item.discount || 0)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax ({invoice.taxRate || 0}%):</span>
                  <span>{formatCurrency(invoice.taxAmount || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowInvoicePreview(false)}
            >
              Close
            </Button>
            <Button onClick={handlePrintInvoice}>
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </Modal>

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

export default InvoiceCard;
