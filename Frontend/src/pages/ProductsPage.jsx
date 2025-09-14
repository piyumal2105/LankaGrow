import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"; // Add this import
import { Menu, Plus, Search, Filter } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import ProductList from "../components/products/ProductList";
import ProductForm from "../components/products/ProductForm";
import LowStockAlert from "../components/products/LowStockAlert";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { productService } from "../services/productService";
import { useDebounce } from "../hooks/useDebounce";

function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Add URL parameter handling
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Handle URL filter parameter
  useEffect(() => {
    if (filterParam === "low-stock") {
      // You can optionally set some visual indicator that we're filtering
      // or leave the filters as they are since we'll handle this in the query
    }
  }, [filterParam]);

  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "products",
      {
        search: debouncedSearch,
        category: selectedCategory,
        status: selectedStatus,
        filter: filterParam, // Include the URL filter parameter
      },
    ],
    queryFn: () =>
      productService.getProducts({
        search: debouncedSearch,
        category: selectedCategory,
        status: selectedStatus,
        filter: filterParam, // Pass filter to the service
      }),
  });

  const { data: lowStockResponse } = useQuery({
    queryKey: ["low-stock-products"],
    queryFn: productService.getLowStockProducts,
  });

  // Debug logging
  console.log("Products response:", productsResponse);
  console.log("Error:", error);
  console.log("Filter param:", filterParam);

  // Safely extract the products array from the response
  const getProductsArray = () => {
    if (!productsResponse) return [];

    // Handle different API response structures
    if (Array.isArray(productsResponse)) {
      return productsResponse;
    }

    if (productsResponse.data && Array.isArray(productsResponse.data)) {
      return productsResponse.data;
    }

    if (productsResponse.products && Array.isArray(productsResponse.products)) {
      return productsResponse.products;
    }

    // If none of the above, return empty array
    console.warn("Unexpected products response structure:", productsResponse);
    return [];
  };

  const getLowStockArray = () => {
    if (!lowStockResponse) return [];

    if (Array.isArray(lowStockResponse)) {
      return lowStockResponse;
    }

    if (lowStockResponse.data && Array.isArray(lowStockResponse.data)) {
      return lowStockResponse.data;
    }

    return [];
  };

  let products = getProductsArray();
  const lowStockProducts = getLowStockArray();

  // Client-side filtering for low-stock if backend doesn't support it
  if (filterParam === "low-stock" && products.length > 0) {
    products = products.filter(
      (product) => product.currentStock <= product.minStockLevel
    );
  }

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    refetch();
  };

  // Clear URL filter when user changes other filters
  const handleCategoryChange = (value) => {
    setSelectedCategory(value === "All Categories" ? "" : value);
    // Clear the URL filter when user manually changes filters
    if (filterParam) {
      setSearchParams({});
    }
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value === "All Status" ? "" : value);
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

  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Food & Beverage",
    "Books",
    "Home & Garden",
    "Sports",
    "Automotive",
    "Health & Beauty",
    "Other",
  ];

  const statuses = ["All Status", "active", "inactive"];

  // Handle error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 lg:ml-80">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Products
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
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">
                  Manage your product inventory with AI-powered insights
                  {filterParam === "low-stock" && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Showing Low Stock Items
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateProduct}
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Button>
          </div>
        </header>

        {/* Low stock alert - hide when already filtering for low stock */}
        {!filterParam && lowStockProducts.length > 0 && (
          <div className="px-6 py-4">
            <LowStockAlert products={lowStockProducts} />
          </div>
        )}

        {/* Clear filter button when filtering */}
        {filterParam && (
          <div className="px-6 py-2">
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Clear filter and show all products
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <ProductList
            products={products}
            isLoading={isLoading}
            onEdit={handleEditProduct}
            onRefresh={refetch}
          />
        </main>
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showProductForm}
        onClose={handleFormClose}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      </Modal>
    </div>
  );
}

export default ProductsPage;
