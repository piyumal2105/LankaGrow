import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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

  // Add URL parameter handling
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Handle URL filter parameter
  useEffect(() => {
    if (filterParam === "vip-customers") {
      // You can optionally set some visual indicator that we're filtering
      // or leave the filters as they are since we'll handle this in the query
    }
  }, [filterParam]);

  const {
    data: customersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "customers",
      {
        search: debouncedSearch,
        customerType: selectedType,
        filter: filterParam, // Include the URL filter parameter
      },
    ],
    queryFn: () =>
      customerService.getCustomers({
        search: debouncedSearch,
        customerType: selectedType,
        filter: filterParam, // Pass filter to the service
      }),
  });

  const { data: topCustomersResponse } = useQuery({
    queryKey: ["top-customers"],
    queryFn: customerService.getTopCustomers,
  });

  // Debug logging
  console.log("Customers response:", customersResponse);
  console.log("Top customers response:", topCustomersResponse);
  console.log("Error:", error);
  console.log("Filter param:", filterParam);

  // Safely extract the customers array from the response
  const getCustomersArray = () => {
    if (!customersResponse) return [];

    // Handle different API response structures
    if (Array.isArray(customersResponse)) {
      return customersResponse;
    }

    if (customersResponse.data && Array.isArray(customersResponse.data)) {
      return customersResponse.data;
    }

    if (
      customersResponse.customers &&
      Array.isArray(customersResponse.customers)
    ) {
      return customersResponse.customers;
    }

    // If none of the above, return empty array
    console.warn("Unexpected customers response structure:", customersResponse);
    return [];
  };

  const getTopCustomersArray = () => {
    if (!topCustomersResponse) return [];

    if (Array.isArray(topCustomersResponse)) {
      return topCustomersResponse;
    }

    if (topCustomersResponse.data && Array.isArray(topCustomersResponse.data)) {
      return topCustomersResponse.data;
    }

    return [];
  };

  let customers = getCustomersArray();
  const topCustomers = getTopCustomersArray();

  // Client-side filtering for VIP customers if backend doesn't support it
  if (filterParam === "vip-customers" && customers.length > 0) {
    customers = customers.filter(
      (customer) => customer.totalPurchases > 100000
    );
  }

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

  // Clear URL filter when user changes other filters
  const handleTypeChange = (value) => {
    setSelectedType(value === "All Types" ? "" : value);
    // Clear the URL filter when user manually changes filters
    if (filterParam) {
      setSearchParams({});
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Clear the URL filter when user manually searches
    if (filterParam && value) {
      setSearchParams({});
    }
  };

  const customerTypes = ["All Types", "individual", "business"];

  // Handle error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 lg:ml-80">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Customers
              </h2>
              <p className="text-gray-600 mb-4">
                {error.message || "Something went wrong"}
              </p>
              <Button onClick={refetch}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-600">
                  Manage your customer relationships with AI insights
                  {filterParam === "vip-customers" && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Showing VIP Customers
                    </span>
                  )}
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

        {/* Top Customers Summary - hide when already filtering */}
        {!filterParam && topCustomers.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Top Customers This Month
                </h3>
                <div className="flex items-center space-x-6 mt-2">
                  {topCustomers.slice(0, 3).map((customer) => (
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

        {/* Clear filter button when filtering */}
        {filterParam && (
          <div className="px-6 py-2">
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Clear filter and show all customers
            </button>
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
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
            customers={customers}
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
