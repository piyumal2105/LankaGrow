import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery(
    [
      "products",
      {
        search: debouncedSearch,
        category: selectedCategory,
        status: selectedStatus,
      },
    ],
    () =>
      productService.getProducts({
        search: debouncedSearch,
        category: selectedCategory,
        status: selectedStatus,
      }),
    {
      keepPreviousData: true,
    }
  );

  const { data: lowStockProducts } = useQuery(
    "low-stock-products",
    productService.getLowStockProducts
  );

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
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">
                  Manage your product inventory with AI-powered insights
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

        {/* Low stock alert */}
        {lowStockProducts?.data?.length > 0 && (
          <div className="px-6 py-4">
            <LowStockAlert products={lowStockProducts.data} />
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value === "All Categories" ? "" : e.target.value
                  )
                }
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
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value === "All Status" ? "" : e.target.value
                  )
                }
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
            products={products?.data || []}
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
