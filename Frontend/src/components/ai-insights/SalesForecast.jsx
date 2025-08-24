import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesForecast = ({ forecastData, confidence, trend }) => {
  const chartData = [
    { period: "Last Month", actual: 98000, predicted: null },
    { period: "This Month", actual: 112000, predicted: null },
    { period: "Next Month", actual: null, predicted: forecastData || 125000 },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={24} />
        <h2 className="text-xl font-semibold">AI Sales Forecast</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <p className="text-blue-100">Predicted Amount</p>
          <p className="text-3xl font-bold">
            LKR {(forecastData || 125000).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-blue-100">Confidence Level</p>
          <p className="text-3xl font-bold">
            {Math.round((confidence || 0.87) * 100)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-blue-100">Trend</p>
          <p className="text-3xl font-bold capitalize">
            {trend || "Increasing"}
          </p>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ffffff"
              strokeWidth={3}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesForecast;
