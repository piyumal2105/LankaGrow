import React from "react";
import { motion } from "framer-motion";
import ExpenseCard from "./ExpenseCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { DollarSign } from "lucide-react";

function ExpenseList({ expenses, isLoading, onEdit, onRefresh }) {
  // Debug what we're getting
  console.log("ExpenseList props:", { expenses, isLoading });
  console.log("expenses type:", typeof expenses);
  console.log("expenses is array:", Array.isArray(expenses));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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

  // CRITICAL FIX: Always ensure we have an array
  let expenseList = [];

  if (Array.isArray(expenses)) {
    expenseList = expenses;
  } else if (expenses?.data && Array.isArray(expenses.data)) {
    expenseList = expenses.data;
  } else if (expenses?.data?.data && Array.isArray(expenses.data.data)) {
    expenseList = expenses.data.data;
  } else {
    console.warn("Expenses is not in expected format:", expenses);
    expenseList = [];
  }

  console.log("Final expenseList:", expenseList);

  if (expenseList.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No expenses found
        </h3>
        <p className="text-gray-500 mb-6">
          Start tracking your business expenses.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {expenseList.map((expense, index) => (
        <motion.div
          key={expense._id || expense.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ExpenseCard
            expense={expense}
            onEdit={onEdit}
            onRefresh={onRefresh}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default ExpenseList;
