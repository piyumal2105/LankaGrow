import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

// Landing Pages
import LandingPage from "./pages/landing/LandingPage";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/dashboard/Analytics";
import AIInsights from "./pages/dashboard/AIInsights";

// Product Pages
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";
import AddProduct from "./pages/products/AddProduct";
import LowStock from "./pages/products/LowStock";

// Customer Pages
import CustomerList from "./pages/customers/CustomerList";
import CustomerDetail from "./pages/customers/CustomerDetail";
import AddCustomer from "./pages/customers/AddCustomer";

// Invoice Pages
import InvoiceList from "./pages/invoices/InvoiceList";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import OverdueInvoices from "./pages/invoices/OverdueInvoices";

// Expense Pages
import ExpenseList from "./pages/expenses/ExpenseList";
import AddExpense from "./pages/expenses/AddExpense";
import ExpenseAnalytics from "./pages/expenses/ExpenseAnalytics";

// Report Pages
import ProfitLoss from "./pages/reports/ProfitLoss";
import SalesReport from "./pages/reports/SalesReport";
import CashFlow from "./pages/reports/CashFlow";
import InventoryReport from "./pages/reports/InventoryReport";

// Settings Pages
import Profile from "./pages/settings/Profile";
import Business from "./pages/settings/Business";
import Subscription from "./pages/settings/Subscription";

// Hooks
import { useAuth } from "./hooks/useAuth";

// Components
import Loading from "./components/ui/Loading";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/login" />;
};

// Page Transition Variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

function App() {
  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Home */}
            <Route
              index
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              }
            />

            {/* Analytics & AI */}
            <Route
              path="analytics"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <Analytics />
                </motion.div>
              }
            />
            <Route
              path="ai-insights"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <AIInsights />
                </motion.div>
              }
            />

            {/* Products */}
            <Route
              path="products"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <ProductList />
                </motion.div>
              }
            />
            <Route
              path="products/add"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <AddProduct />
                </motion.div>
              }
            />
            <Route
              path="products/:id"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <ProductDetail />
                </motion.div>
              }
            />
            <Route
              path="products/low-stock"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <LowStock />
                </motion.div>
              }
            />

            {/* Customers */}
            <Route
              path="customers"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <CustomerList />
                </motion.div>
              }
            />
            <Route
              path="customers/add"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <AddCustomer />
                </motion.div>
              }
            />
            <Route
              path="customers/:id"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <CustomerDetail />
                </motion.div>
              }
            />

            {/* Invoices */}
            <Route
              path="invoices"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <InvoiceList />
                </motion.div>
              }
            />
            <Route
              path="invoices/create"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <CreateInvoice />
                </motion.div>
              }
            />
            <Route
              path="invoices/:id"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <InvoiceDetail />
                </motion.div>
              }
            />
            <Route
              path="invoices/overdue"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <OverdueInvoices />
                </motion.div>
              }
            />

            {/* Expenses */}
            <Route
              path="expenses"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <ExpenseList />
                </motion.div>
              }
            />
            <Route
              path="expenses/add"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <AddExpense />
                </motion.div>
              }
            />
            <Route
              path="expenses/analytics"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <ExpenseAnalytics />
                </motion.div>
              }
            />

            {/* Reports */}
            <Route
              path="reports/profit-loss"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <ProfitLoss />
                </motion.div>
              }
            />
            <Route
              path="reports/sales"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <SalesReport />
                </motion.div>
              }
            />
            <Route
              path="reports/cashflow"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <CashFlow />
                </motion.div>
              }
            />
            <Route
              path="reports/inventory"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <InventoryReport />
                </motion.div>
              }
            />

            {/* Settings */}
            <Route
              path="settings/profile"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <Profile />
                </motion.div>
              }
            />
            <Route
              path="settings/business"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <Business />
                </motion.div>
              }
            />
            <Route
              path="settings/subscription"
              element={
                <motion.div variants={pageVariants} transition={pageTransition}>
                  <Subscription />
                </motion.div>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-white border border-gray-200 shadow-lg",
          style: {
            borderRadius: "12px",
            padding: "16px",
          },
          success: {
            iconTheme: {
              primary: "hsl(142, 71%, 45%)",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "hsl(0, 72%, 51%)",
              secondary: "white",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
