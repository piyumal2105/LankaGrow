import React from "react";
import { motion } from "framer-motion";
import InvoiceCard from "./InvoiceCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { FileText } from "lucide-react";

function InvoiceList({ invoices, isLoading, onEdit, onRefresh }) {
  // Ensure invoices is always an array
  const invoiceList = Array.isArray(invoices) ? invoices : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (invoiceList.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No invoices found
        </h3>
        <p className="text-gray-500 mb-6">
          Create your first invoice to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoiceList.map((invoice, index) => (
        <motion.div
          key={invoice._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <InvoiceCard
            invoice={invoice}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default InvoiceList;
