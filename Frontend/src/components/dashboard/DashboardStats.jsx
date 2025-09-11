import React from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Package,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

function DashboardStats() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery("dashboard-stats", reportService.getDashboardStats, {
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const statsData = [
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.data?.monthlyRevenue || 0),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Total Customers",
      value: stats?.data?.totalCustomers || 0,
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Low Stock Items",
      value: stats?.data?.lowStockProducts || 0,
      change: "-5.1%",
      trend: "down",
      icon: Package,
      color: stats?.data?.lowStockProducts > 0 ? "red" : "green",
    },
    {
      title: "Pending Invoices",
      value: stats?.data?.pendingInvoices || 0,
      change: "+3.2%",
      trend: "up",
      icon: FileText,
      color: "yellow",
    },
  ];

  const colorClasses = {
    green: {
      bg: "bg-green-100",
      icon: "text-green-600",
      text: "text-green-600",
    },
    blue: {
      bg: "bg-blue-100",
      icon: "text-blue-600",
      text: "text-blue-600",
    },
    red: {
      bg: "bg-red-100",
      icon: "text-red-600",
      text: "text-red-600",
    },
    yellow: {
      bg: "bg-yellow-100",
      icon: "text-yellow-600",
      text: "text-yellow-600",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  from last month
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl ${
                colorClasses[stat.color].bg
              } flex items-center justify-center`}
            >
              <stat.icon
                className={`w-6 h-6 ${colorClasses[stat.color].icon}`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStats;
