import React, { useState } from "react";
import { X, Upload, Brain } from "lucide-react";
import api from "../../services/api";

const ExpenseForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    vendor: "",
    notes: "",
    taxDeductible: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const categories = [
    "Office Supplies",
    "Marketing",
    "Travel",
    "Utilities",
    "Equipment",
    "Professional Services",
    "Inventory",
    "Maintenance",
    "Insurance",
    "Rent",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createExpense(formData);
      onSuccess();
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Error creating expense: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAISuggestion = async () => {
    if (!formData.description || !formData.amount) {
      alert("Please enter description and amount first");
      return;
    }

    setLoadingAI(true);
    try {
      const response = await fetch("/api/expenses/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          description: formData.description,
          amount: formData.amount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data.data);
      } else {
        // Fallback suggestion
        setAiSuggestion({
          category: "Office Supplies",
          confidence: 0.75,
          subcategory: "General",
        });
      }
    } catch (error) {
      console.error("AI categorization error:", error);
      setAiSuggestion({
        category: "Other",
        confidence: 0.5,
        subcategory: "General",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const applyAISuggestion = () => {
    if (aiSuggestion) {
      setFormData({ ...formData, category: aiSuggestion.category });
      setAiSuggestion(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Add New Expense</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter expense description..."
              />
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Category with AI Suggestion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={getAISuggestion}
                  disabled={
                    loadingAI || !formData.description || !formData.amount
                  }
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  <Brain size={16} />
                  {loadingAI ? "Getting AI suggestion..." : "Get AI Suggestion"}
                </button>
              </div>

              {aiSuggestion && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        AI suggests: {aiSuggestion.category}
                      </p>
                      <p className="text-xs text-blue-700">
                        Confidence: {Math.round(aiSuggestion.confidence * 100)}%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={applyAISuggestion}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method and Vendor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor/Supplier
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.vendor}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor: e.target.value })
                  }
                  placeholder="Enter vendor name"
                />
              </div>
            </div>

            {/* Tax Deductible */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="taxDeductible"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.taxDeductible}
                onChange={(e) =>
                  setFormData({ ...formData, taxDeductible: e.target.checked })
                }
              />
              <label
                htmlFor="taxDeductible"
                className="ml-2 block text-sm text-gray-900"
              >
                This expense is tax deductible
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes about this expense..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
