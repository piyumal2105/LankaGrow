import React from "react";
import { motion } from "framer-motion";
import CustomerCard from "./CustomerCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { Users } from "lucide-react";

function CustomerList({ customers, isLoading, onEdit, onRefresh }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Ensure customers is always an array
  const customerArray = Array.isArray(customers) ? customers : [];

  if (customerArray.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No customers found
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by adding your first customer.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {customerArray.map((customer, index) => (
        <motion.div
          key={customer._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <CustomerCard
            customer={customer}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default CustomerList;
