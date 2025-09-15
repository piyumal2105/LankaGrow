import React, { useState } from "react";
import { Menu, Download, Calendar, Filter } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import ReportsOverview from "../components/reports/ReportsOverview";
import SalesReport from "../components/reports/SalesReport";
import ProfitLossReport from "../components/reports/ProfitLossReport";
import InventoryReport from "../components/reports/InventoryReport";
import CashFlowReport from "../components/reports/CashFlowReport";
import AIInsightsReport from "../components/reports/AIInsightsReport";
import Button from "../components/common/Button";

function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeReport, setActiveReport] = useState("overview");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const reports = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "sales", name: "Sales Report", icon: "💰" },
    { id: "profit-loss", name: "Profit & Loss", icon: "📈" },
    { id: "inventory", name: "Inventory Report", icon: "📦" },
    { id: "cashflow", name: "Cash Flow", icon: "💸" },
    { id: "ai-insights", name: "AI Insights", icon: "🤖" },
  ];

  const renderReport = () => {
    switch (activeReport) {
      case "overview":
        return <ReportsOverview dateRange={dateRange} />;
      case "sales":
        return <SalesReport dateRange={dateRange} />;
      case "profit-loss":
        return <ProfitLossReport dateRange={dateRange} />;
      case "inventory":
        return <InventoryReport />;
      case "cashflow":
        return <CashFlowReport dateRange={dateRange} />;
      case "ai-insights":
        return <AIInsightsReport />;
      default:
        return <ReportsOverview dateRange={dateRange} />;
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting report:", activeReport);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600">
                  Comprehensive business insights powered by AI
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Report Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeReport === report.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{report.icon}</span>
                  {report.name}
                </button>
              ))}
            </div>

            {/* Date Range Picker */}
            {activeReport !== "overview" &&
              activeReport !== "inventory" &&
              activeReport !== "ai-insights" && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">{renderReport()}</main>
      </div>
    </div>
  );
}

export default ReportsPage;
