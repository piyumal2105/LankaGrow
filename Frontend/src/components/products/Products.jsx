import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  Barcode,
  Brain,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts({ page: 1, limit: 100 });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Demo data
      setProducts([
        {
          _id: "1",
          name: "Samsung Galaxy Smartphone",
          description: "Latest Android smartphone with advanced features",
          sku: "SKU-PHONE-001",
          category: "Electronics",
          unit: "pieces",
          purchasePrice: 85000,
          sellingPrice: 120000,
          currentStock: 15,
          minStockLevel: 10,
          status: "active",
          aiTags: ["smartphone", "electronics", "mobile"],
          profitMargin: 29.2,
        },
        {
          _id: "2",
          name: "Cotton T-Shirt",
          description: "Premium quality cotton t-shirt",
          sku: "SKU-SHIRT-002",
          category: "Clothing",
          unit: "pieces",
          purchasePrice: 800,
          sellingPrice: 1500,
          currentStock: 5,
          minStockLevel: 20,
          status: "active",
          aiTags: ["clothing", "cotton", "casual"],
          profitMargin: 46.7,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(
    (p) => p.currentStock <= p.minStockLevel
  );
  const totalValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );
  const avgProfitMargin =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.profitMargin || 0), 0) /
        products.length
      : 0;

  const categoryData = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = { name: category, count: 0, value: 0 };
    }
    acc[category].count += 1;
    acc[category].value += product.currentStock * product.sellingPrice;
    return acc;
  }, {});

  const chartData = Object.values(categoryData);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package size={28} />
          Inventory Management
        </h2>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                viewMode === "table" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Grid
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {products.length}
              </p>
            </div>
            <Package className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">
                LKR {totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Low Stock Items
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {lowStockProducts.length}
              </p>
            </div>
            <AlertTriangle className="text-orange-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg Profit Margin
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {avgProfitMargin.toFixed(1)}%
              </p>
            </div>
            <Brain className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
            <option value="Home & Garden">Home & Garden</option>
          </select>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-orange-600" size={20} />
            <h3 className="font-semibold text-orange-800">Low Stock Alert</h3>
          </div>
          <p className="text-orange-700 text-sm mb-2">
            {lowStockProducts.length} products are running low on stock:
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.slice(0, 5).map((product) => (
              <span
                key={product._id}
                className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm"
              >
                {product.name} ({product.currentStock} left)
              </span>
            ))}
            {lowStockProducts.length > 5 && (
              <span className="text-orange-600 text-sm">
                +{lowStockProducts.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Products Display */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <BarCode size={16} className="mr-1" />
                        {product.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          product.currentStock <= product.minStockLevel
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.currentStock} {product.unit}
                      </span>
                      {product.currentStock <= product.minStockLevel && (
                        <div className="text-xs text-red-500 flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          Low Stock
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        Sell: LKR {product.sellingPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Cost: LKR {product.purchasePrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          (product.profitMargin || 0) > 30
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {(product.profitMargin || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.aiTags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            <Brain size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                        {product.aiTags?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{product.aiTags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {product.description}
                  </p>
                </div>
                {product.currentStock <= product.minStockLevel && (
                  <AlertTriangle
                    size={20}
                    className="text-orange-500 flex-shrink-0"
                  />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span
                    className={`font-medium ${
                      product.currentStock <= product.minStockLevel
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.currentStock} {product.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    LKR {product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profit:</span>
                  <span className="font-medium text-green-600">
                    {(product.profitMargin || 0).toFixed(1)}%
                  </span>
                </div>
              </div>

              {product.aiTags && product.aiTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.aiTags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      <Brain size={8} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                  Update Stock
                </button>
                <button className="bg-gray-100 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-200">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default Products;
