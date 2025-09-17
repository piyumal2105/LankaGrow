// src/components/expenses/CategorySuggestions.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Check,
  X,
  Brain,
  Zap,
  ArrowRight,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import aiService from "../../services/aiService";

const CategorySuggestions = ({
  description,
  amount,
  onCategorySelect,
  onClose,
  isVisible,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isVisible && description && amount) {
      fetchSuggestions();
    }
  }, [isVisible, description, amount]);

  const fetchSuggestions = async () => {
    if (!description || !amount) return;

    setLoading(true);
    try {
      const result = await aiService.categorizeExpense(description, amount);
      if (result.success) {
        setSuggestions([
          {
            category: result.data.category,
            confidence: result.data.confidence,
            reason:
              result.data.reason ||
              "AI analysis based on description and amount",
          },
        ]);
        setConfidence(result.data.confidence);
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      // Fallback suggestions
      setSuggestions([
        {
          category: "General Business",
          confidence: 0.7,
          reason: "Default categorization",
        },
      ]);
    }
    setLoading(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    // You could send this feedback to your backend for AI improvement
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  AI Category Suggestion
                </h3>
                <p className="text-sm text-gray-500">
                  Smart expense categorization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Expense Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-gray-900 truncate">{description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Amount</p>
                <p className="text-gray-900 font-semibold">
                  LKR {amount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>AI analyzing expense...</span>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="space-y-3 mb-6">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedCategory === suggestion.category
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                  }`}
                  onClick={() => handleCategorySelect(suggestion.category)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {suggestion.category}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(
                          suggestion.confidence
                        )}`}
                      >
                        {getConfidenceText(suggestion.confidence)}
                      </span>
                      {selectedCategory === suggestion.category && (
                        <Check className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {suggestion.reason}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>
                      {(suggestion.confidence * 100).toFixed(0)}% match
                      confidence
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Alternative Categories */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Not satisfied? Choose manually:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Office Supplies",
                "Marketing",
                "Travel",
                "Utilities",
                "Meals & Entertainment",
                "Equipment",
                "Professional Services",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategory === category
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          {selectedCategory && !feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-lg p-4 mb-6"
            >
              <p className="text-sm font-medium text-blue-900 mb-2">
                Was this AI suggestion helpful?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback("positive")}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes, helpful
                </button>
                <button
                  onClick={() => handleFeedback("negative")}
                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Not accurate
                </button>
              </div>
            </motion.div>
          )}

          {/* Feedback Thank You */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Thank you for your feedback! This helps improve our AI.
                </span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedCategory && onClose()}
              disabled={!selectedCategory}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                selectedCategory
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Apply Category</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI Notice */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <AlertCircle className="w-3 h-3" />
            <span>AI suggestions improve with more data and feedback</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategorySuggestions;
