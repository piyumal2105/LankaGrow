import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  AlertTriangle,
  FileText,
  TrendingUp,
  Package,
  CreditCard,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const salesData = [
    { month: "Jan", sales: 45000, expenses: 32000 },
    { month: "Feb", sales: 52000, expenses: 28000 },
    { month: "Mar", sales: 48000, expenses: 35000 },
    { month: "Apr", sales: 61000, expenses: 40000 },
    { month: "May", sales: 55000, expenses: 38000 },
    { month: "Jun", sales: 67000, expenses: 42000 },
  ];

  const categoryData = [
    { name: "Electronics", value: 400, color: "#3B82F6" },
    { name: "Clothing", value: 300, color: "#10B981" },
    { name: "Food", value: 300, color: "#F59E0B" },
    { name: "Books", value: 200, color: "#EF4444" },
  ];

  const statCards = [
    {
      title: "Monthly Revenue",
      value: `LKR ${stats?.monthlyRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || "0",
      icon: Users,
      color: "bg-blue-500",
      change: "+8.2%",
      changeType: "positive",
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockProducts || "0",
      icon: AlertTriangle,
      color: "bg-orange-500",
      change: "-15%",
      changeType: "negative",
    },
    {
      title: "Pending Invoices",
      value: stats?.pendingInvoices || "0",
      icon: FileText,
      color: "bg-purple-500",
      change: "+3.1%",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-blue-100">
              Track your business performance and growth
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Today</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales & Expenses Trend
            </h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Sales</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Product Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stats?.recentInvoices?.slice(0, 5).map((invoice) => (
              <div
                key={invoice._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.customer?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    LKR {invoice.totalAmount?.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <Package className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add Product</p>
              <p className="text-xs text-gray-500">Quick inventory add</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
              <FileText className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <p className="font-medium text-gray-900">New Invoice</p>
              <p className="text-xs text-gray-500">Create & send</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
              <Users className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Add Customer</p>
              <p className="text-xs text-gray-500">Expand network</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors group">
              <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-yellow-600 mb-2" />
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Business insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
