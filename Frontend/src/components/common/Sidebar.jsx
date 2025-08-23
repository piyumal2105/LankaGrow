import React, { useState } from "react";
import {
  Package,
  Users,
  FileText,
  TrendingUp,
  BarChart,
  Zap,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      icon: TrendingUp,
      label: "Dashboard",
      color: "text-blue-600",
    },
    {
      id: "products",
      icon: Package,
      label: "Inventory",
      color: "text-green-600",
    },
    {
      id: "customers",
      icon: Users,
      label: "Customers",
      color: "text-purple-600",
    },
    {
      id: "invoices",
      icon: FileText,
      label: "Invoices",
      color: "text-orange-600",
    },
    { id: "reports", icon: BarChart, label: "Reports", color: "text-red-600" },
    {
      id: "ai-insights",
      icon: Zap,
      label: "AI Insights",
      color: "text-yellow-600",
    },
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:static lg:z-auto
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold">LankaGrow</h1>
                <p className="text-xs text-gray-400">AI Business Platform</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {!isCollapsed && (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              )}

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:block text-gray-400 hover:text-white p-1 rounded"
              >
                {isCollapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`
                w-full flex items-center px-3 py-3 mb-2 text-left rounded-lg transition-all duration-200
                ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon
                size={20}
                className={`${isCollapsed ? "" : "mr-3"} ${
                  activeTab === item.id ? "text-white" : item.color
                }`}
              />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {!isCollapsed && activeTab === item.id && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Features</p>
                  <p className="text-xs text-gray-400">Powered by OpenAI</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
