import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, Plus, Search, Filter, Upload } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ReceiptUpload from "../components/expenses/ReceiptUpload";
import CategorySuggestions from "../components/expenses/CategorySuggestions";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { expenseService } from "../services/expenseService";
import { useDebounce } from "../hooks/useDebounce";

function ExpensesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Remove hash from URL on component mount
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  // Main expenses query
  const {
    data: expenses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "expenses",
      { search: debouncedSearch, category: selectedCategory },
    ],
    queryFn: () =>
      expenseService.getExpenses({
        search: debouncedSearch,
        category: selectedCategory,
      }),
    placeholderData: (previousData) => previousData,
  });

  // Recent expenses for summary section
  const { data: recentExpenses } = useQuery({
    queryKey: ["recent-expenses"],
    queryFn: expenseService.getRecentExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Expense insights for AI section
  const { data: expenseInsights } = useQuery({
    queryKey: ["expense-insights"],
    queryFn: expenseService.getCategoryInsights,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Monthly stats for analytics
  const { data: monthlyStats } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: () =>
      expenseService.getMonthlyStats({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const handleCreateExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleFormClose = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
    refetch();
  };

  const categories = [
    "All Categories",
    "Office Supplies",
    "Travel",
    "Marketing",
    "Utilities",
    "Equipment",
    "Professional Services",
    "Inventory",
    "Maintenance",
    "Insurance",
    "Rent",
    "Salaries",
    "Other",
  ];

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      "Office Supplies": "bg-blue-600",
      Marketing: "bg-green-600",
      Travel: "bg-purple-600",
      Utilities: "bg-yellow-600",
      Equipment: "bg-red-600",
      "Professional Services": "bg-indigo-600",
      Inventory: "bg-pink-600",
      Maintenance: "bg-orange-600",
      Insurance: "bg-teal-600",
      Rent: "bg-gray-600",
      Salaries: "bg-cyan-600",
      Other: "bg-slate-600",
    };
    return colors[category] || "bg-gray-600";
  };

  // Helper function to get insight color
  const getInsightColor = (trend) => {
    switch (trend) {
      case "increase":
        return "bg-blue-50";
      case "good":
        return "bg-green-50";
      case "decrease":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  const getInsightBadgeColor = (trend) => {
    switch (trend) {
      case "increase":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-green-100 text-green-800";
      case "decrease":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsightTextColor = (trend) => {
    switch (trend) {
      case "increase":
        return "text-blue-600 hover:text-blue-800";
      case "good":
        return "text-green-600 hover:text-green-800";
      case "decrease":
        return "text-purple-600 hover:text-purple-800";
      default:
        return "text-gray-600 hover:text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 lg:ml-80">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                <p className="text-gray-600">
                  Track and categorize your business expenses with AI automation
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowReceiptUpload(true)}
                className="flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Receipt</span>
              </Button>
              <Button
                onClick={handleCreateExpense}
                className="flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Recent Expenses Summary - Dynamic */}
        {recentExpenses?.data?.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Recent Expenses This Month
                </h3>
                <div className="flex items-center space-x-6 mt-2">
                  {recentExpenses.data.slice(0, 3).map((expense, index) => (
                    <div
                      key={expense._id}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className={`w-8 h-8 ${getCategoryColor(
                          expense.category
                        )} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white text-xs font-medium">
                          {expense.category.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {expense.category}
                        </p>
                        <p className="text-xs text-blue-700">
                          Rs {expense.amount?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {monthlyStats?.data?.totalExpenses && (
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-900">
                    Total This Month
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    Rs {monthlyStats.data.totalExpenses.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Insights Section - Dynamic */}
        <div className="px-6 py-4 bg-white border-b border-gray-100">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              AI-powered spending analysis and optimization suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expenseInsights?.data?.length > 0 ? (
                expenseInsights.data.slice(0, 3).map((insight, index) => (
                  <div
                    key={index}
                    className={`${getInsightColor(
                      insight.trend
                    )} rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {insight.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInsightBadgeColor(
                          insight.trend
                        )}`}
                      >
                        {insight.percentage > 0 ? "+" : ""}
                        {insight.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {insight.description}
                    </p>
                    <a
                      href="#"
                      className={`text-xs ${getInsightTextColor(
                        insight.trend
                      )}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      {insight.recommendation} →
                    </a>
                  </div>
                ))
              ) : (
                // Fallback if no insights available
                <>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Office Supplies
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        +15%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Increased office expenses this month
                    </p>
                    <a
                      href="#"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Optimize supplies →
                    </a>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Marketing
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +28%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Marketing spend showing good ROI
                    </p>
                    <a
                      href="#"
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      Consider increasing budget →
                    </a>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Travel
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        -12%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Travel expenses decreased significantly
                    </p>
                    <a
                      href="#"
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      Reallocate budget to other areas →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value === "All Categories" ? "" : e.target.value
                  )
                }
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <ExpenseList
            expenses={expenses?.data || []}
            isLoading={isLoading}
            onEdit={handleEditExpense}
            onRefresh={refetch}
          />
        </main>
      </div>

      {/* Expense Form Modal */}
      <Modal
        isOpen={showExpenseForm}
        onClose={handleFormClose}
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
        size="lg"
      >
        <ExpenseForm
          expense={editingExpense}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      </Modal>

      {/* Receipt Upload Modal */}
      <Modal
        isOpen={showReceiptUpload}
        onClose={() => setShowReceiptUpload(false)}
        title="Upload Receipt"
        size="md"
      >
        <ReceiptUpload
          onClose={() => setShowReceiptUpload(false)}
          onSuccess={() => {
            setShowReceiptUpload(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}

export default ExpensesPage;
