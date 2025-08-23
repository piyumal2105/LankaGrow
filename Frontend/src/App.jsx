import React from "react";
import { useApp } from "./context/AppContext.jsx";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Products from "./components/products/Products";
import Customers from "./components/customers/Customers";
import Invoices from "./components/invoices/Invoices";
import Reports from "./components/reports/Reports";
import AIInsights from "./components/ai-insights/AIInsights";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";

const App = () => {
  const { isAuthenticated, activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "customers":
        return <Customers />;
      case "invoices":
        return <Invoices />;
      case "reports":
        return <Reports />;
      case "ai-insights":
        return <AIInsights />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default App;
