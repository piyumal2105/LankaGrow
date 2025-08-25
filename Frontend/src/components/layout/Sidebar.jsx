import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Receipt,
  BarChart3,
  Brain,
  TrendingUp,
  Settings,
  Sparkles,
  ChevronLeft,
  AlertCircle,
  PlusCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "../../utils/helpers";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Brain, label: "AI Insights", href: "/dashboard/ai-insights" },
        { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
      ],
    },
    {
      title: "Business",
      items: [
        { icon: Package, label: "Products", href: "/dashboard/products" },
        { icon: Users, label: "Customers", href: "/dashboard/customers" },
        { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
        { icon: Receipt, label: "Expenses", href: "/dashboard/expenses" },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          icon: BarChart3,
          label: "Profit & Loss",
          href: "/dashboard/reports/profit-loss",
        },
        {
          icon: TrendingUp,
          label: "Sales Report",
          href: "/dashboard/reports/sales",
        },
        {
          icon: CreditCard,
          label: "Cash Flow",
          href: "/dashboard/reports/cashflow",
        },
        {
          icon: Package,
          label: "Inventory",
          href: "/dashboard/reports/inventory",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Settings,
          label: "Settings",
          href: "/dashboard/settings/profile",
        },
      ],
    },
  ];

  const quickActions = [
    {
      icon: PlusCircle,
      label: "Add Product",
      href: "/dashboard/products/add",
      color: "text-blue-600",
    },
    {
      icon: FileText,
      label: "New Invoice",
      href: "/dashboard/invoices/create",
      color: "text-green-600",
    },
    {
      icon: Users,
      label: "Add Customer",
      href: "/dashboard/customers/add",
      color: "text-purple-600",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isCollapsed ? -320 : 0,
          width: isCollapsed ? 0 : 280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 lg:relative lg:translate-x-0",
          "flex flex-col shadow-lg lg:shadow-none"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="font-display text-lg font-bold text-gray-900">
                Lanka<span className="text-gradient">Grow</span>
              </div>
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
            {menuItems.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "nav-link",
                          isActive && "active bg-primary-50 text-primary-600"
                        )}
                        onClick={() => setIsCollapsed(true)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <action.icon className={cn("h-4 w-4", action.color)} />
                    <span>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    AI Assistant
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Get smart insights for your business decisions
                  </p>
                  <button className="text-xs text-primary-600 font-medium mt-2 hover:text-primary-700 transition-colors">
                    Ask AI →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
