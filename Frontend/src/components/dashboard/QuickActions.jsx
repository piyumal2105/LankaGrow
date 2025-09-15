import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Users,
  FileText,
  Package,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "Add new products to inventory",
      icon: Package,
      href: "/products",
      color: "blue",
    },
    {
      title: "Create Invoice",
      description: "Generate invoice for customers",
      icon: FileText,
      href: "/invoices",
      color: "green",
    },
    {
      title: "Add Customer",
      description: "Register new customer",
      icon: Users,
      href: "/customers",
      color: "purple",
    },
    {
      title: "Record Expense",
      description: "Log business expenses",
      icon: DollarSign,
      href: "/expenses",
      color: "red",
    },
    {
      title: "View Reports",
      description: "Check business analytics",
      icon: BarChart3,
      href: "/reports",
      color: "yellow",
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple:
      "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    yellow:
      "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={action.href}
              className={`block p-4 rounded-xl bg-gradient-to-r ${
                colorClasses[action.color]
              } text-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
