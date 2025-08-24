import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      { month: "Jan", sales: 45000, target: 50000 },
      { month: "Feb", sales: 52000, target: 55000 },
      { month: "Mar", sales: 48000, target: 50000 },
      { month: "Apr", sales: 61000, target: 60000 },
      { month: "May", sales: 55000, target: 58000 },
      { month: "Jun", sales: 67000, target: 65000 },
    ];
    setSalesData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading sales report...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3B82F6"
            strokeWidth={3}
            name="Actual Sales"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-xl font-bold text-blue-600">
            LKR{" "}
            {salesData
              .reduce((sum, item) => sum + item.sales, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Average Monthly</p>
          <p className="text-xl font-bold text-green-600">
            LKR{" "}
            {Math.round(
              salesData.reduce((sum, item) => sum + item.sales, 0) /
                salesData.length
            ).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Target Achievement</p>
          <p className="text-xl font-bold text-purple-600">
            {Math.round(
              (salesData.reduce((sum, item) => sum + item.sales, 0) /
                salesData.reduce((sum, item) => sum + item.target, 0)) *
                100
            )}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
