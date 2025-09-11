import React from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import {
  Clock,
  FileText,
  Users,
  Package,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { formatCurrency } from "../../utils/formatters";
import { formatDistanceToNow } from "date-fns";
import LoadingSpinner from "../common/LoadingSpinner";

function RecentActivity() {
  const { data: stats, isLoading } = useQuery(
    "dashboard-stats",
    reportService.getDashboardStats
  );

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const recentInvoices = stats?.data?.recentInvoices || [];

  const getActivityIcon = (type) => {
    switch (type) {
      case "invoice":
        return FileText;
      case "customer":
        return Users;
      case "product":
        return Package;
      case "expense":
        return DollarSign;
      default:
        return Clock;
    }
  };

  const getActivityColor = (status) => {
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

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentInvoices.map((invoice, index) => {
          const ActivityIcon = getActivityIcon("invoice");
          return (
            <motion.div
              key={invoice._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ActivityIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Invoice #{invoice.invoiceNumber}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {invoice.customer?.name} •{" "}
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(invoice.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}

        {recentInvoices.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
          <span>View All Activity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default RecentActivity;
