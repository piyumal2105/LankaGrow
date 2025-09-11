import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, Plus, Search, Filter, Users } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import CustomerList from "../components/customers/CustomerList";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerAnalytics from "../components/customers/CustomerAnalytics";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { customerService } from "../services/customerService";
import { useDebounce } from "../hooks/useDebounce";

function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: customers,
    isLoading,
    refetch,
  } = useQuery(
    ["customers", { search: debouncedSearch, customerType: selectedType }],
    () =>
      customerService.getCustomers({
        search: debouncedSearch,
        customerType: selectedType,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { data: topCustomers } = useQuery(
    "top-customers",
    customerService.getTopCustomers
  );

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleFormClose = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
    refetch();
  };

  const customerTypes = ["All Types", "individual", "business"];

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
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-600">
                  Manage your customer relationships with AI insights
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowAnalytics(true)}
                className="flex items-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Analytics</span>
              </Button>
              <Button
                onClick={handleCreateCustomer}
                className="flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Customer</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Top Customers Summary */}
        {topCustomers?.data?.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Top Customers This Month
                </h3>
                <div className="flex items-center space-x-6 mt-2">
                  {topCustomers.data.slice(0, 3).map((customer) => (
                    <div
                      key={customer._id}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-blue-700">
                          Rs {customer.totalPurchases?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    e.target.value === "All Types" ? "" : e.target.value
                  )
                }
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {customerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "individual"
                      ? "Individual"
                      : type === "business"
                      ? "Business"
                      : type}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <CustomerList
            customers={customers?.data || []}
            isLoading={isLoading}
            onEdit={handleEditCustomer}
            onRefresh={refetch}
          />
        </main>
      </div>

      {/* Customer Form Modal */}
      <Modal
        isOpen={showCustomerForm}
        onClose={handleFormClose}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      </Modal>

      {/* Analytics Modal */}
      <Modal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        title="Customer Analytics"
        size="xl"
      >
        <CustomerAnalytics />
      </Modal>
    </div>
  );
}

export default CustomersPage;
