import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Brain,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
      current: location.pathname.startsWith("/products"),
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
      current: location.pathname.startsWith("/customers"),
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: FileText,
      current: location.pathname.startsWith("/invoices"),
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: DollarSign,
      current: location.pathname.startsWith("/expenses"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      current: location.pathname.startsWith("/reports"),
    },
  ];

  const aiFeatures = [
    { name: "Sales Forecasting", icon: Sparkles },
    { name: "Market Intelligence", icon: Brain },
    { name: "Smart Automation", icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className="relative">
        {/* Mobile Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: isOpen ? 0 : -320,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 z-30 lg:hidden flex flex-col shadow-xl"
        >
          <SidebarContent
            navigation={navigation}
            aiFeatures={aiFeatures}
            user={user}
            logout={logout}
            onClose={onClose}
          />
        </motion.div>

        {/* Desktop Sidebar - Always visible on large screens */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:translate-x-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
            <SidebarContent
              navigation={navigation}
              aiFeatures={aiFeatures}
              user={user}
              logout={logout}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Separated sidebar content into its own component to avoid duplication
function SidebarContent({ navigation, aiFeatures, user, logout, onClose }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LankaGrow</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.businessName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                item.current
                  ? "bg-blue-100 text-blue-900 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* AI Features */}
        <div className="pt-6">
          <div className="px-2 mb-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                AI Features
              </h3>
            </div>
          </div>
          <div className="space-y-1">
            {aiFeatures.map((feature) => (
              <button
                key={feature.name}
                className="w-full flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors group"
              >
                <feature.icon className="w-4 h-4 mr-3 text-purple-500" />
                {feature.name}
                <Sparkles className="w-3 h-3 ml-auto text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          to="/settings"
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </button>
      </div>
    </>
  );
}

export default Sidebar;
