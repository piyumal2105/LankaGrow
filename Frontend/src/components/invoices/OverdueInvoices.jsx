import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, FileText, ArrowRight, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

function OverdueInvoices({ invoices }) {
  if (!invoices || invoices.length === 0) return null;

  const totalOverdueAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.totalAmount,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            Overdue Invoices Alert
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {invoices.length} invoice{invoices.length > 1 ? "s are" : " is"}{" "}
            overdue with total amount of {formatCurrency(totalOverdueAmount)}
          </p>

          <div className="space-y-2 mb-3">
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice._id}
                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-200"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      #{invoice.invoiceNumber}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {invoice.customer?.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  <div className="text-xs text-red-600 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{invoice.daysPastDue} days overdue</span>
                  </div>
                </div>
              </div>
            ))}

            {invoices.length > 3 && (
              <div className="text-sm text-red-700 text-center">
                +{invoices.length - 3} more overdue invoice
                {invoices.length - 3 > 1 ? "s" : ""}
              </div>
            )}
          </div>

          <button className="inline-flex items-center space-x-2 text-sm font-medium text-red-800 hover:text-red-900">
            <span>View all overdue invoices</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default OverdueInvoices;
