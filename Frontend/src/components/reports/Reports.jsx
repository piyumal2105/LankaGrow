import React, { useState, useEffect } from "react";
import { BarChart, Calendar, Download, TrendingUp } from "lucide-react";
import {
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import api from "../../services/api";

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.getProfitLoss(dateRange);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const expenseChartData =
    reportData?.expenseBreakdown?.map((exp) => ({
      name: exp._id,
      amount: exp.total,
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart size={28} />
          Financial Reports
        </h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Download size={20} />
          Export PDF
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Calendar className="text-gray-400" size={20} />
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    LKR {reportData?.totalRevenue?.toLocaleString() || "0"}
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    LKR {reportData?.totalExpenses?.toLocaleString() || "0"}
                  </p>
                </div>
                <TrendingUp className="text-red-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Net Profit
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      (reportData?.netProfit || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    LKR {reportData?.netProfit?.toLocaleString() || "0"}
                  </p>
                </div>
                <TrendingUp
                  className={`${
                    (reportData?.netProfit || 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                  size={32}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Profit Margin
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      (reportData?.profitMargin || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {reportData?.profitMargin?.toFixed(1) || "0"}%
                  </p>
                </div>
                <TrendingUp
                  className={`${
                    (reportData?.profitMargin || 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                  size={32}
                />
              </div>
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <Chart data={expenseChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" />
              </Chart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
