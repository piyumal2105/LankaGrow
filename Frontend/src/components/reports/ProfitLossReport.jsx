import React, { useState, useEffect } from "react";
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

const ProfitLossReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await api.getProfitLoss(dateRange);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching P&L report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Profit & Loss Report</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              LKR {reportData?.totalRevenue?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              LKR {reportData?.totalExpenses?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Net Profit</p>
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
        </div>

        {reportData?.expenseBreakdown && (
          <div>
            <h4 className="text-md font-semibold mb-3">Expense Breakdown</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.expenseBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLossReport;
