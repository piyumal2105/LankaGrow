import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Banknote,
  Receipt,
  Filter,
  Download,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { invoiceService } from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { calculateDaysOverdue } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import Button from "../common/Button";

function PaymentTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedInvoice, setExpandedInvoice] = useState(null);

  // Fetch invoice data
  const { data: invoices, isLoading } = useQuery(
    ["invoices", { status: selectedStatus === "all" ? "" : selectedStatus }],
    () =>
      invoiceService.getInvoices({
        status: selectedStatus === "all" ? "" : selectedStatus,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { data: overdueInvoices } = useQuery(
    "overdue-invoices",
    invoiceService.getOverdueInvoices
  );

  // Calculate payment analytics
  const paymentAnalytics = useMemo(() => {
    if (!invoices?.data) return null;

    const allInvoices = invoices.data;
    const now = new Date();
    const timeframes = {
      "7days": 7,
      "30days": 30,
      "90days": 90,
      "1year": 365,
    };

    const daysBack = timeframes[selectedTimeframe] || 30;
    const cutoffDate = new Date(now - daysBack * 24 * 60 * 60 * 1000);

    const filteredInvoices = allInvoices.filter(
      (invoice) => new Date(invoice.createdAt) >= cutoffDate
    );

    const totalInvoiced = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0
    );

    const paidInvoices = filteredInvoices.filter(
      (invoice) => invoice.status === "paid"
    );
    const totalPaid = paidInvoices.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0
    );

    const pendingInvoices = filteredInvoices.filter(
      (invoice) => invoice.status === "sent" || invoice.status === "draft"
    );
    const totalPending = pendingInvoices.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0
    );

    const overdueTotal = (overdueInvoices?.data || []).reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0
    );

    const collectionRate =
      totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
    const avgPaymentTime =
      paidInvoices.length > 0
        ? paidInvoices.reduce((sum, invoice) => {
            const created = new Date(invoice.createdAt);
            const paid = new Date(invoice.paidAt || invoice.updatedAt);
            return sum + (paid - created) / (1000 * 60 * 60 * 24);
          }, 0) / paidInvoices.length
        : 0;

    return {
      totalInvoiced,
      totalPaid,
      totalPending,
      overdueTotal,
      collectionRate,
      avgPaymentTime,
      totalInvoices: filteredInvoices.length,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices?.data?.length || 0,
    };
  }, [invoices, overdueInvoices, selectedTimeframe]);

  // Group invoices by status for display
  const groupedInvoices = useMemo(() => {
    if (!invoices?.data) return {};

    const groups = {
      paid: [],
      sent: [],
      draft: [],
      overdue: overdueInvoices?.data || [],
    };

    invoices.data.forEach((invoice) => {
      if (groups[invoice.status]) {
        groups[invoice.status].push(invoice);
      }
    });

    return groups;
  }, [invoices, overdueInvoices]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return CheckCircle;
      case "sent":
        return Clock;
      case "draft":
        return Receipt;
      case "overdue":
        return AlertTriangle;
      default:
        return Receipt;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "sent":
        return "text-blue-600 bg-blue-100";
      case "draft":
        return "text-gray-600 bg-gray-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const toggleInvoiceExpansion = (invoiceId) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Tracker</h2>
        <div className="flex items-center space-x-3">
          {/* Timeframe Filter */}
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="sent">Sent</option>
            <option value="draft">Draft</option>
            <option value="overdue">Overdue</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Payment Analytics Cards */}
      {paymentAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Invoiced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Invoiced
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(paymentAnalytics.totalInvoiced)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {paymentAnalytics.totalInvoices} invoices
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Paid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(paymentAnalytics.totalPaid)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {paymentAnalytics.paidCount} payments
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Pending Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(paymentAnalytics.totalPending)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {paymentAnalytics.pendingCount} invoices
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Overdue Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(paymentAnalytics.overdueTotal)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {paymentAnalytics.overdueCount} invoices
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Insights */}
      {paymentAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Rate */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Collection Rate
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {paymentAnalytics.collectionRate.toFixed(1)}%
                </span>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Good</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(paymentAnalytics.collectionRate, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {paymentAnalytics.collectionRate >= 80
                  ? "Excellent collection rate! Keep up the good work."
                  : paymentAnalytics.collectionRate >= 60
                  ? "Good collection rate. Consider following up on pending invoices."
                  : "Collection rate needs improvement. Focus on payment follow-ups."}
              </p>
            </div>
          </div>

          {/* Average Payment Time */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Avg. Payment Time
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  {Math.round(paymentAnalytics.avgPaymentTime)} days
                </span>
                <div className="flex items-center space-x-1 text-blue-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">Average</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  {paymentAnalytics.avgPaymentTime <= 15
                    ? "Excellent! Customers pay quickly."
                    : paymentAnalytics.avgPaymentTime <= 30
                    ? "Good payment timing. Within terms."
                    : "Consider shorter payment terms or reminders."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Status Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Invoice Status Breakdown
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedInvoices).map(([status, statusInvoices]) => {
            if (statusInvoices.length === 0) return null;

            const StatusIcon = getStatusIcon(status);
            const totalAmount = statusInvoices.reduce(
              (sum, invoice) => sum + (invoice.totalAmount || 0),
              0
            );

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-lg"
              >
                {/* Status Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(
                        status
                      )}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {status} ({statusInvoices.length})
                      </h4>
                      <p className="text-sm text-gray-600">
                        Total: {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleInvoiceExpansion(status)}
                    className="flex items-center space-x-1"
                  >
                    {expandedInvoice === status ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Expanded Invoice List */}
                {expandedInvoice === status && (
                  <div className="p-4 space-y-3">
                    {statusInvoices.slice(0, 5).map((invoice) => {
                      const isOverdue =
                        status === "overdue" ||
                        (new Date(invoice.dueDate) < new Date() &&
                          invoice.status !== "paid");
                      const daysOverdue = isOverdue
                        ? calculateDaysOverdue(invoice.dueDate)
                        : 0;

                      return (
                        <div
                          key={invoice._id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                #{invoice.invoiceNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                {invoice.customer?.name}
                              </p>
                              {isOverdue && (
                                <p className="text-xs text-red-600 font-medium">
                                  {daysOverdue} days overdue
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(invoice.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Due: {formatDate(invoice.dueDate, "MMM d")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {statusInvoices.length > 5 && (
                      <div className="text-center pt-3 border-t border-gray-200">
                        <Button variant="secondary" size="sm">
                          View all {statusInvoices.length} invoices
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            className="flex items-center justify-center space-x-2 p-4"
          >
            <Send className="w-5 h-5" />
            <span>Send Payment Reminders</span>
          </Button>
          <Button
            variant="secondary"
            className="flex items-center justify-center space-x-2 p-4"
          >
            <Download className="w-5 h-5" />
            <span>Export Payment Report</span>
          </Button>
          <Button
            variant="secondary"
            className="flex items-center justify-center space-x-2 p-4"
          >
            <Eye className="w-5 h-5" />
            <span>View Detailed Analytics</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentTracker;
