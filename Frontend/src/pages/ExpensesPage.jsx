import React, { useState } from "react";
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
    placeholderData: keepPreviousData,
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
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

        {/* AI Category Suggestions */}
        <div className="px-6 py-4">
          <CategorySuggestions />
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
